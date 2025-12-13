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
  Phone,
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
      color: "from-primary to-primary/70",
      badge: "4 Active",
      route: "/cameras",
    },
    {
      id: "profiles",
      title: "Elderly Profiles",
      description: "Track and manage care recipients",
      icon: Users,
      color: "from-success to-success/70",
      badge: "3 People",
      route: "/profiles",
    },
    {
      id: "healthcare",
      title: "Healthcare",
      description: "Book appointments, scans & tests",
      icon: Stethoscope,
      color: "from-health-bp to-health-bp/70",
      badge: "2 Upcoming",
      route: "/healthcare",
    },
    {
      id: "emergency",
      title: "Emergency Care",
      description: "Quick access to emergency services",
      icon: Ambulance,
      color: "from-destructive to-destructive/70",
      badge: "Ready",
      route: "/emergency",
    },
  ];

  const quickStats = [
    { label: "Active Monitors", value: "4", icon: Video, color: "text-primary" },
    { label: "People Tracked", value: "3", icon: Users, color: "text-success" },
    { label: "Upcoming Appointments", value: "2", icon: Calendar, color: "text-health-bp" },
    { label: "System Status", value: "Online", icon: Activity, color: "text-success" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero bg-gradient-mesh">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 bg-gradient-medical rounded-xl shadow-glow">
                <Shield className="w-6 h-6 text-primary-foreground" />
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-gradient">ElderGuard</h1>
                <p className="text-xs text-muted-foreground">Care Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="w-5 h-5" />
                {alerts > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
                    {alerts}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, i) => (
            <Card key={i} className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {menuItems.map((item) => (
            <Card 
              key={item.id}
              className="group border-0 shadow-large bg-card/80 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              onClick={() => navigate(item.route)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} shadow-medium group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold font-display">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <Badge variant="secondary" className="mt-2">{item.badge}</Badge>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: Heart, text: "John's heart rate normal at 72 bpm", time: "2 min ago", color: "text-health-heart" },
                { icon: Camera, text: "Motion detected in Living Room", time: "15 min ago", color: "text-primary" },
                { icon: Calendar, text: "Dr. Smith appointment confirmed", time: "1 hour ago", color: "text-health-bp" },
                { icon: Users, text: "Mary completed daily check-in", time: "2 hours ago", color: "text-success" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-lg bg-muted`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
