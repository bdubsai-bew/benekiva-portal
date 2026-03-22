"use client";

import PortalShell from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SAMPLE_CLAIMS, CLAIM_STAGES, STAGE_COLORS, type ClaimStage } from "@/lib/demo-data";
import { Search, Plus, Clock, Zap, CheckCircle, XCircle, Bot, DollarSign } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
}

export default function ClaimsPage() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<ClaimStage | "All">("All");

  const filtered = SAMPLE_CLAIMS.filter((c) => {
    const matchesSearch =
      !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      `${c.claimantFirst} ${c.claimantLast}`.toLowerCase().includes(search.toLowerCase()) ||
      c.policyNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === "All" || c.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const stageCounts = CLAIM_STAGES.reduce(
    (acc, stage) => {
      acc[stage] = SAMPLE_CLAIMS.filter((c) => c.stage === stage).length;
      return acc;
    },
    {} as Record<ClaimStage, number>
  );

  const totalAmount = SAMPLE_CLAIMS.reduce((sum, c) => sum + c.amount, 0);
  const avgProcessingTime = SAMPLE_CLAIMS.filter((c) => c.aiProcessingMinutes > 0).reduce((sum, c) => sum + c.aiProcessingMinutes, 0) / SAMPLE_CLAIMS.filter((c) => c.aiProcessingMinutes > 0).length;
  const approvedCount = SAMPLE_CLAIMS.filter((c) => c.stage === "Approved").length;
  const aiProcessedCount = SAMPLE_CLAIMS.filter((c) => c.aiProcessingMinutes > 0).length;

  return (
    <PortalShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Claims Dashboard</h1>
            <p className="text-muted-foreground">
              {SAMPLE_CLAIMS.length} active claims · {formatCurrency(totalAmount)} total value
            </p>
          </div>
          <Link href="/claims/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Claim
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg AI Time</p>
                  <p className="text-2xl font-bold">{avgProcessingTime.toFixed(1)}m</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">AI Processed</p>
                  <p className="text-2xl font-bold">{aiProcessedCount}/{SAMPLE_CLAIMS.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stage Pipeline */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {CLAIM_STAGES.map((stage, i) => {
                const colors = STAGE_COLORS[stage];
                const count = stageCounts[stage];
                return (
                  <div key={stage} className="flex items-center">
                    <button
                      onClick={() => setStageFilter(stageFilter === stage ? "All" : stage)}
                      className={`flex flex-col items-center rounded-lg border-2 px-4 py-3 min-w-[120px] transition-all ${
                        stageFilter === stage
                          ? `${colors.bg} ${colors.border} ${colors.text} ring-2 ring-offset-1`
                          : `border-transparent hover:${colors.bg} hover:${colors.border}`
                      }`}
                    >
                      <span className="text-2xl font-bold">{count}</span>
                      <span className="text-xs font-medium whitespace-nowrap">{stage}</span>
                    </button>
                    {i < CLAIM_STAGES.length - 1 && (
                      <div className="text-muted-foreground mx-1 text-lg">→</div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Search & Filter */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by claim #, name, or policy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {stageFilter !== "All" && (
            <Button variant="outline" size="sm" onClick={() => setStageFilter("All")}>
              Clear filter: {stageFilter} ✕
            </Button>
          )}
        </div>

        {/* Claims Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((claim) => {
            const stageColor = STAGE_COLORS[claim.stage];
            return (
              <Link key={claim.id} href={`/claims/${claim.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-base">{claim.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {claim.claimantFirst} {claim.claimantLast}
                        </p>
                      </div>
                      <Badge className={`${stageColor.bg} ${stageColor.text} border ${stageColor.border}`}>
                        {claim.stage}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Type</p>
                        <p className="font-medium">{claim.claimType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Amount</p>
                        <p className="font-medium">{formatCurrency(claim.amount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Filed</p>
                        <p className="font-medium">{new Date(claim.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">AI Confidence</p>
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-12 rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${claim.aiConfidence}%` }}
                            />
                          </div>
                          <span className="font-medium text-xs">{claim.aiConfidence}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Agent & Processing Time */}
                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Bot className="h-3.5 w-3.5" />
                        <span>{claim.assignedAgent}</span>
                      </div>
                      {claim.aiProcessingMinutes > 0 && (
                        <div className="flex items-center gap-1 text-green-600 font-medium">
                          <Zap className="h-3 w-3" />
                          {claim.aiProcessingMinutes}m
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">No claims match your search.</div>
        )}
      </div>
    </PortalShell>
  );
}
