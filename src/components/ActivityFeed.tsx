"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle, Clock, FileText, Shield, TrendingUp, Users } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  agent: string;
  message: string;
  timestamp: string;
  details?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const activityConfig = {
  success: { color: 'bg-success', icon: CheckCircle },
  warning: { color: 'bg-warning', icon: AlertCircle },
  info: { color: 'bg-primary', icon: Clock },
  error: { color: 'bg-destructive', icon: AlertCircle }
};

const agentIcons = {
  'Claims Agent': FileText,
  'Underwriting Agent': Shield,
  'Fraud Detection Agent': AlertCircle,
  'Customer Engagement Agent': Users,
  'Document Intelligence Agent': FileText,
  'Compliance Agent': Shield
};

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Real-time Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6">
          <div className="space-y-4">
            {activities.map((activity) => {
              const ActivityIcon = activityConfig[activity.type].icon;
              const AgentIcon = agentIcons[activity.agent as keyof typeof agentIcons] || FileText;
              
              return (
                <div key={activity.id} className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-full ${activityConfig[activity.type].color} text-white flex-shrink-0`}>
                    <ActivityIcon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <AgentIcon className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">
                        {activity.agent}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium">{activity.message}</p>
                    
                    {activity.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.details}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};