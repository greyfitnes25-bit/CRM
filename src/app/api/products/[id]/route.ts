import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCompanyId } from "@/lib/current-company";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const mapProduct = (product: {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image: string | null;
  isAvailable: boolean;
  requiresInstallation: boolean;
  warrantyMonths: number;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: product.id,
  name: product.name,
  description: product.description ?? "",
  price: product.price,
  category: product.category ?? "Servicios",
  image: product.image,
  isAvailable: product.isAvailable,
  requiresInstallation: product.requiresInstallation,
  warrantyMonths: product.warrantyMonths,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const companyId = await getCurrentCompanyId();
  const body = await request.json();

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id, companyId },
    data: {
      name: body.name.trim(),
      description: body.description?.trim() || null,
      price: Number(body.price) || 0,
      category: body.category || "Servicios",
      image: body.image || null,
      isAvailable: Boolean(body.isAvailable),
      requiresInstallation: Boolean(body.requiresInstallation),
      warrantyMonths: Number(body.warrantyMonths) || 0,
    },
  });

  return NextResponse.json(mapProduct(product));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const companyId = await getCurrentCompanyId();
  const body = await request.json();

  const product = await prisma.product.update({
    where: { id, companyId },
    data: {
      ...(typeof body.isAvailable === "boolean" ? { isAvailable: body.isAvailable } : {}),
      ...(typeof body.requiresInstallation === "boolean" ? { requiresInstallation: body.requiresInstallation } : {}),
      ...(typeof body.price === "number" ? { price: body.price } : {}),
    },
  });

  return NextResponse.json(mapProduct(product));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const companyId = await getCurrentCompanyId();

  await prisma.product.delete({
    where: { id, companyId },
  });

  return NextResponse.json({ ok: true });
}
