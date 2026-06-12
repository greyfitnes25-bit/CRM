import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCompanyId, getCurrentUserId } from "@/lib/current-company";
import type { CustomerSource } from "@/types";

const VALID_SOURCES = new Set(["WHATSAPP", "INSTAGRAM", "MESSENGER", "META_ADS", "WEB", "REFERRAL", "OTHER"]);

function source(value: unknown): CustomerSource {
  return VALID_SOURCES.has(String(value)) ? (String(value) as CustomerSource) : "OTHER";
}

export async function GET() {
  try {
    const companyId = await getCurrentCompanyId();
    const customers = await prisma.customer.findMany({
      where: { companyId },
      include: {
        assignee: { select: { name: true } },
        conversations: { select: { id: true } },
        quotes: { select: { id: true } },
        sales: { select: { id: true } },
        warranties: { select: { id: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      phone: customer.phone ?? "",
      whatsapp: customer.whatsapp ?? "",
      email: customer.email ?? "",
      instagram: customer.instagram ?? "",
      city: customer.city ?? "",
      address: customer.address ?? "",
      source: customer.source,
      tags: customer.tags,
      notes: customer.notes ?? "",
      assignedTo: customer.assignee?.name ?? "",
      assignedToId: customer.assignedTo,
      lastActivity: customer.updatedAt.toISOString(),
      conversations: customer.conversations.length,
      quotes: customer.quotes.length,
      sales: customer.sales.length,
      warranties: customer.warranties.length,
    })));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const companyId = await getCurrentCompanyId();
    const userId = await getCurrentUserId();
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }

    const customer = await prisma.customer.create({
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
        assignedTo: userId,
        companyId,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
