import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Camera, 
  Video, 
  Circle, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Settings, 
  Grid3X3,
  Plus,
  AlertTriangle,
  User,
  Activity,
  MessageCircle,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useWhatsAppAlert } from "@/hooks/useWhatsAppAlert";

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  hasMotion: boolean;
  posture: "standing" | "sitting" | "lying" | "fallen" | "unknown";
  personDetected: boolean;
}

const Cameras = () => {
  const navigate = useNavigate();
  const { sendAlert, isSending, emergencyPhone, setEmergencyPhone, DEFAULT_EMERGENCY_PHONE } = useWhatsAppAlert();
  const [selectedCamera, setSelectedCamera] = useState<string>("cam1");
  const [isMuted, setIsMuted] = useState(true);

  const [cameras, setCameras] = useState<CameraFeed[]>([
    { id: "cam1", name: "Living Room", location: "Ground Floor", status: "online", hasMotion: true, posture: "sitting", personDetected: true },
    { id: "cam2", name: "Kitchen", location: "Ground Floor", status: "online", hasMotion: false, posture: "standing", personDetected: true },
    { id: "cam3", name: "Bedroom", location: "First Floor", status: "online", hasMotion: false, posture: "lying", personDetected: true },
    { id: "cam4", name: "Front Door", location: "Entrance", status: "online", hasMotion: true, posture: "unknown", personDetected: false },
  ]);

  const activeCamera = cameras.find(c => c.id === selectedCamera);

  // Simulate fall detection
  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance of detecting a fall (for demo purposes)
      const shouldSimulateFall = Math.random() < 0.02; // 2% chance every 3 seconds
      
      if (shouldSimulateFall && activeCamera?.personDetected) {
        setCameras(prev => prev.map(c => 
          c.id === selectedCamera ? { ...c, posture: "fallen" } : c
        ));
        
        // Trigger WhatsApp alert
        sendFallAlert(activeCamera);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedCamera, activeCamera]);

  const sendFallAlert = async (camera: CameraFeed | undefined) => {
    if (!camera) return;
    
    await sendAlert({
      elderlyName: "Elderly Resident",
      location: `${camera.name} - ${camera.location}`,
      alertType: "fall"
    });
  };

  const getPostureIcon = (posture: string) => {
    switch (posture) {
      case "standing": return "🧍";
      case "sitting": return "🪑";
      case "lying": return "🛏️";
      case "fallen": return "⚠️";
      default: return "❓";
    }
  };

  const getPostureColor = (posture: string) => {
    switch (posture) {
      case "standing": return { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/30" };
      case "sitting": return { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" };
      case "lying": return { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/30" };
      case "fallen": return { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/30" };
      default: return { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" };
    }
  };

  const resetFallStatus = () => {
    setCameras(prev => prev.map(c => 
      c.id === selectedCamera ? { ...c, posture: "sitting" } : c
    ));
  };

  const handleAddCamera = () => {
    console.log("BACKEND PLACEHOLDER: Add new camera");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-foreground rounded-lg">
                  <Camera className="w-5 h-5 text-background" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Security Cameras</h1>
                  <p className="text-xs text-muted-foreground">{cameras.filter(c => c.status === "online").length} cameras online</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleAddCamera}>
                <Plus className="w-4 h-4" />
                Add Camera
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Grid3X3 className="w-4 h-4" />
                Grid View
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Camera View */}
          <div className="lg:col-span-3 space-y-4">
            {/* Camera Selector */}
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">Active Camera:</p>
              <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent>
                  {cameras.map((camera) => (
                    <SelectItem key={camera.id} value={camera.id}>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          camera.status === "online" ? "bg-emerald-500" : "bg-red-500"
                        )} />
                        {camera.name} - {camera.location}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Camera Feed */}
            <Card className="border border-border overflow-hidden">
              <div className="relative bg-neutral-900 aspect-video flex items-center justify-center">
                {/* Camera Feed Simulation */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
                
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{ 
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                  }} />
                </div>

                {/* Room simulation with posture */}
                <div className="relative z-10 text-center">
                  <div className={cn(
                    "text-7xl mb-4 transition-all",
                    activeCamera?.posture === "fallen" && "animate-pulse"
                  )}>
                    {getPostureIcon(activeCamera?.posture || "unknown")}
                  </div>
                  <p className="text-white/70 text-sm mb-2">Live Feed - {activeCamera?.name}</p>
                  
                  {/* Posture Status Badge */}
                  {activeCamera?.personDetected && (
                    <Badge className={cn(
                      "capitalize",
                      getPostureColor(activeCamera?.posture || "unknown").bg,
                      getPostureColor(activeCamera?.posture || "unknown").text,
                      "border",
                      getPostureColor(activeCamera?.posture || "unknown").border
                    )}>
                      <User className="w-3 h-3 mr-1" />
                      {activeCamera?.posture}
                    </Badge>
                  )}
                </div>

                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/30 rounded-tl" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/30 rounded-tr" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/30 rounded-bl" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/30 rounded-br" />

                {/* Recording indicator */}
                <div className="absolute top-4 left-12 flex items-center gap-2">
                  <Circle className="w-3 h-3 fill-red-500 text-red-500 animate-pulse" />
                  <span className="text-white text-xs font-mono">REC</span>
                </div>

                {/* Time stamp */}
                <div className="absolute top-4 right-12 text-white text-xs font-mono">
                  {new Date().toLocaleTimeString()}
                </div>

                {/* Fall Alert */}
                {activeCamera?.posture === "fallen" && (
                  <div className="absolute inset-0 border-4 border-red-500 animate-pulse" />
                )}
                {activeCamera?.posture === "fallen" && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-24">
                    <Badge className="bg-red-500 text-white text-lg px-4 py-2 animate-bounce">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      FALL DETECTED - ALERT SENT
                    </Badge>
                  </div>
                )}

                {/* Motion indicator */}
                {activeCamera?.hasMotion && activeCamera?.posture !== "fallen" && (
                  <div className="absolute bottom-4 left-12">
                    <Badge className="bg-amber-500/90 text-white animate-pulse">
                      Motion Detected
                    </Badge>
                  </div>
                )}

                {/* Controls */}
                <div className="absolute bottom-4 right-12 flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Camera Info & AI Analysis */}
            {activeCamera && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{activeCamera.name}</h3>
                        <p className="text-sm text-muted-foreground">{activeCamera.location}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>1080p HD</span>
                        <span>30 fps</span>
                        <Badge variant="outline" className={cn(
                          activeCamera.status === "online" 
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" 
                            : "bg-red-500/10 text-red-500 border-red-500/30"
                        )}>
                          {activeCamera.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Posture Analysis */}
                <Card className={cn(
                  "border",
                  activeCamera.posture === "fallen" ? "border-red-500" : "border-border"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">AI Posture Detection</p>
                          <p className="text-xs text-muted-foreground">MediaPipe Vision</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(
                          "capitalize",
                          getPostureColor(activeCamera.posture).bg,
                          getPostureColor(activeCamera.posture).text,
                          "border",
                          getPostureColor(activeCamera.posture).border
                        )}>
                          {activeCamera.posture}
                        </Badge>
                        {activeCamera.posture === "fallen" && (
                          <Button size="sm" variant="outline" onClick={resetFallStatus}>
                            Clear Alert
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* WhatsApp Integration Configuration */}
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium">WhatsApp Alerts via Twilio</p>
                        <p className="text-xs text-muted-foreground">Real-time fall detection notifications</p>
                      </div>
                    </div>
                    <Badge className={cn(
                      "border",
                      emergencyPhone 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" 
                        : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                    )}>
                      {emergencyPhone ? "Configured" : "Setup Required"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label htmlFor="phone" className="text-xs text-muted-foreground">Emergency Phone (with country code)</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1234567890"
                          value={emergencyPhone}
                          onChange={(e) => setEmergencyPhone(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => sendFallAlert(activeCamera)}
                      disabled={!emergencyPhone || isSending}
                    >
                      {isSending ? "Sending..." : "Test Alert"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Camera List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">All Cameras</h3>
            {cameras.map((camera) => {
              const postureColors = getPostureColor(camera.posture);
              return (
                <Card 
                  key={camera.id}
                  className={cn(
                    "border cursor-pointer transition-all hover:shadow-md",
                    selectedCamera === camera.id && "ring-1 ring-foreground",
                    camera.posture === "fallen" && "border-red-500"
                  )}
                  onClick={() => setSelectedCamera(camera.id)}
                >
                  <CardContent className="p-3">
                    <div className={cn(
                      "relative bg-neutral-800 rounded-lg aspect-video mb-3 overflow-hidden flex items-center justify-center",
                      camera.posture === "fallen" && "border border-red-500"
                    )}>
                      <div className="text-3xl">
                        {getPostureIcon(camera.posture)}
                      </div>
                      {camera.hasMotion && camera.posture !== "fallen" && (
                        <div className="absolute top-1 right-1">
                          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        </div>
                      )}
                      {camera.posture === "fallen" && (
                        <div className="absolute top-1 right-1">
                          <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                        </div>
                      )}
                      <div className="absolute bottom-1 left-1">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">LIVE</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{camera.name}</p>
                        <p className="text-xs text-muted-foreground">{camera.location}</p>
                      </div>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        camera.status === "online" ? "bg-emerald-500" : "bg-red-500"
                      )} />
                    </div>
                    {camera.personDetected && (
                      <Badge className={cn(
                        "mt-2 text-xs capitalize",
                        postureColors.bg,
                        postureColors.text,
                        "border",
                        postureColors.border
                      )}>
                        {camera.posture}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cameras;
