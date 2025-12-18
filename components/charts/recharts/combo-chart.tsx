"use client";

import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { rechartsConfig } from "@/lib/charts/chart-config";

interface ComboChartProps {
  data: Array<Record<string, any>>;
  bars?: Array<{
    key: string;
    name: string;
    color?: string;
  }>;
  lines?: Array<{
    key: string;
    name: string;
    color?: string;
    strokeWidth?: number;
  }>;
  areas?: Array<{
    key: string;
    name: string;
    color?: string;
  }>;
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

/**
 * Gráfico combinado (bar + line + area) usando Recharts
 */
export function ComboChart({
  data,
  bars = [],
  lines = [],
  areas = [],
  xAxisKey = "name",
  height = 300,
  showGrid = true,
  showLegend = true,
}: ComboChartProps) {
  const colorValues = Object.values(rechartsConfig.colors);
  let colorIndex = 0;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={rechartsConfig.margin}>
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
        {bars.map((bar) => {
          const color = bar.color || colorValues[colorIndex % colorValues.length];
          colorIndex++;
          return (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          );
        })}
        {areas.map((area) => {
          const color = area.color || colorValues[colorIndex % colorValues.length];
          colorIndex++;
          return (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              name={area.name}
              fill={color}
              fillOpacity={0.6}
            />
          );
        })}
        {lines.map((line) => {
          const color = line.color || colorValues[colorIndex % colorValues.length];
          colorIndex++;
          return (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={color}
              strokeWidth={line.strokeWidth || 2}
              dot={{ r: 4 }}
            />
          );
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

