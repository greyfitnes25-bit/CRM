import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCompanyId } from "@/lib/current-company";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const companyId = await getCurrentCompanyId();
  const body = await request.json();
  const current = await prisma.sale.findFirst({
    where: { id, companyId },
  });

  if (!current) return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });

  const extraPaid = Number(body.paymentAmount) || 0;
  const paid = Math.min(current.paid + extraPaid, current.total);
  const pending = Math.max(current.total - paid, 0);
  const sale = await prisma.sale.update({
    where: { id, companyId },
    data: {
      paid,
      pending,
      paymentMethod: body.paymentMethod || current.paymentMethod,
      status: paid >= current.total ? "PAID" : paid > 0 ? "PARTIAL" : "PENDING",
    },
    include: {
      customer: { select: { name: true } },
      assignee: { select: { name: true } },
    },
  });

  return NextResponse.json(mapSale(sale));
}
