import { API_BASE_URL } from '../lib/constants';

export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'uhp_access_token',
  REFRESH_TOKEN: 'uhp_refresh_token',
  USER: 'uhp_user',
};

export function getStoredAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
}

export function getStoredRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeAuthSession({ accessToken, refreshToken, user }) {
  if (typeof window === 'undefined') return;
  if (accessToken) {
    localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
  if (user) {
    localStorage.setItem(TOKEN_STORAGE_KEYS.USER, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.USER);
}

export async function apiFetch(endpoint, options = {}) {
  const accessToken = getStoredAccessToken();
  const storedUser = getStoredUser();

  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(storedUser?.active_provider_id
      ? { 'x-provider-id': String(storedUser.active_provider_id) }
      : {}),
    ...(options.headers || {}),
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Automatically attempt token refresh on 401 if a refreshToken exists and this isn't already an auth login/refresh call
  if (
    response.status === 401 &&
    !endpoint.includes('/auth/login') &&
    !endpoint.includes('/auth/refresh') &&
    !endpoint.includes('/auth/pin')
  ) {
    const refreshToken = getStoredRefreshToken();
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (refreshRes.ok) {
          const refreshPayload = await refreshRes.json();
          if (refreshPayload?.data?.accessToken) {
            storeAuthSession(refreshPayload.data);
            response = await fetch(`${API_BASE_URL}${endpoint}`, {
              ...options,
              headers: {
                ...headers,
                Authorization: `Bearer ${refreshPayload.data.accessToken}`,
              },
            });
          }
        } else {
          clearAuthSession();
        }
      } catch {
        clearAuthSession();
      }
    }
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || `API Error: ${response.status}`);
  }
  return payload;
}
