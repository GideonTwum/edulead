import { cn } from "@/lib/utils";
import { EditorialImage } from "./EditorialImage";
import type { PublicImageRef } from "@/lib/public-images";

interface BackgroundOverlayProps {
  image: PublicImageRef;
  children: React.ReactNode;
  className?: string;
  overlay?: "navy" | "navy-heavy" | "gradient";
  minHeight?: string;
}

const overlayClasses = {
  navy: "bg-brand-navy/80",
  "navy-heavy": "bg-brand-navy/88",
  gradient: "bg-gradient-to-r from-brand-navy/92 via-brand-navy/84 to-brand-navy/72",
};

export function BackgroundOverlay({
  image,
  children,
  className,
  overlay = "navy-heavy",
  minHeight = "min-h-[28rem]",
}: BackgroundOverlayProps) {
  return (
    <section className={cn("relative overflow-hidden", minHeight, className)}>
      <div className="absolute inset-0" aria-hidden="true">
        <EditorialImage
          src={image.src}
          alt=""
          animate={false}
          rounded="none"
          aspect="auto"
          className="absolute inset-0 h-full min-h-full"
          imageClassName="object-cover"
          sizes="100vw"
        />
        <div className={cn("absolute inset-0", overlayClasses[overlay])} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(181,211,52,0.12),transparent_55%)]" />
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
