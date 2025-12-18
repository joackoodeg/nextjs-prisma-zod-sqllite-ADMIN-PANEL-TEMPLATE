"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateChange, formatCurrency, formatNumber, formatPercent, getChangeColor } from "@/lib/charts/chart-utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: number | string;
  previousValue?: number;
  format?: "currency" | "number" | "percent" | "custom";
  currency?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Tarjeta de KPI usando shadcn/ui
 */
export function KPICard({
  title,
  value,
  previousValue,
  format = "number",
  currency = "USD",
  description,
  icon,
  className,
}: KPICardProps) {
  const change = previousValue !== undefined
    ? calculateChange(typeof value === "number" ? value : parseFloat(String(value)), previousValue)
    : null;

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
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {change !== null && (
          <div className={cn("flex items-center gap-1 text-xs mt-1", getChangeColor(change))}>
            {change > 0 && <TrendingUp className="h-3 w-3" />}
            {change < 0 && <TrendingDown className="h-3 w-3" />}
            {change === 0 && <Minus className="h-3 w-3" />}
            <span>{formatPercent(Math.abs(change))} desde el período anterior</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

