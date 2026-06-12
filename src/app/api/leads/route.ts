import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCompanyId, getCurrentUserId } from "@/lib/current-company";
import type { CustomerSource, LeadStage } from "@/types";

const VALID_STAGES = new Set(["NEW_LEAD", "CONTACTED", "QUOTED", "NEGOTIATION", "PENDING_PAYMENT", "SOLD", "LOST"]);
const VALID_SOURCES = new Set(["WHATSAPP", "INSTAGRAM", "MESSENGER", "META_ADS", "WEB", "REFERRAL", "OTHER"]);

function stage(value: unknown): LeadStage {
  return VALID_STAGES.has(String(value)) ? (String(value) as LeadStage) : "NEW_LEAD";
}

function source(value: unknown): CustomerSource {
  return VALID_SOURCES.has(String(value)) ? (String(value) as CustomerSource) : "OTHER";
}

function mapLead(lead: any) {
  return {
    id: lead.id,
    customer: {
      id: lead.customer.id,
      name: lead.customer.name,
      phone: lead.customer.phone ?? lead.customer.whatsapp ?? "",
    },
    stage: lead.stage,
    estimatedValue: lead.estimatedValue ?? 0,
    source: lead.customer.source,
    assignedTo: lead.assignee?.name ?? null,
    lastContact: lead.lastContact ?? lead.updatedAt,
    notes: lead.notes ?? "",
    tags: lead.customer.tags ?? [],
  };
}

export async function GET() {
  try {
    const companyId = await getCurrentCompanyId();
    const leads = await prisma.lead.findMany({
      where: { companyId },
      include: {
        customer: true,
        assignee: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(leads.map(mapLead));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const companyId = await getCurrentCompanyId();
    const userId = await getCurrentUserId();
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        stage: stage(body.stage),
        estimatedValue: Number(body.estimatedValue || 0),
        source: body.source || null,
        ...(userId ? { assignee: { connect: { id: userId } } } : {}),
        notes: body.notes || null,
        lastContact: new Date(),
        company: { connect: { id: companyId } },
        customer: {
          create: {
            name: body.name.trim(),
            phone: body.phone || null,
            whatsapp: body.phone || null,
            source: source(body.source),
            tags: Array.isArray(body.tags) ? body.tags : [],
            company: { connect: { id: companyId } },
            ...(userId ? { assignee: { connect: { id: userId } } } : {}),
          },
        },
      },
      include: {
        customer: true,
        assignee: { select: { name: true } },
      },
    });

    return NextResponse.json(mapLead(lead), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
