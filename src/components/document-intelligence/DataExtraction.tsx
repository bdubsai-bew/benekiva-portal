"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, ArrowRight } from "lucide-react";

interface ExtractedField {
  field: string;
  value: string;
  confidence: number;
  source: string;
}

interface ExtractionResult {
  documentType: string;
  overallConfidence: number;
  fields: ExtractedField[];
  rawEntities: { entity: string; type: string; count: number }[];
}

interface Props {
  result: ExtractionResult | null;
  fileName: string;
}

export const DataExtraction = ({ result, fileName }: Props) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Structured Data Extraction
            </CardTitle>
            <CardDescription>Extract structured fields, entities, and relationships from documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result && (
              <div className="p-8 text-center text-muted-foreground">
                <Database className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No document processed yet</p>
                <p className="text-xs mt-1">Use the upload area above to add a document</p>
              </div>
            )}
          </CardContent>
        </Card>

        {result && (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Document</p>
                  <p className="font-semibold text-sm">{fileName}</p>
                  <Badge variant="outline" className="mt-1 bg-primary text-primary-foreground border-0 text-xs">{result.documentType}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-primary">{result.overallConfidence}%</p>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">{result.fields.length}</p>
                    <p className="text-xs text-muted-foreground">Fields Extracted</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Named Entities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.rawEntities.map((ent, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg border text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">{ent.type}</Badge>
                      <span className="font-medium">{ent.entity}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{ent.count}×</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {result && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Extracted Fields</CardTitle>
            <CardDescription>Structured data automatically mapped from document content</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Extracted Value</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.fields.map((f, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{f.field}</TableCell>
                    <TableCell>{f.value}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{f.source}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-xs">{f.confidence}%</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex gap-2 pt-4">
              <Button variant="default" size="sm">
                <ArrowRight className="w-4 h-4 mr-1" />
                Send to Claims Intake
              </Button>
              <Button variant="outline" size="sm">Export as JSON</Button>
              <Button variant="outline" size="sm">Export as CSV</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
