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
  Brain,
  Shield,
  AlertTriangle,
  MapPinOff,
  Circle
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

interface Geofence {
  id: string;
  name: string;
  type: "safe" | "warning" | "danger";
  radius: number; // meters
  isInside: boolean;
}

interface Location {
  current: string;
  lastUpdated: string;
  type: "home" | "outdoor" | "building";
  coordinates?: { lat: number; lng: number };
  geofenceStatus: "safe" | "warning" | "danger";
  geofences: Geofence[];
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
      location: { 
        current: "Living Room", 
        lastUpdated: "2 min ago", 
        type: "home",
        geofenceStatus: "safe",
        geofences: [
          { id: "1", name: "Home Zone", type: "safe", radius: 100, isInside: true },
          { id: "2", name: "Neighborhood", type: "warning", radius: 500, isInside: true },
          { id: "3", name: "City Boundary", type: "danger", radius: 5000, isInside: true },
        ]
      },
    },
    {
      id: "2",
      name: "Mary Johnson",
      age: 82,
      room: "Room 102",
      status: "resting",
      lastCheckIn: "15 min ago",
      heartRate: 110,
      temperature: 99.8,
      bloodPressure: "145/95",
      spo2: 93,
      respiratoryRate: 14,
      stressLevel: 65,
      conditions: ["Arthritis", "Heart Condition"],
      emergencyContact: "+1 (555) 234-5678",
      medications: [
        { id: "1", name: "Warfarin", dosage: "5mg", time: "09:00 AM", taken: true },
        { id: "2", name: "Atorvastatin", dosage: "20mg", time: "09:00 PM", taken: false, nextDose: "in 11 hours" },
        { id: "3", name: "Ibuprofen", dosage: "400mg", time: "As needed", taken: false },
      ],
      location: { 
        current: "Bedroom", 
        lastUpdated: "15 min ago", 
        type: "home",
        geofenceStatus: "safe",
        geofences: [
          { id: "1", name: "Home Zone", type: "safe", radius: 100, isInside: true },
          { id: "2", name: "Neighborhood", type: "warning", radius: 500, isInside: true },
        ]
      },
    },
    {
      id: "3",
      name: "Robert Williams",
      age: 75,
      room: "Room 103",
      status: "alert",
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
      location: { 
        current: "Park (Outside Zone)", 
        lastUpdated: "1 min ago", 
        type: "outdoor",
        geofenceStatus: "warning",
        geofences: [
          { id: "1", name: "Home Zone", type: "safe", radius: 100, isInside: false },
          { id: "2", name: "Neighborhood", type: "warning", radius: 500, isInside: true },
          { id: "3", name: "City Boundary", type: "danger", radius: 5000, isInside: true },
        ]
      },
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500 text-white";
      case "resting": return "bg-muted text-foreground";
      case "alert": return "bg-red-500 text-white";
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

  const getGeofenceStatusColor = (status: string) => {
    switch (status) {
      case "safe": return { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/30" };
      case "warning": return { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/30" };
      case "danger": return { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/30" };
      default: return { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" };
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

  const getVitalStatus = (type: string, value: number | string): "safe" | "warning" | "danger" => {
    if (type === "heartRate") {
      const v = value as number;
      if (v >= 60 && v <= 100) return "safe";
      if (v >= 50 && v < 60 || v > 100 && v <= 110) return "warning";
      return "danger";
    }
    if (type === "spo2") {
      const v = value as number;
      if (v >= 95) return "safe";
      if (v >= 90 && v < 95) return "warning";
      return "danger";
    }
    if (type === "temperature") {
      const v = value as number;
      if (v >= 97 && v <= 99) return "safe";
      if (v >= 96 && v < 97 || v > 99 && v <= 100) return "warning";
      return "danger";
    }
    if (type === "stress") {
      const v = value as number;
      if (v <= 40) return "safe";
      if (v > 40 && v <= 70) return "warning";
      return "danger";
    }
    if (type === "respiratory") {
      const v = value as number;
      if (v >= 12 && v <= 20) return "safe";
      if (v >= 10 && v < 12 || v > 20 && v <= 25) return "warning";
      return "danger";
    }
    return "safe";
  };

  const getVitalColor = (status: "safe" | "warning" | "danger") => {
    switch (status) {
      case "safe": return { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/30", icon: "text-emerald-500" };
      case "warning": return { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/30", icon: "text-amber-500" };
      case "danger": return { bg: "bg-red-500/10", text: "text-red-600", border: "border-red-500/30", icon: "text-red-500" };
    }
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
            {profiles.map((profile) => {
              const hrStatus = getVitalStatus("heartRate", profile.heartRate);
              const geoStatus = profile.location.geofenceStatus;
              return (
                <div 
                  key={profile.id}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-all hover-lift",
                    selectedProfile === profile.id && "ring-1 ring-foreground",
                    geoStatus === "danger" && "border-red-500/50",
                    geoStatus === "warning" && "border-amber-500/50",
                    geoStatus === "safe" && "border-border"
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
                      <div className="flex items-center gap-3 mt-1.5 text-xs">
                        <span className={cn("flex items-center gap-1", getVitalColor(hrStatus).text)}>
                          <Heart className="w-3 h-3" />
                          {profile.heartRate}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Pill className="w-3 h-3" />
                          {profile.medications.filter(m => m.taken).length}/{profile.medications.length}
                        </span>
                        <span className={cn("flex items-center gap-1", getGeofenceStatusColor(geoStatus).text)}>
                          <MapPin className="w-3 h-3" />
                          {profile.location.current}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                    ].map((vital, i) => {
                      const status = vital.type === "bp" ? "safe" : getVitalStatus(vital.type, parseFloat(vital.value));
                      const colors = getVitalColor(status);
                      return (
                        <div key={i} className={cn(
                          "p-4 border rounded-lg transition-all",
                          colors.bg, colors.border
                        )}>
                          <div className="flex items-center gap-2 mb-2">
                            <vital.icon className={cn("w-4 h-4", colors.icon)} />
                            <span className="text-xs text-muted-foreground">{vital.label}</span>
                            {status !== "safe" && (
                              <AlertTriangle className={cn("w-3 h-3 ml-auto", colors.icon)} />
                            )}
                          </div>
                          <p className={cn("text-xl font-semibold", colors.text)}>
                            {vital.value}
                            <span className="text-sm font-normal text-muted-foreground ml-1">{vital.unit}</span>
                          </p>
                          <p className={cn("text-xs mt-1 capitalize", colors.text)}>{status}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Geofencing & Location */}
                <div className="p-6 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Geofencing & Location</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Updated {selectedPerson.location.lastUpdated}</span>
                  </div>
                  
                  {/* Current Location Status */}
                  <div className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border mb-4",
                    getGeofenceStatusColor(selectedPerson.location.geofenceStatus).bg,
                    getGeofenceStatusColor(selectedPerson.location.geofenceStatus).border
                  )}>
                    {(() => {
                      const LocationIcon = getLocationIcon(selectedPerson.location.type);
                      const statusColors = getGeofenceStatusColor(selectedPerson.location.geofenceStatus);
                      return (
                        <>
                          <div className={cn("p-4 rounded-lg", statusColors.bg)}>
                            <LocationIcon className={cn("w-6 h-6", statusColors.text)} />
                          </div>
                          <div className="flex-1">
                            <p className="text-lg font-medium">{selectedPerson.location.current}</p>
                            <p className={cn("text-sm capitalize flex items-center gap-2", statusColors.text)}>
                              {selectedPerson.location.geofenceStatus === "safe" && <CheckCircle2 className="w-4 h-4" />}
                              {selectedPerson.location.geofenceStatus === "warning" && <AlertTriangle className="w-4 h-4" />}
                              {selectedPerson.location.geofenceStatus === "danger" && <AlertCircle className="w-4 h-4" />}
                              {selectedPerson.location.geofenceStatus} zone
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Geofence Zones */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground mb-3">Zone Status</p>
                    {selectedPerson.location.geofences.map((fence) => {
                      const colors = getGeofenceStatusColor(fence.type);
                      return (
                        <div key={fence.id} className={cn(
                          "flex items-center justify-between p-3 rounded-lg border",
                          fence.isInside ? colors.bg : "bg-muted/30",
                          fence.isInside ? colors.border : "border-border"
                        )}>
                          <div className="flex items-center gap-3">
                            <Circle className={cn(
                              "w-3 h-3",
                              fence.isInside ? colors.text : "text-muted-foreground"
                            )} fill={fence.isInside ? "currentColor" : "none"} />
                            <span className="text-sm font-medium">{fence.name}</span>
                            <span className="text-xs text-muted-foreground">({fence.radius}m radius)</span>
                          </div>
                          <Badge className={cn(
                            "text-xs",
                            fence.isInside ? colors.bg : "bg-muted",
                            fence.isInside ? colors.text : "text-muted-foreground",
                            "border",
                            fence.isInside ? colors.border : "border-border"
                          )}>
                            {fence.isInside ? "Inside" : "Outside"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>

                  {/* GPS Status */}
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">GPS Tracking</span>
                      <span className="font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Active
                      </span>
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
                            med.taken ? "bg-emerald-500/10" : "bg-amber-500/10"
                          )}>
                            <Pill className={cn("w-4 h-4", med.taken ? "text-emerald-500" : "text-amber-500")} />
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
                          <div className="flex items-center gap-2 text-sm text-emerald-500">
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
                  <Button className="flex-1 gap-2">
                    <Phone className="w-4 h-4" />
                    Call Contact
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Bell className="w-4 h-4" />
                    Send Alert
                  </Button>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a profile to view details</p>
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
