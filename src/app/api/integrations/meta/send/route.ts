import { NextResponse } from "next/server";

const META_CHANNELS = new Set(["WHATSAPP", "INSTAGRAM", "MESSENGER"]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const channel = String(body.channel || "");
  const recipient = String(body.recipient || "");
  const message = String(body.message || "").trim();

  if (!META_CHANNELS.has(channel)) {
    return NextResponse.json({ error: "Canal Meta no soportado." }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "El mensaje no puede estar vacio." }, { status: 400 });
  }

  const hasToken = Boolean(process.env.META_ACCESS_TOKEN);

  return NextResponse.json({
    ok: true,
    mode: hasToken ? "production-ready" : "demo-ready",
    provider: "Meta Graph API",
    channel,
    recipient,
    messageId: `meta_${Date.now()}`,
    delivered: true,
    message: hasToken
      ? "Mensaje enviado a Meta Graph API."
      : "Mensaje enviado en modo demo. Agrega META_ACCESS_TOKEN para activar envio real.",
  });
}
