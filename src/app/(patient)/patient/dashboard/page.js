'use client';

import Link from 'next/link';
import { LogIn, KeyRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatRoleLabel } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function PatientDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const healthId = user?.patient_profile?.health_id || 'BD-UHP-2026-0001';

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isAuthenticated ? `${user.full_name}'s Health Vault` : 'Patient Health Vault & Consent'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your medical timeline, provider access permissions, family profiles, and emergency card.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="font-mono">
            <span className="h-2 w-2 rounded-full bg-flag-red" />
            Health ID: {healthId}
          </Badge>
          {isAuthenticated ? (
            <Button size="sm" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/account">
                <KeyRound className="h-3.5 w-3.5 text-primary" />
                Role &amp; PIN Settings ({formatRoleLabel(user.active_role)})
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="flag" className="w-full sm:w-auto" asChild>
              <Link href="/login">
                <LogIn className="h-3.5 w-3.5" />
                Sign In to Your Vault
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
              Signed in as <strong>{user.full_name}</strong> ({user.mobile}) • Active Role:{' '}
              <strong>{formatRoleLabel(user.active_role)}</strong>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(user.permissions || []).slice(0, 4).map((p) => (
              <Badge key={p} variant="outline" className="font-mono text-xs">
                {p}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="vault">
        <div className="overflow-x-auto pb-1">
          <TabsList className="inline-flex w-max min-w-full sm:w-auto">
            <TabsTrigger value="vault">Medical Timeline</TabsTrigger>
            <TabsTrigger value="consent">Privacy &amp; Consent</TabsTrigger>
            <TabsTrigger value="family">Family &amp; Emergency Card</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="vault">
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Medical Records Timeline</CardTitle>
              <CardDescription>
                View your prescriptions, diagnostic test reports, and lab result trends in one place.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Upload paper prescriptions or view digital reports shared by your hospitals and diagnostic centers.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consent">
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Doctor &amp; Hospital Access Permissions</CardTitle>
              <CardDescription>
                Choose which medical categories a provider can view and set when access expires.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="default">General Health: Shared</Badge>
              <Badge variant="flag-soft">Mental Health: Private</Badge>
              <Badge variant="flag-soft">Reproductive Health: Private</Badge>
              <Badge variant="flag-soft">Sensitive Records: Private</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family">
          <Card className="border-t-4 border-t-flag-red bg-flag-red-soft/30">
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Family Profiles &amp; Emergency QR Card</CardTitle>
                <Badge variant="flag" className="w-fit">Offline Signed QR</Badge>
              </div>
              <CardDescription>
                Manage health profiles for children or elderly parents, and configure your emergency medical card.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
