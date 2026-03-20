"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Users, AlertTriangle } from "lucide-react";

interface Entity {
  id: string;
  name: string;
  type: string;
  riskIndicator: "low" | "medium" | "high";
}

interface Connection {
  from: string;
  to: string;
  relationship: string;
  strength: "weak" | "moderate" | "strong";
  suspicious: boolean;
  reason: string;
}

interface Cluster {
  id: string;
  name: string;
  entityIds: string[];
  riskLevel: "low" | "medium" | "high";
  description: string;
}

interface NetworkAnalysisResult {
  entities: Entity[];
  connections: Connection[];
  clusters: Cluster[];
  networkRiskScore: number;
  summary: string;
}

interface Props {
  result: NetworkAnalysisResult | null;
}

const typeColors: Record<string, string> = {
  claimant: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  provider: "bg-purple-500/10 text-purple-700 border-purple-500/30",
  witness: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  attorney: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  adjuster: "bg-cyan-500/10 text-cyan-700 border-cyan-500/30",
  facility: "bg-rose-500/10 text-rose-700 border-rose-500/30",
};

const riskColors = {
  low: "text-green-600",
  medium: "text-yellow-600",
  high: "text-destructive",
};

export const NetworkAnalysis = ({ result }: Props) => {
  if (!result) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <Network className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No network analysis yet</p>
          <p className="text-sm mt-1">Enter claim data above to map entity relationships and detect fraud rings</p>
        </div>
      </Card>
    );
  }

  const entityMap = Object.fromEntries(result.entities.map((e) => [e.id, e]));

  return (
    <div className="space-y-6">
      {/* Network Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className={`text-5xl font-bold ${result.networkRiskScore >= 70 ? "text-destructive" : result.networkRiskScore >= 40 ? "text-yellow-600" : "text-green-600"}`}>
              {result.networkRiskScore}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Network Risk Score</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Network Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
          </CardContent>
        </Card>
      </div>

      {/* Entities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Entities ({result.entities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {result.entities.map((entity) => (
              <div
                key={entity.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${typeColors[entity.type] || "bg-muted border-border"}`}
              >
                <span className="font-medium">{entity.name}</span>
                <Badge variant="outline" className="text-xs capitalize">{entity.type}</Badge>
                <span className={`text-xs font-semibold ${riskColors[entity.riskIndicator]}`}>
                  {entity.riskIndicator}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connections */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            Connections ({result.connections.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {result.connections.map((conn, i) => {
            const fromEntity = entityMap[conn.from];
            const toEntity = entityMap[conn.to];
            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${conn.suspicious ? "border-destructive/30 bg-destructive/5" : "bg-muted/30"}`}
              >
                <Badge variant="outline" className="text-xs shrink-0">{fromEntity?.name || conn.from}</Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>—</span>
                  <span className="italic">{conn.relationship}</span>
                  <span>—</span>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">{toEntity?.name || conn.to}</Badge>
                <Badge variant={conn.suspicious ? "destructive" : "secondary"} className="text-xs ml-auto capitalize">
                  {conn.strength}
                </Badge>
                {conn.suspicious && <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Clusters */}
      {result.clusters.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Detected Clusters / Potential Rings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.clusters.map((cluster) => (
              <div key={cluster.id} className="p-3 rounded-lg border bg-muted/30 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{cluster.name}</span>
                  <Badge variant={cluster.riskLevel === "high" ? "destructive" : cluster.riskLevel === "medium" ? "secondary" : "outline"} className="text-xs capitalize">
                    {cluster.riskLevel} risk
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{cluster.description}</p>
                <div className="flex flex-wrap gap-1">
                  {cluster.entityIds.map((eid) => (
                    <Badge key={eid} variant="outline" className="text-xs">{entityMap[eid]?.name || eid}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
