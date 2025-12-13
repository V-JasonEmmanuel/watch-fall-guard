import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Video, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const getPostureStyle = () => {
    switch (posture) {
      case "standing": return { color: "text-success", bg: "bg-success/10", border: "border-success/30" };
      case "sitting": return { color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" };
      case "lying": return { color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" };
      default: return { color: "text-muted-foreground", bg: "bg-muted", border: "border-border" };
    }
  };

  const style = getPostureStyle();

  return (
    <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-medical rounded-xl shadow-glow">
            <Camera className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-display">Computer Vision</span>
            <p className="text-xs text-muted-foreground font-normal">MediaPipe Pose Detection</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Camera Feed Simulation */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl h-44 flex items-center justify-center overflow-hidden">
          {/* Scan effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-[scan_2s_ease-in-out_infinite]" 
                 style={{ animation: 'scan 2s ease-in-out infinite' }} />
          </div>
          
          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-primary/50 rounded-tl" />
          <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-primary/50 rounded-tr" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-primary/50 rounded-bl" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-primary/50 rounded-br" />
          
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-3 animate-float">{getPostureIcon()}</div>
            <Badge className="bg-black/60 text-cyan-400 border-cyan-400/30 backdrop-blur-sm px-3 py-1 font-mono text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                LIVE FEED
              </div>
            </Badge>
          </div>
          
          {/* Overlay info */}
          <div className="absolute top-3 left-10 flex items-center gap-1.5 text-xs text-cyan-400/70 font-mono">
            <Video className="w-3 h-3" />
            REC
          </div>
          <div className="absolute bottom-3 left-10 text-[10px] text-cyan-400/50 font-mono">
            1080p @ 30fps
          </div>
          <div className="absolute bottom-3 right-10 text-[10px] text-cyan-400/50 font-mono">
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Posture Status */}
        <div className={cn("flex items-center justify-between p-4 rounded-xl border", style.bg, style.border)}>
          <div className="flex items-center gap-3">
            <Eye className={cn("w-5 h-5", style.color)} />
            <span className="text-sm font-medium text-foreground">Detected Posture</span>
          </div>
          <Badge className={cn("font-semibold capitalize", style.bg, style.color, "border", style.border)}>
            {posture}
          </Badge>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence Level</span>
            <span className={cn("font-bold", confidence > 0.9 ? "text-success" : confidence > 0.7 ? "text-warning" : "text-destructive")}>
              {(confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500 rounded-full",
                confidence > 0.9 ? "bg-gradient-success" : confidence > 0.7 ? "bg-warning" : "bg-destructive"
              )}
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {[
            { label: "Pose Detection", status: "active" },
            { label: "Fall Pattern", status: "active" },
            { label: "Analysis", status: "active" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
              {item.label}
            </div>
          ))}
        </div>
      </CardContent>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </Card>
  );
};
