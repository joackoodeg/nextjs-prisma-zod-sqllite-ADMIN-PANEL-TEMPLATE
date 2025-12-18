/**
 * Datos de ejemplo para demostración de gráficos
 */

export interface SalesData {
  month: string;
  sales: number;
  revenue: number;
  users: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category: string;
}

export interface RadarData {
  subject: string;
  A: number;
  B: number;
  fullMark: number;
}

export interface ScatterData {
  x: number;
  y: number;
  z: number;
  name: string;
}

// Datos de ventas mensuales
export const monthlySalesData: SalesData[] = [
  { month: "Ene", sales: 1200, revenue: 45000, users: 320 },
  { month: "Feb", sales: 1900, revenue: 52000, users: 410 },
  { month: "Mar", sales: 3000, revenue: 68000, users: 580 },
  { month: "Abr", sales: 2780, revenue: 75000, users: 620 },
  { month: "May", sales: 1890, revenue: 62000, users: 510 },
  { month: "Jun", sales: 2390, revenue: 71000, users: 680 },
  { month: "Jul", sales: 3490, revenue: 89000, users: 750 },
  { month: "Ago", sales: 3200, revenue: 85000, users: 720 },
  { month: "Sep", sales: 2800, revenue: 78000, users: 690 },
  { month: "Oct", sales: 3100, revenue: 82000, users: 710 },
  { month: "Nov", sales: 3600, revenue: 95000, users: 800 },
  { month: "Dic", sales: 4100, revenue: 110000, users: 890 },
];

// Datos por categoría (para gráficos de pie)
export const categoryData: CategoryData[] = [
  { name: "Electrónica", value: 35, color: "#d97706" },
  { name: "Ropa", value: 25, color: "#14b8a6" },
  { name: "Hogar", value: 20, color: "#64748b" },
  { name: "Deportes", value: 15, color: "#10b981" },
  { name: "Otros", value: 5, color: "#f97316" },
];

// Datos de series temporales
export const timeSeriesData: TimeSeriesData[] = [
  { date: "2024-01-01", value: 400, category: "A" },
  { date: "2024-01-02", value: 300, category: "A" },
  { date: "2024-01-03", value: 200, category: "A" },
  { date: "2024-01-04", value: 278, category: "A" },
  { date: "2024-01-05", value: 189, category: "A" },
  { date: "2024-01-01", value: 240, category: "B" },
  { date: "2024-01-02", value: 139, category: "B" },
  { date: "2024-01-03", value: 298, category: "B" },
  { date: "2024-01-04", value: 278, category: "B" },
  { date: "2024-01-05", value: 189, category: "B" },
];

// Datos para gráfico radar
export const radarData: RadarData[] = [
  { subject: "Ventas", A: 120, B: 110, fullMark: 150 },
  { subject: "Marketing", A: 98, B: 130, fullMark: 150 },
  { subject: "Desarrollo", A: 86, B: 130, fullMark: 150 },
  { subject: "Soporte", A: 99, B: 100, fullMark: 150 },
  { subject: "IT", A: 85, B: 90, fullMark: 150 },
  { subject: "Admin", A: 65, B: 85, fullMark: 150 },
];

// Datos para gráfico de dispersión
export const scatterData: ScatterData[] = [
  { x: 100, y: 200, z: 200, name: "Producto A" },
  { x: 120, y: 100, z: 260, name: "Producto B" },
  { x: 170, y: 300, z: 400, name: "Producto C" },
  { x: 140, y: 250, z: 280, name: "Producto D" },
  { x: 150, y: 400, z: 500, name: "Producto E" },
  { x: 110, y: 280, z: 200, name: "Producto F" },
];

// KPIs de ejemplo
export const sampleKPIs = {
  totalRevenue: 1250000,
  totalUsers: 12500,
  activeUsers: 8900,
  conversionRate: 3.2,
  previousRevenue: 1100000,
  previousUsers: 11000,
  previousActiveUsers: 8200,
  previousConversionRate: 2.8,
};

