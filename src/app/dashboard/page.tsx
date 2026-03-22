"use client";

import PortalShell from "@/components/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SAMPLE_CLAIMS } from "@/lib/demo-data";
import { FileCheck, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { AISummaryBanner } from "@/components/dashboard/AISummaryBanner";
import { AgentStatusCards } from "@/components/dashboard/AgentStatusCards";
import { LiveActivityFeed } from "@/components/dashboard/LiveActivityFeed";

export default function DashboardPage() {
  return (
    <PortalShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-muted-foreground">AI-powered claims processing overview</p>
        </div>

        {/* AI Summary Banner */}
        <AISummaryBanner />

        {/* Agent Status Cards */}
        <AgentStatusCards />

        {/* Live Activity Feed + Recent Claims */}
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <LiveActivityFeed />
          </div>

          {/* Recent Claims (compact) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Claims</h2>
              <Link href="/claims" className="text-sm text-primary hover:underline">View all →</Link>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">Claim</th>
                        <th className="text-left p-3 font-medium">Claimant</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">AI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_CLAIMS.slice(0, 8).map((claim) => (
                        <tr key={claim.id} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="p-3">
                            <Link href={`/claims/${claim.id}`} className="text-primary hover:underline font-medium text-xs">
                              {claim.id}
                            </Link>
                          </td>
                          <td className="p-3 text-xs">{claim.claimantFirst} {claim.claimantLast.charAt(0)}.</td>
                          <td className="p-3">
                            <Badge variant={
                              claim.status === "Approved" ? "default" :
                              claim.status === "Denied" ? "destructive" : "secondary"
                            } className="text-[10px]">{claim.status}</Badge>
                          </td>
                          <td className="p-3 text-xs">{claim.aiConfidence}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
