"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Eye, CreditCard, DollarSign, TrendingUp, Clock, Check, Printer, Target, WalletCards, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SALE_STATUS_COLORS, SALE_STATUS_LABELS } from "@/lib/constants";

interface Payment { amount: number; method: string; date: string; }
interface Sale {
  id: string; number: string; customerName: string;
  products: string[]; total: number; paid: number; status: string;
  paymentMethod: string; seller: string; date: string; payments: Payment[];
}

const INITIAL_SALES: Sale[] = [
  { id: "s1", number: "VTA-0001", customerName: "Carlos Rodríguez", products: ["Kit Cámaras Premium 16CH 4K", "Instalación Básica x2"], total: 17318, paid: 17318, status: "PAID", paymentMethod: "Transferencia", seller: "Ana García", date: "2026-06-04", payments: [{ amount: 17318, method: "Transferencia", date: "2026-06-04" }] },
  { id: "s2", number: "VTA-0002", customerName: "Isabel Castro", products: ["Kit Cámaras Profesional 8CH", "Mantenimiento Anual"], total: 11796, paid: 11796, status: "PAID", paymentMethod: "Efectivo", seller: "Ana García", date: "2026-06-02", payments: [{ amount: 11796, method: "Efectivo", date: "2026-06-02" }] },
  { id: "s3", number: "VTA-0003", customerName: "María González", products: ["Kit Cámaras Profesional 8CH", "Instalación Básica"], total: 9518, paid: 5000, status: "PARTIAL", paymentMethod: "Tarjeta", seller: "Juan Pérez", date: "2026-06-06", payments: [{ amount: 5000, method: "Tarjeta", date: "2026-06-06" }] },
  { id: "s4", number: "VTA-0004", customerName: "Fernando López", products: ["Kit Cámaras Básico 4CH"], total: 4500, paid: 0, status: "PENDING", paymentMethod: "—", seller: "Juan Pérez", date: "2026-06-08", payments: [] },
  { id: "s5", number: "VTA-0005", customerName: "Roberto Silva", products: ["Alarma Residencial Básica", "Instalación Básica"], total: 4512, paid: 4512, status: "PAID", paymentMethod: "Efectivo", seller: "Juan Pérez", date: "2026-05-30", payments: [{ amount: 4512, method: "Efectivo", date: "2026-05-30" }] },
  { id: "s6", number: "VTA-0006", customerName: "Daniela Moreno", products: ["Kit Cámaras Profesional 8CH"], total: 10324, paid: 3000, status: "PARTIAL", paymentMethod: "Crédito", seller: "Ana García", date: "2026-06-09", payments: [{ amount: 3000, method: "Crédito", date: "2026-06-09" }] },
  { id: "s7", number: "VTA-0007", customerName: "Eduardo Vargas", products: ["Kit Cámaras Básico 4CH", "Sensor de Movimiento PIR x2"], total: 5400, paid: 5400, status: "PAID", paymentMethod: "Efectivo", seller: "Luis Martínez", date: "2026-05-25", payments: [{ amount: 5400, method: "Efectivo", date: "2026-05-25" }] },
  { id: "s8", number: "VTA-0008", customerName: "Alejandro Ruiz", products: ["Alarma Residencial Básica"], total: 3712, paid: 0, status: "PENDING", paymentMethod: "—", seller: "Juan Pérez", date: "2026-06-10", payments: [] },
];

const PAYMENT_METHODS = ["Efectivo", "Transferencia", "Tarjeta", "Crédito"];

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [detailSale, setDetailSale] = useState<Sale | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Efectivo");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/sales", { cache: "no-store" });
      if (!response.ok) throw new Error("No se pudieron cargar las ventas");
      const data = await response.json();
      setSales(data);
    } catch (err) {
      console.error(err);
      setError("Mostrando ventas de demo: no se pudo conectar con la base de datos.");
      setSales(INITIAL_SALES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const filtered = sales.filter(s => {
    const matchSearch = s.customerName.toLowerCase().includes(search.toLowerCase()) || s.number.includes(search);
    const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = sales.filter(s => s.status === "PAID").reduce((sum, s) => sum + s.total, 0);
  const totalPending = sales.reduce((sum, s) => sum + (s.total - s.paid), 0);
  const avgTicket = sales.length > 0 ? Math.round(sales.reduce((sum, s) => sum + s.total, 0) / sales.length) : 0;
  const thisMonthSales = sales.filter(s => s.date.startsWith("2026-06")).length;

  const addPayment = async () => {
    if (!detailSale) return;
    const amount = parseFloat(payAmount);
    if (!amount) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/sales/${detailSale.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentAmount: amount, paymentMethod: payMethod }),
      });
      if (!response.ok) throw new Error("No se pudo registrar el pago");
      const updated = await response.json();
      setSales(prev => prev.map(s => s.id === updated.id ? updated : s));
      setDetailSale(updated);
      setPaymentDialogOpen(false);
      setPayAmount("");
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar el pago.");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const stats = [
    { label: "Ventas este mes", value: thisMonthSales, icon: Target, color: "text-blue-500", iconBg: "bg-blue-500/15", border: "border-blue-500/30", bg: "bg-gradient-to-br from-blue-500/10 via-card to-sky-500/5", action: () => { setStatusFilter("ALL"); showToast("Mostrando ventas del mes"); } },
    { label: "Ingresos totales", value: `$${totalRevenue.toLocaleString()}`, icon: Banknote, color: "text-emerald-500", iconBg: "bg-emerald-500/15", border: "border-emerald-500/30", bg: "bg-gradient-to-br from-emerald-500/10 via-card to-green-500/5", action: () => { setStatusFilter("PAID"); showToast("Filtro aplicado: ventas pagadas"); } },
    { label: "Pagos pendientes", value: `$${totalPending.toLocaleString()}`, icon: Clock, color: "text-orange-500", iconBg: "bg-orange-500/15", border: "border-orange-500/30", bg: "bg-gradient-to-br from-orange-500/10 via-card to-amber-500/5", action: () => { setStatusFilter("PENDING"); showToast("Filtro aplicado: pagos pendientes"); } },
    { label: "Ticket promedio", value: `$${avgTicket.toLocaleString()}`, icon: WalletCards, color: "text-purple-500", iconBg: "bg-purple-500/15", border: "border-purple-500/30", bg: "bg-gradient-to-br from-purple-500/10 via-card to-fuchsia-500/5", action: () => showToast("Ticket promedio calculado con las ventas visibles") },
  ];

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Ventas</h1><p className="text-muted-foreground text-sm">{loading ? "Cargando ventas..." : `${sales.length} ventas registradas`}</p></div>
        <Button className="gap-2" onClick={() => showToast("Nueva venta: el formulario completo sera conectado en la siguiente fase.")}><Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nueva Venta</span><span className="sm:hidden">Nueva</span></Button>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {error}
        </div>
      )}

      {toast && (
        <div className="fixed right-4 top-20 z-50 rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(stat => (
          <Card
            key={stat.label}
            role="button"
            tabIndex={0}
            onClick={stat.action}
            onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") stat.action(); }}
            className={`cursor-pointer border transition hover:-translate-y-0.5 hover:shadow-lg ${stat.border} ${stat.bg}`}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-3 rounded-xl ${stat.iconBg} shrink-0 ring-1 ring-white/10`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
              <div><div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div><div className="text-xs text-muted-foreground mt-0.5 leading-tight">{stat.label}</div></div>
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
            {Object.entries(SALE_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {filtered.map(sale => (
          <div
            key={sale.id}
            className="p-4 rounded-xl border border-border bg-card cursor-pointer active:bg-muted/50 transition-colors"
            onClick={() => setDetailSale(sale)}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono font-semibold text-blue-600 text-sm">{sale.number}</span>
                <div className="font-medium mt-0.5">{sale.customerName}</div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-48">{sale.products[0]}{sale.products.length > 1 && ` +${sale.products.length - 1}`}</div>
              </div>
              <Badge variant="outline" className={`text-xs shrink-0 ${SALE_STATUS_COLORS[sale.status]}`}>{SALE_STATUS_LABELS[sale.status]}</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-lg font-bold">${sale.total.toLocaleString()}</span>
                {sale.total - sale.paid > 0 && <span className="text-xs text-orange-600 ml-2">Pendiente: ${(sale.total - sale.paid).toLocaleString()}</span>}
              </div>
              <span className="text-xs text-muted-foreground">{sale.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left p-4 font-medium">Venta</th>
              <th className="text-left p-4 font-medium">Cliente</th>
              <th className="text-left p-4 font-medium">Productos</th>
              <th className="text-right p-4 font-medium">Total</th>
              <th className="text-right p-4 font-medium">Pagado</th>
              <th className="text-right p-4 font-medium">Pendiente</th>
              <th className="text-left p-4 font-medium">Método</th>
              <th className="text-left p-4 font-medium">Estado</th>
              <th className="text-left p-4 font-medium">Vendedor</th>
              <th className="text-left p-4 font-medium">Fecha</th>
              <th className="text-right p-4 font-medium">Acciones</th>
            </tr></thead>
            <tbody>
              {filtered.map(sale => (
                <motion.tr key={sale.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b hover:bg-muted/30 transition-colors group">
                  <td className="p-4 font-mono font-medium text-blue-600">{sale.number}</td>
                  <td className="p-4 font-medium">{sale.customerName}</td>
                  <td className="p-4 text-muted-foreground text-xs max-w-32 truncate">{sale.products[0]}{sale.products.length > 1 && <span className="ml-1">+{sale.products.length - 1}</span>}</td>
                  <td className="p-4 text-right font-bold">${sale.total.toLocaleString()}</td>
                  <td className="p-4 text-right text-green-600">${sale.paid.toLocaleString()}</td>
                  <td className="p-4 text-right text-orange-600">${(sale.total - sale.paid).toLocaleString()}</td>
                  <td className="p-4 text-muted-foreground text-xs">{sale.paymentMethod}</td>
                  <td className="p-4"><Badge variant="outline" className={`text-xs ${SALE_STATUS_COLORS[sale.status]}`}>{SALE_STATUS_LABELS[sale.status]}</Badge></td>
                  <td className="p-4 text-muted-foreground text-xs">{sale.seller}</td>
                  <td className="p-4 text-muted-foreground text-xs">{sale.date}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setDetailSale(sale)}><Eye className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {detailSale && (
        <Dialog open={!!detailSale} onOpenChange={() => setDetailSale(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{detailSale.number}</span>
                <Badge variant="outline" className={SALE_STATUS_COLORS[detailSale.status]}>{SALE_STATUS_LABELS[detailSale.status]}</Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Cliente: </span><span className="font-medium">{detailSale.customerName}</span></div>
                <div><span className="text-muted-foreground">Fecha: </span><span>{detailSale.date}</span></div>
                <div><span className="text-muted-foreground">Vendedor: </span><span>{detailSale.seller}</span></div>
              </div>
              <Separator />
              <div>
                <div className="font-medium mb-2">Productos</div>
                {detailSale.products.map((p, i) => <div key={i} className="text-sm py-1 border-b last:border-0">{p}</div>)}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total</span><span className="font-bold">${detailSale.total.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm text-green-600"><span>Pagado</span><span>${detailSale.paid.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm text-orange-600 font-medium"><span>Pendiente</span><span>${(detailSale.total - detailSale.paid).toLocaleString()}</span></div>
              </div>
              {detailSale.payments.length > 0 && (
                <div>
                  <div className="font-medium mb-2 text-sm">Historial de pagos</div>
                  {detailSale.payments.map((p, i) => (
                    <div key={i} className="flex justify-between text-sm py-1.5 border-b last:border-0">
                      <span className="text-muted-foreground">{p.date} — {p.method}</span>
                      <span className="font-medium text-green-600">${p.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" className="gap-2"><Printer className="w-4 h-4" />Recibo</Button>
              {detailSale.status !== "PAID" && (
                <Button size="sm" className="gap-2" onClick={() => setPaymentDialogOpen(true)}>
                  <Plus className="w-4 h-4" /> Registrar Pago
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Registrar Pago</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1"><label className="text-sm font-medium">Monto</label><Input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder="0.00" /></div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Método de pago</label>
              <Select value={payMethod} onValueChange={setPayMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Cancelar</Button>
            <Button onClick={addPayment} disabled={!payAmount || saving}><Check className="w-4 h-4 mr-2" />{saving ? "Guardando..." : "Confirmar pago"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
