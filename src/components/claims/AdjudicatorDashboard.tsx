"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  CheckCircle, XCircle, Clock, UserCheck, AlertTriangle,
  FileText, Eye, ThumbsUp, ThumbsDown, RotateCcw
} from "lucide-react";

interface Claim {
  id: string;
  claimant: string;
  type: string;
  amount: string;
  aiConfidence: number;
  status: "pending" | "approved" | "denied" | "escalated";
  riskLevel: "low" | "medium" | "high";
  submittedAt: string;
  aiRecommendation: string;
  humanomationReason?: string;
  findings: string[];
}

const mockClaims: Claim[] = [
  {
    id: "CL-2024-3456",
    claimant: "Jane Smith",
    type: "Long-Term Care",
    amount: "$12,450/mo",
    aiConfidence: 87,
    status: "escalated",
    riskLevel: "medium",
    submittedAt: "2 hours ago",
    aiRecommendation: "Approve with conditions — documentation gap requires human review",
    humanomationReason: "Risk flags detected: missing records and date inconsistencies",
    findings: ["3 of 6 ADLs impaired", "MMSE: 14/30", "2-month documentation gap"],
  },
  {
    id: "CL-2024-3455",
    claimant: "Robert Chen",
    type: "Short-Term Disability",
    amount: "$4,200/mo",
    aiConfidence: 96,
    status: "pending",
    riskLevel: "low",
    submittedAt: "4 hours ago",
    aiRecommendation: "Approve — all verification checks passed, documentation complete",
    findings: ["Orthopedic surgery documented", "Employer verification complete", "Expected recovery: 8 weeks"],
  },
  {
    id: "CL-2024-3454",
    claimant: "Maria Garcia",
    type: "Long-Term Disability",
    amount: "$6,800/mo",
    aiConfidence: 62,
    status: "escalated",
    riskLevel: "high",
    submittedAt: "6 hours ago",
    aiRecommendation: "Escalate to senior adjudicator — conflicting medical opinions",
    humanomationReason: "Low AI confidence due to contradictory physician assessments",
    findings: ["Chronic pain diagnosis disputed", "IME contradicts treating physician", "Prior claim history flagged"],
  },
  {
    id: "CL-2024-3453",
    claimant: "Thomas Williams",
    type: "Long-Term Care",
    amount: "$9,100/mo",
    aiConfidence: 94,
    status: "approved",
    riskLevel: "low",
    submittedAt: "1 day ago",
    aiRecommendation: "Approved — meets all policy criteria for LTC benefit activation",
    findings: ["5 of 6 ADLs impaired", "Consistent medical records", "Facility care documented"],
  },
];

const riskColors = { low: "bg-success", medium: "bg-warning", high: "bg-destructive" };
const statusConfig = {
  pending: { color: "bg-warning", icon: Clock, label: "Pending Review" },
  approved: { color: "bg-success", icon: CheckCircle, label: "Approved" },
  denied: { color: "bg-destructive", icon: XCircle, label: "Denied" },
  escalated: { color: "bg-accent", icon: UserCheck, label: "Humanomation™" },
};

export const AdjudicatorDashboard = () => {
  const [claims, setClaims] = useState(mockClaims);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAction = (claimId: string, action: "approved" | "denied") => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: action } : c))
    );
    toast({
      title: action === "approved" ? "Claim Approved" : "Claim Denied",
      description: `${claimId} has been ${action} by adjudicator`,
    });
    setSelectedClaim(null);
  };

  const selected = claims.find((c) => c.id === selectedClaim);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Summary Stats */}
      <div className="lg:col-span-3 grid grid-cols-4 gap-4">
        {[
          { label: "Total in Queue", value: claims.filter((c) => c.status === "pending" || c.status === "escalated").length, color: "text-primary" },
          { label: "Humanomation™ Escalated", value: claims.filter((c) => c.status === "escalated").length, color: "text-accent" },
          { label: "Approved Today", value: claims.filter((c) => c.status === "approved").length, color: "text-success" },
          { label: "Avg AI Confidence", value: `${Math.round(claims.reduce((a, c) => a + c.aiConfidence, 0) / claims.length)}%`, color: "text-primary" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Claims List */}
      <div className="lg:col-span-2 space-y-3">
        <h3 className="text-lg font-semibold">Claims Queue</h3>
        {claims.map((claim) => {
          const StatusIcon = statusConfig[claim.status].icon;
          return (
            <Card
              key={claim.id}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedClaim === claim.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedClaim(claim.id)}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-10 rounded-full ${riskColors[claim.riskLevel]}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold">{claim.id}</span>
                        <Badge variant="outline" className={`${statusConfig[claim.status].color} text-white border-0 text-xs`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[claim.status].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{claim.claimant} · {claim.type} · {claim.amount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{claim.aiConfidence}%</p>
                    <p className="text-xs text-muted-foreground">AI Conf.</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={claim.aiConfidence} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detail Panel */}
      <div>
        {!selected ? (
          <Card className="flex items-center justify-center min-h-[300px]">
            <div className="text-center text-muted-foreground">
              <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a claim to review</p>
            </div>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{selected.id}</CardTitle>
                <Badge variant="outline" className={`${riskColors[selected.riskLevel]} text-white border-0 text-xs`}>
                  {selected.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
              <CardDescription>{selected.claimant} · {selected.type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="font-medium mb-1">AI Recommendation</p>
                <p className="text-muted-foreground">{selected.aiRecommendation}</p>
              </div>

              {selected.humanomationReason && (
                <div className="flex items-start gap-2 p-3 rounded-lg border border-accent/30 bg-accent/5">
                  <UserCheck className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-accent">Humanomation™ Escalation</p>
                    <p className="text-xs text-muted-foreground">{selected.humanomationReason}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">Key Findings</p>
                {selected.findings.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <FileText className="w-3 h-3 text-primary shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-muted-foreground">
                Submitted {selected.submittedAt}
              </div>

              {(selected.status === "pending" || selected.status === "escalated") && (
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" className="flex-1 bg-success hover:bg-success/90" onClick={() => handleAction(selected.id, "approved")}>
                    <ThumbsUp className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleAction(selected.id, "denied")}>
                    <ThumbsDown className="w-4 h-4 mr-1" /> Deny
                  </Button>
                </div>
              )}

              {(selected.status === "approved" || selected.status === "denied") && (
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setClaims((prev) => prev.map((c) => c.id === selected.id ? { ...c, status: "pending" } : c))}>
                    <RotateCcw className="w-4 h-4 mr-1" /> Reopen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
