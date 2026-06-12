"use client";

import { useState, useMemo } from "react";
import {
  Search, Plus, Minus, Package, AlertTriangle, TrendingDown,
  ArrowUpCircle, ArrowDownCircle, RefreshCw, Download, Filter,
  ChevronRight, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  image?: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPrice: number;
  salePrice: number;
  location: string;
  lastMovement: string;
}

interface StockMovement {
  id: string;
  type: "ENTRY" | "EXIT" | "ADJUSTMENT" | "TRANSFER";
  productId: string;
  productName: string;
  quantity: number;
  reason: string;
  reference: string;
  performedBy: string;
  date: string;
  notes: string;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "inv1", productId: "p1", productName: "Kit Camaras Basico 4CH", sku: "CAM-4CH-001", category: "Seguridad", currentStock: 8, minStock: 3, maxStock: 20, unit: "kits", costPrice: 3200, salePrice: 4500, location: "Almacen A - Estante 1", lastMovement: "2026-06-08" },
  { id: "inv2", productId: "p2", productName: "Kit Camaras Profesional 8CH", sku: "CAM-8CH-002", category: "Seguridad", currentStock: 5, minStock: 3, maxStock: 15, unit: "kits", costPrice: 6500, salePrice: 8900, location: "Almacen A - Estante 2", lastMovement: "2026-06-09" },
  { id: "inv3", productId: "p3", productName: "Kit Camaras Premium 16CH 4K", sku: "CAM-16CH-003", category: "Seguridad", currentStock: 2, minStock: 2, maxStock: 10, unit: "kits", costPrice: 11000, salePrice: 15000, location: "Almacen A - Estante 2", lastMovement: "2026-06-07" },
  { id: "inv4", productId: "p4", productName: "Alarma Residencial Basica", sku: "ALA-RES-001", category: "Alarmas", currentStock: 12, minStock: 5, maxStock: 30, unit: "piezas", costPrice: 2200, salePrice: 3200, location: "Almacen B - Estante 1", lastMovement: "2026-06-05" },
  { id: "inv5", productId: "p5", productName: "Sistema Alarma Empresarial", sku: "ALA-EMP-002", category: "Alarmas", currentStock: 3, minStock: 2, maxStock: 10, unit: "piezas", costPrice: 5500, salePrice: 7500, location: "Almacen B - Estante 2", lastMovement: "2026-06-03" },
  { id: "inv6", productId: "p6", productName: "Sensor de Movimiento", sku: "SEN-MOV-001", category: "Accesorios", currentStock: 45, minStock: 10, maxStock: 100, unit: "piezas", costPrice: 180, salePrice: 350, location: "Almacen C - Cajones", lastMovement: "2026-06-10" },
  { id: "inv7", productId: "p7", productName: "Camara IP Exterior 2MP", sku: "CAM-IP-001", category: "Seguridad", currentStock: 18, minStock: 8, maxStock: 40, unit: "piezas", costPrice: 450, salePrice: 750, location: "Almacen A - Estante 3", lastMovement: "2026-06-06" },
  { id: "inv8", productId: "p8", productName: "DVR 8 Canales", sku: "DVR-8CH-001", category: "Equipos", currentStock: 7, minStock: 3, maxStock: 15, unit: "piezas", costPrice: 1800, salePrice: 2800, location: "Almacen A - Estante 4", lastMovement: "2026-06-04" },
  { id: "inv9", productId: "p9", productName: "NVR IP 8 Puertos", sku: "NVR-8P-001", category: "Equipos", currentStock: 4, minStock: 2, maxStock: 10, unit: "piezas", costPrice: 2200, salePrice: 3500, location: "Almacen A - Estante 4", lastMovement: "2026-06-02" },
  { id: "inv10", productId: "p10", productName: "Cable Coaxial RG59 (100m)", sku: "CAB-RG59-001", category: "Accesorios", currentStock: 15, minStock: 5, maxStock: 50, unit: "rollos", costPrice: 320, salePrice: 580, location: "Almacen C - Bodega", lastMovement: "2026-06-01" },
  { id: "inv11", productId: "p11", productName: "Fuente de Poder 12V", sku: "FUE-12V-001", category: "Accesorios", currentStock: 22, minStock: 8, maxStock: 60, unit: "piezas", costPrice: 120, salePrice: 220, location: "Almacen C - Cajones", lastMovement: "2026-05-30" },
  { id: "inv12", productId: "p12", productName: "Bracket para Camara", sku: "BRA-CAM-001", category: "Accesorios", currentStock: 0, minStock: 5, maxStock: 40, unit: "piezas", costPrice: 80, salePrice: 150, location: "Almacen C - Cajones", lastMovement: "2026-05-28" },
];

const INITIAL_MOVEMENTS: StockMovement[] = [
  { id: "m1", type: "ENTRY", productId: "p6", productName: "Sensor de Movimiento", quantity: 20, reason: "Compra a proveedor", reference: "OC-2026-041", performedBy: "Ana Garcia", date: "2026-06-10", notes: "Proveedor ElectroMex" },
  { id: "m2", type: "EXIT", productId: "p2", productName: "Kit Camaras Profesional 8CH", quantity: -2, reason: "Venta", reference: "VTA-0003", performedBy: "Juan Perez", date: "2026-06-09", notes: "" },
  { id: "m3", type: "EXIT", productId: "p2", productName: "Kit Camaras Profesional 8CH", quantity: -1, reason: "Venta", reference: "VTA-0006", performedBy: "Ana Garcia", date: "2026-06-09", notes: "" },
  { id: "m4", type: "ENTRY", productId: "p1", productName: "Kit Camaras Basico 4CH", quantity: 5, reason: "Compra a proveedor", reference: "OC-2026-040", performedBy: "Ana Garcia", date: "2026-06-08", notes: "Pedido de reposicion" },
  { id: "m5", type: "EXIT", productId: "p3", productName: "Kit Camaras Premium 16CH 4K", quantity: -1, reason: "Venta", reference: "VTA-0001", performedBy: "Ana Garcia", date: "2026-06-07", notes: "" },
  { id: "m6", type: "EXIT", productId: "p4", productName: "Alarma Residencial Basica", quantity: -1, reason: "Instalacion", reference: "INST-0003", performedBy: "Carlos Tecnico", date: "2026-06-06", notes: "" },
  { id: "m7", type: "ENTRY", productId: "p7", productName: "Camara IP Exterior 2MP", quantity: 10, reason: "Compra a proveedor", reference: "OC-2026-038", performedBy: "Ana Garcia", date: "2026-06-06", notes: "" },
  { id: "m8", type: "EXIT", productId: "p1", productName: "Kit Camaras Basico 4CH", quantity: -1, reason: "Venta", reference: "VTA-0007", performedBy: "Luis Martinez", date: "2026-06-05", notes: "" },
  { id: "m9", type: "ADJUSTMENT", productId: "p11", productName: "Fuente de Poder 12V", quantity: -2, reason: "Ajuste de inventario", reference: "AJUS-001", performedBy: "Ana Garcia", date: "2026-06-05", notes: "Conteo fisico revelo diferencia" },
  { id: "m10", type: "ENTRY", productId: "p4", productName: "Alarma Residencial Basica", quantity: 8, reason: "Compra a proveedor", reference: "OC-2026-035", performedBy: "Ana Garcia", date: "2026-06-03", notes: "" },
  { id: "m11", type: "EXIT", productId: "p2", productName: "Kit Camaras Profesional 8CH", quantity: -1, reason: "Venta", reference: "VTA-0002", performedBy: "Ana Garcia", date: "2026-06-02", notes: "" },
  { id: "m12", type: "ENTRY", productId: "p8", productName: "DVR 8 Canales", quantity: 5, reason: "Compra a proveedor", reference: "OC-2026-033", performedBy: "Ana Garcia", date: "2026-06-01", notes: "" },
  { id: "m13", type: "EXIT", productId: "p5", productName: "Sistema Alarma Empresarial", quantity: -1, reason: "Venta", reference: "VTA-0004", performedBy: "Juan Perez", date: "2026-05-30", notes: "" },
  { id: "m14", type: "ENTRY", productId: "p6", productName: "Sensor de Movimiento", quantity: 15, reason: "Compra a proveedor", reference: "OC-2026-030", performedBy: "Ana Garcia", date: "2026-05-28", notes: "" },
  { id: "m15", type: "EXIT", productId: "p12", productName: "Bracket para Camara", quantity: -10, reason: "Instalaciones multiples", reference: "INST-0001", performedBy: "Carlos Tecnico", date: "2026-05-28", notes: "Instalacion grande en Insurgentes" },
];

const CATEGORIES = ["Seguridad", "Alarmas", "Equipos", "Accesorios"];
const EXIT_REASONS = ["Venta", "Instalacion", "Dano o perdida", "Muestra", "Otro"];
const ADJUST_TYPES = ["Incrementar", "Decrementar", "Establecer cantidad exacta"];

function getStockStatus(item: InventoryItem): "OUT" | "LOW" | "OK" {
  if (item.currentStock === 0) return "OUT";
  if (item.currentStock <= item.minStock) return "LOW";
  return "OK";
}

function StockBar({ item }: { item: InventoryItem }) {
  const pct = Math.min(100, Math.max(0, (item.currentStock / item.maxStock) * 100));
  const status = getStockStatus(item);
  const barColor = status === "OUT" ? "bg-red-500" : status === "LOW" ? "bg-yellow-500" : "bg-green-500";
  return (
    <div className="space-y-1 min-w-20">
      <div className="text-xs font-medium">{item.currentStock} {item.unit}</div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden w-full">
        <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const chartRotationData = [
  { mes: "Ene", entradas: 35, salidas: 28 },
  { mes: "Feb", entradas: 42, salidas: 35 },
  { mes: "Mar", entradas: 28, salidas: 32 },
  { mes: "Abr", entradas: 51, salidas: 40 },
  { mes: "May", entradas: 38, salidas: 29 },
  { mes: "Jun", entradas: 25, salidas: 18 },
];

const topExitsData = [
  { name: "Sensor Movimiento", cantidad: 35 },
  { name: "Fuente 12V", cantidad: 22 },
  { name: "Kit Cam 8CH", cantidad: 12 },
  { name: "Camara IP", cantidad: 10 },
  { name: "Kit Cam 4CH", cantidad: 8 },
];

const categoryValueData = [
  { name: "Seguridad", valor: 245000 },
  { name: "Alarmas", valor: 48900 },
  { name: "Equipos", valor: 33600 },
  { name: "Accesorios", valor: 21500 },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [movSearch, setMovSearch] = useState("");
  const [movTypeFilter, setMovTypeFilter] = useState("ALL");

  // Entry dialog
  const [entryOpen, setEntryOpen] = useState(false);
  const [entryProduct, setEntryProduct] = useState("");
  const [entryQty, setEntryQty] = useState(1);
  const [entryCost, setEntryCost] = useState("");
  const [entryRef, setEntryRef] = useState("");
  const [entrySupplier, setEntrySupplier] = useState("");
  const [entryNotes, setEntryNotes] = useState("");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);

  // Exit dialog
  const [exitOpen, setExitOpen] = useState(false);
  const [exitProduct, setExitProduct] = useState("");
  const [exitQty, setExitQty] = useState(1);
  const [exitReason, setExitReason] = useState("");
  const [exitRef, setExitRef] = useState("");
  const [exitNotes, setExitNotes] = useState("");

  // Adjustment dialog
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState("");
  const [adjustType, setAdjustType] = useState("Incrementar");
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustNotes, setAdjustNotes] = useState("");

  // Toast state
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchSearch =
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "ALL" || item.category === categoryFilter;
      const status = getStockStatus(item);
      const matchStock =
        stockFilter === "ALL" ||
        (stockFilter === "OK" && status === "OK") ||
        (stockFilter === "LOW" && status === "LOW") ||
        (stockFilter === "OUT" && status === "OUT");
      return matchSearch && matchCat && matchStock;
    });
  }, [inventory, search, categoryFilter, stockFilter]);

  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      const matchSearch =
        m.productName.toLowerCase().includes(movSearch.toLowerCase()) ||
        m.reference.toLowerCase().includes(movSearch.toLowerCase());
      const matchType = movTypeFilter === "ALL" || m.type === movTypeFilter;
      return matchSearch && matchType;
    });
  }, [movements, movSearch, movTypeFilter]);

  const totalItems = inventory.length;
  const totalValue = inventory.reduce((s, i) => s + i.currentStock * i.costPrice, 0);
  const lowStockItems = inventory.filter((i) => getStockStatus(i) === "LOW").length;
  const outOfStockItems = inventory.filter((i) => getStockStatus(i) === "OUT").length;

  const selectedEntryItem = inventory.find((i) => i.id === entryProduct);
  const selectedExitItem = inventory.find((i) => i.id === exitProduct);
  const selectedAdjustItem = inventory.find((i) => i.id === adjustProduct);

  const registerEntry = () => {
    if (!entryProduct || entryQty < 1) return;
    const item = inventory.find((i) => i.id === entryProduct);
    if (!item) return;
    setInventory((prev) =>
      prev.map((i) => i.id === entryProduct ? { ...i, currentStock: i.currentStock + entryQty, lastMovement: entryDate } : i)
    );
    const newMov: StockMovement = {
      id: `m${Date.now()}`,
      type: "ENTRY",
      productId: item.productId,
      productName: item.productName,
      quantity: entryQty,
      reason: entrySupplier ? `Compra a ${entrySupplier}` : "Entrada de inventario",
      reference: entryRef,
      performedBy: "Admin",
      date: entryDate,
      notes: entryNotes,
    };
    setMovements((prev) => [newMov, ...prev]);
    setEntryOpen(false);
    setEntryProduct(""); setEntryQty(1); setEntryCost(""); setEntryRef(""); setEntrySupplier(""); setEntryNotes("");
    showToast("Entrada registrada exitosamente");
  };

  const registerExit = () => {
    if (!exitProduct || exitQty < 1 || !exitReason) return;
    const item = inventory.find((i) => i.id === exitProduct);
    if (!item) return;
    setInventory((prev) =>
      prev.map((i) => i.id === exitProduct ? { ...i, currentStock: Math.max(0, i.currentStock - exitQty), lastMovement: new Date().toISOString().split("T")[0] } : i)
    );
    const newMov: StockMovement = {
      id: `m${Date.now()}`,
      type: "EXIT",
      productId: item.productId,
      productName: item.productName,
      quantity: -exitQty,
      reason: exitReason,
      reference: exitRef,
      performedBy: "Admin",
      date: new Date().toISOString().split("T")[0],
      notes: exitNotes,
    };
    setMovements((prev) => [newMov, ...prev]);
    setExitOpen(false);
    setExitProduct(""); setExitQty(1); setExitReason(""); setExitRef(""); setExitNotes("");
    showToast("Salida registrada exitosamente");
  };

  const registerAdjustment = () => {
    if (!adjustProduct || adjustQty < 1 || !adjustReason) return;
    const item = inventory.find((i) => i.id === adjustProduct);
    if (!item) return;
    let newStock = item.currentStock;
    let delta = 0;
    if (adjustType === "Incrementar") { newStock += adjustQty; delta = adjustQty; }
    else if (adjustType === "Decrementar") { newStock = Math.max(0, item.currentStock - adjustQty); delta = -(item.currentStock - newStock); }
    else { newStock = adjustQty; delta = adjustQty - item.currentStock; }
    setInventory((prev) =>
      prev.map((i) => i.id === adjustProduct ? { ...i, currentStock: newStock, lastMovement: new Date().toISOString().split("T")[0] } : i)
    );
    const newMov: StockMovement = {
      id: `m${Date.now()}`,
      type: "ADJUSTMENT",
      productId: item.productId,
      productName: item.productName,
      quantity: delta,
      reason: adjustReason,
      reference: `AJUS-${String(movements.filter((m) => m.type === "ADJUSTMENT").length + 1).padStart(3, "0")}`,
      performedBy: "Admin",
      date: new Date().toISOString().split("T")[0],
      notes: adjustNotes,
    };
    setMovements((prev) => [newMov, ...prev]);
    setAdjustOpen(false);
    setAdjustProduct(""); setAdjustType("Incrementar"); setAdjustQty(1); setAdjustReason(""); setAdjustNotes("");
    showToast("Ajuste aplicado exitosamente");
  };

  const lowAlerts = inventory.filter((i) => getStockStatus(i) === "LOW" || getStockStatus(i) === "OUT");

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Inventario</h1>
          <p className="text-muted-foreground text-sm">{totalItems} productos registrados</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700 h-9" onClick={() => setEntryOpen(true)}>
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Entrada</span>
          </Button>
          <Button size="sm" variant="destructive" className="gap-1.5 h-9" onClick={() => setExitOpen(true)}>
            <Minus className="w-4 h-4" /> <span className="hidden sm:inline">Salida</span>
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 h-9" onClick={() => setAdjustOpen(true)}>
            <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">Ajuste</span>
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 shrink-0">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">{totalItems}</div>
              <div className="text-xs text-muted-foreground leading-tight">Total productos</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-900/30 shrink-0">
              <ArrowUpCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">${Math.round(totalValue / 1000)}k</div>
              <div className="text-xs text-muted-foreground leading-tight">Valor inventario</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 shrink-0">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-yellow-600">{lowStockItems}</div>
              <div className="text-xs text-muted-foreground leading-tight">Stock bajo</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/30 shrink-0">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-red-600">{outOfStockItems}</div>
              <div className="text-xs text-muted-foreground leading-tight">Sin stock</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stock">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="stock" className="flex-1 sm:flex-initial">Inventario</TabsTrigger>
          <TabsTrigger value="movements" className="flex-1 sm:flex-initial">Movimientos</TabsTrigger>
          <TabsTrigger value="alerts" className="flex-1 sm:flex-initial">Alertas</TabsTrigger>
        </TabsList>

        {/* ---- TAB 1: STOCK ---- */}
        <TabsContent value="stock" className="mt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-40">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar producto o SKU..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="OK">OK</SelectItem>
                <SelectItem value="LOW">Stock bajo</SelectItem>
                <SelectItem value="OUT">Sin stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-3">
            {filteredInventory.map((item) => {
              const status = getStockStatus(item);
              return (
                <div key={item.id} className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-1 min-w-0 gap-3">
                      <div className="h-11 w-11 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{item.productName}</div>
                        <div className="text-xs text-muted-foreground">{item.sku} · {item.category}</div>
                      </div>
                    </div>
                    {status === "OUT" && (
                      <Badge className="bg-red-100 text-red-700 border-0 text-xs shrink-0">SIN STOCK</Badge>
                    )}
                    {status === "LOW" && (
                      <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs shrink-0">STOCK BAJO</Badge>
                    )}
                    {status === "OK" && (
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs shrink-0">OK</Badge>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className={cn("text-2xl font-bold", status === "OUT" ? "text-red-600" : status === "LOW" ? "text-yellow-600" : "text-green-600")}>
                        {item.currentStock}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">{item.unit}</span>
                    </div>
                    <StockBar item={item} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Min: {item.minStock} · {item.location}</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-green-600 border-green-200" onClick={() => { setEntryProduct(item.id); setEntryOpen(true); }}>
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-red-600 border-red-200" onClick={() => { setExitProduct(item.id); setExitOpen(true); }}>
                        <Minus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table view */}
          <Card className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Producto / SKU</th>
                    <th className="text-left p-4 font-medium">Categoria</th>
                    <th className="text-left p-4 font-medium w-40">Stock actual</th>
                    <th className="text-right p-4 font-medium">Min</th>
                    <th className="text-left p-4 font-medium">Unidad</th>
                    <th className="text-right p-4 font-medium">Costo</th>
                    <th className="text-right p-4 font-medium">Precio</th>
                    <th className="text-left p-4 font-medium">Ubicacion</th>
                    <th className="text-left p-4 font-medium">Ult. movimiento</th>
                    <th className="text-right p-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => {
                    const status = getStockStatus(item);
                    return (
                      <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                              ) : (
                                <Package className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-xs text-muted-foreground font-mono">{item.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <StockBar item={item} />
                            {status === "OUT" && <Badge className="bg-red-100 text-red-700 border-0 text-xs shrink-0">SIN STOCK</Badge>}
                            {status === "LOW" && <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs shrink-0">STOCK BAJO</Badge>}
                          </div>
                        </td>
                        <td className="p-4 text-right text-muted-foreground">{item.minStock}</td>
                        <td className="p-4 text-muted-foreground">{item.unit}</td>
                        <td className="p-4 text-right">${item.costPrice.toLocaleString()}</td>
                        <td className="p-4 text-right font-medium">${item.salePrice.toLocaleString()}</td>
                        <td className="p-4 text-xs text-muted-foreground">{item.location}</td>
                        <td className="p-4 text-xs text-muted-foreground">{item.lastMovement}</td>
                        <td className="p-4">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-green-600 border-green-200" onClick={() => { setEntryProduct(item.id); setEntryOpen(true); }}>
                              <Plus className="w-3 h-3" /> Entrada
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-red-600 border-red-200" onClick={() => { setExitProduct(item.id); setExitOpen(true); }}>
                              <Minus className="w-3 h-3" /> Salida
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ---- TAB 2: MOVEMENTS ---- */}
        <TabsContent value="movements" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2 flex-1">
              <div className="relative flex-1 min-w-40">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar producto o referencia..." className="pl-9" value={movSearch} onChange={(e) => setMovSearch(e.target.value)} />
              </div>
              <Select value={movTypeFilter} onValueChange={setMovTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="ENTRY">Entradas</SelectItem>
                  <SelectItem value="EXIT">Salidas</SelectItem>
                  <SelectItem value="ADJUSTMENT">Ajustes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => showToast("Exportando movimientos...")}>
              <Download className="w-4 h-4" /> Exportar
            </Button>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-3">
            {filteredMovements.map((mov) => {
              const isEntry = mov.type === "ENTRY";
              const isExit = mov.type === "EXIT";
              return (
                <div key={mov.id} className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        {isEntry && <ArrowUpCircle className="w-4 h-4 text-green-600 shrink-0" />}
                        {isExit && <ArrowDownCircle className="w-4 h-4 text-red-600 shrink-0" />}
                        {!isEntry && !isExit && <RefreshCw className="w-4 h-4 text-gray-500 shrink-0" />}
                        <span className="font-medium text-sm">{mov.productName}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{mov.reason} · {mov.reference}</div>
                    </div>
                    <span className={cn("text-base font-bold shrink-0", isEntry ? "text-green-600" : "text-red-600")}>
                      {mov.quantity > 0 ? "+" : ""}{mov.quantity}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{mov.performedBy}</span>
                    <span>{mov.date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table view */}
          <Card className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Fecha</th>
                    <th className="text-left p-4 font-medium">Tipo</th>
                    <th className="text-left p-4 font-medium">Producto</th>
                    <th className="text-right p-4 font-medium">Cantidad</th>
                    <th className="text-left p-4 font-medium">Motivo</th>
                    <th className="text-left p-4 font-medium">Referencia</th>
                    <th className="text-left p-4 font-medium">Realizado por</th>
                    <th className="text-left p-4 font-medium">Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovements.map((mov) => {
                    const isEntry = mov.type === "ENTRY";
                    const isExit = mov.type === "EXIT";
                    const typeConfig = {
                      ENTRY: { label: "ENTRADA", cls: "bg-green-100 text-green-700" },
                      EXIT: { label: "SALIDA", cls: "bg-red-100 text-red-700" },
                      ADJUSTMENT: { label: "AJUSTE", cls: "bg-gray-100 text-gray-700" },
                      TRANSFER: { label: "TRANSFERENCIA", cls: "bg-blue-100 text-blue-700" },
                    };
                    const tc = typeConfig[mov.type];
                    return (
                      <tr key={mov.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4 text-xs text-muted-foreground">{mov.date}</td>
                        <td className="p-4">
                          <Badge className={cn("border-0 text-xs", tc.cls)}>{tc.label}</Badge>
                        </td>
                        <td className="p-4 font-medium">{mov.productName}</td>
                        <td className={cn("p-4 text-right font-bold text-base", isEntry ? "text-green-600" : isExit ? "text-red-600" : "text-gray-600")}>
                          {mov.quantity > 0 ? "+" : ""}{mov.quantity}
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">{mov.reason}</td>
                        <td className="p-4 font-mono text-xs text-blue-600">{mov.reference}</td>
                        <td className="p-4 text-xs text-muted-foreground">{mov.performedBy}</td>
                        <td className="p-4 text-xs text-muted-foreground max-w-32 truncate">{mov.notes || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ---- TAB 3: ALERTS & REPORTS ---- */}
        <TabsContent value="alerts" className="mt-4 space-y-6">
          {/* Alerts */}
          <div>
            <h3 className="font-bold text-base mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" /> Alertas de stock
            </h3>
            {lowAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Todo el inventario tiene stock suficiente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowAlerts.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <div key={item.id} className={cn(
                      "flex items-center justify-between p-4 rounded-xl border",
                      status === "OUT" ? "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800" : "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800"
                    )}>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{item.productName}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Stock actual: <span className={cn("font-bold", status === "OUT" ? "text-red-600" : "text-yellow-600")}>{item.currentStock}</span>
                          {" "} · Min: {item.minStock} {item.unit}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0 ml-3 text-xs h-8" onClick={() => { setEntryProduct(item.id); setEntryOpen(true); }}>
                        Ordenar
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Valor de inventario por categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={categoryValueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={40} />
                    <RechartsTooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "Valor"]} />
                    <Bar dataKey="valor" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Top 5 productos con mas salidas</CardTitle>
                <CardDescription className="text-xs">Este mes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={topExitsData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={80} />
                    <RechartsTooltip formatter={(v: any) => [v, "Unidades"]} />
                    <Bar dataKey="cantidad" fill="#EF4444" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Rotacion de inventario (ultimos 6 meses)</CardTitle>
                <CardDescription className="text-xs">Entradas vs Salidas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartRotationData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSalidas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={30} />
                    <RechartsTooltip />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Area type="monotone" dataKey="entradas" name="Entradas" stroke="#10B981" strokeWidth={2} fill="url(#colorEntradas)" />
                    <Area type="monotone" dataKey="salidas" name="Salidas" stroke="#EF4444" strokeWidth={2} fill="url(#colorSalidas)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ---- ENTRY DIALOG ---- */}
      <Dialog open={entryOpen} onOpenChange={setEntryOpen}>
        <DialogContent className="max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-green-600" /> Registrar Entrada de Inventario
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Producto *</label>
              <Select value={entryProduct} onValueChange={(v) => { setEntryProduct(v); const item = inventory.find((i) => i.id === v); if (item) setEntryCost(String(item.costPrice)); }}>
                <SelectTrigger><SelectValue placeholder="Seleccionar producto" /></SelectTrigger>
                <SelectContent>
                  {inventory.map((i) => (
                    <SelectItem key={i.id} value={i.id}>{i.productName} <span className="text-muted-foreground text-xs">(Stock: {i.currentStock})</span></SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Cantidad *</label>
                <Input type="number" min={1} value={entryQty} onChange={(e) => setEntryQty(parseInt(e.target.value) || 1)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Costo unitario</label>
                <Input type="number" value={entryCost} onChange={(e) => setEntryCost(e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Referencia (OC, factura)</label>
              <Input value={entryRef} onChange={(e) => setEntryRef(e.target.value)} placeholder="OC-2026-001" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Proveedor</label>
              <Input value={entrySupplier} onChange={(e) => setEntrySupplier(e.target.value)} placeholder="Nombre del proveedor" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Fecha</label>
              <Input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Notas</label>
              <Textarea value={entryNotes} onChange={(e) => setEntryNotes(e.target.value)} placeholder="Notas adicionales..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEntryOpen(false)}>Cancelar</Button>
            <Button className="bg-green-600 hover:bg-green-700 gap-2" onClick={registerEntry} disabled={!entryProduct || entryQty < 1}>
              <ArrowUpCircle className="w-4 h-4" /> Registrar Entrada
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- EXIT DIALOG ---- */}
      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent className="max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownCircle className="w-5 h-5 text-red-600" /> Registrar Salida de Inventario
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Producto *</label>
              <Select value={exitProduct} onValueChange={setExitProduct}>
                <SelectTrigger><SelectValue placeholder="Seleccionar producto" /></SelectTrigger>
                <SelectContent>
                  {inventory.map((i) => (
                    <SelectItem key={i.id} value={i.id}>{i.productName} <span className="text-muted-foreground text-xs">(Stock: {i.currentStock})</span></SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Cantidad *</label>
              <Input
                type="number"
                min={1}
                max={selectedExitItem?.currentStock || 999}
                value={exitQty}
                onChange={(e) => setExitQty(parseInt(e.target.value) || 1)}
              />
              {selectedExitItem && exitQty > 0 && (selectedExitItem.currentStock - exitQty) < selectedExitItem.minStock && (selectedExitItem.currentStock - exitQty) >= 0 && (
                <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" /> El stock quedara por debajo del minimo ({selectedExitItem.minStock})
                </p>
              )}
              {selectedExitItem && exitQty > selectedExitItem.currentStock && (
                <p className="text-xs text-red-600 mt-1">No hay suficiente stock disponible</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Motivo *</label>
              <Select value={exitReason} onValueChange={setExitReason}>
                <SelectTrigger><SelectValue placeholder="Seleccionar motivo" /></SelectTrigger>
                <SelectContent>
                  {EXIT_REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Referencia</label>
              <Input value={exitRef} onChange={(e) => setExitRef(e.target.value)} placeholder="V-0012, INST-0003..." />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Notas</label>
              <Textarea value={exitNotes} onChange={(e) => setExitNotes(e.target.value)} placeholder="Notas adicionales..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExitOpen(false)}>Cancelar</Button>
            <Button variant="destructive" className="gap-2" onClick={registerExit} disabled={!exitProduct || exitQty < 1 || !exitReason || (selectedExitItem ? exitQty > selectedExitItem.currentStock : false)}>
              <ArrowDownCircle className="w-4 h-4" /> Registrar Salida
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- ADJUSTMENT DIALOG ---- */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" /> Ajuste de Inventario
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Producto *</label>
              <Select value={adjustProduct} onValueChange={setAdjustProduct}>
                <SelectTrigger><SelectValue placeholder="Seleccionar producto" /></SelectTrigger>
                <SelectContent>
                  {inventory.map((i) => (
                    <SelectItem key={i.id} value={i.id}>{i.productName} <span className="text-muted-foreground text-xs">(Stock actual: {i.currentStock})</span></SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAdjustItem && (
                <p className="text-xs text-muted-foreground mt-1">Stock actual: <span className="font-bold">{selectedAdjustItem.currentStock}</span> {selectedAdjustItem.unit}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo de ajuste *</label>
              <Select value={adjustType} onValueChange={setAdjustType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ADJUST_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Cantidad *</label>
              <Input type="number" min={0} value={adjustQty} onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Motivo del ajuste *</label>
              <Input value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} placeholder="Conteo fisico, merma, etc." />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Notas</label>
              <Textarea value={adjustNotes} onChange={(e) => setAdjustNotes(e.target.value)} placeholder="Notas adicionales..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>Cancelar</Button>
            <Button onClick={registerAdjustment} disabled={!adjustProduct || !adjustReason} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Aplicar Ajuste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
