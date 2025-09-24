import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Watch, Wifi, WifiOff } from "lucide-react";

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
  const getFallRiskLevel = () => {
    if (data.magnitude > 15) return { level: "HIGH", color: "text-destructive" };
    if (data.magnitude > 12) return { level: "MEDIUM", color: "text-warning" };
    return { level: "LOW", color: "text-success" };
  };

  const fallRisk = getFallRiskLevel();

  return (
    <Card className="relative overflow-hidden bg-gradient-card border-0 shadow-large hover:shadow-success transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-success opacity-5"></div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-success rounded-xl shadow-success">
            <Watch className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">
              Samsung Galaxy Watch 5
            </span>
            <div className="flex items-center gap-2 mt-1">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-medical-secondary" />
              ) : (
                <WifiOff className="w-4 h-4 text-medical-error" />
              )}
              <Badge variant={isConnected ? "default" : "destructive"} className={isConnected ? "bg-medical-secondary text-white" : ""}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {/* Real-time Data Visualization */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-medical-surface rounded-xl border border-medical-primary/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-medical opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative">
              <div className="text-xs font-medium text-medical-primary uppercase tracking-wide mb-2">X-Axis</div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {data.x.toFixed(2)}
              </div>
              <div className="text-xs text-foreground/50">g-force</div>
            </div>
          </div>
          
          <div className="text-center p-4 bg-medical-surface rounded-xl border border-medical-secondary/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative">
              <div className="text-xs font-medium text-medical-secondary uppercase tracking-wide mb-2">Y-Axis</div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {data.y.toFixed(2)}
              </div>
              <div className="text-xs text-foreground/50">g-force</div>
            </div>
          </div>
          
          <div className="text-center p-4 bg-medical-surface rounded-xl border border-medical-accent/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-medical-accent/10 to-medical-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="text-xs font-medium text-medical-accent uppercase tracking-wide mb-2">Z-Axis</div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {data.z.toFixed(2)}
              </div>
              <div className="text-xs text-foreground/50">g-force</div>
            </div>
          </div>
        </div>

        {/* Total Acceleration Display */}
        <div className="p-6 bg-medical-surface rounded-xl border border-medical-primary/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-foreground/70">Total Acceleration:</span>
            <div className="text-right">
              <div className="text-3xl font-bold text-medical-primary">
                {data.magnitude.toFixed(2)}g
              </div>
              <Badge className={`mt-1 ${fallRisk.color} font-semibold`}>
                {fallRisk.level} RISK
              </Badge>
            </div>
          </div>
          
          {/* Advanced Threshold Visualization */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-foreground/60">
              <span>Fall Detection Threshold</span>
              <span className="font-mono">2.5g</span>
            </div>
            <div className="relative w-full h-4 bg-muted rounded-full overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-medical-secondary via-warning to-medical-error"></div>
              
              {/* Current value indicator */}
              <div 
                className="absolute top-0 h-full bg-white rounded-full transition-all duration-300 shadow-medium"
                style={{ 
                  width: '4px',
                  left: `${Math.min((data.magnitude / 20) * 100, 96)}%`,
                  filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))'
                }}
              ></div>
              
              {/* Threshold line */}
              <div 
                className="absolute top-0 w-0.5 h-full bg-medical-error shadow-danger"
                style={{ left: '12.5%' }}
              ></div>
              
              {/* Labels */}
              <div className="absolute -bottom-6 left-0 text-xs text-medical-secondary font-medium">0g</div>
              <div className="absolute -bottom-6 text-xs text-medical-error font-medium" style={{ left: '12.5%' }}>2.5g</div>
              <div className="absolute -bottom-6 right-0 text-xs text-foreground/50">20g</div>
            </div>
          </div>
        </div>

        {/* Technical Information */}
        <div className="p-4 bg-medical-surface rounded-xl">
          <h4 className="text-sm font-semibold text-foreground/70 mb-3">Device Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-medical-secondary rounded-full animate-pulse"></div>
                <span className="text-foreground/60">Samsung Health SDK</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-medical-primary rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <span className="text-foreground/60">Real-time Sensor Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-medical-accent rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                <span className="text-foreground/60">Fall Detection Active</span>
              </div>
            </div>
            <div className="space-y-2 text-foreground/50">
              <div>• Sampling Rate: 50Hz</div>
              <div>• Sensitivity: High</div>
              <div>• Battery: Optimized</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};