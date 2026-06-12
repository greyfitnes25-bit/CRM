import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCompanyId } from "@/lib/current-company";

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

export async function GET() {
  const companyId = await getCurrentCompanyId();
  const products = await prisma.product.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products.map(mapProduct));
}

export async function POST(request: Request) {
  const companyId = await getCurrentCompanyId();
  const body = await request.json();

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name: body.name.trim(),
      description: body.description?.trim() || null,
      price: Number(body.price) || 0,
      category: body.category || "Servicios",
      image: body.image || null,
      isAvailable: Boolean(body.isAvailable ?? true),
      requiresInstallation: Boolean(body.requiresInstallation),
      warrantyMonths: Number(body.warrantyMonths) || 0,
      companyId,
    },
  });

  return NextResponse.json(mapProduct(product), { status: 201 });
}
