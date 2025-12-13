import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Users, Plus, Heart, Activity, Thermometer, MapPin, Phone, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ElderlyProfile {
  id: string;
  name: string;
  age: number;
  room: string;
  status: "active" | "resting" | "alert";
  lastCheckIn: string;
  heartRate: number;
  temperature: number;
  conditions: string[];
  emergencyContact: string;
}

const Profiles = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const profiles: ElderlyProfile[] = [
    {
      id: "1",
      name: "John Smith",
      age: 78,
      room: "Room 101",
      status: "active",
      lastCheckIn: "5 min ago",
      heartRate: 72,
      temperature: 98.4,
      conditions: ["Hypertension", "Diabetes Type 2"],
      emergencyContact: "+1 (555) 123-4567",
    },
    {
      id: "2",
      name: "Mary Johnson",
      age: 82,
      room: "Room 102",
      status: "resting",
      lastCheckIn: "15 min ago",
      heartRate: 68,
      temperature: 98.2,
      conditions: ["Arthritis", "Heart Condition"],
      emergencyContact: "+1 (555) 234-5678",
    },
    {
      id: "3",
      name: "Robert Williams",
      age: 75,
      room: "Room 103",
      status: "active",
      lastCheckIn: "2 min ago",
      heartRate: 76,
      temperature: 98.6,
      conditions: ["COPD"],
      emergencyContact: "+1 (555) 345-6789",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "resting": return "bg-primary text-primary-foreground";
      case "alert": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const selectedPerson = profiles.find(p => p.id === selectedProfile);

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
                <div className="p-2.5 bg-success/10 rounded-xl">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display">Elderly Profiles</h1>
                  <p className="text-xs text-muted-foreground">{profiles.length} people being monitored</p>
                </div>
              </div>
            </div>
            <Button className="gap-2 bg-gradient-success text-primary-foreground">
              <Plus className="w-4 h-4" />
              Add Person
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profiles List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">All Profiles</h3>
            {profiles.map((profile) => (
              <Card 
                key={profile.id}
                className={cn(
                  "border-0 shadow-soft bg-card/80 backdrop-blur-sm cursor-pointer transition-all hover:shadow-medium",
                  selectedProfile === profile.id && "ring-2 ring-success shadow-glow-success"
                )}
                onClick={() => setSelectedProfile(profile.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-border">
                      <AvatarFallback className="bg-muted text-lg font-semibold">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{profile.name}</h3>
                        <Badge className={cn("text-xs", getStatusColor(profile.status))}>
                          {profile.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{profile.age} years • {profile.room}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-health-heart" />
                          {profile.heartRate} bpm
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {profile.lastCheckIn}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            {selectedPerson ? (
              <div className="space-y-6">
                {/* Profile Header */}
                <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <Avatar className="h-24 w-24 border-4 border-border">
                        <AvatarFallback className="bg-muted text-2xl font-semibold">
                          {selectedPerson.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-2xl font-bold font-display">{selectedPerson.name}</h2>
                            <p className="text-muted-foreground">{selectedPerson.age} years old</p>
                          </div>
                          <Badge className={cn("text-sm px-3 py-1", getStatusColor(selectedPerson.status))}>
                            {selectedPerson.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            {selectedPerson.room}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            {selectedPerson.emergencyContact}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vitals */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-health-heart/10">
                          <Heart className="w-6 h-6 text-health-heart" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Heart Rate</p>
                          <p className="text-2xl font-bold font-display">{selectedPerson.heartRate} <span className="text-sm font-normal text-muted-foreground">bpm</span></p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-health-temp/10">
                          <Thermometer className="w-6 h-6 text-health-temp" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Temperature</p>
                          <p className="text-2xl font-bold font-display">{selectedPerson.temperature}°F</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Conditions */}
                <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-display">
                      <Activity className="w-5 h-5 text-primary" />
                      Medical Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedPerson.conditions.map((condition, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="flex gap-4">
                  <Button className="flex-1 gap-2" onClick={() => navigate("/monitor")}>
                    <Activity className="w-4 h-4" />
                    View Health Monitor
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Emergency
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm h-full flex items-center justify-center">
                <CardContent className="text-center py-20">
                  <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Select a Profile</h3>
                  <p className="text-muted-foreground">Click on a profile to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profiles;
