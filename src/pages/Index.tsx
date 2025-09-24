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
    <div className="min-h-screen bg-gradient-to-br from-medical-blue to-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-medical-blue-dark rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">ElderGuard</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced fall detection system combining computer vision and wearable sensors 
            for comprehensive elderly care monitoring.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="shadow-medical hover:shadow-elevated transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-medical-blue-dark" />
                Computer Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Real-time posture analysis using MediaPipe Pose detection to identify fall patterns.
              </p>
              <Badge className="bg-safety-green text-safety-green-dark">
                Active Monitoring
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-medical hover:shadow-elevated transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-medical-blue-dark" />
                Samsung Watch 5
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Accelerometer data fusion for precise fall detection with 2.5g threshold monitoring.
              </p>
              <Badge className="bg-medical-blue text-medical-blue-dark">
                Sensor Fusion
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-medical hover:shadow-elevated transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-medical-blue-dark" />
                Instant Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Automatic WhatsApp notifications to family, doctors, and caretakers upon fall detection.
              </p>
              <Badge className="bg-alert-red text-alert-red-dark">
                Emergency System
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        <Card className="shadow-medical mb-12">
          <CardHeader>
            <CardTitle className="text-center">Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <div className="text-2xl mb-2">📹</div>
                <h3 className="font-semibold">Computer Vision</h3>
                <p className="text-sm text-muted-foreground">MediaPipe Pose</p>
              </div>
              <div className="p-4">
                <div className="text-2xl mb-2">⌚</div>
                <h3 className="font-semibold">Wearable Sensors</h3>
                <p className="text-sm text-muted-foreground">Samsung Health SDK</p>
              </div>
              <div className="p-4">
                <div className="text-2xl mb-2">🧠</div>
                <h3 className="font-semibold">AI Fusion</h3>
                <p className="text-sm text-muted-foreground">Sensor Data Analysis</p>
              </div>
              <div className="p-4">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-semibold">Instant Alerts</h3>
                <p className="text-sm text-muted-foreground">WhatsApp API</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Button 
            onClick={() => setActiveView("dashboard")}
            size="lg"
            className="bg-medical-blue-dark hover:bg-medical-blue-dark/90 text-white px-8 py-4 text-lg"
          >
            Launch Monitoring Dashboard
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Demo ready with simulated sensor data
          </p>
        </div>

        {/* Backend Notice */}
        <Card className="mt-12 border-warning bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Settings className="w-5 h-5 text-warning" />
              <h3 className="font-semibold text-warning-foreground">Backend Integration Required</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              WhatsApp alerts and data storage require backend setup. Connect Supabase to enable:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 mb-4">
              <li>• Real WhatsApp notifications via Twilio/Meta API</li>
              <li>• Persistent alert history and user data</li>
              <li>• Emergency contact management</li>
              <li>• Multi-user support and authentication</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
