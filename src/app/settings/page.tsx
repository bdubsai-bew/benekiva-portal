"use client";

import PortalShell from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <PortalShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Settings</h1>
          <p className="text-muted-foreground">Carrier configuration and account settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Name</Label><Input value={user?.name || ""} readOnly /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={user?.email || ""} readOnly /></div>
              <div className="space-y-2"><Label>Role</Label><Input value={user?.role || ""} readOnly /></div>
              <div className="space-y-2"><Label>Carrier</Label><Input value={user?.carrier || ""} readOnly /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Agent Configuration</CardTitle>
            <CardDescription>Thresholds for automated processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Auto-Approve Confidence Threshold</Label><Input type="number" defaultValue={90} /></div>
              <div className="space-y-2"><Label>Fraud Alert Threshold</Label><Input type="number" defaultValue={15} /></div>
              <div className="space-y-2"><Label>Risk Score Escalation</Label><Input type="number" defaultValue={40} /></div>
              <div className="space-y-2"><Label>Document Completeness Required</Label><Input type="number" defaultValue={90} /></div>
            </div>
            <Button>Save Configuration</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Licensed Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Claims Automation", "Document Intelligence", "Fraud Detection"].map((a) => (
                <div key={a} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium">{a}</span>
                  <Badge>Active</Badge>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium">Underwriting AI</span>
                <Badge variant="secondary">Training</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
