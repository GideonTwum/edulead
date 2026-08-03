import { cn } from "@/lib/utils";
import { EditorialImage } from "./EditorialImage";
import type { PublicImageRef } from "@/lib/public-images";

interface QuoteImageBlockProps {
  quote: string;
  attribution?: string;
  image: PublicImageRef;
  className?: string;
}

export function QuoteImageBlock({ quote, attribution, image, className }: QuoteImageBlockProps) {
  return (
    <div className={cn("grid overflow-hidden rounded-brand-lg bg-white shadow-brand lg:grid-cols-[1.1fr_0.9fr]", className)}>
      <div className="relative min-h-[16rem]">
        <EditorialImage
          src={image.src}
          alt={image.alt}
          rounded="none"
          aspect="auto"
          className="absolute inset-0 h-full min-h-full"
          animate={false}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <blockquote className="flex flex-col justify-center p-8 md:p-10">
        <p className="text-lg leading-relaxed text-brand-text md:text-xl">&ldquo;{quote}&rdquo;</p>
        {attribution ? (
          <footer className="mt-4 text-sm font-semibold text-brand-navy">{attribution}</footer>
        ) : null}
      </blockquote>
    </div>
  );
}
