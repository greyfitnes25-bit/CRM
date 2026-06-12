"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  MessageSquare,
  Target,
  Users,
  Package,
  Package2,
  HardHat,
  FileText,
  ShoppingCart,
  Wrench,
  Map,
  Shield,
  RotateCcw,
  TrendingUp,
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  ShieldCheck,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BrandIsotipo } from "@/components/common/brand-isotipo";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/messages", label: "Mensajes", icon: MessageSquare, badge: 3 },
  { href: "/leads", label: "Leads / Embudo", icon: Target },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/products", label: "Productos", icon: Package },
  { href: "/inventory", label: "Inventario", icon: Package2, badge: 2 },
  { href: "/quotes", label: "Cotizaciones", icon: FileText },
  { href: "/sales", label: "Ventas", icon: ShoppingCart },
  { href: "/installations", label: "Instalaciones", icon: Wrench },
  { href: "/team-map", label: "Mapa Equipo", icon: Map },
  { href: "/warranties", label: "Garantías", icon: Shield },
  { href: "/returns", label: "Devoluciones", icon: RotateCcw },
  { href: "/meta-ads", label: "Meta Ads", icon: TrendingUp },
  { href: "/web-forms", label: "Web / Formularios", icon: Globe },
];

const bottomItems = [
  { href: "/technician", label: "Panel Técnico", icon: HardHat },
  { href: "/settings", label: "Configuración", icon: Settings },
];

const superAdminItems = [
  { href: "/superadmin", label: "Super Admin", icon: ShieldCheck },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    const syncLogo = () => setCompanyLogo(localStorage.getItem("greycrm-company-logo"));
    syncLogo();
    window.addEventListener("storage", syncLogo);
    return () => window.removeEventListener("storage", syncLogo);
  }, []);

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full transition-all duration-300 ease-in-out",
        "border-r bg-[hsl(var(--sidebar-background))] border-[hsl(var(--sidebar-border))]",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-[hsl(var(--sidebar-border))] shrink-0",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-slate-950/80 border border-orange-300/60 dark:border-white/10 shrink-0 shadow-lg shadow-orange-500/15 ring-1 ring-blue-500/20 overflow-hidden">
          {companyLogo ? (
            <img src={companyLogo} alt="Logo" className="h-full w-full object-contain p-1" />
          ) : (
            <BrandIsotipo className="h-full w-full p-1.5" />
          )}
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-[hsl(var(--sidebar-foreground))] font-bold text-lg leading-none block">GreyCRM</span>
            <span className="text-[hsl(var(--sidebar-foreground))]/60 text-xs">
              {session?.user?.companyName || "Mi Empresa"}
            </span>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full bg-[hsl(var(--sidebar-accent))] border border-[hsl(var(--sidebar-border))] flex items-center justify-center text-[hsl(var(--sidebar-foreground))]/70 hover:text-[hsl(var(--sidebar-foreground))] transition-colors shadow-sm"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <div className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                  active
                    ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-lg shadow-black/15"
                    : "text-[hsl(var(--sidebar-foreground))]/65 hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  "shrink-0 transition-colors",
                  collapsed ? "w-5 h-5" : "w-4 h-4",
                  active ? "text-[hsl(var(--sidebar-primary-foreground))]" : "text-[hsl(var(--sidebar-foreground))]/65 group-hover:text-[hsl(var(--sidebar-foreground))]"
                )} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] text-xs font-bold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[hsl(var(--sidebar-primary))]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-4 my-4 border-t border-[hsl(var(--sidebar-border))]" />

        {/* Bottom nav */}
        <div className="space-y-1 px-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  active
                    ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]"
                    : "text-[hsl(var(--sidebar-foreground))]/65 hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  "shrink-0",
                  collapsed ? "w-5 h-5" : "w-4 h-4",
                )} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* SuperAdmin divider + link */}
        <div className="mx-4 my-4 border-t border-[hsl(var(--sidebar-border))]" />
        {!collapsed && (
          <div className="px-4 mb-2">
            <span className="text-xs font-semibold text-[hsl(var(--sidebar-foreground))]/45 uppercase tracking-wider">Plataforma</span>
          </div>
        )}
        <div className="space-y-1 px-2">
          {superAdminItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  active
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                    : "text-red-400 hover:text-white hover:bg-red-600/20",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  "shrink-0",
                  collapsed ? "w-5 h-5" : "w-4 h-4",
                )} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className={cn(
        "border-t border-[hsl(var(--sidebar-border))] p-3 shrink-0",
      )}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={session?.user?.avatar || undefined} />
              <AvatarFallback className="bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] text-xs">
                {getInitials(session?.user?.name || "U")}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-[hsl(var(--sidebar-foreground))]/65 hover:text-red-400 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 shrink-0">
              <AvatarImage src={session?.user?.avatar || undefined} />
              <AvatarFallback className="bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] text-sm">
                {getInitials(session?.user?.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[hsl(var(--sidebar-foreground))] text-sm font-medium truncate">
                {session?.user?.name || "Usuario"}
              </p>
              <p className="text-[hsl(var(--sidebar-foreground))]/60 text-xs truncate">
                {ROLE_LABELS[(session?.user?.role as string) || "SELLER"] || "Vendedor"}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-[hsl(var(--sidebar-foreground))]/65 hover:text-red-400 transition-colors p-1 rounded"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
