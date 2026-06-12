import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCompanyId } from "@/lib/current-company";

const MAX_IMAGE_LENGTH = 1_500_000;

const productPayload = (body: any, companyId: string) => {
  const image = typeof body.image === "string" ? body.image : "";

  if (image.length > MAX_IMAGE_LENGTH) {
    throw new Error("La imagen es demasiado pesada. Usa una imagen mas ligera o pega una URL.");
  }

  return {
    name: body.name.trim(),
    description: body.description?.trim() || null,
    price: Number(body.price) || 0,
    category: body.category || "Servicios",
    image: image || null,
    isAvailable: Boolean(body.isAvailable ?? true),
    requiresInstallation: Boolean(body.requiresInstallation),
    warrantyMonths: Number(body.warrantyMonths) || 0,
    companyId,
  };
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

export async function GET() {
  const companyId = await getCurrentCompanyId();
  const products = await prisma.product.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products.map(mapProduct));
}

export async function POST(request: Request) {
  try {
    const companyId = await getCurrentCompanyId();
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: productPayload(body, companyId),
    });

    return NextResponse.json(mapProduct(product), { status: 201 });
  } catch (error) {
    console.error("Error creating product", error);
    const message = error instanceof Error ? error.message : "No se pudo guardar el producto.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
