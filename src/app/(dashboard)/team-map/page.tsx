"use client";

import { useMemo, useState } from "react";
import {
  ExternalLink,
  HardHat,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  RefreshCw,
  Route,
  Truck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DOMINICAN_REPUBLIC_MAP, TECHNICIAN_SAMPLE_LOCATIONS } from "@/lib/regional";
import { cn } from "@/lib/utils";

const TEAM = [
  {
    id: "tech-1",
    name: "Carlos Tecnico",
    role: "Tecnico",
    status: "En ruta",
    phone: "+1 809 555 0101",
    currentTask: "INST-0001 · Piantini",
    lat: 18.4861,
    lng: -69.9312,
    city: "Santo Domingo",
    lastUpdate: "Hace 3 min",
  },
  {
    id: "tech-2",
    name: "Miguel Instalador",
    role: "Tecnico",
    status: "Instalando",
    phone: "+1 829 555 0102",
    currentTask: "INST-0011 · Santiago",
    lat: 19.4517,
    lng: -70.697,
    city: "Santiago de los Caballeros",
    lastUpdate: "Hace 7 min",
  },
  {
    id: "tech-3",
    name: "Pedro Servicio",
    role: "Tecnico",
    status: "Disponible",
    phone: "+1 849 555 0103",
    currentTask: "Sin servicio activo",
    lat: 18.4273,
    lng: -68.9728,
    city: "La Romana",
    lastUpdate: "Hace 12 min",
  },
  {
    id: "msg-1",
    name: "Daniel Mensajero",
    role: "Mensajero",
    status: "En ruta",
    phone: "+1 809 555 0104",
    currentTask: "Entrega DVR · Naco",
    lat: 18.478,
    lng: -69.927,
    city: "Distrito Nacional",
    lastUpdate: "Hace 4 min",
  },
  {
    id: "tech-4",
    name: "Rafael Soporte",
    role: "Tecnico",
    status: "En pausa",
    phone: "+1 829 555 0105",
    currentTask: "Reparacion garantia · Haina",
    lat: 18.4167,
    lng: -70.0333,
    city: "San Cristobal",
    lastUpdate: "Hace 19 min",
  },
];

const STATUS_STYLES: Record<string, string> = {
  "En ruta": "bg-amber-100 text-amber-700 border-amber-200",
  Instalando: "bg-purple-100 text-purple-700 border-purple-200",
  Disponible: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "En pausa": "bg-slate-100 text-slate-700 border-slate-200",
};

function mapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

function wazeUrl(lat: number, lng: number) {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

function markerPosition(lat: number, lng: number) {
  const bounds = { north: 19.95, south: 17.45, west: -72.05, east: -68.25 };
  const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
  const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;
  return {
    left: `${Math.min(88, Math.max(12, x))}%`,
    top: `${Math.min(82, Math.max(16, y))}%`,
  };
}

export default function TeamMapPage() {
  const [selectedId, setSelectedId] = useState(TEAM[0].id);
  const selected = useMemo(() => TEAM.find((member) => member.id === selectedId) ?? TEAM[0], [selectedId]);
  const activeCount = TEAM.filter((member) => member.status !== "Disponible").length;
  const installingCount = TEAM.filter((member) => member.status === "Instalando").length;
  const onRouteCount = TEAM.filter((member) => member.status === "En ruta").length;

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mapa Equipo</h1>
          <p className="text-sm text-muted-foreground">
            Vista centrada en Republica Dominicana para tecnicos, mensajeros y personal de campo.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar ubicaciones
          </Button>
          <a href={`https://www.google.com/maps/@${DOMINICAN_REPUBLIC_MAP.center.lat},${DOMINICAN_REPUBLIC_MAP.center.lng},${DOMINICAN_REPUBLIC_MAP.zoom}z`} target="_blank" rel="noreferrer">
            <Button className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Abrir Google Maps
            </Button>
          </a>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Card className="border-blue-200 bg-blue-50/60 dark:bg-blue-950/20">
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-xl font-bold">{TEAM.length}</div>
              <div className="text-xs text-muted-foreground">Miembros</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-cyan-200 bg-cyan-50/60 dark:bg-cyan-950/20">
          <CardContent className="flex items-center gap-3 p-4">
            <Navigation className="h-5 w-5 text-cyan-600" />
            <div>
              <div className="text-xl font-bold">{activeCount}</div>
              <div className="text-xs text-muted-foreground">Activos</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/60 dark:bg-amber-950/20">
          <CardContent className="flex items-center gap-3 p-4">
            <Route className="h-5 w-5 text-amber-600" />
            <div>
              <div className="text-xl font-bold">{onRouteCount}</div>
              <div className="text-xs text-muted-foreground">En ruta</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50/60 dark:bg-purple-950/20">
          <CardContent className="flex items-center gap-3 p-4">
            <HardHat className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-xl font-bold">{installingCount}</div>
              <div className="text-xs text-muted-foreground">Instalando</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/40">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-5 w-5 text-primary" />
              Republica Dominicana
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[540px] overflow-hidden bg-[#eaf7ff] dark:bg-slate-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(14,165,233,0.22),transparent_30%),radial-gradient(circle_at_80%_12%,rgba(16,185,129,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.8),rgba(219,234,254,0.4))] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.22),transparent_30%),radial-gradient(circle_at_75%_25%,rgba(16,185,129,0.12),transparent_30%),linear-gradient(135deg,rgba(2,6,23,1),rgba(15,23,42,1))]" />
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(59,130,246,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.18) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />

              <svg viewBox="0 0 900 540" className="absolute inset-0 h-full w-full" role="img" aria-label="Mapa visual de Republica Dominicana">
                <defs>
                  <linearGradient id="islandGradient" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                    <stop offset="45%" stopColor="#22c55e" stopOpacity="0.92" />
                    <stop offset="100%" stopColor="#0f766e" stopOpacity="0.9" />
                  </linearGradient>
                  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#0f172a" floodOpacity="0.24" />
                  </filter>
                </defs>
                <path
                  d="M143 273 C154 206 220 164 309 149 C383 137 453 153 518 139 C592 124 664 142 731 172 C785 197 822 244 812 295 C802 347 742 366 690 385 C630 407 587 443 520 440 C456 437 421 398 361 399 C298 400 247 430 194 405 C151 385 135 331 143 273Z"
                  fill="url(#islandGradient)"
                  filter="url(#softShadow)"
                  className="opacity-90"
                />
                <path d="M461 153 C479 205 467 251 509 287 C552 324 599 300 640 328 C686 360 666 404 697 424" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="7" strokeLinecap="round" />
                <path d="M196 300 C277 275 332 287 405 253 C480 218 548 204 638 217 C709 227 758 260 808 294" fill="none" stroke="#0f172a" strokeOpacity="0.22" strokeWidth="5" strokeDasharray="12 14" strokeLinecap="round" />
                <text x="354" y="256" fill="white" fontSize="21" fontWeight="700" opacity="0.95">Republica Dominicana</text>
                <text x="398" y="286" fill="white" fontSize="13" fontWeight="600" opacity="0.8">Vista operativa del equipo</text>
                <circle cx="430" cy="272" r="155" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="8 10" />
                <circle cx="430" cy="272" r="230" fill="none" stroke="#0284c7" strokeOpacity="0.2" strokeWidth="2" />
              </svg>

              <div className="absolute left-4 top-4 rounded-2xl border bg-background/90 p-3 shadow-lg backdrop-blur">
                <div className="text-xs text-muted-foreground">Centro de operaciones</div>
                <div className="font-semibold">{selected.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{selected.city} · {selected.lastUpdate}</div>
              </div>

              <div className="absolute inset-0">
                {TEAM.map((member) => {
                  const active = member.id === selectedId;
                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedId(member.id)}
                      className={cn(
                        "absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border bg-background/95 px-3 py-2 text-xs font-semibold shadow-lg transition hover:scale-105",
                        active && "scale-110 ring-4 ring-primary/20",
                        member.role === "Mensajero" ? "border-amber-300 text-amber-700" : "border-blue-300 text-blue-700"
                      )}
                      style={markerPosition(member.lat, member.lng)}
                    >
                      <span className={cn("absolute -inset-1 rounded-full opacity-30 blur-sm", active ? "bg-primary animate-pulse" : "bg-transparent")} />
                      {member.role === "Mensajero" ? <Truck className="relative h-4 w-4" /> : <HardHat className="relative h-4 w-4" />}
                      <span className="relative">{member.name.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>

              <div className="absolute bottom-4 left-4 right-4 grid gap-2 rounded-2xl border bg-background/90 p-3 shadow-lg backdrop-blur md:grid-cols-3">
                <div>
                  <div className="text-xs text-muted-foreground">Seleccionado</div>
                  <div className="font-semibold">{selected.name}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Servicio actual</div>
                  <div className="truncate text-sm font-medium">{selected.currentTask}</div>
                </div>
                <div className="flex gap-2 md:justify-end">
                  <a href={mapsUrl(selected.lat, selected.lng)} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline">Google</Button>
                  </a>
                  <a href={wazeUrl(selected.lat, selected.lng)} target="_blank" rel="noreferrer">
                    <Button size="sm">Waze</Button>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {TEAM.map((member) => (
            <Card key={member.id} className={cn("overflow-hidden transition", selectedId === member.id && "border-primary/50 shadow-lg shadow-primary/10")}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl text-white",
                      member.role === "Mensajero" ? "bg-amber-500" : "bg-blue-600"
                    )}>
                      {member.role === "Mensajero" ? <Truck className="h-5 w-5" /> : <HardHat className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-semibold">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role} · {member.city}</div>
                    </div>
                  </div>
                  <Badge className={cn("border", STATUS_STYLES[member.status])}>{member.status}</Badge>
                </div>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-pink-500" />
                    <span>{member.currentTask}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 text-cyan-500" />
                    <span>{member.lastUpdate}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a href={mapsUrl(member.lat, member.lng)} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="w-full gap-2">
                      <MapPin className="h-4 w-4" />
                      Google
                    </Button>
                  </a>
                  <a href={wazeUrl(member.lat, member.lng)} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="w-full gap-2">
                      <Navigation className="h-4 w-4" />
                      Waze
                    </Button>
                  </a>
                  <a href={`tel:${member.phone}`}>
                    <Button variant="secondary" className="w-full gap-2">
                      <Phone className="h-4 w-4" />
                      Llamar
                    </Button>
                  </a>
                  <Button variant="secondary" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Mensaje
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-cyan-200 bg-cyan-50/70 dark:bg-cyan-950/20">
        <CardContent className="p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Siguiente integracion:</strong> este modulo queda listo para recibir coordenadas desde la app movil del tecnico. Cuando conectemos GPS real, estos puntos se actualizaran por usuario y por tiempo.
        </CardContent>
      </Card>
    </div>
  );
}
