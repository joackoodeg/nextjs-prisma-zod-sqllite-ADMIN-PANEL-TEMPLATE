/**
 * Utilidades para formateo de datos y gráficos
 */

/**
 * Formatea un número como moneda
 */
export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-ES").format(value);
}

/**
 * Formatea un número como porcentaje
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formatea una fecha para mostrar en gráficos
 */
export function formatDate(date: Date | string, format: "short" | "long" = "short"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (format === "short") {
    return new Intl.DateTimeFormat("es-ES", {
      month: "short",
      day: "numeric",
    }).format(dateObj);
  }
  
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Calcula el porcentaje de cambio entre dos valores
 */
export function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Obtiene el color basado en el cambio (positivo/negativo)
 */
export function getChangeColor(change: number): string {
  if (change > 0) return "text-emerald-600 dark:text-emerald-400";
  if (change < 0) return "text-rose-600 dark:text-rose-400";
  return "text-muted-foreground";
}

/**
 * Redondea un número a N decimales
 */
export function roundTo(value: number, decimals = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Genera un array de fechas entre dos fechas
 */
export function generateDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(start);
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

/**
 * Agrupa datos por una clave
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

