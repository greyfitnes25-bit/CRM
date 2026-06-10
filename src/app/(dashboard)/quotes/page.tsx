"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Eye, Edit2, Send, FileText, Check, Trash2, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { QUOTE_STATUS_COLORS, QUOTE_STATUS_LABELS } from "@/lib/constants";

interface QuoteItem { productId: string; productName: string; quantity: number; price: number; total: number; }
interface Quote {
  id: string; number: string; customerId: string; customerName: string;
  items: QuoteItem[]; subtotal: number; discount: number; tax: number; total: number;
  status: string; notes: string; date: string;
}

const CUSTOMERS = [
  { id: "c1", name: "María González" }, { id: "c2", name: "Carlos Rodríguez" },
  { id: "c3", name: "Roberto Silva" }, { id: "c4", name: "Fernando López" },
  { id: "c5", name: "Daniela Moreno" }, { id: "c6", name: "Isabel Castro" },
];

const PRODUCTS = [
  { id: "p1", name: "Kit Cámaras Básico 4CH", price: 4500 },
  { id: "p2", name: "Kit Cámaras Profesional 8CH", price: 8900 },
  { id: "p3", name: "Kit Cámaras Premium 16CH 4K", price: 15000 },
  { id: "p4", name: "Alarma Residencial Básica", price: 3200 },
  { id: "p5", name: "Sistema Alarma Empresarial", price: 7500 },
  { id: "p6", name: "Instalación Básica", price: 800 },
  { id: "p7", name: "Mantenimiento Anual", price: 1200 },
];

const INITIAL_QUOTES: Quote[] = [
  { id: "q1", number: "COT-0001", customerId: "c1", customerName: "María González", items: [{ productId: "p2", productName: "Kit Cámaras Profesional 8CH", quantity: 1, price: 8900, total: 8900 }, { productId: "p6", productName: "Instalación Básica", quantity: 1, price: 800, total: 800 }], subtotal: 9700, discount: 5, tax: 16, total: 9518.4, status: "SENT", notes: "Cliente interesada en instalación el viernes.", date: "2026-06-05" },
  { id: "q2", number: "COT-0002", customerId: "c2", customerName: "Carlos Rodríguez", items: [{ productId: "p3", productName: "Kit Cámaras Premium 16CH 4K", quantity: 1, price: 15000, total: 15000 }, { productId: "p6", productName: "Instalación Básica", quantity: 2, price: 800, total: 1600 }], subtotal: 16600, discount: 10, tax: 16, total: 17318.4, status: "ACCEPTED", notes: "Descuento especial para cliente empresa.", date: "2026-06-03" },
  { id: "q3", number: "COT-0003", customerId: "c3", customerName: "Roberto Silva", items: [{ productId: "p4", productName: "Alarma Residencial Básica", quantity: 1, price: 3200, total: 3200 }], subtotal: 3200, discount: 0, tax: 16, total: 3712, status: "DRAFT", notes: "", date: "2026-06-08" },
  { id: "q4", number: "COT-0004", customerId: "c4", customerName: "Fernando López", items: [{ productId: "p3", productName: "Kit Cámaras Premium 16CH 4K", quantity: 1, price: 15000, total: 15000 }, { productId: "p5", productName: "Sistema Alarma Empresarial", quantity: 1, price: 7500, total: 7500 }, { productId: "p6", productName: "Instalación Básica", quantity: 3, price: 800, total: 2400 }], subtotal: 24900, discount: 15, tax: 16, total: 24485.04, status: "REJECTED", notes: "Cliente solicitó más tiempo para decidir.", date: "2026-05-28" },
  { id: "q5", number: "COT-0005", customerId: "c5", customerName: "Daniela Moreno", items: [{ productId: "p2", productName: "Kit Cámaras Profesional 8CH", quantity: 1, price: 8900, total: 8900 }], subtotal: 8900, discount: 0, tax: 16, total: 10324, status: "SENT", notes: "Espera financiamiento aprobado.", date: "2026-06-07" },
  { id: "q6", number: "COT-0006", customerId: "c6", customerName: "Isabel Castro", items: [{ productId: "p2", productName: "Kit Cámaras Profesional 8CH", quantity: 1, price: 8900, total: 8900 }, { productId: "p7", productName: "Mantenimiento Anual", quantity: 1, price: 1200, total: 1200 }], subtotal: 10100, discount: 5, tax: 16, total: 11796, status: "ACCEPTED", notes: "Venta confirmada. Agendar instalación.", date: "2026-06-01" },
];

const calcTotals = (items: QuoteItem[], discount: number, tax: number) => {
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const discountAmt = subtotal * (discount / 100);
  const taxAmt = (subtotal - discountAmt) * (tax / 100);
  const total = subtotal - discountAmt + taxAmt;
  return { subtotal, total };
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [detailQuote, setDetailQuote] = useState<Quote | null>(null);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const [bCustomerId, setBCustomerId] = useState("");
  const [bItems, setBItems] = useState<QuoteItem[]>([]);
  const [bDiscount, setBDiscount] = useState(0);
  const [bTax, setBTax] = useState(16);
  const [bNotes, setBNotes] = useState("");
  const [bStatus, setBStatus] = useState("DRAFT");
  const [bProductId, setBProductId] = useState("");
  const [bQty, setBQty] = useState(1);

  const filtered = quotes.filter(q => {
    const matchSearch = q.customerName.toLowerCase().includes(search.toLowerCase()) || q.number.includes(search);
    const matchStatus = statusFilter === "ALL" || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCreate = () => {
    setEditingQuote(null);
    setBCustomerId(""); setBItems([]); setBDiscount(0); setBTax(16); setBNotes(""); setBStatus("DRAFT");
    setBuilderOpen(true);
  };

  const openEdit = (q: Quote) => {
    setEditingQuote(q);
    setBCustomerId(q.customerId); setBItems([...q.items]); setBDiscount(q.discount); setBTax(q.tax); setBNotes(q.notes); setBStatus(q.status);
    setBuilderOpen(true);
  };

  const addItem = () => {
    const prod = PRODUCTS.find(p => p.id === bProductId);
    if (!prod) return;
    setBItems(prev => [...prev, { productId: prod.id, productName: prod.name, quantity: bQty, price: prod.price, total: prod.price * bQty }]);
    setBProductId(""); setBQty(1);
  };

  const removeItem = (i: number) => setBItems(prev => prev.filter((_, idx) => idx !== i));

  const saveQuote = (status: string) => {
    const customer = CUSTOMERS.find(c => c.id === bCustomerId);
    if (!customer) return;
    const { subtotal, total } = calcTotals(bItems, bDiscount, bTax);
    if (editingQuote) {
      setQuotes(prev => prev.map(q => q.id === editingQuote.id ? { ...q, customerId: bCustomerId, customerName: customer.name, items: bItems, subtotal, discount: bDiscount, tax: bTax, total, notes: bNotes, status } : q));
    } else {
      const newQ: Quote = { id: `q${Date.now()}`, number: `COT-${String(quotes.length + 1).padStart(4, "0")}`, customerId: bCustomerId, customerName: customer.name, items: bItems, subtotal, discount: bDiscount, tax: bTax, total, notes: bNotes, status, date: new Date().toISOString().split("T")[0] };
      setQuotes(prev => [newQ, ...prev]);
    }
    setBuilderOpen(false);
  };

  const { subtotal: previewSubtotal, total: previewTotal } = calcTotals(bItems, bDiscount, bTax);

  if (detailQuote) {
    return (
      <div className="space-y-6 p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setDetailQuote(null)} className="gap-2"><ArrowLeft className="w-4 h-4" /> Volver</Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2"><Printer className="w-4 h-4" /> Imprimir</Button>
            {detailQuote.status === "ACCEPTED" && <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700"><Check className="w-4 h-4" /> Convertir a Venta</Button>}
          </div>
        </div>
        <Card className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-2xl font-bold text-blue-600">GreyCRM</div>
              <div className="text-sm text-muted-foreground mt-1">Sistema de Seguridad</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{detailQuote.number}</div>
              <div className="text-sm text-muted-foreground">Fecha: {detailQuote.date}</div>
              <Badge className={`mt-2 ${QUOTE_STATUS_COLORS[detailQuote.status]}`}>{QUOTE_STATUS_LABELS[detailQuote.status]}</Badge>
            </div>
          </div>
          <div className="mb-8">
            <div className="text-sm font-medium text-muted-foreground mb-1">CLIENTE</div>
            <div className="font-semibold text-lg">{detailQuote.customerName}</div>
          </div>
          <table className="w-full text-sm mb-6">
            <thead><tr className="border-b"><th className="text-left py-2 font-medium">Producto</th><th className="text-right py-2 font-medium">Cant.</th><th className="text-right py-2 font-medium">Precio unit.</th><th className="text-right py-2 font-medium">Total</th></tr></thead>
            <tbody>
              {detailQuote.items.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3">{item.productName}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">${item.price.toLocaleString()}</td>
                  <td className="py-3 text-right font-medium">${item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>${detailQuote.subtotal.toLocaleString()}</span></div>
              {detailQuote.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Descuento ({detailQuote.discount}%)</span><span>-${(detailQuote.subtotal * detailQuote.discount / 100).toLocaleString()}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">IVA ({detailQuote.tax}%)</span><span>${((detailQuote.subtotal * (1 - detailQuote.discount / 100)) * detailQuote.tax / 100).toFixed(2)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-green-600">${detailQuote.total.toLocaleString()}</span></div>
            </div>
          </div>
          {detailQuote.notes && <div className="mt-6 p-4 bg-muted/50 rounded-lg"><div className="text-xs font-medium text-muted-foreground mb-1">NOTAS</div><div className="text-sm">{detailQuote.notes}</div></div>}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Cotizaciones</h1><p className="text-muted-foreground text-sm">{quotes.length} cotizaciones en total</p></div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nueva Cotización</span><span className="sm:hidden">Nueva</span></Button>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 md:w-44"><SelectValue placeholder="Estado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            {Object.entries(QUOTE_STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {filtered.map(quote => (
          <div key={quote.id} className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono font-semibold text-blue-600 text-sm">{quote.number}</span>
                <div className="font-medium mt-0.5">{quote.customerName}</div>
                <div className="text-xs text-muted-foreground">{quote.items.length} producto{quote.items.length !== 1 ? "s" : ""}</div>
              </div>
              <Badge variant="outline" className={`text-xs shrink-0 ${QUOTE_STATUS_COLORS[quote.status]}`}>{QUOTE_STATUS_LABELS[quote.status]}</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-lg font-bold">${quote.total.toLocaleString()}</span>
                {quote.discount > 0 && <span className="text-xs text-green-600 ml-2">{quote.discount}% desc.</span>}
              </div>
              <span className="text-xs text-muted-foreground">{quote.date}</span>
            </div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1" onClick={() => setDetailQuote(quote)}><Eye className="w-3 h-3" /> Ver</Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1" onClick={() => openEdit(quote)}><Edit2 className="w-3 h-3" /> Editar</Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1 text-blue-600 border-blue-200"><Send className="w-3 h-3" /> Enviar</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left p-4 font-medium">Cotización</th>
              <th className="text-left p-4 font-medium">Cliente</th>
              <th className="text-left p-4 font-medium">Productos</th>
              <th className="text-right p-4 font-medium">Subtotal</th>
              <th className="text-right p-4 font-medium">Desc.</th>
              <th className="text-right p-4 font-medium">Total</th>
              <th className="text-left p-4 font-medium">Estado</th>
              <th className="text-left p-4 font-medium">Fecha</th>
              <th className="text-right p-4 font-medium">Acciones</th>
            </tr></thead>
            <tbody>
              {filtered.map(quote => (
                <motion.tr key={quote.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b hover:bg-muted/30 transition-colors group">
                  <td className="p-4 font-mono font-medium text-blue-600">{quote.number}</td>
                  <td className="p-4 font-medium">{quote.customerName}</td>
                  <td className="p-4 text-muted-foreground">{quote.items.length} producto{quote.items.length !== 1 ? "s" : ""}</td>
                  <td className="p-4 text-right">${quote.subtotal.toLocaleString()}</td>
                  <td className="p-4 text-right text-green-600">{quote.discount > 0 ? `${quote.discount}%` : "—"}</td>
                  <td className="p-4 text-right font-bold">${quote.total.toLocaleString()}</td>
                  <td className="p-4"><Badge variant="outline" className={`text-xs ${QUOTE_STATUS_COLORS[quote.status]}`}>{QUOTE_STATUS_LABELS[quote.status]}</Badge></td>
                  <td className="p-4 text-muted-foreground text-xs">{quote.date}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setDetailQuote(quote)}><Eye className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openEdit(quote)}><Edit2 className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600"><Send className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="max-w-lg w-full mx-4 md:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />{editingQuote ? `Editar ${editingQuote.number}` : "Nueva Cotización"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Cliente *</label>
              <Select value={bCustomerId} onValueChange={setBCustomerId}>
                <SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                <SelectContent>{CUSTOMERS.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Agregar productos</label>
              <div className="flex gap-2">
                <Select value={bProductId} onValueChange={setBProductId}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Seleccionar producto" /></SelectTrigger>
                  <SelectContent>{PRODUCTS.map(p => <SelectItem key={p.id} value={p.id}>{p.name} — ${p.price.toLocaleString()}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" value={bQty} onChange={e => setBQty(parseInt(e.target.value) || 1)} min={1} className="w-20" />
                <Button onClick={addItem} disabled={!bProductId}><Plus className="w-4 h-4" /></Button>
              </div>
            </div>
            {bItems.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/50 border-b"><th className="text-left p-3 font-medium">Producto</th><th className="text-right p-3 font-medium">Cant.</th><th className="text-right p-3 font-medium">Precio</th><th className="text-right p-3 font-medium">Total</th><th className="p-3"></th></tr></thead>
                  <tbody>
                    {bItems.map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-3">{item.productName}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">${item.price.toLocaleString()}</td>
                        <td className="p-3 text-right font-medium">${item.total.toLocaleString()}</td>
                        <td className="p-3"><Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500" onClick={() => removeItem(i)}><Trash2 className="w-3 h-3" /></Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-sm font-medium">Descuento %</label><Input type="number" value={bDiscount} onChange={e => setBDiscount(parseFloat(e.target.value) || 0)} min={0} max={100} /></div>
              <div className="space-y-1"><label className="text-sm font-medium">IVA %</label><Input type="number" value={bTax} onChange={e => setBTax(parseFloat(e.target.value) || 0)} min={0} max={100} /></div>
            </div>
            {bItems.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>${previewSubtotal.toLocaleString()}</span></div>
                {bDiscount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Descuento ({bDiscount}%)</span><span>-${(previewSubtotal * bDiscount / 100).toFixed(2)}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">IVA ({bTax}%)</span><span>${((previewSubtotal * (1 - bDiscount / 100)) * bTax / 100).toFixed(2)}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-green-600">${previewTotal.toLocaleString()}</span></div>
              </div>
            )}
            <div className="space-y-1"><label className="text-sm font-medium">Notas</label><Textarea value={bNotes} onChange={e => setBNotes(e.target.value)} placeholder="Notas adicionales para el cliente..." rows={2} /></div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setBuilderOpen(false)}>Cancelar</Button>
            <Button variant="outline" onClick={() => saveQuote("DRAFT")} disabled={!bCustomerId || bItems.length === 0}>Guardar Borrador</Button>
            <Button onClick={() => saveQuote("SENT")} disabled={!bCustomerId || bItems.length === 0} className="gap-2"><Send className="w-4 h-4" />Enviar Cotización</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
