"use client";

import { useState } from "react";
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
  Shield,
  RotateCcw,
  TrendingUp,
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
  User,
  ShieldCheck,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full transition-all duration-300 ease-in-out",
        "bg-slate-900 border-r border-slate-800",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-slate-800 shrink-0",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 shrink-0 shadow-lg shadow-blue-500/30">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-white font-bold text-lg leading-none block">GreyCRM</span>
            <span className="text-slate-400 text-xs">
              {session?.user?.companyName || "Mi Empresa"}
            </span>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-sm"
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
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  "shrink-0 transition-colors",
                  collapsed ? "w-5 h-5" : "w-4 h-4",
                  active ? "text-white" : "text-slate-400 group-hover:text-white"
                )} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-4 my-4 border-t border-slate-800" />

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
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800",
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
        <div className="mx-4 my-4 border-t border-slate-700" />
        {!collapsed && (
          <div className="px-4 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Plataforma</span>
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
        "border-t border-slate-800 p-3 shrink-0",
      )}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={session?.user?.avatar || undefined} />
              <AvatarFallback className="bg-blue-600 text-white text-xs">
                {getInitials(session?.user?.name || "U")}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-slate-400 hover:text-red-400 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 shrink-0">
              <AvatarImage src={session?.user?.avatar || undefined} />
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                {getInitials(session?.user?.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {session?.user?.name || "Usuario"}
              </p>
              <p className="text-slate-400 text-xs truncate">
                {ROLE_LABELS[(session?.user?.role as string) || "SELLER"] || "Vendedor"}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded"
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
