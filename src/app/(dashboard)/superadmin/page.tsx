"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Search,
  Plus,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  LogIn,
  ShieldCheck,
  AlertTriangle,
  X,
  Check,
  Settings2,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn, getInitials } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Plan = "STARTER" | "PRO" | "PREMIUM";
type Status = "ACTIVE" | "TRIAL" | "SUSPENDED";

interface Company {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  status: Status;
  users: number;
  customers: number;
  sales: number;
  mrr: number;
  createdAt: string;
  owner: string;
  email: string;
  city: string;
}

// ─── Simulated Data ───────────────────────────────────────────────────────────

const INITIAL_COMPANIES: Company[] = [
  { id: "c1", name: "TechSecurity CDMX", slug: "techsecurity-cdmx", plan: "PRO", status: "ACTIVE", users: 8, customers: 156, sales: 45, mrr: 89500, createdAt: "2025-01-15", owner: "Carlos Méndez", email: "carlos@techsecurity.mx", city: "CDMX" },
  { id: "c2", name: "Alarmas del Norte SA", slug: "alarmas-norte", plan: "PREMIUM", status: "ACTIVE", users: 15, customers: 312, sales: 98, mrr: 234000, createdAt: "2025-02-03", owner: "Roberto Garza", email: "r.garza@alarmasnorte.com", city: "Monterrey" },
  { id: "c3", name: "Seguridad Express GDL", slug: "seguridad-express", plan: "STARTER", status: "ACTIVE", users: 3, customers: 45, sales: 12, mrr: 18500, createdAt: "2025-03-20", owner: "Ana López", email: "ana@seguridadexpress.mx", city: "Guadalajara" },
  { id: "c4", name: "ProCámaras Puebla", slug: "procamaras-puebla", plan: "PRO", status: "ACTIVE", users: 6, customers: 89, sales: 34, mrr: 67800, createdAt: "2025-04-10", owner: "Miguel Torres", email: "miguel@procamaras.com", city: "Puebla" },
  { id: "c5", name: "SafeHome México", slug: "safehome-mx", plan: "PREMIUM", status: "ACTIVE", users: 22, customers: 445, sales: 167, mrr: 389000, createdAt: "2025-01-08", owner: "Laura Jiménez", email: "laura@safehome.mx", city: "CDMX" },
  { id: "c6", name: "Cámaras y Más León", slug: "camaras-leon", plan: "STARTER", status: "TRIAL", users: 2, customers: 12, sales: 3, mrr: 0, createdAt: "2026-05-28", owner: "Pedro Sánchez", email: "pedro@camarasleon.com", city: "León" },
  { id: "c7", name: "Vigilancia Total QRO", slug: "vigilancia-qro", plan: "PRO", status: "ACTIVE", users: 9, customers: 178, sales: 56, mrr: 112000, createdAt: "2025-06-15", owner: "Diana Cruz", email: "diana@vigilanciatotal.mx", city: "Querétaro" },
  { id: "c8", name: "AlarmPro Cancún", slug: "alarmpro-cancun", plan: "STARTER", status: "SUSPENDED", users: 4, customers: 67, sales: 21, mrr: 0, createdAt: "2025-05-02", owner: "José Martínez", email: "jose@alarmpro.mx", city: "Cancún" },
  { id: "c9", name: "Seguridad Integral MTY", slug: "segint-mty", plan: "PREMIUM", status: "ACTIVE", users: 18, customers: 267, sales: 89, mrr: 198000, createdAt: "2025-03-01", owner: "Fernanda Ríos", email: "fernanda@segint.mx", city: "Monterrey" },
  { id: "c10", name: "MiniCámaras GDL", slug: "minicamaras-gdl", plan: "STARTER", status: "TRIAL", users: 1, customers: 5, sales: 0, mrr: 0, createdAt: "2026-06-05", owner: "Tomás Vega", email: "tomas@minicamaras.com", city: "Guadalajara" },
];

const revenueByPlan = [
  { plan: "STARTER", empresas: 4, mrr: 18500, color: "#6B7280" },
  { plan: "PRO", empresas: 3, mrr: 269300, color: "#3B82F6" },
  { plan: "PREMIUM", empresas: 3, mrr: 821000, color: "#8B5CF6" },
];

const newCompaniesData = [
  { mes: "Ene", empresas: 2 },
  { mes: "Feb", empresas: 1 },
  { mes: "Mar", empresas: 2 },
  { mes: "Abr", empresas: 1 },
  { mes: "May", empresas: 1 },
  { mes: "Jun", empresas: 1 },
];

const activityLog = [
  { id: 1, action: "Usuario creado", detail: "Nuevo vendedor agregado al equipo", time: "hace 2 horas" },
  { id: 2, action: "Plan actualizado", detail: "Upgrade de STARTER a PRO", time: "hace 5 horas" },
  { id: 3, action: "Pago recibido", detail: "MRR renovación mensual", time: "hace 1 día" },
  { id: 4, action: "Login detectado", detail: "Acceso desde IP 187.x.x.x (CDMX)", time: "hace 2 días" },
  { id: 5, action: "Soporte abierto", detail: "Ticket #4521 — Error en integración WhatsApp", time: "hace 3 días" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500",
  "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-teal-500",
  "bg-orange-500", "bg-pink-500",
];

function avatarColor(id: string) {
  const idx = parseInt(id.replace("c", ""), 10) - 1;
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
}

function PlanBadge({ plan }: { plan: Plan }) {
  const styles: Record<Plan, string> = {
    STARTER: "bg-gray-100 text-gray-700 border-gray-200",
    PRO: "bg-blue-100 text-blue-700 border-blue-200",
    PREMIUM: "bg-purple-100 text-purple-700 border-purple-200",
  };
  return (
    <Badge variant="outline" className={cn("text-xs font-semibold", styles[plan])}>
      {plan}
    </Badge>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
    TRIAL: "bg-amber-100 text-amber-700 border-amber-200",
    SUSPENDED: "bg-red-100 text-red-700 border-red-200",
  };
  const labels: Record<Status, string> = {
    ACTIVE: "Activa",
    TRIAL: "Trial",
    SUSPENDED: "Suspendida",
  };
  return (
    <Badge variant="outline" className={cn("text-xs font-semibold", styles[status])}>
      {labels[status]}
    </Badge>
  );
}

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(amount);
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

function KpiCard({ title, value, subtitle, icon: Icon, iconColor, iconBg }: KpiCardProps) {
  return (
    <Card className="border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold mt-1 tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className={cn("p-3 rounded-xl shrink-0", iconBg)}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Company Detail Dialog ────────────────────────────────────────────────────

interface CompanyDetailDialogProps {
  company: Company | null;
  open: boolean;
  onClose: () => void;
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
  onChangePlan: (id: string, plan: Plan) => void;
  onImpersonate: (name: string) => void;
}

function CompanyDetailDialog({
  company,
  open,
  onClose,
  onSuspend,
  onActivate,
  onChangePlan,
  onImpersonate,
}: CompanyDetailDialogProps) {
  const [toast, setToast] = useState<string | null>(null);

  if (!company) return null;

  const handleImpersonate = () => {
    setToast(`Entrando como ${company.name}...`);
    onImpersonate(company.name);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className={cn("text-white font-bold", avatarColor(company.id))}>
                {getInitials(company.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span>{company.name}</span>
                <PlanBadge plan={company.plan} />
                <StatusBadge status={company.status} />
              </div>
              <p className="text-sm text-muted-foreground font-normal">{company.slug}.greycrm.mx</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {toast && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
            <LogIn className="w-4 h-4 shrink-0" />
            {toast}
          </div>
        )}

        {/* Owner Info */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Propietario</p>
              <p className="font-semibold text-sm">{company.owner}</p>
              <p className="text-xs text-muted-foreground">{company.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Ciudad</p>
              <p className="font-semibold text-sm">{company.city}</p>
              <p className="text-xs text-muted-foreground">Desde {company.createdAt}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Usuarios", value: company.users, color: "text-blue-600" },
              { label: "Clientes", value: company.customers, color: "text-purple-600" },
              { label: "Ventas", value: company.sales, color: "text-emerald-600" },
              { label: "MRR", value: formatMXN(company.mrr), color: "text-amber-600" },
            ].map(stat => (
              <div key={stat.label} className="text-center p-3 bg-muted/30 rounded-xl">
                <p className={cn("text-xl font-bold tabular-nums", stat.color)}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Activity Log */}
          <div>
            <p className="text-sm font-semibold mb-3">Actividad reciente</p>
            <div className="space-y-2">
              {activityLog.map(log => (
                <div key={log.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.detail}</p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{log.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Change Plan */}
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium whitespace-nowrap">Cambiar plan:</p>
            <Select
              value={company.plan}
              onValueChange={(v) => onChangePlan(company.id, v as Plan)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STARTER">STARTER</SelectItem>
                <SelectItem value="PRO">PRO</SelectItem>
                <SelectItem value="PREMIUM">PREMIUM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                if (company.status === "SUSPENDED") {
                  onActivate(company.id);
                } else {
                  onSuspend(company.id);
                }
              }}
            >
              {company.status === "SUSPENDED" ? (
                <><CheckCircle className="w-4 h-4" />Activar empresa</>
              ) : (
                <><Ban className="w-4 h-4" />Suspender empresa</>
              )}
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleImpersonate}>
              <LogIn className="w-4 h-4" />
              Impersonar empresa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Tab 1: Resumen ───────────────────────────────────────────────────────────

function TabResumen({ companies }: { companies: Company[] }) {
  const activeCount = companies.filter(c => c.status === "ACTIVE").length;
  const totalMRR = companies.reduce((acc, c) => acc + c.mrr, 0);
  const totalUsers = companies.reduce((acc, c) => acc + c.users, 0);
  const totalCustomers = companies.reduce((acc, c) => acc + c.customers, 0);

  const top5 = [...companies].sort((a, b) => b.mrr - a.mrr).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Empresas activas"
          value={String(activeCount)}
          subtitle={`de ${companies.length} registradas`}
          icon={Building2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KpiCard
          title="MRR Total"
          value={formatMXN(totalMRR)}
          subtitle="Ingresos recurrentes/mes"
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KpiCard
          title="Usuarios totales"
          value={String(totalUsers)}
          subtitle="En todas las empresas"
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <KpiCard
          title="Leads totales"
          value={String(totalCustomers)}
          subtitle="Clientes registrados"
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">MRR por Plan</CardTitle>
            <CardDescription>Distribución de ingresos según tier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByPlan} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="plan"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  width={48}
                />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [formatMXN(Number(value)), "MRR"]}
                  contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="mrr" name="MRR" radius={[6, 6, 0, 0]}>
                  {revenueByPlan.map((entry) => (
                    <Cell key={entry.plan} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-3">
              {revenueByPlan.map(r => (
                <div key={r.plan} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-xs text-muted-foreground">{r.plan}</span>
                  <span className="text-xs font-semibold">{r.empresas}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Nuevas Empresas (últimos 6 meses)</CardTitle>
            <CardDescription>Crecimiento de la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={newCompaniesData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
                  allowDecimals={false}
                  width={30}
                />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [Number(value), "Empresas"]}
                  contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="empresas"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  dot={{ fill: "#3B82F6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 by MRR */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Top 5 Empresas por MRR</CardTitle>
          <CardDescription>Mayor facturación recurrente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">#</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Empresa</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Plan</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">MRR</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Clientes</th>
                  <th className="text-right py-2 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Usuarios</th>
                </tr>
              </thead>
              <tbody>
                {top5.map((company, idx) => (
                  <tr key={company.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 text-muted-foreground font-medium">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className={cn("text-white text-xs font-bold", avatarColor(company.id))}>
                            {getInitials(company.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-xs text-muted-foreground">{company.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3"><PlanBadge plan={company.plan} /></td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600 tabular-nums">{formatMXN(company.mrr)}</td>
                    <td className="py-3 px-3 text-right tabular-nums">{company.customers}</td>
                    <td className="py-3 px-3 text-right tabular-nums">{company.users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab 2: Empresas ──────────────────────────────────────────────────────────

interface TabEmpresasProps {
  companies: Company[];
  onView: (c: Company) => void;
  onEdit: (c: Company) => void;
  onToggleStatus: (id: string) => void;
  onImpersonate: (name: string) => void;
}

function TabEmpresas({ companies, onView, onEdit, onToggleStatus, onImpersonate }: TabEmpresasProps) {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [confirmSuspend, setConfirmSuspend] = useState<string | null>(null);
  const [impersonateToast, setImpersonateToast] = useState<string | null>(null);

  const filtered = companies.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.owner.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "ALL" || c.plan === planFilter;
    const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  const handleImpersonate = (company: Company) => {
    setImpersonateToast(`Entrando como ${company.name}...`);
    onImpersonate(company.name);
    setTimeout(() => setImpersonateToast(null), 3000);
  };

  return (
    <div className="space-y-4">
      {impersonateToast && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
          <LogIn className="w-4 h-4 shrink-0" />
          {impersonateToast}
          <button className="ml-auto" onClick={() => setImpersonateToast(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar empresa, dueño o ciudad..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los planes</SelectItem>
            <SelectItem value="STARTER">STARTER</SelectItem>
            <SelectItem value="PRO">PRO</SelectItem>
            <SelectItem value="PREMIUM">PREMIUM</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            <SelectItem value="ACTIVE">Activa</SelectItem>
            <SelectItem value="TRIAL">Trial</SelectItem>
            <SelectItem value="SUSPENDED">Suspendida</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Nueva Empresa
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} empresa{filtered.length !== 1 ? "s" : ""}</p>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Empresa</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Plan</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Estado</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Usuarios</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Clientes</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">MRR</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Ciudad</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Creada</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(company => (
                <>
                  <tr key={company.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className={cn("text-white text-xs font-bold", avatarColor(company.id))}>
                            {getInitials(company.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{company.name}</p>
                          <p className="text-xs text-muted-foreground">{company.slug}.greycrm.mx</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4"><PlanBadge plan={company.plan} /></td>
                    <td className="py-3 px-4"><StatusBadge status={company.status} /></td>
                    <td className="py-3 px-4 text-center tabular-nums font-medium">{company.users}</td>
                    <td className="py-3 px-4 text-center tabular-nums font-medium">{company.customers}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-emerald-600">
                      {company.mrr > 0 ? formatMXN(company.mrr) : <span className="text-muted-foreground font-normal">—</span>}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{company.city}</td>
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{company.createdAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Ver detalle" onClick={() => onView(company)}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Editar" onClick={() => onEdit(company)}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        {company.status === "SUSPENDED" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-emerald-600"
                            title="Activar"
                            onClick={() => onToggleStatus(company.id)}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-500"
                            title="Suspender"
                            onClick={() => setConfirmSuspend(company.id)}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-blue-600"
                          title="Impersonar"
                          onClick={() => handleImpersonate(company)}
                        >
                          <LogIn className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {confirmSuspend === company.id && (
                    <tr key={`confirm-${company.id}`} className="bg-red-50 border-b">
                      <td colSpan={9} className="px-4 py-2">
                        <div className="flex items-center gap-3 text-sm">
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="text-red-700 font-medium">¿Suspender <strong>{company.name}</strong>? Los usuarios perderán acceso.</span>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs"
                            onClick={() => { onToggleStatus(company.id); setConfirmSuspend(null); }}
                          >
                            Confirmar suspensión
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setConfirmSuspend(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="grid md:hidden gap-3">
        {filtered.map(company => (
          <Card key={company.id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarFallback className={cn("text-white font-bold", avatarColor(company.id))}>
                  {getInitials(company.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold">{company.name}</p>
                  <PlanBadge plan={company.plan} />
                  <StatusBadge status={company.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{company.slug}.greycrm.mx · {company.city}</p>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{company.users} usuarios</span>
                  <span>{company.customers} clientes</span>
                  <span className="text-emerald-600 font-bold">{company.mrr > 0 ? formatMXN(company.mrr) : "—"}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs h-8" onClick={() => onView(company)}>
                <Eye className="w-3 h-3" />Ver
              </Button>
              <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs h-8" onClick={() => handleImpersonate(company)}>
                <LogIn className="w-3 h-3" />Entrar
              </Button>
              {company.status === "SUSPENDED" ? (
                <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs h-8 text-emerald-600 border-emerald-200" onClick={() => onToggleStatus(company.id)}>
                  <CheckCircle className="w-3 h-3" />Activar
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs h-8 text-red-600 border-red-200" onClick={() => { onToggleStatus(company.id); }}>
                  <Ban className="w-3 h-3" />Suspender
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 3: Planes y Precios ──────────────────────────────────────────────────

const PLAN_DETAILS = [
  {
    key: "STARTER" as Plan,
    name: "STARTER",
    price: 299,
    color: "border-gray-200",
    headerColor: "bg-gray-50",
    textColor: "text-gray-700",
    features: [
      "Hasta 3 usuarios",
      "Hasta 500 clientes",
      "Bandeja de mensajes (simulada)",
      "Embudo de ventas",
      "Cotizaciones y ventas",
      "Soporte por email",
    ],
  },
  {
    key: "PRO" as Plan,
    name: "PRO",
    price: 599,
    color: "border-blue-400 ring-2 ring-blue-400/30",
    headerColor: "bg-blue-50",
    textColor: "text-blue-700",
    badge: "Más popular",
    features: [
      "Hasta 10 usuarios",
      "Hasta 2,000 clientes",
      "Conexión WhatsApp Business API",
      "Meta Ads integrado",
      "Instalaciones y técnicos",
      "Inventario",
      "Soporte prioritario",
    ],
  },
  {
    key: "PREMIUM" as Plan,
    name: "PREMIUM",
    price: 999,
    color: "border-purple-300",
    headerColor: "bg-purple-50",
    textColor: "text-purple-700",
    features: [
      "Usuarios ilimitados",
      "Clientes ilimitados",
      "Todo lo de Pro +",
      "Panel SuperAdmin",
      "API personalizada",
      "SLA 99.9% uptime",
      "Soporte dedicado 24/7",
      "Dominio personalizado",
    ],
  },
];

function TabPlanes({ companies }: { companies: Company[] }) {
  const planStats = PLAN_DETAILS.map(p => {
    const cos = companies.filter(c => c.plan === p.key);
    const totalMrr = cos.reduce((acc, c) => acc + c.mrr, 0);
    return { ...p, count: cos.length, totalMrr };
  });
  const grandTotal = planStats.reduce((acc, p) => acc + p.totalMrr, 0);

  return (
    <div className="space-y-8">
      {/* Plan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {PLAN_DETAILS.map(plan => (
          <Card key={plan.key} className={cn("border-2 relative overflow-hidden", plan.color)}>
            {plan.badge && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-600 text-white text-xs">{plan.badge}</Badge>
              </div>
            )}
            <div className={cn("p-6 pb-4", plan.headerColor)}>
              <p className={cn("text-xs font-bold uppercase tracking-widest", plan.textColor)}>{plan.name}</p>
              <div className="mt-2">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground text-sm">/mes</span>
              </div>
            </div>
            <CardContent className="p-6 pt-4 space-y-4">
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Separator />
              <Button variant="outline" className="w-full gap-2">
                <Edit className="w-4 h-4" />
                Editar plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Estadísticas por Plan</CardTitle>
          <CardDescription>Empresas y contribución de ingresos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Plan</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Empresas</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">MRR Total</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">% del Total</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">MRR Promedio</th>
                </tr>
              </thead>
              <tbody>
                {planStats.map(p => (
                  <tr key={p.key} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4"><PlanBadge plan={p.key} /></td>
                    <td className="py-3 px-4 text-center font-medium tabular-nums">{p.count}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 tabular-nums">{formatMXN(p.totalMrr)}</td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {grandTotal > 0 ? `${((p.totalMrr / grandTotal) * 100).toFixed(1)}%` : "—"}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                      {p.count > 0 ? formatMXN(Math.round(p.totalMrr / p.count)) : "—"}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/30 font-bold">
                  <td className="py-3 px-4">Total</td>
                  <td className="py-3 px-4 text-center tabular-nums">{planStats.reduce((a, p) => a + p.count, 0)}</td>
                  <td className="py-3 px-4 text-right text-emerald-600 tabular-nums">{formatMXN(grandTotal)}</td>
                  <td className="py-3 px-4 text-right">100%</td>
                  <td className="py-3 px-4 text-right tabular-nums">{formatMXN(Math.round(grandTotal / companies.length))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab 4: Configuración Global ──────────────────────────────────────────────

function TabConfiguracion() {
  const [config, setConfig] = useState({
    appName: "GreyCRM",
    supportEmail: "soporte@greycrm.mx",
    currency: "MXN",
    timezone: "America/Mexico_City",
    maintenanceMode: false,
  });

  const [flags, setFlags] = useState({
    whatsapp: true,
    metaAds: true,
    inventory: true,
    technicians: true,
    webForms: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {config.maintenanceMode && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Modo mantenimiento ACTIVADO</p>
            <p className="text-sm text-red-700 mt-0.5">Todas las empresas cliente verán una página de mantenimiento. Solo superadmins pueden acceder.</p>
          </div>
        </div>
      )}

      {/* General settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Configuración General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nombre de la app</label>
              <Input value={config.appName} onChange={e => setConfig(c => ({ ...c, appName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email de soporte</label>
              <Input type="email" value={config.supportEmail} onChange={e => setConfig(c => ({ ...c, supportEmail: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Moneda por defecto</label>
              <Select value={config.currency} onValueChange={v => setConfig(c => ({ ...c, currency: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MXN">MXN — Peso mexicano</SelectItem>
                  <SelectItem value="USD">USD — Dólar americano</SelectItem>
                  <SelectItem value="COP">COP — Peso colombiano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Zona horaria por defecto</label>
              <Select value={config.timezone} onValueChange={v => setConfig(c => ({ ...c, timezone: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Mexico_City">CDMX (UTC-6)</SelectItem>
                  <SelectItem value="America/Bogota">Bogotá (UTC-5)</SelectItem>
                  <SelectItem value="America/Lima">Lima (UTC-5)</SelectItem>
                  <SelectItem value="America/New_York">Nueva York (UTC-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
            <div>
              <p className="font-semibold text-sm">Modo mantenimiento</p>
              <p className="text-xs text-muted-foreground mt-0.5">Desactiva el acceso para todos los clientes</p>
            </div>
            <Switch
              checked={config.maintenanceMode}
              onCheckedChange={v => setConfig(c => ({ ...c, maintenanceMode: v }))}
              className="data-[state=checked]:bg-red-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature flags */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Feature Flags
          </CardTitle>
          <CardDescription>Activa o desactiva módulos en toda la plataforma</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {[
            { key: "whatsapp" as const, label: "WhatsApp API integration", desc: "Permite conexión con WhatsApp Business API" },
            { key: "metaAds" as const, label: "Meta Ads module", desc: "Integración con campañas de Facebook e Instagram" },
            { key: "inventory" as const, label: "Inventory module", desc: "Módulo de gestión de inventario y productos" },
            { key: "technicians" as const, label: "Technician panel", desc: "Panel y agenda para técnicos instaladores" },
            { key: "webForms" as const, label: "Web forms", desc: "Formularios embebibles en sitios web de clientes" },
          ].map(flag => (
            <div key={flag.key} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{flag.label}</p>
                <p className="text-xs text-muted-foreground">{flag.desc}</p>
              </div>
              <Switch
                checked={flags[flag.key]}
                onCheckedChange={v => setFlags(f => ({ ...f, [flag.key]: v }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save */}
      <Button className="gap-2" onClick={handleSave}>
        {saved ? (
          <><Check className="w-4 h-4" />Guardado</>
        ) : (
          <><Settings2 className="w-4 h-4" />Guardar configuración</>
        )}
      </Button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabKey = "resumen" | "empresas" | "planes" | "configuracion";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "resumen", label: "Resumen", icon: TrendingUp },
  { key: "empresas", label: "Empresas", icon: Building2 },
  { key: "planes", label: "Planes y Precios", icon: Layers },
  { key: "configuracion", label: "Configuración Global", icon: Settings2 },
];

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("resumen");
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [detailCompany, setDetailCompany] = useState<Company | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleView = (c: Company) => {
    setDetailCompany(c);
    setDetailOpen(true);
  };

  const handleEdit = (c: Company) => {
    setDetailCompany(c);
    setDetailOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setCompanies(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        return { ...c, status: c.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" };
      })
    );
    if (detailCompany?.id === id) {
      setDetailCompany(prev =>
        prev ? { ...prev, status: prev.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" } : null
      );
    }
  };

  const handleChangePlan = (id: string, plan: Plan) => {
    setCompanies(prev => prev.map(c => (c.id === id ? { ...c, plan } : c)));
    if (detailCompany?.id === id) {
      setDetailCompany(prev => (prev ? { ...prev, plan } : null));
    }
  };

  const handleImpersonate = (_companyName: string) => {
    // In production: navigate to company dashboard with impersonation token
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Super Admin</h1>
              <Badge className="bg-red-100 text-red-700 border border-red-200 text-xs font-semibold">
                Vista SuperAdmin
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Panel de administración global de GreyCRM SaaS</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border">
          <ShieldCheck className="w-4 h-4 text-red-500" />
          <span>Acceso restringido — Solo SUPERADMIN</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "resumen" && <TabResumen companies={companies} />}
      {activeTab === "empresas" && (
        <TabEmpresas
          companies={companies}
          onView={handleView}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onImpersonate={handleImpersonate}
        />
      )}
      {activeTab === "planes" && <TabPlanes companies={companies} />}
      {activeTab === "configuracion" && <TabConfiguracion />}

      {/* Company detail dialog */}
      <CompanyDetailDialog
        company={detailCompany}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onSuspend={id => { handleToggleStatus(id); }}
        onActivate={id => { handleToggleStatus(id); }}
        onChangePlan={handleChangePlan}
        onImpersonate={handleImpersonate}
      />
    </div>
  );
}
