"use client";

import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { rechartsConfig } from "@/lib/charts/chart-config";

interface ScatterChartProps {
  data: Array<{
    x: number;
    y: number;
    z?: number;
    name?: string;
  }>;
  scatters?: Array<{
    xKey: string;
    yKey: string;
    zKey?: string;
    name: string;
    color?: string;
  }>;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

/**
 * Gráfico de dispersión usando Recharts
 */
export function ScatterChart({
  data,
  scatters = [{ xKey: "x", yKey: "y", zKey: "z", name: "Datos" }],
  height = 300,
  showGrid = true,
  showLegend = true,
}: ScatterChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatterChart margin={rechartsConfig.margin}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
        <XAxis
          type="number"
          dataKey="x"
          name="X"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Y"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
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
        {scatters.map((scatter, index) => (
          <Scatter
            key={scatter.name}
            name={scatter.name}
            data={data}
            fill={scatter.color || Object.values(rechartsConfig.colors)[index % 5]}
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} />
            ))}
          </Scatter>
        ))}
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
}

