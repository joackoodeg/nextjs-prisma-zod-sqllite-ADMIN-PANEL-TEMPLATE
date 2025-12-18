import { Navbar } from "@/components/layout/navbar";
import { ChartWrapper } from "@/components/charts/chart-wrapper";
import { LineChart } from "@/components/charts/recharts/line-chart";
import { BarChart } from "@/components/charts/recharts/bar-chart";
import { AreaChart } from "@/components/charts/recharts/area-chart";
import { PieChart } from "@/components/charts/recharts/pie-chart";
import { RadarChart } from "@/components/charts/recharts/radar-chart";
import { ScatterChart } from "@/components/charts/recharts/scatter-chart";
import { ComboChart } from "@/components/charts/recharts/combo-chart";
import { KPICard } from "@/components/charts/kpi-card";
import { MetricCard } from "@/components/charts/metric-card";
import {
  monthlySalesData,
  categoryData,
  timeSeriesData,
  radarData,
  scatterData,
  sampleKPIs,
} from "@/lib/charts/sample-data";
import { DollarSign, Users, TrendingUp, Activity } from "lucide-react";

export default function AnalyticsPage() {
  // Preparar datos para gráficos de líneas múltiples
  const lineChartData = monthlySalesData.map((item) => ({
    month: item.month,
    Ventas: item.sales,
    Ingresos: item.revenue / 1000, // Dividir para mejor visualización
  }));

  // Preparar datos para gráfico combinado
  const comboChartData = monthlySalesData.map((item) => ({
    month: item.month,
    Ventas: item.sales,
    Ingresos: item.revenue / 1000,
    Usuarios: item.users,
  }));

  return (
    <>
      <Navbar title="Analytics" />
      <div className="p-4 sm:p-6 space-y-6">
        {/* KPIs Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Métricas Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Ingresos Totales"
              value={sampleKPIs.totalRevenue}
              previousValue={sampleKPIs.previousRevenue}
              format="currency"
              currency="USD"
              icon={<DollarSign />}
            />
            <KPICard
              title="Usuarios Totales"
              value={sampleKPIs.totalUsers}
              previousValue={sampleKPIs.previousUsers}
              format="number"
              icon={<Users />}
            />
            <KPICard
              title="Usuarios Activos"
              value={sampleKPIs.activeUsers}
              previousValue={sampleKPIs.previousActiveUsers}
              format="number"
              icon={<Activity />}
            />
            <KPICard
              title="Tasa de Conversión"
              value={sampleKPIs.conversionRate}
              previousValue={sampleKPIs.previousConversionRate}
              format="percent"
              icon={<TrendingUp />}
            />
          </div>
        </section>

        {/* Recharts Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Gráficos Recharts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <ChartWrapper
              title="Ventas e Ingresos Mensuales"
              description="Tendencia de ventas e ingresos a lo largo del año"
            >
              <LineChart
                data={lineChartData}
                dataKey="month"
                lines={[
                  { key: "Ventas", name: "Ventas", color: "#d97706" },
                  { key: "Ingresos", name: "Ingresos (miles)", color: "#14b8a6" },
                ]}
                xAxisKey="month"
                height={300}
              />
            </ChartWrapper>

            {/* Bar Chart */}
            <ChartWrapper
              title="Ventas por Mes"
              description="Comparación de ventas mensuales"
            >
              <BarChart
                data={monthlySalesData}
                bars={[{ key: "sales", name: "Ventas", color: "#d97706" }]}
                xAxisKey="month"
                height={300}
              />
            </ChartWrapper>

            {/* Area Chart */}
            <ChartWrapper
              title="Ingresos Acumulados"
              description="Área de ingresos a lo largo del tiempo"
            >
              <AreaChart
                data={monthlySalesData}
                areas={[
                  { key: "revenue", name: "Ingresos", color: "#14b8a6" },
                ]}
                xAxisKey="month"
                height={300}
              />
            </ChartWrapper>

            {/* Pie Chart */}
            <ChartWrapper
              title="Ventas por Categoría"
              description="Distribución de ventas por categoría de producto"
            >
              <PieChart
                data={categoryData}
                height={300}
                showLegend={true}
                label={false}
              />
            </ChartWrapper>

            {/* Radar Chart */}
            <ChartWrapper
              title="Análisis de Desempeño"
              description="Comparación de métricas entre dos períodos"
            >
              <RadarChart
                data={radarData}
                radars={[
                  { key: "A", name: "Período A", color: "#d97706" },
                  { key: "B", name: "Período B", color: "#14b8a6" },
                ]}
                height={300}
              />
            </ChartWrapper>

            {/* Scatter Chart */}
            <ChartWrapper
              title="Análisis de Dispersión"
              description="Relación entre variables de productos"
            >
              <ScatterChart
                data={scatterData}
                height={300}
              />
            </ChartWrapper>

            {/* Combo Chart */}
            <ChartWrapper
              title="Vista Combinada"
              description="Ventas, ingresos y usuarios en un solo gráfico"
              className="lg:col-span-2"
            >
              <ComboChart
                data={comboChartData}
                bars={[{ key: "Ventas", name: "Ventas", color: "#d97706" }]}
                lines={[
                  { key: "Ingresos", name: "Ingresos (miles)", color: "#14b8a6" },
                  { key: "Usuarios", name: "Usuarios", color: "#10b981" },
                ]}
                xAxisKey="month"
                height={350}
              />
            </ChartWrapper>
          </div>
        </section>

        {/* Additional Metric Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Tarjetas de Métricas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Promedio Mensual"
              value={monthlySalesData.reduce((acc, item) => acc + item.sales, 0) / monthlySalesData.length}
              format="number"
              description="Promedio de ventas mensuales"
              trend={{
                value: 12.5,
                label: "vs mes anterior",
                isPositive: true,
              }}
            />
            <MetricCard
              title="Total Anual"
              value={monthlySalesData.reduce((acc, item) => acc + item.revenue, 0)}
              format="currency"
              currency="USD"
              description="Ingresos totales del año"
              trend={{
                value: 8.3,
                label: "vs año anterior",
                isPositive: true,
              }}
            />
            <MetricCard
              title="Crecimiento"
              value={15.7}
              format="percent"
              description="Tasa de crecimiento anual"
              trend={{
                value: 2.1,
                label: "vs trimestre anterior",
                isPositive: true,
              }}
            />
          </div>
        </section>
      </div>
    </>
  );
}

