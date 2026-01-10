import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Wind, 
  Brain, 
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface HealthData {
  heartRate: number;
  heartRateTrend: "up" | "down" | "stable";
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  spo2: number;
  temperature: number;
  respiratoryRate: number;
  stressLevel: number;
  ecgStatus: "normal" | "irregular" | "warning";
  riskScore: number;
}

interface HealthDashboardProps {
  elderName?: string;
  onAlertTriggered?: (alert: { type: string; message: string }) => void;
  showSimpleMode?: boolean;
}

export const HealthDashboard = ({ 
  elderName = "Elder", 
  onAlertTriggered,
  showSimpleMode = false 
}: HealthDashboardProps) => {
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 72,
    heartRateTrend: "stable",
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    spo2: 98,
    temperature: 98.4,
    respiratoryRate: 16,
    stressLevel: 25,
    ecgStatus: "normal",
    riskScore: 0.15,
  });

  const [simpleExplanations, setSimpleExplanations] = useState(showSimpleMode);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthData(prev => ({
        ...prev,
        heartRate: prev.heartRate + Math.floor(Math.random() * 5 - 2),
        spo2: Math.min(100, Math.max(90, prev.spo2 + Math.floor(Math.random() * 3 - 1))),
        stressLevel: Math.min(100, Math.max(0, prev.stressLevel + Math.floor(Math.random() * 10 - 5))),
        riskScore: Math.min(1, Math.max(0, prev.riskScore + (Math.random() * 0.1 - 0.05))),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatus = (type: string, value: number): "safe" | "warning" | "critical" => {
    switch (type) {
      case "heartRate":
        if (value >= 60 && value <= 100) return "safe";
        if (value >= 50 && value < 60 || value > 100 && value <= 120) return "warning";
        return "critical";
      case "spo2":
        if (value >= 95) return "safe";
        if (value >= 90 && value < 95) return "warning";
        return "critical";
      case "temperature":
        if (value >= 97 && value <= 99) return "safe";
        if (value >= 96 && value < 97 || value > 99 && value <= 100.5) return "warning";
        return "critical";
      case "stress":
        if (value <= 40) return "safe";
        if (value > 40 && value <= 70) return "warning";
        return "critical";
      case "respiratory":
        if (value >= 12 && value <= 20) return "safe";
        if (value >= 10 && value < 12 || value > 20 && value <= 25) return "warning";
        return "critical";
      case "riskScore":
        if (value <= 0.3) return "safe";
        if (value > 0.3 && value <= 0.6) return "warning";
        return "critical";
      default:
        return "safe";
    }
  };

  const getStatusColor = (status: "safe" | "warning" | "critical") => {
    switch (status) {
      case "safe": return {
        bg: "bg-safe/10",
        border: "border-safe/30",
        text: "text-safe",
        icon: CheckCircle2,
        glow: "shadow-glow-safe"
      };
      case "warning": return {
        bg: "bg-warning/10",
        border: "border-warning/30",
        text: "text-warning",
        icon: AlertTriangle,
        glow: ""
      };
      case "critical": return {
        bg: "bg-critical/10",
        border: "border-critical/30",
        text: "text-critical",
        icon: AlertTriangle,
        glow: "shadow-glow-danger"
      };
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return TrendingUp;
      case "down": return TrendingDown;
      default: return Minus;
    }
  };

  const getSimpleExplanation = (type: string, status: "safe" | "warning" | "critical") => {
    const explanations: Record<string, Record<string, string>> = {
      heartRate: {
        safe: "Your heart is beating at a healthy pace. Everything looks good! 💚",
        warning: "Your heart rate is slightly different than normal. Stay calm and rest a bit.",
        critical: "Your heart rate needs attention. Please sit down and relax. We'll notify your family.",
      },
      spo2: {
        safe: "Your blood oxygen is great! You're breathing well. 💚",
        warning: "Your oxygen level is a bit low. Try taking some deep breaths.",
        critical: "Your oxygen level is low. Please rest and breathe deeply. Help is being notified.",
      },
      temperature: {
        safe: "Your body temperature is normal. You're doing great! 💚",
        warning: "You feel a bit warm. Drink some water and rest.",
        critical: "You may have a fever. Please rest and we'll notify your family.",
      },
      stress: {
        safe: "You seem calm and relaxed. Wonderful! 💚",
        warning: "You seem a bit stressed. Try taking some deep breaths.",
        critical: "Your stress level is high. Let's do some breathing together. Would you like some calming music?",
      },
    };
    return explanations[type]?.[status] || "";
  };

  const hrStatus = getStatus("heartRate", healthData.heartRate);
  const spo2Status = getStatus("spo2", healthData.spo2);
  const tempStatus = getStatus("temperature", healthData.temperature);
  const stressStatus = getStatus("stress", healthData.stressLevel);
  const riskStatus = getStatus("riskScore", healthData.riskScore);
  const TrendIcon = getTrendIcon(healthData.heartRateTrend);

  // Overall health status
  const overallStatus = [hrStatus, spo2Status, tempStatus, stressStatus].includes("critical") 
    ? "critical" 
    : [hrStatus, spo2Status, tempStatus, stressStatus].includes("warning")
    ? "warning"
    : "safe";

  const overallStatusLabel = {
    safe: "Stable",
    warning: "Needs Attention",
    critical: "Critical",
  };

  return (
    <div className="space-y-6">
      {/* Overall Status Banner */}
      <Card className={cn(
        "border-2 transition-all",
        getStatusColor(overallStatus).bg,
        getStatusColor(overallStatus).border,
        overallStatus === "critical" && "animate-pulse"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-4 rounded-2xl",
                getStatusColor(overallStatus).bg
              )}>
                {overallStatus === "safe" ? (
                  <CheckCircle2 className={cn("w-8 h-8", getStatusColor(overallStatus).text)} />
                ) : (
                  <AlertTriangle className={cn("w-8 h-8", getStatusColor(overallStatus).text)} />
                )}
              </div>
              <div>
                <h2 className="text-elder-xl font-bold">Health Status</h2>
                <p className={cn("text-elder-lg font-semibold", getStatusColor(overallStatus).text)}>
                  {overallStatusLabel[overallStatus]}
                </p>
                {simpleExplanations && overallStatus !== "safe" && (
                  <p className="text-muted-foreground mt-1">
                    {overallStatus === "warning" 
                      ? "Some readings need attention. Please check below."
                      : "Please rest. Your family is being notified."}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSimpleExplanations(!simpleExplanations)}
              className="gap-2"
            >
              <Info className="w-4 h-4" />
              {simpleExplanations ? "Show Details" : "Simple Mode"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <Card className={cn(
          "border-2 transition-all hover-lift",
          getStatusColor(hrStatus).bg,
          getStatusColor(hrStatus).border
        )}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-health-heart/10">
                <Heart className={cn("w-6 h-6 text-health-heart", hrStatus === "safe" && "animate-heartbeat")} />
              </div>
              <Badge className={cn(
                "text-xs",
                getStatusColor(hrStatus).bg,
                getStatusColor(hrStatus).text
              )}>
                <TrendIcon className="w-3 h-3 mr-1" />
                {hrStatus === "safe" ? "Normal" : hrStatus === "warning" ? "Watch" : "Alert"}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm font-medium">Heart Rate</p>
              <p className="text-elder-2xl font-bold">
                {healthData.heartRate} <span className="text-lg font-normal">bpm</span>
              </p>
              {simpleExplanations && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {getSimpleExplanation("heartRate", hrStatus)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Blood Oxygen */}
        <Card className={cn(
          "border-2 transition-all hover-lift",
          getStatusColor(spo2Status).bg,
          getStatusColor(spo2Status).border
        )}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-health-spo2/10">
                <Activity className="w-6 h-6 text-health-spo2" />
              </div>
              <Badge className={cn(
                "text-xs",
                getStatusColor(spo2Status).bg,
                getStatusColor(spo2Status).text
              )}>
                {spo2Status === "safe" ? "Excellent" : spo2Status === "warning" ? "Low" : "Critical"}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm font-medium">Blood Oxygen (SpO2)</p>
              <p className="text-elder-2xl font-bold">
                {healthData.spo2}<span className="text-lg font-normal">%</span>
              </p>
              {simpleExplanations && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {getSimpleExplanation("spo2", spo2Status)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Temperature */}
        <Card className={cn(
          "border-2 transition-all hover-lift",
          getStatusColor(tempStatus).bg,
          getStatusColor(tempStatus).border
        )}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-health-temp/10">
                <Thermometer className="w-6 h-6 text-health-temp" />
              </div>
              <Badge className={cn(
                "text-xs",
                getStatusColor(tempStatus).bg,
                getStatusColor(tempStatus).text
              )}>
                {tempStatus === "safe" ? "Normal" : tempStatus === "warning" ? "Warm" : "Fever"}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm font-medium">Temperature</p>
              <p className="text-elder-2xl font-bold">
                {healthData.temperature}<span className="text-lg font-normal">°F</span>
              </p>
              {simpleExplanations && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {getSimpleExplanation("temperature", tempStatus)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stress Level */}
        <Card className={cn(
          "border-2 transition-all hover-lift",
          getStatusColor(stressStatus).bg,
          getStatusColor(stressStatus).border
        )}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-health-stress/10">
                <Brain className="w-6 h-6 text-health-stress" />
              </div>
              <Badge className={cn(
                "text-xs",
                getStatusColor(stressStatus).bg,
                getStatusColor(stressStatus).text
              )}>
                {stressStatus === "safe" ? "Calm" : stressStatus === "warning" ? "Elevated" : "High"}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm font-medium">Stress Level</p>
              <p className="text-elder-2xl font-bold">
                {healthData.stressLevel}<span className="text-lg font-normal">%</span>
              </p>
              {simpleExplanations && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {getSimpleExplanation("stress", stressStatus)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ECG Status */}
        <Card className="border hover-lift">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-health-ecg/10">
                <Zap className="w-6 h-6 text-health-ecg" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ECG Status</p>
                <p className="text-lg font-semibold capitalize">{healthData.ecgStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Respiratory Rate */}
        <Card className="border hover-lift">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-info/10">
                <Wind className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Respiratory Rate</p>
                <p className="text-lg font-semibold">{healthData.respiratoryRate} /min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Risk Score */}
        <Card className={cn(
          "border-2",
          getStatusColor(riskStatus).bg,
          getStatusColor(riskStatus).border
        )}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">AI Risk Score</p>
                  <p className={cn("text-lg font-semibold", getStatusColor(riskStatus).text)}>
                    {(healthData.riskScore * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                Predictive
              </Badge>
            </div>
            {simpleExplanations && (
              <p className="text-sm text-muted-foreground mt-3">
                {riskStatus === "safe" 
                  ? "AI predicts low health risk. Keep doing what you're doing! 👍"
                  : riskStatus === "warning"
                  ? "AI sees some patterns to watch. We'll keep monitoring."
                  : "AI detected concerning patterns. Your care team is being notified."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Placeholders for future features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-dashed border-muted-foreground/30 bg-muted/20">
          <CardContent className="p-6 text-center">
            <Badge variant="secondary" className="mb-3">Coming Soon</Badge>
            <h3 className="font-semibold text-lg">Blood Pressure Monitoring</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Continuous BP tracking with trend analysis
            </p>
          </CardContent>
        </Card>

        <Card className="border border-dashed border-muted-foreground/30 bg-muted/20">
          <CardContent className="p-6 text-center">
            <Badge variant="secondary" className="mb-3">Coming Soon</Badge>
            <h3 className="font-semibold text-lg">Glucose Monitoring</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time blood sugar tracking for diabetic care
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
