import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getCurrentCompanyId() {
  const session = await auth();
  if (session?.user?.companyId) {
    return session.user.companyId;
  }

  const company = await prisma.company.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!company) {
    throw new Error("No hay empresa configurada");
  }

  return company.id;
}

export async function getCurrentUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}
