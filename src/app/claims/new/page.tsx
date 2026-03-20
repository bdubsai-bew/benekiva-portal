"use client";

import { useState } from "react";
import PortalShell from "@/components/portal-shell";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DocumentSummarization } from "@/components/claims/DocumentSummarization";
import { ClaimsIntakeWizard } from "@/components/claims/ClaimsIntakeWizard";

type View = "upload" | "intake";

export default function NewClaimPage() {
  const [view, setView] = useState<View>("upload");

  return (
    <PortalShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/claims">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">New Claim (FNOL)</h1>
              <p className="text-muted-foreground">First Notice of Loss — upload documents or fill the intake form</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("upload")}
            >
              Document Upload
            </Button>
            <Button
              variant={view === "intake" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("intake")}
            >
              Claims Intake
            </Button>
          </div>
        </div>

        {view === "upload" && <DocumentSummarization />}
        {view === "intake" && <ClaimsIntakeWizard />}
      </div>
    </PortalShell>
  );
}
