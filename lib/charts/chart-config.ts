/**
 * Configuración común para gráficos
 * Integra con el sistema de colores de Tailwind
 */

// Colores del tema para gráficos
export const chartColors = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  tertiary: "hsl(var(--chart-3))",
  quaternary: "hsl(var(--chart-4))",
  quinary: "hsl(var(--chart-5))",
} as const;

// Paleta de colores para múltiples series
export const chartColorPalette = [
  chartColors.primary,
  chartColors.secondary,
  chartColors.tertiary,
  chartColors.quaternary,
  chartColors.quinary,
];


// Configuración común de gráficos Recharts
export const rechartsConfig = {
  margin: { top: 5, right: 10, left: 10, bottom: 5 },
  responsive: true,
  // Colores en formato hex para Recharts (aproximaciones de los colores oklch del tema)
  colors: {
    primary: "#d97706",      // Amber - oklch(0.70 0.18 55)
    secondary: "#14b8a6",     // Teal - oklch(0.55 0.12 155)
    tertiary: "#64748b",     // Slate - oklch(0.50 0.02 260)
    quaternary: "#10b981",   // Emerald - oklch(0.65 0.20 145)
    quinary: "#f97316",      // Orange - oklch(0.60 0.15 30)
  },
} as const;

// Estilos comunes para tooltips y leyendas
export const chartStyles = {
  tooltip: {
    backgroundColor: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "calc(var(--radius) - 2px)",
    padding: "8px 12px",
    fontSize: "0.875rem",
  },
  legend: {
    fontSize: "0.875rem",
    color: "hsl(var(--foreground))",
  },
} as const;

