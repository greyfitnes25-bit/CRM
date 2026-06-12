import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCompanyId } from "@/lib/current-company";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const VALID_STATUSES = new Set(["DRAFT", "SENT", "ACCEPTED", "REJECTED"]);

const quoteStatus = (value: unknown) =>
  VALID_STATUSES.has(String(value)) ? String(value) : "DRAFT";

const mapQuote = (quote: any) => ({
  id: quote.id,
  number: `COT-${quote.id.slice(-6).toUpperCase()}`,
  customerId: quote.customerId,
  customerName: quote.customer.name,
  items: Array.isArray(quote.items) ? quote.items : [],
  subtotal: quote.subtotal,
  discount: quote.discount,
  tax: quote.tax,
  total: quote.total,
  status: quote.status,
  notes: quote.notes ?? "",
  date: quote.createdAt.toISOString().split("T")[0],
});

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const companyId = await getCurrentCompanyId();
  const body = await request.json();

  if (!body.customerId || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Cliente e items son requeridos" }, { status: 400 });
  }

  const quote = await prisma.quote.update({
    where: { id, companyId },
    data: {
      customerId: body.customerId,
      items: body.items,
      subtotal: Number(body.subtotal) || 0,
      discount: Number(body.discount) || 0,
      tax: Number(body.tax) || 0,
      total: Number(body.total) || 0,
      status: quoteStatus(body.status) as any,
      notes: body.notes?.trim() || null,
    },
    include: { customer: { select: { name: true } } },
  });

  return NextResponse.json(mapQuote(quote));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const companyId = await getCurrentCompanyId();
  const body = await request.json();

  const quote = await prisma.quote.update({
    where: { id, companyId },
    data: {
      ...(body.status ? { status: quoteStatus(body.status) as any } : {}),
    },
    include: { customer: { select: { name: true } } },
  });

  return NextResponse.json(mapQuote(quote));
}
