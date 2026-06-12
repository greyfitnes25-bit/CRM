"use client";

import { useEffect, useState } from "react";
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
import {
  APPEARANCE_THEMES,
  getStoredAppAppearance,
  setAppAppearance,
  type AppearanceThemeId,
} from "@/components/providers/appearance-preference-provider";
import { getStoredAppFont, setAppFont } from "@/components/providers/font-preference-provider";
import { RoleAvatar } from "@/components/common/role-avatar";

interface CompanyUser { id: string; name: string; email: string; role: string; status: string; avatar?: string | null; }
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

const FONT_OPTIONS = [
  { label: "Poppins / Redondeado pro", value: "var(--font-poppins), Poppins, var(--font-geist-sans), system-ui, sans-serif" },
  { label: "Inter / SaaS moderno", value: "Inter, var(--font-geist-sans), system-ui, sans-serif" },
  { label: "Geist / Minimal tecnico", value: "var(--font-geist-sans), Inter, system-ui, sans-serif" },
  { label: "Aptos / Microsoft moderno", value: "Aptos, Calibri, system-ui, sans-serif" },
  { label: "Segoe UI / Windows nativo", value: "\"Segoe UI\", Aptos, system-ui, sans-serif" },
  { label: "SF Pro / Apple limpio", value: "\"SF Pro Display\", \"SF Pro Text\", -apple-system, BlinkMacSystemFont, system-ui, sans-serif" },
  { label: "Roboto / Android familiar", value: "Roboto, Arial, system-ui, sans-serif" },
  { label: "Roboto Condensed / Denso", value: "\"Roboto Condensed\", Roboto, Arial, sans-serif" },
  { label: "Open Sans / Corporativo", value: "\"Open Sans\", Arial, system-ui, sans-serif" },
  { label: "Lato / Amable comercial", value: "Lato, \"Segoe UI\", Arial, sans-serif" },
  { label: "Montserrat / Premium", value: "Montserrat, \"Segoe UI\", Arial, sans-serif" },
  { label: "Nunito Sans / Suave", value: "\"Nunito Sans\", Nunito, \"Segoe UI\", sans-serif" },
  { label: "Source Sans 3 / Editorial UI", value: "\"Source Sans 3\", \"Source Sans Pro\", Arial, sans-serif" },
  { label: "IBM Plex Sans / Enterprise", value: "\"IBM Plex Sans\", Arial, sans-serif" },
  { label: "DM Sans / Startup", value: "\"DM Sans\", Inter, Arial, sans-serif" },
  { label: "Manrope / Dashboard fino", value: "Manrope, Inter, Arial, sans-serif" },
  { label: "Plus Jakarta Sans / Moderno", value: "\"Plus Jakarta Sans\", Inter, Arial, sans-serif" },
  { label: "Public Sans / Gobierno pro", value: "\"Public Sans\", Inter, Arial, sans-serif" },
  { label: "Work Sans / Operativo", value: "\"Work Sans\", Arial, sans-serif" },
  { label: "Noto Sans / Global", value: "\"Noto Sans\", Arial, sans-serif" },
  { label: "Ubuntu / Tecnico amable", value: "Ubuntu, Arial, sans-serif" },
  { label: "Raleway / Elegante", value: "Raleway, \"Segoe UI\", Arial, sans-serif" },
  { label: "Figtree / Producto SaaS", value: "Figtree, Inter, Arial, sans-serif" },
  { label: "Outfit / Geometrico", value: "Outfit, Inter, Arial, sans-serif" },
  { label: "Sora / Futurista serio", value: "Sora, Inter, Arial, sans-serif" },
  { label: "Mulish / Lectura clara", value: "Mulish, Arial, sans-serif" },
  { label: "Cabin / Humano", value: "Cabin, Arial, sans-serif" },
  { label: "Barlow / Compacto", value: "Barlow, Arial, sans-serif" },
  { label: "Barlow Condensed / Panel denso", value: "\"Barlow Condensed\", Barlow, Arial, sans-serif" },
  { label: "Archivo / Industrial", value: "Archivo, Arial, sans-serif" },
  { label: "Archivo Narrow / Tablas", value: "\"Archivo Narrow\", Archivo, Arial, sans-serif" },
  { label: "Asap / Rapido y claro", value: "Asap, Arial, sans-serif" },
  { label: "Karla / Cercano", value: "Karla, Arial, sans-serif" },
  { label: "Rubik / Redondo moderno", value: "Rubik, Arial, sans-serif" },
  { label: "Lexend / Accesible", value: "Lexend, Arial, sans-serif" },
  { label: "Urbanist / Elegante moderno", value: "Urbanist, Inter, Arial, sans-serif" },
  { label: "Red Hat Display / Corporativo", value: "\"Red Hat Display\", \"Red Hat Text\", Arial, sans-serif" },
  { label: "Red Hat Text / Lectura", value: "\"Red Hat Text\", Arial, sans-serif" },
  { label: "Helvetica Neue / Clasico premium", value: "\"Helvetica Neue\", Helvetica, Arial, sans-serif" },
  { label: "Arial / Universal", value: "Arial, Helvetica, sans-serif" },
  { label: "Trebuchet MS / Amigable", value: "\"Trebuchet MS\", \"Segoe UI\", sans-serif" },
  { label: "Verdana / Maxima claridad", value: "Verdana, Geneva, sans-serif" },
  { label: "Tahoma / Compacto Windows", value: "Tahoma, Geneva, sans-serif" },
  { label: "Calibri / Office familiar", value: "Calibri, Candara, Segoe, sans-serif" },
  { label: "Candara / Suave Office", value: "Candara, Calibri, Segoe, sans-serif" },
  { label: "Gill Sans / Ejecutivo", value: "\"Gill Sans\", \"Gill Sans MT\", Calibri, sans-serif" },
  { label: "Century Gothic / Geometrico", value: "\"Century Gothic\", CenturyGothic, AppleGothic, sans-serif" },
  { label: "Avenir / Premium limpio", value: "Avenir, \"Avenir Next\", \"Segoe UI\", sans-serif" },
  { label: "Optima / Sofisticado", value: "Optima, Candara, \"Segoe UI\", sans-serif" },
  { label: "Georgia / Editorial elegante", value: "Georgia, \"Times New Roman\", serif" },
];

const CURRENCY_OPTIONS = [
  ["DOP", "Peso dominicano"],
  ["USD", "Dólar estadounidense"],
  ["MXN", "Peso mexicano"],
  ["COP", "Peso colombiano"],
  ["EUR", "Euro"],
  ["CAD", "Dólar canadiense"],
  ["GBP", "Libra esterlina"],
  ["BRL", "Real brasileño"],
  ["ARS", "Peso argentino"],
  ["CLP", "Peso chileno"],
  ["PEN", "Sol peruano"],
  ["CRC", "Colón costarricense"],
  ["GTQ", "Quetzal guatemalteco"],
  ["HNL", "Lempira hondureño"],
  ["NIO", "Córdoba nicaragüense"],
  ["PAB", "Balboa panameño"],
  ["UYU", "Peso uruguayo"],
  ["PYG", "Guaraní paraguayo"],
  ["BOB", "Boliviano"],
  ["VES", "Bolívar venezolano"],
  ["JPY", "Yen japonés"],
  ["CNY", "Yuan chino"],
  ["CHF", "Franco suizo"],
  ["AUD", "Dólar australiano"],
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
  const [company, setCompany] = useState({ name: "GreyCRM Demo", slug: "greycrm-demo", email: "admin@greycrm.com", phone: "+1 809 000 0000", address: "", city: "Santo Domingo", country: "República Dominicana", currency: "DOP", timezone: "America/Santo_Domingo" });
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [appearance, setAppearance] = useState({ primaryColor: "#3B82F6", secondaryColor: "#8B5CF6", darkMode: false, crmName: "GreyCRM" });
  const [selectedTheme, setSelectedTheme] = useState<AppearanceThemeId>("grey");
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].value);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "SELLER" });

  useEffect(() => {
    setSelectedTheme(getStoredAppAppearance());
    setSelectedFont(getStoredAppFont());
    setCompanyLogo(localStorage.getItem("greycrm-company-logo"));
  }, []);

  const applyTheme = (themeId: AppearanceThemeId) => {
    setSelectedTheme(themeId);
    setAppAppearance(themeId);
  };

  const applyFont = (fontFamily: string) => {
    setSelectedFont(fontFamily);
    setAppFont(fontFamily);
  };

  const hexToHsl = (hex: string) => {
    const normalized = hex.replace("#", "");
    const r = parseInt(normalized.slice(0, 2), 16) / 255;
    const g = parseInt(normalized.slice(2, 4), 16) / 255;
    const b = parseInt(normalized.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const applyPrimaryColor = (color: string) => {
    setAppearance((current) => ({ ...current, primaryColor: color }));
    const hsl = hexToHsl(color);
    document.documentElement.style.setProperty("--primary", hsl);
    document.documentElement.style.setProperty("--ring", hsl);
    document.documentElement.style.setProperty("--sidebar-primary", hsl);
    document.documentElement.style.setProperty("--sidebar-ring", hsl);
  };

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

  const handleCompanyLogoUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result);
      setCompanyLogo(value);
      localStorage.setItem("greycrm-company-logo", value);
      window.dispatchEvent(new StorageEvent("storage", { key: "greycrm-company-logo", newValue: value }));
    };
    reader.readAsDataURL(file);
  };

  const handleUserAvatarUpload = (userId: string, file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result);
      setUsers((current) => current.map((user) => user.id === userId ? { ...user, avatar: value } : user));
    };
    reader.readAsDataURL(file);
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
                    <SelectContent className="max-h-72">
                      {CURRENCY_OPTIONS.map(([code, label]) => (
                        <SelectItem key={code} value={code}>{code} — {label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><label className="text-sm font-medium">Zona horaria</label>
                  <Select value={company.timezone} onValueChange={v => setCompany(c => ({ ...c, timezone: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-80">
                      <SelectItem value="America/Santo_Domingo">República Dominicana (UTC-4)</SelectItem>
                      <SelectItem value="America/New_York">Nueva York / Este (UTC-5)</SelectItem>
                      <SelectItem value="America/Mexico_City">Ciudad de México (UTC-6)</SelectItem>
                      <SelectItem value="America/Bogota">Bogotá (UTC-5)</SelectItem>
                      <SelectItem value="America/Lima">Lima (UTC-5)</SelectItem>
                      <SelectItem value="America/Panama">Panamá (UTC-5)</SelectItem>
                      <SelectItem value="Europe/Madrid">Madrid (UTC+1)</SelectItem>
                    </SelectContent>
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
              <label className="flex cursor-pointer items-center gap-4 rounded-xl border bg-muted/30 p-4 transition-colors hover:border-primary">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
                  {companyLogo ? (
                    <img src={companyLogo} alt="Logo de la empresa" className="h-full w-full object-cover" />
                  ) : (
                    <Building2 className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Logo visible en la barra lateral</div>
                  <div className="text-xs text-muted-foreground">Selecciona PNG, JPG o WEBP para personalizar la empresa.</div>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(event) => handleCompanyLogoUpload(event.target.files?.[0])} />
              </label>
              <Button className="gap-2"><Check className="w-4 h-4" />Guardar cambios</Button>
            </CardContent></Card>
          </div>
        )}

        {activeTab === "apariencia" && (
          <div className="space-y-6 max-w-5xl">
            <div><h2 className="text-xl font-bold">Apariencia</h2><p className="text-muted-foreground text-sm">Personaliza los colores y estilo del CRM</p></div>
            <Card><CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Apariencias listas</label>
                  <p className="text-xs text-muted-foreground mt-0.5">Elige una estética para adaptar el CRM a cada empresa.</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {APPEARANCE_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => applyTheme(theme.id)}
                      className={cn(
                        "rounded-lg border p-3 text-left transition-all hover:border-primary hover:shadow-sm",
                        selectedTheme === theme.id && "border-primary ring-2 ring-primary/20"
                      )}
                    >
                      <div className="flex gap-1 mb-3">
                        {theme.swatches.map((color) => (
                          <span key={color} className="h-5 flex-1 rounded" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                      <div className="text-sm font-semibold">{theme.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{theme.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de letra del CRM</label>
                  <Select value={selectedFont} onValueChange={applyFont}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map((font) => (
                        <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4" style={{ fontFamily: selectedFont }}>
                  <div className="text-xs text-muted-foreground mb-2">Vista previa de fuente</div>
                  <div className="text-xl font-bold">GreyCRM Operaciones</div>
                  <div className="text-sm text-muted-foreground mt-1">Clientes, ventas, inventario y técnicos en un solo lugar.</div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color principal</label>
                  <div className="flex gap-3 items-center"><input type="color" value={appearance.primaryColor} onChange={e => applyPrimaryColor(e.target.value)} className="h-12 w-16 rounded-lg cursor-pointer border" /><span className="text-sm font-mono">{appearance.primaryColor}</span></div>
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
                <div className="w-64 bg-background border rounded-xl p-3 space-y-2 shadow-sm" style={{ fontFamily: selectedFont }}>
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
                      <RoleAvatar name={user.name} role={user.role} src={user.avatar} />
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-xs ${ROLE_COLORS[user.role]}`}>{ROLE_LABELS[user.role]}</Badge>
                      <Badge variant="outline" className={`text-xs ${user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{user.status === "ACTIVE" ? "Activo" : "Inactivo"}</Badge>
                      <label className="inline-flex h-8 cursor-pointer items-center rounded-md border px-2 text-xs hover:bg-muted">
                        Foto
                        <input type="file" accept="image/*" className="hidden" onChange={(event) => handleUserAvatarUpload(user.id, event.target.files?.[0])} />
                      </label>
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
