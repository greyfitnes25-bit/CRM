"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Wrench,
  MoreHorizontal,
  X,
  Target,
  Package,
  FileText,
  ShoppingCart,
  Shield,
  RotateCcw,
  TrendingUp,
  Globe,
  Settings,
  Package2,
  HardHat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const MAIN_TABS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/messages", label: "Mensajes", icon: MessageSquare, badge: 3 },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/installations", label: "Instalaciones", icon: Wrench },
];

const MORE_ITEMS = [
  { href: "/leads", label: "Leads / Embudo", icon: Target },
  { href: "/products", label: "Productos", icon: Package },
  { href: "/inventory", label: "Inventario", icon: Package2 },
  { href: "/quotes", label: "Cotizaciones", icon: FileText },
  { href: "/sales", label: "Ventas", icon: ShoppingCart },
  { href: "/warranties", label: "Garantías", icon: Shield },
  { href: "/returns", label: "Devoluciones", icon: RotateCcw },
  { href: "/meta-ads", label: "Meta Ads", icon: TrendingUp },
  { href: "/web-forms", label: "Web / Formularios", icon: Globe },
  { href: "/technician", label: "Panel Técnico", icon: HardHat },
  { href: "/settings", label: "Configuración", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const isMoreActive = MORE_ITEMS.some((item) => isActive(item.href));

  return (
    <>
      {/* Bottom nav bar - mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
        <div className="flex">
          {MAIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 relative transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium truncate max-w-full px-1">
                  {tab.label}
                </span>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setSheetOpen(true)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 relative transition-colors",
              isMoreActive || sheetOpen
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">Más</span>
            {(isMoreActive || sheetOpen) && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
            )}
          </button>
        </div>
      </nav>

      {/* Slide-up sheet with more items */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-safe max-h-[75vh] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-left text-base">Más opciones</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-3 pb-6">
            {MORE_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSheetOpen(false)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-colors",
                    active
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-muted/40 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium text-center leading-tight">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
