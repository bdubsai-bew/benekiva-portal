"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Lightbulb, Link2, AlertTriangle } from "lucide-react";

interface SemanticResult {
  overallSentiment: string;
  topics: { topic: string; relevance: number }[];
  keyPhrases: string[];
  relationships: { from: string; relation: string; to: string }[];
  anomalies: string[];
  summary: string;
}

interface Props {
  result: SemanticResult | null;
  fileName: string;
}

export const SemanticAnalysis = ({ result, fileName }: Props) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Semantic Document Analysis
            </CardTitle>
            <CardDescription>Deep semantic analysis — topics, relationships, anomalies, and meaning extraction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result && (
              <div className="p-8 text-center text-muted-foreground">
                <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No document processed yet</p>
                <p className="text-xs mt-1">Use the upload area above to add a document</p>
              </div>
            )}

            {result && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Document</p>
                    <p className="font-semibold text-sm">{fileName}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
                  <p className="text-sm font-medium">{result.overallSentiment}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {!result && (
          <Card className="flex items-center justify-center min-h-[300px]">
            <div className="text-center text-muted-foreground">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No document analyzed yet</p>
              <p className="text-sm mt-1">Upload a document above to see real AI semantic analysis</p>
            </div>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Detected Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.topics.map((t, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{t.topic}</span>
                    <span className="text-muted-foreground">{t.relevance}%</span>
                  </div>
                  <Progress value={t.relevance} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Key Phrases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.keyPhrases.map((phrase) => (
                  <Badge key={phrase} variant="secondary" className="text-xs">{phrase}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Link2 className="w-4 h-4 text-primary" />
                Entity Relationships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.relationships.map((rel, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg border text-sm">
                  <Badge variant="outline" className="text-xs shrink-0">{rel.from}</Badge>
                  <span className="text-xs text-muted-foreground italic">{rel.relation}</span>
                  <Badge variant="outline" className="text-xs shrink-0">{rel.to}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {result.anomalies.length > 0 && (
            <Card className="border-warning/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-4 h-4" />
                  Detected Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.anomalies.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
