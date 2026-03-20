"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface RiskFactor {
  factor: string;
  score: number;
  weight: "low" | "medium" | "high" | "critical";
  explanation: string;
}

interface RiskAssessmentResult {
  overallRiskScore: number;
  riskTier: "preferred" | "standard" | "substandard" | "decline";
  riskFactors: RiskFactor[];
  mortalityRisk: string;
  morbidityRisk: string;
  underwritingClass: string;
  confidenceLevel: number;
  keyFindings: string[];
}

interface Props {
  result: RiskAssessmentResult | null;
}

const tierConfig = {
  preferred: { color: "text-green-600", bg: "bg-green-500/10 border-green-500/20", icon: CheckCircle, label: "Preferred" },
  standard: { color: "text-blue-600", bg: "bg-blue-500/10 border-blue-500/20", icon: Info, label: "Standard" },
  substandard: { color: "text-orange-600", bg: "bg-orange-500/10 border-orange-500/20", icon: AlertTriangle, label: "Substandard" },
  decline: { color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", icon: XCircle, label: "Decline" },
};

export const RiskAssessment = ({ result }: Props) => {
  if (!result) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No application analyzed yet</p>
          <p className="text-sm mt-1">Enter application data above to generate a risk assessment</p>
        </div>
      </Card>
    );
  }

  const config = tierConfig[result.riskTier];
  const TierIcon = config.icon;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`border ${config.bg}`}>
          <CardContent className="pt-6 text-center">
            <div className={`text-6xl font-bold ${config.color}`}>{result.overallRiskScore}</div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <TierIcon className={`w-5 h-5 ${config.color}`} />
              <span className={`text-lg font-semibold ${config.color}`}>{config.label}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Confidence: {result.confidenceLevel}%</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Underwriting Decision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">{result.underwritingClass}</Badge>
              <Badge variant="outline" className="text-sm capitalize">{result.riskTier} tier</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Mortality Risk</p>
                <p className="mt-1">{result.mortalityRisk}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Morbidity Risk</p>
                <p className="mt-1">{result.morbidityRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Key Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.keyFindings.map((finding, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {finding}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Risk Factors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.riskFactors.map((rf, i) => (
            <div key={i} className="space-y-2 p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{rf.factor}</span>
                  <Badge variant="outline" className="text-xs capitalize">{rf.weight}</Badge>
                </div>
                <span className={`text-sm font-bold ${rf.score >= 70 ? "text-destructive" : rf.score >= 40 ? "text-yellow-600" : "text-green-600"}`}>
                  {rf.score}/100
                </span>
              </div>
              <Progress value={rf.score} className="h-1.5" />
              <p className="text-xs text-muted-foreground">{rf.explanation}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
