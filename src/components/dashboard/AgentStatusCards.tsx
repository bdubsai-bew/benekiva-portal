"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileSearch, ShieldCheck, ClipboardCheck, Zap } from "lucide-react";

interface AgentInfo {
  name: string;
  icon: React.ReactNode;
  docsToday: number;
  label: string;
  avgTime: string;
  alertsToday?: number;
}

const AGENTS: AgentInfo[] = [
  { name: "Document Intelligence Agent", icon: <FileSearch className="h-5 w-5" />, docsToday: 847, label: "docs processed today", avgTime: "2.1s" },
  { name: "Fraud Detection Agent", icon: <ShieldCheck className="h-5 w-5" />, docsToday: 0, label: "alerts today", avgTime: "1.4s", alertsToday: 0 },
  { name: "Underwriting Agent", icon: <ClipboardCheck className="h-5 w-5" />, docsToday: 23, label: "policies validated", avgTime: "3.2s" },
  { name: "Auto-Adjudication Engine", icon: <Zap className="h-5 w-5" />, docsToday: 18, label: "claims auto-approved", avgTime: "4.7s" },
];

export function AgentStatusCards() {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => !p), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {AGENTS.map((agent) => (
        <Card key={agent.name} className="border-primary/10 hover:shadow-md transition-shadow">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative">
                <span className={`absolute -top-0.5 -left-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ${pulse ? "animate-ping" : ""}`} />
                <span className="absolute -top-0.5 -left-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[11px] font-medium text-emerald-600 ml-2">Active</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary">{agent.icon}</div>
              <h3 className="text-sm font-semibold leading-tight">{agent.name}</h3>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="text-foreground font-bold text-lg">{agent.docsToday.toLocaleString()}</span> {agent.label}</p>
              <p>Avg processing: <span className="font-medium text-foreground">{agent.avgTime}</span></p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
