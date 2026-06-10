"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Plus, Grid3X3, List, Edit2, Share2, Package, Shield,
  Wrench, Check, X, Camera, Bell, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  requiresInstallation: boolean;
  warrantyMonths: number;
}

const CATEGORIES = ["Seguridad", "Alarmas", "Automatización", "Accesorios", "Servicios"];

const CATEGORY_COLORS: Record<string, string> = {
  "Seguridad": "bg-blue-100 text-blue-700",
  "Alarmas": "bg-red-100 text-red-700",
  "Automatización": "bg-purple-100 text-purple-700",
  "Accesorios": "bg-gray-100 text-gray-700",
  "Servicios": "bg-green-100 text-green-700",
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Seguridad": Camera,
  "Alarmas": Bell,
  "Automatización": Zap,
  "Accesorios": Package,
  "Servicios": Wrench,
};

const INITIAL_PRODUCTS: Product[] = [
  { id: "p1", name: "Kit Cámaras Básico 4CH", description: "4 cámaras HD 1080p, DVR 4 canales, disco duro 1TB, app móvil incluida.", price: 4500, category: "Seguridad", isAvailable: true, requiresInstallation: true, warrantyMonths: 12 },
  { id: "p2", name: "Kit Cámaras Profesional 8CH", description: "8 cámaras Full HD, NVR IP 8 canales, almacenamiento 2TB, visión nocturna avanzada.", price: 8900, category: "Seguridad", isAvailable: true, requiresInstallation: true, warrantyMonths: 18 },
  { id: "p3", name: "Kit Cámaras Premium 16CH 4K", description: "16 cámaras 4K Ultra HD, NVR Pro 16 canales, 4TB, IA detección de movimiento.", price: 15000, category: "Seguridad", isAvailable: true, requiresInstallation: true, warrantyMonths: 24 },
  { id: "p4", name: "Alarma Residencial Básica", description: "Panel de control, 6 sensores de puerta/ventana, 2 sensores de movimiento, sirena 110dB.", price: 3200, category: "Alarmas", isAvailable: true, requiresInstallation: true, warrantyMonths: 12 },
  { id: "p5", name: "Sistema Alarma Empresarial", description: "Panel central inteligente, hasta 32 zonas, sensores perimetrales, monitoreo 24/7.", price: 7500, category: "Alarmas", isAvailable: true, requiresInstallation: true, warrantyMonths: 24 },
  { id: "p6", name: "Sensor de Movimiento PIR", description: "Sensor infrarrojo pasivo de alta sensibilidad, ángulo 120°, alcance 12m.", price: 450, category: "Accesorios", isAvailable: true, requiresInstallation: false, warrantyMonths: 6 },
  { id: "p7", name: "Cámara IP Exterior 2MP", description: "Cámara IP PoE exterior, 2 megapíxeles, IP67, IR 30m, H.265+.", price: 890, category: "Seguridad", isAvailable: true, requiresInstallation: true, warrantyMonths: 12 },
  { id: "p8", name: "DVR 8 Canales HD", description: "Grabador digital 8 canales, resolución 1080N, compatible cámaras analógicas.", price: 2100, category: "Accesorios", isAvailable: true, requiresInstallation: false, warrantyMonths: 12 },
  { id: "p9", name: "Instalación Básica", description: "Servicio de instalación para hasta 4 cámaras o sensores. Incluye cableado y configuración.", price: 800, category: "Servicios", isAvailable: true, requiresInstallation: false, warrantyMonths: 0 },
  { id: "p10", name: "Mantenimiento Anual", description: "Servicio de mantenimiento preventivo anual. Limpieza, firmware, verificación del sistema.", price: 1200, category: "Servicios", isAvailable: true, requiresInstallation: false, warrantyMonths: 0 },
];

const EMPTY_FORM: Omit<Product, "id"> = {
  name: "", description: "", price: 0, category: "Seguridad",
  isAvailable: true, requiresInstallation: false, warrantyMonths: 12
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_FORM);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "ALL" || p.category === categoryFilter;
    const matchAvail = availabilityFilter === "ALL" || (availabilityFilter === "AVAILABLE" && p.isAvailable) || (availabilityFilter === "UNAVAILABLE" && !p.isAvailable);
    return matchSearch && matchCat && matchAvail;
  });

  const openCreate = () => { setEditingProduct(null); setForm(EMPTY_FORM); setDialogOpen(true); };
  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, isAvailable: p.isAvailable, requiresInstallation: p.requiresInstallation, warrantyMonths: p.warrantyMonths });
    setDialogOpen(true);
  };
  const saveProduct = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...form } : p));
    } else {
      setProducts(prev => [{ ...form, id: `p${Date.now()}` }, ...prev]);
    }
    setDialogOpen(false);
  };
  const toggleAvailability = (id: string) => setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-muted-foreground text-sm">{products.length} productos en catálogo</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Nuevo Producto</Button>
      </div>

      <div className="flex gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar productos..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Categoría" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las categorías</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Disponibilidad" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="AVAILABLE">Disponibles</SelectItem>
            <SelectItem value="UNAVAILABLE">No disponibles</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex border rounded-lg overflow-hidden">
          <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" className="rounded-none" onClick={() => setViewMode("grid")}><Grid3X3 className="w-4 h-4" /></Button>
          <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" className="rounded-none" onClick={() => setViewMode("list")}><List className="w-4 h-4" /></Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => {
            const Icon = CATEGORY_ICONS[product.category] || Package;
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className={`h-full flex flex-col transition-all hover:shadow-md ${!product.isAvailable ? "opacity-60" : ""}`}>
                  <div className="h-36 rounded-t-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-slate-400" />
                  </div>
                  <CardContent className="flex flex-col flex-1 pt-4 gap-3">
                    <div>
                      <Badge variant="outline" className={`text-xs mb-2 ${CATEGORY_COLORS[product.category] || ""}`}>{product.category}</Badge>
                      <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="text-2xl font-bold text-green-600">${product.price.toLocaleString()}</div>
                    <div className="flex gap-2 flex-wrap">
                      {product.requiresInstallation && <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600"><Wrench className="w-3 h-3 mr-1" />Instalación</Badge>}
                      {product.warrantyMonths > 0 && <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600"><Shield className="w-3 h-3 mr-1" />{product.warrantyMonths}m garantía</Badge>}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch checked={product.isAvailable} onCheckedChange={() => toggleAvailability(product.id)} />
                        <span className="text-xs text-muted-foreground">{product.isAvailable ? "Activo" : "Inactivo"}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openEdit(product)}><Edit2 className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600"><Share2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">Producto</th>
                <th className="text-left p-4 font-medium">Categoría</th>
                <th className="text-left p-4 font-medium">Precio</th>
                <th className="text-left p-4 font-medium">Instalación</th>
                <th className="text-left p-4 font-medium">Garantía</th>
                <th className="text-left p-4 font-medium">Estado</th>
                <th className="text-right p-4 font-medium">Acciones</th>
              </tr></thead>
              <tbody>
                {filtered.map(product => {
                  const Icon = CATEGORY_ICONS[product.category] || Package;
                  return (
                    <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><Icon className="w-5 h-5 text-muted-foreground" /></div>
                          <div><div className="font-medium">{product.name}</div><div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div></div>
                        </div>
                      </td>
                      <td className="p-4"><Badge variant="outline" className={`text-xs ${CATEGORY_COLORS[product.category] || ""}`}>{product.category}</Badge></td>
                      <td className="p-4 font-bold text-green-600">${product.price.toLocaleString()}</td>
                      <td className="p-4">{product.requiresInstallation ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-muted-foreground" />}</td>
                      <td className="p-4 text-muted-foreground">{product.warrantyMonths > 0 ? `${product.warrantyMonths} meses` : "—"}</td>
                      <td className="p-4">
                        <Switch checked={product.isAvailable} onCheckedChange={() => toggleAvailability(product.id)} />
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openEdit(product)}><Edit2 className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600"><Share2 className="w-4 h-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nombre *</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre del producto" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Descripción</label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción detallada..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Precio *</label>
                <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} placeholder="0.00" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Categoría</label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Meses de garantía</label>
                <Input type="number" value={form.warrantyMonths} onChange={e => setForm(f => ({ ...f, warrantyMonths: parseInt(e.target.value) || 0 }))} placeholder="12" />
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex items-center gap-3"><Switch checked={form.isAvailable} onCheckedChange={v => setForm(f => ({ ...f, isAvailable: v }))} /><label className="text-sm font-medium">Disponible para venta</label></div>
              <div className="flex items-center gap-3"><Switch checked={form.requiresInstallation} onCheckedChange={v => setForm(f => ({ ...f, requiresInstallation: v }))} /><label className="text-sm font-medium">Requiere instalación</label></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={saveProduct} disabled={!form.name}><Check className="w-4 h-4 mr-2" />{editingProduct ? "Guardar cambios" : "Crear producto"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
