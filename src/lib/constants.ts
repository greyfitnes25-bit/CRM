export const APP_NAME = "GreyCRM";
export const APP_VERSION = "1.0.0";

export const ROLES = {
  SUPERADMIN: "SUPERADMIN",
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  SELLER: "SELLER",
  TECHNICIAN: "TECHNICIAN",
  SUPPORT: "SUPPORT",
} as const;

export const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: "Super Admin",
  OWNER: "Propietario",
  ADMIN: "Administrador",
  SELLER: "Vendedor",
  TECHNICIAN: "Técnico",
  SUPPORT: "Soporte",
};

export const ROLE_COLORS: Record<string, string> = {
  SUPERADMIN: "bg-red-100 text-red-700 border-red-200",
  OWNER: "bg-purple-100 text-purple-700 border-purple-200",
  ADMIN: "bg-blue-100 text-blue-700 border-blue-200",
  SELLER: "bg-green-100 text-green-700 border-green-200",
  TECHNICIAN: "bg-yellow-100 text-yellow-700 border-yellow-200",
  SUPPORT: "bg-gray-100 text-gray-700 border-gray-200",
};

export const LEAD_STAGES = [
  { id: "NEW_LEAD", label: "Nuevo Lead", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "CONTACTED", label: "Contactado", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { id: "QUOTED", label: "Cotizado", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { id: "NEGOTIATION", label: "Negociación", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { id: "PENDING_PAYMENT", label: "Pago Pendiente", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: "SOLD", label: "Vendido", color: "bg-green-100 text-green-700 border-green-200" },
  { id: "LOST", label: "Perdido", color: "bg-red-100 text-red-700 border-red-200" },
];

export const LEAD_STAGE_COLORS: Record<string, string> = {
  NEW_LEAD: "bg-blue-100 text-blue-700 border-blue-200",
  CONTACTED: "bg-cyan-100 text-cyan-700 border-cyan-200",
  QUOTED: "bg-yellow-100 text-yellow-700 border-yellow-200",
  NEGOTIATION: "bg-orange-100 text-orange-700 border-orange-200",
  PENDING_PAYMENT: "bg-purple-100 text-purple-700 border-purple-200",
  SOLD: "bg-green-100 text-green-700 border-green-200",
  LOST: "bg-red-100 text-red-700 border-red-200",
};

export const LEAD_STAGE_LABELS: Record<string, string> = {
  NEW_LEAD: "Nuevo Lead",
  CONTACTED: "Contactado",
  QUOTED: "Cotizado",
  NEGOTIATION: "Negociación",
  PENDING_PAYMENT: "Pago Pendiente",
  SOLD: "Vendido",
  LOST: "Perdido",
};

export const CUSTOMER_SOURCE_LABELS: Record<string, string> = {
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  MESSENGER: "Messenger",
  META_ADS: "Meta Ads",
  WEB: "Web",
  REFERRAL: "Referido",
  OTHER: "Otro",
};

export const CUSTOMER_SOURCE_COLORS: Record<string, string> = {
  WHATSAPP: "bg-green-100 text-green-700",
  INSTAGRAM: "bg-pink-100 text-pink-700",
  MESSENGER: "bg-blue-100 text-blue-700",
  META_ADS: "bg-indigo-100 text-indigo-700",
  WEB: "bg-gray-100 text-gray-700",
  REFERRAL: "bg-yellow-100 text-yellow-700",
  OTHER: "bg-slate-100 text-slate-700",
};

export const SALE_STATUS_LABELS: Record<string, string> = {
  PAID: "Pagado",
  PENDING: "Pendiente",
  PARTIAL: "Parcial",
  CANCELLED: "Cancelado",
};

export const SALE_STATUS_COLORS: Record<string, string> = {
  PAID: "bg-green-100 text-green-700 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PARTIAL: "bg-blue-100 text-blue-700 border-blue-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

export const INSTALLATION_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  ASSIGNED: "Asignado",
  ON_WAY: "En Camino",
  IN_PROGRESS: "En Progreso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

export const INSTALLATION_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  ASSIGNED: "bg-blue-100 text-blue-700 border-blue-200",
  ON_WAY: "bg-cyan-100 text-cyan-700 border-cyan-200",
  IN_PROGRESS: "bg-orange-100 text-orange-700 border-orange-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

export const WARRANTY_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Activa",
  EXPIRED: "Vencida",
  VOIDED: "Anulada",
};

export const WARRANTY_STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700 border-green-200",
  EXPIRED: "bg-red-100 text-red-700 border-red-200",
  VOIDED: "bg-gray-100 text-gray-700 border-gray-200",
};

export const QUOTE_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  SENT: "Enviado",
  ACCEPTED: "Aceptado",
  REJECTED: "Rechazado",
};

export const QUOTE_STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  SENT: "bg-blue-100 text-blue-700 border-blue-200",
  ACCEPTED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
};

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/messages", label: "Mensajes", icon: "MessageSquare" },
  { href: "/leads", label: "Leads / Embudo", icon: "Target" },
  { href: "/customers", label: "Clientes", icon: "Users" },
  { href: "/products", label: "Productos", icon: "Package" },
  { href: "/quotes", label: "Cotizaciones", icon: "FileText" },
  { href: "/sales", label: "Ventas", icon: "ShoppingCart" },
  { href: "/installations", label: "Instalaciones", icon: "Wrench" },
  { href: "/team-map", label: "Mapa Equipo", icon: "Map" },
  { href: "/warranties", label: "Garantías", icon: "Shield" },
  { href: "/returns", label: "Devoluciones", icon: "RotateCcw" },
  { href: "/meta-ads", label: "Meta Ads", icon: "TrendingUp" },
  { href: "/web-forms", label: "Web / Formularios", icon: "Globe" },
  { href: "/settings", label: "Configuración", icon: "Settings" },
];

export const CHART_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];
