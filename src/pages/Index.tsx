import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Shield, Phone, Settings } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const [activeView, setActiveView] = useState<"landing" | "dashboard">("landing");

  if (activeView === "dashboard") {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-medical-primary opacity-10 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-medical-accent opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-medical-secondary opacity-5 animate-pulse-slow"></div>
      </div>

      <div className="relative container mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative p-4 bg-gradient-medical rounded-2xl shadow-glow animate-glow">
              <Shield className="w-12 h-12 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-medical-secondary rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-7xl font-bold bg-gradient-to-r from-medical-primary to-medical-accent bg-clip-text text-transparent mb-6 leading-tight">
            ElderGuard
          </h1>
          
          <div className="relative">
            <p className="text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed mb-8">
              Revolutionary fall detection system combining 
              <span className="text-medical-primary font-semibold"> AI-powered computer vision</span> and 
              <span className="text-medical-accent font-semibold"> Samsung Galaxy Watch</span> sensors
            </p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-medical rounded-full"></div>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-medical-secondary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-foreground/70">Real-time Monitoring</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-medical-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span className="text-sm font-medium text-foreground/70">Instant Alerts</span>
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <Card className="group relative overflow-hidden bg-gradient-card backdrop-blur-sm border-0 shadow-large hover:shadow-glow transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-medical opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <CardHeader className="relative">
              <div className="w-16 h-16 bg-gradient-medical rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-foreground group-hover:text-medical-primary transition-colors">
                Computer Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-foreground/70 text-lg leading-relaxed mb-6">
                Advanced MediaPipe Pose detection analyzes posture changes in real-time, identifying fall patterns with 95%+ accuracy.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-medical-secondary rounded-full"></div>
                  <span className="text-sm text-foreground/60">Real-time pose analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-medical-secondary rounded-full"></div>
                  <span className="text-sm text-foreground/60">Fall pattern recognition</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-medical-secondary rounded-full"></div>
                  <span className="text-sm text-foreground/60">Privacy-first processing</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-card backdrop-blur-sm border-0 shadow-large hover:shadow-success transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <CardHeader className="relative">
              <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-foreground group-hover:text-medical-secondary transition-colors">
                Samsung Watch 5
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-foreground/70 text-lg leading-relaxed mb-6">
                Precision accelerometer monitoring detects sudden impacts and movement patterns using Samsung Health SDK integration.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-medical-primary rounded-full"></div>
                  <span className="text-sm text-foreground/60">2.5g fall threshold</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-medical-primary rounded-full"></div>
                  <span className="text-sm text-foreground/60">Motion analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-medical-primary rounded-full"></div>
                  <span className="text-sm text-foreground/60">Battery optimization</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-card backdrop-blur-sm border-0 shadow-large hover:shadow-danger transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-danger opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <CardHeader className="relative">
              <div className="w-16 h-16 bg-gradient-danger rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-foreground group-hover:text-medical-error transition-colors">
                Instant Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-foreground/70 text-lg leading-relaxed mb-6">
                Immediate WhatsApp notifications to family, caregivers, and medical professionals when falls are detected.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-medical-accent rounded-full"></div>
                  <span className="text-sm text-foreground/60">Multi-contact alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-medical-accent rounded-full"></div>
                  <span className="text-sm text-foreground/60">Location sharing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-medical-accent rounded-full"></div>
                  <span className="text-sm text-foreground/60">Emergency escalation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16">
          <Button 
            onClick={() => setActiveView("dashboard")}
            size="lg"
            className="relative px-12 py-6 text-xl font-semibold bg-gradient-medical text-white border-0 shadow-glow hover:shadow-large transition-all duration-300 hover:scale-105 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            <span className="relative flex items-center gap-3">
              Launch Monitoring Dashboard
              <Monitor className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            </span>
          </Button>
          
          <p className="text-foreground/60 mt-6 text-lg">
            Experience the future of elderly care monitoring
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-medical-primary mb-2">95%</div>
            <div className="text-foreground/60">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-medical-secondary mb-2">&lt;5s</div>
            <div className="text-foreground/60">Alert Time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-medical-accent mb-2">24/7</div>
            <div className="text-foreground/60">Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-medical-error mb-2">0</div>
            <div className="text-foreground/60">False Positives</div>
          </div>
        </div>

        {/* Backend Notice */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-warning mb-3">Backend Integration Available</h3>
                <p className="text-foreground/70 text-lg leading-relaxed mb-4">
                  Connect Supabase to unlock the full potential of ElderGuard with real-time alerts, persistent data storage, and multi-user support.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground/60">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-warning rounded-full"></div>
                    <span>WhatsApp API integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-warning rounded-full"></div>
                    <span>Cloud data storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-warning rounded-full"></div>
                    <span>User authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-warning rounded-full"></div>
                    <span>Analytics dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
