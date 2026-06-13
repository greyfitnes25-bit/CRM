import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCompanyId, getCurrentUserId } from "@/lib/current-company";

const VALID_STATUSES = new Set(["PAID", "PENDING", "PARTIAL", "CANCELLED"]);

const saleStatus = (value: unknown) =>
  VALID_STATUSES.has(String(value)) ? String(value) : "PENDING";

const mapSale = (sale: any) => {
  const items = Array.isArray(sale.items) ? sale.items : [];
  const paymentMethod = sale.paymentMethod ?? "—";

  return {
    id: sale.id,
    number: `VTA-${sale.id.slice(-6).toUpperCase()}`,
    customerId: sale.customerId,
    customerName: sale.customer.name,
    products: items.map((item: any) => item.productName ?? item.name ?? "Producto"),
    items,
    total: sale.total,
    paid: sale.paid,
    pending: sale.pending,
    status: sale.status,
    paymentMethod,
    seller: sale.assignee?.name ?? "Sin asignar",
    date: sale.createdAt.toISOString().split("T")[0],
    payments: sale.paid > 0 ? [{ amount: sale.paid, method: paymentMethod, date: sale.updatedAt.toISOString().split("T")[0] }] : [],
  };
};

export async function GET() {
  const companyId = await getCurrentCompanyId();
  const sales = await prisma.sale.findMany({
    where: { companyId },
    include: {
      customer: { select: { name: true } },
      assignee: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(sales.map(mapSale));
}

export async function POST(request: Request) {
  const companyId = await getCurrentCompanyId();
  const userId = await getCurrentUserId();
  const body = await request.json();
  let customerId = body.customerId;
  let items = body.items;
  let total = Number(body.total) || 0;
  const quoteId = body.quoteId || null;

  if (quoteId) {
    const quote = await prisma.quote.findFirst({
      where: { id: quoteId, companyId },
    });
    if (!quote) return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 });
    customerId = quote.customerId;
    items = quote.items;
    total = quote.total;
  }

  if (!customerId || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cliente e items son requeridos" }, { status: 400 });
  }

  const paid = Number(body.paid) || 0;
  const pending = Math.max(total - paid, 0);
  const sale = await prisma.sale.create({
    data: {
      customerId,
      quoteId,
      assignedTo: userId,
      items,
      total,
      paid,
      pending,
      paymentMethod: body.paymentMethod || null,
      status: saleStatus(body.status || (paid >= total ? "PAID" : paid > 0 ? "PARTIAL" : "PENDING")) as any,
      companyId,
    },
    include: {
      customer: { select: { name: true } },
      assignee: { select: { name: true } },
    },
  });

  return NextResponse.json(mapSale(sale), { status: 201 });
}
