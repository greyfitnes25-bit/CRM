"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  Gauge,
  MessageCircle,
  MessageSquareText,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Wand2,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type AgentStatus = "active" | "review" | "paused";

const kpis = [
  {
    label: "Chats evaluados",
    value: "1,248",
    detail: "+18% esta semana",
    icon: MessageSquareText,
    color: "text-blue-500",
    bg: "from-blue-500/15 via-card to-cyan-500/5",
    border: "border-blue-500/25",
  },
  {
    label: "Calidad promedio",
    value: "92%",
    detail: "Meta interna 88%",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "from-emerald-500/15 via-card to-green-500/5",
    border: "border-emerald-500/25",
  },
  {
    label: "Respuestas sugeridas",
    value: "386",
    detail: "74% aceptadas",
    icon: Wand2,
    color: "text-violet-500",
    bg: "from-violet-500/15 via-card to-fuchsia-500/5",
    border: "border-violet-500/25",
  },
  {
    label: "Leads priorizados",
    value: "63",
    detail: "21 urgentes",
    icon: Target,
    color: "text-orange-500",
    bg: "from-orange-500/15 via-card to-amber-500/5",
    border: "border-orange-500/25",
  },
];

const agents: Array<{
  name: string;
  role: string;
  channel: string;
  status: AgentStatus;
  impact: string;
  score: number;
  icon: typeof Bot;
  accent: string;
}> = [
  {
    name: "Recepcionista IA",
    role: "Responde dudas iniciales, capta nombre, telefono y necesidad.",
    channel: "WhatsApp / Messenger",
    status: "active",
    impact: "41 leads atendidos hoy",
    score: 94,
    icon: Bot,
    accent: "from-emerald-500 to-cyan-500",
  },
  {
    name: "Calificador de Leads",
    role: "Detecta presupuesto, urgencia y probabilidad de cierre.",
    channel: "Embudo",
    status: "active",
    impact: "18 leads calientes",
    score: 89,
    icon: Gauge,
    accent: "from-blue-500 to-indigo-500",
  },
  {
    name: "Auditor de Calidad",
    role: "Evalua empatia, velocidad, claridad y cumplimiento del guion.",
    channel: "Mensajes",
    status: "review",
    impact: "7 conversaciones requieren revision",
    score: 92,
    icon: ShieldCheck,
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    name: "Seguimiento de Garantias",
    role: "Resume casos, detecta reclamos criticos y sugiere proxima accion.",
    channel: "Garantias",
    status: "paused",
    impact: "Listo para activar",
    score: 81,
    icon: AlertTriangle,
    accent: "from-orange-500 to-red-500",
  },
];

const rules = [
  { rule: "Si el cliente escribe fuera de horario", action: "Responder disponibilidad y crear tarea de seguimiento", active: true },
  { rule: "Si menciona precio o cotizacion", action: "Pedir datos clave y mover a etapa Cotizado", active: true },
  { rule: "Si expresa enojo o garantia", action: "Marcar prioridad alta y notificar supervisor", active: true },
  { rule: "Si el lead esta 24h sin respuesta", action: "Enviar recordatorio al vendedor asignado", active: false },
];

const qualitySignals = [
  { label: "Empatia", value: 96, color: "bg-emerald-500" },
  { label: "Claridad", value: 91, color: "bg-blue-500" },
  { label: "Velocidad", value: 84, color: "bg-orange-500" },
  { label: "Cierre", value: 78, color: "bg-violet-500" },
];

const auditItems = [
  { title: "Cliente pidio instalacion esta semana", tag: "Alta intencion", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
  { title: "Falto confirmar zona exacta", tag: "Dato pendiente", color: "bg-orange-500/15 text-orange-600 border-orange-500/20" },
  { title: "Respuesta cordial y clara", tag: "Buen tono", color: "bg-blue-500/15 text-blue-600 border-blue-500/20" },
];

const statusConfig = {
  active: { label: "Activo", icon: Play, className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
  review: { label: "Revision", icon: Clock, className: "bg-amber-500/15 text-amber-600 border-amber-500/20" },
  paused: { label: "Pausado", icon: Pause, className: "bg-slate-500/15 text-slate-500 border-slate-500/20" },
};

export default function AiAgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0].name);
  const [prompt, setPrompt] = useState(
    "Hola, estoy interesado en instalar camaras en mi negocio. Necesito precio y disponibilidad para esta semana."
  );

  const selected = useMemo(
    () => agents.find((agent) => agent.name === selectedAgent) ?? agents[0],
    [selectedAgent]
  );

  const suggestedReply =
    "Hola, gracias por escribir a GreyCRM Demo. Con gusto te ayudo. Para cotizarte correctamente necesito la ubicacion, cantidad de camaras y si ya tienes internet en el local. Tenemos disponibilidad esta semana y puedo pasarte una propuesta hoy.";

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Centro inteligente GreyCRM
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">IA / Calidad</h1>
          <p className="text-sm text-muted-foreground">
            Agentes para responder, priorizar leads y auditar la calidad de los chats con clientes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Ver reporte
          </Button>
          <Button className="gap-2">
            <Zap className="h-4 w-4" />
            Nuevo agente
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <Card key={item.label} className={cn("overflow-hidden border shadow-sm", item.border)}>
            <CardContent className={cn("relative p-4 bg-gradient-to-br", item.bg)}>
              <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-white/35 blur-2xl dark:bg-white/5" />
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/40 bg-white/70 p-3 shadow-sm dark:bg-slate-950/50">
                  <item.icon className={cn("h-5 w-5", item.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={cn("text-2xl font-bold", item.color)}>{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:w-fit">
          <TabsTrigger value="agents">Agentes</TabsTrigger>
          <TabsTrigger value="quality">Calidad</TabsTrigger>
          <TabsTrigger value="rules">Reglas</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>Agentes activos</CardTitle>
                <CardDescription>Roles de IA preparados para ventas, mensajes y operaciones.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {agents.map((agent) => {
                  const StatusIcon = statusConfig[agent.status].icon;
                  const AgentIcon = agent.icon;
                  const active = selectedAgent === agent.name;
                  return (
                    <button
                      key={agent.name}
                      onClick={() => setSelectedAgent(agent.name)}
                      className={cn(
                        "rounded-2xl border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg",
                        active && "border-primary/40 ring-2 ring-primary/10"
                      )}
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className={cn("rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg", agent.accent)}>
                          <AgentIcon className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className={statusConfig[agent.status].className}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[agent.status].label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="mt-1 min-h-10 text-sm text-muted-foreground">{agent.role}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{agent.channel}</span>
                        <span>{agent.impact}</span>
                      </div>
                      <div className="mt-3">
                        <div className="mb-1 flex justify-between text-xs">
                          <span>Precision</span>
                          <span className="font-semibold">{agent.score}%</span>
                        </div>
                        <Progress value={agent.score} />
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-gradient-to-br from-primary/10 via-card to-violet-500/10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>{selected.name}</CardTitle>
                    <CardDescription>{selected.channel}</CardDescription>
                  </div>
                  <div className={cn("rounded-2xl bg-gradient-to-br p-3 text-white", selected.accent)}>
                    <selected.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="rounded-xl border bg-muted/30 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Mensaje entrante</p>
                  <Textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} className="min-h-24 resize-none bg-background" />
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                    <Bot className="h-4 w-4" />
                    Respuesta sugerida
                  </div>
                  <p className="text-sm leading-relaxed">{suggestedReply}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border p-3">
                    <p className="text-muted-foreground">Intencion</p>
                    <p className="font-semibold text-emerald-500">Alta</p>
                  </div>
                  <div className="rounded-xl border p-3">
                    <p className="text-muted-foreground">Proxima accion</p>
                    <p className="font-semibold">Cotizar hoy</p>
                  </div>
                </div>
                <Button className="w-full gap-2">
                  Enviar a revision humana
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <Card>
              <CardHeader>
                <CardTitle>Radar de calidad</CardTitle>
                <CardDescription>Senales clave que el supervisor revisa por conversacion.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {qualitySignals.map((signal) => (
                  <div key={signal.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{signal.label}</span>
                      <span className="font-semibold">{signal.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${signal.value}%` }}
                        className={cn("h-full rounded-full", signal.color)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auditoria de chat</CardTitle>
                <CardDescription>Resumen automatico para mejorar ventas y entrenamiento del equipo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {auditItems.map((item) => (
                  <div key={item.title} className="flex items-center justify-between gap-3 rounded-xl border p-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    <Badge variant="outline" className={item.color}>{item.tag}</Badge>
                  </div>
                ))}
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-primary">
                    <TrendingUp className="h-4 w-4" />
                    Recomendacion
                  </div>
                  <p className="text-sm text-muted-foreground">
                    El vendedor debe cerrar con una pregunta concreta: fecha disponible, zona y cantidad de equipos.
                    Esto sube la probabilidad de conversion sin depender de memoria manual.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reglas de automatizacion</CardTitle>
              <CardDescription>Acciones que la IA puede ejecutar o sugerir segun el contexto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {rules.map((item) => (
                <div key={item.rule} className="grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_1.2fr_auto] md:items-center">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{item.rule}</p>
                      <p className="text-xs text-muted-foreground">Condicion del motor de IA</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.action}</p>
                  <div className="flex items-center gap-2 md:justify-end">
                    <Switch defaultChecked={item.active} />
                    <span className="text-xs text-muted-foreground">{item.active ? "Activa" : "Inactiva"}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
