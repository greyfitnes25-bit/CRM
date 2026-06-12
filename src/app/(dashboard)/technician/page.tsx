"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Clock,
  HardHat,
  Home,
  MapPin,
  MessageSquare,
  Navigation,
  Package,
  Phone,
  Send,
  Smartphone,
  User,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { APP_TIME_ZONE } from "@/lib/regional";
import { cn } from "@/lib/utils";

interface Technician {
  id: string;
  name: string;
  initials: string;
  role: "Tecnico" | "Mensajero";
  phone: string;
  area: string;
  status: "Disponible" | "En ruta" | "Instalando" | "En pausa";
  location: string;
  lastUpdate: string;
}

interface Job {
  id: string;
  technicianId: string;
  number: string;
  customerName: string;
  address: string;
  product: string;
  scheduledTime: string;
  status: "ASSIGNED" | "ON_WAY" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  notes: string;
  phone: string;
  completedAt?: string;
}

interface ReportFormState {
  situationType: string;
  description: string;
  submitted: boolean;
}

const TECHNICIANS: Technician[] = [
  { id: "tech-1", name: "Carlos Tecnico", initials: "CT", role: "Tecnico", phone: "+1 809 555 0101", area: "Santo Domingo", status: "En ruta", location: "Piantini, Santo Domingo", lastUpdate: "Hace 3 min" },
  { id: "tech-2", name: "Miguel Instalador", initials: "MI", role: "Tecnico", phone: "+1 829 555 0102", area: "Santiago", status: "Instalando", location: "Los Jardines, Santiago", lastUpdate: "Hace 7 min" },
  { id: "tech-3", name: "Pedro Servicio", initials: "PS", role: "Tecnico", phone: "+1 849 555 0103", area: "La Romana", status: "Disponible", location: "Centro, La Romana", lastUpdate: "Hace 12 min" },
  { id: "tech-4", name: "Daniel Mensajero", initials: "DM", role: "Mensajero", phone: "+1 809 555 0104", area: "Distrito Nacional", status: "En ruta", location: "Naco, Santo Domingo", lastUpdate: "Hace 4 min" },
  { id: "tech-5", name: "Rafael Soporte", initials: "RS", role: "Tecnico", phone: "+1 829 555 0105", area: "San Cristobal", status: "En pausa", location: "Haina", lastUpdate: "Hace 19 min" },
];

const INITIAL_JOBS: Job[] = [
  {
    id: "j1",
    technicianId: "tech-1",
    number: "INST-0001",
    customerName: "Maria Gonzalez",
    address: "Av. Winston Churchill 123, Piantini, Santo Domingo",
    product: "Kit Camaras Profesional 8CH",
    scheduledTime: "10:00 AM",
    status: "ASSIGNED",
    notes: "Cliente solicita instalacion en 2 pisos",
    phone: "+1 809 555 1101",
  },
  {
    id: "j2",
    technicianId: "tech-1",
    number: "INST-0006",
    customerName: "Daniela Moreno",
    address: "Calle El Conde 45, Zona Colonial, Santo Domingo",
    product: "Kit Camaras Profesional 8CH",
    scheduledTime: "03:00 PM",
    status: "ON_WAY",
    notes: "",
    phone: "+1 829 555 2202",
  },
  {
    id: "j3",
    technicianId: "tech-2",
    number: "INST-0011",
    customerName: "Roberto Silva",
    address: "Av. Juan Pablo Duarte 88, Santiago",
    product: "Kit Camaras Premium 16CH 4K",
    scheduledTime: "09:00 AM",
    status: "IN_PROGRESS",
    notes: "Local comercial, instalar camaras exteriores",
    phone: "+1 809 555 3303",
  },
  {
    id: "j4",
    technicianId: "tech-2",
    number: "INST-0012",
    customerName: "Isabel Castro",
    address: "Urbanizacion Los Jardines, Santiago",
    product: "Sensor de movimiento",
    scheduledTime: "01:30 PM",
    status: "COMPLETED",
    notes: "",
    phone: "+1 829 555 4404",
    completedAt: "Hoy, 11:48 AM",
  },
  {
    id: "j5",
    technicianId: "tech-3",
    number: "INST-0015",
    customerName: "Hotel Mar Azul",
    address: "Av. Libertad, La Romana",
    product: "Sistema Alarma Empresarial",
    scheduledTime: "11:00 AM",
    status: "ASSIGNED",
    notes: "Coordinar entrada con recepcion",
    phone: "+1 849 555 5505",
  },
  {
    id: "j6",
    technicianId: "tech-4",
    number: "MSJ-0004",
    customerName: "Grey Store",
    address: "Naco, Santo Domingo",
    product: "Entrega de DVR 8 Canales",
    scheduledTime: "12:00 PM",
    status: "ON_WAY",
    notes: "Entregar antes de almuerzo",
    phone: "+1 809 555 6606",
  },
];

const SITUATION_TYPES = [
  "Material faltante",
  "Cliente no esta disponible",
  "Problema tecnico",
  "Necesita reprogramar",
  "Acceso restringido",
  "Otro",
];

const STATUS_CONFIG: Record<Job["status"], { label: string; pill: string; button?: string }> = {
  ASSIGNED: { label: "Asignado", pill: "bg-blue-500/15 text-blue-300 border-blue-400/30", button: "bg-blue-600 hover:bg-blue-500" },
  ON_WAY: { label: "En camino", pill: "bg-amber-500/15 text-amber-300 border-amber-400/30", button: "bg-orange-500 hover:bg-orange-400" },
  IN_PROGRESS: { label: "En proceso", pill: "bg-purple-500/15 text-purple-300 border-purple-400/30", button: "bg-emerald-600 hover:bg-emerald-500" },
  COMPLETED: { label: "Completado", pill: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" },
  CANCELLED: { label: "Cancelado", pill: "bg-red-500/15 text-red-300 border-red-400/30" },
};

function nextStatus(status: Job["status"]) {
  if (status === "ASSIGNED") return "ON_WAY";
  if (status === "ON_WAY") return "IN_PROGRESS";
  if (status === "IN_PROGRESS") return "COMPLETED";
  return status;
}

function statusAction(status: Job["status"]) {
  if (status === "ASSIGNED") return "Ir en camino";
  if (status === "ON_WAY") return "Llegue al domicilio";
  if (status === "IN_PROGRESS") return "Marcar completada";
  return null;
}

export default function TechnicianPage() {
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(TECHNICIANS[0].id);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [reportJobId, setReportJobId] = useState<string | null>(null);
  const [reportForms, setReportForms] = useState<Record<string, ReportFormState>>({});

  const todayDate = useMemo(
    () => new Intl.DateTimeFormat("es-DO", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      timeZone: APP_TIME_ZONE,
    }).format(new Date()),
    []
  );

  const selectedTechnician = TECHNICIANS.find((tech) => tech.id === selectedTechnicianId) || TECHNICIANS[0];
  const selectedJobs = jobs.filter((job) => job.technicianId === selectedTechnician.id);
  const activeJobs = selectedJobs.filter((job) => job.status !== "COMPLETED" && job.status !== "CANCELLED");
  const completedJobs = selectedJobs.filter((job) => job.status === "COMPLETED");
  const activeTechnicians = TECHNICIANS.filter((tech) => tech.status !== "Disponible").length;

  const updateStatus = (jobId: string, newStatus: Job["status"]) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: newStatus,
              completedAt: newStatus === "COMPLETED"
                ? "Hoy, " + new Date().toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit", timeZone: APP_TIME_ZONE })
                : job.completedAt,
            }
          : job
      )
    );
    if (newStatus !== "IN_PROGRESS") setReportJobId(null);
  };

  const toggleReport = (jobId: string) => {
    setReportJobId((current) => current === jobId ? null : jobId);
    if (!reportForms[jobId]) {
      setReportForms((prev) => ({
        ...prev,
        [jobId]: { situationType: "", description: "", submitted: false },
      }));
    }
  };

  const updateReportForm = (jobId: string, field: keyof ReportFormState, value: string | boolean) => {
    setReportForms((prev) => ({
      ...prev,
      [jobId]: { ...prev[jobId], [field]: value },
    }));
  };

  const submitReport = (jobId: string) => {
    updateReportForm(jobId, "submitted", true);
    setReportJobId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white -m-4 md:-m-6 p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Panel Tecnico</h1>
          <p className="text-sm text-sky-200/70">Consola para revisar varios tecnicos y la vista movil que vera cada uno.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/team-map">
            <Button className="gap-2 border border-cyan-400/30 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20">
              <MapPin className="h-4 w-4" />
              Ver mapa del equipo
            </Button>
          </Link>
          <Badge className="h-10 rounded-full border-amber-400/30 bg-amber-400/10 px-4 text-amber-200">
            <Smartphone className="mr-2 h-4 w-4" />
            Vista Movil
          </Badge>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-[2rem] border border-slate-700 bg-slate-900 shadow-2xl shadow-black/30 overflow-hidden">
          <div className="border-b border-slate-700 bg-slate-900 px-4 pb-4 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500 font-bold">
                  {selectedTechnician.initials}
                </div>
                <div>
                  <div className="font-bold">{selectedTechnician.name}</div>
                  <div className="text-xs text-slate-400">{selectedTechnician.role} · {selectedTechnician.area}</div>
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-slate-400">Hoy</div>
                <div className="font-bold">{todayDate}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-slate-800 p-3 text-center">
                <div className="text-xl font-bold text-sky-300">{selectedJobs.length}</div>
                <div className="text-[10px] font-semibold text-slate-400">Servicios</div>
              </div>
              <div className="rounded-lg bg-slate-800 p-3 text-center">
                <div className="text-xl font-bold text-emerald-300">{completedJobs.length}</div>
                <div className="text-[10px] font-semibold text-slate-400">Completados</div>
              </div>
              <div className="rounded-lg bg-slate-800 p-3 text-center">
                <div className="text-xl font-bold text-amber-300">{activeJobs.length}</div>
                <div className="text-[10px] font-semibold text-slate-400">En camino</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-3">
            {selectedJobs.map((job) => {
              const config = STATUS_CONFIG[job.status];
              const action = statusAction(job.status);
              const reportForm = reportForms[job.id];
              const isReporting = reportJobId === job.id;

              return (
                <article key={job.id} className="rounded-xl bg-slate-800 p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center rounded-md bg-slate-700 px-2 py-1 text-xs font-bold text-sky-200">
                        <Clock className="mr-1 h-3 w-3" />
                        {job.scheduledTime}
                      </div>
                      <div className="mt-3 font-bold">{job.number}</div>
                      <div className="text-sm font-semibold">{job.customerName}</div>
                    </div>
                    <Badge className={cn("border text-[10px] uppercase", config.pill)}>{config.label}</Badge>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pink-300" />
                      <span>{job.address}</span>
                    </div>
                    <div className="flex gap-2">
                      <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-300" />
                      <span>{job.product}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {action && (
                      <Button
                        className={cn("h-10 w-full font-bold", config.button)}
                        onClick={() => updateStatus(job.id, nextStatus(job.status))}
                      >
                        {job.status === "ASSIGNED" && <Navigation className="mr-2 h-4 w-4" />}
                        {job.status === "ON_WAY" && <MapPin className="mr-2 h-4 w-4" />}
                        {job.status === "IN_PROGRESS" && <CheckCircle className="mr-2 h-4 w-4" />}
                        {action}
                      </Button>
                    )}

                    {job.status === "IN_PROGRESS" && (
                      <Button
                        variant="outline"
                        className="h-10 w-full border-amber-400/40 bg-amber-400/10 font-bold text-amber-200 hover:bg-amber-400/20"
                        onClick={() => toggleReport(job.id)}
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Reportar situacion
                      </Button>
                    )}

                    {isReporting && reportForm && !reportForm.submitted && (
                      <div className="space-y-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3">
                        <Select value={reportForm.situationType} onValueChange={(value) => updateReportForm(job.id, "situationType", value)}>
                          <SelectTrigger className="border-slate-600 bg-slate-900 text-white">
                            <SelectValue placeholder="Tipo de situacion" />
                          </SelectTrigger>
                          <SelectContent>
                            {SITUATION_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Textarea
                          className="border-slate-600 bg-slate-900 text-white"
                          placeholder="Describe lo ocurrido..."
                          value={reportForm.description}
                          onChange={(event) => updateReportForm(job.id, "description", event.target.value)}
                        />
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="flex h-14 items-center justify-center rounded-lg border border-dashed border-slate-500">
                              <Camera className="h-4 w-4 text-slate-300" />
                            </div>
                          ))}
                        </div>
                        <Button
                          className="w-full gap-2"
                          disabled={!reportForm.situationType || !reportForm.description}
                          onClick={() => submitReport(job.id)}
                        >
                          <Send className="h-4 w-4" />
                          Enviar reporte
                        </Button>
                      </div>
                    )}

                    {reportForm?.submitted && (
                      <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-2 text-center text-xs font-semibold text-emerald-200">
                        Reporte enviado al supervisor
                      </div>
                    )}
                  </div>
                </article>
              );
            })}

            {selectedJobs.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-600 p-8 text-center text-sm text-slate-400">
                Este miembro no tiene servicios asignados hoy.
              </div>
            )}
          </div>

          <nav className="grid grid-cols-4 border-t border-slate-700 bg-slate-900 px-3 py-3 text-center text-[10px] text-slate-400">
            <span className="flex flex-col items-center gap-1 text-emerald-300"><Home className="h-4 w-4" /> Inicio</span>
            <span className="flex flex-col items-center gap-1 text-sky-300"><Package className="h-4 w-4" /> Servicios</span>
            <span className="flex flex-col items-center gap-1"><MapPin className="h-4 w-4" /> Mapa</span>
            <span className="flex flex-col items-center gap-1"><User className="h-4 w-4" /> Perfil</span>
          </nav>
        </section>

        <section className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <div className="text-2xl font-bold">{TECHNICIANS.length}</div>
              <div className="text-sm text-slate-400">Equipo registrado</div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <div className="text-2xl font-bold text-cyan-300">{activeTechnicians}</div>
              <div className="text-sm text-slate-400">En operacion</div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <div className="text-2xl font-bold text-amber-300">{jobs.filter((job) => job.status === "ON_WAY").length}</div>
              <div className="text-sm text-slate-400">En camino</div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <div className="text-2xl font-bold text-emerald-300">{jobs.filter((job) => job.status === "COMPLETED").length}</div>
              <div className="text-sm text-slate-400">Completados</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold">Equipo tecnico y mensajeria</h2>
                <p className="text-sm text-slate-400">Selecciona una persona para revisar su panel, trabajos y estatus.</p>
              </div>
              <Select value={selectedTechnicianId} onValueChange={setSelectedTechnicianId}>
                <SelectTrigger className="w-full border-slate-700 bg-slate-950 text-white sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TECHNICIANS.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>{tech.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              {TECHNICIANS.map((tech) => {
                const techJobs = jobs.filter((job) => job.technicianId === tech.id);
                const isSelected = tech.id === selectedTechnician.id;
                return (
                  <button
                    key={tech.id}
                    onClick={() => setSelectedTechnicianId(tech.id)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition",
                      isSelected
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-slate-700 bg-slate-950 hover:border-slate-500"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className={cn("flex h-11 w-11 items-center justify-center rounded-full font-bold", tech.role === "Mensajero" ? "bg-amber-500" : "bg-indigo-500")}>
                          {tech.initials}
                        </div>
                        <div>
                          <div className="font-bold">{tech.name}</div>
                          <div className="text-xs text-slate-400">{tech.role} · {tech.area}</div>
                        </div>
                      </div>
                      <Badge className="border-slate-600 bg-slate-800 text-slate-200">{tech.status}</Badge>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                      <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-pink-300" /> {tech.location}</span>
                      <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-cyan-300" /> {tech.lastUpdate}</span>
                      <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-emerald-300" /> {tech.phone}</span>
                      <span className="flex items-center gap-2"><HardHat className="h-3.5 w-3.5 text-amber-300" /> {techJobs.length} servicios</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
              <h2 className="mb-4 font-bold">Como funciona el Panel Tecnico</h2>
              <div className="divide-y divide-slate-700 text-sm text-slate-300">
                {[
                  "El supervisor puede entrar a cada tecnico y ver su agenda.",
                  "El tecnico abre esta vista desde su celular al iniciar el dia.",
                  "Actualiza estados: asignado, en camino, en proceso y completado.",
                  "Puede reportar situaciones con descripcion y fotos.",
                  "La ubicacion quedara conectada al mapa del equipo para seguimiento en vivo.",
                ].map((text) => (
                  <div key={text} className="flex gap-3 py-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
              <h2 className="mb-4 font-bold">Estados de instalacion</h2>
              <div className="space-y-3 text-sm text-slate-300">
                {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                  <div key={status} className="flex items-center gap-3 border-b border-slate-700 pb-3 last:border-0">
                    <Badge className={cn("w-28 justify-center border text-[10px] uppercase", config.pill)}>{config.label}</Badge>
                    <span>
                      {status === "ASSIGNED" && "Servicio asignado al tecnico."}
                      {status === "ON_WAY" && "El tecnico salio hacia el domicilio."}
                      {status === "IN_PROGRESS" && "El tecnico llego y esta trabajando."}
                      {status === "COMPLETED" && "Instalacion terminada y lista para firma."}
                      {status === "CANCELLED" && "Cancelado por cliente o por operacion."}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm text-cyan-100">
            <div className="flex items-center gap-2 font-bold">
              <Users className="h-4 w-4" />
              Preparado para crecer
            </div>
            <p className="mt-1 text-cyan-100/80">
              La estructura ya permite manejar varios miembros del equipo. Luego podemos conectar usuarios reales, permisos por rol, GPS en tiempo real y chat interno.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
