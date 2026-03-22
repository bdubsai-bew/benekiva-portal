"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload, FileText, Brain, CheckCircle, AlertTriangle, UserCheck,
  Clock, Sparkles, Image, FileImage, X, Eye, ChevronRight,
  Stethoscope, Building2, Calendar, DollarSign, Hash,
} from "lucide-react";
import { useExtractedData } from "@/hooks/useExtractedData";

/* ── Mock data scenarios ── */
const MOCK_SCENARIOS = [
  {
    patient: "John Smith",
    dob: "1985-03-15",
    diagnosis: "Lumbar disc herniation",
    icd10: "M51.16",
    procedure: "Physical therapy",
    cpt: "97110",
    provider: "Dr. Sarah Chen, MD",
    facility: "Springfield Medical Center",
    serviceDate: "2026-03-15",
    totalCharges: "$12,450.00",
    policyNumber: "POL-2024-78901",
    claimType: "disability-std",
    description: "Lumbar disc herniation with radiculopathy requiring physical therapy and activity restrictions. Patient unable to perform occupational duties.",
  },
  {
    patient: "Margaret Williams",
    dob: "1958-11-22",
    diagnosis: "Alzheimer's Disease, Stage 3",
    icd10: "G30.9",
    procedure: "Cognitive behavioral assessment",
    cpt: "96116",
    provider: "Dr. Roberto Martinez, MD",
    facility: "Oakwood Memory Care Center",
    serviceDate: "2026-02-28",
    totalCharges: "$34,200.00",
    policyNumber: "POL-2023-45210",
    claimType: "ltc",
    description: "Progressive cognitive decline requiring 24-hour supervised care. Patient unable to perform 3 of 6 ADLs independently: bathing, dressing, transferring.",
  },
  {
    patient: "Robert Davis",
    dob: "1972-07-08",
    diagnosis: "Acute myocardial infarction",
    icd10: "I21.09",
    procedure: "Percutaneous coronary intervention",
    cpt: "92928",
    provider: "Dr. Anika Patel, MD",
    facility: "St. Luke's Heart Institute",
    serviceDate: "2026-01-20",
    totalCharges: "$47,830.00",
    policyNumber: "POL-2024-91347",
    claimType: "life",
    description: "Acute ST-elevation myocardial infarction treated with emergency PCI. Two drug-eluting stents placed in LAD artery. Patient in cardiac rehabilitation.",
  },
  {
    patient: "Susan Anderson",
    dob: "1990-05-30",
    diagnosis: "Major depressive disorder, recurrent, severe",
    icd10: "F33.2",
    procedure: "Psychiatric evaluation",
    cpt: "90792",
    provider: "Dr. James Holloway, MD",
    facility: "Riverside Behavioral Health",
    serviceDate: "2026-04-02",
    totalCharges: "$8,750.00",
    policyNumber: "POL-2025-12088",
    claimType: "disability-ltd",
    description: "Severe recurrent major depressive disorder with functional impairment preventing return to work. Currently in intensive outpatient program.",
  },
];

let scenarioIndex = 0;
function getNextScenario() {
  const s = MOCK_SCENARIOS[scenarioIndex % MOCK_SCENARIOS.length];
  scenarioIndex++;
  return s;
}

/* ── Extraction steps for animation ── */
const EXTRACTION_STEPS = [
  { label: "Extracting text from document…", icon: FileText, durationMs: 1500 },
  { label: "Analyzing document structure…", icon: Brain, durationMs: 1800 },
  { label: "Identifying claims data…", icon: Stethoscope, durationMs: 1600 },
  { label: "Mapping to form fields…", icon: Sparkles, durationMs: 1200 },
];

/* ── Component ── */
export const DocumentSummarization = () => {
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [stepsDone, setStepsDone] = useState<boolean[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [extractedScenario, setExtractedScenario] = useState<(typeof MOCK_SCENARIOS)[0] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [autoFillTriggered, setAutoFillTriggered] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setExtractedData } = useExtractedData();

  /* ── Upload handlers ── */
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setUploadedFile({ name: f.name, size: f.size, type: f.type });
    setShowResults(false);
    setExtractedScenario(null);
    setAutoFillTriggered(false);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSampleClick = (name: string) => {
    setUploadedFile({ name, size: Math.floor(Math.random() * 3000000) + 500000, type: "application/pdf" });
    setShowResults(false);
    setExtractedScenario(null);
    setAutoFillTriggered(false);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setShowResults(false);
    setExtractedScenario(null);
    setAutoFillTriggered(false);
    setIsProcessing(false);
    setCurrentStepIdx(-1);
    setStepsDone([]);
    setOverallProgress(0);
  };

  /* ── Process / extraction animation ── */
  const startExtraction = () => {
    if (!uploadedFile) return;
    setIsProcessing(true);
    setShowResults(false);
    setExtractedScenario(null);
    setAutoFillTriggered(false);
    setCurrentStepIdx(0);
    setStepsDone(EXTRACTION_STEPS.map(() => false));
    setOverallProgress(0);
  };

  useEffect(() => {
    if (!isProcessing || currentStepIdx < 0) return;
    if (currentStepIdx >= EXTRACTION_STEPS.length) {
      // All steps done
      const scenario = getNextScenario();
      setExtractedScenario(scenario);
      setIsProcessing(false);
      setShowResults(true);
      setOverallProgress(100);
      return;
    }
    const step = EXTRACTION_STEPS[currentStepIdx];
    // Animate progress smoothly
    const startPct = (currentStepIdx / EXTRACTION_STEPS.length) * 100;
    const endPct = ((currentStepIdx + 1) / EXTRACTION_STEPS.length) * 100;
    const intervalMs = 50;
    const ticks = step.durationMs / intervalMs;
    let tick = 0;
    const iv = setInterval(() => {
      tick++;
      setOverallProgress(startPct + ((endPct - startPct) * tick) / ticks);
    }, intervalMs);
    const timeout = setTimeout(() => {
      clearInterval(iv);
      setOverallProgress(endPct);
      setStepsDone((prev) => {
        const next = [...prev];
        next[currentStepIdx] = true;
        return next;
      });
      setCurrentStepIdx((i) => i + 1);
    }, step.durationMs);
    return () => {
      clearInterval(iv);
      clearTimeout(timeout);
    };
  }, [isProcessing, currentStepIdx]);

  /* ── Auto-fill handler ── */
  const handleAutoFill = () => {
    if (!extractedScenario) return;
    const nameParts = extractedScenario.patient.split(" ");
    setExtractedData({
      firstName: nameParts[0] || null,
      lastName: nameParts.slice(1).join(" ") || null,
      dateOfBirth: extractedScenario.dob,
      policyNumber: extractedScenario.policyNumber,
      claimType: extractedScenario.claimType,
      diagnosis: extractedScenario.diagnosis,
      dateOfLoss: extractedScenario.serviceDate,
      description: extractedScenario.description,
    });
    setAutoFillTriggered(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes > 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    return `${(bytes / 1_000).toFixed(0)} KB`;
  };

  const fileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="w-5 h-5 text-blue-500" />;
    return <FileText className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ──── LEFT: Upload Panel ──── */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Document Upload
            </CardTitle>
            <CardDescription>
              Upload medical records, claim forms, or supporting documents. AI will extract claims data automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {/* Drop zone */}
            {!uploadedFile && (
              <div
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                  dragOver
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium">Drop files here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF, JPG, PNG — up to 50 MB
                </p>
                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>
                  <span className="flex items-center gap-1"><Image className="w-3 h-3" /> JPG</span>
                  <span className="flex items-center gap-1"><FileImage className="w-3 h-3" /> PNG</span>
                </div>
              </div>
            )}

            {/* File preview */}
            {uploadedFile && !isProcessing && !showResults && (
              <div className="rounded-xl border p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                  {fileIcon(uploadedFile.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearFile}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {showPreview && (
                  <div className="rounded-lg bg-muted/50 p-6 text-center text-sm text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    Document preview placeholder
                  </div>
                )}
                <Button className="w-full" onClick={startExtraction}>
                  <Brain className="w-4 h-4 mr-2" />
                  Extract Claims Data with AI
                </Button>
              </div>
            )}

            {/* Processing animation */}
            {isProcessing && (
              <div className="rounded-xl border p-5 space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3 mb-1">
                  {fileIcon(uploadedFile?.type || "")}
                  <span className="text-sm font-medium truncate">{uploadedFile?.name}</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
                <div className="space-y-2">
                  {EXTRACTION_STEPS.map((step, i) => {
                    const StepIcon = step.icon;
                    const isDone = stepsDone[i];
                    const isActive = i === currentStepIdx;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 ${
                          isActive ? "bg-primary/5 border border-primary/20" : isDone ? "bg-success/5" : "opacity-40"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle className="w-4 h-4 text-success shrink-0" />
                        ) : isActive ? (
                          <StepIcon className="w-4 h-4 text-primary animate-pulse shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-muted-foreground/30 shrink-0" />
                        )}
                        <span className={`text-sm ${isActive ? "font-medium text-primary" : isDone ? "text-success" : "text-muted-foreground"}`}>
                          {step.label}
                        </span>
                        {isDone && (
                          <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                            Done
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sample documents */}
            {!uploadedFile && (
              <div className="space-y-2 pt-4 border-t">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Demo Documents</p>
                {[
                  "Medical_Records_Patient_J_Smith.pdf",
                  "Disability_Assessment_Form_2024.pdf",
                  "Cardiac_Report_R_Davis.pdf",
                  "Psychiatric_Evaluation_S_Anderson.pdf",
                ].map((doc) => (
                  <button
                    key={doc}
                    onClick={() => handleSampleClick(doc)}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm group"
                  >
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <span className="flex-1">{doc}</span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ──── RIGHT: Results Panel ──── */}
      <div className="space-y-6">
        {!showResults && !isProcessing && (
          <Card className="flex items-center justify-center min-h-[400px]">
            <div className="text-center text-muted-foreground px-8">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 opacity-30" />
              </div>
              <p className="font-medium">No document analyzed yet</p>
              <p className="text-sm mt-1">Upload a document or select a demo file to see AI-powered data extraction</p>
            </div>
          </Card>
        )}

        {isProcessing && (
          <Card className="flex items-center justify-center min-h-[400px]">
            <div className="text-center px-8">
              <Brain className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
              <p className="font-medium">AI is processing your document…</p>
              <p className="text-sm text-muted-foreground mt-1">Extracting medical codes, patient data, and claim details</p>
            </div>
          </Card>
        )}

        {showResults && extractedScenario && (
          <ExtractedDataCard
            scenario={extractedScenario}
            fileName={uploadedFile?.name || "document.pdf"}
            onAutoFill={handleAutoFill}
            autoFillTriggered={autoFillTriggered}
            onReset={clearFile}
          />
        )}
      </div>
    </div>
  );
};

/* ── Extracted Data Card ── */
function ExtractedDataCard({
  scenario,
  fileName,
  onAutoFill,
  autoFillTriggered,
  onReset,
}: {
  scenario: (typeof MOCK_SCENARIOS)[0];
  fileName: string;
  onAutoFill: () => void;
  autoFillTriggered: boolean;
  onReset: () => void;
}) {
  const [visibleRows, setVisibleRows] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const rows = [
    { icon: <UserCheck className="w-4 h-4" />, label: "Patient", value: scenario.patient },
    { icon: <Calendar className="w-4 h-4" />, label: "Date of Birth", value: scenario.dob },
    { icon: <Stethoscope className="w-4 h-4" />, label: "Diagnosis", value: scenario.diagnosis },
    { icon: <Hash className="w-4 h-4" />, label: "ICD-10 Code", value: scenario.icd10 },
    { icon: <Stethoscope className="w-4 h-4" />, label: "Procedure", value: `${scenario.procedure} (CPT ${scenario.cpt})` },
    { icon: <UserCheck className="w-4 h-4" />, label: "Provider", value: scenario.provider },
    { icon: <Building2 className="w-4 h-4" />, label: "Facility", value: scenario.facility },
    { icon: <Calendar className="w-4 h-4" />, label: "Service Date", value: scenario.serviceDate },
    { icon: <DollarSign className="w-4 h-4" />, label: "Total Charges", value: scenario.totalCharges },
  ];

  // Animate rows appearing one by one
  useEffect(() => {
    if (visibleRows >= rows.length) {
      setTimeout(() => setShowSuccess(true), 300);
      return;
    }
    const timer = setTimeout(() => setVisibleRows((v) => v + 1), 120);
    return () => clearTimeout(timer);
  }, [visibleRows, rows.length]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      {/* Header card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-semibold">Extraction Complete</p>
                <p className="text-xs text-muted-foreground">{fileName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                98% confidence
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                6.1s
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extracted data card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Extracted Claims Data
          </CardTitle>
          <CardDescription>AI-identified fields from your document</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 ${
                i < visibleRows ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              } ${i < visibleRows ? "bg-muted/30" : ""}`}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="text-primary shrink-0">{row.icon}</div>
              <span className="text-xs font-medium text-muted-foreground w-28 shrink-0">{row.label}</span>
              <span className="text-sm font-medium flex-1">{i < visibleRows ? row.value : ""}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action buttons */}
      {showSuccess && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
          {!autoFillTriggered ? (
            <Button className="w-full h-12 text-base" onClick={onAutoFill}>
              <Sparkles className="w-5 h-5 mr-2" />
              Auto-Fill Claims Intake Form
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-success/30 bg-success/5 animate-in fade-in">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-semibold text-success">Form Auto-Filled Successfully</p>
                <p className="text-xs text-muted-foreground">Switch to Claims Intake tab to review the populated fields</p>
              </div>
            </div>
          )}
          <Button variant="outline" className="w-full" onClick={onReset}>
            Upload Another Document
          </Button>
        </div>
      )}
    </div>
  );
}
