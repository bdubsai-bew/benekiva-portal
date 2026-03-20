"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, ShieldAlert, TrendingUp, Info } from "lucide-react";

interface RiskFactor {
  factor: string;
  score: number;
  weight: "low" | "medium" | "high";
  explanation: string;
}

interface RiskScoringResult {
  overallRiskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskFactors: RiskFactor[];
  recommendation: string;
  recommendationRationale: string;
  confidenceLevel: number;
}

interface Props {
  result: RiskScoringResult | null;
}

const riskLevelConfig = {
  low: { color: "text-green-600", bg: "bg-green-500/10 border-green-500/20", icon: CheckCircle, label: "Low Risk" },
  medium: { color: "text-yellow-600", bg: "bg-yellow-500/10 border-yellow-500/20", icon: Info, label: "Medium Risk" },
  high: { color: "text-orange-600", bg: "bg-orange-500/10 border-orange-500/20", icon: AlertTriangle, label: "High Risk" },
  critical: { color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", icon: ShieldAlert, label: "Critical Risk" },
};

const recommendationLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "auto-approve": { label: "Auto-Approve", variant: "default" },
  "standard-review": { label: "Standard Review", variant: "secondary" },
  "enhanced-review": { label: "Enhanced Review", variant: "outline" },
  "siu-referral": { label: "SIU Referral", variant: "destructive" },
};

export const RiskScoring = ({ result }: Props) => {
  if (!result) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No claim analyzed yet</p>
          <p className="text-sm mt-1">Enter claim data above to generate a fraud risk score</p>
        </div>
      </Card>
    );
  }

  const config = riskLevelConfig[result.riskLevel];
  const RecIcon = config.icon;
  const rec = recommendationLabels[result.recommendation] || { label: result.recommendation, variant: "outline" as const };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <Card className={`border ${config.bg}`}>
          <CardContent className="pt-6 text-center">
            <div className={`text-6xl font-bold ${config.color}`}>{result.overallRiskScore}</div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <RecIcon className={`w-5 h-5 ${config.color}`} />
              <span className={`text-lg font-semibold ${config.color}`}>{config.label}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Confidence: {result.confidenceLevel}%</p>
          </CardContent>
        </Card>

        {/* Recommendation */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant={rec.variant} className="text-sm">{rec.label}</Badge>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.recommendationRationale}</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors */}
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
                  <Badge variant="outline" className="text-xs capitalize">{rf.weight} weight</Badge>
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
