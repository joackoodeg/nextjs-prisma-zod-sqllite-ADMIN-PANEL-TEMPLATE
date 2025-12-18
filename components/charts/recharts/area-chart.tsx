"use client";

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { rechartsConfig } from "@/lib/charts/chart-config";

interface AreaChartProps {
  data: Array<Record<string, any>>;
  areas: Array<{
    key: string;
    name: string;
    color?: string;
    stackId?: string;
  }>;
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

/**
 * Gráfico de áreas usando Recharts
 */
export function AreaChart({
  data,
  areas,
  xAxisKey = "name",
  height = 300,
  showGrid = true,
  showLegend = true,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={rechartsConfig.margin}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
        <XAxis
          dataKey={xAxisKey}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "calc(var(--radius) - 2px)",
          }}
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: "0.875rem", color: "hsl(var(--foreground))" }}
          />
        )}
        {areas.map((area, index) => (
          <Area
            key={area.key}
            type="monotone"
            dataKey={area.key}
            name={area.name}
            stackId={area.stackId}
            stroke={area.color || Object.values(rechartsConfig.colors)[index % 5]}
            fill={area.color || Object.values(rechartsConfig.colors)[index % 5]}
            fillOpacity={0.6}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

