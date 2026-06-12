"use client";

import { Globe, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChannelLogoId = "ALL" | "WHATSAPP" | "INSTAGRAM" | "MESSENGER" | "META_ADS" | "WEB" | "REFERRAL";

const CHANNEL_STYLES: Record<ChannelLogoId, { label: string; className: string; text?: string }> = {
  ALL: { label: "Todos", className: "bg-primary text-primary-foreground", text: "*" },
  WHATSAPP: { label: "WhatsApp", className: "bg-[#25D366] text-white" },
  INSTAGRAM: { label: "Instagram", className: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white" },
  MESSENGER: { label: "Messenger", className: "bg-gradient-to-br from-[#00B2FF] to-[#006AFF] text-white" },
  META_ADS: { label: "Meta Ads", className: "bg-[#1877F2] text-white", text: "∞" },
  WEB: { label: "Web", className: "bg-slate-600 text-white" },
  REFERRAL: { label: "Referidos", className: "bg-amber-500 text-white", text: "R" },
};

interface ChannelLogoProps {
  channel: ChannelLogoId;
  className?: string;
  showTooltip?: boolean;
}

export function ChannelLogo({ channel, className, showTooltip = true }: ChannelLogoProps) {
  const config = CHANNEL_STYLES[channel] ?? CHANNEL_STYLES.WEB;

  return (
    <span
      className={cn(
        "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold shadow-sm ring-1 ring-white/20",
        config.className,
        className
      )}
      title={showTooltip ? config.label : undefined}
      aria-label={config.label}
    >
      {channel === "WHATSAPP" && (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
          <path d="M12.04 2.25a9.62 9.62 0 0 0-8.27 14.52L2.75 21.75l5.1-1a9.62 9.62 0 1 0 4.19-18.5Zm0 1.72a7.9 7.9 0 0 1 6.72 12.04 7.9 7.9 0 0 1-9.94 2.95l-.36-.18-3.03.6.6-2.95-.2-.38a7.9 7.9 0 0 1 6.21-12.08Zm-3.4 3.9c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.43 1.03 2.6.13.17 1.75 2.8 4.3 3.81 2.13.84 2.56.67 3.02.63.46-.04 1.48-.6 1.69-1.19.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.29-.25-.13-1.48-.73-1.71-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.39.11-.52.12-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.38-.78-1.89-.2-.49-.41-.42-.57-.43h-.49Z" />
        </svg>
      )}
      {channel === "INSTAGRAM" && (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="4" />
          <circle cx="12" cy="12" r="3.2" />
          <circle cx="16.4" cy="7.7" r="1" className="fill-current stroke-0" />
        </svg>
      )}
      {channel === "MESSENGER" && (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
          <path d="M12 3.2c-5.05 0-9 3.7-9 8.45 0 2.7 1.28 5.08 3.3 6.63v2.52l2.4-1.31c1.02.38 2.13.59 3.3.59 5.05 0 9-3.7 9-8.43 0-4.75-3.95-8.45-9-8.45Zm.9 11.2-2.28-2.43-4.45 2.43 4.88-5.18 2.33 2.43 4.4-2.43-4.88 5.18Z" />
        </svg>
      )}
      {channel === "META_ADS" && (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4.2 14.2c1.45-4.1 3-6.15 4.62-6.15 1.16 0 2.2 1.03 3.18 2.36.98-1.33 2.02-2.36 3.18-2.36 1.62 0 3.17 2.05 4.62 6.15.58 1.63-.12 2.75-1.4 2.75-1.38 0-2.7-1.48-4-3.08L12 10.9l-2.4 2.97c-1.3 1.6-2.62 3.08-4 3.08-1.28 0-1.98-1.12-1.4-2.75Z" />
        </svg>
      )}
      {channel === "WEB" && <Globe className="h-3.5 w-3.5" />}
      {channel === "ALL" && <MousePointerClick className="h-3.5 w-3.5" />}
      {channel === "REFERRAL" && <span>{config.text}</span>}
    </span>
  );
}

export function channelLogoLabel(channel: ChannelLogoId) {
  return CHANNEL_STYLES[channel]?.label ?? channel;
}
