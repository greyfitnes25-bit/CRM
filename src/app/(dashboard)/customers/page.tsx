"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Filter, Phone, MessageCircle, Eye, Edit2, ArrowLeft,
  User, Mail, MapPin, Tag, Calendar, ChevronLeft, ChevronRight, X, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CUSTOMER_SOURCE_LABELS, CUSTOMER_SOURCE_COLORS } from "@/lib/constants";

interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  city: string;
  address: string;
  source: string;
  tags: string[];
  notes: string;
  assignedTo: string;
  lastActivity: string;
  conversations: number;
  quotes: number;
  sales: number;
  warranties: number;
}

const SELLERS = ["Juan Pérez", "Ana García", "Luis Martínez", "Carmen López"];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: "c1", name: "María González", phone: "+52 55 1234 5678", whatsapp: "+52 55 1234 5678", email: "maria.gonzalez@email.com", instagram: "@mariagonzalez", city: "Ciudad de México", address: "Av. Insurgentes 123, Col. Roma", source: "META_ADS", tags: ["VIP", "Recurrente"], notes: "Cliente frecuente, prefiere contacto por WhatsApp", assignedTo: "Juan Pérez", lastActivity: "Hace 2 horas", conversations: 3, quotes: 2, sales: 1, warranties: 1 },
  { id: "c2", name: "Carlos Rodríguez", phone: "+52 55 9876 5432", whatsapp: "+52 55 9876 5432", email: "carlos.rodriguez@empresa.com", instagram: "@carlosrod", city: "Guadalajara", address: "Calle Morelos 456, Centro", source: "INSTAGRAM", tags: ["Empresa", "Alto valor"], notes: "Dueño de tienda de ropa. Interesado en paquete profesional.", assignedTo: "Ana García", lastActivity: "Hace 15 min", conversations: 5, quotes: 3, sales: 2, warranties: 2 },
  { id: "c3", name: "Laura Martínez", phone: "+52 55 4567 8901", whatsapp: "+52 55 4567 8901", email: "laura.m@gmail.com", instagram: "", city: "Monterrey", address: "Blvd. Díaz Ordaz 789", source: "WHATSAPP", tags: ["Residencial"], notes: "Interesada en garantías extendidas", assignedTo: "", lastActivity: "Hace 45 min", conversations: 1, quotes: 1, sales: 0, warranties: 0 },
  { id: "c4", name: "Roberto Silva", phone: "+52 55 3210 9876", whatsapp: "+52 55 3210 9876", email: "roberto.silva@hotmail.com", instagram: "@rsilva", city: "Puebla", address: "5 de Mayo 321, Centro Histórico", source: "REFERRAL", tags: ["Referido", "En proceso"], notes: "Referido por María González. Quiere sistema de alarma.", assignedTo: "Juan Pérez", lastActivity: "Hace 1 hora", conversations: 4, quotes: 2, sales: 1, warranties: 1 },
  { id: "c5", name: "Sofía Hernández", phone: "+52 55 7890 1234", whatsapp: "+52 55 7890 1234", email: "sofia.h@gmail.com", instagram: "@sofiahernandez", city: "Ciudad de México", address: "Condesa, CDMX", source: "INSTAGRAM", tags: ["Completado"], notes: "Compra completada. Muy satisfecha.", assignedTo: "Ana García", lastActivity: "Hace 5 horas", conversations: 2, quotes: 1, sales: 1, warranties: 1 },
  { id: "c6", name: "Miguel Torres", phone: "+52 55 6543 2109", whatsapp: "+52 55 6543 2109", email: "miguel.torres@gmail.com", instagram: "@migueltorres", city: "Guadalajara", address: "Av. Vallarta 654, Zapopan", source: "INSTAGRAM", tags: ["Nuevo"], notes: "Interesado en envíos a Guadalajara", assignedTo: "Juan Pérez", lastActivity: "Hace 2 horas", conversations: 3, quotes: 1, sales: 0, warranties: 0 },
  { id: "c7", name: "Valentina Cruz", phone: "+52 33 4567 8901", whatsapp: "+52 33 4567 8901", email: "valentina@distribuidoraxyz.com", instagram: "", city: "Guadalajara", address: "Av. Federalismo 890", source: "WEB", tags: ["Distribuidora", "B2B"], notes: "Distribuidora XYZ. Contactó por formulario web.", assignedTo: "", lastActivity: "Hace 3 horas", conversations: 1, quotes: 0, sales: 0, warranties: 0 },
  { id: "c8", name: "Fernando López", phone: "+52 55 2345 6789", whatsapp: "+52 55 2345 6789", email: "flopez@empresa.mx", instagram: "@flopez_empresa", city: "Ciudad de México", address: "Polanco, CDMX", source: "META_ADS", tags: ["Alto valor", "VIP"], notes: "Empresa grande. Cotización premium enviada.", assignedTo: "Juan Pérez", lastActivity: "Hace 2 días", conversations: 6, quotes: 4, sales: 2, warranties: 2 },
  { id: "c9", name: "Patricia Jiménez", phone: "+52 55 8901 2345", whatsapp: "+52 55 8901 2345", email: "patricia.jimenez@gmail.com", instagram: "@patrijimenez", city: "Querétaro", address: "Av. Tecnológico 123, Qro", source: "WHATSAPP", tags: ["En espera"], notes: "Espera aprobación de su esposo para proceder", assignedTo: "Ana García", lastActivity: "Hace 5 horas", conversations: 2, quotes: 1, sales: 0, warranties: 0 },
  { id: "c10", name: "Daniela Moreno", phone: "+52 55 5678 9012", whatsapp: "+52 55 5678 9012", email: "daniela.moreno@hotmail.com", instagram: "@danielam", city: "León", address: "Blvd. Torres Landa 456, León GTO", source: "META_ADS", tags: ["Financiamiento"], notes: "Solicita financiamiento a 6 meses", assignedTo: "Ana García", lastActivity: "Hace 8 horas", conversations: 3, quotes: 2, sales: 0, warranties: 0 },
  { id: "c11", name: "Alejandro Ruiz", phone: "+52 55 1122 3344", whatsapp: "+52 55 1122 3344", email: "alex.ruiz@gmail.com", instagram: "@alexruiz", city: "Ciudad de México", address: "Ecatepec, EdoMex", source: "WHATSAPP", tags: ["Pago pendiente"], notes: "Realizará transferencia hoy por la tarde", assignedTo: "Juan Pérez", lastActivity: "Hace 1 hora", conversations: 2, quotes: 1, sales: 0, warranties: 0 },
  { id: "c12", name: "Isabel Castro", phone: "+52 55 4455 6677", whatsapp: "+52 55 4455 6677", email: "isabel.castro@email.com", instagram: "@isabelcastro", city: "Ciudad de México", address: "Pedregal de San Ángel, CDMX", source: "META_ADS", tags: ["VIP", "Completado"], notes: "Venta cerrada. Instalación completada.", assignedTo: "Ana García", lastActivity: "Ayer", conversations: 4, quotes: 2, sales: 1, warranties: 1 },
  { id: "c13", name: "Eduardo Vargas", phone: "+52 55 7788 9900", whatsapp: "+52 55 7788 9900", email: "eduardo.vargas@empresa.com", instagram: "", city: "Monterrey", address: "San Pedro Garza García, NL", source: "REFERRAL", tags: ["Completado"], notes: "Pagó en efectivo. Sistema instalado y funcionando.", assignedTo: "Juan Pérez", lastActivity: "Hace 2 días", conversations: 3, quotes: 1, sales: 1, warranties: 1 },
  { id: "c14", name: "Gabriela Soto", phone: "+52 55 3344 5566", whatsapp: "+52 55 3344 5566", email: "gabriela.soto@gmail.com", instagram: "@gabisoto", city: "Tijuana", address: "Blvd. Agua Caliente 789, Tijuana BC", source: "INSTAGRAM", tags: ["Perdido"], notes: "Eligió a la competencia por precio más bajo", assignedTo: "Ana García", lastActivity: "Hace 3 días", conversations: 2, quotes: 1, sales: 0, warranties: 0 },
  { id: "c15", name: "Héctor Morales", phone: "+52 55 9900 1122", whatsapp: "+52 55 9900 1122", email: "hector.morales@negocios.com", instagram: "@hmorales_negocios", city: "Ciudad de México", address: "Naucalpan, EdoMex", source: "WEB", tags: ["Empresa", "Nuevo"], notes: "Empresa de seguridad privada. Interesado en distribución.", assignedTo: "Luis Martínez", lastActivity: "Hace 4 horas", conversations: 1, quotes: 0, sales: 0, warranties: 0 },
];

const EMPTY_FORM: Omit<Customer, "id" | "lastActivity" | "conversations" | "quotes" | "sales" | "warranties"> = {
  name: "", phone: "", whatsapp: "", email: "", instagram: "", city: "", address: "", source: "WHATSAPP", tags: [], notes: "", assignedTo: ""
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchSource = sourceFilter === "ALL" || c.source === sourceFilter;
    return matchSearch && matchSource;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const openCreate = () => {
    setEditingCustomer(null);
    setForm(EMPTY_FORM);
    setTagInput("");
    setDialogOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setForm({ name: c.name, phone: c.phone, whatsapp: c.whatsapp, email: c.email, instagram: c.instagram, city: c.city, address: c.address, source: c.source, tags: c.tags, notes: c.notes, assignedTo: c.assignedTo });
    setTagInput(c.tags.join(", "));
    setDialogOpen(true);
  };

  const saveCustomer = () => {
    const tags = tagInput.split(",").map(t => t.trim()).filter(Boolean);
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...form, tags } : c));
    } else {
      const newC: Customer = { ...form, tags, id: `c${Date.now()}`, lastActivity: "Ahora", conversations: 0, quotes: 0, sales: 0, warranties: 0 };
      setCustomers(prev => [newC, ...prev]);
    }
    setDialogOpen(false);
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const avatarColors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-pink-500", "bg-cyan-500"];
  const getColor = (id: string) => avatarColors[parseInt(id.replace(/\D/g, "") || "0") % avatarColors.length];

  if (selectedCustomer) {
    return (
      <CustomerDetail
        customer={selectedCustomer}
        onBack={() => setSelectedCustomer(null)}
        onEdit={() => openEdit(selectedCustomer)}
        getInitials={getInitials}
        getColor={getColor}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground text-sm">{customers.length} clientes registrados</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo Cliente
        </Button>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre, teléfono o email..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={sourceFilter} onValueChange={v => { setSourceFilter(v); setPage(1); }}>
          <SelectTrigger className="w-44">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Fuente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las fuentes</SelectItem>
            {Object.entries(CUSTOMER_SOURCE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">Cliente</th>
                <th className="text-left p-4 font-medium">Teléfono</th>
                <th className="text-left p-4 font-medium">Fuente</th>
                <th className="text-left p-4 font-medium">Etiquetas</th>
                <th className="text-left p-4 font-medium">Asignado a</th>
                <th className="text-left p-4 font-medium">Última actividad</th>
                <th className="text-right p-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(customer => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-muted/30 transition-colors group cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className={`${getColor(customer.id)} text-white text-xs font-bold`}>
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{customer.phone}</td>
                  <td className="p-4">
                    <Badge variant="outline" className={`text-xs ${CUSTOMER_SOURCE_COLORS[customer.source] || ""}`}>
                      {CUSTOMER_SOURCE_LABELS[customer.source] || customer.source}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {customer.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                      {customer.tags.length > 2 && <Badge variant="secondary" className="text-xs">+{customer.tags.length - 2}</Badge>}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{customer.assignedTo || <span className="text-orange-500">Sin asignar</span>}</td>
                  <td className="p-4 text-muted-foreground text-xs">{customer.lastActivity}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedCustomer(customer)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => openEdit(customer)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">
              Mostrando {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} de {filtered.length}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nombre completo *</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre del cliente" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Teléfono</label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+52 55 0000 0000" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">WhatsApp</label>
              <Input value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="+52 55 0000 0000" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="correo@ejemplo.com" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Instagram</label>
              <Input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="@usuario" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Ciudad</label>
              <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Ciudad de México" />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">Dirección</label>
              <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Calle, número, colonia" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Fuente</label>
              <Select value={form.source} onValueChange={v => setForm(f => ({ ...f, source: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CUSTOMER_SOURCE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Asignar a</label>
              <Select value={form.assignedTo} onValueChange={v => setForm(f => ({ ...f, assignedTo: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar vendedor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin asignar</SelectItem>
                  {SELLERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">Etiquetas (separadas por coma)</label>
              <Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="VIP, Empresa, Nuevo..." />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">Notas</label>
              <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notas internas sobre el cliente..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={saveCustomer} disabled={!form.name}>
              <Check className="w-4 h-4 mr-2" /> {editingCustomer ? "Guardar cambios" : "Crear cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CustomerDetail({ customer, onBack, onEdit, getInitials, getColor }: {
  customer: Customer; onBack: () => void; onEdit: () => void;
  getInitials: (n: string) => string; getColor: (id: string) => string;
}) {
  const [activeTab, setActiveTab] = useState("perfil");
  const stats = [
    { label: "Conversaciones", value: customer.conversations, color: "text-blue-600" },
    { label: "Cotizaciones", value: customer.quotes, color: "text-purple-600" },
    { label: "Ventas", value: customer.sales, color: "text-green-600" },
    { label: "Garantías", value: customer.warranties, color: "text-orange-600" },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Volver a clientes
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className={`${getColor(customer.id)} text-white text-lg font-bold`}>
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{customer.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{customer.phone}</span>
              <Badge variant="outline" className={`text-xs ${CUSTOMER_SOURCE_COLORS[customer.source] || ""}`}>
                {CUSTOMER_SOURCE_LABELS[customer.source]}
              </Badge>
            </div>
            <div className="flex gap-1 mt-2">
              {customer.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-green-600 border-green-200">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </Button>
          <Button size="sm" onClick={onEdit} className="gap-2">
            <Edit2 className="w-4 h-4" /> Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="pt-6 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="conversaciones">Conversaciones</TabsTrigger>
          <TabsTrigger value="cotizaciones">Cotizaciones</TabsTrigger>
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="garantias">Garantías</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <Card>
            <CardHeader><CardTitle className="text-base">Información de contacto</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: User, label: "Nombre", value: customer.name },
                  { icon: Mail, label: "Email", value: customer.email || "—" },
                  { icon: Phone, label: "Teléfono", value: customer.phone },
                  { icon: MessageCircle, label: "WhatsApp", value: customer.whatsapp },
                  { icon: Tag, label: "Instagram", value: customer.instagram || "—" },
                  { icon: MapPin, label: "Ciudad", value: customer.city || "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted"><Icon className="w-4 h-4 text-muted-foreground" /></div>
                    <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-medium text-sm">{value}</div></div>
                  </div>
                ))}
              </div>
              <Separator />
              <div>
                <div className="text-xs text-muted-foreground mb-1">Dirección</div>
                <div className="text-sm">{customer.address || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Asignado a</div>
                <div className="text-sm font-medium">{customer.assignedTo || <span className="text-orange-500">Sin asignar</span>}</div>
              </div>
              {customer.notes && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Notas internas</div>
                  <div className="text-sm bg-yellow-50 border border-yellow-200 rounded p-3">{customer.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversaciones">
          <Card><CardContent className="pt-6">
            <div className="space-y-3">
              {["WhatsApp - Hace 2 horas", "Instagram - Ayer", "WhatsApp - Hace 3 días"].slice(0, customer.conversations).map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{c}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">Cerrado</Badge>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="cotizaciones">
          <Card><CardContent className="pt-6">
            <div className="space-y-3">
              {Array.from({ length: customer.quotes }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">COT-{String(i + 1).padStart(4, "0")}</div>
                    <div className="text-xs text-muted-foreground">Kit Cámaras Profesional 8CH</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">$8,900</div>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">Enviado</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="ventas">
          <Card><CardContent className="pt-6">
            <div className="space-y-3">
              {Array.from({ length: customer.sales }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">VTA-{String(i + 1).padStart(4, "0")}</div>
                    <div className="text-xs text-muted-foreground">Kit Cámaras Profesional 8CH + Instalación</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-green-600">$9,700</div>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Pagado</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="garantias">
          <Card><CardContent className="pt-6">
            <div className="space-y-3">
              {Array.from({ length: customer.warranties }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">Kit Cámaras Profesional 8CH</div>
                    <div className="text-xs text-muted-foreground">Garantía 12 meses</div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Activa</Badge>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
