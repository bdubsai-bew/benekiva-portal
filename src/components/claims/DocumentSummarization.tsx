"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Brain, CheckCircle, AlertTriangle, UserCheck, Clock, Sparkles } from "lucide-react";
import { useExtractedData } from "@/hooks/useExtractedData";

interface SummaryResult {
  documentName: string;
  claimType: string;
  keyFindings: { label: string; value: string; confidence: number }[];
  riskFlags: string[];
  recommendation: string;
  confidenceScore: number;
  humanReviewRequired: boolean;
  processingTime: string;
}

const mockSummary: SummaryResult = {
  documentName: "Medical_Records_Patient_J_Smith.pdf",
  claimType: "Long-Term Care",
  keyFindings: [
    { label: "Primary Diagnosis", value: "Alzheimer's Disease, Stage 3 — progressive cognitive decline documented over 18 months", confidence: 96 },
    { label: "Functional Limitations", value: "Unable to perform 3 of 6 ADLs independently: bathing, dressing, transferring", confidence: 92 },
    { label: "Treatment History", value: "Under care of Dr. Martinez (Neurology) since Jan 2023; current medications include Donepezil 10mg", confidence: 98 },
    { label: "Cognitive Assessment", value: "MMSE score: 14/30 (moderate impairment); CDR rating: 2.0", confidence: 94 },
    { label: "Care Plan", value: "24-hour supervised care recommended; patient currently in assisted living facility", confidence: 89 },
  ],
  riskFlags: [
    "Gap in medical records: Feb 2024 – Apr 2024 (2 months missing)",
    "Inconsistent dates between physician notes and lab results",
  ],
  recommendation: "Claim appears substantiated for LTC benefit activation. ADL limitations meet policy threshold (3+ of 6). Recommend approval pending resolution of documentation gap.",
  confidenceScore: 87,
  humanReviewRequired: true,
  processingTime: "12.4 seconds",
};

export const DocumentSummarization = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<"idle" | "extracting" | "done" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setExtractedData } = useExtractedData();

  const mockExtractData = (fileName: string) => {
    setExtractionStatus("extracting");
    setTimeout(() => {
      setExtractedData({
        firstName: "John",
        lastName: "Smith",
        dateOfBirth: "1952-03-15",
        policyNumber: "POL-2024-78901",
        claimType: "ltc",
        diagnosis: "Alzheimer's Disease, Stage 3",
        dateOfLoss: "2024-01-10",
        description: "Progressive cognitive decline requiring 24-hour supervised care. Patient unable to perform 3 of 6 ADLs independently.",
      });
      setExtractionStatus("done");
    }, 2000);
  };

  const processFile = async (file?: File) => {
    setIsProcessing(true);
    setProgress(0);
    setSummary(null);
    setExtractionStatus("idle");

    const steps = [
      { pct: 15, delay: 400 },
      { pct: 35, delay: 800 },
      { pct: 55, delay: 600 },
      { pct: 75, delay: 700 },
      { pct: 90, delay: 500 },
      { pct: 100, delay: 400 },
    ];

    let cumDelay = 0;
    steps.forEach(({ pct, delay }) => {
      cumDelay += delay;
      setTimeout(() => setProgress(pct), cumDelay);
    });

    // Mock extraction in parallel
    mockExtractData(file?.name || "sample.pdf");

    setTimeout(() => {
      setIsProcessing(false);
      setSummary(mockSummary);
    }, cumDelay + 300);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSampleClick = () => {
    processFile();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upload Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload Medical Documents
          </CardTitle>
          <CardDescription>
            Upload medical records, physician notes, or assessment forms for AI-powered summarization and data extraction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.rtf"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm font-medium">Drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOCX, TXT — up to 50MB
            </p>
            <p className="text-xs text-primary mt-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI will extract patient name &amp; DOB to auto-fill Claims Intake
            </p>
          </div>

          {isProcessing && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium">AI is analyzing the document…</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex flex-wrap gap-2">
                {["OCR Extraction", "Entity Recognition", "Clinical Classification", "Risk Analysis"].map((step, i) => (
                  <Badge
                    key={step}
                    variant={progress > (i + 1) * 25 ? "default" : "secondary"}
                    className="text-xs transition-all"
                  >
                    {progress > (i + 1) * 25 && <CheckCircle className="w-3 h-3 mr-1" />}
                    {step}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {extractionStatus === "extracting" && (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm">Extracting patient data with AI…</span>
            </div>
          )}
          {extractionStatus === "done" && (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-success/30 bg-success/5 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium">Patient data extracted — Claims Intake will be auto-filled</span>
            </div>
          )}

          {/* Sample documents */}
          <div className="space-y-2 pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground">SAMPLE DOCUMENTS</p>
            {["Medical_Records_Patient_J_Smith.pdf", "Disability_Assessment_Form_2024.pdf", "Physician_Statement_LTC.docx"].map((doc) => (
              <button
                key={doc}
                onClick={handleSampleClick}
                className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <FileText className="w-4 h-4 text-primary" />
                {doc}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Panel */}
      <div className="space-y-6">
        {!summary && !isProcessing && (
          <Card className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-muted-foreground">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No document analyzed yet</p>
              <p className="text-sm mt-1">Upload or select a sample document to see AI summarization</p>
            </div>
          </Card>
        )}

        {summary && (
          <>
            {/* Confidence & Meta */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Document</p>
                    <p className="font-semibold">{summary.documentName}</p>
                  </div>
                  <Badge variant="outline" className="bg-primary text-primary-foreground border-0">
                    {summary.claimType}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-primary">{summary.confidenceScore}%</p>
                    <p className="text-xs text-muted-foreground">AI Confidence</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">{summary.keyFindings.length}</p>
                    <p className="text-xs text-muted-foreground">Key Findings</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-bold">{summary.processingTime}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Processing Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Findings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Key Findings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {summary.keyFindings.map((finding, i) => (
                  <div key={i} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{finding.label}</span>
                      <Badge variant="secondary" className="text-xs">{finding.confidence}% conf.</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{finding.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Risk Flags */}
            {summary.riskFlags.length > 0 && (
              <Card className="border-warning/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-warning">
                    <AlertTriangle className="w-4 h-4" />
                    Risk Flags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {summary.riskFlags.map((flag, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Recommendation & Humanomation */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">AI Recommendation</p>
                  <p className="text-sm text-muted-foreground">{summary.recommendation}</p>
                </div>
                {summary.humanReviewRequired && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-accent/30 bg-accent/5">
                    <UserCheck className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-semibold text-accent">Humanomation™ — Review Required</p>
                      <p className="text-xs text-muted-foreground">
                        Risk flags detected. This claim has been routed to a human adjudicator for final review.
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button className="flex-1">Send to Adjudicator</Button>
                  <Button variant="outline" className="flex-1">Request More Documents</Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
