"use client";

import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, Users, MousePointer, Target, BarChart2, Eye, AlertTriangle, Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const SPEND_LEADS_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `Jun ${i + 1}`,
  spend: Math.round(400 + Math.random() * 600),
  leads: Math.round(10 + Math.random() * 25),
}));

const CAMPAIGN_CHART_DATA = [
  { name: "Cámaras Q4", leads: 234, spend: 5000, sales: 18 },
  { name: "Alarmas Res.", leads: 156, spend: 3000, sales: 11 },
  { name: "Black Friday", leads: 445, spend: 8000, sales: 38 },
];

interface Campaign {
  id: string; name: string; status: string; budget: number; spend: number;
  reach: number; impressions: number; clicks: number; ctr: number;
  leads: number; cpl: number; sales: number; roas: number;
}

interface MetaLead {
  id: string; name: string; phone: string; campaign: string; ad: string; date: string; status: string;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: "cam1", name: "Cámaras de Seguridad Q4", status: "ACTIVE", budget: 5000, spend: 4823, reach: 45000, impressions: 128500, clicks: 3420, ctr: 2.66, leads: 234, cpl: 20.6, sales: 18, roas: 3.2 },
  { id: "cam2", name: "Alarmas Residenciales", status: "ACTIVE", budget: 3000, spend: 2918, reach: 28000, impressions: 87600, clicks: 2100, ctr: 2.40, leads: 156, cpl: 18.7, sales: 11, roas: 2.8 },
  { id: "cam3", name: "Black Friday Especial", status: "PAUSED", budget: 8000, spend: 7650, reach: 89000, impressions: 245000, clicks: 7800, ctr: 3.18, leads: 445, cpl: 17.2, sales: 38, roas: 4.1 },
];

const INITIAL_META_LEADS: MetaLead[] = [
  { id: "ml1", name: "Ana Ramírez", phone: "+52 55 1111 2222", campaign: "Cámaras de Seguridad Q4", ad: "Kit Básico - Video", date: "2026-06-10", status: "NEW" },
  { id: "ml2", name: "Jorge Vega", phone: "+52 55 3333 4444", campaign: "Alarmas Residenciales", ad: "Alarma Residencial - Imagen", date: "2026-06-10", status: "CONTACTED" },
  { id: "ml3", name: "Silvia Mora", phone: "+52 55 5555 6666", campaign: "Cámaras de Seguridad Q4", ad: "Kit Profesional - Carrusel", date: "2026-06-09", status: "CONVERTED" },
  { id: "ml4", name: "Ricardo Blanco", phone: "+52 55 7777 8888", campaign: "Black Friday Especial", ad: "Oferta Especial - Video", date: "2026-06-09", status: "NEW" },
  { id: "ml5", name: "Luisa Peña", phone: "+52 55 9999 0000", campaign: "Alarmas Residenciales", ad: "Alarma Empresarial - Imagen", date: "2026-06-08", status: "CONTACTED" },
  { id: "ml6", name: "Mario Castro", phone: "+52 55 2222 3333", campaign: "Cámaras de Seguridad Q4", ad: "Kit Básico - Video", date: "2026-06-08", status: "NEW" },
];

const LEAD_STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700", CONTACTED: "bg-yellow-100 text-yellow-700",
  CONVERTED: "bg-green-100 text-green-700", DISCARDED: "bg-gray-100 text-gray-700",
};

export default function MetaAdsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [metaLeads, setMetaLeads] = useState<MetaLead[]>(INITIAL_META_LEADS);
  const [dateRange, setDateRange] = useState("30");
  const [config, setConfig] = useState({ metaAppId: "", appSecret: "", accessToken: "", adAccountId: "", pageId: "", wabaId: "", phoneNumberId: "" });

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalReach = campaigns.reduce((s, c) => s + c.reach, 0);
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : "0";
  const avgCpc = totalClicks > 0 ? (totalSpend / totalClicks).toFixed(2) : "0";
  const avgRoas = campaigns.length > 0 ? (campaigns.reduce((s, c) => s + c.roas, 0) / campaigns.length).toFixed(1) : "0";

  const toggleCampaign = (id: string) => setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : c));

  const kpiRow1 = [
    { label: "Inversión total", value: `$${totalSpend.toLocaleString()}`, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Alcance", value: totalReach.toLocaleString(), icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Impresiones", value: totalImpressions.toLocaleString(), icon: Eye, color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Clics", value: totalClicks.toLocaleString(), icon: MousePointer, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const kpiRow2 = [
    { label: "CTR promedio", value: `${avgCtr}%`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "CPC promedio", value: `$${avgCpc}`, icon: DollarSign, color: "text-red-600", bg: "bg-red-50" },
    { label: "Leads generados", value: totalLeads, icon: Target, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "ROAS promedio", value: `${avgRoas}x`, icon: BarChart2, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meta Ads</h1>
          <p className="text-muted-foreground text-sm">Rendimiento de campañas publicitarias</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 días</SelectItem>
            <SelectItem value="30">Últimos 30 días</SelectItem>
            <SelectItem value="90">Últimos 90 días</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <div className="text-sm text-yellow-800"><span className="font-semibold">Módulo simulado.</span> Configura tus credenciales de Meta en la pestaña Configuración para ver datos reales en tiempo real.</div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiRow1.map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${kpi.bg}`}><kpi.icon className={`w-5 h-5 ${kpi.color}`} /></div>
              <div><div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div><div className="text-xs text-muted-foreground">{kpi.label}</div></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiRow2.map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${kpi.bg}`}><kpi.icon className={`w-5 h-5 ${kpi.color}`} /></div>
              <div><div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div><div className="text-xs text-muted-foreground">{kpi.label}</div></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList><TabsTrigger value="campaigns">Campañas</TabsTrigger><TabsTrigger value="charts">Gráficas</TabsTrigger><TabsTrigger value="leads">Leads de Meta</TabsTrigger><TabsTrigger value="config">Configuración API</TabsTrigger></TabsList>

        <TabsContent value="campaigns" className="mt-4">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Campaña</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-right p-4 font-medium">Presupuesto</th>
                  <th className="text-right p-4 font-medium">Invertido</th>
                  <th className="text-right p-4 font-medium">Alcance</th>
                  <th className="text-right p-4 font-medium">Clics</th>
                  <th className="text-right p-4 font-medium">CTR</th>
                  <th className="text-right p-4 font-medium">Leads</th>
                  <th className="text-right p-4 font-medium">CPL</th>
                  <th className="text-right p-4 font-medium">ROAS</th>
                  <th className="text-right p-4 font-medium">Activar</th>
                </tr></thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{c.name}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={c.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                          {c.status === "ACTIVE" ? "Activa" : "Pausada"}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">${c.budget.toLocaleString()}</td>
                      <td className="p-4 text-right font-medium">${c.spend.toLocaleString()}</td>
                      <td className="p-4 text-right">{c.reach.toLocaleString()}</td>
                      <td className="p-4 text-right">{c.clicks.toLocaleString()}</td>
                      <td className="p-4 text-right">{c.ctr}%</td>
                      <td className="p-4 text-right font-bold text-indigo-600">{c.leads}</td>
                      <td className="p-4 text-right">${c.cpl}</td>
                      <td className="p-4 text-right font-bold text-emerald-600">{c.roas}x</td>
                      <td className="p-4 text-right"><Switch checked={c.status === "ACTIVE"} onCheckedChange={() => toggleCampaign(c.id)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="mt-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-sm font-medium">Inversión vs Leads (últimos 30 días)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={SPEND_LEADS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="spend" name="Inversión $" stroke="#3B82F6" fill="#93C5FD" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="leads" name="Leads" stroke="#8B5CF6" fill="#C4B5FD" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm font-medium">Rendimiento por campaña</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={CAMPAIGN_CHART_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <RechartsTooltip />
                    <Bar dataKey="leads" name="Leads" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sales" name="Ventas" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="mt-4">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Nombre</th>
                  <th className="text-left p-4 font-medium">Teléfono</th>
                  <th className="text-left p-4 font-medium">Campaña</th>
                  <th className="text-left p-4 font-medium">Anuncio</th>
                  <th className="text-left p-4 font-medium">Fecha</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr></thead>
                <tbody>
                  {metaLeads.map(lead => (
                    <tr key={lead.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{lead.name}</td>
                      <td className="p-4 text-muted-foreground">{lead.phone}</td>
                      <td className="p-4 text-xs text-muted-foreground">{lead.campaign}</td>
                      <td className="p-4 text-xs text-muted-foreground">{lead.ad}</td>
                      <td className="p-4 text-xs text-muted-foreground">{lead.date}</td>
                      <td className="p-4"><Badge variant="outline" className={`text-xs ${LEAD_STATUS_COLORS[lead.status]}`}>{lead.status === "NEW" ? "Nuevo" : lead.status === "CONTACTED" ? "Contactado" : lead.status === "CONVERTED" ? "Convertido" : "Descartado"}</Badge></td>
                      <td className="p-4">
                        <div className="flex justify-end">
                          {lead.status !== "CONVERTED" && (
                            <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1" onClick={() => setMetaLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: "CONVERTED" } : l))}>
                              <UserPlus className="w-3 h-3" />Convertir
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Configurar Meta API
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 text-xs">No conectado</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2 text-sm text-yellow-800">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                Ingresa tus credenciales de Meta Business para conectar y ver datos reales de tus campañas.
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "metaAppId", label: "Meta App ID" },
                  { key: "appSecret", label: "App Secret" },
                  { key: "accessToken", label: "Access Token" },
                  { key: "adAccountId", label: "Ad Account ID" },
                  { key: "pageId", label: "Page ID" },
                  { key: "wabaId", label: "WhatsApp Business Account ID" },
                  { key: "phoneNumberId", label: "Phone Number ID" },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-sm font-medium">{label}</label>
                    <Input
                      value={config[key as keyof typeof config]}
                      onChange={e => setConfig(c => ({ ...c, [key]: e.target.value }))}
                      placeholder={`Ingresa ${label}`}
                      type={key.includes("Secret") || key.includes("Token") ? "password" : "text"}
                    />
                  </div>
                ))}
              </div>
              <Button className="gap-2"><Check className="w-4 h-4" />Guardar configuración</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
