import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Pill, 
  Droplets, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Bell,
  Volume2,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  icon?: string;
}

interface Reminder {
  id: string;
  type: "medication" | "hydration" | "activity" | "appointment";
  title: string;
  description: string;
  time: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

interface DailyAssistantProps {
  elderName?: string;
  onReminderVoice?: (text: string) => void;
}

export const DailyAssistant = ({ 
  elderName = "Friend",
  onReminderVoice 
}: DailyAssistantProps) => {
  const { toast } = useToast();
  
  const [medications, setMedications] = useState<Medication[]>([
    { id: "1", name: "Metformin", dosage: "500mg", time: "8:00 AM", taken: true },
    { id: "2", name: "Lisinopril", dosage: "10mg", time: "8:00 AM", taken: true },
    { id: "3", name: "Aspirin", dosage: "81mg", time: "12:00 PM", taken: false },
    { id: "4", name: "Vitamin D", dosage: "1000 IU", time: "6:00 PM", taken: false },
  ]);

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      type: "hydration",
      title: "Time for Water",
      description: "Drink a glass of water to stay hydrated",
      time: "Every 2 hours",
      completed: false,
      priority: "medium",
    },
    {
      id: "2",
      type: "activity",
      title: "Gentle Walk",
      description: "10-minute walk around the house",
      time: "3:00 PM",
      completed: false,
      priority: "low",
    },
    {
      id: "3",
      type: "appointment",
      title: "Doctor Checkup",
      description: "Dr. Smith - General checkup",
      time: "Tomorrow 10:00 AM",
      completed: false,
      priority: "high",
    },
  ]);

  const [hydrationCount, setHydrationCount] = useState(3);
  const hydrationGoal = 8;

  const takenMeds = medications.filter(m => m.taken).length;
  const totalMeds = medications.length;

  const handleMarkMedication = (id: string) => {
    setMedications(prev => 
      prev.map(m => m.id === id ? { ...m, taken: true } : m)
    );
    toast({
      title: "Great job! 💊",
      description: "Medication marked as taken.",
    });
  };

  const handleAddWater = () => {
    if (hydrationCount < hydrationGoal) {
      setHydrationCount(prev => prev + 1);
      toast({
        title: "Wonderful! 💧",
        description: "Keep staying hydrated!",
      });
    }
  };

  const handleCompleteReminder = (id: string) => {
    setReminders(prev => 
      prev.map(r => r.id === id ? { ...r, completed: true } : r)
    );
    toast({
      title: "Well done! ✨",
      description: "Reminder completed.",
    });
  };

  const speakReminder = (text: string) => {
    if (onReminderVoice) {
      onReminderVoice(text);
    } else if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case "medication": return Pill;
      case "hydration": return Droplets;
      case "activity": return Calendar;
      case "appointment": return Calendar;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-critical/10 text-critical border-critical/30";
      case "medium": return "bg-warning/10 text-warning border-warning/30";
      case "low": return "bg-safe/10 text-safe border-safe/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Medication Tracker */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-xl bg-health-bp/10">
                <Pill className="w-5 h-5 text-health-bp" />
              </div>
              Today's Medications
            </CardTitle>
            <Badge className={cn(
              "text-lg px-3 py-1",
              takenMeds === totalMeds 
                ? "bg-safe/10 text-safe" 
                : "bg-warning/10 text-warning"
            )}>
              {takenMeds}/{totalMeds}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {medications.map((med) => (
            <div 
              key={med.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                med.taken 
                  ? "bg-safe/5 border-safe/30" 
                  : "bg-card border-border hover:border-primary/30"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  med.taken ? "bg-safe/10" : "bg-muted"
                )}>
                  {med.taken ? (
                    <CheckCircle2 className="w-6 h-6 text-safe" />
                  ) : (
                    <Pill className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{med.name}</h3>
                  <p className="text-muted-foreground">{med.dosage} • {med.time}</p>
                </div>
              </div>
              {!med.taken && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => speakReminder(`Time to take ${med.name}, ${med.dosage}`)}
                  >
                    <Volume2 className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => handleMarkMedication(med.id)}
                    className="elder-button bg-safe hover:bg-safe/90"
                  >
                    Mark Taken
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hydration Tracker */}
      <Card className="border-2 bg-info/5 border-info/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/10">
                <Droplets className="w-7 h-7 text-info" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Hydration Goal</h3>
                <p className="text-muted-foreground">Stay hydrated throughout the day</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-elder-2xl font-bold text-info">{hydrationCount}/{hydrationGoal}</p>
              <p className="text-sm text-muted-foreground">glasses</p>
            </div>
          </div>
          
          {/* Glass indicators */}
          <div className="flex justify-center gap-2 my-4">
            {Array.from({ length: hydrationGoal }).map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "w-8 h-12 rounded-lg border-2 transition-all",
                  i < hydrationCount 
                    ? "bg-info/30 border-info" 
                    : "bg-muted border-muted-foreground/20"
                )}
              />
            ))}
          </div>

          <Button
            onClick={handleAddWater}
            disabled={hydrationCount >= hydrationGoal}
            className="w-full elder-button bg-info hover:bg-info/90 mt-4"
          >
            <Plus className="w-5 h-5 mr-2" />
            {hydrationCount >= hydrationGoal ? "Goal Reached! 🎉" : "Add Glass of Water"}
          </Button>
        </CardContent>
      </Card>

      {/* Daily Reminders */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            Reminders & Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reminders.map((reminder) => {
            const Icon = getReminderIcon(reminder.type);
            return (
              <div 
                key={reminder.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                  reminder.completed 
                    ? "bg-muted/50 border-muted opacity-60" 
                    : "bg-card border-border"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    reminder.completed ? "bg-muted" : getPriorityColor(reminder.priority)
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{reminder.title}</h3>
                      {reminder.priority === "high" && !reminder.completed && (
                        <Badge variant="destructive" className="text-xs">Important</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{reminder.description}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {reminder.time}
                    </p>
                  </div>
                </div>
                {!reminder.completed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCompleteReminder(reminder.id)}
                    className="shrink-0"
                  >
                    Done
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-dashed border-muted-foreground/30 bg-muted/20">
          <CardContent className="p-6 text-center">
            <Badge variant="secondary" className="mb-3">Coming Soon</Badge>
            <h3 className="font-semibold text-lg">Grocery Ordering</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Voice-activated grocery lists and ordering
            </p>
          </CardContent>
        </Card>

        <Card className="border border-dashed border-muted-foreground/30 bg-muted/20">
          <CardContent className="p-6 text-center">
            <Badge variant="secondary" className="mb-3">Coming Soon</Badge>
            <h3 className="font-semibold text-lg">Smart Kitchen</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Connected appliance controls and safety monitoring
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
