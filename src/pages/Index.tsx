import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  MapPin, 
  Camera, 
  Pill, 
  Phone, 
  Bot, 
  Sun, 
  Moon,
  Activity,
  Shield,
  Smile,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Users,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { VoiceCompanion } from "@/components/VoiceCompanion";
import { HealthDashboard } from "@/components/HealthDashboard";
import { LocationTracker } from "@/components/LocationTracker";
import { DailyAssistant } from "@/components/DailyAssistant";

const Index = () => {
  const navigate = useNavigate();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAIExpanded, setIsAIExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Mock status data
  const overallStatus = {
    health: "stable" as const,
    activity: "normal" as const,
    emotional: "calm" as const,
    lastAlert: "2 hours ago",
  };

  const statusConfig = {
    stable: { color: "bg-safe text-safe-foreground", icon: CheckCircle2, label: "Stable" },
    warning: { color: "bg-warning text-warning-foreground", icon: AlertTriangle, label: "Needs Attention" },
    critical: { color: "bg-critical text-critical-foreground", icon: AlertTriangle, label: "Critical" },
    normal: { color: "bg-info text-info-foreground", icon: Activity, label: "Normal" },
    calm: { color: "bg-safe text-safe-foreground", icon: Smile, label: "Calm" },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary rounded-xl">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ElderGuard</h1>
                <p className="text-xs text-muted-foreground">Care Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-critical rounded-full" />
              </Button>
              <Button onClick={() => setIsAIOpen(true)} className="gap-2 elder-button">
                <Bot className="w-5 h-5" />
                Talk to GrampsAI
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Status Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="elder-card-safe">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-safe" />
                <div>
                  <p className="text-sm text-muted-foreground">Health</p>
                  <p className="text-xl font-bold text-safe">Stable</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="elder-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-info" />
                <div>
                  <p className="text-sm text-muted-foreground">Activity</p>
                  <p className="text-xl font-bold">Normal</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="elder-card-safe">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Smile className="w-8 h-8 text-safe" />
                <div>
                  <p className="text-sm text-muted-foreground">Emotional</p>
                  <p className="text-xl font-bold text-safe">Calm</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="elder-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Bell className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Alert</p>
                  <p className="text-xl font-bold">2h ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency SOS Button */}
        <Card className="bg-critical/5 border-2 border-critical/30">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Emergency Assistance</h2>
              <p className="text-muted-foreground">Tap for immediate help</p>
            </div>
            <Button 
              onClick={() => navigate('/emergency')}
              className="h-20 w-20 rounded-full bg-critical hover:bg-critical/90 text-2xl font-bold sos-pulse"
            >
              SOS
            </Button>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-14">
            <TabsTrigger value="overview" className="text-base gap-2">
              <Heart className="w-4 h-4" /> Health
            </TabsTrigger>
            <TabsTrigger value="location" className="text-base gap-2">
              <MapPin className="w-4 h-4" /> Location
            </TabsTrigger>
            <TabsTrigger value="daily" className="text-base gap-2">
              <Pill className="w-4 h-4" /> Daily Care
            </TabsTrigger>
            <TabsTrigger value="safety" className="text-base gap-2">
              <Camera className="w-4 h-4" /> Safety
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <HealthDashboard showSimpleMode={true} />
          </TabsContent>

          <TabsContent value="location">
            <LocationTracker />
          </TabsContent>

          <TabsContent value="daily">
            <DailyAssistant />
          </TabsContent>

          <TabsContent value="safety">
            <div className="space-y-4">
              <Card className="hover-lift cursor-pointer" onClick={() => navigate('/cameras')}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-primary/10">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">Fall Detection Cameras</h3>
                    <p className="text-muted-foreground">AI-powered monitoring</p>
                  </div>
                  <Badge className="bg-safe/10 text-safe">4 Active</Badge>
                </CardContent>
              </Card>
              <Card className="hover-lift cursor-pointer" onClick={() => navigate('/profiles')}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-info/10">
                    <Users className="w-8 h-8 text-info" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">Elderly Profiles</h3>
                    <p className="text-muted-foreground">Health & location data</p>
                  </div>
                  <Badge variant="secondary">3 People</Badge>
                </CardContent>
              </Card>
              <Card className="hover-lift cursor-pointer" onClick={() => navigate('/healthcare')}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-health-bp/10">
                    <Stethoscope className="w-8 h-8 text-health-bp" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">Healthcare</h3>
                    <p className="text-muted-foreground">Appointments & records</p>
                  </div>
                  <Badge variant="secondary">2 Upcoming</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Voice AI Companion */}
      <VoiceCompanion 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)}
        isExpanded={isAIExpanded}
        onToggleExpand={() => setIsAIExpanded(!isAIExpanded)}
      />
    </div>
  );
};

export default Index;
