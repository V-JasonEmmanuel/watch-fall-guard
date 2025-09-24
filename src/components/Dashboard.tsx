import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Camera, Watch, Wifi, Phone, Shield } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-medical-primary/10 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-medical-accent/10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-medical-secondary/10 animate-pulse-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="relative p-4 bg-gradient-medical rounded-2xl shadow-glow">
              <Shield className="w-8 h-8 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-medical-secondary rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-medical-primary to-medical-accent bg-clip-text text-transparent">
                ElderGuard Monitor
              </h1>
              <p className="text-foreground/60 text-lg">Real-time fall detection and safety monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant={isConnected.camera ? "default" : "destructive"} 
              className={`gap-2 px-4 py-2 ${isConnected.camera ? 'bg-medical-secondary text-white shadow-success' : 'bg-medical-error text-white shadow-danger'}`}
            >
              <Camera className="w-4 h-4" />
              <span className="font-medium">Camera</span>
              <div className={`w-2 h-2 rounded-full ${isConnected.camera ? 'bg-white animate-pulse' : 'bg-white/60'}`}></div>
            </Badge>
            
            <Badge 
              variant={isConnected.watch ? "default" : "destructive"}
              className={`gap-2 px-4 py-2 ${isConnected.watch ? 'bg-medical-primary text-white shadow-glow' : 'bg-medical-error text-white shadow-danger'}`}
            >
              <Watch className="w-4 h-4" />
              <span className="font-medium">Watch</span>
              <div className={`w-2 h-2 rounded-full ${isConnected.watch ? 'bg-white animate-pulse' : 'bg-white/60'}`}></div>
            </Badge>
            
            <Badge 
              variant={isConnected.whatsapp ? "default" : "destructive"}
              className={`gap-2 px-4 py-2 ${isConnected.whatsapp ? 'bg-medical-accent text-white' : 'bg-medical-error text-white shadow-danger'}`}
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">WhatsApp</span>
              <div className={`w-2 h-2 rounded-full ${isConnected.whatsapp ? 'bg-white animate-pulse' : 'bg-white/60'}`}></div>
            </Badge>
          </div>
        </div>

        {/* Active Alert */}
        {activeAlert && (
          <div className="relative">
            <Alert className="border-0 bg-gradient-danger text-white shadow-danger animate-glow">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">
                    {activeAlert.type === "confirmed_fall" ? "🚨 FALL DETECTED!" : "⚠️ Suspicious Activity"}
                  </span>
                  <span className="text-white/90">Emergency contacts have been notified</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={dismissAlert}
                  className="text-white hover:bg-white/20 border border-white/30"
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
            <div className="absolute inset-0 rounded-lg bg-gradient-danger opacity-20 animate-pulse"></div>
          </div>
        )}

        {/* Main Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden bg-gradient-card border-0 shadow-large hover:shadow-glow transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-medical opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground/60 uppercase tracking-wide">
                Current Posture
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={`text-lg font-bold px-4 py-2 ${getPostureColor()} shadow-medium`}>
                  {sensorData.posture.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">
                  {(sensorData.confidence * 100).toFixed(1)}%
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-medical transition-all duration-300"
                      style={{ width: `${sensorData.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground/50 mt-2">Confidence Level</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-card border-0 shadow-large hover:shadow-success transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground/60 uppercase tracking-wide">
                Accelerometer
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-medical-primary mb-2">
                {sensorData.accelerometer.magnitude.toFixed(2)}g
              </div>
              <div className="text-sm text-foreground/60 space-y-1">
                <div className="flex justify-between">
                  <span>X:</span>
                  <span className="font-mono">{sensorData.accelerometer.x.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Y:</span>
                  <span className="font-mono">{sensorData.accelerometer.y.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Z:</span>
                  <span className="font-mono">{sensorData.accelerometer.z.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-card border-0 shadow-large hover:shadow-glow transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-medical opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground/60 uppercase tracking-wide">
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-medical-secondary rounded-full animate-pulse shadow-success"></div>
                <span className="text-lg font-semibold text-medical-secondary">Active Monitoring</span>
              </div>
              <p className="text-sm text-foreground/60">
                Last update: {sensorData.lastUpdate.toLocaleTimeString()}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-medical animate-pulse"></div>
                </div>
                <span className="text-xs text-foreground/50">Real-time</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-card border-0 shadow-large hover:shadow-medium transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-medical opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground/60 uppercase tracking-wide">
                Fall Events
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-foreground mb-2">
                {fallEvents.length}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">Confirmed:</span>
                  <span className="font-semibold text-medical-error">
                    {fallEvents.filter(e => e.type === "confirmed_fall").length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/60">Suspicious:</span>
                  <span className="font-semibold text-warning">
                    {fallEvents.filter(e => e.type === "suspicious_event").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monitoring Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AlertHistory events={fallEvents} />
          <EmergencyContacts />
        </div>
      </div>
    </div>
  );
};