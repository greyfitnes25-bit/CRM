"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Sun,
  Moon,
  Sunset,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, type Theme } from "@/components/providers/theme-provider";
import { cn, getInitials } from "@/lib/utils";
import Link from "next/link";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/messages": "Mensajes",
  "/leads": "Leads & Embudo de Ventas",
  "/customers": "Clientes",
  "/products": "Productos",
  "/quotes": "Cotizaciones",
  "/sales": "Ventas",
  "/installations": "Instalaciones",
  "/team-map": "Mapa Equipo",
  "/warranties": "Garantías",
  "/returns": "Devoluciones",
  "/meta-ads": "Meta Ads",
  "/web-forms": "Web & Formularios",
  "/settings": "Configuración",
};

const mockNotifications = [
  {
    id: "1",
    title: "Nuevo lead de WhatsApp",
    description: "María García envió un mensaje",
    time: "hace 5 min",
    unread: true,
    type: "lead",
    href: "/messages?channel=WHATSAPP&conversation=conv-1",
  },
  {
    id: "2",
    title: "Instalación completada",
    description: "Carlos López - Aire acondicionado",
    time: "hace 1 hora",
    unread: true,
    type: "installation",
    href: "/installations",
  },
  {
    id: "3",
    title: "Cotización aceptada",
    description: "Juan Martínez aceptó la cotización #QT-0045",
    time: "hace 2 horas",
    unread: false,
    type: "quote",
    href: "/quotes",
  },
];

const THEME_OPTIONS: Array<{ key: Theme; label: string; icon: React.ElementType }> = [
  { key: "light",  label: "Día",        icon: Sun    },
  { key: "sunset", label: "Atardecer",  icon: Sunset },
  { key: "dark",   label: "Noche",      icon: Moon   },
];

interface TopbarProps {
  onMobileMenuToggle?: () => void;
}

const PROFILE_KEY = "greycrm-profile-demo";

type StoredProfile = {
  name?: string;
  email?: string;
  position?: string;
  avatar?: string | null;
};

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profile, setProfile] = useState<StoredProfile | null>(null);

  const pageTitle = pathname === "/settings/profile"
    ? "Mi Perfil"
    : Object.entries(PAGE_TITLES).find(([path]) =>
        pathname === path || pathname.startsWith(path + "/")
      )?.[1] || "GreyCRM";

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  useEffect(() => {
    const syncProfile = () => {
      try {
        const stored = localStorage.getItem(PROFILE_KEY);
        setProfile(stored ? JSON.parse(stored) : null);
      } catch {
        setProfile(null);
      }
    };

    syncProfile();
    window.addEventListener("storage", syncProfile);
    window.addEventListener("greycrm-profile-updated", syncProfile);
    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("greycrm-profile-updated", syncProfile);
    };
  }, []);

  const displayName = profile?.name || session?.user?.name || "Usuario";
  const displayEmail = profile?.email || session?.user?.email || "";
  const displayPosition = profile?.position || "";
  const displayAvatar = profile?.avatar || session?.user?.avatar || undefined;

  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur-md border-border flex items-center px-6 gap-4 shrink-0 sticky top-0 z-30">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMobileMenuToggle}>
        <Menu className="w-5 h-5" />
      </Button>

      <div className="flex-1">
        <h1 className="text-lg font-semibold text-foreground hidden sm:block">{pageTitle}</h1>
      </div>

      <div className={cn("hidden md:flex items-center", searchOpen ? "w-64" : "w-48")}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-9 h-9 bg-muted/50 border-0 focus:bg-background text-sm"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* 3-way theme picker: Día / Atardecer / Noche */}
        <div
          className="hidden sm:flex items-center rounded-lg border border-border/60 bg-muted/50 p-0.5 gap-0.5"
          title="Apariencia"
        >
          {THEME_OPTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              title={label}
              className={cn(
                "flex items-center justify-center w-8 h-7 rounded-md transition-all duration-150",
                theme === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-9 h-9 text-muted-foreground hover:text-foreground relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[hsl(var(--primary))]" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notificaciones</span>
              {unreadCount > 0 && <Badge variant="secondary" className="text-xs">{unreadCount} nuevas</Badge>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockNotifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className="flex flex-col items-start p-3 cursor-pointer"
                onClick={() => { setNotifOpen(false); router.push(notif.href); }}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", notif.unread ? "bg-[hsl(var(--primary))]" : "bg-transparent")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{notif.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-muted-foreground hover:text-foreground">
              Ver todas las notificaciones
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 px-2 hover:bg-muted">
              <Avatar className="w-7 h-7">
                <AvatarImage src={displayAvatar} />
                <AvatarFallback className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block max-w-24 truncate">
                {displayName.split(" ")[0] || "Usuario"}
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground font-normal">{displayEmail}</p>
                {displayPosition && <p className="text-xs text-muted-foreground font-normal">{displayPosition}</p>}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Mobile theme picker */}
            <div className="flex items-center justify-between px-2 py-1.5 sm:hidden">
              <span className="text-xs text-muted-foreground">Apariencia</span>
              <div className="flex items-center rounded-md border border-border/60 bg-muted/50 p-0.5 gap-0.5">
                {THEME_OPTIONS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    title={label}
                    className={cn(
                      "flex items-center justify-center w-7 h-6 rounded transition-all",
                      theme === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>
            <DropdownMenuSeparator className="sm:hidden" />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile" className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />Mi Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />Configuración
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="text-red-600 focus:text-red-600 cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
