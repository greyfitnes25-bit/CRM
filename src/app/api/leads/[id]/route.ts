import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentCompanyId } from "@/lib/current-company";
import type { LeadStage } from "@/types";

const VALID_STAGES = new Set(["NEW_LEAD", "CONTACTED", "QUOTED", "NEGOTIATION", "PENDING_PAYMENT", "SOLD", "LOST"]);

function stage(value: unknown): LeadStage {
  return VALID_STAGES.has(String(value)) ? (String(value) as LeadStage) : "NEW_LEAD";
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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const companyId = await getCurrentCompanyId();
    const { id } = await params;
    const body = await request.json();

    const lead = await prisma.lead.update({
      where: { id, companyId },
      data: {
        stage: body.stage ? stage(body.stage) : undefined,
        estimatedValue: body.estimatedValue === undefined ? undefined : Number(body.estimatedValue || 0),
        notes: body.notes === undefined ? undefined : body.notes || null,
        lastContact: new Date(),
      },
      include: {
        customer: true,
        assignee: { select: { name: true } },
      },
    });

    return NextResponse.json(mapLead(lead));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const companyId = await getCurrentCompanyId();
    const { id } = await params;
    await prisma.lead.delete({ where: { id, companyId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
