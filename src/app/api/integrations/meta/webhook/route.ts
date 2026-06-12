import { NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "greycrm_meta_verify";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verificacion de Meta no autorizada" }, { status: 403 });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));

  console.log("Meta webhook event received", {
    object: payload?.object,
    entries: Array.isArray(payload?.entry) ? payload.entry.length : 0,
  });

  return NextResponse.json({
    ok: true,
    received: true,
    message: "Evento Meta recibido por GreyCRM",
  });
}
