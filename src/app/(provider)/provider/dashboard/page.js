'use client';

import Link from 'next/link';
import { LogIn, Users, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatRoleLabel } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProviderWorkspacePage() {
  const { user, isAuthenticated } = useAuth();

  const departments = [
    {
      title: 'Administration',
      desc: 'Manage facility branches, staff accounts, doctor chamber schedules, and test price lists',
      accent: 'primary',
    },
    {
      title: 'Doctor Chamber',
      desc: 'Review consented patient history, write digital prescriptions, and check duplicate-test alerts',
      accent: 'flag',
    },
    {
      title: 'Front Desk & Reception',
      desc: 'Register patients by Health ID, book appointments, and manage the daily serial queue',
      accent: 'primary',
    },
    {
      title: 'Diagnostic Lab',
      desc: 'Upload diagnostic test reports and structured lab values to patient records',
      accent: 'primary',
    },
    {
      title: 'Billing & Invoicing',
      desc: 'Generate patient bills and receipts from the facility price list',
      accent: 'flag',
    },
  ];

  const activeMembership = user?.provider_memberships?.find(
    (m) => m.provider_id === user?.active_provider_id
  );

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {activeMembership ? activeMembership.provider_name : 'Provider Workspace'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage patient registration, appointments, prescriptions, diagnostic reports, and billing for your facility.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">
            {user?.active_provider_id
              ? `Facility #${user.active_provider_id}`
              : 'Verified Facility'}
          </Badge>
          <Badge variant="flag-soft">Tenant Isolated</Badge>
          {isAuthenticated ? (
            <Button size="sm" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/account">
                <Users className="h-3.5 w-3.5 text-primary" />
                Staff &amp; Role Context ({formatRoleLabel(user.active_role)})
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="flag" className="w-full sm:w-auto" asChild>
              <Link href="/login">
                <LogIn className="h-3.5 w-3.5" />
                Staff / Doctor Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <div className="rounded-lg border bg-secondary/50 p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>
              Authenticated Staff: <strong>{user.full_name}</strong> • Active Role:{' '}
              <strong>{formatRoleLabel(user.active_role)}</strong>
              {user.doctor_profile?.bmdc_reg_number
                ? ` • BMDC: ${user.doctor_profile.bmdc_reg_number}`
                : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(user.permissions || []).map((p) => (
              <Badge key={p} variant="outline" className="font-mono text-xs">
                {p}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle>Workspace Portals</CardTitle>
          <CardDescription>
            Select a department module to manage daily clinical and administrative operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {departments.map((item) => (
            <div
              key={item.title}
              className={`rounded-lg border p-4 transition-colors ${
                item.accent === 'flag'
                  ? 'border-l-4 border-l-flag-red bg-flag-red-soft/25 hover:bg-flag-red-soft/50'
                  : 'border-l-4 border-l-primary bg-secondary/40 hover:bg-secondary/80'
              }`}
            >
              <div className="font-semibold text-sm mb-1 text-foreground">{item.title}</div>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
