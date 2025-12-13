import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Ambulance, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Heart,
  Shield,
  Navigation,
  Clock,
  User,
  PhoneCall,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface EmergencyService {
  id: string;
  name: string;
  type: "ambulance" | "hospital" | "police" | "fire";
  phone: string;
  distance: string;
  eta: string;
  available: boolean;
}

const Emergency = () => {
  const navigate = useNavigate();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const emergencyServices: EmergencyService[] = [
    { id: "1", name: "City Ambulance Service", type: "ambulance", phone: "911", distance: "0.5 mi", eta: "3 min", available: true },
    { id: "2", name: "General Hospital ER", type: "hospital", phone: "(555) 123-4567", distance: "1.2 mi", eta: "8 min", available: true },
    { id: "3", name: "Police Department", type: "police", phone: "911", distance: "0.8 mi", eta: "5 min", available: true },
    { id: "4", name: "Fire Department", type: "fire", phone: "911", distance: "0.6 mi", eta: "4 min", available: true },
  ];

  const emergencyContacts = [
    { name: "Dr. Sarah Johnson", role: "Primary Doctor", phone: "+1 (555) 123-4567" },
    { name: "Mary Smith", role: "Daughter", phone: "+1 (555) 987-6543" },
    { name: "Home Care Service", role: "Caretaker", phone: "+1 (555) 456-7890" },
  ];

  const triggerEmergency = () => {
    setIsEmergencyActive(true);
    toast({
      title: "🚨 Emergency Alert Sent",
      description: "Notifying all emergency contacts and services...",
      variant: "destructive",
    });
  };

  const callNumber = (phone: string) => {
    toast({
      title: "Calling...",
      description: `Initiating call to ${phone}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero bg-gradient-mesh">
      {isEmergencyActive && (
        <div className="bg-destructive text-destructive-foreground py-4 px-4 animate-pulse">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <span className="font-bold text-lg">EMERGENCY ALERT ACTIVE - Help is on the way!</span>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-destructive/10 rounded-xl">
                  <Ambulance className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display">Emergency Care</h1>
                  <p className="text-xs text-muted-foreground">Quick access to emergency services</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              <Shield className="w-3 h-3 mr-1" />
              System Ready
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Emergency Button */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-destructive/10 to-destructive/5 mb-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold font-display mb-4">Emergency Assistance</h2>
            <p className="text-muted-foreground mb-6">Press the button below to alert all emergency contacts and nearby services</p>
            
            <Button 
              size="lg"
              onClick={triggerEmergency}
              className={cn(
                "h-32 w-32 rounded-full text-2xl font-bold shadow-xl transition-all",
                isEmergencyActive 
                  ? "bg-destructive animate-pulse" 
                  : "bg-gradient-to-br from-destructive to-destructive/80 hover:scale-105 hover:shadow-2xl"
              )}
            >
              {isEmergencyActive ? "ACTIVE" : "SOS"}
            </Button>
            
            <p className="text-sm text-muted-foreground mt-6">
              This will notify emergency services and all registered contacts
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency Services */}
          <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Ambulance className="w-5 h-5 text-destructive" />
                Nearby Emergency Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergencyServices.map((service) => (
                <div 
                  key={service.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className={cn(
                    "p-3 rounded-xl",
                    service.type === "ambulance" && "bg-destructive/10",
                    service.type === "hospital" && "bg-health-bp/10",
                    service.type === "police" && "bg-primary/10",
                    service.type === "fire" && "bg-warning/10"
                  )}>
                    {service.type === "ambulance" && <Ambulance className="w-6 h-6 text-destructive" />}
                    {service.type === "hospital" && <Heart className="w-6 h-6 text-health-bp" />}
                    {service.type === "police" && <Shield className="w-6 h-6 text-primary" />}
                    {service.type === "fire" && <AlertTriangle className="w-6 h-6 text-warning" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{service.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {service.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ETA: {service.eta}
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="gap-1 bg-destructive text-destructive-foreground"
                    onClick={() => callNumber(service.phone)}
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Phone className="w-5 h-5 text-primary" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergencyContacts.map((contact, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="p-3 rounded-xl bg-muted">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => callNumber(contact.phone)}
                    >
                      <PhoneCall className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full gap-2 mt-4">
                <Navigation className="w-4 h-4" />
                Share Live Location
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm mt-6">
          <CardHeader>
            <CardTitle className="font-display">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Call 911", icon: PhoneCall, color: "from-destructive to-destructive/70", action: () => callNumber("911") },
                { title: "Share Location", icon: Navigation, color: "from-primary to-primary/70", action: () => {} },
                { title: "Alert Contacts", icon: MessageSquare, color: "from-warning to-warning/70", action: () => {} },
                { title: "Medical Info", icon: Heart, color: "from-health-heart to-health-heart/70", action: () => {} },
              ].map((item, i) => (
                <Button 
                  key={i}
                  variant="outline" 
                  className="h-auto flex-col gap-3 p-6 hover:shadow-medium transition-all"
                  onClick={item.action}
                >
                  <div className={cn("p-3 rounded-xl bg-gradient-to-br", item.color)}>
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="font-medium text-sm">{item.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Emergency;
