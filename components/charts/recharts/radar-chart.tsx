"use client";

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { rechartsConfig } from "@/lib/charts/chart-config";

interface RadarChartProps {
  data: Array<Record<string, any>>;
  radars: Array<{
    key: string;
    name: string;
    color?: string;
    fillOpacity?: number;
  }>;
  angleKey?: string;
  height?: number;
  showLegend?: boolean;
}

/**
 * Gráfico radar usando Recharts
 */
export function RadarChart({
  data,
  radars,
  angleKey = "subject",
  height = 300,
  showLegend = true,
}: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart data={data} margin={rechartsConfig.margin}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey={angleKey}
          tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, "dataMax"]}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
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
        {radars.map((radar, index) => (
          <Radar
            key={radar.key}
            name={radar.name}
            dataKey={radar.key}
            stroke={radar.color || Object.values(rechartsConfig.colors)[index % 5]}
            fill={radar.color || Object.values(rechartsConfig.colors)[index % 5]}
            fillOpacity={radar.fillOpacity || 0.6}
          />
        ))}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}

