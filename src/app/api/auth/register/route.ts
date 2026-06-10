import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, name, email, password } = body;

    if (!companyName || !name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Check if email exists
    const existingUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email" },
        { status: 409 }
      );
    }

    // Create company slug
    let slug = slugify(companyName);
    const existingCompany = await prisma.company.findUnique({ where: { slug } });
    if (existingCompany) {
      slug = `${slug}-${Date.now()}`;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create company and owner user
    const company = await prisma.company.create({
      data: {
        name: companyName,
        slug,
        users: {
          create: {
            name,
            email: email.toLowerCase(),
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
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Error al crear la cuenta. Por favor intenta de nuevo." },
      { status: 500 }
    );
  }
}
