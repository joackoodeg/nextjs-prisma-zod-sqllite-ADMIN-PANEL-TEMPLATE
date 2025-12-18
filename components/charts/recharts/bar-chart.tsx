"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { rechartsConfig } from "@/lib/charts/chart-config";

interface BarChartProps {
  data: Array<Record<string, any>>;
  bars: Array<{
    key: string;
    name: string;
    color?: string;
  }>;
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  layout?: "horizontal" | "vertical";
}

/**
 * Gráfico de barras usando Recharts
 */
export function BarChart({
  data,
  bars,
  xAxisKey = "name",
  height = 300,
  showGrid = true,
  showLegend = true,
  layout = "vertical",
}: BarChartProps) {
  const ChartComponent = layout === "horizontal" ? RechartsBarChart : RechartsBarChart;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={rechartsConfig.margin}
        layout={layout}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
        <XAxis
          dataKey={layout === "vertical" ? xAxisKey : undefined}
          type={layout === "vertical" ? "category" : "number"}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          dataKey={layout === "horizontal" ? xAxisKey : undefined}
          type={layout === "horizontal" ? "category" : "number"}
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
        {bars.map((bar, index) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.color || Object.values(rechartsConfig.colors)[index % 5]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

