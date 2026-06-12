"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { ChannelLogo, type ChannelLogoId } from "@/components/common/channel-logo";

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

const leadsByChannel: Array<{ key: ChannelLogoId; name: string; value: number; color: string }> = [
  { key: "WHATSAPP", name: "WhatsApp", value: 38, color: "#25D366" },
  { key: "INSTAGRAM", name: "Instagram", value: 25, color: "#E1306C" },
  { key: "MESSENGER", name: "Messenger", value: 12, color: "#0084FF" },
  { key: "META_ADS", name: "Meta Ads", value: 15, color: "#1877F2" },
  { key: "REFERRAL", name: "Referidos", value: 6, color: "#F59E0B" },
  { key: "WEB", name: "Web", value: 4, color: "#6366F1" },
];

type SantoDomingoLiveStatus = {
  time: string;
  usdRate: string;
  weather: string;
  temperature: string;
  condition: "sunny" | "cloudy" | "rainy";
};

const defaultLiveStatus: SantoDomingoLiveStatus = {
  time: "--:--",
  usdRate: "RD$ --",
  weather: "Santo Domingo",
  temperature: "--",
  condition: "sunny",
};

const messageChannelTarget: Partial<Record<ChannelLogoId, string>> = {
  WHATSAPP: "WHATSAPP",
  INSTAGRAM: "INSTAGRAM",
  MESSENGER: "MESSENGER",
  META_ADS: "META_ADS",
  WEB: "WEB",
  REFERRAL: "WEB",
};

function weatherCodeToStatus(code: number): Pick<SantoDomingoLiveStatus, "weather" | "condition"> {
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    return { weather: "Lluvia en SD", condition: "rainy" };
  }
  if ([1, 2, 3, 45, 48].includes(code)) {
    return { weather: "Nublado en SD", condition: "cloudy" };
  }
  return { weather: "Soleado en SD", condition: "sunny" };
}

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
    cardBg: "bg-gradient-to-br from-blue-50/95 via-white to-sky-50/80 dark:from-blue-950/30 dark:via-card dark:to-sky-950/20",
    accent: "bg-blue-500",
    shadowColor: "shadow-blue-100/70 dark:shadow-blue-950/10",
    href: "/leads",
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
    cardBg: "bg-gradient-to-br from-emerald-50/95 via-white to-green-50/80 dark:from-emerald-950/30 dark:via-card dark:to-green-950/20",
    accent: "bg-emerald-500",
    shadowColor: "shadow-emerald-100/70 dark:shadow-emerald-950/10",
    href: "/sales",
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
    cardBg: "bg-gradient-to-br from-purple-50/95 via-white to-fuchsia-50/80 dark:from-purple-950/30 dark:via-card dark:to-fuchsia-950/20",
    accent: "bg-purple-500",
    shadowColor: "shadow-purple-100/70 dark:shadow-purple-950/10",
    href: "/messages",
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
    cardBg: "bg-gradient-to-br from-indigo-50/95 via-white to-blue-50/80 dark:from-indigo-950/30 dark:via-card dark:to-blue-950/20",
    accent: "bg-indigo-500",
    shadowColor: "shadow-indigo-100/70 dark:shadow-indigo-950/10",
    href: "/meta-ads",
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
    cardBg: "bg-gradient-to-br from-amber-50/95 via-white to-yellow-50/80 dark:from-amber-950/30 dark:via-card dark:to-yellow-950/20",
    accent: "bg-amber-500",
    shadowColor: "shadow-amber-100/70 dark:shadow-amber-950/10",
    href: "/installations",
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
    cardBg: "bg-gradient-to-br from-teal-50/95 via-white to-cyan-50/80 dark:from-teal-950/30 dark:via-card dark:to-cyan-950/20",
    accent: "bg-teal-500",
    shadowColor: "shadow-teal-100/70 dark:shadow-teal-950/10",
    href: "/warranties",
  },
];

const COLORS = ["#25D366", "#E1306C", "#1877F2", "#F59E0B", "#6366F1"];

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function describeDonutSegment(cx: number, cy: number, outerRadius: number, innerRadius: number, startAngle: number, endAngle: number) {
  const outerStart = polarToCartesian(cx, cy, outerRadius, endAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, startAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}

const channelRingSegments = (() => {
  let angle = 0;
  const gap = 4;
  return leadsByChannel.map((entry) => {
    const sweep = (entry.value / 100) * 360;
    const start = angle + gap / 2;
    const end = angle + sweep - gap / 2;
    angle += sweep;
    return {
      ...entry,
      arc: describeArc(120, 120, 78, start + 3, Math.max(start + 8, end - 3)),
      segmentPath: describeDonutSegment(120, 120, 93, 66, start, Math.max(start + 5, end)),
    };
  });
})();

function MetricCard({
  title,
  value,
  change,
  subValue,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  cardBg,
  accent,
  shadowColor,
  href,
}: (typeof metricCards)[0]) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => { window.location.href = href; }}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") window.location.href = href; }}
      className={cn("relative overflow-hidden border card-hover shadow-sm cursor-pointer", borderColor, cardBg, shadowColor)}
    >
      <span className={cn("absolute inset-x-0 top-0 h-1", accent)} />
      <span className={cn("absolute -right-8 -top-10 h-28 w-28 rounded-full opacity-15 blur-2xl", accent)} />
      <CardContent className="relative p-5">
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
          <div className={cn("p-3 rounded-xl ring-1 ring-white/70 shadow-sm", bgColor)}>
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
  const router = useRouter();
  const [liveStatus, setLiveStatus] = useState<SantoDomingoLiveStatus>(defaultLiveStatus);
  const today = format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es });
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  useEffect(() => {
    let active = true;

    const updateClock = () => {
      const time = new Intl.DateTimeFormat("es-DO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/Santo_Domingo",
      }).format(new Date());
      setLiveStatus((current) => ({ ...current, time }));
    };

    const loadLiveData = async () => {
      updateClock();
      try {
        const [weatherResponse, rateResponse] = await Promise.allSettled([
          fetch("https://api.open-meteo.com/v1/forecast?latitude=18.4861&longitude=-69.9312&current=temperature_2m,weather_code&timezone=America%2FSanto_Domingo", { cache: "no-store" }),
          fetch("https://open.er-api.com/v6/latest/USD", { cache: "no-store" }),
        ]);

        if (!active) return;

        let nextStatus: Partial<SantoDomingoLiveStatus> = {};

        if (weatherResponse.status === "fulfilled" && weatherResponse.value.ok) {
          const weatherData = await weatherResponse.value.json();
          const current = weatherData.current ?? {};
          const weather = weatherCodeToStatus(Number(current.weather_code ?? 0));
          nextStatus = {
            ...nextStatus,
            ...weather,
            temperature: `${Math.round(Number(current.temperature_2m ?? 27))}°C`,
          };
        }

        if (rateResponse.status === "fulfilled" && rateResponse.value.ok) {
          const rateData = await rateResponse.value.json();
          const dopRate = Number(rateData.rates?.DOP);
          if (Number.isFinite(dopRate)) {
            nextStatus.usdRate = `RD$ ${dopRate.toFixed(2)}`;
          }
        }

        setLiveStatus((current) => ({ ...current, ...nextStatus }));
      } catch {
        setLiveStatus((current) => ({ ...current, weather: "Santo Domingo" }));
      }
    };

    loadLiveData();
    const clock = window.setInterval(updateClock, 30000);
    const refresh = window.setInterval(loadLiveData, 1000 * 60 * 30);

    return () => {
      active = false;
      window.clearInterval(clock);
      window.clearInterval(refresh);
    };
  }, []);

  const openMessagesChannel = (channel: ChannelLogoId) => {
    const target = messageChannelTarget[channel] ?? "ALL";
    router.push(`/messages?channel=${target}`);
  };

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
          <Button variant="outline" size="sm" className="gap-2" onClick={() => router.push("/sales")}>
            <Calendar className="w-4 h-4" />
            Este mes
          </Button>
          <Button size="sm" className="gap-2" onClick={() => router.push("/sales")}>
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
        <Card className="channel-space-card relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-[12] hidden dark:block" aria-hidden="true">
            <span className="shooting-star shooting-star-one absolute -left-12 top-24" />
            <span className="shooting-star shooting-star-two absolute left-12 top-48" />
            <img
              src="/space/planets-realistic.png"
              alt=""
              className="space-planets-realistic absolute -right-28 top-12 h-36 w-[250px] object-contain opacity-45"
            />
            <img
              src="/space/shuttle-side-realistic-cropped.png"
              alt=""
              className="space-shuttle-realistic absolute -right-20 top-20 h-14 w-32 object-contain"
            />
            <div className="space-astronaut-realistic absolute -left-1 top-28 h-28 w-24">
              <img src="/space/astronaut-realistic.png" alt="" className="space-astronaut-pose space-astronaut-pose-float absolute inset-0 h-full w-full object-contain" />
              <img src="/space/astronaut-wave-realistic.png" alt="" className="space-astronaut-pose space-astronaut-pose-wave absolute inset-0 h-full w-full object-contain" />
            </div>
          </div>
          <div className={cn("channel-day-scene pointer-events-none absolute inset-x-0 z-[12] block overflow-hidden dark:hidden", `weather-${liveStatus.condition}`)} aria-hidden="true">
            <span className="day-earth-horizon absolute inset-x-0 bottom-[-118px]" />
            <span className="day-sunrise absolute left-1/2 top-[28px]" />
            <span className="day-cloud day-cloud-one absolute" />
            <span className="day-cloud day-cloud-two absolute" />
            <span className="day-cloud day-cloud-three absolute" />
            <span className="day-rain absolute" />
            <span className="day-orbit-ring day-orbit-ring-one absolute left-1/2 top-[138px]" />
            <span className="day-orbit-ring day-orbit-ring-two absolute left-1/2 top-[138px]" />
            <span className="day-data-satellite day-data-satellite-one absolute left-1/2 top-[138px]">
              <img src="/social/whatsapp.webp" alt="" />
            </span>
            <span className="day-data-satellite day-data-satellite-two absolute left-1/2 top-[138px]">
              <img src="/social/instagram.avif" alt="" />
            </span>
            <span className="day-data-satellite day-data-satellite-three absolute left-1/2 top-[138px]">
              <img src="/social/meta.webp" alt="" />
            </span>
            <span className="day-data-satellite day-data-satellite-four absolute left-1/2 top-[138px]">
              <img src="/social/messenger.png" alt="" />
            </span>
            <span className="day-light-sweep absolute -left-20 top-20" />
          </div>
          <div className="absolute right-4 top-4 z-30 hidden items-end gap-2 text-right dark:hidden sm:flex">
            <div className="rounded-xl border border-sky-200/70 bg-white/75 px-3 py-2 text-xs shadow-sm backdrop-blur-md">
              <div className="font-semibold text-slate-900">{liveStatus.time}</div>
              <div className="text-sky-700">Santo Domingo</div>
            </div>
            <div className="rounded-xl border border-amber-200/80 bg-white/75 px-3 py-2 text-xs shadow-sm backdrop-blur-md">
              <div className="font-semibold text-slate-900">USD</div>
              <div className="text-amber-700">{liveStatus.usdRate}</div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 z-30 hidden rounded-xl border border-sky-200/70 bg-white/75 px-3 py-2 text-xs shadow-sm backdrop-blur-md dark:hidden sm:block">
            <div className="font-semibold text-slate-900">{liveStatus.temperature}</div>
            <div className="text-sky-700">{liveStatus.weather}</div>
          </div>
          <CardHeader className="relative z-20 pb-4">
            <CardTitle className="text-base">Leads por Canal</CardTitle>
            <CardDescription>Distribución de canales</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="channel-chart-shell relative mx-auto h-[252px] max-w-[280px] overflow-visible rounded-2xl">
              <div className="pointer-events-none absolute inset-4 rounded-full bg-sky-200/30 blur-3xl dark:bg-slate-950/60" />
              <svg viewBox="0 0 240 240" className="relative z-10 h-full w-full overflow-visible">
                <defs>
                  <filter id="hud-cyan-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2.6" floodColor="var(--channel-glow)" floodOpacity="0.75" />
                  </filter>
                  {leadsByChannel.map((entry) => (
                    <filter key={entry.key} id={`hud-glow-${entry.key}`} x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor={entry.color} floodOpacity="0.95" />
                      <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={entry.color} floodOpacity="0.35" />
                    </filter>
                  ))}
                  <radialGradient id="hud-center" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--channel-center-a)" stopOpacity="0.98" />
                    <stop offset="65%" stopColor="var(--channel-center-b)" stopOpacity="0.94" />
                    <stop offset="100%" stopColor="var(--channel-center-c)" stopOpacity="0.22" />
                  </radialGradient>
                </defs>

                <g className="hud-orbit-slow">
                  <circle cx="120" cy="120" r="104" fill="none" stroke="var(--channel-orbit)" strokeWidth="1" opacity="0.28" strokeDasharray="22 18 2 14" />
                  <circle cx="120" cy="120" r="96" fill="none" stroke="var(--channel-glow)" strokeWidth="1.4" opacity="0.22" filter="url(#hud-cyan-glow)" strokeDasharray="80 28" />
                </g>
                <circle cx="120" cy="120" r="62" fill="url(#hud-center)" stroke="var(--channel-center-stroke)" strokeWidth="1.2" opacity="0.97" />
                <circle cx="120" cy="120" r="52" fill="none" stroke="var(--channel-orbit)" strokeDasharray="2 6" strokeWidth="1" opacity="0.45" />
                <circle className="hud-scan-line" cx="120" cy="120" r="73" fill="none" stroke="var(--channel-glow)" strokeDasharray="20 210" strokeWidth="1.5" opacity="0.34" filter="url(#hud-cyan-glow)" />

                <g>
                  <circle cx="120" cy="120" r="79" fill="none" stroke="var(--channel-track)" strokeWidth="28" opacity="0.62" />
                  {channelRingSegments.map((segment) => (
                    <path
                      key={segment.key}
                      className="hud-segment"
                      d={segment.segmentPath}
                      fill={segment.color}
                      filter={`url(#hud-glow-${segment.key})`}
                      opacity="0.96"
                      style={{ animationDelay: `${channelRingSegments.findIndex((item) => item.key === segment.key) * 0.18}s` }}
                    >
                      <title>{`${segment.name}: ${segment.value}%`}</title>
                    </path>
                  ))}
                  {channelRingSegments.map((segment) => (
                    <path
                      key={`${segment.key}-core`}
                      d={segment.arc}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.42"
                    />
                  ))}
                </g>

                <path d="M48 42h-10v14M192 42h10v14M48 198h-10v-14M192 198h10v-14" fill="none" stroke="var(--channel-orbit)" strokeWidth="1.4" opacity="0.42" />
                <path className="hud-flicker" d="M120 40v10M120 190v10M40 120h10M190 120h10" stroke="var(--channel-glow)" strokeWidth="1.6" opacity="0.45" filter="url(#hud-cyan-glow)" />

                <text x="120" y="111" textAnchor="middle" fill="var(--channel-label)" fontSize="11" letterSpacing="3" fontWeight="600">TOTAL</text>
                <text x="120" y="137" textAnchor="middle" fill="var(--channel-total)" fontSize="31" fontWeight="800" filter="url(#hud-cyan-glow)">100%</text>
                <text x="120" y="155" textAnchor="middle" fill="var(--channel-caption)" fontSize="10" letterSpacing="1.6">canales activos</text>
              </svg>
            </div>
            <div className="space-y-2 mt-2">
              {leadsByChannel.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => openMessagesChannel(item.key)}
                  className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-2.5 py-2 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <ChannelLogo channel={item.key} className="h-5 w-5" />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium tabular-nums">{item.value}%</span>
                </button>
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
