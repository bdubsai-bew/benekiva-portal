"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Info, ClipboardCheck, ShieldCheck } from "lucide-react";

interface EligibilityResult {
  overallEligible: boolean;
  eligibilityChecks: { check: string; passed: boolean; details: string; severity: "info" | "warning" | "blocker" }[];
  recommendedProducts: { product: string; suitability: number; rationale: string }[];
  exclusions: string[];
  conditions: string[];
  regulatoryFlags: { regulation: string; status: "compliant" | "review-needed" | "non-compliant"; note: string }[];
}

interface Props {
  result: EligibilityResult | null;
}

const severityIcon = {
  info: <Info className="w-4 h-4 text-blue-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
  blocker: <XCircle className="w-4 h-4 text-destructive" />,
};

const regStatusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  compliant: "default",
  "review-needed": "secondary",
  "non-compliant": "destructive",
};

export const EligibilityCheck = ({ result }: Props) => {
  if (!result) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <ClipboardCheck className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No eligibility check run yet</p>
          <p className="text-sm mt-1">Run analysis to check policy eligibility</p>
        </div>
      </Card>
    );
  }

  const passed = result.eligibilityChecks.filter((c) => c.passed).length;

  return (
    <div className="space-y-6">
      <Card className={`border ${result.overallEligible ? "bg-green-500/10 border-green-500/20" : "bg-destructive/10 border-destructive/20"}`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            {result.overallEligible ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-destructive" />
            )}
            <div>
              <h3 className="text-xl font-bold">{result.overallEligible ? "Eligible for Coverage" : "Not Eligible"}</h3>
              <p className="text-sm text-muted-foreground">
                {passed} of {result.eligibilityChecks.length} checks passed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Eligibility Checks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.eligibilityChecks.map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg border bg-muted/30">
                {c.passed ? <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> : severityIcon[c.severity]}
                <div className="min-w-0">
                  <p className="text-sm font-medium">{c.check}</p>
                  <p className="text-xs text-muted-foreground">{c.details}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recommended Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.recommendedProducts.map((p, i) => (
              <div key={i} className="p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{p.product}</span>
                  <Badge variant={p.suitability >= 70 ? "default" : "outline"}>{p.suitability}% match</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{p.rationale}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {(result.exclusions.length > 0 || result.conditions.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.exclusions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-destructive">Exclusions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.exclusions.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <XCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                      {e}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {result.conditions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-yellow-600">Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.conditions.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Regulatory Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.regulatoryFlags.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div>
                <p className="font-medium text-sm">{r.regulation}</p>
                <p className="text-xs text-muted-foreground">{r.note}</p>
              </div>
              <Badge variant={regStatusVariant[r.status] || "outline"} className="capitalize">{r.status.replace("-", " ")}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
