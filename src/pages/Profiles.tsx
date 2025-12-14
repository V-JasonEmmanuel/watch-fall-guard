import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  Heart, 
  Activity, 
  Thermometer, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronRight,
  Pill,
  Bell,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Home,
  Building2,
  Droplets,
  Wind,
  Brain
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  nextDose?: string;
}

interface Location {
  current: string;
  lastUpdated: string;
  type: "home" | "outdoor" | "building";
  coordinates?: { lat: number; lng: number };
}

interface ElderlyProfile {
  id: string;
  name: string;
  age: number;
  room: string;
  status: "active" | "resting" | "alert";
  lastCheckIn: string;
  heartRate: number;
  temperature: number;
  bloodPressure: string;
  spo2: number;
  respiratoryRate: number;
  stressLevel: number;
  conditions: string[];
  emergencyContact: string;
  medications: Medication[];
  location: Location;
}

const Profiles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProfile, setSelectedProfile] = useState<string | null>("1");

  const [profiles, setProfiles] = useState<ElderlyProfile[]>([
    {
      id: "1",
      name: "John Smith",
      age: 78,
      room: "Room 101",
      status: "active",
      lastCheckIn: "5 min ago",
      heartRate: 72,
      temperature: 98.4,
      bloodPressure: "120/80",
      spo2: 98,
      respiratoryRate: 16,
      stressLevel: 25,
      conditions: ["Hypertension", "Diabetes Type 2"],
      emergencyContact: "+1 (555) 123-4567",
      medications: [
        { id: "1", name: "Metformin", dosage: "500mg", time: "08:00 AM", taken: true },
        { id: "2", name: "Lisinopril", dosage: "10mg", time: "08:00 AM", taken: true },
        { id: "3", name: "Aspirin", dosage: "81mg", time: "12:00 PM", taken: false, nextDose: "in 2 hours" },
        { id: "4", name: "Metformin", dosage: "500mg", time: "06:00 PM", taken: false, nextDose: "in 8 hours" },
      ],
      location: { current: "Living Room", lastUpdated: "2 min ago", type: "home" },
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
      bloodPressure: "135/85",
      spo2: 97,
      respiratoryRate: 14,
      stressLevel: 15,
      conditions: ["Arthritis", "Heart Condition"],
      emergencyContact: "+1 (555) 234-5678",
      medications: [
        { id: "1", name: "Warfarin", dosage: "5mg", time: "09:00 AM", taken: true },
        { id: "2", name: "Atorvastatin", dosage: "20mg", time: "09:00 PM", taken: false, nextDose: "in 11 hours" },
        { id: "3", name: "Ibuprofen", dosage: "400mg", time: "As needed", taken: false },
      ],
      location: { current: "Bedroom", lastUpdated: "15 min ago", type: "home" },
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
      bloodPressure: "128/82",
      spo2: 96,
      respiratoryRate: 18,
      stressLevel: 35,
      conditions: ["COPD"],
      emergencyContact: "+1 (555) 345-6789",
      medications: [
        { id: "1", name: "Albuterol", dosage: "90mcg", time: "As needed", taken: true },
        { id: "2", name: "Tiotropium", dosage: "18mcg", time: "08:00 AM", taken: true },
        { id: "3", name: "Prednisone", dosage: "10mg", time: "08:00 AM", taken: true },
      ],
      location: { current: "Garden", lastUpdated: "1 min ago", type: "outdoor" },
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-foreground text-background";
      case "resting": return "bg-muted text-foreground";
      case "alert": return "bg-foreground text-background";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "home": return Home;
      case "outdoor": return Navigation;
      case "building": return Building2;
      default: return MapPin;
    }
  };

  const handleMarkMedicationTaken = (profileId: string, medicationId: string) => {
    setProfiles(prev => prev.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          medications: profile.medications.map(med => 
            med.id === medicationId ? { ...med, taken: true } : med
          )
        };
      }
      return profile;
    }));
    toast({
      title: "Medication marked as taken",
      description: "The medication reminder has been updated.",
    });
  };

  const selectedPerson = profiles.find(p => p.id === selectedProfile);
  const takenMeds = selectedPerson?.medications.filter(m => m.taken).length || 0;
  const totalMeds = selectedPerson?.medications.length || 0;

  const isVitalCritical = (type: string, value: number | string) => {
    if (type === "heartRate") return (value as number) > 100 || (value as number) < 60;
    if (type === "spo2") return (value as number) < 95;
    if (type === "temperature") return (value as number) > 99.5 || (value as number) < 97;
    if (type === "stress") return (value as number) > 70;
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-foreground rounded-lg">
                  <Users className="w-5 h-5 text-background" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Elderly Profiles</h1>
                  <p className="text-xs text-muted-foreground">{profiles.length} people monitored</p>
                </div>
              </div>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Person
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profiles List */}
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">All Profiles</p>
            {profiles.map((profile) => (
              <div 
                key={profile.id}
                className={cn(
                  "p-4 border border-border rounded-lg cursor-pointer transition-all hover-lift",
                  selectedProfile === profile.id && "ring-1 ring-foreground"
                )}
                onClick={() => setSelectedProfile(profile.id)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarFallback className="bg-muted text-sm font-medium">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium truncate">{profile.name}</h3>
                      <Badge className={cn("text-xs shrink-0", getStatusColor(profile.status))}>
                        {profile.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{profile.age} yrs • {profile.room}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {profile.heartRate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Pill className="w-3 h-3" />
                        {profile.medications.filter(m => m.taken).length}/{profile.medications.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {profile.location.current}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedPerson ? (
              <>
                {/* Profile Header */}
                <div className="p-6 border border-border rounded-lg">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-20 w-20 border border-border">
                      <AvatarFallback className="bg-muted text-xl font-medium">
                        {selectedPerson.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-semibold">{selectedPerson.name}</h2>
                          <p className="text-muted-foreground">{selectedPerson.age} years old</p>
                        </div>
                        <Badge className={cn("text-sm px-3 py-1", getStatusColor(selectedPerson.status))}>
                          {selectedPerson.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {selectedPerson.room}
                        </span>
                        <span className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {selectedPerson.emergencyContact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Vitals Grid */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-4">Health Vitals</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "Heart Rate", value: `${selectedPerson.heartRate}`, unit: "bpm", icon: Heart, type: "heartRate" },
                      { label: "Blood Pressure", value: selectedPerson.bloodPressure, unit: "mmHg", icon: Activity, type: "bp" },
                      { label: "SpO2", value: `${selectedPerson.spo2}`, unit: "%", icon: Droplets, type: "spo2" },
                      { label: "Temperature", value: `${selectedPerson.temperature}`, unit: "°F", icon: Thermometer, type: "temperature" },
                      { label: "Respiratory", value: `${selectedPerson.respiratoryRate}`, unit: "/min", icon: Wind, type: "respiratory" },
                      { label: "Stress Level", value: `${selectedPerson.stressLevel}`, unit: "%", icon: Brain, type: "stress" },
                    ].map((vital, i) => (
                      <div key={i} className={cn(
                        "p-4 border border-border rounded-lg",
                        isVitalCritical(vital.type, vital.type === "bp" ? 0 : parseFloat(vital.value)) && "border-foreground bg-muted/50"
                      )}>
                        <div className="flex items-center gap-2 mb-2">
                          <vital.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{vital.label}</span>
                        </div>
                        <p className="text-xl font-semibold">
                          {vital.value}
                          <span className="text-sm font-normal text-muted-foreground ml-1">{vital.unit}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Tracking */}
                <div className="p-6 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Location Tracking</p>
                    <span className="text-xs text-muted-foreground">Updated {selectedPerson.location.lastUpdated}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {(() => {
                      const LocationIcon = getLocationIcon(selectedPerson.location.type);
                      return (
                        <div className="p-4 bg-foreground rounded-lg">
                          <LocationIcon className="w-6 h-6 text-background" />
                        </div>
                      );
                    })()}
                    <div>
                      <p className="text-lg font-medium">{selectedPerson.location.current}</p>
                      <p className="text-sm text-muted-foreground capitalize">{selectedPerson.location.type} location</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">GPS tracking</span>
                      <span className="font-medium">Active</span>
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div className="border border-border rounded-lg">
                  <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Medications</p>
                      <p className="text-sm text-muted-foreground mt-1">{takenMeds} of {totalMeds} taken today</p>
                    </div>
                    <Progress value={(takenMeds / totalMeds) * 100} className="w-24 h-2" />
                  </div>
                  <div className="divide-y divide-border">
                    {selectedPerson.medications.map((med) => (
                      <div key={med.id} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "p-2 rounded-lg",
                            med.taken ? "bg-muted" : "bg-foreground"
                          )}>
                            <Pill className={cn("w-4 h-4", med.taken ? "text-muted-foreground" : "text-background")} />
                          </div>
                          <div>
                            <p className={cn("font-medium", med.taken && "text-muted-foreground")}>
                              {med.name} - {med.dosage}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {med.time} {med.nextDose && <span>• {med.nextDose}</span>}
                            </p>
                          </div>
                        </div>
                        {med.taken ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4" />
                            Taken
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkMedicationTaken(selectedPerson.id, med.id)}
                          >
                            Mark Taken
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical Conditions */}
                <div className="p-6 border border-border rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-4">Medical Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPerson.conditions.map((condition, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1 font-normal">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4">
                  <Button className="flex-1 gap-2" onClick={() => navigate("/monitor")}>
                    <Activity className="w-4 h-4" />
                    Health Monitor
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Phone className="w-4 h-4" />
                    Emergency Contact
                  </Button>
                </div>
              </>
            ) : (
              <div className="border border-border rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-medium">Select a Profile</h3>
                  <p className="text-sm text-muted-foreground">Click on a profile to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profiles;