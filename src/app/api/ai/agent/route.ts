import { NextResponse } from "next/server";

const positiveWords = ["gracias", "perfecto", "excelente", "interesado", "cotizar", "disponibilidad", "instalar"];
const urgentWords = ["urgente", "hoy", "manana", "esta semana", "rapido", "problema", "falla", "garantia"];
const priceWords = ["precio", "costo", "cuanto", "cotizacion", "pagar", "presupuesto"];
const complaintWords = ["molesto", "enojo", "malo", "reclamo", "no funciona", "falla", "garantia"];

function countMatches(text: string, words: string[]) {
  return words.reduce((total, word) => total + (text.includes(word) ? 1 : 0), 0);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const message = String(body.message || "").trim();
  const agent = String(body.agent || "Recepcionista IA");

  if (!message) {
    return NextResponse.json({ error: "Escribe un mensaje para que la IA lo analice." }, { status: 400 });
  }

  const text = message.toLowerCase();
  const urgency = countMatches(text, urgentWords);
  const price = countMatches(text, priceWords);
  const complaint = countMatches(text, complaintWords);
  const positive = countMatches(text, positiveWords);

  const intent =
    complaint > 0 ? "Soporte / garantia" :
    price > 0 ? "Cotizacion" :
    urgency > 0 ? "Instalacion urgente" :
    positive > 0 ? "Lead interesado" :
    "Consulta general";

  const priority = complaint > 0 || urgency > 1 ? "Alta" : price > 0 || positive > 0 ? "Media" : "Normal";
  const qualityScore = Math.min(98, 72 + positive * 5 + price * 4 + urgency * 3 - complaint * 2);
  const leadScore = Math.min(100, 58 + price * 14 + urgency * 10 + positive * 8 + complaint * 4);

  const reply =
    complaint > 0
      ? "Hola, lamento mucho la situacion. Voy a ayudarte de inmediato. Por favor enviame el numero de factura, una foto o video de la falla y la ubicacion del equipo para abrir el caso de garantia con prioridad."
      : price > 0
        ? "Hola, gracias por escribirnos. Con gusto te preparo una cotizacion. Para darte un precio correcto necesito ubicacion, cantidad de equipos, tipo de instalacion y si ya tienes internet disponible en el lugar."
        : urgency > 0
          ? "Hola, tenemos disponibilidad para coordinar. Enviame tu ubicacion, horario preferido y el producto que deseas instalar para validar agenda con el tecnico mas cercano."
          : "Hola, gracias por contactar a GreyCRM Demo. Estoy aqui para ayudarte. Cuentame que necesitas, en que ciudad estas y si prefieres recibir informacion por WhatsApp o correo.";

  const actions = [
    priority === "Alta" ? "Notificar supervisor" : "Asignar vendedor disponible",
    intent === "Cotizacion" ? "Crear cotizacion preliminar" : "Crear lead en embudo",
    "Guardar resumen en la ficha del cliente",
  ];

  return NextResponse.json({
    agent,
    intent,
    priority,
    qualityScore,
    leadScore,
    reply,
    actions,
    summary: `Intencion detectada: ${intent}. Prioridad ${priority}. Lead score ${leadScore}%.`,
  });
}
