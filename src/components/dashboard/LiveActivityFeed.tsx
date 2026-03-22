"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";

interface FeedItem {
  id: string;
  emoji: string;
  agent: string;
  message: string;
  timestamp: number; // ms ago
  type: "success" | "warning" | "info" | "alert";
}

const FEED_TEMPLATES: Omit<FeedItem, "id" | "timestamp">[] = [
  { emoji: "🔍", agent: "Document Intelligence", message: "processed CLM-2026-0003 — extracted 47 data points (2.1s)", type: "success" },
  { emoji: "🛡️", agent: "Fraud Detection", message: "scanned CLM-2026-0007 — CLEAR (risk: 8/100)", type: "success" },
  { emoji: "📋", agent: "Underwriting AI", message: "validated CLM-2026-0005 — eligible, coverage $125,000 confirmed", type: "success" },
  { emoji: "⚡", agent: "Auto-Adjudication", message: "recommended APPROVE for CLM-2026-0001 ($12,450)", type: "success" },
  { emoji: "📄", agent: "OCR Engine", message: "processed medical_records_martinez.pdf — 99.2% accuracy", type: "info" },
  { emoji: "🔔", agent: "Fraud Detection", message: "CLM-2026-0008 flagged for manual review — unusual billing pattern", type: "alert" },
  { emoji: "🔍", agent: "Document Intelligence", message: "processed CLM-2026-0012 — extracted 31 data points (1.8s)", type: "success" },
  { emoji: "⚡", agent: "Auto-Adjudication", message: "recommended APPROVE for CLM-2026-0009 ($87,200)", type: "success" },
  { emoji: "🛡️", agent: "Fraud Detection", message: "scanned CLM-2026-0014 — CLEAR (risk: 3/100)", type: "success" },
  { emoji: "📋", agent: "Underwriting AI", message: "validated CLM-2026-0011 — eligible, coverage $250,000 confirmed", type: "success" },
  { emoji: "📄", agent: "OCR Engine", message: "processed death_cert_johnson.pdf — 99.8% accuracy", type: "info" },
  { emoji: "🔍", agent: "Document Intelligence", message: "processed CLM-2026-0015 — extracted 52 data points (2.4s)", type: "success" },
  { emoji: "🛡️", agent: "Fraud Detection", message: "scanned CLM-2026-0013 — ELEVATED (risk: 62/100) — routed to SIU", type: "warning" },
  { emoji: "⚡", agent: "Auto-Adjudication", message: "recommended APPROVE for CLM-2026-0006 ($42,500)", type: "success" },
  { emoji: "📄", agent: "OCR Engine", message: "processed attending_physician_stmt_chen.pdf — 98.9% accuracy", type: "info" },
  { emoji: "📋", agent: "Underwriting AI", message: "validated CLM-2026-0016 — policy lapsed, DENIED", type: "warning" },
  { emoji: "🔍", agent: "Document Intelligence", message: "processed CLM-2026-0018 — extracted 28 data points (1.5s)", type: "success" },
  { emoji: "🛡️", agent: "Fraud Detection", message: "scanned CLM-2026-0017 — CLEAR (risk: 5/100)", type: "success" },
  { emoji: "⚡", agent: "Auto-Adjudication", message: "recommended APPROVE for CLM-2026-0010 ($18,750)", type: "success" },
  { emoji: "📄", agent: "OCR Engine", message: "processed policy_amendment_garcia.pdf — 99.5% accuracy", type: "info" },
];

function formatTimeAgo(msAgo: number): string {
  const seconds = Math.floor(msAgo / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${Math.floor(minutes / 60)} hour${Math.floor(minutes / 60) > 1 ? "s" : ""} ago`;
}

const TYPE_COLORS = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
  alert: "bg-red-500",
};

const AGENT_COLORS: Record<string, string> = {
  "Document Intelligence": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Fraud Detection": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  "Underwriting AI": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Auto-Adjudication": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  "OCR Engine": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export function LiveActivityFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [now, setNow] = useState(Date.now());
  const templateIdx = useRef(0);

  // Seed initial items
  useEffect(() => {
    const seed: FeedItem[] = [];
    for (let i = 0; i < 8; i++) {
      const t = FEED_TEMPLATES[i % FEED_TEMPLATES.length];
      seed.push({ ...t, id: `seed-${i}`, timestamp: Date.now() - (i + 1) * 12000 });
    }
    setItems(seed);
    templateIdx.current = 8;
  }, []);

  // Add new items every 4-8 seconds
  useEffect(() => {
    const add = () => {
      const t = FEED_TEMPLATES[templateIdx.current % FEED_TEMPLATES.length];
      templateIdx.current++;
      setItems((prev) => [
        { ...t, id: `live-${Date.now()}`, timestamp: Date.now() },
        ...prev.slice(0, 19),
      ]);
    };
    const id = setInterval(add, 4000 + Math.random() * 4000);
    return () => clearInterval(id);
  }, []);

  // Tick relative timestamps
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card className="h-full border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="relative">
            <Activity className="w-5 h-5 text-primary" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>
          Live AI Agent Activity
          <Badge variant="outline" className="ml-auto text-[10px] font-normal text-emerald-600 border-emerald-300">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[420px] px-4 pb-4">
          <div className="space-y-1">
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`flex gap-3 px-3 py-2.5 rounded-lg transition-all duration-500 ${
                  i === 0 ? "animate-in slide-in-from-top-2 bg-primary/5 border border-primary/10" : "hover:bg-muted/50"
                }`}
              >
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${TYPE_COLORS[item.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">
                    <span className="mr-1">{item.emoji}</span>
                    <Badge variant="secondary" className={`text-[10px] mr-1.5 px-1.5 py-0 ${AGENT_COLORS[item.agent] || ""}`}>
                      {item.agent}
                    </Badge>
                    <span className="text-muted-foreground">{item.message}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                    {formatTimeAgo(now - item.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
