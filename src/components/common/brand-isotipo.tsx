import { cn } from "@/lib/utils";

interface BrandIsotipoProps {
  className?: string;
  imageClassName?: string;
}

export function BrandIsotipo({ className, imageClassName }: BrandIsotipoProps) {
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden", className)}>
      <img
        src="/branding/greycrm-isotipo-day.png"
        alt="GreyCRM"
        className={cn("block h-full w-full object-contain dark:hidden", imageClassName)}
      />
      <img
        src="/branding/greycrm-isotipo-night.png"
        alt="GreyCRM"
        className={cn("hidden h-full w-full object-contain dark:block", imageClassName)}
      />
    </span>
  );
}
