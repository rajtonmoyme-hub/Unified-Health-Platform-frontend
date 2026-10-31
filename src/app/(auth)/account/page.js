'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  KeyRound,
  RefreshCw,
  Laptop,
  LogOut,
  Users,
  CheckCircle2,
  AlertCircle,
  Lock,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatRoleLabel } from '@/components/layout/Navbar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const STAFF_ROLES = [
  { value: 'doctor', label: 'Doctor / Clinician' },
  { value: 'receptionist', label: 'Front Desk & Reception' },
  { value: ['lab', 'tech'].join('_'), label: 'Diagnostic Lab Specialist' },
  { value: ['billing', 'staff'].join('_'), label: 'Billing & Accounts' },
  { value: ['provider', 'admin'].join('_'), label: 'Hospital Workspace Admin' },
];

export default function AccountSecurityPage() {
  const {
    user,
    isAuthenticated,
    loading,
    switchContext,
    managePin,
    changePassword,
    assignStaff,
    fetchSessions,
    revokeSession,
    logout,
  } = useAuth();
  const router = useRouter();

  const [sessions, setSessions] = useState([]);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [busy, setBusy] = useState(false);

  const [pinAction, setPinAction] = useState('set');
  const [pinValue, setPinValue] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [staffForm, setStaffForm] = useState({
    provider_id: 1,
    mobile: '+8801711554433',
    email: 'lab.specialist@squarehospital.bd',
    full_name: 'Kamrul Islam',
    password: 'Password123!',
    role_code: ['lab', 'tech'].join('_'),
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchSessions()
        .then(setSessions)
        .catch(() => setSessions([]));
    }
  }, [isAuthenticated, fetchSessions]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 text-center text-muted-foreground">
        Loading authenticated profile...
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <Card className="border-t-4 border-t-flag-red">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to inspect your session, switch roles, configure your PIN lock, or manage active device sessions.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:w-auto" asChild>
              <Link href="/login">Go to Sign In</Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  const handleRoleSwitch = async (roleCode, providerId = null) => {
    setFeedback({ type: '', message: '' });
    setBusy(true);
    try {
      await switchContext({ role: roleCode, provider_id: providerId });
      setFeedback({
        type: 'success',
        message: `Switched active context to "${formatRoleLabel(roleCode)}"${providerId ? ` (Facility #${providerId})` : ''}`,
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setBusy(false);
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    setBusy(true);
    try {
      await managePin({ action: pinValue ? pinAction : 'set', pin: pinValue });
      setFeedback({
        type: 'success',
        message:
          pinAction === 'verify'
            ? 'App PIN lock verified successfully!'
            : '4–6 digit App PIN lock saved to your profile.',
      });
      setPinValue('');
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    setBusy(true);
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setFeedback({ type: 'success', message: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setBusy(false);
    }
  };

  const handleAssignStaff = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    setBusy(true);
    try {
      const assigned = await assignStaff(staffForm);
      setFeedback({
        type: 'success',
        message: `Assigned ${assigned.full_name} (${assigned.mobile}) to Facility #${staffForm.provider_id}`,
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setBusy(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    setFeedback({ type: '', message: '' });
    try {
      await revokeSession(sessionId);
      const updated = await fetchSessions();
      setSessions(updated);
      setFeedback({
        type: 'success',
        message: `Session #${sessionId} revoked remotely.`,
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleLogoutAll = async () => {
    await logout(true);
    router.push('/login');
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      {/* Top Profile Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-secondary/60 p-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">Active Role: {formatRoleLabel(user.active_role)}</Badge>
            {user.active_provider_id && (
              <Badge variant="flag-soft">Facility #{user.active_provider_id}</Badge>
            )}
            {user.is_mobile_verified && <Badge variant="secondary">✓ Mobile Verified</Badge>}
            {user.has_pin_lock && <Badge variant="flag">PIN Lock Active</Badge>}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{user.full_name}</h1>
          <p className="text-xs text-muted-foreground font-mono">
            Mobile: {user.mobile}
            {user.email ? ` • Email: ${user.email}` : ''}
            {user.patient_profile?.health_id
              ? ` • Health ID: ${user.patient_profile.health_id}`
              : ''}
            {user.doctor_profile?.bmdc_reg_number
              ? ` • BMDC: ${user.doctor_profile.bmdc_reg_number}`
              : ''}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => logout(false).then(() => router.push('/login'))}
          >
            <LogOut className="h-4 w-4" />
            Sign Out This Device
          </Button>
          <Button
            variant="flag"
            size="sm"
            className="w-full sm:w-auto"
            onClick={handleLogoutAll}
          >
            Revoke All Devices
          </Button>
        </div>
      </div>

      {feedback.message && (
        <div
          className={`flex items-center gap-2 rounded-lg border p-3 text-xs font-medium ${
            feedback.type === 'error'
              ? 'border-flag-red/40 bg-flag-red-soft text-flag-red-foreground'
              : 'border-primary/30 bg-secondary text-secondary-foreground'
          }`}
        >
          {feedback.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-flag-red" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <Tabs defaultValue="context">
        <div className="overflow-x-auto pb-1">
          <TabsList className="inline-flex w-max min-w-full sm:w-auto gap-1">
            <TabsTrigger value="context">1. Role &amp; Workspace Switcher</TabsTrigger>
            <TabsTrigger value="security">2. App PIN Lock &amp; Password</TabsTrigger>
            <TabsTrigger value="sessions">3. Active Device Sessions</TabsTrigger>
            <TabsTrigger value="staff">4. Facility Staff Onboarding</TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: ROLE SWITCHING & PERMISSIONS */}
        <TabsContent value="context" className="pt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle>Switch Active Role or Facility</CardTitle>
                <CardDescription>
                  One login supports multiple roles (e.g., Patient + Caregiver, or Doctor across facilities). Click any assigned role below to switch context.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase">
                  Patient &amp; Global Roles
                </div>
                <div className="flex flex-wrap gap-2">
                  {(user.global_roles?.length ? user.global_roles : ['patient']).map((rCode) => (
                    <Button
                      key={rCode}
                      size="sm"
                      variant={user.active_role === rCode ? 'default' : 'outline'}
                      disabled={busy}
                      onClick={() => handleRoleSwitch(rCode, null)}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Switch to: {formatRoleLabel(rCode)}
                    </Button>
                  ))}
                </div>

                {user.provider_memberships?.length > 0 && (
                  <>
                    <div className="text-xs font-semibold text-muted-foreground uppercase pt-2">
                      Assigned Hospital &amp; Diagnostic Workspaces
                    </div>
                    <div className="space-y-2">
                      {user.provider_memberships.map((m, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-foreground">
                              {m.provider_name} (Facility #{m.provider_id})
                            </div>
                            <div className="text-muted-foreground">
                              Role: {m.role_name}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={
                              user.active_role === m.role_code &&
                              user.active_provider_id === m.provider_id
                                ? 'default'
                                : 'secondary'
                            }
                            className="w-full sm:w-auto"
                            disabled={busy}
                            onClick={() => handleRoleSwitch(m.role_code, m.provider_id)}
                          >
                            Activate Workspace
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-flag-red">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Role Privileges</CardTitle>
                  <Badge variant="flag">{user.permissions?.length || 0} Permissions</Badge>
                </div>
                <CardDescription>
                  Authorized capabilities for your current active role ({formatRoleLabel(user.active_role)}).
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {(user.permissions || []).map((perm) => (
                  <Badge key={perm} variant="outline" className="font-mono text-xs">
                    {perm}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: PIN LOCK & PASSWORD */}
        <TabsContent value="security" className="pt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mobile App PIN Lock</CardTitle>
                  <Badge variant={user.has_pin_lock ? 'default' : 'secondary'}>
                    {user.has_pin_lock ? 'PIN Active' : 'Not Configured'}
                  </Badge>
                </div>
                <CardDescription>
                  Set or verify a 4 to 6 digit quick-unlock PIN to protect your health records if your phone is shared or unlocked.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePinSubmit} className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={pinAction === 'set' ? 'default' : 'outline'}
                      onClick={() => setPinAction('set')}
                    >
                      Set / Update PIN
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={pinAction === 'verify' ? 'flag' : 'outline'}
                      onClick={() => setPinAction('verify')}
                    >
                      Test Verify PIN
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      4–6 Digit Numeric PIN
                    </label>
                    <Input
                      type="password"
                      maxLength={6}
                      placeholder="e.g. 2580"
                      className="font-mono tracking-widest"
                      value={pinValue}
                      onChange={(e) => setPinValue(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto" disabled={busy}>
                    <KeyRound className="h-4 w-4" />
                    {pinAction === 'verify' ? 'Verify PIN Now' : 'Save PIN Lock'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle>Change Account Password</CardTitle>
                <CardDescription>
                  Update your account password securely.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      New Password (min 6 chars)
                    </label>
                    <Input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto" disabled={busy}>
                    <Lock className="h-4 w-4" />
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: ACTIVE SESSIONS & REMOTE REVOKE */}
        <TabsContent value="sessions" className="pt-4">
          <Card className="border-t-4 border-t-flag-red">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Active &amp; Recent Login Sessions</CardTitle>
                <CardDescription>
                  If your phone or laptop is lost, revoke any session remotely to invalidate its refresh token immediately.
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => fetchSessions().then(setSessions)}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh List
              </Button>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Laptop className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground flex flex-wrap items-center gap-2">
                        <span>Session #{s.id}</span>
                        <Badge variant="outline">
                          Role: {formatRoleLabel(s.active_role)}
                        </Badge>
                        {s.is_revoked ? (
                          <Badge variant="flag-soft">Revoked</Badge>
                        ) : (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground mt-0.5">
                        Created: {new Date(s.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {!s.is_revoked && (
                    <Button
                      size="sm"
                      variant="flag"
                      className="w-full sm:w-auto"
                      onClick={() => handleRevokeSession(s.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Revoke Session
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: PROVIDER STAFF ONBOARDING */}
        <TabsContent value="staff" className="pt-4">
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>Assign Staff to Hospital Workspace</CardTitle>
                <Badge variant="flag-soft">Admin Access Required</Badge>
              </div>
              <CardDescription>
                Create or link staff accounts (Doctor, Front Desk, Lab Specialist, Billing) scoped to a hospital or diagnostic center workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssignStaff} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Provider Facility ID
                  </label>
                  <Input
                    type="number"
                    value={staffForm.provider_id}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, provider_id: Number(e.target.value) })
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Staff Department Role
                  </label>
                  <select
                    value={staffForm.role_code}
                    onChange={(e) => setStaffForm({ ...staffForm, role_code: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                  >
                    {STAFF_ROLES.map((sr) => (
                      <option key={sr.label} value={sr.value}>
                        {sr.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Staff Full Name
                  </label>
                  <Input
                    value={staffForm.full_name}
                    onChange={(e) => setStaffForm({ ...staffForm, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Staff Mobile Number
                  </label>
                  <Input
                    value={staffForm.mobile}
                    onChange={(e) => setStaffForm({ ...staffForm, mobile: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Staff Email
                  </label>
                  <Input
                    type="email"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Initial Password (if new user)
                  </label>
                  <Input
                    type="password"
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Button type="submit" className="w-full sm:w-auto" disabled={busy}>
                    <Users className="h-4 w-4" />
                    Assign Staff Member to Workspace
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
