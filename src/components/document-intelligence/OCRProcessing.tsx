"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScanLine } from "lucide-react";

interface OCRResult {
  extractedText: string;
  confidence: number;
  detectedLanguages: string[];
  textBlocks: { type: string; content: string; confidence: number }[];
  pageCount: number;
}

interface Props {
  result: OCRResult | null;
  fileName: string;
}

export const OCRProcessing = ({ result, fileName }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-primary" />
            OCR Processing
          </CardTitle>
          <CardDescription>AI-powered text extraction from scanned documents, images, and PDFs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!result && (
            <div className="p-8 text-center text-muted-foreground">
              <ScanLine className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No document processed yet</p>
              <p className="text-xs mt-1">Use the upload area above to add a document</p>
            </div>
          )}

          {result && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Document</p>
                  <p className="font-semibold">{fileName}</p>
                </div>
                <Badge variant="outline" className="bg-primary text-primary-foreground border-0">
                  {result.pageCount} page{result.pageCount !== 1 ? "s" : ""}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-primary">{result.confidence}%</p>
                  <p className="text-xs text-muted-foreground">OCR Confidence</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{result.textBlocks.length}</p>
                  <p className="text-xs text-muted-foreground">Text Blocks</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-bold">{result.detectedLanguages.join(", ")}</p>
                  <p className="text-xs text-muted-foreground">Languages</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        {!result && (
          <Card className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-muted-foreground">
              <ScanLine className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No document scanned yet</p>
              <p className="text-sm mt-1">Upload a document above to see real AI-powered OCR results</p>
            </div>
          </Card>
        )}

        {result && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Detected Text Blocks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.textBlocks.map((block, i) => (
                  <div key={i} className="p-3 rounded-lg border bg-gradient-subtle">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="secondary" className="text-xs">{block.type}</Badge>
                      <Badge variant="secondary" className="text-xs">{block.confidence}% conf.</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{block.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Extracted Raw Text</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted/50 p-4 rounded-lg whitespace-pre-wrap font-mono max-h-[300px] overflow-auto">
                  {result.extractedText}
                </pre>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
