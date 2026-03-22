"use client";

import { Clock, CheckCircle, Target, DollarSign } from "lucide-react";

const stats = [
  { icon: <Clock className="h-5 w-5" />, value: "127 hours", label: "saved by AI today", color: "text-blue-600" },
  { icon: <CheckCircle className="h-5 w-5" />, value: "23", label: "claims auto-processed", color: "text-emerald-600" },
  { icon: <Target className="h-5 w-5" />, value: "99.7%", label: "accuracy rate", color: "text-purple-600" },
  { icon: <DollarSign className="h-5 w-5" />, value: "$2.4M", label: "in claims processed", color: "text-amber-600" },
];

export function AISummaryBanner() {
  return (
    <div className="rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 p-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className={`${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
