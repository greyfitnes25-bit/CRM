"use client";

import { useState } from "react";
import { Building2, Palette, Users, Shield, GitBranch, MessageSquare, Plug, CreditCard, Check, Plus, Trash2, Edit2, Lock, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ROLE_COLORS, ROLE_LABELS } from "@/lib/constants";

interface CompanyUser { id: string; name: string; email: string; role: string; status: string; }
interface QuickReply { id: string; title: string; content: string; }
interface SalesStage { id: string; name: string; color: string; }

const INITIAL_USERS: CompanyUser[] = [
  { id: "u1", name: "Admin Principal", email: "admin@greycrm.com", role: "OWNER", status: "ACTIVE" },
  { id: "u2", name: "Juan Pérez", email: "juan.perez@empresa.com", role: "SELLER", status: "ACTIVE" },
  { id: "u3", name: "Ana García", email: "ana.garcia@empresa.com", role: "SELLER", status: "ACTIVE" },
  { id: "u4", name: "Carlos Técnico", email: "carlos.tecnico@empresa.com", role: "TECHNICIAN", status: "ACTIVE" },
  { id: "u5", name: "Luis Martínez", email: "luis.martinez@empresa.com", role: "SUPPORT", status: "INACTIVE" },
];

const INITIAL_QUICK_REPLIES: QuickReply[] = [
  { id: "qr1", title: "Saludo inicial", content: "¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte hoy?" },
  { id: "qr2", title: "Solicitar datos", content: "Para ayudarte mejor, ¿me podrías proporcionar tu nombre y teléfono?" },
  { id: "qr3", title: "Enviar catálogo", content: "Con gusto te compartimos nuestro catálogo. ¿Lo prefieres por email o WhatsApp?" },
  { id: "qr4", title: "Garantía", content: "Todos nuestros productos tienen garantía de 12 a 24 meses. Incluye refacciones y mano de obra." },
  { id: "qr5", title: "Despedida", content: "Fue un placer atenderte. Si tienes más preguntas, no dudes en escribirnos." },
];

const INITIAL_STAGES: SalesStage[] = [
  { id: "s1", name: "Nuevo Lead", color: "#3B82F6" },
  { id: "s2", name: "Contactado", color: "#06B6D4" },
  { id: "s3", name: "Cotizado", color: "#F59E0B" },
  { id: "s4", name: "Negociación", color: "#F97316" },
  { id: "s5", name: "Pago Pendiente", color: "#8B5CF6" },
  { id: "s6", name: "Vendido", color: "#10B981" },
  { id: "s7", name: "Perdido", color: "#EF4444" },
];

const PERMISSIONS = [
  { key: "dashboard", label: "Ver Dashboard" },
  { key: "customers", label: "Gestionar Clientes" },
  { key: "sales", label: "Gestionar Ventas" },
  { key: "installations", label: "Gestionar Instalaciones" },
  { key: "reports", label: "Ver Reportes" },
  { key: "settings", label: "Configuración" },
];

const ROLE_PERMISSIONS: Record<string, Record<string, boolean | "pro">> = {
  OWNER: { dashboard: true, customers: true, sales: true, installations: true, reports: true, settings: true },
  ADMIN: { dashboard: true, customers: true, sales: true, installations: true, reports: true, settings: true },
  SELLER: { dashboard: true, customers: true, sales: true, installations: false, reports: "pro", settings: false },
  TECHNICIAN: { dashboard: false, customers: false, sales: false, installations: true, reports: false, settings: false },
  SUPPORT: { dashboard: true, customers: true, sales: false, installations: false, reports: "pro", settings: false },
};

const PLANS = [
  { name: "Básico", price: 299, color: "border-blue-200", features: ["1 usuario", "500 clientes", "Mensajería básica", "Dashboard", "Cotizaciones"] },
  { name: "Pro", price: 599, color: "border-purple-400 shadow-purple-100 shadow-lg", badge: "Recomendado", features: ["5 usuarios", "Clientes ilimitados", "Omnicanal completo", "Instalaciones", "Garantías", "Meta Ads básico"] },
  { name: "Premium", price: 999, color: "border-amber-300", features: ["Usuarios ilimitados", "Todo incluido", "Meta Ads avanzado", "API personalizada", "Soporte prioritario 24/7"] },
];

const NAV_ITEMS = [
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "apariencia", label: "Apariencia", icon: Palette },
  { id: "usuarios", label: "Usuarios", icon: Users },
  { id: "roles", label: "Roles y Permisos", icon: Shield },
  { id: "embudo", label: "Embudo de Ventas", icon: GitBranch },
  { id: "respuestas", label: "Respuestas Rápidas", icon: MessageSquare },
  { id: "integraciones", label: "Integraciones", icon: Plug },
  { id: "facturacion", label: "Planes y Facturación", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("empresa");
  const [users, setUsers] = useState<CompanyUser[]>(INITIAL_USERS);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(INITIAL_QUICK_REPLIES);
  const [stages, setStages] = useState<SalesStage[]>(INITIAL_STAGES);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [editQr, setEditQr] = useState<QuickReply | null>(null);
  const [qrForm, setQrForm] = useState({ title: "", content: "" });
  const [company, setCompany] = useState({ name: "GreyCRM Demo", slug: "greycrm-demo", email: "admin@greycrm.com", phone: "+52 55 0000 0000", address: "", city: "Ciudad de México", country: "México", currency: "MXN", timezone: "America/Mexico_City" });
  const [appearance, setAppearance] = useState({ primaryColor: "#3B82F6", secondaryColor: "#8B5CF6", darkMode: false, crmName: "GreyCRM" });
  const [inviteForm, setInviteForm] = useState({ email: "", role: "SELLER" });

  const openQrEdit = (qr: QuickReply | null) => {
    setEditQr(qr);
    setQrForm(qr ? { title: qr.title, content: qr.content } : { title: "", content: "" });
    setQrOpen(true);
  };

  const saveQr = () => {
    if (editQr) {
      setQuickReplies(prev => prev.map(q => q.id === editQr.id ? { ...q, ...qrForm } : q));
    } else {
      setQuickReplies(prev => [...prev, { id: `qr${Date.now()}`, ...qrForm }]);
    }
    setQrOpen(false);
  };

  const deleteQr = (id: string) => setQuickReplies(prev => prev.filter(q => q.id !== id));

  const inviteUser = () => {
    setUsers(prev => [...prev, { id: `u${Date.now()}`, name: inviteForm.email.split("@")[0], email: inviteForm.email, role: inviteForm.role, status: "ACTIVE" }]);
    setInviteOpen(false);
    setInviteForm({ email: "", role: "SELLER" });
  };

  return (
    <div className="flex gap-0 min-h-screen">
      <aside className="w-64 border-r bg-muted/30 p-4 space-y-1 flex-shrink-0">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Configuración</div>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", activeTab === item.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted")}>
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </button>
        ))}
      </aside>

      <main className="flex-1 p-6 space-y-6">

        {activeTab === "empresa" && (
          <div className="space-y-6 max-w-2xl">
            <div><h2 className="text-xl font-bold">Empresa</h2><p className="text-muted-foreground text-sm">Información general de tu negocio</p></div>
            <Card><CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-sm font-medium">Nombre de la empresa</label><Input value={company.name} onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-sm font-medium">Subdominio / Slug</label><Input value={company.slug} onChange={e => setCompany(c => ({ ...c, slug: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-sm font-medium">Email principal</label><Input type="email" value={company.email} onChange={e => setCompany(c => ({ ...c, email: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-sm font-medium">Teléfono</label><Input value={company.phone} onChange={e => setCompany(c => ({ ...c, phone: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-sm font-medium">Ciudad</label><Input value={company.city} onChange={e => setCompany(c => ({ ...c, city: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-sm font-medium">País</label><Input value={company.country} onChange={e => setCompany(c => ({ ...c, country: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-sm font-medium">Moneda</label>
                  <Select value={company.currency} onValueChange={v => setCompany(c => ({ ...c, currency: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="MXN">MXN — Peso mexicano</SelectItem><SelectItem value="USD">USD — Dólar</SelectItem><SelectItem value="COP">COP — Peso colombiano</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><label className="text-sm font-medium">Zona horaria</label>
                  <Select value={company.timezone} onValueChange={v => setCompany(c => ({ ...c, timezone: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="America/Mexico_City">Ciudad de México (UTC-6)</SelectItem><SelectItem value="America/Bogota">Bogotá (UTC-5)</SelectItem><SelectItem value="America/Lima">Lima (UTC-5)</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Logo</label>
                <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
                  <div className="text-muted-foreground text-sm">Arrastra tu logo aquí o <span className="text-primary font-medium">haz clic para seleccionar</span></div>
                  <div className="text-xs text-muted-foreground mt-1">PNG, JPG hasta 2MB</div>
                </div>
              </div>
              <Button className="gap-2"><Check className="w-4 h-4" />Guardar cambios</Button>
            </CardContent></Card>
          </div>
        )}

        {activeTab === "apariencia" && (
          <div className="space-y-6 max-w-2xl">
            <div><h2 className="text-xl font-bold">Apariencia</h2><p className="text-muted-foreground text-sm">Personaliza los colores y estilo del CRM</p></div>
            <Card><CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color principal</label>
                  <div className="flex gap-3 items-center"><input type="color" value={appearance.primaryColor} onChange={e => setAppearance(a => ({ ...a, primaryColor: e.target.value }))} className="h-12 w-16 rounded-lg cursor-pointer border" /><span className="text-sm font-mono">{appearance.primaryColor}</span></div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color secundario</label>
                  <div className="flex gap-3 items-center"><input type="color" value={appearance.secondaryColor} onChange={e => setAppearance(a => ({ ...a, secondaryColor: e.target.value }))} className="h-12 w-16 rounded-lg cursor-pointer border" /><span className="text-sm font-mono">{appearance.secondaryColor}</span></div>
                </div>
              </div>
              <div className="space-y-1"><label className="text-sm font-medium">Nombre del CRM</label><Input value={appearance.crmName} onChange={e => setAppearance(a => ({ ...a, crmName: e.target.value }))} /></div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {appearance.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <div><div className="font-medium text-sm">Modo oscuro</div><div className="text-xs text-muted-foreground">Cambiar entre tema claro y oscuro</div></div>
                </div>
                <Switch checked={appearance.darkMode} onCheckedChange={v => setAppearance(a => ({ ...a, darkMode: v }))} />
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="text-xs font-medium text-muted-foreground mb-3">VISTA PREVIA SIDEBAR</div>
                <div className="w-48 bg-background border rounded-xl p-3 space-y-1 shadow-sm">
                  <div className="font-bold text-sm px-2 mb-2" style={{ color: appearance.primaryColor }}>{appearance.crmName}</div>
                  {["Dashboard", "Clientes", "Ventas"].map(item => (
                    <div key={item} className="px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2" style={item === "Dashboard" ? { backgroundColor: appearance.primaryColor, color: "white" } : { color: "#64748b" }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item === "Dashboard" ? "white" : appearance.primaryColor }} />{item}
                    </div>
                  ))}
                </div>
              </div>
              <Button className="gap-2"><Check className="w-4 h-4" />Guardar apariencia</Button>
            </CardContent></Card>
          </div>
        )}

        {activeTab === "usuarios" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h2 className="text-xl font-bold">Usuarios</h2><p className="text-muted-foreground text-sm">{users.length} usuarios en la cuenta</p></div>
              <Button onClick={() => setInviteOpen(true)} className="gap-2"><Plus className="w-4 h-4" />Invitar Usuario</Button>
            </div>
            <Card>
              <div className="divide-y">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-xs ${ROLE_COLORS[user.role]}`}>{ROLE_LABELS[user.role]}</Badge>
                      <Badge variant="outline" className={`text-xs ${user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{user.status === "ACTIVE" ? "Activo" : "Inactivo"}</Badge>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Edit2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "roles" && (
          <div className="space-y-4">
            <div><h2 className="text-xl font-bold">Roles y Permisos</h2><p className="text-muted-foreground text-sm">Define qué puede hacer cada rol</p></div>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Permiso</th>
                    {["OWNER", "ADMIN", "SELLER", "TECHNICIAN", "SUPPORT"].map(role => (
                      <th key={role} className="text-center p-4 font-medium">{ROLE_LABELS[role]}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {PERMISSIONS.map(perm => (
                      <tr key={perm.key} className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">{perm.label}</td>
                        {["OWNER", "ADMIN", "SELLER", "TECHNICIAN", "SUPPORT"].map(role => {
                          const val = ROLE_PERMISSIONS[role]?.[perm.key];
                          return (
                            <td key={role} className="p-4 text-center">
                              {val === true && <Check className="w-4 h-4 text-green-500 mx-auto" />}
                              {val === false && <span className="text-muted-foreground text-xs">—</span>}
                              {val === "pro" && <div className="flex items-center justify-center gap-1"><Lock className="w-3 h-3 text-amber-500" /><span className="text-xs text-amber-600">Pro</span></div>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "embudo" && (
          <div className="space-y-4 max-w-lg">
            <div className="flex items-center justify-between">
              <div><h2 className="text-xl font-bold">Embudo de Ventas</h2><p className="text-muted-foreground text-sm">Etapas de tu proceso de ventas</p></div>
              <Button onClick={() => setStages(prev => [...prev, { id: `s${Date.now()}`, name: "Nueva etapa", color: "#64748B" }])} className="gap-2"><Plus className="w-4 h-4" />Agregar etapa</Button>
            </div>
            <Card>
              <CardContent className="pt-4 space-y-2">
                {stages.map((stage, i) => (
                  <div key={stage.id} className="flex items-center gap-3 p-3 border rounded-lg group hover:bg-muted/30 transition-colors">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
                    <Input value={stage.name} onChange={e => setStages(prev => prev.map(s => s.id === stage.id ? { ...s, name: e.target.value } : s))} className="flex-1 h-7 border-0 p-0 focus-visible:ring-0 bg-transparent font-medium" />
                    <input type="color" value={stage.color} onChange={e => setStages(prev => prev.map(s => s.id === stage.id ? { ...s, color: e.target.value } : s))} className="h-7 w-8 rounded cursor-pointer border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {stages.length > 1 && <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setStages(prev => prev.filter(s => s.id !== stage.id))}><Trash2 className="w-3.5 h-3.5" /></Button>}
                  </div>
                ))}
                <Button className="w-full gap-2 mt-2"><Check className="w-4 h-4" />Guardar embudo</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "respuestas" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h2 className="text-xl font-bold">Respuestas Rápidas</h2><p className="text-muted-foreground text-sm">Respuestas predefinidas para agilizar atención</p></div>
              <Button onClick={() => openQrEdit(null)} className="gap-2"><Plus className="w-4 h-4" />Nueva Respuesta</Button>
            </div>
            <div className="space-y-3">
              {quickReplies.map(qr => (
                <Card key={qr.id}>
                  <CardContent className="pt-4 flex items-start gap-4">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{qr.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{qr.content}</div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openQrEdit(qr)}><Edit2 className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500" onClick={() => deleteQr(qr.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "integraciones" && (
          <div className="space-y-4">
            <div><h2 className="text-xl font-bold">Integraciones</h2><p className="text-muted-foreground text-sm">Conecta tus canales y herramientas</p></div>
            <div className="grid lg:grid-cols-2 gap-4">
              {[
                { name: "WhatsApp Business API", icon: "💬", desc: "Envía y recibe mensajes de WhatsApp directamente en el CRM. Activa chatbots, respuestas automáticas y seguimiento.", color: "bg-green-50 border-green-200" },
                { name: "Instagram Messaging", icon: "📸", desc: "Gestiona mensajes directos y comentarios de Instagram en un solo lugar.", color: "bg-pink-50 border-pink-200" },
                { name: "Facebook Messenger", icon: "💙", desc: "Responde mensajes de tu página de Facebook y gestiona leads desde Messenger.", color: "bg-blue-50 border-blue-200" },
                { name: "Meta Ads API", icon: "📊", desc: "Sincroniza campañas y leads de Meta Ads (Facebook e Instagram) automáticamente.", color: "bg-indigo-50 border-indigo-200" },
              ].map(integration => (
                <Card key={integration.name} className={`border ${integration.color}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{integration.icon}</div>
                        <div>
                          <div className="font-semibold text-sm">{integration.name}</div>
                          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 mt-1">No conectado</Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Conectar</Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">{integration.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "facturacion" && (
          <div className="space-y-6">
            <div><h2 className="text-xl font-bold">Planes y Facturación</h2><p className="text-muted-foreground text-sm">Gestiona tu suscripción</p></div>
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div><div className="font-semibold">Plan actual</div><div className="text-2xl font-bold text-blue-600 mt-1">Starter — Demo</div><div className="text-sm text-muted-foreground mt-1">Período de prueba gratuita</div></div>
                  <Badge className="bg-blue-600">Activo</Badge>
                </div>
              </CardContent>
            </Card>
            <div className="grid lg:grid-cols-3 gap-4">
              {PLANS.map(plan => (
                <Card key={plan.name} className={`border-2 ${plan.color} relative`}>
                  {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-purple-600 text-white px-3">{plan.badge}</Badge></div>}
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <div className="font-bold text-lg">{plan.name}</div>
                      <div className="text-3xl font-bold mt-1">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mes</span></div>
                    </div>
                    <Separator />
                    <ul className="space-y-2">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500 flex-shrink-0" />{f}</li>
                      ))}
                    </ul>
                    <Button className={`w-full ${plan.badge ? "bg-purple-600 hover:bg-purple-700" : ""}`}>
                      {plan.name === "Básico" ? "Seleccionar" : `Actualizar a ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

      </main>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Invitar Usuario</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1"><label className="text-sm font-medium">Email</label><Input type="email" value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} placeholder="usuario@empresa.com" /></div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Rol</label>
              <Select value={inviteForm.role} onValueChange={v => setInviteForm(f => ({ ...f, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(ROLE_LABELS).filter(([k]) => k !== "SUPERADMIN").map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancelar</Button>
            <Button onClick={inviteUser} disabled={!inviteForm.email}><Check className="w-4 h-4 mr-2" />Enviar invitación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editQr ? "Editar Respuesta" : "Nueva Respuesta Rápida"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1"><label className="text-sm font-medium">Título</label><Input value={qrForm.title} onChange={e => setQrForm(f => ({ ...f, title: e.target.value }))} placeholder="Nombre corto de la respuesta" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Contenido</label><Textarea value={qrForm.content} onChange={e => setQrForm(f => ({ ...f, content: e.target.value }))} placeholder="Texto de la respuesta rápida..." rows={4} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQrOpen(false)}>Cancelar</Button>
            <Button onClick={saveQr} disabled={!qrForm.title || !qrForm.content}><Check className="w-4 h-4 mr-2" />Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
