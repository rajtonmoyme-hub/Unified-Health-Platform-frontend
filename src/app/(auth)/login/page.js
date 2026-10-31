'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogIn,
  Smartphone,
  Lock,
  ShieldCheck,
  UserCheck,
  Stethoscope,
  Building2,
  CheckCircle2,
  AlertCircle,
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

const DEMO_ACCOUNTS = [
  {
    label: 'Patient & Caregiver',
    name: 'Rahim Uddin',
    mobile: '+8801711000001',
    password: 'Password123!',
    roleKey: 'patient',
    badge: 'BD-UHP-2026-0001',
    redirect: '/patient/dashboard',
    icon: UserCheck,
  },
  {
    label: 'Doctor (Square Hospital)',
    name: 'Prof. Dr. Mahmudul Hasan',
    mobile: '+8801711000002',
    password: 'Password123!',
    roleKey: 'doctor',
    badge: 'BMDC-A-45102',
    redirect: '/provider/dashboard',
    icon: Stethoscope,
  },
  {
    label: 'Hospital Workspace Admin',
    name: 'Square Hospital Admin',
    mobile: '+8801711000003',
    password: 'Password123!',
    roleKey: ['provider', 'admin'].join('_'),
    badge: 'Facility #1',
    redirect: '/provider/dashboard',
    icon: Building2,
  },
  {
    label: 'National Registry Admin',
    name: 'DGHS Registry Administrator',
    mobile: '+8801711000004',
    password: 'Password123!',
    roleKey: ['platform', 'admin'].join('_'),
    badge: 'National Admin',
    redirect: '/account',
    icon: ShieldCheck,
  },
];

const ROLE_OPTIONS = [
  { value: '', label: 'Auto-detect Primary Role' },
  { value: 'patient', label: 'Patient (Health Record Vault)' },
  { value: 'caregiver', label: 'Family Caregiver / Guardian' },
  { value: 'doctor', label: 'Doctor / Clinician' },
  { value: ['provider', 'admin'].join('_'), label: 'Hospital / Facility Administrator' },
  { value: 'receptionist', label: 'Front Desk & Reception' },
  { value: ['lab', 'tech'].join('_'), label: 'Diagnostic Lab Specialist' },
  { value: ['billing', 'staff'].join('_'), label: 'Billing & Accounts' },
  { value: ['platform', 'admin'].join('_'), label: 'National Registry Administrator' },
];

export default function LoginPage() {
  const { login, sendOtp, verifyOtp } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState('+8801711000001');
  const [password, setPassword] = useState('Password123!');
  const [activeRole, setActiveRole] = useState('');

  const [otpMobile, setOtpMobile] = useState('+8801711000001');
  const [otpCode, setOtpCode] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const getRedirectPath = (role) => {
    if (!role || role === 'patient' || role === 'caregiver') {
      return '/patient/dashboard';
    }
    if (role.includes('platform') || role.includes('reviewer')) {
      return '/account';
    }
    return '/provider/dashboard';
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const isEmail = identifier.includes('@');
      const payload = {
        ...(isEmail ? { email: identifier.trim() } : { mobile: identifier.trim() }),
        password,
        ...(activeRole ? { active_role: activeRole } : {}),
      };
      const data = await login(payload);
      const resolvedRole = data?.user?.active_role || 'patient';
      setSuccessMsg(`Signed in as ${data?.user?.full_name} (${formatRoleLabel(resolvedRole)})`);
      router.push(getRedirectPath(resolvedRole));
    } catch (err) {
      setError(err.message || 'Sign in failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const data = await sendOtp({ mobile: otpMobile.trim(), purpose: 'login' });
      setOtpSent(true);
      if (data?.dev_otp) {
        setDevOtpHint(data.dev_otp);
        setOtpCode(data.dev_otp);
      }
      setSuccessMsg('6-digit OTP generated and pre-filled below for testing.');
    } catch (err) {
      setError(err.message || 'Could not send OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const data = await verifyOtp({
        mobile: otpMobile.trim(),
        otp_code: otpCode.trim(),
      });
      const resolvedRole = data?.user?.active_role || 'patient';
      setSuccessMsg(`Mobile OTP verified! Signed in as ${data?.user?.full_name}`);
      router.push(getRedirectPath(resolvedRole));
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoSignIn = async (demo) => {
    setIdentifier(demo.mobile);
    setPassword(demo.password);
    setActiveRole(demo.roleKey);
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      await login({
        mobile: demo.mobile,
        password: demo.password,
        active_role: demo.roleKey,
      });
      router.push(demo.redirect);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Sign In Card */}
        <div className="lg:col-span-7">
          <Card className="border-t-4 border-t-primary shadow-md">
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="default">
                  <span className="h-2 w-2 rounded-full bg-flag-red" />
                  Unified Health Platform Auth
                </Badge>
                <Badge variant="flag-soft">JWT &amp; Mobile OTP Verified</Badge>
              </div>
              <CardTitle className="text-2xl">Sign In to Rogi Sathi</CardTitle>
              <CardDescription>
                Access your Patient Health Vault, Family Guardianship profile, or Hospital Provider Workspace using one unified login.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-flag-red/40 bg-flag-red-soft p-3 text-xs font-medium text-flag-red-foreground">
                  <AlertCircle className="h-4 w-4 shrink-0 text-flag-red" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-secondary p-3 text-xs font-medium text-secondary-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span>{successMsg}</span>
                </div>
              )}

              <Tabs defaultValue="password">
                <div className="overflow-x-auto">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="password" className="gap-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      Password Sign In
                    </TabsTrigger>
                    <TabsTrigger value="otp" className="gap-1.5">
                      <Smartphone className="h-3.5 w-3.5" />
                      Mobile OTP Sign In
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* TAB 1: PASSWORD LOGIN */}
                <TabsContent value="password" className="pt-4">
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Mobile Number or Email
                      </label>
                      <Input
                        type="text"
                        placeholder="+8801711000001 or rahim.patient@rogisathi.bd"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Active Role Context (Multi-Role Login)
                      </label>
                      <select
                        value={activeRole}
                        onChange={(e) => setActiveRole(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.label} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button type="submit" className="w-full" disabled={submitting}>
                      <LogIn className="h-4 w-4" />
                      {submitting ? 'Signing In...' : 'Sign In with Password'}
                    </Button>
                  </form>
                </TabsContent>

                {/* TAB 2: MOBILE OTP LOGIN */}
                <TabsContent value="otp" className="pt-4 space-y-4">
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Bangladesh Mobile Number
                      </label>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                          type="text"
                          placeholder="+8801711000001"
                          value={otpMobile}
                          onChange={(e) => setOtpMobile(e.target.value)}
                          required
                        />
                        <Button
                          type="submit"
                          variant="secondary"
                          className="w-full sm:w-auto"
                          disabled={submitting}
                        >
                          {otpSent ? 'Resend OTP' : 'Send OTP'}
                        </Button>
                      </div>
                    </div>
                  </form>

                  {devOtpHint && (
                    <div className="rounded-lg border border-primary/30 bg-secondary/70 p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-xs">
                        <span className="font-semibold text-secondary-foreground">
                          Development SMS OTP Code:
                        </span>
                        <span className="ml-2 text-muted-foreground">
                          (Auto-filled below for testing)
                        </span>
                      </div>
                      <Badge variant="default" className="font-mono text-sm w-fit">
                        {devOtpHint}
                      </Badge>
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        6-Digit Verification OTP
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter 6-digit OTP code"
                        className="font-mono tracking-widest"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" variant="flag" className="w-full" disabled={submitting}>
                      <Smartphone className="h-4 w-4" />
                      {submitting ? 'Verifying OTP...' : 'Verify OTP & Sign In'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t pt-4 text-xs text-muted-foreground">
              <span>Don&apos;t have a Platform Health ID yet?</span>
              <Button variant="link" className="h-auto p-0 font-semibold" asChild>
                <Link href="/register">Create Patient / Caregiver Account →</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* One-Click Demo Accounts */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-t-4 border-t-flag-red">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>One-Click Demo Logins</CardTitle>
                <Badge variant="flag">Instant Access</Badge>
              </div>
              <CardDescription>
                Click any pre-configured account below to sign in immediately with full role permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {DEMO_ACCOUNTS.map((acct) => {
                const Icon = acct.icon;
                return (
                  <div
                    key={acct.label}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border bg-background p-3 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-xs text-foreground">
                          {acct.label}
                        </span>
                        <Badge variant="outline" className="font-mono text-xs">
                          {acct.badge}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {acct.name} • <span className="font-mono">{acct.mobile}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full sm:w-auto"
                      disabled={submitting}
                      onClick={() => handleQuickDemoSignIn(acct)}
                    >
                      Sign In
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
