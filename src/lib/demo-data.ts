// ============================================================
// DATOS DE DEMOSTRACIÓN — Se reemplazan cuando la BD conecta
// ============================================================
import type { LeadStage, CustomerSource, ConversationChannel, ConversationStatus, MessageDirection } from "@/types";

export interface DemoConversation {
  id: string;
  customer: { id: string; name: string; phone: string | null; avatar: null };
  channel: ConversationChannel;
  status: ConversationStatus;
  assignedTo: string | null;
  lastMessage: string;
  lastMessageAt: Date;
  unread: number;
  tags: string[];
}

export interface DemoMessage {
  id: string;
  content: string;
  direction: MessageDirection;
  senderName: string;
  sentAt: Date;
  type?: "text" | "note";
}

export interface DemoLead {
  id: string;
  customer: { id: string; name: string; phone: string | null };
  stage: LeadStage;
  estimatedValue: number;
  source: CustomerSource;
  assignedTo: string | null;
  lastContact: Date;
  notes: string;
  tags: string[];
}

export const DEMO_CONVERSATIONS: DemoConversation[] = [
  {
    id: "conv-1",
    customer: { id: "c1", name: "María González", phone: "+52 55 1234 5678", avatar: null },
    channel: "WHATSAPP",
    status: "OPEN",
    assignedTo: "Juan Pérez",
    lastMessage: "Hola, ¿me pueden dar información sobre los precios?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 3),
    unread: 2,
    tags: ["Nuevo lead", "Interesado"],
  },
  {
    id: "conv-2",
    customer: { id: "c2", name: "Carlos Rodríguez", phone: "+52 55 9876 5432", avatar: null },
    channel: "INSTAGRAM",
    status: "OPEN",
    assignedTo: "Ana García",
    lastMessage: "Vi tu publicación y me interesó el producto.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 15),
    unread: 0,
    tags: ["Instagram", "Cotización enviada"],
  },
  {
    id: "conv-3",
    customer: { id: "c3", name: "Laura Martínez", phone: "+52 55 4567 8901", avatar: null },
    channel: "MESSENGER",
    status: "PENDING",
    assignedTo: null,
    lastMessage: "¿Tienen garantía en sus productos?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 45),
    unread: 1,
    tags: ["Sin asignar"],
  },
  {
    id: "conv-4",
    customer: { id: "c4", name: "Roberto Silva", phone: "+52 55 3210 9876", avatar: null },
    channel: "WHATSAPP",
    status: "OPEN",
    assignedTo: "Juan Pérez",
    lastMessage: "Perfecto, cuando puedo pasar a verlo?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 90),
    unread: 0,
    tags: ["Cita agendada"],
  },
  {
    id: "conv-5",
    customer: { id: "c5", name: "Sofía Hernández", phone: "+52 55 7890 1234", avatar: null },
    channel: "WHATSAPP",
    status: "CLOSED",
    assignedTo: "Ana García",
    lastMessage: "Muchas gracias por la atención, ya recibí mi pedido.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unread: 0,
    tags: ["Compra completada"],
  },
  {
    id: "conv-6",
    customer: { id: "c6", name: "Miguel Torres", phone: "+52 55 6543 2109", avatar: null },
    channel: "INSTAGRAM",
    status: "OPEN",
    assignedTo: "Juan Pérez",
    lastMessage: "¿Hacen envíos a Guadalajara?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 120),
    unread: 3,
    tags: ["Nuevo lead"],
  },
  {
    id: "conv-7",
    customer: { id: "c7", name: "Valentina Cruz", phone: null, avatar: null },
    channel: "WEB",
    status: "PENDING",
    assignedTo: null,
    lastMessage: "Formulario web: Quiero más información sobre sus servicios.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unread: 1,
    tags: ["Web", "Sin asignar"],
  },
];

export const DEMO_MESSAGES: Record<string, DemoMessage[]> = {
  "conv-1": [
    { id: "m1", content: "Hola, buenos días! Vi su anuncio en Facebook.", direction: "INBOUND", senderName: "María González", sentAt: new Date(Date.now() - 1000 * 60 * 20) },
    { id: "m2", content: "¡Hola María! Buenos días 😊 Con gusto le ayudo. ¿En qué producto está interesada?", direction: "OUTBOUND", senderName: "Juan Pérez", sentAt: new Date(Date.now() - 1000 * 60 * 18) },
    { id: "m3", content: "Estoy interesada en el sistema de cámaras. ¿Tienen paquetes?", direction: "INBOUND", senderName: "María González", sentAt: new Date(Date.now() - 1000 * 60 * 15) },
    { id: "m4", content: "¡Claro! Tenemos 3 paquetes. El básico incluye 4 cámaras HD + DVR + instalación desde $4,500. El profesional incluye 8 cámaras + NVR IP + app móvil desde $8,900. Y el premium con 16 cámaras 4K desde $15,000. ¿Le puedo enviar más detalles?", direction: "OUTBOUND", senderName: "Juan Pérez", sentAt: new Date(Date.now() - 1000 * 60 * 12) },
    { id: "m5", content: "Sí por favor! Y también, ¿hacen instalación?", direction: "INBOUND", senderName: "María González", sentAt: new Date(Date.now() - 1000 * 60 * 8) },
    { id: "m6", content: "📝 Nota interna: Cliente muy interesada en paquete profesional. Enviar catálogo completo y cotización.", direction: "OUTBOUND", senderName: "Juan Pérez", sentAt: new Date(Date.now() - 1000 * 60 * 5), type: "note" },
    { id: "m7", content: "Hola, ¿me pueden dar información sobre los precios?", direction: "INBOUND", senderName: "María González", sentAt: new Date(Date.now() - 1000 * 60 * 3) },
  ],
  "conv-2": [
    { id: "m1", content: "Hola! Vi tu publicación sobre las cámaras de seguridad y me interesó.", direction: "INBOUND", senderName: "Carlos Rodríguez", sentAt: new Date(Date.now() - 1000 * 60 * 60) },
    { id: "m2", content: "¡Hola Carlos! Gracias por escribirnos. ¿Es para tu hogar o negocio?", direction: "OUTBOUND", senderName: "Ana García", sentAt: new Date(Date.now() - 1000 * 60 * 55) },
    { id: "m3", content: "Para mi negocio, tengo una tienda de ropa.", direction: "INBOUND", senderName: "Carlos Rodríguez", sentAt: new Date(Date.now() - 1000 * 60 * 50) },
    { id: "m4", content: "Perfecto! Para negocios recomendamos el sistema profesional. Te envié una cotización por WhatsApp. ¿Lo revisaste?", direction: "OUTBOUND", senderName: "Ana García", sentAt: new Date(Date.now() - 1000 * 60 * 20) },
    { id: "m5", content: "Vi tu publicación y me interesó el producto.", direction: "INBOUND", senderName: "Carlos Rodríguez", sentAt: new Date(Date.now() - 1000 * 60 * 15) },
  ],
  "conv-3": [
    { id: "m1", content: "Buenos días, quiero saber si sus productos tienen garantía.", direction: "INBOUND", senderName: "Laura Martínez", sentAt: new Date(Date.now() - 1000 * 60 * 45) },
  ],
  "conv-4": [
    { id: "m1", content: "Hola, estoy interesado en el sistema de alarma.", direction: "INBOUND", senderName: "Roberto Silva", sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3) },
    { id: "m2", content: "¡Hola Roberto! Con gusto le asesoro. ¿Qué tipo de propiedad desea proteger?", direction: "OUTBOUND", senderName: "Juan Pérez", sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2.9) },
    { id: "m3", content: "Una casa de dos pisos.", direction: "INBOUND", senderName: "Roberto Silva", sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: "m4", content: "Perfecto, le recomiendo nuestro paquete residencial completo. Le incluye sensores en puertas y ventanas, detección de movimiento y monitoreo 24/7. ¿Le agendaría una visita sin costo para hacer el levantamiento?", direction: "OUTBOUND", senderName: "Juan Pérez", sentAt: new Date(Date.now() - 1000 * 60 * 100) },
    { id: "m5", content: "Perfecto, cuando puedo pasar a verlo?", direction: "INBOUND", senderName: "Roberto Silva", sentAt: new Date(Date.now() - 1000 * 60 * 90) },
  ],
  "conv-5": [
    { id: "m1", content: "Hola, ¿ya salió mi pedido?", direction: "INBOUND", senderName: "Sofía Hernández", sentAt: new Date(Date.now() - 1000 * 60 * 60 * 7) },
    { id: "m2", content: "¡Hola Sofía! Sí, tu pedido ya salió para entrega. Llega hoy entre 2-6pm.", direction: "OUTBOUND", senderName: "Ana García", sentAt: new Date(Date.now() - 1000 * 60 * 60 * 6.5) },
    { id: "m3", content: "Muchas gracias por la atención, ya recibí mi pedido.", direction: "INBOUND", senderName: "Sofía Hernández", sentAt: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  ],
  "conv-6": [
    { id: "m1", content: "Hola vi su anuncio. ¿Hacen envíos a Guadalajara?", direction: "INBOUND", senderName: "Miguel Torres", sentAt: new Date(Date.now() - 1000 * 60 * 130) },
    { id: "m2", content: "¿Hacen envíos a Guadalajara?", direction: "INBOUND", senderName: "Miguel Torres", sentAt: new Date(Date.now() - 1000 * 60 * 125) },
    { id: "m3", content: "¿Hacen envíos a Guadalajara?", direction: "INBOUND", senderName: "Miguel Torres", sentAt: new Date(Date.now() - 1000 * 60 * 120) },
  ],
  "conv-7": [
    { id: "m1", content: "Formulario web: Quiero más información sobre sus servicios. Empresa: Distribuidora XYZ. Teléfono: 33 4567 8901.", direction: "INBOUND", senderName: "Valentina Cruz", sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  ],
};

export const DEMO_QUICK_REPLIES = [
  { id: "qr1", title: "Saludo inicial", content: "¡Hola! 👋 Gracias por contactarnos. Soy {nombre} de GreyCRM, ¿en qué puedo ayudarte hoy?" },
  { id: "qr2", title: "Solicitar datos", content: "Para poder ayudarte mejor, ¿me podrías proporcionar tu nombre completo y número de teléfono?" },
  { id: "qr3", title: "Enviar catálogo", content: "Con gusto te comparto nuestro catálogo completo. ¿Me das tu email o te lo envío por WhatsApp?" },
  { id: "qr4", title: "Agendar visita", content: "Podemos agendar una visita sin costo para hacer el levantamiento y darte una cotización exacta. ¿Qué día y horario te viene mejor?" },
  { id: "qr5", title: "Tiempo de respuesta", content: "Gracias por tu mensaje. En este momento estamos con alta demanda, te respondo en los próximos 15-30 minutos ⏱️" },
  { id: "qr6", title: "Garantía", content: "Todos nuestros productos tienen garantía de {meses} meses. Incluye mano de obra y refacciones sin costo adicional." },
  { id: "qr7", title: "Cierre de venta", content: "¡Excelente decisión! 🎉 Para continuar con tu pedido necesito confirmar tu dirección de instalación y forma de pago preferida." },
  { id: "qr8", title: "Despedida", content: "Fue un placer atenderte. Si tienes alguna otra pregunta o necesitas soporte, no dudes en escribirnos. ¡Que tengas excelente día! 😊" },
];

// ============================================================
// DATOS DEMO PARA KANBAN
// ============================================================

export const DEMO_LEADS: DemoLead[] = [
  {
    id: "lead-1",
    customer: { id: "c1", name: "María González", phone: "+52 55 1234 5678" },
    stage: "NEW_LEAD",
    estimatedValue: 8900,
    source: "META_ADS",
    assignedTo: "Juan Pérez",
    lastContact: new Date(Date.now() - 1000 * 60 * 30),
    notes: "Interesada en paquete profesional de cámaras",
    tags: ["Urgente", "Meta Ads"],
  },
  {
    id: "lead-2",
    customer: { id: "c6", name: "Miguel Torres", phone: "+52 55 6543 2109" },
    stage: "NEW_LEAD",
    estimatedValue: 4500,
    source: "INSTAGRAM",
    assignedTo: "Ana García",
    lastContact: new Date(Date.now() - 1000 * 60 * 120),
    notes: "Preguntó por envíos a Guadalajara",
    tags: ["Instagram"],
  },
  {
    id: "lead-3",
    customer: { id: "c7", name: "Valentina Cruz", phone: null },
    stage: "NEW_LEAD",
    estimatedValue: 6000,
    source: "WEB",
    assignedTo: null,
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 3),
    notes: "Formulario web, distribuidora",
    tags: ["Web", "Sin asignar"],
  },
  {
    id: "lead-4",
    customer: { id: "c2", name: "Carlos Rodríguez", phone: "+52 55 9876 5432" },
    stage: "CONTACTED",
    estimatedValue: 12000,
    source: "INSTAGRAM",
    assignedTo: "Ana García",
    lastContact: new Date(Date.now() - 1000 * 60 * 15),
    notes: "Negocio: tienda de ropa. Quiere paquete profesional.",
    tags: ["Negocio", "Alto valor"],
  },
  {
    id: "lead-5",
    customer: { id: "c3", name: "Laura Martínez", phone: "+52 55 4567 8901" },
    stage: "CONTACTED",
    estimatedValue: 4500,
    source: "WHATSAPP",
    assignedTo: null,
    lastContact: new Date(Date.now() - 1000 * 60 * 45),
    notes: "Preguntó por garantías",
    tags: ["Sin asignar"],
  },
  {
    id: "lead-6",
    customer: { id: "c8", name: "Fernando López", phone: "+52 55 2345 6789" },
    stage: "QUOTED",
    estimatedValue: 15000,
    source: "META_ADS",
    assignedTo: "Juan Pérez",
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 2),
    notes: "Cotización enviada: paquete premium 16 cámaras",
    tags: ["Cotización enviada", "Alto valor"],
  },
  {
    id: "lead-7",
    customer: { id: "c9", name: "Patricia Jiménez", phone: "+52 55 8901 2345" },
    stage: "QUOTED",
    estimatedValue: 8900,
    source: "WHATSAPP",
    assignedTo: "Ana García",
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 5),
    notes: "Espera aprobación de su esposo",
    tags: ["En espera"],
  },
  {
    id: "lead-8",
    customer: { id: "c4", name: "Roberto Silva", phone: "+52 55 3210 9876" },
    stage: "NEGOTIATION",
    estimatedValue: 9500,
    source: "REFERRAL",
    assignedTo: "Juan Pérez",
    lastContact: new Date(Date.now() - 1000 * 60 * 90),
    notes: "Pide descuento del 10%. Muy interesado.",
    tags: ["Negociando", "Referido"],
  },
  {
    id: "lead-9",
    customer: { id: "c10", name: "Daniela Moreno", phone: "+52 55 5678 9012" },
    stage: "NEGOTIATION",
    estimatedValue: 6800,
    source: "META_ADS",
    assignedTo: "Ana García",
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 8),
    notes: "Solicita financiamiento a 6 meses",
    tags: ["Financiamiento"],
  },
  {
    id: "lead-10",
    customer: { id: "c11", name: "Alejandro Ruiz", phone: "+52 55 1122 3344" },
    stage: "PENDING_PAYMENT",
    estimatedValue: 4500,
    source: "WHATSAPP",
    assignedTo: "Juan Pérez",
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 1),
    notes: "Realizará transferencia hoy por la tarde",
    tags: ["Pago pendiente"],
  },
  {
    id: "lead-11",
    customer: { id: "c12", name: "Isabel Castro", phone: "+52 55 4455 6677" },
    stage: "SOLD",
    estimatedValue: 12000,
    source: "META_ADS",
    assignedTo: "Ana García",
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24),
    notes: "Venta cerrada. Instalación agendada para el viernes.",
    tags: ["Venta cerrada"],
  },
  {
    id: "lead-12",
    customer: { id: "c13", name: "Eduardo Vargas", phone: "+52 55 7788 9900" },
    stage: "SOLD",
    estimatedValue: 8900,
    source: "REFERRAL",
    assignedTo: "Juan Pérez",
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 48),
    notes: "Pagó en efectivo. Instalado y entregado.",
    tags: ["Completado"],
  },
  {
    id: "lead-13",
    customer: { id: "c14", name: "Gabriela Soto", phone: "+52 55 3344 5566" },
    stage: "LOST",
    estimatedValue: 4500,
    source: "INSTAGRAM",
    assignedTo: "Ana García",
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 72),
    notes: "Eligió a la competencia por precio",
    tags: ["Perdido - precio"],
  },
];
