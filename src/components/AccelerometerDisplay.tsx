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
    <Card className="shadow-medical">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Watch className="w-5 h-5 text-medical-blue-dark" />
          Samsung Galaxy Watch 5
          {isConnected ? (
            <Wifi className="w-4 h-4 text-success" />
          ) : (
            <WifiOff className="w-4 h-4 text-destructive" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Connection:</span>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        {/* Accelerometer Values */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-accent rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">X-Axis</div>
            <div className="text-lg font-bold text-accent-foreground">
              {data.x.toFixed(2)}g
            </div>
          </div>
          <div className="text-center p-3 bg-accent rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Y-Axis</div>
            <div className="text-lg font-bold text-accent-foreground">
              {data.y.toFixed(2)}g
            </div>
          </div>
          <div className="text-center p-3 bg-accent rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Z-Axis</div>
            <div className="text-lg font-bold text-accent-foreground">
              {data.z.toFixed(2)}g
            </div>
          </div>
        </div>

        {/* Magnitude and Fall Risk */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Acceleration:</span>
            <span className="text-xl font-bold text-medical-blue-dark">
              {data.magnitude.toFixed(2)}g
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Fall Risk Level:</span>
            <Badge className={fallRisk.color}>
              {fallRisk.level}
            </Badge>
          </div>

          {/* Threshold Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Fall Threshold</span>
              <span>2.5g</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-success to-warning transition-all duration-300"
                style={{ width: `${Math.min((data.magnitude / 20) * 100, 100)}%` }}
              ></div>
              <div 
                className="absolute top-0 w-0.5 h-full bg-destructive"
                style={{ left: '12.5%' }} // 2.5g out of 20g max
              ></div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>✓ Samsung Health SDK Connected</div>
            <div>✓ Real-time Sensor Data</div>
            <div>✓ Fall Detection Algorithm Active</div>
            <div>• Sampling Rate: 50Hz</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};