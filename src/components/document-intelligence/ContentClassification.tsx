"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, FileText, PieChart, Tag } from "lucide-react";

interface ClassifiedDoc {
  name: string;
  category: string;
  subCategory: string;
  confidence: number;
  tags: string[];
  priority: "high" | "medium" | "low";
}

const categoryColors: Record<string, string> = {
  "Medical Records": "bg-primary text-primary-foreground",
  "Policy Documents": "bg-accent text-accent-foreground",
  "Legal": "bg-warning text-warning-foreground",
  "Financial": "bg-success text-success-foreground",
  "Claims Forms": "bg-primary text-primary-foreground",
  "Correspondence": "bg-muted text-muted-foreground",
};

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-muted text-muted-foreground border-border",
};

interface Props {
  result: any | null;
  fileName: string;
}

export const ContentClassification = ({ result, fileName }: Props) => {
  const results: ClassifiedDoc[] | null = result ? (result.documents || [result]) : null;

  const categoryStats = results
    ? Object.entries(results.reduce((acc, doc) => {
        acc[doc.category] = (acc[doc.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>))
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Document Classification
            </CardTitle>
            <CardDescription>AI-powered classification and tagging</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!results && (
              <div className="p-8 text-center text-muted-foreground">
                <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No document processed yet</p>
                <p className="text-xs mt-1">Use the upload area above to add a document</p>
              </div>
            )}
          </CardContent>
        </Card>

        {results && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-primary" />
                  Classification Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-4 rounded-lg bg-muted/50 mb-4">
                  <p className="text-3xl font-bold text-primary">{results.length}</p>
                  <p className="text-xs text-muted-foreground">Documents Classified</p>
                </div>
                {categoryStats.map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <Badge className={`text-xs ${categoryColors[cat] || "bg-muted text-muted-foreground"}`}>{cat}</Badge>
                    <span className="text-sm font-medium">{count as number}</span>
                  </div>
                ))}
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Confidence</span>
                    <span className="font-medium">
                      {(results.reduce((a, d) => a + d.confidence, 0) / results.length).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  Priority Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(["high", "medium", "low"] as const).map((p) => {
                  const count = results.filter((d) => d.priority === p).length;
                  return (
                    <div key={p} className="flex items-center justify-between p-3 rounded-lg border">
                      <Badge variant="outline" className={priorityColors[p]}>{p.charAt(0).toUpperCase() + p.slice(1)} Priority</Badge>
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {results && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Classified Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((doc, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg border bg-gradient-subtle hover:shadow-sm transition-shadow">
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${categoryColors[doc.category] || "bg-muted text-muted-foreground"}`}>{doc.category}</Badge>
                      <span className="text-xs text-muted-foreground">→ {doc.subCategory}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={priorityColors[doc.priority]}>{doc.priority}</Badge>
                    <span className="text-xs text-muted-foreground">{doc.confidence}% conf.</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
