import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clean database
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.warrantyCase.deleteMany();
  await prisma.return.deleteMany();
  await prisma.warranty.deleteMany();
  await prisma.installation.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.quickReply.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log("✅ Database cleaned");

  // Create company
  const company = await prisma.company.create({
    data: {
      name: "GreyCRM Demo",
      slug: "greycrm-demo",
      primaryColor: "#3B82F6",
      secondaryColor: "#1E40AF",
      currency: "USD",
      timezone: "America/Mexico_City",
      plan: "PROFESSIONAL",
      isActive: true,
    },
  });
  console.log(`✅ Company created: ${company.name}`);

  // Hash password for all demo users
  const hashedPassword = await bcrypt.hash("demo123", 12);

  // Create users
  const owner = await prisma.user.create({
    data: {
      name: "Admin GreyCRM",
      email: "admin@greycrm.com",
      password: hashedPassword,
      role: "OWNER",
      companyId: company.id,
      isActive: true,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Laura Administradora",
      email: "laura@greycrm.com",
      password: hashedPassword,
      role: "ADMIN",
      companyId: company.id,
      isActive: true,
    },
  });

  const seller1 = await prisma.user.create({
    data: {
      name: "Ana Martínez",
      email: "ana@greycrm.com",
      password: hashedPassword,
      role: "SELLER",
      companyId: company.id,
      isActive: true,
    },
  });

  const seller2 = await prisma.user.create({
    data: {
      name: "Carlos López",
      email: "carlos@greycrm.com",
      password: hashedPassword,
      role: "SELLER",
      companyId: company.id,
      isActive: true,
    },
  });

  const technician = await prisma.user.create({
    data: {
      name: "Roberto Técnico",
      email: "roberto@greycrm.com",
      password: hashedPassword,
      role: "TECHNICIAN",
      companyId: company.id,
      isActive: true,
    },
  });

  console.log("✅ Users created (5)");

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Minisplit 12,000 BTU",
        description: "Aire acondicionado inverter 12,000 BTU, alta eficiencia energética",
        price: 8500,
        category: "Aire Acondicionado",
        isAvailable: true,
        requiresInstallation: true,
        warrantyMonths: 12,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Minisplit 18,000 BTU",
        description: "Aire acondicionado inverter 18,000 BTU con WiFi incluido",
        price: 11500,
        category: "Aire Acondicionado",
        isAvailable: true,
        requiresInstallation: true,
        warrantyMonths: 18,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Minisplit 24,000 BTU",
        description: "Aire acondicionado industrial 24,000 BTU para espacios grandes",
        price: 15000,
        category: "Aire Acondicionado",
        isAvailable: true,
        requiresInstallation: true,
        warrantyMonths: 24,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Split Techo 36,000 BTU",
        description: "Unidad de techo de alta capacidad para locales comerciales",
        price: 28000,
        category: "Aire Acondicionado Comercial",
        isAvailable: true,
        requiresInstallation: true,
        warrantyMonths: 24,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Kit de Instalación Estándar",
        description: "Kit completo para instalación: tuberías, soportes, cable y carga de refrigerante",
        price: 1200,
        category: "Instalación",
        isAvailable: true,
        requiresInstallation: false,
        warrantyMonths: 0,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Kit de Instalación Premium",
        description: "Kit premium con tuberías de cobre, soporte antivibración y carga R32",
        price: 2500,
        category: "Instalación",
        isAvailable: true,
        requiresInstallation: false,
        warrantyMonths: 0,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Mantenimiento Preventivo",
        description: "Limpieza profunda de filtros, revisión de gas y calibración del equipo",
        price: 800,
        category: "Mantenimiento",
        isAvailable: true,
        requiresInstallation: false,
        warrantyMonths: 0,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Termostato Inteligente",
        description: "Termostato WiFi compatible con Google Home y Alexa",
        price: 1800,
        category: "Accesorios",
        isAvailable: true,
        requiresInstallation: false,
        warrantyMonths: 12,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Purificador de Aire",
        description: "Purificador con filtro HEPA y luz UV para eliminar bacterias",
        price: 3200,
        category: "Calidad del Aire",
        isAvailable: true,
        requiresInstallation: false,
        warrantyMonths: 12,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Gas Refrigerante R32",
        description: "Carga de gas refrigerante ecológico R32 - por kg",
        price: 450,
        category: "Materiales",
        isAvailable: true,
        requiresInstallation: false,
        warrantyMonths: 0,
        companyId: company.id,
      },
    }),
  ]);

  console.log("✅ Products created (10)");

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: { name: "María González", email: "maria@email.com", phone: "555-0101", whatsapp: "+525550101", city: "CDMX", source: "WHATSAPP", tags: ["residencial", "nuevo"], companyId: company.id, assignedTo: seller1.id },
    }),
    prisma.customer.create({
      data: { name: "Juan Pérez", email: "juan@email.com", phone: "555-0102", whatsapp: "+525550102", city: "Monterrey", source: "INSTAGRAM", tags: ["comercial"], companyId: company.id, assignedTo: seller1.id },
    }),
    prisma.customer.create({
      data: { name: "Ana López", email: "ana@email.com", phone: "555-0103", instagram: "@analopez", city: "Guadalajara", source: "META_ADS", tags: ["residencial", "vip"], companyId: company.id, assignedTo: seller2.id },
    }),
    prisma.customer.create({
      data: { name: "Roberto Sánchez", phone: "555-0104", whatsapp: "+525550104", city: "CDMX", source: "REFERRAL", tags: ["industrial"], companyId: company.id, assignedTo: seller2.id },
    }),
    prisma.customer.create({
      data: { name: "Patricia Ruiz", email: "patricia@email.com", phone: "555-0105", city: "Puebla", source: "WEB", companyId: company.id, assignedTo: seller1.id },
    }),
    prisma.customer.create({
      data: { name: "Fernando Castro", email: "fernando@email.com", whatsapp: "+525550106", city: "CDMX", source: "WHATSAPP", companyId: company.id, assignedTo: seller2.id },
    }),
    prisma.customer.create({
      data: { name: "Claudia Mendoza", phone: "555-0107", instagram: "@claudiamendoza", city: "Monterrey", source: "INSTAGRAM", tags: ["residencial"], companyId: company.id },
    }),
    prisma.customer.create({
      data: { name: "Diego Torres", email: "diego@empresa.com", phone: "555-0108", city: "CDMX", source: "META_ADS", tags: ["comercial", "vip"], companyId: company.id, assignedTo: seller1.id },
    }),
    prisma.customer.create({
      data: { name: "Sofía Vargas", phone: "555-0109", whatsapp: "+525550109", city: "Querétaro", source: "WHATSAPP", companyId: company.id, assignedTo: seller2.id },
    }),
    prisma.customer.create({
      data: { name: "Miguel Herrera", email: "miguel@email.com", city: "Guadalajara", source: "REFERRAL", tags: ["industrial", "recurrente"], companyId: company.id, assignedTo: seller1.id },
    }),
    prisma.customer.create({
      data: { name: "Isabel Flores", phone: "555-0111", whatsapp: "+525550111", city: "CDMX", source: "WHATSAPP", companyId: company.id },
    }),
    prisma.customer.create({
      data: { name: "Alejandro Reyes", email: "alejandro@email.com", city: "León", source: "META_ADS", companyId: company.id, assignedTo: seller2.id },
    }),
    prisma.customer.create({
      data: { name: "Valentina Cruz", instagram: "@valentinacruz", city: "CDMX", source: "INSTAGRAM", companyId: company.id, assignedTo: seller1.id },
    }),
    prisma.customer.create({
      data: { name: "Héctor Jiménez", phone: "555-0114", email: "hector@empresa.mx", city: "Monterrey", source: "WEB", tags: ["comercial"], companyId: company.id },
    }),
    prisma.customer.create({
      data: { name: "Natalia Morales", phone: "555-0115", whatsapp: "+525550115", city: "CDMX", source: "REFERRAL", companyId: company.id, assignedTo: seller2.id },
    }),
    prisma.customer.create({
      data: { name: "Gustavo Ramírez", email: "gustavo@email.com", city: "Mérida", source: "META_ADS", companyId: company.id },
    }),
    prisma.customer.create({
      data: { name: "Marcela Aguilar", phone: "555-0117", whatsapp: "+525550117", city: "CDMX", source: "WHATSAPP", companyId: company.id, assignedTo: seller1.id },
    }),
    prisma.customer.create({
      data: { name: "Oscar Delgado", email: "oscar@email.com", city: "Guadalajara", source: "INSTAGRAM", companyId: company.id, assignedTo: seller2.id },
    }),
    prisma.customer.create({
      data: { name: "Verónica Ortega", phone: "555-0119", city: "Puebla", source: "WEB", companyId: company.id },
    }),
    prisma.customer.create({
      data: { name: "Luis Campos", email: "luis@empresa.com", phone: "555-0120", whatsapp: "+525550120", city: "CDMX", source: "REFERRAL", tags: ["vip", "recurrente"], companyId: company.id, assignedTo: seller1.id },
    }),
  ]);

  console.log("✅ Customers created (20)");

  // Create leads
  const leads = await Promise.all([
    prisma.lead.create({ data: { customerId: customers[0].id, stage: "NEW_LEAD", estimatedValue: 10500, source: "WHATSAPP", assignedTo: seller1.id, companyId: company.id, lastContact: new Date() } }),
    prisma.lead.create({ data: { customerId: customers[1].id, stage: "CONTACTED", estimatedValue: 8500, source: "INSTAGRAM", assignedTo: seller1.id, companyId: company.id, lastContact: new Date(Date.now() - 86400000) } }),
    prisma.lead.create({ data: { customerId: customers[2].id, stage: "QUOTED", estimatedValue: 15000, source: "META_ADS", assignedTo: seller2.id, companyId: company.id, lastContact: new Date(Date.now() - 2 * 86400000) } }),
    prisma.lead.create({ data: { customerId: customers[3].id, stage: "NEGOTIATION", estimatedValue: 28000, source: "REFERRAL", assignedTo: seller2.id, companyId: company.id, lastContact: new Date(Date.now() - 3 * 86400000) } }),
    prisma.lead.create({ data: { customerId: customers[4].id, stage: "PENDING_PAYMENT", estimatedValue: 9700, source: "WEB", assignedTo: seller1.id, companyId: company.id, lastContact: new Date(Date.now() - 86400000) } }),
    prisma.lead.create({ data: { customerId: customers[5].id, stage: "SOLD", estimatedValue: 13200, source: "WHATSAPP", assignedTo: seller2.id, companyId: company.id } }),
    prisma.lead.create({ data: { customerId: customers[6].id, stage: "LOST", estimatedValue: 8500, source: "INSTAGRAM", companyId: company.id, notes: "Decidió comprar con la competencia por precio" } }),
    prisma.lead.create({ data: { customerId: customers[7].id, stage: "NEW_LEAD", estimatedValue: 45000, source: "META_ADS", assignedTo: seller1.id, companyId: company.id, lastContact: new Date() } }),
    prisma.lead.create({ data: { customerId: customers[8].id, stage: "CONTACTED", estimatedValue: 10500, source: "WHATSAPP", assignedTo: seller2.id, companyId: company.id } }),
    prisma.lead.create({ data: { customerId: customers[9].id, stage: "QUOTED", estimatedValue: 11500, source: "REFERRAL", assignedTo: seller1.id, companyId: company.id } }),
    prisma.lead.create({ data: { customerId: customers[10].id, stage: "NEW_LEAD", estimatedValue: 8500, source: "WHATSAPP", companyId: company.id } }),
    prisma.lead.create({ data: { customerId: customers[11].id, stage: "CONTACTED", estimatedValue: 12000, source: "META_ADS", assignedTo: seller2.id, companyId: company.id } }),
    prisma.lead.create({ data: { customerId: customers[12].id, stage: "NEGOTIATION", estimatedValue: 9700, source: "INSTAGRAM", assignedTo: seller1.id, companyId: company.id } }),
    prisma.lead.create({ data: { customerId: customers[13].id, stage: "PENDING_PAYMENT", estimatedValue: 16500, source: "WEB", companyId: company.id } }),
    prisma.lead.create({ data: { customerId: customers[14].id, stage: "SOLD", estimatedValue: 14200, source: "REFERRAL", assignedTo: seller2.id, companyId: company.id } }),
  ]);

  console.log("✅ Leads created (15)");

  // Create quotes
  const quoteItems = [
    { productName: "Minisplit 12,000 BTU", quantity: 1, price: 8500, total: 8500 },
    { productName: "Kit de Instalación Estándar", quantity: 1, price: 1200, total: 1200 },
  ];

  const quotes = await Promise.all([
    prisma.quote.create({
      data: {
        customerId: customers[2].id,
        assignedTo: seller2.id,
        items: quoteItems,
        subtotal: 9700,
        discount: 0,
        tax: 1552,
        total: 11252,
        status: "SENT",
        companyId: company.id,
      },
    }),
    prisma.quote.create({
      data: {
        customerId: customers[5].id,
        assignedTo: seller2.id,
        items: [
          { productName: "Minisplit 18,000 BTU", quantity: 1, price: 11500, total: 11500 },
          { productName: "Kit de Instalación Premium", quantity: 1, price: 2500, total: 2500 },
        ],
        subtotal: 14000,
        discount: 700,
        tax: 2128,
        total: 15428,
        status: "ACCEPTED",
        companyId: company.id,
      },
    }),
    prisma.quote.create({
      data: {
        customerId: customers[7].id,
        assignedTo: seller1.id,
        items: [
          { productName: "Split Techo 36,000 BTU", quantity: 2, price: 28000, total: 56000 },
          { productName: "Kit de Instalación Premium", quantity: 2, price: 2500, total: 5000 },
        ],
        subtotal: 61000,
        discount: 3000,
        tax: 9280,
        total: 67280,
        status: "DRAFT",
        companyId: company.id,
      },
    }),
    prisma.quote.create({
      data: {
        customerId: customers[9].id,
        assignedTo: seller1.id,
        items: [
          { productName: "Minisplit 18,000 BTU", quantity: 1, price: 11500, total: 11500 },
        ],
        subtotal: 11500,
        discount: 0,
        tax: 1840,
        total: 13340,
        status: "SENT",
        companyId: company.id,
      },
    }),
    prisma.quote.create({
      data: {
        customerId: customers[1].id,
        assignedTo: seller1.id,
        items: [
          { productName: "Minisplit 12,000 BTU", quantity: 1, price: 8500, total: 8500 },
          { productName: "Kit de Instalación Estándar", quantity: 1, price: 1200, total: 1200 },
        ],
        subtotal: 9700,
        discount: 500,
        tax: 1472,
        total: 10672,
        status: "REJECTED",
        companyId: company.id,
      },
    }),
  ]);

  console.log("✅ Quotes created (5)");

  // Create sales
  const sales = await Promise.all([
    prisma.sale.create({
      data: {
        customerId: customers[5].id,
        quoteId: quotes[1].id,
        assignedTo: seller2.id,
        items: quotes[1].items as any,
        total: 15428,
        paid: 15428,
        pending: 0,
        paymentMethod: "Transferencia",
        status: "PAID",
        companyId: company.id,
      },
    }),
    prisma.sale.create({
      data: {
        customerId: customers[14].id,
        assignedTo: seller2.id,
        items: [{ productName: "Minisplit 24,000 BTU", quantity: 1, price: 15000, total: 15000 }],
        total: 15000,
        paid: 7500,
        pending: 7500,
        paymentMethod: "Efectivo",
        status: "PARTIAL",
        companyId: company.id,
      },
    }),
    prisma.sale.create({
      data: {
        customerId: customers[19].id,
        assignedTo: seller1.id,
        items: [
          { productName: "Minisplit 12,000 BTU", quantity: 2, price: 8500, total: 17000 },
          { productName: "Kit de Instalación Estándar", quantity: 2, price: 1200, total: 2400 },
        ],
        total: 19400,
        paid: 19400,
        pending: 0,
        paymentMethod: "Tarjeta",
        status: "PAID",
        companyId: company.id,
      },
    }),
    prisma.sale.create({
      data: {
        customerId: customers[9].id,
        assignedTo: seller1.id,
        items: [{ productName: "Mantenimiento Preventivo", quantity: 3, price: 800, total: 2400 }],
        total: 2400,
        paid: 2400,
        pending: 0,
        paymentMethod: "Efectivo",
        status: "PAID",
        companyId: company.id,
      },
    }),
    prisma.sale.create({
      data: {
        customerId: customers[3].id,
        assignedTo: seller2.id,
        items: [{ productName: "Split Techo 36,000 BTU", quantity: 1, price: 28000, total: 28000 }],
        total: 28000,
        paid: 0,
        pending: 28000,
        paymentMethod: "Crédito",
        status: "PENDING",
        companyId: company.id,
      },
    }),
    prisma.sale.create({
      data: {
        customerId: customers[7].id,
        assignedTo: seller1.id,
        items: [
          { productName: "Minisplit 18,000 BTU", quantity: 3, price: 11500, total: 34500 },
          { productName: "Kit de Instalación Premium", quantity: 3, price: 2500, total: 7500 },
        ],
        total: 42000,
        paid: 42000,
        pending: 0,
        paymentMethod: "Transferencia",
        status: "PAID",
        companyId: company.id,
      },
    }),
    prisma.sale.create({
      data: {
        customerId: customers[15].id,
        assignedTo: seller1.id,
        items: [{ productName: "Minisplit 12,000 BTU", quantity: 1, price: 8500, total: 8500 }],
        total: 8500,
        paid: 8500,
        pending: 0,
        paymentMethod: "Tarjeta",
        status: "PAID",
        companyId: company.id,
      },
    }),
    prisma.sale.create({
      data: {
        customerId: customers[1].id,
        assignedTo: seller2.id,
        items: [
          { productName: "Termostato Inteligente", quantity: 2, price: 1800, total: 3600 },
          { productName: "Purificador de Aire", quantity: 1, price: 3200, total: 3200 },
        ],
        total: 6800,
        paid: 6800,
        pending: 0,
        paymentMethod: "Tarjeta",
        status: "PAID",
        companyId: company.id,
      },
    }),
  ]);

  console.log("✅ Sales created (8)");

  // Create installations
  const installations = await Promise.all([
    prisma.installation.create({
      data: {
        saleId: sales[0].id,
        customerId: customers[5].id,
        technicianId: technician.id,
        scheduledAt: new Date(Date.now() + 2 * 86400000),
        address: "Av. Insurgentes 1234, Col. Roma Norte, CDMX",
        status: "ASSIGNED",
        companyId: company.id,
      },
    }),
    prisma.installation.create({
      data: {
        saleId: sales[2].id,
        customerId: customers[19].id,
        technicianId: technician.id,
        scheduledAt: new Date(Date.now() + 86400000),
        address: "Calle Reforma 567, Col. Juárez, CDMX",
        status: "PENDING",
        companyId: company.id,
      },
    }),
    prisma.installation.create({
      data: {
        saleId: sales[5].id,
        customerId: customers[7].id,
        technicianId: technician.id,
        scheduledAt: new Date(Date.now() - 86400000),
        address: "Blvd. Díaz Ordaz 890, Monterrey",
        status: "COMPLETED",
        notes: "Instalación completada sin novedad. 3 equipos instalados.",
        companyId: company.id,
      },
    }),
    prisma.installation.create({
      data: {
        saleId: sales[4].id,
        customerId: customers[3].id,
        scheduledAt: new Date(Date.now() + 5 * 86400000),
        address: "Polígono Industrial Norte, Guadalajara",
        status: "PENDING",
        companyId: company.id,
      },
    }),
    prisma.installation.create({
      data: {
        saleId: sales[6].id,
        customerId: customers[15].id,
        technicianId: technician.id,
        scheduledAt: new Date(),
        address: "Calle Hidalgo 123, Mérida",
        status: "ON_WAY",
        companyId: company.id,
      },
    }),
  ]);

  console.log("✅ Installations created (5)");

  // Create warranties
  const warranties = await Promise.all([
    prisma.warranty.create({
      data: {
        saleId: sales[0].id,
        customerId: customers[5].id,
        productId: products[1].id,
        startDate: new Date(Date.now() - 30 * 86400000),
        endDate: new Date(Date.now() + 548 * 86400000),
        status: "ACTIVE",
        companyId: company.id,
      },
    }),
    prisma.warranty.create({
      data: {
        saleId: sales[5].id,
        customerId: customers[7].id,
        productId: products[1].id,
        startDate: new Date(Date.now() - 15 * 86400000),
        endDate: new Date(Date.now() + 350 * 86400000),
        status: "ACTIVE",
        companyId: company.id,
      },
    }),
    prisma.warranty.create({
      data: {
        saleId: sales[6].id,
        customerId: customers[15].id,
        productId: products[0].id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 86400000),
        status: "ACTIVE",
        companyId: company.id,
      },
    }),
    prisma.warranty.create({
      data: {
        saleId: sales[2].id,
        customerId: customers[19].id,
        productId: products[0].id,
        startDate: new Date(Date.now() - 60 * 86400000),
        endDate: new Date(Date.now() + 305 * 86400000),
        status: "ACTIVE",
        companyId: company.id,
      },
    }),
    prisma.warranty.create({
      data: {
        saleId: sales[3].id,
        customerId: customers[9].id,
        productId: products[0].id,
        startDate: new Date(Date.now() - 400 * 86400000),
        endDate: new Date(Date.now() - 35 * 86400000),
        status: "EXPIRED",
        companyId: company.id,
      },
    }),
  ]);

  console.log("✅ Warranties created (5 + 5 more)");

  // Create 5 more warranties for active
  await Promise.all([
    prisma.warranty.create({ data: { saleId: sales[7].id, customerId: customers[1].id, productId: products[7].id, startDate: new Date(Date.now() - 10 * 86400000), endDate: new Date(Date.now() + 355 * 86400000), status: "ACTIVE", companyId: company.id } }),
    prisma.warranty.create({ data: { saleId: sales[0].id, customerId: customers[5].id, productId: products[5].id, startDate: new Date(Date.now() - 20 * 86400000), endDate: new Date(Date.now() + 345 * 86400000), status: "ACTIVE", companyId: company.id } }),
    prisma.warranty.create({ data: { saleId: sales[2].id, customerId: customers[19].id, productId: products[0].id, startDate: new Date(Date.now() - 5 * 86400000), endDate: new Date(Date.now() + 360 * 86400000), status: "ACTIVE", companyId: company.id } }),
    prisma.warranty.create({ data: { saleId: sales[5].id, customerId: customers[7].id, productId: products[4].id, startDate: new Date(Date.now() - 45 * 86400000), endDate: new Date(Date.now() + 320 * 86400000), status: "ACTIVE", companyId: company.id } }),
    prisma.warranty.create({ data: { saleId: sales[6].id, customerId: customers[15].id, productId: products[0].id, startDate: new Date(Date.now() - 90 * 86400000), endDate: new Date(Date.now() + 275 * 86400000), status: "ACTIVE", companyId: company.id } }),
  ]);

  // Create conversations
  const conversations = await Promise.all([
    prisma.conversation.create({ data: { customerId: customers[0].id, channel: "WHATSAPP", status: "OPEN", assignedTo: seller1.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[1].id, channel: "INSTAGRAM", status: "OPEN", assignedTo: seller1.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[2].id, channel: "WHATSAPP", status: "PENDING", assignedTo: seller2.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[6].id, channel: "MESSENGER", status: "OPEN", companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[10].id, channel: "WHATSAPP", status: "OPEN", assignedTo: seller2.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[11].id, channel: "INSTAGRAM", status: "CLOSED", assignedTo: seller1.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[12].id, channel: "WHATSAPP", status: "OPEN", assignedTo: seller2.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[13].id, channel: "WEB", status: "PENDING", companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[16].id, channel: "WHATSAPP", status: "OPEN", assignedTo: seller1.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[17].id, channel: "INSTAGRAM", status: "OPEN", assignedTo: seller2.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[4].id, channel: "WHATSAPP", status: "CLOSED", assignedTo: seller1.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[8].id, channel: "WHATSAPP", status: "OPEN", assignedTo: seller2.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[15].id, channel: "MESSENGER", status: "CLOSED", companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[18].id, channel: "WHATSAPP", status: "PENDING", companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[3].id, channel: "WHATSAPP", status: "OPEN", assignedTo: seller2.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[5].id, channel: "INSTAGRAM", status: "CLOSED", assignedTo: seller2.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[7].id, channel: "WHATSAPP", status: "OPEN", assignedTo: seller1.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[9].id, channel: "WEB", status: "CLOSED", assignedTo: seller1.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[14].id, channel: "WHATSAPP", status: "OPEN", assignedTo: seller2.id, companyId: company.id } }),
    prisma.conversation.create({ data: { customerId: customers[19].id, channel: "INSTAGRAM", status: "PENDING", assignedTo: seller1.id, companyId: company.id } }),
  ]);

  // Create messages for first few conversations
  await Promise.all([
    prisma.message.create({ data: { conversationId: conversations[0].id, content: "Hola! Vi su publicidad sobre aires acondicionados. ¿Tienen disponible el modelo 12,000 BTU?", direction: "INBOUND", senderName: customers[0].name, companyId: company.id } }),
    prisma.message.create({ data: { conversationId: conversations[0].id, content: "¡Hola María! Sí, tenemos disponible el Minisplit 12,000 BTU a $8,500. ¿Te gustaría más información?", direction: "OUTBOUND", senderName: seller1.name, companyId: company.id } }),
    prisma.message.create({ data: { conversationId: conversations[0].id, content: "Sí, me interesa. ¿Incluye instalación?", direction: "INBOUND", senderName: customers[0].name, companyId: company.id } }),
    prisma.message.create({ data: { conversationId: conversations[1].id, content: "Buenos días, me interesa cotizar 3 aires para mi oficina", direction: "INBOUND", senderName: customers[1].name, companyId: company.id } }),
    prisma.message.create({ data: { conversationId: conversations[1].id, content: "Buenos días Juan! Con gusto. ¿Qué dimensiones tienen los espacios?", direction: "OUTBOUND", senderName: seller1.name, companyId: company.id } }),
    prisma.message.create({ data: { conversationId: conversations[2].id, content: "Necesito información sobre sus servicios de mantenimiento", direction: "INBOUND", senderName: customers[2].name, companyId: company.id } }),
  ]);

  console.log("✅ Conversations & messages created (20 conversations)");

  // Create campaigns
  await Promise.all([
    prisma.campaign.create({
      data: {
        name: "Verano 2024 - Minisplits",
        platform: "Meta Ads",
        budget: 15000,
        spent: 12450,
        reach: 85200,
        impressions: 142000,
        clicks: 3840,
        ctr: 2.7,
        cpc: 3.24,
        cpm: 87.6,
        leads: 124,
        sales: 18,
        costPerLead: 100.4,
        costPerSale: 691.7,
        roas: 8.5,
        status: "ACTIVE",
        startDate: new Date(Date.now() - 30 * 86400000),
        endDate: new Date(Date.now() + 30 * 86400000),
        companyId: company.id,
      },
    }),
    prisma.campaign.create({
      data: {
        name: "Retargeting - Cotizaciones",
        platform: "Meta Ads",
        budget: 5000,
        spent: 3820,
        reach: 18500,
        impressions: 42000,
        clicks: 1260,
        ctr: 3.0,
        cpc: 3.03,
        cpm: 90.95,
        leads: 68,
        sales: 12,
        costPerLead: 56.2,
        costPerSale: 318.3,
        roas: 12.2,
        status: "ACTIVE",
        startDate: new Date(Date.now() - 20 * 86400000),
        endDate: new Date(Date.now() + 40 * 86400000),
        companyId: company.id,
      },
    }),
    prisma.campaign.create({
      data: {
        name: "Comercial - Empresas",
        platform: "Meta Ads",
        budget: 25000,
        spent: 25000,
        reach: 122000,
        impressions: 285000,
        clicks: 5700,
        ctr: 2.0,
        cpc: 4.39,
        cpm: 87.7,
        leads: 89,
        sales: 8,
        costPerLead: 280.9,
        costPerSale: 3125,
        roas: 5.6,
        status: "PAUSED",
        startDate: new Date(Date.now() - 60 * 86400000),
        endDate: new Date(Date.now() - 5 * 86400000),
        companyId: company.id,
      },
    }),
  ]);

  console.log("✅ Campaigns created (3)");

  // Create quick replies
  await Promise.all([
    prisma.quickReply.create({ data: { title: "Saludo inicial", content: "¡Hola! 👋 Gracias por contactarnos. Soy {nombre} de GreyCRM. ¿En qué puedo ayudarte hoy?", companyId: company.id } }),
    prisma.quickReply.create({ data: { title: "Información de precios", content: "Nuestros aires acondicionados comienzan desde $8,500 con instalación incluida. ¿Te gustaría recibir una cotización personalizada?", companyId: company.id } }),
    prisma.quickReply.create({ data: { title: "Agendar visita técnica", content: "Con gusto agendamos una visita técnica sin costo. ¿Cuál es tu disponibilidad esta semana?", companyId: company.id } }),
    prisma.quickReply.create({ data: { title: "Seguimiento cotización", content: "Hola {nombre}! Te escribo para dar seguimiento a la cotización que te envié. ¿Tienes alguna duda?", companyId: company.id } }),
    prisma.quickReply.create({ data: { title: "Confirmación instalación", content: "Confirmamos tu instalación para el {fecha}. Nuestro técnico llegará entre {hora_inicio} y {hora_fin}. ¿Tienes alguna pregunta?", companyId: company.id } }),
    prisma.quickReply.create({ data: { title: "Garantía activa", content: "Tu equipo cuenta con garantía activa hasta {fecha}. Para reportar una falla, responde este mensaje con una descripción del problema.", companyId: company.id } }),
    prisma.quickReply.create({ data: { title: "Fuera de horario", content: "Gracias por tu mensaje. Nuestro horario de atención es de Lunes a Viernes 9am-7pm. Te responderemos a la brevedad. 🕐", companyId: company.id } }),
    prisma.quickReply.create({ data: { title: "Solicitar fotos del espacio", content: "Para darte una cotización más precisa, ¿podrías enviarnos fotos del espacio donde se instalará el equipo? 📸", companyId: company.id } }),
    prisma.quickReply.create({ data: { title: "Pago recibido", content: "¡Confirmamos la recepción de tu pago! ✅ Te mantendremos informado sobre los próximos pasos de tu pedido.", companyId: company.id } }),
    prisma.quickReply.create({ data: { title: "Cierre de venta", content: "¡Excelente elección! 🎉 Hemos procesado tu pedido. En breve recibirás la confirmación y los detalles de la instalación.", companyId: company.id } }),
  ]);

  console.log("✅ Quick replies created (10)");
  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📋 Demo credentials:");
  console.log("   admin@greycrm.com / demo123 (Owner)");
  console.log("   laura@greycrm.com / demo123 (Admin)");
  console.log("   ana@greycrm.com / demo123 (Seller)");
  console.log("   carlos@greycrm.com / demo123 (Seller)");
  console.log("   roberto@greycrm.com / demo123 (Technician)");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
