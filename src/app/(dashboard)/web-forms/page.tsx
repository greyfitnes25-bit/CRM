"use client";

import { useState } from "react";
import { Search, Globe, Code, Eye as EyeIcon, Check, Copy, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface WebLead {
  id: string; name: string; email: string; phone: string; message: string;
  sourcePage: string; date: string; status: string;
}

const LEAD_STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700", CONTACTED: "bg-yellow-100 text-yellow-700",
  CONVERTED: "bg-green-100 text-green-700", DISCARDED: "bg-gray-100 text-gray-700",
};

const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: "Nuevo", CONTACTED: "Contactado", CONVERTED: "Convertido", DISCARDED: "Descartado",
};

const INITIAL_LEADS: WebLead[] = [
  { id: "wl1", name: "Ramón Flores", email: "ramon.flores@gmail.com", phone: "+52 55 1234 9876", message: "Necesito cámaras para mi negocio de 3 locales", sourcePage: "/pagina-principal", date: "2026-06-10", status: "NEW" },
  { id: "wl2", name: "Patricia Salinas", email: "psalinas@hotmail.com", phone: "+52 55 8765 4321", message: "¿Cuál es el costo de instalación?", sourcePage: "/productos/camaras", date: "2026-06-10", status: "CONTACTED" },
  { id: "wl3", name: "Luis Medina", email: "luis.medina@empresa.com", phone: "+52 55 5432 1098", message: "Distribuidora interesada en mayoreo", sourcePage: "/contacto", date: "2026-06-09", status: "CONVERTED" },
  { id: "wl4", name: "Carla Reyes", email: "carla.reyes@gmail.com", phone: "+52 55 9876 5432", message: "Busco alarma para casa pequeña", sourcePage: "/pagina-principal", date: "2026-06-09", status: "NEW" },
  { id: "wl5", name: "Tomás García", email: "tomas.g@outlook.com", phone: "+52 55 3210 8765", message: "¿Tienen financiamiento?", sourcePage: "/productos/alarmas", date: "2026-06-08", status: "CONTACTED" },
  { id: "wl6", name: "Nora Castillo", email: "nora.c@gmail.com", phone: "+52 55 7654 3210", message: "Quiero cotización para oficina 200m2", sourcePage: "/contacto", date: "2026-06-08", status: "NEW" },
  { id: "wl7", name: "Ernesto Vidal", email: "evidal@empresa.mx", phone: "+52 55 2109 8765", message: "Necesito soporte post-venta", sourcePage: "/soporte", date: "2026-06-07", status: "DISCARDED" },
  { id: "wl8", name: "Sandra López", email: "sandra.l@gmail.com", phone: "+52 55 6543 2109", message: "¿Cuánto tarda la instalación?", sourcePage: "/productos/camaras", date: "2026-06-07", status: "CONTACTED" },
  { id: "wl9", name: "Alberto Mora", email: "amora@hotmail.com", phone: "+52 55 1234 5670", message: "Presupuesto para condominio de 50 depa", sourcePage: "/pagina-principal", date: "2026-06-06", status: "CONVERTED" },
  { id: "wl10", name: "Verónica Soto", email: "vsoto@gmail.com", phone: "+52 55 9870 1234", message: "¿Tienen cámaras para negocios?", sourcePage: "/productos/camaras", date: "2026-06-06", status: "NEW" },
  { id: "wl11", name: "Marco Reyes", email: "marco.r@empresa.com", phone: "+52 55 4321 0987", message: "Interesado en distribución en Monterrey", sourcePage: "/contacto", date: "2026-06-05", status: "CONTACTED" },
  { id: "wl12", name: "Diana Cruz", email: "diana.c@gmail.com", phone: "+52 55 8765 4321", message: "¿Tienen garantía en los equipos?", sourcePage: "/pagina-principal", date: "2026-06-05", status: "NEW" },
];

interface FormConfig {
  businessName: string; headline: string; subheadline: string; primaryColor: string;
  whatsapp: string; showName: boolean; showEmail: boolean; showPhone: boolean;
  showMessage: boolean; ctaText: string;
}

const DEFAULT_CONFIG: FormConfig = {
  businessName: "GreyCRM Seguridad", headline: "Protege lo que más importa", subheadline: "Sistemas de seguridad de alta tecnología. Cotización gratis.",
  primaryColor: "#3B82F6", whatsapp: "+52 55 0000 0000", showName: true, showEmail: true,
  showPhone: true, showMessage: true, ctaText: "Solicitar cotización gratis",
};

export default function WebFormsPage() {
  const [leads, setLeads] = useState<WebLead[]>(INITIAL_LEADS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [formConfig, setFormConfig] = useState<FormConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === "CONVERTED").length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0";
  const topSource = "/pagina-principal";

  const updateLeadStatus = (id: string, status: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const embedCode = `<iframe
  src="https://app.greycrm.com/form/${formConfig.businessName.toLowerCase().replace(/\s/g, '-')}"
  width="100%"
  height="500"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.1);"
></iframe>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Web / Formularios</h1><p className="text-muted-foreground text-sm">Captura de leads desde tu sitio web</p></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-6 flex items-center gap-4"><div className="p-3 rounded-xl bg-blue-50"><Globe className="w-6 h-6 text-blue-600" /></div><div><div className="text-2xl font-bold text-blue-600">{totalLeads}</div><div className="text-xs text-muted-foreground">Leads este mes</div></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><div className="p-3 rounded-xl bg-green-50"><Check className="w-6 h-6 text-green-600" /></div><div><div className="text-2xl font-bold text-green-600">{conversionRate}%</div><div className="text-xs text-muted-foreground">Tasa de conversión</div></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><div className="p-3 rounded-xl bg-purple-50"><EyeIcon className="w-6 h-6 text-purple-600" /></div><div><div className="text-sm font-bold text-purple-600">{topSource}</div><div className="text-xs text-muted-foreground">Página con más leads</div></div></CardContent></Card>
      </div>

      <Tabs defaultValue="leads">
        <TabsList><TabsTrigger value="leads">Leads Web</TabsTrigger><TabsTrigger value="config">Configurar Formulario</TabsTrigger><TabsTrigger value="preview">Vista Previa</TabsTrigger></TabsList>

        <TabsContent value="leads" className="mt-4">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar leads..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los estados</SelectItem>
                {Object.entries(LEAD_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Nombre</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Teléfono</th>
                  <th className="text-left p-4 font-medium">Mensaje</th>
                  <th className="text-left p-4 font-medium">Página</th>
                  <th className="text-left p-4 font-medium">Fecha</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr></thead>
                <tbody>
                  {filtered.map(lead => (
                    <tr key={lead.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{lead.name}</td>
                      <td className="p-4 text-xs text-muted-foreground">{lead.email}</td>
                      <td className="p-4 text-xs text-muted-foreground">{lead.phone}</td>
                      <td className="p-4 text-xs text-muted-foreground max-w-40 truncate">{lead.message}</td>
                      <td className="p-4 text-xs font-mono text-muted-foreground">{lead.sourcePage}</td>
                      <td className="p-4 text-xs text-muted-foreground">{lead.date}</td>
                      <td className="p-4">
                        <Select value={lead.status} onValueChange={v => updateLeadStatus(lead.id, v)}>
                          <SelectTrigger className="h-7 text-xs border-0 p-0 shadow-none">
                            <Badge variant="outline" className={`text-xs cursor-pointer ${LEAD_STATUS_COLORS[lead.status]}`}>{LEAD_STATUS_LABELS[lead.status]}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(LEAD_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end">
                          {lead.status !== "CONVERTED" && (
                            <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1" onClick={() => updateLeadStatus(lead.id, "CONVERTED")}>
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
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Configuración del formulario</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1"><label className="text-sm font-medium">Nombre del negocio</label><Input value={formConfig.businessName} onChange={e => setFormConfig(c => ({ ...c, businessName: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-sm font-medium">Título principal</label><Input value={formConfig.headline} onChange={e => setFormConfig(c => ({ ...c, headline: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-sm font-medium">Subtítulo</label><Input value={formConfig.subheadline} onChange={e => setFormConfig(c => ({ ...c, subheadline: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-sm font-medium">WhatsApp de contacto</label><Input value={formConfig.whatsapp} onChange={e => setFormConfig(c => ({ ...c, whatsapp: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-sm font-medium">Color principal</label><div className="flex gap-3 items-center"><input type="color" value={formConfig.primaryColor} onChange={e => setFormConfig(c => ({ ...c, primaryColor: e.target.value }))} className="h-10 w-16 rounded cursor-pointer border" /><span className="text-sm font-mono">{formConfig.primaryColor}</span></div></div>
                <div className="space-y-1"><label className="text-sm font-medium">Texto del botón CTA</label><Input value={formConfig.ctaText} onChange={e => setFormConfig(c => ({ ...c, ctaText: e.target.value }))} /></div>
                <Separator />
                <div>
                  <div className="text-sm font-medium mb-3">Campos del formulario</div>
                  <div className="space-y-2">
                    {[
                      { key: "showName", label: "Nombre" },
                      { key: "showEmail", label: "Email" },
                      { key: "showPhone", label: "Teléfono" },
                      { key: "showMessage", label: "Mensaje / Interés" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-3">
                        <Checkbox checked={formConfig[key as keyof FormConfig] as boolean} onCheckedChange={v => setFormConfig(c => ({ ...c, [key]: v }))} />
                        <label className="text-sm">{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full gap-2"><Check className="w-4 h-4" />Guardar configuración</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Code className="w-4 h-4" />Código de inserción</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Copia este código y pégalo en tu sitio web donde quieres que aparezca el formulario.</p>
                <div className="bg-muted rounded-lg p-4 font-mono text-xs overflow-x-auto whitespace-pre">{embedCode}</div>
                <Button variant="outline" className="w-full mt-3 gap-2" onClick={copyCode}>
                  {copied ? <><Check className="w-4 h-4 text-green-500" />¡Copiado!</> : <><Copy className="w-4 h-4" />Copiar código</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <div className="rounded-2xl overflow-hidden shadow-2xl border">
                <div style={{ backgroundColor: formConfig.primaryColor }} className="p-6 text-white text-center">
                  <div className="text-lg font-bold">{formConfig.businessName}</div>
                  <div className="text-2xl font-bold mt-2">{formConfig.headline}</div>
                  <div className="text-sm mt-1 opacity-90">{formConfig.subheadline}</div>
                </div>
                <div className="bg-white p-6 space-y-4">
                  {formConfig.showName && (
                    <div className="space-y-1"><label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Nombre completo</label><Input placeholder="Tu nombre" className="border-gray-200" /></div>
                  )}
                  {formConfig.showEmail && (
                    <div className="space-y-1"><label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</label><Input type="email" placeholder="tu@email.com" className="border-gray-200" /></div>
                  )}
                  {formConfig.showPhone && (
                    <div className="space-y-1"><label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Teléfono</label><Input placeholder="+52 55 0000 0000" className="border-gray-200" /></div>
                  )}
                  {formConfig.showMessage && (
                    <div className="space-y-1"><label className="text-xs font-medium text-gray-600 uppercase tracking-wide">¿En qué podemos ayudarte?</label><Input placeholder="Cuéntanos tu proyecto..." className="border-gray-200" /></div>
                  )}
                  <button className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 active:scale-95" style={{ backgroundColor: formConfig.primaryColor }}>
                    {formConfig.ctaText}
                  </button>
                  <div className="text-center text-xs text-gray-400">También puedes contactarnos en WhatsApp: {formConfig.whatsapp}</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
