"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, ExternalLink, Link, XCircle } from "lucide-react";

interface Integration {
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  type: 'legacy' | 'modern' | 'api';
  lastSync?: string;
}

interface AgentIntegrationsProps {
  integrations: Integration[];
  onToggleIntegration: (integrationName: string, enabled: boolean) => void;
  onConfigureIntegration: (integrationName: string) => void;
}

const statusConfig = {
  connected: { color: 'bg-success', text: 'Connected', icon: CheckCircle },
  disconnected: { color: 'bg-muted', text: 'Disconnected', icon: XCircle },
  error: { color: 'bg-destructive', text: 'Error', icon: XCircle }
};

const typeConfig = {
  legacy: { color: 'bg-warning', text: 'Legacy System' },
  modern: { color: 'bg-primary', text: 'Modern Platform' },
  api: { color: 'bg-accent', text: 'API Integration' }
};

export const AgentIntegrations = ({ 
  integrations, 
  onToggleIntegration, 
  onConfigureIntegration 
}: AgentIntegrationsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5 text-primary" />
          System Integrations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {integrations.map((integration) => {
          const StatusIcon = statusConfig[integration.status].icon;
          const isConnected = integration.status === 'connected';
          
          return (
            <div 
              key={integration.name}
              className="flex items-center justify-between p-4 rounded-lg border bg-gradient-subtle hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${statusConfig[integration.status].color} text-white`}>
                  <StatusIcon className="w-4 h-4" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium">{integration.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`${typeConfig[integration.type].color} text-white border-0 text-xs`}
                    >
                      {typeConfig[integration.type].text}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                  {integration.lastSync && isConnected && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last sync: {integration.lastSync}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Switch
                  checked={isConnected}
                  onCheckedChange={(checked) => onToggleIntegration(integration.name, checked)}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onConfigureIntegration(integration.name)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};