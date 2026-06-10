"use client";

import { useState } from "react";
import {
  MapPin, Phone, Clock, CheckCircle, AlertTriangle, ArrowLeft,
  Navigation, Camera, Send, User, Package, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TECH_NAME = "Carlos Técnico";
const TODAY_DATE = "martes 10 de junio, 2026";

interface Job {
  id: string;
  number: string;
  customerName: string;
  address: string;
  product: string;
  scheduledTime: string;
  status: "ASSIGNED" | "ON_WAY" | "IN_PROGRESS" | "COMPLETED";
  notes: string;
  phone: string;
  completedAt?: string;
}

const SITUATION_TYPES = [
  "Material faltante",
  "Cliente no en casa",
  "Problema técnico",
  "Necesita reprogramar",
  "Otro",
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ASSIGNED: { label: "Asignado", color: "text-blue-700", bg: "bg-blue-100" },
  ON_WAY: { label: "En camino", color: "text-orange-700", bg: "bg-orange-100" },
  IN_PROGRESS: { label: "En progreso", color: "text-purple-700", bg: "bg-purple-100" },
  COMPLETED: { label: "Completado", color: "text-green-700", bg: "bg-green-100" },
};

const INITIAL_JOBS: Job[] = [
  {
    id: "j1",
    number: "INST-0001",
    customerName: "María González",
    address: "Av. Insurgentes 123, Col. Roma, CDMX",
    product: "Kit Cámaras Profesional 8CH",
    scheduledTime: "10:00",
    status: "ASSIGNED",
    notes: "Cliente solicita instalación en 2 pisos",
    phone: "+52 55 1234 5678",
  },
  {
    id: "j2",
    number: "INST-0006",
    customerName: "Daniela Moreno",
    address: "Blvd. Torres Landa 456, León GTO",
    product: "Kit Cámaras Profesional 8CH",
    scheduledTime: "15:00",
    status: "ON_WAY",
    notes: "",
    phone: "+52 55 4567 8901",
  },
];

interface ReportFormState {
  situationType: string;
  description: string;
  submitted: boolean;
}

export default function TechnicianPage() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [reportJobId, setReportJobId] = useState<string | null>(null);
  const [reportForms, setReportForms] = useState<Record<string, ReportFormState>>({});

  const activeJobs = jobs.filter((j) => j.status !== "COMPLETED");
  const completedJobs = jobs.filter((j) => j.status === "COMPLETED");
  const completedCount = completedJobs.length;
  const totalCount = jobs.length;

  const updateStatus = (jobId: string, newStatus: Job["status"]) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: newStatus, completedAt: newStatus === "COMPLETED" ? "Hoy, " + new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) : j.completedAt }
          : j
      )
    );
    if (newStatus !== "IN_PROGRESS") {
      setReportJobId(null);
    }
  };

  const toggleReport = (jobId: string) => {
    if (reportJobId === jobId) {
      setReportJobId(null);
    } else {
      setReportJobId(jobId);
      if (!reportForms[jobId]) {
        setReportForms((prev) => ({
          ...prev,
          [jobId]: { situationType: "", description: "", submitted: false },
        }));
      }
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Phone-like container */}
      <div className="max-w-sm mx-auto bg-background min-h-screen shadow-2xl relative pb-8">

        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white px-4 pt-4 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/installations">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 -ml-2 gap-1 h-8 px-2">
                <ArrowLeft className="w-4 h-4" /> Volver
              </Button>
            </Link>
            <h1 className="text-base font-bold flex-1 text-center pr-8">Panel Técnico</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
              CT
            </div>
            <div className="flex-1">
              <div className="font-bold text-base">{TECH_NAME}</div>
              <div className="text-white/60 text-xs">{TODAY_DATE}</div>
            </div>
          </div>

          <div className="mt-4 flex gap-3 text-center">
            <div className="flex-1 bg-white/10 rounded-xl py-2">
              <div className="text-2xl font-bold">{totalCount}</div>
              <div className="text-white/60 text-xs">Servicios hoy</div>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl py-2">
              <div className="text-2xl font-bold text-green-400">{completedCount}</div>
              <div className="text-white/60 text-xs">Completados</div>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl py-2">
              <div className="text-2xl font-bold text-yellow-400">{activeJobs.length}</div>
              <div className="text-white/60 text-xs">Pendientes</div>
            </div>
          </div>
        </div>

        {/* Jobs section */}
        <div className="px-4 py-4 space-y-4">
          {activeJobs.length > 0 && (
            <>
              <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">Mis servicios de hoy</h2>
              {activeJobs.map((job) => {
                const statusConfig = STATUS_CONFIG[job.status];
                const isReporting = reportJobId === job.id;
                const reportForm = reportForms[job.id];

                return (
                  <div key={job.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                    {/* Job header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-blue-600 text-sm font-bold">{job.number}</span>
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full font-semibold">
                              {job.scheduledTime} AM
                            </span>
                          </div>
                          <div className="font-bold text-base">{job.customerName}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Package className="w-3 h-3 shrink-0" />
                            {job.product}
                          </div>
                        </div>
                        <Badge className={cn("text-xs border-0 shrink-0", statusConfig.bg, statusConfig.color)}>
                          {statusConfig.label}
                        </Badge>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-3">
                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-sm leading-snug">{job.address}</span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{job.phone}</span>
                        </div>
                        <a href={`tel:${job.phone}`}>
                          <Button size="sm" variant="outline" className="h-8 gap-1 text-xs text-green-600 border-green-200 hover:bg-green-50">
                            <Phone className="w-3 h-3" /> Llamar
                          </Button>
                        </a>
                      </div>

                      {/* Office notes */}
                      {job.notes && (
                        <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3">
                          <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Nota de oficina</div>
                          <div className="text-sm text-yellow-800 dark:text-yellow-300">{job.notes}</div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="px-4 pb-4 space-y-2">
                      {job.status === "ASSIGNED" && (
                        <Button
                          className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 gap-2"
                          onClick={() => updateStatus(job.id, "ON_WAY")}
                        >
                          <Navigation className="w-5 h-5" /> Ir en camino
                        </Button>
                      )}

                      {job.status === "ON_WAY" && (
                        <Button
                          className="w-full h-12 text-base font-bold bg-orange-500 hover:bg-orange-600 gap-2"
                          onClick={() => updateStatus(job.id, "IN_PROGRESS")}
                        >
                          <MapPin className="w-5 h-5" /> Llegue al domicilio
                        </Button>
                      )}

                      {job.status === "IN_PROGRESS" && (
                        <>
                          <Button
                            className="w-full h-12 text-base font-bold bg-green-600 hover:bg-green-700 gap-2"
                            onClick={() => updateStatus(job.id, "COMPLETED")}
                          >
                            <CheckCircle className="w-5 h-5" /> Marcar como Completada
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full h-12 text-base font-semibold gap-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                            onClick={() => toggleReport(job.id)}
                          >
                            <AlertTriangle className="w-5 h-5" />
                            {isReporting ? "Cancelar reporte" : "Reportar Situacion"}
                          </Button>
                        </>
                      )}

                      {/* Report form */}
                      {isReporting && reportForm && !reportForm.submitted && (
                        <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 space-y-3">
                          <div className="font-semibold text-sm text-yellow-800 dark:text-yellow-300">Reportar situacion</div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Tipo de situacion</label>
                            <Select
                              value={reportForm.situationType}
                              onValueChange={(v) => updateReportForm(job.id, "situationType", v)}
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Seleccionar..." />
                              </SelectTrigger>
                              <SelectContent>
                                {SITUATION_TYPES.map((t) => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Descripcion</label>
                            <Textarea
                              rows={3}
                              value={reportForm.description}
                              onChange={(e) => updateReportForm(job.id, "description", e.target.value)}
                              placeholder="Describe la situacion..."
                              className="bg-background text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Fotos</label>
                            <div className="flex gap-2">
                              {[1, 2, 3].map((n) => (
                                <div
                                  key={n}
                                  className="flex-1 h-16 bg-background border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                                >
                                  <Camera className="w-5 h-5 text-muted-foreground" />
                                  <span className="text-[10px] text-muted-foreground mt-0.5">Agregar foto</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button
                            className="w-full gap-2"
                            disabled={!reportForm.situationType || !reportForm.description}
                            onClick={() => submitReport(job.id)}
                          >
                            <Send className="w-4 h-4" /> Enviar reporte
                          </Button>
                        </div>
                      )}

                      {reportForm?.submitted && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 text-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                          <div className="text-sm font-medium text-green-700 dark:text-green-400">Reporte enviado al supervisor</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* Completed jobs */}
          {completedJobs.length > 0 && (
            <div className="mt-2">
              <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">Servicios completados hoy</h2>
              <div className="space-y-2">
                {completedJobs.map((job) => (
                  <div key={job.id} className="flex items-center gap-3 p-3 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                    <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{job.customerName}</div>
                      <div className="text-xs text-muted-foreground">{job.number}</div>
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-400 text-right shrink-0">
                      {job.completedAt || "Completado"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All done celebration */}
          {activeJobs.length === 0 && completedJobs.length > 0 && (
            <div className="text-center py-8 px-4">
              <div className="text-5xl mb-3">🎉</div>
              <div className="font-bold text-lg">Todos los servicios del dia completados!</div>
              <div className="text-muted-foreground text-sm mt-1">Excelente trabajo, {TECH_NAME.split(" ")[0]}</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                  <div className="text-xs text-muted-foreground">Completadas</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                  <div className="text-xs text-muted-foreground">Total del dia</div>
                </div>
              </div>
            </div>
          )}

          {/* Empty state — no jobs */}
          {jobs.length === 0 && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <div className="font-medium text-muted-foreground">No hay servicios asignados para hoy</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-muted/30 text-center">
          <p className="text-[10px] text-muted-foreground">
            Ubicacion compartida con el equipo · Modo tecnico activo
          </p>
        </div>
      </div>
    </div>
  );
}
