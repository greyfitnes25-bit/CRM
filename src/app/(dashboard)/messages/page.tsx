"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Search, Filter, ChevronDown, Send, Paperclip,
  Smile, MoreVertical, Phone, Video, Star, Tag, UserPlus,
  CheckCheck, Clock, StickyNote, X, ChevronRight, Hash,
  Globe, Users, Zap, RefreshCw, ArrowLeft, Bot, Loader2, RadioTower,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials, formatDateRelative } from "@/lib/utils";
import { DEMO_CONVERSATIONS, DEMO_MESSAGES, DEMO_QUICK_REPLIES, type DemoConversation, type DemoMessage } from "@/lib/demo-data";
import { ChannelLogo, type ChannelLogoId } from "@/components/common/channel-logo";

type Channel = "ALL" | "WHATSAPP" | "INSTAGRAM" | "MESSENGER" | "META_ADS" | "WEB";
type StatusFilter = "ALL" | "OPEN" | "PENDING" | "CLOSED";
type MessageMode = "reply" | "note";

const CHANNEL_CONFIG = {
  WHATSAPP: {
    label: "WhatsApp",
    icon: MessageSquare,
    color: "text-green-500",
    bg: "bg-green-500",
    badge: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  INSTAGRAM: {
    label: "Instagram",
    icon: MessageSquare,
    color: "text-pink-500",
    bg: "bg-gradient-to-br from-purple-500 to-pink-500",
    badge: "bg-pink-100 text-pink-700 border-pink-200",
    dot: "bg-pink-500",
  },
  MESSENGER: {
    label: "Messenger",
    icon: MessageSquare,
    color: "text-blue-500",
    bg: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  META_ADS: {
    label: "Meta Ads",
    icon: MessageSquare,
    color: "text-blue-600",
    bg: "bg-blue-600",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-600",
  },
  WEB: {
    label: "Web",
    icon: Globe,
    color: "text-gray-500",
    bg: "bg-gray-500",
    badge: "bg-gray-100 text-gray-700 border-gray-200",
    dot: "bg-gray-500",
  },
};

const STATUS_CONFIG = {
  OPEN: { label: "Abierta", color: "bg-green-100 text-green-700 border-green-200" },
  PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  CLOSED: { label: "Cerrada", color: "bg-gray-100 text-gray-600 border-gray-200" },
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string | null>("conv-1");
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [channelFilter, setChannelFilter] = useState<Channel>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messageMode, setMessageMode] = useState<MessageMode>("reply");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showCustomerPanel, setShowCustomerPanel] = useState(true);
  const [showMobileList, setShowMobileList] = useState(true);
  const [metaNotice, setMetaNotice] = useState<string | null>(null);
  const [syncingMeta, setSyncingMeta] = useState(false);
  const [suggestingAi, setSuggestingAi] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;
  const currentMessages = selectedId ? (messages[selectedId] ?? []) : [];

  useEffect(() => {
    const requestedChannel = new URLSearchParams(window.location.search).get("channel")?.toUpperCase();
    const validChannels: Channel[] = ["ALL", "WHATSAPP", "INSTAGRAM", "MESSENGER", "META_ADS", "WEB"];
    if (requestedChannel && validChannels.includes(requestedChannel as Channel)) {
      setChannelFilter(requestedChannel as Channel);
      setShowMobileList(true);
    }
  }, []);

  const filtered = conversations.filter((c) => {
    if (channelFilter !== "ALL" && c.channel !== channelFilter) return false;
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    if (search && !c.customer.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.lastMessage.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSend = async () => {
    if (!messageText.trim() || !selectedId) return;
    const textToSend = messageText.trim();
    const newMsg = {
      id: `msg-${Date.now()}`,
      content: textToSend,
      direction: "OUTBOUND" as const,
      senderName: "Tu",
      sentAt: new Date(),
      type: messageMode === "note" ? ("note" as const) : ("text" as const),
    };
    setMessages((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] ?? []), newMsg] }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, lastMessage: textToSend, lastMessageAt: new Date(), unread: 0 }
          : c
      )
    );
    setMessageText("");
    setShowQuickReplies(false);

    if (messageMode === "reply" && selected && selected.channel !== "WEB") {
      try {
        const response = await fetch("/api/integrations/meta/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channel: selected.channel,
            recipient: selected.customer.phone || selected.customer.id,
            message: textToSend,
          }),
        });
        const data = await response.json();
        setMetaNotice(data?.message || "Mensaje enviado por el canal conectado.");
      } catch {
        setMetaNotice("El mensaje quedo guardado localmente. Revisa la conexion Meta.");
      }
    } else if (messageMode === "note") {
      setMetaNotice("Nota interna guardada. No se envio al cliente.");
    }
  };

  const handleMetaSync = async () => {
    setSyncingMeta(true);
    setMetaNotice(null);
    try {
      const response = await fetch("/api/integrations/meta/sync", { method: "POST" });
      const data = await response.json();
      setMetaNotice(`${data.message} Conversaciones: ${data.imported?.conversations ?? 0}, leads: ${data.imported?.leads ?? 0}.`);
    } catch {
      setMetaNotice("No se pudo sincronizar Meta. Verifica internet y variables de entorno.");
    } finally {
      setSyncingMeta(false);
    }
  };

  const handleAiSuggest = async () => {
    if (!selectedId || !selected) return;
    const lastInbound = [...currentMessages].reverse().find((msg) => msg.direction === "INBOUND");
    setSuggestingAi(true);
    setMetaNotice(null);
    try {
      const response = await fetch("/api/ai/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: "Recepcionista IA",
          message: lastInbound?.content || selected.lastMessage,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "No se pudo generar respuesta IA.");
      setMessageMode("reply");
      setMessageText(data.reply);
      setMetaNotice(`${data.summary} Respuesta IA lista para revisar y enviar.`);
    } catch (error) {
      setMetaNotice(error instanceof Error ? error.message : "No se pudo generar respuesta IA.");
    } finally {
      setSuggestingAi(false);
    }
  };
  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    setShowMobileList(false);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const handleStatusChange = (newStatus: "OPEN" | "PENDING" | "CLOSED") => {
    if (!selectedId) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, status: newStatus } : c))
    );
  };

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unread ?? 0), 0);

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden">
      {/* â”€â”€â”€ PANEL IZQUIERDO: Lista de conversaciones â”€â”€â”€ */}
      <div
        className={cn(
          "w-full md:w-80 lg:w-96 flex flex-col border-r border-border bg-background shrink-0",
          !showMobileList && "hidden md:flex"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Mensajes</h1>
              {totalUnread > 0 && (
                <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {totalUnread}
                </Badge>
              )}
            </div>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={handleMetaSync} disabled={syncingMeta}>
              {syncingMeta ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Meta Sync
            </Button>
          </div>
          {metaNotice && (
            <div className="mb-3 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary">
              {metaNotice}
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversaciÃ³n..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* Filtros de canal */}
        <div className="grid grid-cols-2 gap-2 p-3 border-b border-border shrink-0 sm:flex sm:flex-wrap">
          {(["ALL", "WHATSAPP", "INSTAGRAM", "MESSENGER", "META_ADS", "WEB"] as Channel[]).map((ch) => {
            const count = ch === "ALL" ? conversations.length : conversations.filter((c) => c.channel === ch).length;
            return (
              <button
                key={ch}
                onClick={() => setChannelFilter(ch)}
                className={cn(
                  "flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                  channelFilter === ch
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <ChannelLogo channel={ch as ChannelLogoId} className="h-4 w-4 text-[9px]" />
                {ch === "ALL" ? "Todos" : CHANNEL_CONFIG[ch].label}
                <span className={cn(
                  "text-[10px] px-1 rounded-full",
                  channelFilter === ch ? "bg-white/20" : "bg-background"
                )}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Filtro de estado */}
        <div className="flex gap-1 px-3 py-2 border-b border-border shrink-0">
          {(["ALL", "OPEN", "PENDING", "CLOSED"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "flex-1 py-1 rounded-md text-xs font-medium transition-all",
                statusFilter === s
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s === "ALL" ? "Todas" : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>

        {/* Lista */}
        <ScrollArea className="flex-1">
          <div className="py-1">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No hay conversaciones
              </div>
            ) : (
              filtered.map((conv) => {
                const ch = CHANNEL_CONFIG[conv.channel];
                const isSelected = conv.id === selectedId;
                return (
                  <motion.button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "w-full text-left px-3 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 relative",
                      isSelected && "bg-primary/5 border-l-2 border-l-primary"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                            {getInitials(conv.customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <ChannelLogo channel={conv.channel as ChannelLogoId} className="absolute -bottom-1 -right-1 h-4 w-4 border-2 border-background" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={cn(
                            "text-sm font-medium truncate",
                            conv.unread > 0 && "font-semibold"
                          )}>
                            {conv.customer.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0" suppressHydrationWarning>
                            {formatDateRelative(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className={cn(
                          "text-xs truncate",
                          conv.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                        )}>
                          {conv.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-1.5 gap-1">
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className={cn("text-[9px] px-1 py-0 h-4 border", STATUS_CONFIG[conv.status].color)}>
                              {STATUS_CONFIG[conv.status].label}
                            </Badge>
                            {conv.assignedTo && (
                              <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                                {conv.assignedTo.split(" ")[0]}
                              </span>
                            )}
                          </div>
                          {conv.unread > 0 && (
                            <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold shrink-0">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* â”€â”€â”€ PANEL CENTRAL: Chat â”€â”€â”€ */}
      {selected ? (
        <div className={cn(
          "flex-1 flex flex-col min-w-0",
          showMobileList && "hidden md:flex"
        )}>
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm shrink-0">
            <button
              className="md:hidden p-1 rounded-md hover:bg-muted"
              onClick={() => setShowMobileList(true)}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="relative">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                  {getInitials(selected.customer.name)}
                </AvatarFallback>
              </Avatar>
              <ChannelLogo channel={selected.channel as ChannelLogoId} className="absolute -bottom-1 -right-1 h-4 w-4 border-2 border-background" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold truncate">{selected.customer.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{CHANNEL_CONFIG[selected.channel].label}</span>
                {selected.customer.phone && (
                  <span className="text-xs text-muted-foreground">{selected.customer.phone}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={handleAiSuggest}
                disabled={suggestingAi}
                title="Generar respuesta con IA"
              >
                {suggestingAi ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bot className="h-3.5 w-3.5" />}
                IA
              </Button>
              <Badge variant="outline" className="hidden gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-600 sm:flex">
                <RadioTower className="h-3 w-3" />
                Meta demo
              </Badge>
              {/* Status switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("text-xs h-7 gap-1 border", STATUS_CONFIG[selected.status].color)}>
                    {STATUS_CONFIG[selected.status].label}
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusChange("OPEN")}>Abrir</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>Pendiente</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("CLOSED")}>Cerrar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Asignar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1 text-xs text-muted-foreground font-medium">Asignar a</div>
                  <DropdownMenuSeparator />
                  {["Juan PÃ©rez", "Ana GarcÃ­a", "Carlos LÃ³pez"].map((name) => (
                    <DropdownMenuItem key={name} onClick={() => {
                      setConversations((prev) =>
                        prev.map((c) => c.id === selectedId ? { ...c, assignedTo: name } : c)
                      );
                    }}>
                      <Avatar className="w-5 h-5 mr-2">
                        <AvatarFallback className="text-[9px]">{getInitials(name)}</AvatarFallback>
                      </Avatar>
                      {name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Panel info */}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setShowCustomerPanel(!showCustomerPanel)}
              >
                <ChevronRight className={cn("w-4 h-4 transition-transform", showCustomerPanel && "rotate-180")} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><Star className="w-4 h-4 mr-2" />Marcar importante</DropdownMenuItem>
                  <DropdownMenuItem><Tag className="w-4 h-4 mr-2" />Agregar etiqueta</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem><Phone className="w-4 h-4 mr-2" />Llamar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 px-4 py-3">
            <div className="space-y-2 max-w-3xl mx-auto">
              {/* Date divider */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[11px] text-muted-foreground px-2 bg-background">Hoy</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {currentMessages.map((msg) => {
                const isOutbound = msg.direction === "OUTBOUND";
                const isNote = msg.type === "note";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-2", isOutbound ? "justify-end" : "justify-start")}
                  >
                    {!isOutbound && (
                      <Avatar className="w-7 h-7 shrink-0 mt-1">
                        <AvatarFallback className="text-[10px] bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                          {getInitials(msg.senderName)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("max-w-[70%] space-y-0.5", isOutbound && "items-end flex flex-col")}>
                      {!isOutbound && (
                        <span className="text-[11px] text-muted-foreground px-1">{msg.senderName}</span>
                      )}
                      <div className={cn(
                        "px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm",
                        isNote
                          ? "bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200 rounded-br-sm"
                          : isOutbound
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      )}>
                        {isNote && (
                          <div className="flex items-center gap-1 mb-1 opacity-60">
                            <StickyNote className="w-3 h-3" />
                            <span className="text-[10px] font-medium uppercase tracking-wide">Nota interna</span>
                          </div>
                        )}
                        {msg.content}
                      </div>
                      <div className={cn("flex items-center gap-1 px-1", isOutbound ? "justify-end" : "justify-start")}>
                        <span className="text-[10px] text-muted-foreground" suppressHydrationWarning>
                          {msg.sentAt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {isOutbound && !isNote && <CheckCheck className="w-3 h-3 text-blue-500" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Replies Panel */}
          <AnimatePresence>
            {showQuickReplies && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-border bg-muted/30 overflow-hidden shrink-0"
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Respuestas rÃ¡pidas
                    </span>
                    <button onClick={() => setShowQuickReplies(false)}>
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {DEMO_QUICK_REPLIES.map((qr) => (
                      <button
                        key={qr.id}
                        onClick={() => { setMessageText(qr.content); setShowQuickReplies(false); }}
                        className="text-left px-2.5 py-2 rounded-lg bg-background border border-border hover:border-primary hover:bg-primary/5 transition-all"
                      >
                        <div className="text-xs font-medium text-foreground">{qr.title}</div>
                        <div className="text-[11px] text-muted-foreground truncate mt-0.5">{qr.content.slice(0, 50)}...</div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Input */}
          <div className="border-t border-border bg-background p-3 shrink-0">
            {/* Mode toggle */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setMessageMode("reply")}
                className={cn(
                  "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all",
                  messageMode === "reply"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MessageSquare className="w-3 h-3" />
                Responder
              </button>
              <button
                onClick={() => setMessageMode("note")}
                className={cn(
                  "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all",
                  messageMode === "note"
                    ? "bg-yellow-500 text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <StickyNote className="w-3 h-3" />
                Nota interna
              </button>
            </div>
            <div className={cn(
              "flex gap-2 rounded-xl border p-2 transition-colors",
              messageMode === "note" ? "border-yellow-300 bg-yellow-50/50 dark:bg-yellow-900/10" : "border-border bg-background"
            )}>
              <Textarea
                placeholder={messageMode === "note" ? "Escribe una nota interna (solo visible para el equipo)..." : "Escribe un mensaje..."}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                className="flex-1 border-0 bg-transparent resize-none min-h-[40px] max-h-[120px] text-sm focus-visible:ring-0 p-1"
                rows={1}
              />
              <div className="flex flex-col gap-1 justify-end">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    onClick={handleAiSuggest}
                    disabled={suggestingAi}
                    title="Sugerir respuesta IA"
                  >
                    {suggestingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowQuickReplies(!showQuickReplies)}
                    title="Respuestas rÃ¡pidas"
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                    title="Adjuntar archivo"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={!messageText.trim()}
                    size="sm"
                    className={cn(
                      "h-7 w-7 p-0",
                      messageMode === "note" && "bg-yellow-500 hover:bg-yellow-600 text-white"
                    )}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 ml-1">
              {messageMode === "note" ? "âš ï¸ Nota interna â€” no se envÃ­a al cliente" : "Enter para enviar Â· Shift+Enter para salto de lÃ­nea"}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-1">Selecciona una conversaciÃ³n</h2>
            <p className="text-sm text-muted-foreground">Elige una conversaciÃ³n de la lista para empezar</p>
          </div>
        </div>
      )}

      {/* â”€â”€â”€ PANEL DERECHO: Info del cliente â”€â”€â”€ */}
      <AnimatePresence>
        {showCustomerPanel && selected && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:flex flex-col border-l border-border bg-background overflow-hidden shrink-0"
          >
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {/* Customer header */}
                <div className="text-center pt-2">
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                      {getInitials(selected.customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold">{selected.customer.name}</h3>
                  {selected.customer.phone && (
                    <p className="text-xs text-muted-foreground mt-0.5">{selected.customer.phone}</p>
                  )}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="outline" className={cn("text-xs gap-1.5", CHANNEL_CONFIG[selected.channel].badge)}>
                      <ChannelLogo channel={selected.channel as ChannelLogoId} className="h-4 w-4" />
                      {CHANNEL_CONFIG[selected.channel].label}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs", STATUS_CONFIG[selected.status].color)}>
                      {STATUS_CONFIG[selected.status].label}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Assigned to */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Asignado a</span>
                  </div>
                  {selected.assignedTo ? (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-[10px]">{getInitials(selected.assignedTo)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{selected.assignedTo}</span>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                      <UserPlus className="w-3 h-3" />
                      Asignar agente
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Tags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Etiquetas</span>
                    <button className="text-primary text-xs hover:underline">+ Agregar</button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selected.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
                        <Hash className="w-2.5 h-2.5 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Quick Stats */}
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actividad</span>
                  <div className="mt-2 space-y-2">
                    {[
                      { label: "Conversaciones", value: "3" },
                      { label: "Cotizaciones", value: "1" },
                      { label: "Compras", value: "0" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{stat.label}</span>
                        <span className="font-medium">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 justify-start">
                    <Users className="w-3.5 h-3.5" />
                    Ver perfil completo
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 justify-start">
                    <Tag className="w-3.5 h-3.5" />
                    Convertir a lead
                  </Button>
                </div>

                {/* Footer note */}
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 text-center">
                    ðŸ’¡ MÃ³dulo simulado. Conecta WhatsApp Business API para mensajes reales.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile FAB: Nueva conversacion */}
      <button
        className="md:hidden fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-colors"
        title="Nueva conversacion"
        aria-label="Nueva conversacion"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}

