"use client";

import { useSession } from "next-auth/react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  MessageSquare,
  Megaphone,
  Wrench,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  Star,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency, getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Simulated data
const revenueData = [
  { day: "Lun", ventas: 12500, leads: 8 },
  { day: "Mar", ventas: 18200, leads: 12 },
  { day: "Mié", ventas: 15800, leads: 10 },
  { day: "Jue", ventas: 22000, leads: 15 },
  { day: "Vie", ventas: 28500, leads: 20 },
  { day: "Sáb", ventas: 19300, leads: 13 },
  { day: "Dom", ventas: 14200, leads: 9 },
];

const monthlyData = [
  { mes: "Ene", ventas: 85000, meta: 90000 },
  { mes: "Feb", ventas: 92000, meta: 90000 },
  { mes: "Mar", ventas: 78000, meta: 95000 },
  { mes: "Abr", ventas: 105000, meta: 100000 },
  { mes: "May", ventas: 118000, meta: 110000 },
  { mes: "Jun", ventas: 125000, meta: 120000 },
];

const leadsByChannel = [
  { name: "WhatsApp", value: 42, color: "#25D366" },
  { name: "Instagram", value: 28, color: "#E1306C" },
  { name: "Meta Ads", value: 18, color: "#1877F2" },
  { name: "Referidos", value: 8, color: "#F59E0B" },
  { name: "Web", value: 4, color: "#6366F1" },
];

const funnelData = [
  { stage: "Nuevo Lead", count: 85, percentage: 100, color: "bg-blue-500" },
  { stage: "Contactado", count: 64, percentage: 75, color: "bg-cyan-500" },
  { stage: "Cotizado", count: 43, percentage: 51, color: "bg-yellow-500" },
  { stage: "Negociación", count: 28, percentage: 33, color: "bg-orange-500" },
  { stage: "Pago Pendiente", count: 19, percentage: 22, color: "bg-purple-500" },
  { stage: "Vendido", count: 15, percentage: 18, color: "bg-green-500" },
];

const topSellers = [
  { name: "Ana Martínez", sales: 28, revenue: 145000, avatar: null, trend: 12 },
  { name: "Carlos López", sales: 23, revenue: 118500, avatar: null, trend: 8 },
  { name: "Diana Ruiz", sales: 19, revenue: 97200, avatar: null, trend: -3 },
  { name: "Eduardo García", sales: 16, revenue: 82000, avatar: null, trend: 5 },
  { name: "Fernanda Silva", sales: 12, revenue: 61500, avatar: null, trend: 15 },
];

const recentActivity = [
  {
    id: "1",
    type: "lead",
    icon: "👤",
    title: "Nuevo lead de WhatsApp",
    description: "María González - Interesada en aire acondicionado",
    time: "hace 5 min",
    color: "bg-green-500",
  },
  {
    id: "2",
    type: "sale",
    icon: "💰",
    title: "Venta cerrada",
    description: "Juan Pérez - Split 24,000 BTU - $12,500",
    time: "hace 23 min",
    color: "bg-blue-500",
  },
  {
    id: "3",
    type: "installation",
    icon: "🔧",
    title: "Instalación completada",
    description: "Roberto Sánchez - Minisplit 12,000 BTU",
    time: "hace 1 hora",
    color: "bg-yellow-500",
  },
  {
    id: "4",
    type: "message",
    icon: "💬",
    title: "Mensaje recibido",
    description: "Ana López consultó por garantía de equipo",
    time: "hace 2 horas",
    color: "bg-purple-500",
  },
  {
    id: "5",
    type: "warranty",
    icon: "🛡️",
    title: "Caso de garantía abierto",
    description: "Carlos Mendoza - Equipo con falla de compresor",
    time: "hace 3 horas",
    color: "bg-red-500",
  },
];

const metricCards = [
  {
    title: "Leads Totales",
    value: "247",
    change: 12.5,
    subValue: "Este mes",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-100 dark:border-blue-900/30",
  },
  {
    title: "Ventas del Mes",
    value: "$125,400",
    change: 8.2,
    subValue: "vs. mes anterior",
    icon: ShoppingCart,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-100 dark:border-green-900/30",
  },
  {
    title: "Conversaciones",
    value: "38",
    change: -3.1,
    subValue: "Abiertas ahora",
    icon: MessageSquare,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-100 dark:border-purple-900/30",
  },
  {
    title: "Campañas Activas",
    value: "5",
    change: 0,
    subValue: "Meta Ads",
    icon: Megaphone,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-100 dark:border-indigo-900/30",
  },
  {
    title: "Instalaciones",
    value: "14",
    change: 5.0,
    subValue: "Pendientes",
    icon: Wrench,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-100 dark:border-yellow-900/30",
  },
  {
    title: "Garantías Activas",
    value: "89",
    change: 2.3,
    subValue: "En vigor",
    icon: Shield,
    color: "text-teal-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    borderColor: "border-teal-100 dark:border-teal-900/30",
  },
];

const COLORS = ["#25D366", "#E1306C", "#1877F2", "#F59E0B", "#6366F1"];

function MetricCard({
  title,
  value,
  change,
  subValue,
  icon: Icon,
  color,
  bgColor,
  borderColor,
}: (typeof metricCards)[0]) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <Card className={cn("border card-hover", borderColor)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-2xl font-bold mt-1 tabular-nums">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {!isNeutral && (
                <>
                  {isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isPositive ? "text-green-600" : "text-red-500"
                    )}
                  >
                    {isPositive ? "+" : ""}{change}%
                  </span>
                </>
              )}
              <span className="text-xs text-muted-foreground">{subValue}</span>
            </div>
          </div>
          <div className={cn("p-3 rounded-xl", bgColor)}>
            <Icon className={cn("w-5 h-5", color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.name.includes("ventas") || entry.name.includes("Ventas") || entry.name.includes("meta")
              ? formatCurrency(entry.value)
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const today = format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es });
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="space-y-4 md:space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">
            {greeting}, {session?.user?.name?.split(" ")[0] || "Usuario"} 👋
          </h1>
          <p className="text-muted-foreground text-sm capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            Este mes
          </Button>
          <Button size="sm" className="gap-2">
            <Activity className="w-4 h-4" />
            Ver reporte
          </Button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metricCards.map((card) => (
          <MetricCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Ingresos Semanales</CardTitle>
                <CardDescription>Ventas de los últimos 7 días</CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                +18.3% vs semana pasada
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  width={45}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  name="Ventas"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorVentas)"
                  dot={{ fill: "#3B82F6", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leads by channel pie */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Leads por Canal</CardTitle>
            <CardDescription>Distribución de fuentes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={leadsByChannel}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {leadsByChannel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value}%`, "Porcentaje"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {leadsByChannel.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium tabular-nums">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly comparison */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Ventas vs Meta Mensual</CardTitle>
                <CardDescription>Comparativa primeros 6 meses</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  width={45}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                />
                <Bar dataKey="ventas" name="Ventas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meta" name="Meta" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales funnel */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Embudo de Ventas</CardTitle>
            <CardDescription>Conversión por etapa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelData.map((item) => (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.stage}</span>
                    <span className="font-medium tabular-nums">{item.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", item.color)}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tasa de conversión</span>
                <span className="font-semibold text-green-600">17.6%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top sellers */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Top Vendedores</CardTitle>
                <CardDescription>Desempeño del mes actual</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSellers.map((seller, index) => (
                <div
                  key={seller.name}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-xs text-muted-foreground w-4 tabular-nums font-medium">
                    {index + 1}
                  </span>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={seller.avatar || undefined} />
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {getInitials(seller.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{seller.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {seller.sales} ventas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">
                      {formatCurrency(seller.revenue)}
                    </p>
                    <div className="flex items-center justify-end gap-0.5">
                      {seller.trend > 0 ? (
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-500" />
                      )}
                      <span
                        className={cn(
                          "text-xs",
                          seller.trend > 0 ? "text-green-600" : "text-red-500"
                        )}
                      >
                        {seller.trend > 0 ? "+" : ""}{seller.trend}%
                      </span>
                    </div>
                  </div>
                  {index === 0 && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones del sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0",
                      item.color
                    )}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 text-sm" size="sm">
              Ver toda la actividad
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
