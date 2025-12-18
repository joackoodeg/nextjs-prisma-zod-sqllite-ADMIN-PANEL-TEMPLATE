"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { rechartsConfig, chartColorPalette } from "@/lib/charts/chart-config";

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  label?: boolean;
}

/**
 * Gráfico circular (pie) usando Recharts
 */
export function PieChart({
  data,
  height = 300,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 80,
  label = false,
}: PieChartProps) {
  const COLORS = data.map((item) => item.color).filter(Boolean).length > 0
    ? data.map((item) => item.color || chartColorPalette[0])
    : chartColorPalette;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={label ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
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
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

