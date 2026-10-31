'use client';

import { useEffect, useState } from 'react';
import { Search, MapPin, CalendarClock } from 'lucide-react';
import { apiFetch } from '@/services/apiClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function DoctorsDirectoryPage() {
  const [doctors, setDoctors] = useState([]);
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  useEffect(() => {
    const query = specialtyFilter ? `?specialty=${encodeURIComponent(specialtyFilter)}` : '';
    apiFetch(`/api/v1/doctors${query}`)
      .then((res) => setDoctors(res.data || []))
      .catch(() => setDoctors([]));
  }, [specialtyFilter]);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary">BMDC Registry</Badge>
            <Badge variant="flag-soft">Fee ≠ Clinical Quality</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Central Doctor Directory</h1>
          <p className="text-sm text-muted-foreground">
            See which doctor sits at which facility, chamber days/hours, and visit fees. (Note: Fee does not indicate clinical quality.)
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by specialty (e.g. Cardiology)..."
            className="pl-8"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {doctors.map((doc, idx) => (
          <Card key={idx} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">{doc.full_name}</CardTitle>
                  <CardDescription>{doc.qualifications}</CardDescription>
                </div>
                <Badge variant="default">{doc.specialty}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-flag-red" />
                <span>
                  <strong className="text-foreground">{doc.facility_name || 'Unassigned'}</strong> • {doc.district}
                </span>
              </div>
              {doc.schedule_days && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  <span>
                    {doc.schedule_days} ({doc.schedule_hours})
                  </span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-4">
              <div className="text-sm">
                <span className="font-bold text-primary">Visit: ৳{doc.visit_fee ?? 'N/A'}</span>
                {doc.followup_fee && (
                  <span className="ml-3 text-muted-foreground">Follow-up: ৳{doc.followup_fee}</span>
                )}
              </div>
              <Button size="sm" variant="default">
                Request Appointment
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
