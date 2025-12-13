import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  ArrowLeft, 
  Stethoscope, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User,
  FileText,
  Scan,
  TestTube,
  ChevronRight,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  type: "doctor" | "scan" | "test";
  title: string;
  doctor?: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  patient: string;
}

const Healthcare = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("appointments");

  const appointments: Appointment[] = [
    {
      id: "1",
      type: "doctor",
      title: "General Checkup",
      doctor: "Dr. Sarah Johnson",
      date: "Dec 15, 2024",
      time: "10:00 AM",
      location: "City Medical Center",
      status: "upcoming",
      patient: "John Smith",
    },
    {
      id: "2",
      type: "scan",
      title: "MRI Brain Scan",
      date: "Dec 18, 2024",
      time: "2:30 PM",
      location: "Diagnostic Center",
      status: "upcoming",
      patient: "Mary Johnson",
    },
    {
      id: "3",
      type: "test",
      title: "Blood Work Panel",
      date: "Dec 20, 2024",
      time: "9:00 AM",
      location: "LabCorp",
      status: "upcoming",
      patient: "Robert Williams",
    },
    {
      id: "4",
      type: "doctor",
      title: "Cardiology Follow-up",
      doctor: "Dr. Michael Chen",
      date: "Dec 10, 2024",
      time: "11:00 AM",
      location: "Heart Care Clinic",
      status: "completed",
      patient: "John Smith",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "doctor": return Stethoscope;
      case "scan": return Scan;
      case "test": return TestTube;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "doctor": return "bg-health-bp/10 text-health-bp";
      case "scan": return "bg-info/10 text-info";
      case "test": return "bg-success/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming": return <Badge className="bg-primary/10 text-primary border-primary/30">Upcoming</Badge>;
      case "completed": return <Badge className="bg-success/10 text-success border-success/30">Completed</Badge>;
      case "cancelled": return <Badge className="bg-destructive/10 text-destructive border-destructive/30">Cancelled</Badge>;
      default: return null;
    }
  };

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
                <div className="p-2.5 bg-health-bp/10 rounded-xl">
                  <Stethoscope className="w-6 h-6 text-health-bp" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display">Healthcare</h1>
                  <p className="text-xs text-muted-foreground">Appointments, Scans & Tests</p>
                </div>
              </div>
            </div>
            <Button className="gap-2 bg-gradient-to-r from-health-bp to-health-bp/70 text-primary-foreground">
              <Plus className="w-4 h-4" />
              Book Appointment
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>

          {/* Appointments */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="appointments">All</TabsTrigger>
                <TabsTrigger value="doctors">Doctors</TabsTrigger>
                <TabsTrigger value="scans">Scans</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6 space-y-4">
                {appointments
                  .filter(apt => {
                    if (activeTab === "appointments") return true;
                    if (activeTab === "doctors") return apt.type === "doctor";
                    if (activeTab === "scans") return apt.type === "scan";
                    if (activeTab === "tests") return apt.type === "test";
                    return true;
                  })
                  .map((appointment) => {
                    const TypeIcon = getTypeIcon(appointment.type);
                    return (
                      <Card 
                        key={appointment.id}
                        className={cn(
                          "border-0 shadow-soft bg-card/80 backdrop-blur-sm transition-all hover:shadow-medium cursor-pointer",
                          appointment.status === "completed" && "opacity-60"
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={cn("p-3 rounded-xl", getTypeColor(appointment.type))}>
                              <TypeIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold">{appointment.title}</h3>
                                  {appointment.doctor && (
                                    <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                                  )}
                                </div>
                                {getStatusBadge(appointment.status)}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {appointment.patient}
                                </span>
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  {appointment.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {appointment.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {appointment.location}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </TabsContent>
            </Tabs>

            {/* Quick Book */}
            <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-display">Quick Book</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { title: "Doctor Visit", icon: Stethoscope, color: "from-health-bp to-health-bp/70" },
                    { title: "Book a Scan", icon: Scan, color: "from-info to-info/70" },
                    { title: "Lab Test", icon: TestTube, color: "from-success to-success/70" },
                  ].map((item, i) => (
                    <Button 
                      key={i}
                      variant="outline" 
                      className="h-auto flex-col gap-3 p-6 hover:shadow-medium transition-all"
                    >
                      <div className={cn("p-3 rounded-xl bg-gradient-to-br", item.color)}>
                        <item.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Healthcare;
