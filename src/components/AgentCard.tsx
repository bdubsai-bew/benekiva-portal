"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, AlertCircle, CheckCircle, Clock, UserCheck, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AgentStatus {
  status: 'active' | 'idle' | 'error' | 'processing';
  workload: number;
  lastActivity: string;
  totalTasks: number;
  completedTasks: number;
}

interface AgentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: AgentStatus;
  capabilities: string[];
  humanomation?: boolean;
  locked?: boolean;
  onConfigure: () => void;
  onViewDetails: () => void;
  onRequestAccess?: () => void;
}

const statusConfig = {
  active: { color: 'bg-success', text: 'Active', icon: CheckCircle },
  idle: { color: 'bg-muted', text: 'Idle', icon: Clock },
  error: { color: 'bg-destructive', text: 'Error', icon: AlertCircle },
  processing: { color: 'bg-warning', text: 'Processing', icon: Activity }
};

export const AgentCard = ({ 
  title, 
  description, 
  icon, 
  status, 
  capabilities, 
  humanomation = false,
  locked = false,
  onConfigure, 
  onViewDetails,
  onRequestAccess
}: AgentCardProps) => {
  const StatusIcon = statusConfig[status.status].icon;
  const completionRate = status.totalTasks > 0 ? (status.completedTasks / status.totalTasks) * 100 : 0;

  return (
    <Card className={`group transition-all duration-300 border-primary/10 ${
      locked 
        ? "opacity-75 bg-muted/30 border-dashed" 
        : "hover:shadow-elegant hover:-translate-y-1 bg-gradient-subtle"
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${locked ? "bg-muted text-muted-foreground" : "bg-gradient-primary text-primary-foreground"}`}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <CardDescription className="text-sm mt-1">{description}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {locked ? (
              <Badge variant="outline" className="bg-muted text-muted-foreground border-dashed">
                <Lock className="w-3 h-3 mr-1" />
                Not Licensed
              </Badge>
            ) : (
              <Badge 
                variant="outline" 
                className={`${statusConfig[status.status].color} text-white border-0 animate-pulse-glow`}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig[status.status].text}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Humanomation Badge */}
        {humanomation && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${locked ? "border-muted bg-muted/5" : "border-accent/30 bg-accent/5"}`}>
                  <UserCheck className={`w-4 h-4 ${locked ? "text-muted-foreground" : "text-accent"}`} />
                  <span className={`text-xs font-semibold tracking-wide ${locked ? "text-muted-foreground" : "text-accent"}`}>HUMANOMATION™</span>
                  <span className="text-xs text-muted-foreground ml-auto">Human-in-the-loop enabled</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[260px]">
                <p className="text-xs">Benekiva's Humanomation™ ensures a human expert is seamlessly looped in whenever the AI encounters edge cases, low-confidence decisions, or situations requiring empathy and judgment.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Performance Metrics */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Workload</span>
            <span className="font-medium">{locked ? "—" : `${status.workload}%`}</span>
          </div>
          <Progress value={locked ? 0 : status.workload} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Task Completion</span>
            <span className="font-medium">{locked ? "—" : `${status.completedTasks}/${status.totalTasks}`}</span>
          </div>
          <Progress value={locked ? 0 : completionRate} className="h-2" />
        </div>

        {/* Capabilities */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Capabilities</h4>
          <div className="flex flex-wrap gap-2">
            {capabilities.map((capability, index) => (
              <Badge key={index} variant="secondary" className={`text-xs ${locked ? "opacity-60" : ""}`}>
                {capability}
              </Badge>
            ))}
          </div>
        </div>

        {/* Last Activity */}
        <div className="text-xs text-muted-foreground">
          {locked ? "Contact sales to enable this agent" : `Last activity: ${status.lastActivity}`}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {locked ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRequestAccess} 
              className="flex-1"
            >
              <Lock className="w-3 h-3 mr-1" />
              Request Access
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={onConfigure} className="flex-1">
                Configure
              </Button>
              <Button variant="default" size="sm" onClick={onViewDetails} className="flex-1">
                View Details
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
