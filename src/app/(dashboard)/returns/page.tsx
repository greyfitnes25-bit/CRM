"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Eye, Check, X, RotateCcw, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface Return {
  id: string; number: string; customerName: string; product: string;
  saleNumber: string; reason: string; amount: number; status: string;
  responsible: string; date: string; notes: string; comments: string[];
}

const RETURN_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-gray-100 text-gray-700",
};

const RETURN_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente", APPROVED: "Aprobado", REJECTED: "Rechazado", COMPLETED: "Completado",
};

const RETURN_REASONS = [
  "Producto defectuoso", "No cumple expectativas", "Error en pedido",
  "Producto incorrecto", "Daño en envío", "Cambio de opinión", "Otro"
];

const SELLERS = ["Juan Pérez", "Ana García", "Luis Martínez"];

const SALES_REF = [
  { number: "VTA-0001", customer: "Carlos Rodríguez", products: ["Kit Cámaras Premium 16CH 4K", "Instalación Básica"] },
  { number: "VTA-0002", customer: "Isabel Castro", products: ["Kit Cámaras Profesional 8CH", "Mantenimiento Anual"] },
  { number: "VTA-0003", customer: "María González", products: ["Kit Cámaras Profesional 8CH"] },
  { number: "VTA-0004", customer: "Fernando López", products: ["Kit Cámaras Básico 4CH"] },
  { number: "VTA-0005", customer: "Roberto Silva", products: ["Alarma Residencial Básica"] },
];

const INITIAL_RETURNS: Return[] = [
  { id: "r1", number: "DEV-0001", customerName: "Carlos Rodríguez", product: "Kit Cámaras Premium 16CH 4K", saleNumber: "VTA-0001", reason: "Producto defectuoso", amount: 15000, status: "APPROVED", responsible: "Ana García", date: "2026-06-08", notes: "DVR presenta fallas en puertos 9-16", comments: ["Revisado por técnico. Confirmada la falla de fábrica.", "Aprobada devolución total del DVR."] },
  { id: "r2", number: "DEV-0002", customerName: "María González", product: "Kit Cámaras Profesional 8CH", saleNumber: "VTA-0003", reason: "No cumple expectativas", amount: 8900, status: "PENDING", responsible: "Juan Pérez", date: "2026-06-09", notes: "Cliente menciona que las cámaras no tienen suficiente ángulo", comments: [] },
  { id: "r3", number: "DEV-0003", customerName: "Fernando López", product: "Kit Cámaras Básico 4CH", saleNumber: "VTA-0004", reason: "Error en pedido", amount: 4500, status: "COMPLETED", responsible: "Juan Pérez", date: "2026-06-05", notes: "Se entregó kit básico en lugar de profesional", comments: ["Error confirmado en sistema.", "Devolución procesada. Entrega de producto correcto pendiente."] },
  { id: "r4", number: "DEV-0004", customerName: "Isabel Castro", product: "Mantenimiento Anual", saleNumber: "VTA-0002", reason: "Cambio de opinión", amount: 1200, status: "REJECTED", responsible: "Ana García", date: "2026-06-03", notes: "Solicita devolver el mantenimiento ya que contrató a otro proveedor", comments: ["Revisado. Servicio ya fue prestado parcialmente. Devolución no procede."] },
  { id: "r5", number: "DEV-0005", customerName: "Roberto Silva", product: "Alarma Residencial Básica", saleNumber: "VTA-0005", reason: "Producto defectuoso", amount: 3200, status: "PENDING", responsible: "", date: "2026-06-10", notes: "Panel de alarma no enciende desde el primer día", comments: [] },
];

export default function ReturnsPage() {
  const [returns, setReturns] = useState<Return[]>(INITIAL_RETURNS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [detailReturn, setDetailReturn] = useState<Return | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const [form, setForm] = useState({ saleNumber: "", product: "", reason: "", amount: "", notes: "", responsible: "" });

  const filtered = returns.filter(r => {
    const matchSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) || r.number.includes(search);
    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = returns.filter(r => r.status === "PENDING").length;
  const approvedCount = returns.filter(r => r.status === "APPROVED").length;
  const totalAmount = returns.filter(r => r.status !== "REJECTED").reduce((s, r) => s + r.amount, 0);

  const updateStatus = (id: string, status: string) => {
    setReturns(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (detailReturn?.id === id) setDetailReturn(prev => prev ? { ...prev, status } : null);
  };

  const addComment = () => {
    if (!detailReturn || !newComment.trim()) return;
    setReturns(prev => prev.map(r => r.id === detailReturn.id ? { ...r, comments: [...r.comments, newComment] } : r));
    setDetailReturn(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : null);
    setNewComment("");
  };

  const saveReturn = () => {
    const sale = SALES_REF.find(s => s.number === form.saleNumber);
    const newR: Return = { id: `r${Date.now()}`, number: `DEV-${String(returns.length + 1).padStart(4, "0")}`, customerName: sale?.customer || "—", product: form.product, saleNumber: form.saleNumber, reason: form.reason, amount: parseFloat(form.amount) || 0, status: "PENDING", responsible: form.responsible, date: new Date().toISOString().split("T")[0], notes: form.notes, comments: [] };
    setReturns(prev => [newR, ...prev]);
    setCreateOpen(false);
    setForm({ saleNumber: "", product: "", reason: "", amount: "", notes: "", responsible: "" });
  };

  const stats = [
    { label: "Pendientes", value: pendingCount, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Aprobadas", value: approvedCount, icon: Check, color: "text-green-600", bg: "bg-green-50" },
    { label: "Monto total devuelto", value: `$${totalAmount.toLocaleString()}`, icon: DollarSign, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Devoluciones</h1><p className="text-muted-foreground text-sm">{returns.length} devoluciones registradas</p></div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nueva Devolución</span><span className="sm:hidden">Nueva</span></Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-3 md:p-4 flex items-center gap-3">
              <div className={`p-2 rounded-xl ${s.bg} shrink-0`}><s.icon className={`w-4 h-4 md:w-5 md:h-5 ${s.color}`} /></div>
              <div><div className={`text-lg md:text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-[10px] md:text-xs text-muted-foreground leading-tight">{s.label}</div></div>
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
            {Object.entries(RETURN_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {filtered.map(ret => (
          <div
            key={ret.id}
            className="p-4 rounded-xl border border-border bg-card cursor-pointer active:bg-muted/50 transition-colors"
            onClick={() => setDetailReturn(ret)}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-blue-600 text-sm font-semibold">{ret.number}</span>
                <div className="font-medium mt-0.5">{ret.customerName}</div>
                <div className="text-xs text-muted-foreground truncate max-w-48">{ret.product}</div>
              </div>
              <Badge variant="outline" className={`text-xs shrink-0 ${RETURN_STATUS_COLORS[ret.status]}`}>{RETURN_STATUS_LABELS[ret.status]}</Badge>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <span className="font-bold text-red-600">${ret.amount.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground ml-2">{ret.reason}</span>
              </div>
              <span className="text-xs text-muted-foreground">{ret.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left p-4 font-medium">Devolución</th>
              <th className="text-left p-4 font-medium">Cliente</th>
              <th className="text-left p-4 font-medium">Producto</th>
              <th className="text-left p-4 font-medium">Venta</th>
              <th className="text-left p-4 font-medium">Motivo</th>
              <th className="text-right p-4 font-medium">Monto</th>
              <th className="text-left p-4 font-medium">Estado</th>
              <th className="text-left p-4 font-medium">Responsable</th>
              <th className="text-left p-4 font-medium">Fecha</th>
              <th className="text-right p-4 font-medium">Acciones</th>
            </tr></thead>
            <tbody>
              {filtered.map(ret => (
                <motion.tr key={ret.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b hover:bg-muted/30 transition-colors group">
                  <td className="p-4 font-mono font-medium text-blue-600">{ret.number}</td>
                  <td className="p-4 font-medium">{ret.customerName}</td>
                  <td className="p-4 text-xs text-muted-foreground max-w-28 truncate">{ret.product}</td>
                  <td className="p-4 font-mono text-xs">{ret.saleNumber}</td>
                  <td className="p-4 text-xs text-muted-foreground">{ret.reason}</td>
                  <td className="p-4 text-right font-bold text-red-600">${ret.amount.toLocaleString()}</td>
                  <td className="p-4"><Badge variant="outline" className={`text-xs ${RETURN_STATUS_COLORS[ret.status]}`}>{RETURN_STATUS_LABELS[ret.status]}</Badge></td>
                  <td className="p-4 text-xs text-muted-foreground">{ret.responsible || "Sin asignar"}</td>
                  <td className="p-4 text-xs text-muted-foreground">{ret.date}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setDetailReturn(ret)}><Eye className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {detailReturn && (
        <Dialog open={!!detailReturn} onOpenChange={() => setDetailReturn(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{detailReturn.number}</span>
                <Badge variant="outline" className={RETURN_STATUS_COLORS[detailReturn.status]}>{RETURN_STATUS_LABELS[detailReturn.status]}</Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Cliente: </span><span className="font-medium">{detailReturn.customerName}</span></div>
                <div><span className="text-muted-foreground">Venta: </span><span className="font-mono">{detailReturn.saleNumber}</span></div>
                <div><span className="text-muted-foreground">Producto: </span><span>{detailReturn.product}</span></div>
                <div><span className="text-muted-foreground">Monto: </span><span className="font-bold text-red-600">${detailReturn.amount.toLocaleString()}</span></div>
                <div><span className="text-muted-foreground">Motivo: </span><span>{detailReturn.reason}</span></div>
                <div><span className="text-muted-foreground">Fecha: </span><span>{detailReturn.date}</span></div>
              </div>
              {detailReturn.notes && <div className="bg-muted/50 p-3 rounded-lg text-sm">{detailReturn.notes}</div>}
              <Separator />
              {detailReturn.comments.length > 0 && (
                <div>
                  <div className="font-medium text-sm mb-2">Comentarios internos</div>
                  {detailReturn.comments.map((c, i) => (
                    <div key={i} className="bg-blue-50 border border-blue-100 rounded p-2 text-sm mb-2">{c}</div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Agregar comentario interno..." className="flex-1" />
                <Button size="sm" onClick={addComment} disabled={!newComment.trim()}>Agregar</Button>
              </div>
            </div>
            <DialogFooter className="gap-2">
              {detailReturn.status === "PENDING" && (
                <>
                  <Button variant="outline" className="gap-2 text-red-600 border-red-200" onClick={() => updateStatus(detailReturn.id, "REJECTED")}><X className="w-4 h-4" />Rechazar</Button>
                  <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => updateStatus(detailReturn.id, "APPROVED")}><Check className="w-4 h-4" />Aprobar</Button>
                </>
              )}
              {detailReturn.status === "APPROVED" && (
                <Button className="gap-2" onClick={() => updateStatus(detailReturn.id, "COMPLETED")}><RotateCcw className="w-4 h-4" />Marcar completado</Button>
              )}
              {(detailReturn.status === "REJECTED" || detailReturn.status === "COMPLETED") && (
                <Button variant="outline" onClick={() => setDetailReturn(null)}>Cerrar</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Nueva Devolución</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Venta relacionada</label>
              <Select value={form.saleNumber} onValueChange={v => setForm(f => ({ ...f, saleNumber: v, product: "" }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar venta" /></SelectTrigger>
                <SelectContent>{SALES_REF.map(s => <SelectItem key={s.number} value={s.number}>{s.number} — {s.customer}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {form.saleNumber && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Producto a devolver</label>
                <Select value={form.product} onValueChange={v => setForm(f => ({ ...f, product: v }))}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar producto" /></SelectTrigger>
                  <SelectContent>{SALES_REF.find(s => s.number === form.saleNumber)?.products.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium">Motivo</label>
              <Select value={form.reason} onValueChange={v => setForm(f => ({ ...f, reason: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar motivo" /></SelectTrigger>
                <SelectContent>{RETURN_REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium">Monto a devolver</label><Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" /></div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Responsable</label>
              <Select value={form.responsible} onValueChange={v => setForm(f => ({ ...f, responsible: v }))}>
                <SelectTrigger><SelectValue placeholder="Asignar responsable" /></SelectTrigger>
                <SelectContent>{SELLERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><label className="text-sm font-medium">Notas</label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Detalles adicionales..." rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={saveReturn} disabled={!form.saleNumber || !form.reason}><RotateCcw className="w-4 h-4 mr-2" />Crear devolución</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
