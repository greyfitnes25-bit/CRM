"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Eye, Shield, AlertTriangle, XCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { WARRANTY_STATUS_COLORS, WARRANTY_STATUS_LABELS } from "@/lib/constants";

interface Warranty {
  id: string; product: string; customerName: string; saleDate: string;
  startDate: string; endDate: string; daysRemaining: number; totalDays: number; status: string;
}

interface WarrantyCase {
  id: string; number: string; warrantyId: string; warrantyProduct: string;
  customerName: string; title: string; description: string; status: string;
  assignedTo: string; createdAt: string; diagnosis: string; solution: string;
}

const CASE_STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-700",
  IN_REVIEW: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-purple-100 text-purple-700",
  REJECTED: "bg-red-100 text-red-700",
  RESOLVED: "bg-green-100 text-green-700",
};

const CASE_STATUS_LABELS: Record<string, string> = {
  OPEN: "Abierto", IN_REVIEW: "En revisión", APPROVED: "Aprobado", REJECTED: "Rechazado", RESOLVED: "Resuelto",
};

const SELLERS = ["Juan Pérez", "Ana García", "Luis Martínez"];

const INITIAL_WARRANTIES: Warranty[] = [
  { id: "w1", product: "Kit Cámaras Premium 16CH 4K", customerName: "Carlos Rodríguez", saleDate: "2026-06-04", startDate: "2026-06-04", endDate: "2028-06-04", daysRemaining: 724, totalDays: 730, status: "ACTIVE" },
  { id: "w2", product: "Kit Cámaras Profesional 8CH", customerName: "Isabel Castro", saleDate: "2026-06-02", startDate: "2026-06-02", endDate: "2027-12-02", daysRemaining: 540, totalDays: 548, status: "ACTIVE" },
  { id: "w3", product: "Kit Cámaras Profesional 8CH", customerName: "María González", saleDate: "2026-06-06", startDate: "2026-06-06", endDate: "2027-12-06", daysRemaining: 544, totalDays: 548, status: "ACTIVE" },
  { id: "w4", product: "Alarma Residencial Básica", customerName: "Roberto Silva", saleDate: "2026-05-30", startDate: "2026-05-30", endDate: "2027-05-30", daysRemaining: 354, totalDays: 365, status: "ACTIVE" },
  { id: "w5", product: "Kit Cámaras Básico 4CH", customerName: "Eduardo Vargas", saleDate: "2026-05-25", startDate: "2026-05-25", endDate: "2027-05-25", daysRemaining: 349, totalDays: 365, status: "ACTIVE" },
  { id: "w6", product: "Sistema Alarma Empresarial", customerName: "Fernando López", saleDate: "2025-06-01", startDate: "2025-06-01", endDate: "2027-06-01", daysRemaining: 356, totalDays: 730, status: "ACTIVE" },
  { id: "w7", product: "DVR 8 Canales HD", customerName: "Daniela Moreno", saleDate: "2025-01-15", startDate: "2025-01-15", endDate: "2026-07-15", daysRemaining: 35, totalDays: 365, status: "ACTIVE" },
  { id: "w8", product: "Cámara IP Exterior 2MP", customerName: "Valentina Cruz", saleDate: "2025-02-20", startDate: "2025-02-20", endDate: "2026-08-20", daysRemaining: 71, totalDays: 365, status: "ACTIVE" },
  { id: "w9", product: "Sensor de Movimiento PIR", customerName: "Alejandro Ruiz", saleDate: "2025-04-10", startDate: "2025-04-10", endDate: "2025-10-10", daysRemaining: -243, totalDays: 183, status: "EXPIRED" },
  { id: "w10", product: "Kit Cámaras Básico 4CH", customerName: "Gabriela Soto", saleDate: "2024-12-01", startDate: "2024-12-01", endDate: "2025-12-01", daysRemaining: -191, totalDays: 365, status: "EXPIRED" },
];

const INITIAL_CASES: WarrantyCase[] = [
  { id: "c1", number: "CASO-0001", warrantyId: "w7", warrantyProduct: "DVR 8 Canales HD", customerName: "Daniela Moreno", title: "DVR no graba en canal 3", description: "El canal 3 del DVR no graba video. Los demás canales funcionan correctamente.", status: "IN_REVIEW", assignedTo: "Juan Pérez", createdAt: "2026-06-08", diagnosis: "Posible falla en el port de entrada de video", solution: "" },
  { id: "c2", number: "CASO-0002", warrantyId: "w2", warrantyProduct: "Kit Cámaras Profesional 8CH", customerName: "Isabel Castro", title: "Cámara exterior sin imagen nocturna", description: "La cámara del patio trasero no muestra imagen en la noche, el infrarrojo no enciende.", status: "OPEN", assignedTo: "", createdAt: "2026-06-09", diagnosis: "", solution: "" },
  { id: "c3", number: "CASO-0003", warrantyId: "w4", warrantyProduct: "Alarma Residencial Básica", customerName: "Roberto Silva", title: "Sensor de ventana activa en falso", description: "El sensor de la ventana de la recámara 2 manda alarma aunque esté cerrada.", status: "APPROVED", assignedTo: "Ana García", createdAt: "2026-06-05", diagnosis: "Sensor desajustado por expansión del marco de madera", solution: "Reajustar posición del sensor y agregar imán adicional" },
  { id: "c4", number: "CASO-0004", warrantyId: "w5", warrantyProduct: "Kit Cámaras Básico 4CH", customerName: "Eduardo Vargas", title: "App móvil no conecta", description: "Desde la actualización del teléfono, la app ya no conecta al DVR.", status: "RESOLVED", assignedTo: "Luis Martínez", createdAt: "2026-05-28", diagnosis: "Problema de compatibilidad con iOS 17.5", solution: "Actualizar firmware del DVR a versión 3.2.1. Problema resuelto." },
  { id: "c5", number: "CASO-0005", warrantyId: "w8", warrantyProduct: "Cámara IP Exterior 2MP", customerName: "Valentina Cruz", title: "Cámara trepida con viento", description: "El soporte de la cámara exterior no sujeta bien y se mueve con el viento.", status: "OPEN", assignedTo: "", createdAt: "2026-06-10", diagnosis: "", solution: "" },
];

export default function WarrantiesPage() {
  const [warranties] = useState<Warranty[]>(INITIAL_WARRANTIES);
  const [cases, setCases] = useState<WarrantyCase[]>(INITIAL_CASES);
  const [wSearch, setWSearch] = useState("");
  const [cSearch, setCSearch] = useState("");
  const [detailCase, setDetailCase] = useState<WarrantyCase | null>(null);
  const [caseFormOpen, setCaseFormOpen] = useState(false);
  const [editForm, setEditForm] = useState({ status: "", assignedTo: "", diagnosis: "", solution: "" });

  const filteredW = warranties.filter(w => w.customerName.toLowerCase().includes(wSearch.toLowerCase()) || w.product.toLowerCase().includes(wSearch.toLowerCase()));
  const filteredC = cases.filter(c => c.customerName.toLowerCase().includes(cSearch.toLowerCase()) || c.number.includes(cSearch));

  const activeCount = warranties.filter(w => w.status === "ACTIVE").length;
  const expiringSoon = warranties.filter(w => w.status === "ACTIVE" && w.daysRemaining <= 90 && w.daysRemaining > 0).length;
  const expiredCount = warranties.filter(w => w.status === "EXPIRED").length;
  const openCases = cases.filter(c => c.status === "OPEN" || c.status === "IN_REVIEW").length;

  const openDetailCase = (c: WarrantyCase) => {
    setDetailCase(c);
    setEditForm({ status: c.status, assignedTo: c.assignedTo, diagnosis: c.diagnosis, solution: c.solution });
  };

  const saveCase = () => {
    if (!detailCase) return;
    setCases(prev => prev.map(c => c.id === detailCase.id ? { ...c, ...editForm } : c));
    setDetailCase(null);
  };

  const getDaysColor = (days: number, total: number) => {
    if (days <= 0) return "bg-red-500";
    const pct = (days / total) * 100;
    if (pct < 15) return "bg-red-500";
    if (pct < 30) return "bg-yellow-500";
    return "bg-green-500";
  };

  const summaryCards = [
    { label: "Garantías activas", value: activeCount, icon: Shield, color: "text-green-600", bg: "bg-green-50" },
    { label: "Vence pronto (<90 días)", value: expiringSoon, icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Vencidas", value: expiredCount, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Casos abiertos", value: openCases, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Garantías</h1><p className="text-muted-foreground text-sm">{warranties.length} garantías registradas</p></div>
        <Button onClick={() => setCaseFormOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nuevo Caso</span><span className="sm:hidden">Caso</span></Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${s.bg} shrink-0`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div><div className={`text-xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-muted-foreground mt-0.5 leading-tight">{s.label}</div></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="warranties">
        <TabsList><TabsTrigger value="warranties">Garantías</TabsTrigger><TabsTrigger value="cases">Casos</TabsTrigger></TabsList>

        <TabsContent value="warranties" className="mt-4">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar garantías..." className="pl-9" value={wSearch} onChange={e => setWSearch(e.target.value)} />
            </div>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-3">
            {filteredW.map(w => (
              <div key={w.id} className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{w.product}</div>
                    <div className="text-muted-foreground text-sm">{w.customerName}</div>
                  </div>
                  <Badge variant="outline" className={`text-xs shrink-0 ${WARRANTY_STATUS_COLORS[w.status]}`}>{WARRANTY_STATUS_LABELS[w.status]}</Badge>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Vence: {w.endDate}</span>
                    <span className="font-medium">{w.daysRemaining > 0 ? `${w.daysRemaining} días restantes` : "Vencida"}</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full transition-all ${getDaysColor(w.daysRemaining, w.totalDays)}`} style={{ width: `${Math.max(0, Math.min(100, (w.daysRemaining / w.totalDays) * 100))}%` }} />
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3 h-8 text-xs gap-1" onClick={() => setCaseFormOpen(true)}>
                  <Plus className="w-3 h-3" /> Abrir caso de garantía
                </Button>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <Card className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Producto</th>
                  <th className="text-left p-4 font-medium">Cliente</th>
                  <th className="text-left p-4 font-medium">Fecha venta</th>
                  <th className="text-left p-4 font-medium">Inicio</th>
                  <th className="text-left p-4 font-medium">Vencimiento</th>
                  <th className="text-left p-4 font-medium w-48">Días restantes</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr></thead>
                <tbody>
                  {filteredW.map(w => (
                    <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-sm">{w.product}</td>
                      <td className="p-4">{w.customerName}</td>
                      <td className="p-4 text-muted-foreground text-xs">{w.saleDate}</td>
                      <td className="p-4 text-muted-foreground text-xs">{w.startDate}</td>
                      <td className="p-4 text-muted-foreground text-xs">{w.endDate}</td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="text-xs font-medium">{w.daysRemaining > 0 ? `${w.daysRemaining} días` : "Vencida"}</div>
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div className={`h-full transition-all ${getDaysColor(w.daysRemaining, w.totalDays)}`} style={{ width: `${Math.max(0, Math.min(100, (w.daysRemaining / w.totalDays) * 100))}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4"><Badge variant="outline" className={`text-xs ${WARRANTY_STATUS_COLORS[w.status]}`}>{WARRANTY_STATUS_LABELS[w.status]}</Badge></td>
                      <td className="p-4">
                        <div className="flex justify-end">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1" onClick={() => setCaseFormOpen(true)}>
                            <Plus className="w-3 h-3" />Caso
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="cases" className="mt-4">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar casos..." className="pl-9" value={cSearch} onChange={e => setCSearch(e.target.value)} />
            </div>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-3">
            {filteredC.map(c => (
              <div key={c.id} className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-blue-600 text-sm font-semibold">{c.number}</span>
                    <div className="font-medium mt-0.5">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.customerName} · {c.warrantyProduct}</div>
                  </div>
                  <Badge variant="outline" className={`text-xs shrink-0 ${CASE_STATUS_COLORS[c.status]}`}>{CASE_STATUS_LABELS[c.status]}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{c.assignedTo || "Sin asignar"}</span>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => openDetailCase(c)}><Eye className="w-3 h-3 mr-1" />Ver</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <Card className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Caso</th>
                  <th className="text-left p-4 font-medium">Garantía</th>
                  <th className="text-left p-4 font-medium">Cliente</th>
                  <th className="text-left p-4 font-medium">Título</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-left p-4 font-medium">Asignado</th>
                  <th className="text-left p-4 font-medium">Creado</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr></thead>
                <tbody>
                  {filteredC.map(c => (
                    <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b hover:bg-muted/30 transition-colors group">
                      <td className="p-4 font-mono font-medium text-blue-600">{c.number}</td>
                      <td className="p-4 text-xs text-muted-foreground max-w-28 truncate">{c.warrantyProduct}</td>
                      <td className="p-4 font-medium">{c.customerName}</td>
                      <td className="p-4">{c.title}</td>
                      <td className="p-4"><Badge variant="outline" className={`text-xs ${CASE_STATUS_COLORS[c.status]}`}>{CASE_STATUS_LABELS[c.status]}</Badge></td>
                      <td className="p-4 text-muted-foreground text-xs">{c.assignedTo || "Sin asignar"}</td>
                      <td className="p-4 text-muted-foreground text-xs">{c.createdAt}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openDetailCase(c)}><Eye className="w-4 h-4" /></Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {detailCase && (
        <Dialog open={!!detailCase} onOpenChange={() => setDetailCase(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{detailCase.number} — {detailCase.title}</span>
                <Badge variant="outline" className={CASE_STATUS_COLORS[detailCase.status]}>{CASE_STATUS_LABELS[detailCase.status]}</Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Cliente: </span><span className="font-medium">{detailCase.customerName}</span></div>
                <div><span className="text-muted-foreground">Producto: </span><span>{detailCase.warrantyProduct}</span></div>
                <div><span className="text-muted-foreground">Creado: </span><span>{detailCase.createdAt}</span></div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg"><div className="text-xs font-medium text-muted-foreground mb-1">DESCRIPCIÓN</div><div className="text-sm">{detailCase.description}</div></div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Estado</label>
                  <Select value={editForm.status} onValueChange={v => setEditForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(CASE_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Asignar a</label>
                  <Select value={editForm.assignedTo} onValueChange={v => setEditForm(f => ({ ...f, assignedTo: v }))}>
                    <SelectTrigger><SelectValue placeholder="Sin asignar" /></SelectTrigger>
                    <SelectContent>{SELLERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1"><label className="text-sm font-medium">Diagnóstico</label><Textarea value={editForm.diagnosis} onChange={e => setEditForm(f => ({ ...f, diagnosis: e.target.value }))} placeholder="Diagnóstico técnico..." rows={2} /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Solución</label><Textarea value={editForm.solution} onChange={e => setEditForm(f => ({ ...f, solution: e.target.value }))} placeholder="Solución aplicada..." rows={2} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailCase(null)}>Cancelar</Button>
              <Button onClick={saveCase}>Guardar cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={caseFormOpen} onOpenChange={setCaseFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Abrir Caso de Garantía</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Garantía relacionada</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Seleccionar garantía" /></SelectTrigger>
                <SelectContent>{warranties.filter(w => w.status === "ACTIVE").map(w => <SelectItem key={w.id} value={w.id}>{w.product} — {w.customerName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium">Título del caso</label><Input placeholder="Descripción breve del problema" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Descripción</label><Textarea placeholder="Describe el problema en detalle..." rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCaseFormOpen(false)}>Cancelar</Button>
            <Button onClick={() => setCaseFormOpen(false)}>Abrir caso</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
