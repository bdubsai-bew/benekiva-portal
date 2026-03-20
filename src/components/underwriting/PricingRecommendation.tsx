"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";

interface PricingResult {
  recommendedPremium: { annual: number; monthly: number; currency: string };
  pricingBasis: string;
  rateAdjustments: { factor: string; adjustment: string; reason: string }[];
  competitivePosition: string;
  profitabilityOutlook: string;
  lossRatioEstimate: number;
  breakEvenPoint: string;
  pricingSensitivity: { scenario: string; premiumImpact: string; likelihood: string }[];
}

interface Props {
  result: PricingResult | null;
}

const positionColors: Record<string, string> = {
  "below-market": "text-green-600",
  "at-market": "text-blue-600",
  "above-market": "text-orange-600",
};

const outlookVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  strong: "default",
  moderate: "secondary",
  marginal: "outline",
  unprofitable: "destructive",
};

export const PricingRecommendation = ({ result }: Props) => {
  if (!result) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No pricing generated yet</p>
          <p className="text-sm mt-1">Run analysis to generate pricing recommendations</p>
        </div>
      </Card>
    );
  }

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: result.recommendedPremium.currency }).format(n);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Annual Premium</p>
            <div className="text-4xl font-bold text-primary mt-1">{fmt(result.recommendedPremium.annual)}</div>
            <p className="text-sm text-muted-foreground mt-1">{fmt(result.recommendedPremium.monthly)}/mo</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Competitive Position</span>
              <span className={`text-sm font-semibold capitalize ${positionColors[result.competitivePosition] || "text-foreground"}`}>
                {result.competitivePosition.replace("-", " ")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Profitability</span>
              <Badge variant={outlookVariant[result.profitabilityOutlook] || "outline"} className="capitalize">{result.profitabilityOutlook}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Loss Ratio Est.</span>
              <span className={`text-sm font-bold ${result.lossRatioEstimate > 75 ? "text-destructive" : result.lossRatioEstimate > 60 ? "text-yellow-600" : "text-green-600"}`}>
                {result.lossRatioEstimate}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Break-Even</p>
            <p className="text-lg font-semibold mt-1">{result.breakEvenPoint}</p>
            <p className="text-xs text-muted-foreground mt-3">Pricing Basis</p>
            <p className="text-sm mt-1 leading-relaxed">{result.pricingBasis}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Rate Adjustments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.rateAdjustments.map((adj, i) => {
              const isPositive = adj.adjustment.startsWith("+");
              const isNegative = adj.adjustment.startsWith("-");
              const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isPositive ? "text-destructive" : isNegative ? "text-green-600" : "text-muted-foreground"}`} />
                    <div>
                      <span className="font-medium text-sm">{adj.factor}</span>
                      <p className="text-xs text-muted-foreground">{adj.reason}</p>
                    </div>
                  </div>
                  <Badge variant={isPositive ? "destructive" : isNegative ? "default" : "outline"}>{adj.adjustment}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Sensitivity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.pricingSensitivity.map((s, i) => (
              <div key={i} className="p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{s.scenario}</span>
                  <Badge variant="outline" className="text-xs capitalize">{s.likelihood}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Impact: {s.premiumImpact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
