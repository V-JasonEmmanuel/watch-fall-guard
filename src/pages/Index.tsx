import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Users, 
  Stethoscope, 
  Ambulance,
  Shield,
  Bell,
  Settings,
  ChevronRight,
  Activity,
  Heart,
  Video,
  Calendar,
  Pill,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [alerts] = useState(3);

  const menuItems = [
    {
      id: "cameras",
      title: "Security Cameras",
      description: "Monitor live feeds from all rooms",
      icon: Camera,
      badge: "4 Active",
      route: "/cameras",
    },
    {
      id: "profiles",
      title: "Elderly Profiles",
      description: "Health, medications & location tracking",
      icon: Users,
      badge: "3 People",
      route: "/profiles",
    },
    {
      id: "healthcare",
      title: "Healthcare",
      description: "Book appointments, scans & tests",
      icon: Stethoscope,
      badge: "2 Upcoming",
      route: "/healthcare",
    },
    {
      id: "emergency",
      title: "Emergency Care",
      description: "Quick access to emergency services",
      icon: Ambulance,
      badge: "Ready",
      route: "/emergency",
    },
  ];

  const quickStats = [
    { label: "Active Monitors", value: "4", icon: Video },
    { label: "People Tracked", value: "3", icon: Users },
    { label: "Medications Today", value: "8", icon: Pill },
    { label: "System Status", value: "Online", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-foreground rounded-lg">
                <Shield className="w-5 h-5 text-background" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">ElderGuard</h1>
                <p className="text-xs text-muted-foreground tracking-wide uppercase">Care Management</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="w-5 h-5" />
                {alerts > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-foreground rounded-full" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {quickStats.map((stat, i) => (
            <div key={i} className="p-5 border border-border rounded-lg hover-lift">
              <div className="flex items-center gap-3 mb-3">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              </div>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              className="group p-6 border border-border rounded-lg cursor-pointer hover-lift bg-card"
              onClick={() => navigate(item.route)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-5">
                  <div className="p-4 bg-foreground rounded-lg group-hover:bg-foreground/90 transition-colors">
                    <item.icon className="w-6 h-6 text-background" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <Badge variant="secondary" className="mt-2 text-xs font-normal">{item.badge}</Badge>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="border border-border rounded-lg">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-border">
            {[
              { icon: Heart, text: "John's heart rate normal at 72 bpm", time: "2 min ago" },
              { icon: Pill, text: "Mary took morning medication", time: "10 min ago" },
              { icon: MapPin, text: "Robert arrived at Living Room", time: "15 min ago" },
              { icon: Calendar, text: "Dr. Smith appointment confirmed", time: "1 hour ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                <div className="p-2 rounded-md bg-muted">
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;