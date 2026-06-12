import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCompanyId } from "@/lib/current-company";
import type { CustomerSource } from "@/types";

const VALID_SOURCES = new Set(["WHATSAPP", "INSTAGRAM", "MESSENGER", "META_ADS", "WEB", "REFERRAL", "OTHER"]);

function source(value: unknown): CustomerSource {
  return VALID_SOURCES.has(String(value)) ? (String(value) as CustomerSource) : "OTHER";
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const companyId = await getCurrentCompanyId();
    const { id } = await params;
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }

    const customer = await prisma.customer.update({
      where: { id, companyId },
      data: {
        name: body.name.trim(),
        phone: body.phone || null,
        whatsapp: body.whatsapp || null,
        email: body.email || null,
        instagram: body.instagram || null,
        city: body.city || null,
        address: body.address || null,
        source: source(body.source),
        tags: Array.isArray(body.tags) ? body.tags : [],
        notes: body.notes || null,
      },
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const companyId = await getCurrentCompanyId();
    const { id } = await params;
    await prisma.customer.delete({ where: { id, companyId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
