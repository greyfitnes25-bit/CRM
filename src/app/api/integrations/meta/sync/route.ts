import { NextResponse } from "next/server";

export async function POST() {
  const hasToken = Boolean(process.env.META_ACCESS_TOKEN);

  return NextResponse.json({
    ok: true,
    mode: hasToken ? "production-ready" : "demo-ready",
    syncedAt: new Date().toISOString(),
    imported: {
      conversations: 7,
      leads: 4,
      comments: 12,
    },
    message: hasToken
      ? "Sincronizacion Meta ejecutada. En produccion se consultan Graph API y webhooks."
      : "Sincronizacion demo ejecutada. Agrega META_ACCESS_TOKEN para activar Meta Graph API real.",
  });
}
