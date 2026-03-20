"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info, Flag } from "lucide-react";

interface RedFlag {
  id: string;
  severity: "info" | "warning" | "critical";
  category: string;
  title: string;
  description: string;
  evidence: string;
  actionRequired: string;
}

interface RedFlagsResult {
  flags: RedFlag[];
  summary: string;
  totalFlags: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
}

interface Props {
  result: RedFlagsResult | null;
}

const severityConfig = {
  critical: { icon: AlertTriangle, color: "text-destructive", bg: "border-destructive/30 bg-destructive/5", badge: "destructive" as const },
  warning: { icon: AlertCircle, color: "text-yellow-600", bg: "border-yellow-500/30 bg-yellow-500/5", badge: "secondary" as const },
  info: { icon: Info, color: "text-blue-600", bg: "border-blue-500/30 bg-blue-500/5", badge: "outline" as const },
};

export const RedFlagDetection = ({ result }: Props) => {
  if (!result) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <Flag className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No claim analyzed yet</p>
          <p className="text-sm mt-1">Enter claim data above to detect fraud red flags</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold">{result.totalFlags}</div>
            <p className="text-xs text-muted-foreground">Total Flags</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/20">
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold text-destructive">{result.criticalCount}</div>
            <p className="text-xs text-muted-foreground">Critical</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20">
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{result.warningCount}</div>
            <p className="text-xs text-muted-foreground">Warnings</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20">
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{result.infoCount}</div>
            <p className="text-xs text-muted-foreground">Info</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
        </CardContent>
      </Card>

      {/* Flag List */}
      <div className="space-y-3">
        {result.flags.map((flag) => {
          const cfg = severityConfig[flag.severity];
          const Icon = cfg.icon;
          return (
            <Card key={flag.id} className={`border ${cfg.bg}`}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${cfg.color}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{flag.title}</span>
                        <Badge variant={cfg.badge} className="text-xs capitalize">{flag.severity}</Badge>
                        <Badge variant="outline" className="text-xs">{flag.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{flag.description}</p>
                    </div>
                  </div>
                </div>
                <div className="ml-8 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-medium text-foreground">Evidence: </span>
                    <span className="text-muted-foreground">{flag.evidence}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Action: </span>
                    <span className="text-muted-foreground">{flag.actionRequired}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
