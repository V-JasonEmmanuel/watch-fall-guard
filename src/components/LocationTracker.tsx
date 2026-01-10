import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Home, 
  Navigation, 
  AlertTriangle, 
  CheckCircle2,
  Shield,
  Circle,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface Geofence {
  id: string;
  name: string;
  type: "safe" | "warning" | "danger";
  radius: number;
  isInside: boolean;
}

interface LocationData {
  currentLocation: string;
  coordinates: { lat: number; lng: number };
  lastUpdated: string;
  locationType: "home" | "outdoor" | "building" | "unknown";
  geofenceStatus: "safe" | "warning" | "danger";
  geofences: Geofence[];
  speed: number;
  accuracy: number;
}

interface LocationTrackerProps {
  elderName?: string;
  onGeofenceAlert?: (alert: { type: string; message: string; zone: string }) => void;
}

export const LocationTracker = ({ 
  elderName = "Elder",
  onGeofenceAlert 
}: LocationTrackerProps) => {
  const [locationData, setLocationData] = useState<LocationData>({
    currentLocation: "Living Room, Home",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    lastUpdated: "Just now",
    locationType: "home",
    geofenceStatus: "safe",
    geofences: [
      { id: "1", name: "Home Zone", type: "safe", radius: 100, isInside: true },
      { id: "2", name: "Neighborhood", type: "warning", radius: 500, isInside: true },
      { id: "3", name: "City Limits", type: "danger", radius: 5000, isInside: true },
    ],
    speed: 0,
    accuracy: 5,
  });

  const [showMap, setShowMap] = useState(false);

  // Simulate location updates
  useEffect(() => {
    const locations = [
      { location: "Living Room, Home", type: "home" as const, status: "safe" as const },
      { location: "Kitchen, Home", type: "home" as const, status: "safe" as const },
      { location: "Backyard", type: "outdoor" as const, status: "safe" as const },
      { location: "Front Porch", type: "outdoor" as const, status: "safe" as const },
    ];

    const interval = setInterval(() => {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      setLocationData(prev => ({
        ...prev,
        currentLocation: randomLocation.location,
        locationType: randomLocation.type,
        geofenceStatus: randomLocation.status,
        lastUpdated: "Just now",
        speed: randomLocation.type === "home" ? 0 : Math.random() * 2,
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: "safe" | "warning" | "danger") => {
    switch (status) {
      case "safe": return {
        bg: "bg-safe/10",
        border: "border-safe/30",
        text: "text-safe",
        dot: "bg-safe"
      };
      case "warning": return {
        bg: "bg-warning/10",
        border: "border-warning/30",
        text: "text-warning",
        dot: "bg-warning"
      };
      case "danger": return {
        bg: "bg-critical/10",
        border: "border-critical/30",
        text: "text-critical",
        dot: "bg-critical"
      };
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "home": return Home;
      case "outdoor": return Navigation;
      case "building": return MapPin;
      default: return MapPin;
    }
  };

  const statusColors = getStatusColor(locationData.geofenceStatus);
  const LocationIcon = getLocationIcon(locationData.locationType);

  return (
    <div className="space-y-6">
      {/* Current Location Card */}
      <Card className={cn(
        "border-2 transition-all",
        statusColors.bg,
        statusColors.border,
        locationData.geofenceStatus === "danger" && "animate-pulse"
      )}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-4 rounded-2xl relative",
                statusColors.bg
              )}>
                <LocationIcon className={cn("w-8 h-8", statusColors.text)} />
                <div className={cn(
                  "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-card animate-pulse",
                  statusColors.dot
                )} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Location</p>
                <h2 className="text-elder-xl font-bold">{locationData.currentLocation}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={cn(statusColors.bg, statusColors.text, "gap-1")}>
                    {locationData.geofenceStatus === "safe" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {locationData.geofenceStatus === "safe" 
                      ? "In Safe Zone" 
                      : locationData.geofenceStatus === "warning"
                      ? "Outside Home Zone"
                      : "Outside Safe Area"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Updated {locationData.lastUpdated}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
              <ExternalLink className="w-4 h-4 mr-2" />
              {showMap ? "Hide Map" : "View Map"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      {showMap && (
        <Card className="border overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-primary/5 to-info/5 flex items-center justify-center relative">
            {/* Simple map visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Safe zone circle */}
              <div className="absolute w-48 h-48 rounded-full border-4 border-safe/30 bg-safe/5" />
              {/* Warning zone circle */}
              <div className="absolute w-72 h-72 rounded-full border-2 border-warning/20 bg-warning/5" />
              {/* Danger zone circle */}
              <div className="absolute w-96 h-96 rounded-full border-2 border-dashed border-critical/20" />
              {/* Current position */}
              <div className="relative z-10">
                <div className={cn(
                  "w-6 h-6 rounded-full border-4 border-card shadow-lg animate-pulse",
                  statusColors.dot
                )} />
              </div>
            </div>
            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex gap-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-safe" />
                <span>Safe Zone</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span>Warning Zone</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-critical" />
                <span>Alert Zone</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Geofence Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {locationData.geofences.map((fence) => {
          const fenceColors = getStatusColor(fence.type);
          return (
            <Card 
              key={fence.id}
              className={cn(
                "border-2 transition-all hover-lift",
                fence.isInside ? fenceColors.bg : "bg-muted/30",
                fence.isInside ? fenceColors.border : "border-muted"
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Shield className={cn(
                      "w-5 h-5",
                      fence.isInside ? fenceColors.text : "text-muted-foreground"
                    )} />
                  </div>
                  <Badge variant={fence.isInside ? "default" : "secondary"}>
                    {fence.isInside ? "Inside" : "Outside"}
                  </Badge>
                </div>
                <h3 className="font-semibold">{fence.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Radius: {fence.radius < 1000 ? `${fence.radius}m` : `${fence.radius / 1000}km`}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Location History (Placeholder) */}
      <Card className="border border-dashed border-muted-foreground/30 bg-muted/20">
        <CardContent className="p-6 text-center">
          <Badge variant="secondary" className="mb-3">Coming Soon</Badge>
          <h3 className="font-semibold text-lg">Indoor Location Tracking</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Room-by-room tracking for dementia safety with multi-zone rules
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
