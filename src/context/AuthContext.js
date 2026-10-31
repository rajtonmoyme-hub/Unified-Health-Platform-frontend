'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  apiFetch,
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredUser,
  storeAuthSession,
  clearAuthSession,
} from '@/services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncFromStorage = useCallback(async () => {
    const token = getStoredAccessToken();
    const cachedUser = getStoredUser();

    if (!token) {
      setUser(null);
      setAccessToken(null);
      setLoading(false);
      return;
    }

    setAccessToken(token);
    if (cachedUser) {
      setUser(cachedUser);
    }

    try {
      const res = await apiFetch('/api/v1/auth/me');
      if (res?.data?.user) {
        setUser(res.data.user);
        storeAuthSession({ user: res.data.user });
      }
    } catch {
      clearAuthSession();
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncFromStorage();
  }, [syncFromStorage]);

  const applyAuthData = (data) => {
    if (!data) return;
    storeAuthSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    });
    if (data.accessToken) setAccessToken(data.accessToken);
    if (data.user) setUser(data.user);
  };

  const register = async (payload) => {
    const res = await apiFetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    applyAuthData(res.data);
    return res.data;
  };

  const sendOtp = async ({ mobile, purpose = 'login' }) => {
    const res = await apiFetch('/api/v1/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ mobile, purpose }),
    });
    return res.data;
  };

  const verifyOtp = async ({ mobile, otp_code, full_name }) => {
    const res = await apiFetch('/api/v1/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp_code, full_name }),
    });
    applyAuthData(res.data);
    return res.data;
  };

  const login = async (payload) => {
    const res = await apiFetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    applyAuthData(res.data);
    return res.data;
  };

  const switchContext = async ({ role, provider_id }) => {
    const res = await apiFetch('/api/v1/auth/switch-context', {
      method: 'POST',
      body: JSON.stringify({ role, provider_id }),
    });
    applyAuthData(res.data);
    return res.data;
  };

  const changePassword = async ({ current_password, new_password }) => {
    const res = await apiFetch('/api/v1/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ current_password, new_password }),
    });
    return res.data;
  };

  const managePin = async ({ action, pin }) => {
    const res = await apiFetch('/api/v1/auth/pin', {
      method: 'POST',
      body: JSON.stringify({ action, pin }),
    });
    await syncFromStorage();
    return res.data;
  };

  const assignStaff = async (payload) => {
    const res = await apiFetch('/api/v1/auth/staff/assign', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  };

  const fetchSessions = async () => {
    const res = await apiFetch('/api/v1/auth/sessions');
    return res.data || [];
  };

  const revokeSession = async (sessionId) => {
    const res = await apiFetch(`/api/v1/auth/sessions/${sessionId}`, {
      method: 'DELETE',
    });
    return res.data;
  };

  const logout = async (allDevices = false) => {
    try {
      const refreshToken = getStoredRefreshToken();
      await apiFetch('/api/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken,
          all_devices: allDevices,
        }),
      });
    } catch {
      // Ignore network errors during logout cleanup
    } finally {
      clearAuthSession();
      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: Boolean(user && accessToken),
        loading,
        register,
        sendOtp,
        verifyOtp,
        login,
        switchContext,
        changePassword,
        managePin,
        assignStaff,
        fetchSessions,
        revokeSession,
        logout,
        refreshProfile: syncFromStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return ctx;
}
