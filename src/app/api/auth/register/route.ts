import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, name, email, password } = body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!companyName || !name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Ingresa un correo electronico valido" },
        { status: 400 }
      );
    }

    if (String(password).length < 8) {
      return NextResponse.json(
        { error: "La contrasena debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email" },
        { status: 409 }
      );
    }

    let slug = slugify(companyName);
    const existingCompany = await prisma.company.findUnique({ where: { slug } });
    if (existingCompany) {
      slug = `${slug}-${Date.now()}`;
    }

    const hashedPassword = await bcrypt.hash(String(password), 12);

    const company = await prisma.company.create({
      data: {
        name: String(companyName).trim(),
        slug,
        users: {
          create: {
            name: String(name).trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "OWNER",
            isActive: true,
          },
        },
      },
      include: { users: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Cuenta creada exitosamente",
        companyId: company.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Error al crear la cuenta. Por favor intenta de nuevo." },
      { status: 500 }
    );
  }
}
