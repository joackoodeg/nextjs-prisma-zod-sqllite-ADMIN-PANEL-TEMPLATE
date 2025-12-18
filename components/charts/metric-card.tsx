"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/charts/chart-utils";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  format?: "currency" | "number" | "percent";
  currency?: string;
  description?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Tarjeta de métrica simple usando shadcn/ui
 */
export function MetricCard({
  title,
  value,
  format = "number",
  currency = "USD",
  description,
  trend,
  icon,
  className,
}: MetricCardProps) {
  const formattedValue = format === "currency"
    ? formatCurrency(typeof value === "number" ? value : parseFloat(String(value)), currency)
    : format === "percent"
    ? formatPercent(typeof value === "number" ? value : parseFloat(String(value)))
    : format === "number"
    ? formatNumber(typeof value === "number" ? value : parseFloat(String(value)))
    : value;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </div>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {trend && (
          <div
            className={cn(
              "text-xs mt-1",
              trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}
          >
            {trend.value > 0 ? "+" : ""}
            {formatPercent(trend.value)} {trend.label}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

