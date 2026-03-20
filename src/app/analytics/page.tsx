"use client";

import PortalShell from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_STATS, SAMPLE_CLAIMS } from "@/lib/demo-data";

export default function AnalyticsPage() {
  const byType = SAMPLE_CLAIMS.reduce((acc, c) => {
    acc[c.claimType] = (acc[c.claimType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byStatus = SAMPLE_CLAIMS.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgConfidence = Math.round(SAMPLE_CLAIMS.reduce((s, c) => s + c.aiConfidence, 0) / SAMPLE_CLAIMS.length);
  const avgRisk = Math.round(SAMPLE_CLAIMS.reduce((s, c) => s + c.riskScore, 0) / SAMPLE_CLAIMS.length);

  return (
    <PortalShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Cross-agent performance dashboards</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Avg AI Confidence</p><p className="text-3xl font-bold">{avgConfidence}%</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Avg Risk Score</p><p className="text-3xl font-bold">{avgRisk}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Avg Processing Time</p><p className="text-3xl font-bold">{DASHBOARD_STATS.avgProcessingHours}h</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Approved This Week</p><p className="text-3xl font-bold">{DASHBOARD_STATS.approvedThisWeek}</p></CardContent></Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Claims by Type</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(byType).map(([type, count]) => (
                  <div key={type} className="flex items-center gap-3">
                    <span className="w-16 text-sm font-medium">{type}</span>
                    <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full flex items-center justify-end pr-2" style={{ width: `${(count / SAMPLE_CLAIMS.length) * 100}%` }}>
                        <span className="text-[10px] text-primary-foreground font-bold">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Claims by Status</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-3">
                    <span className="w-32 text-sm font-medium">{status}</span>
                    <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/70 rounded-full flex items-center justify-end pr-2" style={{ width: `${(count / SAMPLE_CLAIMS.length) * 100}%` }}>
                        <span className="text-[10px] text-primary-foreground font-bold">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
