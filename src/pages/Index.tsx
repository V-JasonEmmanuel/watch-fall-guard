import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Shield, 
  Phone, 
  Heart,
  Watch,
  Camera,
  Activity,
  ArrowRight,
  CheckCircle,
  Zap,
  Cloud,
  Bell
} from "lucide-react";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const [activeView, setActiveView] = useState<"landing" | "dashboard">("landing");

  if (activeView === "dashboard") {
    return <Dashboard />;
  }

  const features = [
    {
      icon: Camera,
      title: "AI Vision Detection",
      description: "MediaPipe Pose analyzes posture in real-time with 95%+ accuracy",
      gradient: "from-primary to-primary/70",
    },
    {
      icon: Watch,
      title: "Samsung Watch 5",
      description: "Precision accelerometer with 2.5g fall threshold detection",
      gradient: "from-success to-success/70",
    },
    {
      icon: Heart,
      title: "Health Monitoring",
      description: "Heart rate, BP, SpO2, ECG, temperature & stress tracking",
      gradient: "from-health-heart to-health-heart/70",
    },
    {
      icon: Bell,
      title: "Instant Alerts",
      description: "WhatsApp notifications to family, caregivers & doctors",
      gradient: "from-warning to-warning/70",
    },
  ];

  const healthMetrics = [
    { name: "Heart Rate", icon: Heart, color: "text-health-heart" },
    { name: "Blood Pressure", icon: Activity, color: "text-health-bp" },
    { name: "SpO2", icon: Zap, color: "text-health-spo2" },
    { name: "ECG", icon: Activity, color: "text-health-ecg" },
  ];

  const stats = [
    { value: "95%", label: "Detection Accuracy" },
    { value: "<3s", label: "Alert Response" },
    { value: "24/7", label: "Monitoring" },
    { value: "6+", label: "Health Metrics" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero bg-gradient-mesh">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-success/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full bg-medical-accent/10 blur-3xl animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-4 pt-20 pb-16 relative">
          {/* Header Badge */}
          <div className="flex justify-center mb-8">
            <Badge variant="outline" className="px-4 py-2 text-sm bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
              <Shield className="w-4 h-4 mr-2 text-primary" />
              Intelligent Elder Care Protection
            </Badge>
          </div>

          {/* Main Title */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative p-4 bg-gradient-medical rounded-2xl shadow-glow">
                <Shield className="w-12 h-12 text-primary-foreground" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-pulse border-2 border-card" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
              <span className="text-gradient">ElderGuard</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Revolutionary fall detection combining{" "}
              <span className="text-primary font-medium">AI-powered vision</span>,{" "}
              <span className="text-success font-medium">Samsung Watch sensors</span>, and{" "}
              <span className="text-health-heart font-medium">health monitoring</span>
            </p>
          </div>

          {/* Health Metrics Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {healthMetrics.map((metric, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border/50 shadow-soft"
              >
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
                <span className="text-sm font-medium">{metric.name}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mb-16">
            <Button 
              onClick={() => setActiveView("dashboard")}
              size="lg"
              className="group px-8 py-6 text-lg font-semibold bg-gradient-medical text-primary-foreground shadow-glow hover:shadow-large transition-all duration-300 hover:scale-105"
            >
              Launch Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold font-display text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Comprehensive Protection System
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Multi-sensor fusion technology for accurate fall detection and health monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card 
                key={i} 
                className="group border-0 shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-soft`}>
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold font-display mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Backend Notice */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="border border-dashed border-border bg-muted/30 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="p-4 bg-primary/10 rounded-xl">
                  <Cloud className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold font-display mb-2">Backend Integration Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect to Lovable Cloud to unlock full functionality including real-time alerts, persistent data storage, and Samsung Health SDK integration.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["WhatsApp API", "Cloud Storage", "User Auth", "Analytics"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>ElderGuard — Intelligent Fall Detection & Health Monitoring System</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
