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
    <Card className="relative overflow-hidden bg-gradient-card border-0 shadow-large hover:shadow-glow transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-medical opacity-5"></div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-medical rounded-xl shadow-glow">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-medical-primary to-medical-accent bg-clip-text text-transparent">
            Computer Vision Monitor
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {/* Live Feed Simulation */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl h-56 flex items-center justify-center overflow-hidden shadow-large">
          {/* Scan lines effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse"></div>
          
          <div className="relative z-10 text-center">
            <div className="text-7xl mb-4 animate-float">{getPostureIcon()}</div>
            <Badge className="bg-black/60 text-cyan-400 border-cyan-400/30 backdrop-blur-sm px-4 py-2 font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                LIVE CAMERA FEED
              </div>
            </Badge>
          </div>
          
          {/* Corner indicators */}
          <div className="absolute top-3 left-3 flex items-center gap-2 text-cyan-400 text-sm font-mono">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            REC
          </div>
          
          <div className="absolute top-3 right-3 text-cyan-400 text-sm font-mono">
            {new Date().toLocaleTimeString()}
          </div>
          
          <div className="absolute bottom-3 left-3 text-cyan-400 text-xs font-mono opacity-70">
            MediaPipe Pose v2.1
          </div>
          
          <div className="absolute bottom-3 right-3 text-cyan-400 text-xs font-mono opacity-70">
            1920x1080 @ 30fps
          </div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"></div>
          </div>
        </div>

        {/* Posture Analysis */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-medical-surface rounded-xl">
            <span className="text-sm font-medium text-foreground/70">Detected Posture:</span>
            <Badge className={`text-lg font-bold px-4 py-2 shadow-medium ${getPostureColor()}`}>
              {posture.toUpperCase()}
            </Badge>
          </div>
          
          <div className="p-4 bg-medical-surface rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground/70">Confidence Level:</span>
              <span className="text-lg font-bold text-medical-primary">{(confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-medical transition-all duration-500 ease-out"
                style={{ width: `${confidence * 100}%` }}
              ></div>
              {confidence > 0.95 && (
                <div className="absolute inset-0 bg-gradient-medical opacity-30 animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Technical Status */}
          <div className="p-4 bg-medical-surface rounded-xl">
            <h4 className="text-sm font-semibold text-foreground/70 mb-3">System Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-medical-secondary rounded-full animate-pulse"></div>
                <span className="text-foreground/60">MediaPipe Pose Detection Active</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-medical-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-foreground/60">Fall Pattern Recognition Enabled</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-medical-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-foreground/60">Real-time Analysis Running</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};