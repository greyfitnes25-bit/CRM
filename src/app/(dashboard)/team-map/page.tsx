"use client";

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

export default function TeamMapPage() {
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
            <div className="relative h-[520px] bg-slate-100">
              <iframe
                title="Mapa del equipo en Republica Dominicana"
                src="https://www.google.com/maps?q=Dominican%20Republic&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0">
                {TEAM.map((member, index) => (
                  <div
                    key={member.id}
                    className={cn(
                      "absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border bg-background/95 px-3 py-2 text-xs font-semibold shadow-lg",
                      member.role === "Mensajero" ? "border-amber-300 text-amber-700" : "border-blue-300 text-blue-700"
                    )}
                    style={{
                      left: `${28 + (index % 3) * 22}%`,
                      top: `${32 + Math.floor(index / 3) * 22 + (index % 2) * 8}%`,
                    }}
                  >
                    {member.role === "Mensajero" ? <Truck className="h-4 w-4" /> : <HardHat className="h-4 w-4" />}
                    <span>{member.name.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {TEAM.map((member) => (
            <Card key={member.id} className="overflow-hidden">
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
