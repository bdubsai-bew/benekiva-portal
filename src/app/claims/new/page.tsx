"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Upload, Bot, Loader2 } from "lucide-react";
import Link from "next/link";

type Step = "info" | "details" | "documents" | "review" | "processing" | "complete";

const STEPS: { key: Step; label: string }[] = [
  { key: "info", label: "Claimant Info" },
  { key: "details", label: "Claim Details" },
  { key: "documents", label: "Documents" },
  { key: "review", label: "Review" },
];

interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
  policyNumber: string;
  claimType: string;
  dateOfLoss: string;
  description: string;
  documents: string[];
}

export default function NewClaimPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("info");
  const [processing, setProcessing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiSteps, setAiSteps] = useState<string[]>([]);
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    dob: "",
    policyNumber: "",
    claimType: "LTC",
    dateOfLoss: "",
    description: "",
    documents: [],
  });

  const update = (field: keyof FormData, value: string) => setForm((f) => ({ ...f, [field]: value }));
  const currentIdx = STEPS.findIndex((s) => s.key === step);

  const next = () => {
    if (step === "review") {
      simulateAI();
    } else {
      setStep(STEPS[currentIdx + 1].key);
    }
  };
  const prev = () => setStep(STEPS[currentIdx - 1].key);

  const simulateAI = () => {
    setStep("processing");
    setProcessing(true);
    const steps = [
      "Extracting document data...",
      "Verifying policy eligibility...",
      "Running fraud detection model...",
      "Calculating risk score...",
      "Generating AI recommendation...",
      "Processing complete!",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setAiSteps((prev) => [...prev, steps[i]]);
        setAiProgress(((i + 1) / steps.length) * 100);
        i++;
      } else {
        clearInterval(interval);
        setProcessing(false);
        setStep("complete");
      }
    }, 800);
  };

  const addDoc = (name: string) => {
    if (name && !form.documents.includes(name)) {
      setForm((f) => ({ ...f, documents: [...f.documents, name] }));
    }
  };

  if (step === "processing") {
    return (
      <PortalShell>
        <div className="max-w-lg mx-auto py-12 space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Bot className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold">AI Processing Claim</h1>
            <p className="text-muted-foreground mt-1">Our AI agents are analyzing your submission</p>
          </div>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Progress value={aiProgress} />
              <div className="space-y-2">
                {aiSteps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{s}</span>
                  </div>
                ))}
                {processing && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </PortalShell>
    );
  }

  if (step === "complete") {
    return (
      <PortalShell>
        <div className="max-w-lg mx-auto py-12 space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Claim Submitted Successfully</h1>
          <p className="text-muted-foreground">Claim CLM-2024-0899 has been created and processed by AI.</p>

          <Card className="text-left">
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">AI Confidence</span><span className="font-bold">92%</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Risk Score</span><span className="font-bold text-green-600">15</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Fraud Probability</span><span className="font-bold">4%</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Recommendation</span><span className="font-bold">Approve — All criteria met</span></div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-center">
            <Link href="/claims/CLM-2024-0891"><Button>View Claim Details</Button></Link>
            <Link href="/dashboard"><Button variant="outline">Back to Dashboard</Button></Link>
          </div>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/claims"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button></Link>
          <div>
            <h1 className="text-2xl font-bold">New Claim (FNOL)</h1>
            <p className="text-muted-foreground">First Notice of Loss intake wizard</p>
          </div>
        </div>

        {/* Progress steps */}
        <div className="flex gap-1">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= currentIdx ? "bg-primary" : "bg-muted"}`} />
              <p className={`text-xs mt-1 ${i <= currentIdx ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s.label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentIdx].label}</CardTitle>
            <CardDescription>
              {step === "info" && "Enter the claimant's personal information"}
              {step === "details" && "Provide claim details and circumstances"}
              {step === "documents" && "Upload or attach supporting documents"}
              {step === "review" && "Review all information before submission"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "info" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Margaret" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Thompson" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Policy Number</Label>
                    <Input value={form.policyNumber} onChange={(e) => update("policyNumber", e.target.value)} placeholder="MLI-78234-LTC" />
                  </div>
                </div>
              </>
            )}

            {step === "details" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Claim Type</Label>
                    <select
                      value={form.claimType}
                      onChange={(e) => update("claimType", e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="LTC">Long-Term Care (LTC)</option>
                      <option value="STD">Short-Term Disability (STD)</option>
                      <option value="LTD">Long-Term Disability (LTD)</option>
                      <option value="Life">Life Insurance</option>
                      <option value="Annuity">Annuity</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Loss</Label>
                    <Input type="date" value={form.dateOfLoss} onChange={(e) => update("dateOfLoss", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    rows={4}
                    placeholder="Describe the circumstances of the claim..."
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground"
                  />
                </div>
              </>
            )}

            {step === "documents" && (
              <>
                <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">Drag & drop files or click to upload</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["Physician Statement", "Medical Records", "Policy Certificate", "Death Certificate", "Hospital Records"].map((doc) => (
                      <Button key={doc} size="sm" variant="outline" onClick={() => addDoc(doc)} disabled={form.documents.includes(doc)}>
                        + {doc}
                      </Button>
                    ))}
                  </div>
                </div>
                {form.documents.length > 0 && (
                  <div className="space-y-2">
                    <Label>Attached Documents</Label>
                    <div className="flex flex-wrap gap-2">
                      {form.documents.map((d) => (
                        <Badge key={d} variant="secondary" className="gap-1">
                          {d}
                          <button onClick={() => setForm((f) => ({ ...f, documents: f.documents.filter((x) => x !== d) }))} className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {step === "review" && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{form.firstName} {form.lastName}</span></div>
                  <div><span className="text-muted-foreground">DOB:</span> <span className="font-medium">{form.dob || "—"}</span></div>
                  <div><span className="text-muted-foreground">Policy:</span> <span className="font-medium font-mono">{form.policyNumber || "—"}</span></div>
                  <div><span className="text-muted-foreground">Type:</span> <Badge variant="secondary">{form.claimType}</Badge></div>
                  <div><span className="text-muted-foreground">Date of Loss:</span> <span className="font-medium">{form.dateOfLoss || "—"}</span></div>
                  <div><span className="text-muted-foreground">Documents:</span> <span className="font-medium">{form.documents.length} attached</span></div>
                </div>
                {form.description && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Description:</span>
                    <p className="mt-1">{form.description}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={prev} disabled={currentIdx === 0}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button onClick={next}>
            {step === "review" ? "Submit Claim" : "Next"} <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </PortalShell>
  );
}
