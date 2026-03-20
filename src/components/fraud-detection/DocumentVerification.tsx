"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileCheck, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

interface Finding {
  type: string;
  severity: "low" | "medium" | "high";
  finding: string;
  location: string;
  recommendation: string;
}

interface DocVerificationResult {
  authenticityScore: number;
  verificationStatus: "verified" | "suspicious" | "likely-fraudulent";
  findings: Finding[];
  crossReferenceIssues: string[];
  summary: string;
}

interface Props {
  result: DocVerificationResult | null;
}

const statusConfig = {
  verified: { icon: ShieldCheck, color: "text-green-600", bg: "bg-green-500/10 border-green-500/20", label: "Verified" },
  suspicious: { icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Suspicious" },
  "likely-fraudulent": { icon: ShieldAlert, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", label: "Likely Fraudulent" },
};

const severityColors = {
  low: "text-green-600",
  medium: "text-yellow-600",
  high: "text-destructive",
};

export const DocumentVerification = ({ result }: Props) => {
  if (!result) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <FileCheck className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No document verified yet</p>
          <p className="text-sm mt-1">Upload a document above to verify authenticity and check for manipulation</p>
        </div>
      </Card>
    );
  }

  const cfg = statusConfig[result.verificationStatus];
  const StatusIcon = cfg.icon;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Authenticity Score */}
        <Card className={`border ${cfg.bg}`}>
          <CardContent className="pt-6 text-center">
            <StatusIcon className={`w-10 h-10 mx-auto mb-2 ${cfg.color}`} />
            <div className={`text-5xl font-bold ${cfg.color}`}>{result.authenticityScore}</div>
            <p className="text-sm font-semibold mt-1">{cfg.label}</p>
            <Progress value={result.authenticityScore} className="h-2 mt-3" />
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Verification Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
          </CardContent>
        </Card>
      </div>

      {/* Findings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Findings ({result.findings.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.findings.map((f, i) => (
            <div key={i} className="p-3 rounded-lg border bg-muted/30 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{f.finding}</span>
                <Badge variant="outline" className="text-xs">{f.type}</Badge>
                <Badge variant={f.severity === "high" ? "destructive" : f.severity === "medium" ? "secondary" : "outline"} className="text-xs capitalize">
                  {f.severity}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div><span className="font-medium text-foreground">Location:</span> {f.location}</div>
                <div><span className="font-medium text-foreground">Recommendation:</span> {f.recommendation}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cross-Reference Issues */}
      {result.crossReferenceIssues.length > 0 && (
        <Card className="border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-4 h-4" />
              Cross-Reference Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.crossReferenceIssues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                <span>{issue}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
