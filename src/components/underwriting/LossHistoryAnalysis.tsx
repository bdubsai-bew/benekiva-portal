"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, TrendingUp, AlertTriangle, CheckCircle, DollarSign } from "lucide-react";

interface LossHistoryResult {
  lossFrequency: string;
  lossSeverity: string;
  totalIncurredLosses: number;
  lossHistory: { date: string; type: string; amount: number; status: string; description: string }[];
  trendAnalysis: string;
  predictedFutureLosses: { nextYear: number; threeYear: number; confidence: number };
  redFlags: string[];
  mitigatingFactors: string[];
  recommendation: string;
  recommendationRationale: string;
}

interface Props {
  result: LossHistoryResult | null;
}

const recVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  acceptable: "default",
  conditional: "secondary",
  surcharge: "outline",
  decline: "destructive",
};

const freqColor: Record<string, string> = {
  none: "text-green-600",
  low: "text-green-600",
  moderate: "text-yellow-600",
  high: "text-orange-600",
  severe: "text-destructive",
};

export const LossHistoryAnalysis = ({ result }: Props) => {
  if (!result) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <History className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No loss history analyzed yet</p>
          <p className="text-sm mt-1">Run analysis to review loss patterns</p>
        </div>
      </Card>
    );
  }

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-xs text-muted-foreground uppercase">Frequency</p>
            <p className={`text-xl font-bold capitalize mt-1 ${freqColor[result.lossFrequency] || ""}`}>{result.lossFrequency}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-xs text-muted-foreground uppercase">Severity</p>
            <p className="text-xl font-bold capitalize mt-1">{result.lossSeverity}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-xs text-muted-foreground uppercase">Total Incurred</p>
            <p className="text-xl font-bold mt-1">{fmt(result.totalIncurredLosses)}</p>
          </CardContent>
        </Card>
        <Card className="border bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <p className="text-xs text-muted-foreground uppercase">Recommendation</p>
            <Badge variant={recVariant[result.recommendation] || "outline"} className="mt-2 capitalize">{result.recommendation}</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{result.trendAnalysis}</p>
          <p className="text-sm mt-3 leading-relaxed text-muted-foreground">{result.recommendationRationale}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Predicted Future Losses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg border bg-muted/30 text-center">
              <p className="text-xs text-muted-foreground">Next Year</p>
              <p className="text-lg font-bold mt-1">{fmt(result.predictedFutureLosses.nextYear)}</p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/30 text-center">
              <p className="text-xs text-muted-foreground">3-Year Cumulative</p>
              <p className="text-lg font-bold mt-1">{fmt(result.predictedFutureLosses.threeYear)}</p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/30 text-center">
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="text-lg font-bold mt-1">{result.predictedFutureLosses.confidence}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {result.lossHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Loss History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.lossHistory.map((loss, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{loss.type}</p>
                      <p className="text-xs text-muted-foreground">{loss.date} — {loss.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{fmt(loss.amount)}</span>
                    <Badge variant="outline" className="text-xs capitalize">{loss.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.redFlags.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-destructive flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Red Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.redFlags.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {result.mitigatingFactors.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-green-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Mitigating Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.mitigatingFactors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
