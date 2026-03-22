"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ChevronRight, ClipboardList, FileText, Shield, UserCheck, User, Sparkles } from "lucide-react";
import { useExtractedData } from "@/hooks/useExtractedData";

const steps = [
  { id: 1, title: "Claimant Info", icon: User },
  { id: 2, title: "Claim Details", icon: ClipboardList },
  { id: 3, title: "Documents", icon: FileText },
  { id: 4, title: "Verification", icon: Shield },
  { id: 5, title: "Review & Submit", icon: CheckCircle },
];

export const ClaimsIntakeWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const { extractedData } = useExtractedData();
  const [autoFilled, setAutoFilled] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", policyNumber: "", dob: "",
    claimType: "", dateOfLoss: "", description: "",
    documents: [] as string[],
  });

  const [fillingField, setFillingField] = useState<string | null>(null);
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());

  // Animated auto-fill from extracted data
  useEffect(() => {
    if (!extractedData || autoFilled) return;

    const fieldsToFill: { key: string; value: string }[] = [
      { key: "firstName", value: extractedData.firstName || "" },
      { key: "lastName", value: extractedData.lastName || "" },
      { key: "dob", value: extractedData.dateOfBirth || "" },
      { key: "policyNumber", value: extractedData.policyNumber || "" },
      { key: "claimType", value: extractedData.claimType || "" },
      { key: "dateOfLoss", value: extractedData.dateOfLoss || "" },
      { key: "description", value: extractedData.description || "" },
    ].filter((f) => f.value);

    let i = 0;
    const fillNext = () => {
      if (i >= fieldsToFill.length) {
        setFillingField(null);
        setAutoFilled(true);
        return;
      }
      const { key, value } = fieldsToFill[i];
      setFillingField(key);

      // Animate typing character by character (fast for demo)
      let charIdx = 0;
      const typeInterval = setInterval(() => {
        charIdx++;
        const partial = value.slice(0, charIdx);
        setFormData((prev) => ({ ...prev, [key]: partial }));
        if (charIdx >= value.length) {
          clearInterval(typeInterval);
          setFilledFields((prev) => new Set(prev).add(key));
          setFillingField(null);
          i++;
          setTimeout(fillNext, 150);
        }
      }, 25);
    };

    // Small delay before starting
    const timeout = setTimeout(fillNext, 400);
    return () => clearTimeout(timeout);
  }, [extractedData, autoFilled]);

  const updateField = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-semibold">Claim Submitted Successfully</h2>
          <p className="text-muted-foreground">Claim <span className="font-mono font-bold">#CL-2024-3458</span> is now being processed by the Claims Automation Agent.</p>
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg border border-accent/30 bg-accent/5">
            <UserCheck className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">Humanomation™ review will be triggered if AI confidence is below 90%</span>
          </div>
          <div className="pt-4 space-y-2">
            {["Document Analysis", "Data Verification", "Risk Assessment", "Adjudicator Assignment"].map((step, i) => (
              <div key={step} className="flex items-center gap-3 p-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-primary text-primary-foreground animate-pulse" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <span className={`text-sm ${i === 0 ? "font-medium" : "text-muted-foreground"}`}>{step}</span>
                {i === 0 && <Badge className="ml-auto text-xs">In Progress</Badge>}
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => { setSubmitted(false); setCurrentStep(1); setAutoFilled(false); }} className="mt-4">
            Submit Another Claim
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isFieldAutoFilled = (field: string) => filledFields.has(field);
  const isFieldFilling = (field: string) => fillingField === field;

  const AutoFillBadge = ({ field }: { field: string }) => {
    if (isFieldFilling(field)) {
      return (
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-2 gap-1 animate-pulse bg-primary/10 text-primary">
          <Sparkles className="w-2.5 h-2.5" />
          Filling…
        </Badge>
      );
    }
    if (isFieldAutoFilled(field)) {
      return (
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-2 gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          AI Extracted
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Auto-fill banner */}
      {autoFilled && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm">
            <strong>AI Auto-Fill:</strong> Patient data has been extracted from the uploaded document. Review and adjust as needed.
          </span>
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const StepIcon = step.icon;
          const isActive = step.id === currentStep;
          const isComplete = step.id < currentStep;
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isComplete ? "bg-success text-success-foreground" : isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {isComplete ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </div>
                <span className={`text-xs hidden sm:inline ${isActive ? "font-semibold" : "text-muted-foreground"}`}>{step.title}</span>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Enter the claimant's personal information"}
            {currentStep === 2 && "Provide details about the claim"}
            {currentStep === 3 && "Attach supporting documents"}
            {currentStep === 4 && "AI-powered data verification"}
            {currentStep === 5 && "Review and submit the claim"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center">First Name <AutoFillBadge field="firstName" /></Label>
                  <Input placeholder="John" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} className={isFieldFilling("firstName") ? "border-primary bg-primary/10 ring-2 ring-primary/30" : isFieldAutoFilled("firstName") ? "border-primary/40 bg-primary/5" : ""} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center">Last Name <AutoFillBadge field="lastName" /></Label>
                  <Input placeholder="Smith" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} className={isFieldFilling("lastName") ? "border-primary bg-primary/10 ring-2 ring-primary/30" : isFieldAutoFilled("lastName") ? "border-primary/40 bg-primary/5" : ""} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center">Policy Number <AutoFillBadge field="policyNumber" /></Label>
                  <Input placeholder="POL-2024-XXXXX" value={formData.policyNumber} onChange={(e) => updateField("policyNumber", e.target.value)} className={isFieldFilling("policyNumber") ? "border-primary bg-primary/10 ring-2 ring-primary/30" : isFieldAutoFilled("policyNumber") ? "border-primary/40 bg-primary/5" : ""} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center">Date of Birth <AutoFillBadge field="dob" /></Label>
                  <Input type="date" value={formData.dob} onChange={(e) => updateField("dob", e.target.value)} className={isFieldFilling("dob") ? "border-primary bg-primary/10 ring-2 ring-primary/30" : isFieldAutoFilled("dob") ? "border-primary/40 bg-primary/5" : ""} />
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label className="flex items-center">Claim Type <AutoFillBadge field="claimType" /></Label>
                <select
                  value={formData.claimType}
                  onChange={(e) => updateField("claimType", e.target.value)}
                  className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ${isFieldAutoFilled("claimType") ? "border-primary/40 bg-primary/5" : ""}`}
                >
                  <option value="">Select claim type</option>
                  <option value="ltc">Long-Term Care</option>
                  <option value="disability-std">Short-Term Disability</option>
                  <option value="disability-ltd">Long-Term Disability</option>
                  <option value="life">Life Insurance</option>
                  <option value="annuity">Annuity</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">Date of Loss / Onset <AutoFillBadge field="dateOfLoss" /></Label>
                <Input type="date" value={formData.dateOfLoss} onChange={(e) => updateField("dateOfLoss", e.target.value)} className={isFieldFilling("dateOfLoss") ? "border-primary bg-primary/10 ring-2 ring-primary/30" : isFieldAutoFilled("dateOfLoss") ? "border-primary/40 bg-primary/5" : ""} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">Description <AutoFillBadge field="description" /></Label>
                <textarea
                  placeholder="Describe the nature of the claim…"
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground ${isFieldAutoFilled("description") ? "border-primary/40 bg-primary/5" : ""}`}
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-xl p-8 text-center border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setFormData((prev) => ({ ...prev, documents: [...prev.documents, "Medical_Records.pdf"] }))}
              >
                <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Click to upload supporting documents</p>
                <p className="text-xs text-muted-foreground">Medical records, physician statements, assessment forms</p>
              </div>
              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  {formData.documents.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm">{doc}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">Uploaded</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">The AI agent has automatically verified the following data points:</p>
              {[
                { label: "Policy Status", value: "Active — Premium current", status: "pass" },
                { label: "Claimant Identity", value: "Verified against policy records", status: "pass" },
                { label: "Coverage Eligibility", value: "LTC benefit rider active since 2019", status: "pass" },
                { label: "Waiting Period", value: "90-day elimination period satisfied", status: "pass" },
                { label: "Prior Claims", value: "No prior LTC claims on file", status: "pass" },
                { label: "Document Completeness", value: "Physician statement missing — request sent", status: "warning" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                  <Badge variant={item.status === "pass" ? "default" : "secondary"} className={item.status === "pass" ? "bg-success border-0" : "bg-warning text-warning-foreground border-0"}>
                    {item.status === "pass" ? "Verified" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Claimant</p>
                  <p className="font-medium">{formData.firstName || "John"} {formData.lastName || "Smith"}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Policy</p>
                  <p className="font-medium">{formData.policyNumber || "POL-2024-78901"}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Claim Type</p>
                  <p className="font-medium">{formData.claimType === "ltc" ? "Long-Term Care" : formData.claimType || "Long-Term Care"}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Documents</p>
                  <p className="font-medium">{formData.documents.length || 1} attached</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg border border-accent/30 bg-accent/5">
                <UserCheck className="w-4 h-4 text-accent" />
                <span className="text-xs text-accent">Humanomation™ will route this claim to a human adjudicator if the AI identifies risk flags or low confidence.</span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)} disabled={currentStep === 1}>
              Back
            </Button>
            {currentStep < 5 ? (
              <Button onClick={() => setCurrentStep((s) => s + 1)}>
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Submit Claim
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
