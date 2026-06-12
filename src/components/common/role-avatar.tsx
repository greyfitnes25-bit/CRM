"use client";

import { BriefcaseBusiness, Calculator, Headphones, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

type RoleKey = "OWNER" | "ADMIN" | "SELLER" | "TECHNICIAN" | "SUPPORT" | "ACCOUNTANT" | string;

const ROLE_CONFIG: Record<string, { label: string; className: string; icon: typeof UserRound }> = {
  OWNER: { label: "Propietario", className: "bg-indigo-600 text-white", icon: ShieldCheck },
  ADMIN: { label: "Administrador", className: "bg-blue-600 text-white", icon: ShieldCheck },
  SELLER: { label: "Vendedor", className: "bg-emerald-600 text-white", icon: BriefcaseBusiness },
  TECHNICIAN: { label: "Tecnico", className: "bg-amber-500 text-white", icon: Wrench },
  SUPPORT: { label: "Soporte", className: "bg-cyan-600 text-white", icon: Headphones },
  ACCOUNTANT: { label: "Contador", className: "bg-violet-600 text-white", icon: Calculator },
};

interface RoleAvatarProps {
  name: string;
  role: RoleKey;
  src?: string | null;
  className?: string;
  badgeClassName?: string;
}

export function RoleAvatar({ name, role, src, className, badgeClassName }: RoleAvatarProps) {
  const config = ROLE_CONFIG[role] ?? { label: "Usuario", className: "bg-slate-700 text-white", icon: UserRound };
  const Icon = config.icon;
  const hasImage = Boolean(src);

  return (
    <div className={cn("relative inline-flex", className)} title={config.label}>
      <Avatar className="h-10 w-10">
        {src && <AvatarImage src={src} alt={name} />}
        <AvatarFallback className={cn("text-xs font-bold", config.className)}>
          {hasImage ? getInitials(name) : <Icon className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <span
        className={cn(
          "absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background shadow-sm",
          config.className,
          badgeClassName
        )}
        aria-label={config.label}
      >
        <Icon className="h-3 w-3" />
      </span>
    </div>
  );
}
