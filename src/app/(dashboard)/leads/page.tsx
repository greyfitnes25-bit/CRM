"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, MoreVertical, User, Clock, DollarSign,
  TrendingUp, ArrowRight, ChevronDown, Tag, Eye, Edit,
  CheckCircle2, XCircle, Target, Flame, MessageSquare, X,
  Phone, Mail, Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn, getInitials, formatCurrency, formatDateRelative } from "@/lib/utils";
import { LEAD_STAGES, LEAD_STAGE_COLORS, CUSTOMER_SOURCE_LABELS, CUSTOMER_SOURCE_COLORS } from "@/lib/constants";
import { DEMO_LEADS, type DemoLead } from "@/lib/demo-data";
import type { LeadStage } from "@/types";

type Lead = DemoLead;

const STAGE_ICONS: Record<string, React.ReactNode> = {
  NEW_LEAD: <Target className="w-3.5 h-3.5" />,
  CONTACTED: <MessageSquare className="w-3.5 h-3.5" />,
  QUOTED: <DollarSign className="w-3.5 h-3.5" />,
  NEGOTIATION: <TrendingUp className="w-3.5 h-3.5" />,
  PENDING_PAYMENT: <Clock className="w-3.5 h-3.5" />,
  SOLD: <CheckCircle2 className="w-3.5 h-3.5" />,
  LOST: <XCircle className="w-3.5 h-3.5" />,
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS);
  const [search, setSearch] = useState("");
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filtered = leads.filter((l) =>
    !search ||
    l.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    (l.notes ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const getStageLeads = (stage: LeadStage) =>
    filtered.filter((l) => l.stage === stage);

  const getStageTotalValue = (stage: LeadStage) =>
    getStageLeads(stage).reduce((acc, l) => acc + l.estimatedValue, 0);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stage);
  };

  const handleDrop = (e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault();
    if (draggedLead && draggedLead.stage !== stage) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === draggedLead.id
            ? { ...l, stage, lastContact: new Date() }
            : l
        )
      );
    }
    setDraggedLead(null);
    setDragOverStage(null);
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
    setDragOverStage(null);
  };

  const moveLead = (leadId: string, newStage: LeadStage) => {
    setLeads((prev) =>
      prev.map((l) => l.id === leadId ? { ...l, stage: newStage, lastContact: new Date() } : l)
    );
  };

  const openDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetail(true);
  };

  const totalLeads = leads.filter((l) => !["SOLD", "LOST"].includes(l.stage)).length;
  const totalValue = leads
    .filter((l) => !["LOST"].includes(l.stage))
    .reduce((acc, l) => acc + l.estimatedValue, 0);
  const soldValue = leads
    .filter((l) => l.stage === "SOLD")
    .reduce((acc, l) => acc + l.estimatedValue, 0);
  const convRate = leads.length > 0
    ? Math.round((leads.filter((l) => l.stage === "SOLD").length / leads.length) * 100)
    : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mx-6 -mt-6 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border bg-background shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Embudo de Ventas</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Arrastra las tarjetas entre columnas para mover leads</p>
          </div>
          <Button size="sm" className="gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            Nuevo Lead
          </Button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Leads activos", value: totalLeads, icon: Target, color: "text-blue-500" },
            { label: "Valor en pipeline", value: formatCurrency(totalValue, "MXN"), icon: DollarSign, color: "text-emerald-500" },
            { label: "Ventas cerradas", value: formatCurrency(soldValue, "MXN"), icon: CheckCircle2, color: "text-green-600" },
            { label: "Tasa de conversión", value: `${convRate}%`, icon: TrendingUp, color: "text-purple-500" },
          ].map((kpi) => (
            <div key={kpi.label} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
              <div className={cn("p-2 rounded-lg bg-background", kpi.color)}>
                <kpi.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-sm font-bold">{kpi.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar lead..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 h-8">
            <Filter className="w-3.5 h-3.5" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Mobile horizontal scroll tip */}
      <div className="md:hidden bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 mx-0 mb-2 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
        <span>👆</span> Desliza horizontalmente para ver todas las etapas
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-3 px-6 py-4 h-full min-w-max">
          {LEAD_STAGES.map((stage) => {
            const stageLeads = getStageLeads(stage.id as LeadStage);
            const stageValue = getStageTotalValue(stage.id as LeadStage);
            const isDragOver = dragOverStage === stage.id;

            return (
              <div
                key={stage.id}
                className={cn(
                  "flex flex-col w-64 rounded-2xl border transition-all duration-200",
                  isDragOver
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.01]"
                    : "border-border bg-muted/20"
                )}
                onDragOver={(e) => handleDragOver(e, stage.id as LeadStage)}
                onDrop={(e) => handleDrop(e, stage.id as LeadStage)}
                onDragLeave={() => setDragOverStage(null)}
              >
                {/* Column Header */}
                <div className="p-3 shrink-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("flex items-center justify-center w-6 h-6 rounded-md text-xs", stage.color)}>
                        {STAGE_ICONS[stage.id]}
                      </span>
                      <span className="text-sm font-semibold">{stage.label}</span>
                      <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground text-[11px] font-bold flex items-center justify-center">
                        {stageLeads.length}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="opacity-40 hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-xs">
                        <DropdownMenuItem>Agregar lead aquí</DropdownMenuItem>
                        <DropdownMenuItem>Ordenar por fecha</DropdownMenuItem>
                        <DropdownMenuItem>Ordenar por valor</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {stageValue > 0 && (
                    <p className="text-xs text-muted-foreground ml-8">
                      {formatCurrency(stageValue, "MXN")}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Cards */}
                <ScrollArea className="flex-1 px-2 py-2">
                  <div className="space-y-2">
                    <AnimatePresence>
                      {stageLeads.map((lead) => (
                        <motion.div
                          key={lead.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          draggable
                          onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, lead)}
                          onDragEnd={handleDragEnd}
                          className={cn(
                            "bg-background rounded-xl border border-border p-3 cursor-grab active:cursor-grabbing",
                            "hover:border-primary/30 hover:shadow-md hover:shadow-black/5 transition-all duration-150",
                            draggedLead?.id === lead.id && "opacity-50 scale-95"
                          )}
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-1 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <Avatar className="w-7 h-7 shrink-0">
                                <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                                  {getInitials(lead.customer.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate">{lead.customer.name}</p>
                                {lead.customer.phone && (
                                  <p className="text-[10px] text-muted-foreground truncate">{lead.customer.phone}</p>
                                )}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="opacity-40 hover:opacity-100 transition-opacity p-0.5 shrink-0"
                                  onMouseDown={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="text-xs">
                                <DropdownMenuItem onClick={() => openDetail(lead)}>
                                  <Eye className="w-3.5 h-3.5 mr-2" />Ver detalle
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-3.5 h-3.5 mr-2" />Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <div className="px-2 py-1 text-[11px] text-muted-foreground font-medium">Mover a</div>
                                {LEAD_STAGES.filter((s) => s.id !== stage.id).map((s) => (
                                  <DropdownMenuItem
                                    key={s.id}
                                    onClick={() => moveLead(lead.id, s.id as LeadStage)}
                                  >
                                    <ArrowRight className="w-3.5 h-3.5 mr-2" />{s.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Notes */}
                          {lead.notes && (
                            <p className="text-[11px] text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                              {lead.notes}
                            </p>
                          )}

                          {/* Value */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(lead.estimatedValue, "MXN")}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn("text-[9px] px-1.5 py-0 h-4", CUSTOMER_SOURCE_COLORS[lead.source])}
                            >
                              {CUSTOMER_SOURCE_LABELS[lead.source]}
                            </Badge>
                          </div>

                          {/* Tags */}
                          {lead.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {lead.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                  {tag}
                                </span>
                              ))}
                              {lead.tags.length > 2 && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                  +{lead.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2 border-t border-border/60">
                            {lead.assignedTo ? (
                              <div className="flex items-center gap-1">
                                <Avatar className="w-4 h-4">
                                  <AvatarFallback className="text-[8px]">{getInitials(lead.assignedTo)}</AvatarFallback>
                                </Avatar>
                                <span className="text-[10px] text-muted-foreground">{lead.assignedTo.split(" ")[0]}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-muted-foreground/60">Sin asignar</span>
                            )}
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatDateRelative(lead.lastContact)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Empty state */}
                    {stageLeads.length === 0 && (
                      <div className={cn(
                        "border-2 border-dashed rounded-xl p-4 text-center transition-all",
                        isDragOver ? "border-primary bg-primary/5" : "border-border/50"
                      )}>
                        <p className="text-xs text-muted-foreground">
                          {isDragOver ? "Soltar aquí" : "Sin leads"}
                        </p>
                      </div>
                    )}

                    {/* Add card button */}
                    <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                      <Plus className="w-3.5 h-3.5" />
                      Agregar lead
                    </button>
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedLead && (
                <>
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="font-bold bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                      {getInitials(selectedLead.customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{selectedLead.customer.name}</div>
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-normal mt-0.5", LEAD_STAGE_COLORS[selectedLead.stage])}
                    >
                      {LEAD_STAGES.find((s) => s.id === selectedLead.stage)?.label}
                    </Badge>
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/40 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Valor estimado</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(selectedLead.estimatedValue, "MXN")}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/40 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Fuente</p>
                  <Badge variant="outline" className={cn("text-xs", CUSTOMER_SOURCE_COLORS[selectedLead.source])}>
                    {CUSTOMER_SOURCE_LABELS[selectedLead.source]}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                {selectedLead.customer.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedLead.customer.phone}</span>
                  </div>
                )}
                {selectedLead.assignedTo && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Asignado a <strong>{selectedLead.assignedTo}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Último contacto {formatDateRelative(selectedLead.lastContact)}</span>
                </div>
              </div>

              {selectedLead.notes && (
                <div className="p-3 rounded-lg bg-muted/40 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Notas</p>
                  <p className="text-sm">{selectedLead.notes}</p>
                </div>
              )}

              {selectedLead.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedLead.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <Separator />

              <div className="flex gap-2">
                <Button size="sm" className="flex-1 gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Ver conversación
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1.5">
                  <Edit className="w-3.5 h-3.5" />
                  Editar lead
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1.5 border-green-300 text-green-700 hover:bg-green-50"
                  onClick={() => { moveLead(selectedLead.id, "SOLD"); setShowDetail(false); }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Marcar vendido
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1.5 border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => { moveLead(selectedLead.id, "LOST"); setShowDetail(false); }}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Marcar perdido
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
