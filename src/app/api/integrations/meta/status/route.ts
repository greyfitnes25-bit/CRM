import { NextResponse } from "next/server";

const REQUIRED_ENV = [
  "META_APP_ID",
  "META_BUSINESS_ID",
  "META_PHONE_NUMBER_ID",
  "META_PAGE_ID",
  "META_ACCESS_TOKEN",
];

export async function GET() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  const connected = missing.length === 0;

  return NextResponse.json({
    connected,
    mode: connected ? "production-ready" : "demo-ready",
    channels: [
      { id: "whatsapp", name: "WhatsApp Business", ready: Boolean(process.env.META_PHONE_NUMBER_ID) },
      { id: "instagram", name: "Instagram Messaging", ready: Boolean(process.env.META_PAGE_ID) },
      { id: "messenger", name: "Facebook Messenger", ready: Boolean(process.env.META_PAGE_ID) },
      { id: "meta-ads", name: "Meta Ads Lead Sync", ready: Boolean(process.env.META_BUSINESS_ID) },
    ],
    missing,
    webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://greycrm-grey-management-s-projects.vercel.app"}/api/integrations/meta/webhook`,
    verifyToken: process.env.META_VERIFY_TOKEN || process.env.META_WEBHOOK_VERIFY_TOKEN || "greycrm_meta_verify",
    message: connected
      ? "Meta esta configurado para recibir y enviar eventos reales."
      : "Meta queda en modo demo: el CRM simula sincronizacion hasta que agregues credenciales reales.",
  });
}
