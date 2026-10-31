'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
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

export default function RegisterPage() {
  const { register, verifyOtp } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: '',
    mobile: '+88017',
    email: '',
    password: '',
    role: 'patient',
    nid_number: '',
    date_of_birth: '',
    gender: 'Male',
    blood_group: 'O+',
    emergency_contact: '+88017',
  });

  const [registeredData, setRegisteredData] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = await register({
        ...form,
        email: form.email.trim() || undefined,
        nid_number: form.nid_number.trim() || undefined,
        date_of_birth: form.date_of_birth || undefined,
      });
      setRegisteredData(data);
      if (data?.dev_otp) {
        setOtpCode(data.dev_otp);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpConfirm = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await verifyOtp({
        mobile: form.mobile.trim(),
        otp_code: otpCode.trim(),
        full_name: form.full_name.trim(),
      });
      setOtpVerified(true);
    } catch (err) {
      setError(err.message || 'Invalid OTP code');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      {!registeredData ? (
        <Card className="border-t-4 border-t-primary shadow-md">
          <CardHeader className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="default">
                <span className="h-2 w-2 rounded-full bg-flag-red" />
                National Health ID Issuance
              </Badge>
              <Badge variant="flag-soft">Consent-Protected Vault</Badge>
            </div>
            <CardTitle className="text-2xl">
              Register for a Unified Platform Health ID
            </CardTitle>
            <CardDescription>
              Create your portable health identity to store prescriptions and lab reports across hospitals, manage family dependents, and compare diagnostic prices.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegisterSubmit}>
            <CardContent className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-flag-red/40 bg-flag-red-soft p-3 text-xs font-medium text-flag-red-foreground">
                  <AlertCircle className="h-4 w-4 shrink-0 text-flag-red" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Full Name *
                  </label>
                  <Input
                    placeholder="e.g. Farhana Yasmin"
                    value={form.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Mobile Number (Bangladesh) *
                  </label>
                  <Input
                    placeholder="+8801711998877"
                    value={form.mobile}
                    onChange={(e) => updateField('mobile', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Password (min 6 chars) *
                  </label>
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Primary Account Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => updateField('role', e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="patient">Patient (Own Health Record Vault)</option>
                    <option value="caregiver">Family Caregiver / Guardian</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Email Address (Optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="farhana@example.com"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    National ID / Smart NID Number (Optional)
                  </label>
                  <Input
                    placeholder="10 or 17 digit Smart NID"
                    value={form.nid_number}
                    onChange={(e) => updateField('nid_number', e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => updateField('date_of_birth', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Gender
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Blood Group
                    </label>
                    <select
                      value={form.blood_group}
                      onChange={(e) => updateField('blood_group', e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Emergency Contact Number (For Offline Emergency QR Card)
                  </label>
                  <Input
                    placeholder="+8801711998800"
                    value={form.emergency_contact}
                    onChange={(e) => updateField('emergency_contact', e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                <UserPlus className="h-4 w-4" />
                {submitting ? 'Creating Health ID...' : 'Register & Generate Platform Health ID'}
              </Button>
            </CardContent>
          </form>

          <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t pt-4 text-xs text-muted-foreground">
            <span>Already registered on Rogi Sathi?</span>
            <Button variant="link" className="h-auto p-0 font-semibold" asChild>
              <Link href="/login">Sign In to your account →</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        /* Step 2: Health ID Issued + Mobile OTP Verification */
        <Card className="border-t-4 border-t-flag-red shadow-md">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="default">Registration Complete</Badge>
              <Badge variant="flag">Health ID Issued</Badge>
            </div>
            <CardTitle className="text-2xl">
              Welcome, {registeredData.user?.full_name}!
            </CardTitle>
            <CardDescription>
              Your portable Bangladesh Unified Health ID has been generated. Verify your mobile OTP below to mark your number verified.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="rounded-xl border-2 border-primary bg-secondary/70 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
                  Your Unique Platform Health ID
                </div>
                <div className="font-mono text-2xl font-bold text-primary mt-0.5">
                  {registeredData.user?.patient_profile?.health_id || 'Assigned to Caregiver'}
                </div>
              </div>
              <Badge variant="default" className="w-fit">
                <ShieldCheck className="h-3.5 w-3.5" />
                Session Active
              </Badge>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-flag-red/40 bg-flag-red-soft p-3 text-xs font-medium text-flag-red-foreground">
                <AlertCircle className="h-4 w-4 shrink-0 text-flag-red" />
                <span>{error}</span>
              </div>
            )}

            {!otpVerified ? (
              <form onSubmit={handleOtpConfirm} className="space-y-4">
                {registeredData.dev_otp && (
                  <div className="rounded-lg border border-flag-red/30 bg-flag-red-soft p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-medium text-flag-red-foreground">
                      Development OTP Code for <strong>{form.mobile}</strong>:
                    </span>
                    <Badge variant="flag" className="font-mono text-sm w-fit">
                      {registeredData.dev_otp}
                    </Badge>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Enter 6-Digit Mobile OTP to Verify Number
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="font-mono tracking-widest"
                      placeholder="6-digit OTP"
                      required
                    />
                    <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
                      <Smartphone className="h-4 w-4" />
                      {submitting ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-secondary p-3.5 text-sm font-semibold text-secondary-foreground">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Mobile number verified! Your Health Vault is ready.</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t pt-4">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push('/account')}>
              Manage Security &amp; PIN Lock
            </Button>
            <Button variant="default" className="w-full sm:w-auto" onClick={() => router.push('/patient/dashboard')}>
              Open Patient Health Vault
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
