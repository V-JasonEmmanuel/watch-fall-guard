import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Camera, Watch, Wifi, Phone } from "lucide-react";
import { PostureMonitor } from "./PostureMonitor";
import { AccelerometerDisplay } from "./AccelerometerDisplay";
import { AlertHistory } from "./AlertHistory";
import { EmergencyContacts } from "./EmergencyContacts";

interface SensorData {
  posture: "standing" | "sitting" | "lying" | "unknown";
  confidence: number;
  accelerometer: {
    x: number;
    y: number;
    z: number;
    magnitude: number;
  };
  lastUpdate: Date;
}

interface FallEvent {
  id: string;
  timestamp: Date;
  type: "confirmed_fall" | "suspicious_event";
  sources: ("computer_vision" | "accelerometer")[];
  confidence: number;
}

export const Dashboard = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    posture: "standing",
    confidence: 0.95,
    accelerometer: { x: 0.1, y: 0.2, z: 9.8, magnitude: 9.82 },
    lastUpdate: new Date(),
  });

  const [fallEvents, setFallEvents] = useState<FallEvent[]>([]);
  const [activeAlert, setActiveAlert] = useState<FallEvent | null>(null);
  const [isConnected, setIsConnected] = useState({
    camera: true,
    watch: true,
    whatsapp: false, // Will be false until backend is connected
  });

  // Simulate sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate realistic accelerometer data
      const baseAccel = sensorData.posture === "lying" ? 2.0 : 9.8;
      const noise = () => (Math.random() - 0.5) * 0.4;
      
      const newAccel = {
        x: noise(),
        y: noise(),
        z: baseAccel + noise(),
        magnitude: 0,
      };
      newAccel.magnitude = Math.sqrt(newAccel.x ** 2 + newAccel.y ** 2 + newAccel.z ** 2);

      // Simulate occasional posture changes
      let newPosture = sensorData.posture;
      if (Math.random() < 0.02) { // 2% chance per update
        const postures: (typeof sensorData.posture)[] = ["standing", "sitting", "lying"];
        newPosture = postures[Math.floor(Math.random() * postures.length)];
        
        // Simulate fall detection
        if (sensorData.posture === "standing" && newPosture === "lying") {
          const fallEvent: FallEvent = {
            id: Date.now().toString(),
            timestamp: new Date(),
            type: Math.random() > 0.3 ? "confirmed_fall" : "suspicious_event",
            sources: ["computer_vision", "accelerometer"],
            confidence: 0.85 + Math.random() * 0.15,
          };
          setFallEvents(prev => [fallEvent, ...prev]);
          if (fallEvent.type === "confirmed_fall") {
            setActiveAlert(fallEvent);
          }
        }
      }

      setSensorData(prev => ({
        ...prev,
        posture: newPosture,
        confidence: 0.90 + Math.random() * 0.09,
        accelerometer: newAccel,
        lastUpdate: new Date(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [sensorData.posture]);

  const dismissAlert = () => {
    setActiveAlert(null);
  };

  const getPostureColor = () => {
    switch (sensorData.posture) {
      case "standing": return "bg-safety-green text-safety-green-dark";
      case "sitting": return "bg-medical-blue text-medical-blue-dark";
      case "lying": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ElderGuard Monitor</h1>
            <p className="text-muted-foreground">Real-time fall detection and safety monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected.camera ? "default" : "destructive"} className="gap-1">
              <Camera className="w-3 h-3" />
              Camera
            </Badge>
            <Badge variant={isConnected.watch ? "default" : "destructive"} className="gap-1">
              <Watch className="w-3 h-3" />
              Watch
            </Badge>
            <Badge variant={isConnected.whatsapp ? "default" : "destructive"} className="gap-1">
              <Phone className="w-3 h-3" />
              WhatsApp
            </Badge>
          </div>
        </div>

        {/* Active Alert */}
        {activeAlert && (
          <Alert className="border-destructive bg-alert-red">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span className="font-semibold">
                {activeAlert.type === "confirmed_fall" ? "⚠️ FALL DETECTED!" : "⚠️ Suspicious Activity"}
                {" "}Emergency contacts have been notified.
              </span>
              <Button variant="outline" size="sm" onClick={dismissAlert}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-medical">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Posture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge className={getPostureColor()}>
                  {sensorData.posture.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {(sensorData.confidence * 100).toFixed(1)}% confidence
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medical">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Accelerometer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medical-blue-dark">
                {sensorData.accelerometer.magnitude.toFixed(2)}g
              </div>
              <p className="text-xs text-muted-foreground">
                X: {sensorData.accelerometer.x.toFixed(2)} | 
                Y: {sensorData.accelerometer.y.toFixed(2)} | 
                Z: {sensorData.accelerometer.z.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-medical">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-success-foreground font-medium">Active Monitoring</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last update: {sensorData.lastUpdate.toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-medical">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Fall Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {fallEvents.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {fallEvents.filter(e => e.type === "confirmed_fall").length} confirmed falls
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monitoring Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PostureMonitor 
            posture={sensorData.posture} 
            confidence={sensorData.confidence}
          />
          <AccelerometerDisplay 
            data={sensorData.accelerometer}
            isConnected={isConnected.watch}
          />
        </div>

        {/* Alert History and Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertHistory events={fallEvents} />
          <EmergencyContacts />
        </div>
      </div>
    </div>
  );
};