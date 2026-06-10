"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MapPin, Clock, CheckCircle, Wrench, User, Navigation, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { INSTALLATION_STATUS_COLORS, INSTALLATION_STATUS_LABELS } from "@/lib/constants";

interface Installation {
  id: string; number: string; customerName: string; customerAddress: string;
  product: string; technician: string; scheduledDate: string; scheduledTime: string;
  status: string; notes: string; techNotes: string;
}

const TECHNICIANS = ["Carlos Técnico", "Miguel Instalador", "Pedro Servicio", "Sin asignar"];

const INITIAL_INSTALLATIONS: Installation[] = [
  { id: "i1", number: "INST-0001", customerName: "María González", customerAddress: "Av. Insurgentes 123, Col. Roma, CDMX", product: "Kit Cámaras Profesional 8CH", technician: "Carlos Técnico", scheduledDate: "2026-06-11", scheduledTime: "10:00", status: "ASSIGNED", notes: "Cliente solicita instalación en 2 pisos", techNotes: "" },
  { id: "i2", number: "INST-0002", customerName: "Carlos Rodríguez", customerAddress: "Calle Morelos 456, Centro, Guadalajara", product: "Kit Cámaras Premium 16CH 4K", technician: "Miguel Instalador", scheduledDate: "2026-06-10", scheduledTime: "09:00", status: "IN_PROGRESS", notes: "Local comercial, instalar en exteriores", techNotes: "Llegué a las 9:15, iniciando instalación" },
  { id: "i3", number: "INST-0003", customerName: "Roberto Silva", customerAddress: "5 de Mayo 321, Centro Histórico, Puebla", product: "Alarma Residencial Básica", technician: "Carlos Técnico", scheduledDate: "2026-06-12", scheduledTime: "11:00", status: "PENDING", notes: "Primera instalación del cliente", techNotes: "" },
  { id: "i4", number: "INST-0004", customerName: "Isabel Castro", customerAddress: "Pedregal de San Ángel, CDMX", product: "Kit Cámaras Profesional 8CH", technician: "Pedro Servicio", scheduledDate: "2026-06-05", scheduledTime: "14:00", status: "COMPLETED", notes: "Instalación completa", techNotes: "Instalación completada sin incidentes. Cliente satisfecho." },
  { id: "i5", number: "INST-0005", customerName: "Fernando López", customerAddress: "Polanco, CDMX", product: "Kit Cámaras Premium 16CH 4K", technician: "Miguel Instalador", scheduledDate: "2026-06-13", scheduledTime: "08:00", status: "PENDING", notes: "Empresa grande, coordinar con seguridad del edificio", techNotes: "" },
  { id: "i6", number: "INST-0006", customerName: "Daniela Moreno", customerAddress: "Blvd. Torres Landa 456, León GTO", product: "Kit Cámaras Profesional 8CH", technician: "Carlos Técnico", scheduledDate: "2026-06-10", scheduledTime: "15:00", status: "ON_WAY", notes: "", techNotes: "En camino al domicilio" },
  { id: "i7", number: "INST-0007", customerName: "Eduardo Vargas", customerAddress: "San Pedro Garza García, NL", product: "Kit Cámaras Básico 4CH", technician: "Pedro Servicio", scheduledDate: "2026-05-28", scheduledTime: "10:00", status: "COMPLETED", notes: "", techNotes: "Sin novedad, cliente muy satisfecho" },
  { id: "i8", number: "INST-0008", customerName: "Alejandro Ruiz", customerAddress: "Ecatepec, EdoMex", product: "Alarma Residencial Básica", technician: "", scheduledDate: "2026-06-15", scheduledTime: "11:00", status: "PENDING", notes: "Pendiente asignar técnico", techNotes: "" },
];

const STATUS_COUNTS = { PENDING: 0, ASSIGNED: 0, IN_PROGRESS: 0, ON_WAY: 0, COMPLETED: 0, CANCELLED: 0 };

const TODAY_TECH = "Carlos Técnico";

export default function InstallationsPage() {
  const [installations, setInstallations] = useState<Installation[]>(INITIAL_INSTALLATIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [detailInst, setDetailInst] = useState<Installation | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ customerName: "", customerAddress: "", product: "", technician: "", scheduledDate: "", scheduledTime: "", notes: "" });

  const filtered = installations.filter(i => {
    const matchSearch = i.customerName.toLowerCase().includes(search.toLowerCase()) || i.number.includes(search);
    const matchStatus = statusFilter === "ALL" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = { ...STATUS_COUNTS };
  installations.forEach(i => { if (i.status in counts) counts[i.status as keyof typeof counts]++; });

  const todayAssignments = installations.filter(i => i.technician === TODAY_TECH && i.status !== "COMPLETED" && i.status !== "CANCELLED");

  const updateStatus = (id: string, status: string) => {
    setInstallations(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    if (detailInst?.id === id) setDetailInst(prev => prev ? { ...prev, status } : null);
  };

  const saveInstallation = () => {
    const newI: Installation = { ...form, id: `i${Date.now()}`, number: `INST-${String(installations.length + 1).padStart(4, "0")}`, status: form.technician ? "ASSIGNED" : "PENDING", techNotes: "" };
    setInstallations(prev => [newI, ...prev]);
    setCreateOpen(false);
    setForm({ customerName: "", customerAddress: "", product: "", technician: "", scheduledDate: "", scheduledTime: "", notes: "" });
  };

  const summaryCards = [
    { label: "Pendientes", count: counts.PENDING, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
    { label: "Asignadas", count: counts.ASSIGNED, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    { label: "En progreso", count: counts.IN_PROGRESS + counts.ON_WAY, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
    { label: "Completadas", count: counts.COMPLETED, color: "text-green-600", bg: "bg-green-50 border-green-200" },
  ];

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Instalaciones</h1><p className="text-muted-foreground text-sm">{installations.length} órdenes de instalación</p></div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nueva Orden</span><span className="sm:hidden">Nueva</span></Button>
      </div>

      <Tabs defaultValue="orders">
        <TabsList><TabsTrigger value="orders">Órdenes</TabsTrigger><TabsTrigger value="tech">Panel Técnico</TabsTrigger></TabsList>

        <TabsContent value="orders" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {summaryCards.map(s => (
              <Card key={s.label} className={`border ${s.bg}`}>
                <CardContent className="p-4">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 md:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                {Object.entries(INSTALLATION_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-3">
            {filtered.map(inst => (
              <div
                key={inst.id}
                className="p-4 rounded-xl border border-border bg-card cursor-pointer active:bg-muted/50 transition-colors"
                onClick={() => setDetailInst(inst)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-blue-600 text-sm font-semibold">{inst.number}</span>
                    <div className="font-medium mt-0.5">{inst.customerName}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" /><span className="truncate">{inst.customerAddress.split(",")[0]}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs shrink-0 ${INSTALLATION_STATUS_COLORS[inst.status]}`}>{INSTALLATION_STATUS_LABELS[inst.status]}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{inst.technician || <span className="text-orange-500">Sin técnico</span>}</span>
                  <span>{inst.scheduledDate} {inst.scheduledTime}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate">{inst.product}</div>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <Card className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Orden</th>
                  <th className="text-left p-4 font-medium">Cliente</th>
                  <th className="text-left p-4 font-medium">Producto</th>
                  <th className="text-left p-4 font-medium">Técnico</th>
                  <th className="text-left p-4 font-medium">Fecha y Hora</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr></thead>
                <tbody>
                  {filtered.map(inst => (
                    <motion.tr key={inst.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b hover:bg-muted/30 transition-colors group">
                      <td className="p-4 font-mono font-medium text-blue-600">{inst.number}</td>
                      <td className="p-4">
                        <div className="font-medium">{inst.customerName}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{inst.customerAddress.split(",")[0]}</div>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground max-w-32">{inst.product}</td>
                      <td className="p-4">
                        {inst.technician ? (
                          <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /><span className="text-sm">{inst.technician}</span></div>
                        ) : <span className="text-orange-500 text-xs">Sin asignar</span>}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm"><Clock className="w-3 h-3 text-muted-foreground" />{inst.scheduledDate}</div>
                        <div className="text-xs text-muted-foreground">{inst.scheduledTime} hrs</div>
                      </td>
                      <td className="p-4"><Badge variant="outline" className={`text-xs ${INSTALLATION_STATUS_COLORS[inst.status]}`}>{INSTALLATION_STATUS_LABELS[inst.status]}</Badge></td>
                      <td className="p-4">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="h-8 px-3 text-xs" onClick={() => setDetailInst(inst)}>Ver detalle</Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tech" className="mt-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="w-5 h-5" />Mis asignaciones de hoy — {TODAY_TECH}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {todayAssignments.length === 0 && <p className="text-sm text-muted-foreground">No hay asignaciones para hoy.</p>}
                  {todayAssignments.map(inst => (
                    <div key={inst.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{inst.customerName}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{inst.customerAddress}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock className="w-3 h-3" />{inst.scheduledTime} hrs</div>
                          <div className="text-xs mt-1 font-medium">{inst.product}</div>
                        </div>
                        <Badge variant="outline" className={`text-xs ${INSTALLATION_STATUS_COLORS[inst.status]}`}>{INSTALLATION_STATUS_LABELS[inst.status]}</Badge>
                      </div>
                      <div className="flex gap-2">
                        {inst.status === "ASSIGNED" && <Button size="sm" className="flex-1 gap-1 bg-cyan-600 hover:bg-cyan-700" onClick={() => updateStatus(inst.id, "ON_WAY")}><Navigation className="w-3.5 h-3.5" />En camino</Button>}
                        {inst.status === "ON_WAY" && <Button size="sm" className="flex-1 gap-1 bg-orange-600 hover:bg-orange-700" onClick={() => updateStatus(inst.id, "IN_PROGRESS")}><CheckCircle className="w-3.5 h-3.5" />Llegué</Button>}
                        {inst.status === "IN_PROGRESS" && <Button size="sm" className="flex-1 gap-1 bg-green-600 hover:bg-green-700" onClick={() => updateStatus(inst.id, "COMPLETED")}><CheckCircle className="w-3.5 h-3.5" />Completar</Button>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardContent className="pt-6">
                  <div className="h-72 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex flex-col items-center justify-center gap-3">
                    <MapPin className="w-12 h-12 text-slate-400" />
                    <div className="text-center">
                      <div className="font-semibold text-slate-600">Mapa en tiempo real</div>
                      <div className="text-sm text-slate-400 mt-1">Próximamente</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {detailInst && (
        <Dialog open={!!detailInst} onOpenChange={() => setDetailInst(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{detailInst.number}</span>
                <Badge variant="outline" className={INSTALLATION_STATUS_COLORS[detailInst.status]}>{INSTALLATION_STATUS_LABELS[detailInst.status]}</Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Cliente: </span><span className="font-medium">{detailInst.customerName}</span></div>
                <div><span className="text-muted-foreground">Técnico: </span><span className="font-medium">{detailInst.technician || "Sin asignar"}</span></div>
                <div className="col-span-2"><span className="text-muted-foreground">Dirección: </span><span>{detailInst.customerAddress}</span></div>
                <div><span className="text-muted-foreground">Fecha: </span><span>{detailInst.scheduledDate}</span></div>
                <div><span className="text-muted-foreground">Hora: </span><span>{detailInst.scheduledTime} hrs</span></div>
                <div className="col-span-2"><span className="text-muted-foreground">Producto: </span><span className="font-medium">{detailInst.product}</span></div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-3">Progreso de instalación</div>
                <div className="flex items-center gap-2">
                  {["PENDING", "ASSIGNED", "ON_WAY", "IN_PROGRESS", "COMPLETED"].map((s, i, arr) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${detailInst.status === s ? "bg-blue-600 text-white border-blue-600" : ["COMPLETED", "IN_PROGRESS", "ON_WAY", "ASSIGNED"].indexOf(s) < ["COMPLETED", "IN_PROGRESS", "ON_WAY", "ASSIGNED"].indexOf(detailInst.status) ? "bg-green-100 text-green-700 border-green-300" : "bg-muted text-muted-foreground border-muted"}`}>{i + 1}</div>
                      {i < arr.length - 1 && <div className="w-6 h-0.5 bg-muted" />}
                    </div>
                  ))}
                </div>
                <div className="flex gap-1 mt-1">
                  {["PENDING", "ASSIGNED", "ON_WAY", "IN_PROGRESS", "COMPLETED"].map(s => (
                    <div key={s} className="text-xs text-muted-foreground w-12 text-center leading-tight">{INSTALLATION_STATUS_LABELS[s]}</div>
                  ))}
                </div>
              </div>
              {detailInst.notes && <div className="bg-muted/50 p-3 rounded-lg"><div className="text-xs font-medium text-muted-foreground mb-1">NOTAS DE ORDEN</div><div className="text-sm">{detailInst.notes}</div></div>}
              {detailInst.techNotes && <div className="bg-blue-50 p-3 rounded-lg border border-blue-200"><div className="text-xs font-medium text-blue-600 mb-1">NOTAS DEL TÉCNICO</div><div className="text-sm">{detailInst.techNotes}</div></div>}
              <div>
                <div className="text-sm font-medium mb-2">Evidencia fotográfica</div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="h-24 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                      <div className="text-center"><AlertCircle className="w-6 h-6 text-muted-foreground mx-auto mb-1" /><span className="text-xs text-muted-foreground">Sin foto</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              {detailInst.status !== "COMPLETED" && (
                <Select value={detailInst.status} onValueChange={v => updateStatus(detailInst.id, v)}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(INSTALLATION_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              )}
              <Button variant="outline" onClick={() => setDetailInst(null)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Nueva Orden de Instalación</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-sm font-medium">Cliente</label><Input value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="Nombre del cliente" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Producto</label><Input value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))} placeholder="Producto a instalar" /></div>
            <div className="col-span-2 space-y-1"><label className="text-sm font-medium">Dirección</label><Input value={form.customerAddress} onChange={e => setForm(f => ({ ...f, customerAddress: e.target.value }))} placeholder="Dirección completa" /></div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Técnico</label>
              <Select value={form.technician} onValueChange={v => setForm(f => ({ ...f, technician: v }))}>
                <SelectTrigger><SelectValue placeholder="Asignar técnico" /></SelectTrigger>
                <SelectContent>{TECHNICIANS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium">Fecha</label><Input type="date" value={form.scheduledDate} onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))} /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Hora</label><Input type="time" value={form.scheduledTime} onChange={e => setForm(f => ({ ...f, scheduledTime: e.target.value }))} /></div>
            <div className="col-span-2 space-y-1"><label className="text-sm font-medium">Notas</label><Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Instrucciones especiales..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={saveInstallation} disabled={!form.customerName}><Wrench className="w-4 h-4 mr-2" />Crear orden</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
