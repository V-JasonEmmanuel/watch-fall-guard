import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HealthMetricCard } from "./HealthMetricCard";
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Wind, 
  Zap, 
  Brain,
  Watch,
  Wifi,
  WifiOff,
  RefreshCw,
  Bell,
  Settings,
  TrendingUp,
  Droplets
} from "lucide-react";

interface HealthData {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  spO2: number;
  ecgStatus: "normal" | "irregular" | "afib";
  temperature: number;
  stressLevel: number;
  respiratoryRate: number;
  hrv: number;
}

interface HealthMonitoringPanelProps {
  isConnected: boolean;
  onAlertTriggered?: (metric: string, value: number | string, severity: "warning" | "critical") => void;
}

export const HealthMonitoringPanel = ({ isConnected, onAlertTriggered }: HealthMonitoringPanelProps) => {
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    spO2: 98,
    ecgStatus: "normal",
    temperature: 98.6,
    stressLevel: 35,
    respiratoryRate: 16,
    hrv: 45,
  });

  const [lastSync, setLastSync] = useState(new Date());
  const [isSimulating, setIsSimulating] = useState(true);

  // Simulate real-time health data updates
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setHealthData(prev => {
        const newData = {
          heartRate: Math.max(55, Math.min(120, prev.heartRate + (Math.random() - 0.5) * 8)),
          bloodPressure: {
            systolic: Math.max(100, Math.min(180, prev.bloodPressure.systolic + (Math.random() - 0.5) * 6)),
            diastolic: Math.max(60, Math.min(100, prev.bloodPressure.diastolic + (Math.random() - 0.5) * 4)),
          },
          spO2: Math.max(90, Math.min(100, prev.spO2 + (Math.random() - 0.5) * 2)),
          ecgStatus: prev.ecgStatus,
          temperature: Math.max(97, Math.min(100, prev.temperature + (Math.random() - 0.5) * 0.3)),
          stressLevel: Math.max(10, Math.min(90, prev.stressLevel + (Math.random() - 0.5) * 10)),
          respiratoryRate: Math.max(12, Math.min(22, prev.respiratoryRate + (Math.random() - 0.5) * 2)),
          hrv: Math.max(20, Math.min(80, prev.hrv + (Math.random() - 0.5) * 8)),
        };

        // Check for alerts
        if (newData.heartRate > 100 && onAlertTriggered) {
          onAlertTriggered("Heart Rate", Math.round(newData.heartRate), newData.heartRate > 110 ? "critical" : "warning");
        }
        if (newData.bloodPressure.systolic > 140 && onAlertTriggered) {
          onAlertTriggered("Blood Pressure", `${Math.round(newData.bloodPressure.systolic)}/${Math.round(newData.bloodPressure.diastolic)}`, "warning");
        }
        if (newData.spO2 < 95 && onAlertTriggered) {
          onAlertTriggered("SpO2", Math.round(newData.spO2), newData.spO2 < 92 ? "critical" : "warning");
        }

        return newData;
      });
      setLastSync(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, onAlertTriggered]);

  const getHeartRateStatus = () => {
    if (healthData.heartRate > 100 || healthData.heartRate < 60) return "warning";
    if (healthData.heartRate > 120 || healthData.heartRate < 50) return "critical";
    return "normal";
  };

  const getBPStatus = () => {
    const { systolic, diastolic } = healthData.bloodPressure;
    if (systolic > 180 || diastolic > 120) return "critical";
    if (systolic > 140 || diastolic > 90) return "warning";
    return "normal";
  };

  const getSpO2Status = () => {
    if (healthData.spO2 < 90) return "critical";
    if (healthData.spO2 < 95) return "warning";
    return "normal";
  };

  const getTempStatus = () => {
    if (healthData.temperature > 101 || healthData.temperature < 96) return "critical";
    if (healthData.temperature > 99.5 || healthData.temperature < 97) return "warning";
    return "normal";
  };

  return (
    <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-medical rounded-xl shadow-glow">
              <Watch className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-display">Health Monitoring</CardTitle>
              <p className="text-sm text-muted-foreground">Samsung Galaxy Watch 5</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={isConnected ? "bg-success/10 text-success border-success/30" : "bg-destructive/10 text-destructive border-destructive/30"}
            >
              {isConnected ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setLastSync(new Date())}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            Last sync: {lastSync.toLocaleTimeString()}
          </div>
          <Badge variant="secondary" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Live Data
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <HealthMetricCard
            title="Heart Rate"
            value={Math.round(healthData.heartRate)}
            unit="bpm"
            icon={Heart}
            status={getHeartRateStatus()}
            trend={healthData.heartRate > 80 ? "up" : "stable"}
            color="text-health-heart"
            bgColor="bg-health-heart/10"
            normalRange="60-100"
          />
          
          <HealthMetricCard
            title="Blood Pressure"
            value={`${Math.round(healthData.bloodPressure.systolic)}/${Math.round(healthData.bloodPressure.diastolic)}`}
            unit="mmHg"
            icon={Activity}
            status={getBPStatus()}
            color="text-health-bp"
            bgColor="bg-health-bp/10"
            normalRange="<120/80"
          />
          
          <HealthMetricCard
            title="SpO2"
            value={Math.round(healthData.spO2)}
            unit="%"
            icon={Droplets}
            status={getSpO2Status()}
            trend="stable"
            color="text-health-spo2"
            bgColor="bg-health-spo2/10"
            normalRange="95-100"
          />
          
          <HealthMetricCard
            title="Temperature"
            value={healthData.temperature.toFixed(1)}
            unit="°F"
            icon={Thermometer}
            status={getTempStatus()}
            color="text-health-temp"
            bgColor="bg-health-temp/10"
            normalRange="97-99"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-health-ecg/10">
                  <Zap className="w-4 h-4 text-health-ecg" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ECG Status</p>
                  <p className="font-semibold text-sm capitalize">{healthData.ecgStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-health-stress/10">
                  <Brain className="w-4 h-4 text-health-stress" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Stress Level</p>
                  <p className="font-semibold text-sm">{Math.round(healthData.stressLevel)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <Wind className="w-4 h-4 text-info" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Respiratory Rate</p>
                  <p className="font-semibold text-sm">{Math.round(healthData.respiratoryRate)} /min</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">HRV</p>
                  <p className="font-semibold text-sm">{Math.round(healthData.hrv)} ms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backend Placeholder Notice */}
        <div className="p-4 rounded-xl bg-muted/50 border border-dashed border-border">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Backend Integration Required</p>
              <p className="text-xs text-muted-foreground mt-1">
                Connect to Lovable Cloud to enable real Samsung Health SDK integration, persistent health data storage, and automated emergency alerts when vitals exceed safe thresholds.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
