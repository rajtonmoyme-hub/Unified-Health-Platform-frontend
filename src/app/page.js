'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Stethoscope, Scale, ShieldCheck, Building2, QrCode, FileText } from 'lucide-react';
import { apiFetch } from '@/services/apiClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function HomePage() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    apiFetch('/api/v1/health')
      .then((res) => setStats(res.data || {}))
      .catch(() => setStats({}));
  }, []);

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
      <div className="rounded-xl border border-border bg-secondary/60 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">
                <span className="h-2 w-2 rounded-full bg-flag-red" />
                Bangladesh Unified Health Platform
              </Badge>
              <Badge variant="flag-soft">Consent-Based National Registry</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Rogi Sathi — Unified Health Care &amp; Patient Vault
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              One platform where private hospitals, clinics, and diagnostic centers manage their patients independently, while patients own one portable health record and compare prices transparently.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/doctors">Find a Doctor</Link>
            </Button>
            <Button variant="flag" asChild>
              <Link href="/patient/dashboard">Emergency &amp; Vault</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/prices">Compare Test Prices</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-t-4 border-t-primary">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              Doctor Directory
            </CardDescription>
            <CardTitle className="text-2xl">{stats.doctors_count ?? '—'} Specialists</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Compare visit fees, follow-up fees, and chamber schedules across facilities.
          </CardContent>
          <CardFooter>
            <Button variant="link" className="h-auto p-0" asChild>
              <Link href="/doctors">Browse directory →</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-t-4 border-t-primary">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Verified Providers
            </CardDescription>
            <CardTitle className="text-2xl">{stats.providers_count ?? '—'} Facilities</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Dedicated workspaces for hospitals, clinics, and diagnostic centers.
          </CardContent>
          <CardFooter>
            <Button variant="link" className="h-auto p-0" asChild>
              <Link href="/provider/dashboard">Open workspace →</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-t-4 border-t-flag-red">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-flag-red" />
              Price Transparency
            </CardDescription>
            <CardTitle className="text-2xl">Verified Rates</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Compare diagnostic test prices across hospitals and verify real bills.
          </CardContent>
          <CardFooter>
            <Button variant="link" className="h-auto p-0 text-flag-red-foreground" asChild>
              <Link href="/prices">Compare prices →</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-t-4 border-t-flag-red">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-flag-red" />
              Patient Record Vault
            </CardDescription>
            <CardTitle className="text-2xl">Consent First</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Control which doctor or hospital can view your records by category and duration.
          </CardContent>
          <CardFooter>
            <Button variant="link" className="h-auto p-0 text-flag-red-foreground" asChild>
              <Link href="/patient/dashboard">Open health vault →</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
                <FileText className="h-4 w-4" />
              </span>
              <CardTitle>Longitudinal Medical History</CardTitle>
            </div>
            <CardDescription>
              Keep all prescriptions, diagnostic reports, and lab trends in one place
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Upload paper prescriptions or receive digital reports directly from connected diagnostic centers. Prevent duplicate tests across hospitals automatically.
          </CardContent>
        </Card>

        <Card className="border-flag-red/30 bg-flag-red-soft/40">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-flag-red text-white">
                  <QrCode className="h-4 w-4" />
                </span>
                <CardTitle>Family Guardianship &amp; Emergency Card</CardTitle>
              </div>
              <Badge variant="flag">Offline QR</Badge>
            </div>
            <CardDescription>
              Manage dependent profiles for children and elderly parents
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Opt in to a signed offline-readable emergency QR card showing only your chosen critical details (blood group, severe allergies, and emergency contact).
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
