"use client";

import { useState, useRef, useCallback } from "react";
import PortalShell from "@/components/portal-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  ScanLine,
  FolderOpen,
  Database,
  Search,
  Upload,
  CheckCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { OCRProcessing } from "@/components/document-intelligence/OCRProcessing";
import { ContentClassification } from "@/components/document-intelligence/ContentClassification";
import { DataExtraction } from "@/components/document-intelligence/DataExtraction";
import { SemanticAnalysis } from "@/components/document-intelligence/SemanticAnalysis";
import { processDocumentWithAI } from "@/lib/documentProcessing";

interface AllResults {
  ocr: any | null;
  classification: any | null;
  extraction: any | null;
  semantic: any | null;
}

export default function DocumentIntelligencePage() {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState("");
  const [results, setResults] = useState<AllResults>({
    ocr: null,
    classification: null,
    extraction: null,
    semantic: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processAllModes = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setFileName(file.name);
    setResults({ ocr: null, classification: null, extraction: null, semantic: null });

    const modes = ["ocr", "classification", "extraction", "semantic"] as const;
    const labels = ["OCR Processing", "Classification", "Data Extraction", "Semantic Analysis"];
    const newResults: AllResults = { ocr: null, classification: null, extraction: null, semantic: null };

    for (let i = 0; i < modes.length; i++) {
      setProcessingStage(labels[i]);
      setProgress(Math.round((i / modes.length) * 100));
      try {
        const result = await processDocumentWithAI(file, modes[i]);
        newResults[modes[i]] = result;
        setResults({ ...newResults });
      } catch (e) {
        console.error(`${modes[i]} error:`, e);
      }
    }

    setProgress(100);
    setProcessingStage("Complete");
    setTimeout(() => setIsProcessing(false), 500);
  }, []);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      processAllModes(files[0]);
    }
  };

  return (
    <PortalShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Document Intelligence</h1>
            <p className="text-muted-foreground">
              OCR, Classification, Extraction &amp; Semantic Analysis
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.rtf,.png,.jpg,.jpeg,.tiff,.tif,.bmp,.webp,.csv"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            } ${isProcessing ? "pointer-events-none opacity-70" : ""}`}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFileSelect(e.dataTransfer.files);
            }}
          >
            <div className="flex items-center justify-center gap-3">
              {isProcessing ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-muted-foreground" />
              )}
              <div className="text-left">
                <p className="text-sm font-medium">
                  {isProcessing ? (
                    <>
                      Processing: <span className="text-primary">{fileName}</span> —{" "}
                      {processingStage}
                    </>
                  ) : fileName ? (
                    <>
                      Uploaded: <span className="text-primary">{fileName}</span> — click to
                      upload a new document
                    </>
                  ) : (
                    "Upload a document to run all analyses (OCR, Classification, Extraction, Semantic)"
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, images, text files — one upload runs all four analyses automatically
                </p>
              </div>
            </div>
            {isProcessing && (
              <div className="mt-3 max-w-md mx-auto space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-center gap-2">
                  {["OCR", "Classification", "Extraction", "Semantic"].map((label, i) => {
                    const modeKeys = ["ocr", "classification", "extraction", "semantic"] as const;
                    const done = !!results[modeKeys[i]];
                    const active =
                      processingStage ===
                      ["OCR Processing", "Classification", "Data Extraction", "Semantic Analysis"][i];
                    return (
                      <Badge
                        key={label}
                        variant={done ? "default" : active ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {done && <CheckCircle className="w-3 h-3 mr-1" />}
                        {active && !done && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                        {label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabbed Results */}
        <Tabs defaultValue="ocr" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-4">
            <TabsTrigger value="ocr" className="flex items-center gap-2">
              <ScanLine className="w-4 h-4" />
              OCR
              {results.ocr && <CheckCircle className="w-3 h-3 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="classification" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Classification
              {results.classification && <CheckCircle className="w-3 h-3 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="extraction" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Extraction
              {results.extraction && <CheckCircle className="w-3 h-3 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="semantic" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Semantic
              {results.semantic && <CheckCircle className="w-3 h-3 text-green-500" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ocr">
            <OCRProcessing result={results.ocr} fileName={fileName} />
          </TabsContent>
          <TabsContent value="classification">
            <ContentClassification result={results.classification} fileName={fileName} />
          </TabsContent>
          <TabsContent value="extraction">
            <DataExtraction result={results.extraction} fileName={fileName} />
          </TabsContent>
          <TabsContent value="semantic">
            <SemanticAnalysis result={results.semantic} fileName={fileName} />
          </TabsContent>
        </Tabs>
      </div>
    </PortalShell>
  );
}
