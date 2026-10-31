'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { apiFetch } from '@/services/apiClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export default function PriceComparisonPage() {
  const [prices, setPrices] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const query = search ? `?q=${encodeURIComponent(search)}` : '';
    apiFetch(`/api/v1/pricing${query}`)
      .then((res) => setPrices(res.data || []))
      .catch(() => setPrices([]));
  }, [search]);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default">LOINC Standardised</Badge>
            <Badge variant="flag-soft">Receipt-Verified Rates</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Diagnostic Test Price Comparison</h1>
          <p className="text-sm text-muted-foreground">
            Compare LOINC-coded diagnostic test prices across verified hospitals and diagnostic centers.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search test (e.g. HbA1c, CBC)..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle>Published Diagnostic Test Prices</CardTitle>
          <CardDescription>
            Every price displays its source and provider facility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>LOINC Code</TableHead>
                <TableHead>Provider Facility</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Price (BDT)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">{item.item_code}</Badge>
                  </TableCell>
                  <TableCell>{item.provider_name}</TableCell>
                  <TableCell>{item.district}</TableCell>
                  <TableCell>
                    <Badge variant={item.source === 'PATIENT_RECEIPT' ? 'flag-soft' : 'secondary'}>
                      {item.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    ৳{item.price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
