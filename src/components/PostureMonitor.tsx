import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Camera } from "lucide-react";

interface PostureMonitorProps {
  posture: "standing" | "sitting" | "lying" | "unknown";
  confidence: number;
}

export const PostureMonitor = ({ posture, confidence }: PostureMonitorProps) => {
  const getPostureIcon = () => {
    switch (posture) {
      case "standing": return "🧍";
      case "sitting": return "🪑";
      case "lying": return "🛏️";
      default: return "❓";
    }
  };

  const getPostureColor = () => {
    switch (posture) {
      case "standing": return "text-success";
      case "sitting": return "text-primary";
      case "lying": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-medical">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-medical-blue-dark" />
          Computer Vision Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Live Feed Simulation */}
        <div className="relative bg-gradient-to-br from-medical-blue to-primary-foreground rounded-lg h-48 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-2">{getPostureIcon()}</div>
            <Badge className="bg-black/50 text-white border-white/20">
              LIVE CAMERA FEED
            </Badge>
          </div>
          <div className="absolute top-2 left-2">
            <div className="flex items-center gap-1 text-white text-xs">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              REC
            </div>
          </div>
        </div>

        {/* Posture Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Detected Posture:</span>
            <span className={`font-semibold capitalize ${getPostureColor()}`}>
              {posture}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Confidence Level:</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-medical-blue-dark to-success transition-all duration-300"
                  style={{ width: `${confidence * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{(confidence * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground space-y-1">
              <div>✓ MediaPipe Pose Detection Active</div>
              <div>✓ Fall Pattern Recognition Enabled</div>
              <div>✓ Real-time Analysis Running</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};