import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Video, Circle, Maximize2, Volume2, VolumeX, Settings, Grid3X3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  hasMotion: boolean;
}

const Cameras = () => {
  const navigate = useNavigate();
  const [selectedCamera, setSelectedCamera] = useState<string | null>("cam1");
  const [isMuted, setIsMuted] = useState(true);

  const cameras: CameraFeed[] = [
    { id: "cam1", name: "Living Room", location: "Ground Floor", status: "online", hasMotion: true },
    { id: "cam2", name: "Kitchen", location: "Ground Floor", status: "online", hasMotion: false },
    { id: "cam3", name: "Bedroom", location: "First Floor", status: "online", hasMotion: false },
    { id: "cam4", name: "Front Door", location: "Entrance", status: "online", hasMotion: true },
  ];

  const activeCamera = cameras.find(c => c.id === selectedCamera);

  return (
    <div className="min-h-screen bg-gradient-hero bg-gradient-mesh">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display">Security Cameras</h1>
                  <p className="text-xs text-muted-foreground">{cameras.filter(c => c.status === "online").length} cameras online</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Grid3X3 className="w-4 h-4" />
              Grid View
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Camera View */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm overflow-hidden">
              <div className="relative bg-slate-900 aspect-video flex items-center justify-center">
                {/* Camera Feed Simulation */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{ 
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                  }} />
                </div>

                {/* Room simulation */}
                <div className="relative z-10 text-center">
                  <div className="text-6xl mb-4">🛋️</div>
                  <p className="text-white/70 text-sm">Live Feed - {activeCamera?.name}</p>
                </div>

                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/50 rounded-tl" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/50 rounded-tr" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/50 rounded-bl" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/50 rounded-br" />

                {/* Recording indicator */}
                <div className="absolute top-4 left-12 flex items-center gap-2">
                  <Circle className="w-3 h-3 fill-red-500 text-red-500 animate-pulse" />
                  <span className="text-white text-xs font-mono">REC</span>
                </div>

                {/* Time stamp */}
                <div className="absolute top-4 right-12 text-white text-xs font-mono">
                  {new Date().toLocaleTimeString()}
                </div>

                {/* Motion indicator */}
                {activeCamera?.hasMotion && (
                  <div className="absolute bottom-4 left-12">
                    <Badge className="bg-warning/90 text-warning-foreground animate-pulse">
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

            {/* Camera Info */}
            {activeCamera && (
              <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{activeCamera.name}</h3>
                      <p className="text-sm text-muted-foreground">{activeCamera.location}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>1080p HD</span>
                      <span>30 fps</span>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                        {activeCamera.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Camera List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">All Cameras</h3>
            {cameras.map((camera) => (
              <Card 
                key={camera.id}
                className={cn(
                  "border-0 shadow-soft bg-card/80 backdrop-blur-sm cursor-pointer transition-all hover:shadow-medium",
                  selectedCamera === camera.id && "ring-2 ring-primary shadow-glow"
                )}
                onClick={() => setSelectedCamera(camera.id)}
              >
                <CardContent className="p-3">
                  <div className="relative bg-slate-800 rounded-lg aspect-video mb-3 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                      {camera.name === "Living Room" && "🛋️"}
                      {camera.name === "Kitchen" && "🍳"}
                      {camera.name === "Bedroom" && "🛏️"}
                      {camera.name === "Front Door" && "🚪"}
                    </div>
                    {camera.hasMotion && (
                      <div className="absolute top-1 right-1">
                        <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
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
                      camera.status === "online" ? "bg-success" : "bg-destructive"
                    )} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cameras;
