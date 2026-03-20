"use client";

import PortalShell from "@/components/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SAMPLE_CLAIMS, ClaimStatus } from "@/lib/demo-data";
import { Search, Plus, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ClaimsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "All">("All");

  const filtered = SAMPLE_CLAIMS.filter((c) => {
    const matchesSearch = !search || 
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      `${c.claimantFirst} ${c.claimantLast}`.toLowerCase().includes(search.toLowerCase()) ||
      c.policyNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses: (ClaimStatus | "All")[] = ["All", "Processing", "Approved", "Under Review", "Pending Documents", "Denied"];

  return (
    <PortalShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Claims</h1>
            <p className="text-muted-foreground">{SAMPLE_CLAIMS.length} total claims</p>
          </div>
          <Link href="/claims/new">
            <Button><Plus className="h-4 w-4 mr-2" /> New Claim</Button>
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search claims..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <Button key={s} size="sm" variant={statusFilter === s ? "default" : "outline"} onClick={() => setStatusFilter(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">Claim ID</th>
                    <th className="text-left p-3 font-medium">Claimant</th>
                    <th className="text-left p-3 font-medium">Policy</th>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">AI Confidence</th>
                    <th className="text-left p-3 font-medium">Risk</th>
                    <th className="text-left p-3 font-medium">Fraud %</th>
                    <th className="text-left p-3 font-medium">Docs</th>
                    <th className="text-left p-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((claim) => (
                    <tr key={claim.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer">
                      <td className="p-3">
                        <Link href={`/claims/${claim.id}`} className="text-primary hover:underline font-medium">{claim.id}</Link>
                      </td>
                      <td className="p-3">{claim.claimantFirst} {claim.claimantLast}</td>
                      <td className="p-3 font-mono text-xs">{claim.policyNumber}</td>
                      <td className="p-3"><Badge variant="secondary">{claim.claimType}</Badge></td>
                      <td className="p-3">
                        <Badge variant={
                          claim.status === "Approved" ? "default" :
                          claim.status === "Denied" ? "destructive" : "secondary"
                        }>{claim.status}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${claim.aiConfidence}%` }} />
                          </div>
                          <span className="text-xs">{claim.aiConfidence}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={claim.riskScore > 40 ? "text-destructive font-medium" : ""}>{claim.riskScore}</span>
                      </td>
                      <td className="p-3">
                        <span className={claim.fraudProbability > 10 ? "text-yellow-600 font-medium" : ""}>{claim.fraudProbability}%</span>
                      </td>
                      <td className="p-3">{claim.docCompleteness}%</td>
                      <td className="p-3 text-muted-foreground text-xs">{new Date(claim.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">No claims match your filters.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
