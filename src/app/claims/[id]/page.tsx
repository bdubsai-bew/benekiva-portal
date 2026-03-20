"use client";

import { use } from "react";
import PortalShell from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SAMPLE_CLAIMS } from "@/lib/demo-data";
import { ArrowLeft, FileText, Shield, Brain, AlertTriangle, CheckCircle, Clock, User, Bot } from "lucide-react";
import Link from "next/link";

export default function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const claim = SAMPLE_CLAIMS.find((c) => c.id === id);

  if (!claim) {
    return (
      <PortalShell>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-xl font-bold">Claim Not Found</h1>
          <Link href="/claims" className="mt-4 text-primary hover:underline">← Back to Claims</Link>
        </div>
      </PortalShell>
    );
  }

  const EVENT_ICONS: Record<string, React.ElementType> = { system: Clock, ai: Bot, human: User, document: FileText };

  return (
    <PortalShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/claims">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{claim.id}</h1>
              <Badge variant={claim.status === "Approved" ? "default" : claim.status === "Denied" ? "destructive" : "secondary"}>
                {claim.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{claim.claimantFirst} {claim.claimantLast} · {claim.claimType} · {claim.policyNumber}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column — details */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Analysis */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" /> AI Analysis</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">AI Confidence</p>
                    <div className="flex items-center gap-3">
                      <Progress value={claim.aiConfidence} className="flex-1" />
                      <span className="font-bold text-lg">{claim.aiConfidence}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Document Completeness</p>
                    <div className="flex items-center gap-3">
                      <Progress value={claim.docCompleteness} className="flex-1" />
                      <span className="font-bold text-lg">{claim.docCompleteness}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Shield className="h-4 w-4" /> Risk Score
                    </div>
                    <p className={`text-2xl font-bold ${claim.riskScore > 40 ? "text-destructive" : claim.riskScore > 20 ? "text-yellow-600" : "text-green-600"}`}>
                      {claim.riskScore}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <AlertTriangle className="h-4 w-4" /> Fraud Probability
                    </div>
                    <p className={`text-2xl font-bold ${claim.fraudProbability > 10 ? "text-yellow-600" : "text-green-600"}`}>
                      {claim.fraudProbability}%
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm font-medium mb-1">AI Recommendation</p>
                  <p className="text-sm">{claim.recommendedAction}</p>
                </div>
              </CardContent>
            </Card>

            {/* Claim Details */}
            <Card>
              <CardHeader><CardTitle>Claim Details</CardTitle></CardHeader>
              <CardContent>
                <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div><dt className="text-muted-foreground">Claimant</dt><dd className="font-medium">{claim.claimantFirst} {claim.claimantLast}</dd></div>
                  <div><dt className="text-muted-foreground">Date of Birth</dt><dd className="font-medium">{claim.dob}</dd></div>
                  <div><dt className="text-muted-foreground">Policy Number</dt><dd className="font-medium font-mono">{claim.policyNumber}</dd></div>
                  <div><dt className="text-muted-foreground">Claim Type</dt><dd className="font-medium">{claim.claimType}</dd></div>
                  <div><dt className="text-muted-foreground">Date of Loss</dt><dd className="font-medium">{claim.dateOfLoss}</dd></div>
                  <div><dt className="text-muted-foreground">Submitted</dt><dd className="font-medium">{new Date(claim.submittedAt).toLocaleString()}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-muted-foreground">Description</dt><dd className="font-medium mt-1">{claim.description}</dd></div>
                </dl>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Documents ({claim.documents.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  {claim.documents.map((doc) => (
                    <div key={doc} className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{doc}</span>
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 ml-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column — timeline */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Timeline</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {claim.timeline.map((event, i) => {
                    const Icon = EVENT_ICONS[event.type] || Clock;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                            event.type === "ai" ? "bg-purple-100 text-purple-600" :
                            event.type === "human" ? "bg-blue-100 text-blue-600" :
                            event.type === "document" ? "bg-green-100 text-green-600" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          {i < claim.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm font-medium">{event.event}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{event.detail}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">{new Date(event.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
