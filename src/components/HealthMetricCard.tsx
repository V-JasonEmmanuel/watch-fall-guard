import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  status: "normal" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
  color: string;
  bgColor: string;
  minValue?: number;
  maxValue?: number;
  normalRange?: string;
}

export const HealthMetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  status,
  trend,
  color,
  bgColor,
  normalRange,
}: HealthMetricCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "critical":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">Critical</Badge>;
      case "warning":
        return <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">Elevated</Badge>;
      default:
        return <Badge className="bg-success/10 text-success border-success/20 text-xs">Normal</Badge>;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up": return "↑";
      case "down": return "↓";
      default: return "→";
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden border-0 shadow-medium hover:shadow-large transition-all duration-300 group",
      status === "critical" && "ring-2 ring-destructive/30 shadow-glow-danger",
      status === "warning" && "ring-1 ring-warning/30"
    )}>
      <div className={cn("absolute inset-0 opacity-5", bgColor)} />
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full",
        status === "critical" ? "bg-destructive" : status === "warning" ? "bg-warning" : color
      )} />
      
      <CardContent className="p-5 relative">
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
            "p-2.5 rounded-xl",
            bgColor,
            status === "critical" && "animate-pulse"
          )}>
            <Icon className={cn("w-5 h-5", color)} />
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className={cn(
              "text-3xl font-bold font-display",
              status === "critical" ? "text-destructive" : status === "warning" ? "text-warning" : "text-foreground"
            )}>
              {value}
            </span>
            <span className="text-sm text-muted-foreground">{unit}</span>
            {trend && (
              <span className={cn(
                "text-sm ml-1",
                trend === "up" ? "text-destructive" : trend === "down" ? "text-success" : "text-muted-foreground"
              )}>
                {getTrendIcon()}
              </span>
            )}
          </div>
          {normalRange && (
            <p className="text-xs text-muted-foreground">Normal: {normalRange}</p>
          )}
        </div>

        {/* Decorative element */}
        <div className={cn(
          "absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-xl transition-opacity group-hover:opacity-20",
          bgColor
        )} />
      </CardContent>
    </Card>
  );
};
