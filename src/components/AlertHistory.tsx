import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Eye, Camera, Watch, Heart, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FallEvent {
  id: string;
  timestamp: Date;
  type: "confirmed_fall" | "suspicious_event" | "health_alert";
  sources: ("computer_vision" | "accelerometer" | "health_metric")[];
  confidence: number;
  message?: string;
}

interface AlertHistoryProps {
  events: FallEvent[];
}

export const AlertHistory = ({ events }: AlertHistoryProps) => {
  const getEventConfig = (type: FallEvent["type"]) => {
    switch (type) {
      case "confirmed_fall":
        return { 
          icon: AlertTriangle, 
          label: "Fall Detected", 
          color: "text-destructive",
          bg: "bg-destructive/10",
          border: "border-destructive/30"
        };
      case "health_alert":
        return { 
          icon: Heart, 
          label: "Health Alert", 
          color: "text-warning",
          bg: "bg-warning/10",
          border: "border-warning/30"
        };
      default:
        return { 
          icon: Eye, 
          label: "Suspicious", 
          color: "text-info",
          bg: "bg-info/10",
          border: "border-info/30"
        };
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "computer_vision": return Camera;
      case "accelerometer": return Watch;
      case "health_metric": return Heart;
      default: return Eye;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <span className="text-lg font-display">Alert History</span>
              <p className="text-xs text-muted-foreground font-normal">{events.length} events</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Filter className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-80">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <AlertTriangle className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="font-medium text-foreground">No alerts recorded</p>
              <p className="text-sm text-muted-foreground mt-1">System is actively monitoring</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => {
                const config = getEventConfig(event.type);
                const IconComponent = config.icon;
                
                return (
                  <div 
                    key={event.id}
                    className={cn(
                      "p-4 rounded-xl border transition-all hover:shadow-soft",
                      config.bg,
                      config.border
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className={cn("w-4 h-4", config.color)} />
                        <Badge className={cn("text-xs", config.bg, config.color, "border", config.border)}>
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTime(event.timestamp)}
                      </div>
                    </div>
                    
                    {event.message && (
                      <p className="text-sm text-foreground mb-2">{event.message}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {event.sources.map((source, index) => {
                          const SourceIcon = getSourceIcon(source);
                          return (
                            <Badge key={index} variant="outline" className="text-xs gap-1 px-2 py-0.5">
                              <SourceIcon className="w-3 h-3" />
                              {source === "computer_vision" ? "CV" : source === "accelerometer" ? "Accel" : "Health"}
                            </Badge>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {(event.confidence * 100).toFixed(0)}%
                        </span>
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all",
                              event.confidence > 0.8 ? 'bg-destructive' : 
                              event.confidence > 0.6 ? 'bg-warning' : 'bg-success'
                            )}
                            style={{ width: `${event.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
