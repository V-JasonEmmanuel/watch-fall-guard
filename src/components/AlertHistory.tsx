import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Eye, Camera, Watch } from "lucide-react";

interface FallEvent {
  id: string;
  timestamp: Date;
  type: "confirmed_fall" | "suspicious_event";
  sources: ("computer_vision" | "accelerometer")[];
  confidence: number;
}

interface AlertHistoryProps {
  events: FallEvent[];
}

export const AlertHistory = ({ events }: AlertHistoryProps) => {
  const getEventIcon = (type: FallEvent["type"]) => {
    return type === "confirmed_fall" ? (
      <AlertTriangle className="w-4 h-4 text-destructive" />
    ) : (
      <Eye className="w-4 h-4 text-warning" />
    );
  };

  const getEventBadge = (type: FallEvent["type"]) => {
    return type === "confirmed_fall" ? (
      <Badge variant="destructive">Confirmed Fall</Badge>
    ) : (
      <Badge className="bg-warning text-warning-foreground">Suspicious</Badge>
    );
  };

  const getSourceIcon = (source: "computer_vision" | "accelerometer") => {
    return source === "computer_vision" ? (
      <Camera className="w-3 h-3" />
    ) : (
      <Watch className="w-3 h-3" />
    );
  };

  return (
    <Card className="shadow-medical">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-medical-blue-dark" />
          Alert History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No alerts recorded</p>
              <p className="text-xs mt-1">System is monitoring for fall events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getEventIcon(event.type)}
                      {getEventBadge(event.type)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {event.timestamp.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">Sources:</span>
                    {event.sources.map((source, index) => (
                      <Badge key={index} variant="outline" className="text-xs gap-1">
                        {getSourceIcon(source)}
                        {source === "computer_vision" ? "CV" : "Accel"}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Confidence: {(event.confidence * 100).toFixed(1)}%
                    </span>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          event.confidence > 0.8 ? 'bg-destructive' : 
                          event.confidence > 0.6 ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ width: `${event.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};