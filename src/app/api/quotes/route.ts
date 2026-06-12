import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCompanyId, getCurrentUserId } from "@/lib/current-company";

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

export async function GET() {
  const companyId = await getCurrentCompanyId();
  const quotes = await prisma.quote.findMany({
    where: { companyId },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(quotes.map(mapQuote));
}

export async function POST(request: Request) {
  const companyId = await getCurrentCompanyId();
  const userId = await getCurrentUserId();
  const body = await request.json();

  if (!body.customerId || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Cliente e items son requeridos" }, { status: 400 });
  }

  const quote = await prisma.quote.create({
    data: {
      customerId: body.customerId,
      assignedTo: userId,
      items: body.items,
      subtotal: Number(body.subtotal) || 0,
      discount: Number(body.discount) || 0,
      tax: Number(body.tax) || 0,
      total: Number(body.total) || 0,
      status: quoteStatus(body.status) as any,
      notes: body.notes?.trim() || null,
      companyId,
    },
    include: { customer: { select: { name: true } } },
  });

  return NextResponse.json(mapQuote(quote), { status: 201 });
}
