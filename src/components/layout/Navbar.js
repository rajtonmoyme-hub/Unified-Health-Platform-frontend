'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HeartPulse,
  Stethoscope,
  Scale,
  ShieldCheck,
  Building2,
  LogIn,
  UserPlus,
  UserCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ROLE_DISPLAY = {
  patient: 'Patient',
  caregiver: 'Caregiver',
  doctor: 'Doctor',
  receptionist: 'Front Desk',
};

export function formatRoleLabel(code) {
  if (!code) return 'Member';
  if (ROLE_DISPLAY[code]) return ROLE_DISPLAY[code];
  return code
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout(false);
    setMobileMenuOpen(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-b-flag-red bg-background/95 backdrop-blur shadow-xs">
      {/* National Top Ribbon */}
      <div className="bg-primary text-primary-foreground text-xs py-1 px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-flag-red ring-2 ring-white/40" />
            <span className="font-medium tracking-wide truncate">
              Bangladesh National Unified Health Registry
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated && user?.patient_profile?.health_id && (
              <span className="font-mono text-xs bg-white/15 px-2 py-0.5 rounded">
                ID: {user.patient_profile.health_id}
              </span>
            )}
            <span className="hidden sm:inline opacity-90 font-mono text-xs">
              Helpline: 16263 / 999
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-lg text-foreground group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-flag-green shadow-xs transition-transform group-hover:scale-105">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-flag-red">
              <HeartPulse className="h-3.5 w-3.5 text-white" />
            </span>
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-base font-bold tracking-tight text-foreground">
              Rogi Sathi
            </span>
            <span className="text-xs font-medium text-primary">
              Uni-Hospital BD
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/doctors">
              <Stethoscope className="h-4 w-4 text-primary" />
              <span>Doctors</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/prices">
              <Scale className="h-4 w-4 text-primary" />
              <span>Price Compare</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/patient/dashboard">
              <ShieldCheck className="h-4 w-4 text-flag-red" />
              <span>Patient Vault</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/provider/dashboard">
              <Building2 className="h-4 w-4 text-primary" />
              <span>Workspace</span>
            </Link>
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-border">
              <Button variant="secondary" size="sm" asChild>
                <Link href="/account">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span className="max-w-[110px] truncate font-semibold">
                    {user.full_name}
                  </span>
                  <Badge variant="default" className="ml-1 px-1.5 py-0 text-xs">
                    {formatRoleLabel(user.active_role)}
                  </Badge>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-flag-red-foreground border-flag-red/30 hover:bg-flag-red-soft"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-2 border-l border-border">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4 text-primary" />
                  <span>Sign In</span>
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/register">
                  <UserPlus className="h-4 w-4" />
                  <span>Register Health ID</span>
                </Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Collapsible Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/doctors">
                <Stethoscope className="h-4 w-4 text-primary" />
                <span>Doctor Directory</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/prices">
                <Scale className="h-4 w-4 text-primary" />
                <span>Diagnostic Price Compare</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/patient/dashboard">
                <ShieldCheck className="h-4 w-4 text-flag-red" />
                <span>Patient Health Vault</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/provider/dashboard">
                <Building2 className="h-4 w-4 text-primary" />
                <span>Provider Workspace</span>
              </Link>
            </Button>
          </div>

          <div className="border-t border-border pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  variant="secondary"
                  className="w-full justify-between"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/account">
                    <span className="flex items-center gap-2 truncate">
                      <UserCheck className="h-4 w-4 text-primary" />
                      {user.full_name}
                    </span>
                    <Badge variant="default">{formatRoleLabel(user.active_role)}</Badge>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-flag-red-foreground border-flag-red/30"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/login">
                    <LogIn className="h-4 w-4 text-primary" />
                    <span>Sign In</span>
                  </Link>
                </Button>
                <Button
                  variant="default"
                  className="w-full"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/register">
                    <UserPlus className="h-4 w-4" />
                    <span>Register Health ID</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
