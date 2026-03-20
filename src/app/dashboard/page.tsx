"use client";

import PortalShell from "@/components/portal-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DASHBOARD_STATS, AI_AGENTS, ACTIVITY_FEED, SAMPLE_CLAIMS } from "@/lib/demo-data";
import { FileCheck, Scan, ShieldAlert, Brain, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, React.ElementType> = { FileCheck, Scan, ShieldAlert, Brain };

export default function DashboardPage() {
  const stats = DASHBOARD_STATS;

  return (
    <PortalShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">AI-powered claims processing overview</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Claims Processed</p>
                  <p className="text-3xl font-bold">{stats.claimsProcessed}</p>
                </div>
                <FileCheck className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Accuracy</p>
                  <p className="text-3xl font-bold">{stats.aiAccuracy}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Speed Gain</p>
                  <p className="text-3xl font-bold">{stats.processingSpeedGain}%</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-3xl font-bold">{stats.pendingReview}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* AI Agents */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">AI Agents</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {AI_AGENTS.map((agent) => {
                const Icon = ICON_MAP[agent.icon] || Brain;
                return (
                  <Card key={agent.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{agent.name}</h3>
                            <Badge variant={agent.status === "Active" ? "default" : "secondary"} className="text-[10px]">
                              {agent.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{agent.description}</p>
                          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                            <span>{agent.accuracy}% accuracy</span>
                            <span>{agent.claimsProcessed.toLocaleString()} processed</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {ACTIVITY_FEED.slice(0, 6).map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                        item.type === "approval" ? "bg-green-500" :
                        item.type === "alert" ? "bg-yellow-500" :
                        item.type === "document" ? "bg-blue-500" : "bg-muted-foreground"
                      }`} />
                      <div className="min-w-0">
                        <p className="text-xs leading-relaxed">
                          {item.claimId ? (
                            <Link href={`/claims/${item.claimId}`} className="hover:underline">{item.message}</Link>
                          ) : item.message}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Claims */}
        <div className="space-y-4">
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
                      <th className="text-left p-3 font-medium">Claim ID</th>
                      <th className="text-left p-3 font-medium">Claimant</th>
                      <th className="text-left p-3 font-medium">Type</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">AI Confidence</th>
                      <th className="text-left p-3 font-medium">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_CLAIMS.slice(0, 5).map((claim) => (
                      <tr key={claim.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-3">
                          <Link href={`/claims/${claim.id}`} className="text-primary hover:underline font-medium">
                            {claim.id}
                          </Link>
                        </td>
                        <td className="p-3">{claim.claimantFirst} {claim.claimantLast}</td>
                        <td className="p-3"><Badge variant="secondary">{claim.claimType}</Badge></td>
                        <td className="p-3">
                          <Badge variant={
                            claim.status === "Approved" ? "default" :
                            claim.status === "Denied" ? "destructive" : "secondary"
                          }>{claim.status}</Badge>
                        </td>
                        <td className="p-3">{claim.aiConfidence}%</td>
                        <td className="p-3">
                          <span className={claim.riskScore > 40 ? "text-destructive font-medium" : ""}>{claim.riskScore}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
