import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PublicImageRef } from "@/lib/public-images";

interface BackgroundOverlayProps {
  image: PublicImageRef;
  children: React.ReactNode;
  className?: string;
  overlay?: "navy" | "navy-heavy" | "gradient" | "join";
  minHeight?: string;
  objectPosition?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

const overlayClasses = {
  navy: "bg-brand-navy/80",
  "navy-heavy": "bg-brand-navy/88",
  gradient: "bg-gradient-to-r from-brand-navy/92 via-brand-navy/84 to-brand-navy/72",
  join: cn(
    "bg-gradient-to-br from-[rgba(15,24,90,0.72)] via-[rgba(24,38,110,0.60)] to-[rgba(15,24,79,0.76)]",
    "max-md:from-[rgba(15,24,90,0.78)] max-md:via-[rgba(24,38,110,0.72)] max-md:to-[rgba(15,24,79,0.82)]",
  ),
};

export function BackgroundOverlay({
  image,
  children,
  className,
  overlay = "navy-heavy",
  minHeight = "min-h-[28rem]",
  objectPosition = "center center",
  loading = "lazy",
  priority = false,
}: BackgroundOverlayProps) {
  return (
    <section className={cn("relative overflow-hidden", minHeight, className)}>
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={image.src}
          alt=""
          fill
          priority={priority}
          loading={priority ? undefined : loading}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
        <div className={cn("absolute inset-0", overlayClasses[overlay])} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(181,211,52,0.10),transparent_55%)]" />
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
