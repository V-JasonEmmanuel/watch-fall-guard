import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Watch, Wifi, WifiOff, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  magnitude: number;
}

interface AccelerometerDisplayProps {
  data: AccelerometerData;
  isConnected: boolean;
}

export const AccelerometerDisplay = ({ data, isConnected }: AccelerometerDisplayProps) => {
  const getFallRisk = () => {
    if (data.magnitude > 15) return { level: "HIGH", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" };
    if (data.magnitude > 12) return { level: "MEDIUM", color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" };
    return { level: "LOW", color: "text-success", bg: "bg-success/10", border: "border-success/30" };
  };

  const fallRisk = getFallRisk();

  const axes = [
    { label: "X-Axis", value: data.x, color: "text-health-heart", bg: "bg-health-heart/10" },
    { label: "Y-Axis", value: data.y, color: "text-health-ecg", bg: "bg-health-ecg/10" },
    { label: "Z-Axis", value: data.z, color: "text-health-spo2", bg: "bg-health-spo2/10" },
  ];

  return (
    <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-success rounded-xl shadow-glow-success">
              <Watch className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-display">Accelerometer</span>
              <p className="text-xs text-muted-foreground font-normal">Galaxy Watch 5</p>
            </div>
          </div>
          
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              isConnected 
                ? "bg-success/10 text-success border-success/30" 
                : "bg-destructive/10 text-destructive border-destructive/30"
            )}
          >
            {isConnected ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
            {isConnected ? "Live" : "Offline"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Axis Values */}
        <div className="grid grid-cols-3 gap-3">
          {axes.map((axis) => (
            <div key={axis.label} className={cn("p-3 rounded-xl text-center", axis.bg)}>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">{axis.label}</p>
              <p className={cn("text-xl font-bold font-display", axis.color)}>
                {axis.value.toFixed(2)}
              </p>
              <p className="text-[10px] text-muted-foreground">g-force</p>
            </div>
          ))}
        </div>

        {/* Total Magnitude */}
        <div className={cn("p-4 rounded-xl border", fallRisk.bg, fallRisk.border)}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className={cn("w-5 h-5", fallRisk.color)} />
              <span className="text-sm font-medium">Total Acceleration</span>
            </div>
            <div className="text-right">
              <p className={cn("text-2xl font-bold font-display", fallRisk.color)}>
                {data.magnitude.toFixed(2)}g
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Fall Risk Level</span>
            <Badge className={cn("font-semibold", fallRisk.bg, fallRisk.color, "border", fallRisk.border)}>
              {fallRisk.level}
            </Badge>
          </div>
        </div>

        {/* Threshold Visualization */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Fall Detection Threshold</span>
            <span className="font-mono">2.5g</span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-success via-warning to-destructive opacity-30" />
            <div 
              className="absolute top-0 h-full w-1 bg-foreground rounded-full shadow-lg transition-all duration-300"
              style={{ left: `${Math.min((data.magnitude / 20) * 100, 98)}%` }}
            />
            <div 
              className="absolute top-0 h-full w-px bg-destructive"
              style={{ left: '12.5%' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>0g</span>
            <span className="text-destructive">2.5g</span>
            <span>20g</span>
          </div>
        </div>

        {/* Device Info */}
        <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            50Hz Sampling
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            High Sensitivity
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
            Fall Detection On
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.9s' }} />
            Battery Optimized
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
