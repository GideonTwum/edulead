import { cn } from "@/lib/utils";
import { EditorialImage } from "./EditorialImage";
import type { PublicImageRef } from "@/lib/public-images";

interface SplitImageSectionProps {
  image: PublicImageRef;
  children: React.ReactNode;
  imagePosition?: "left" | "right";
  className?: string;
}

export function SplitImageSection({
  image,
  children,
  imagePosition = "right",
  className,
}: SplitImageSectionProps) {
  const imageBlock = (
    <EditorialImage
      src={image.src}
      alt={image.alt}
      rounded="2xl"
      aspect="portrait"
      className="h-full w-full shadow-brand-lg"
      sizes="(max-width: 1024px) 100vw, 40vw"
    />
  );

  return (
    <div className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-16", className)}>
      {imagePosition === "left" ? imageBlock : null}
      <div>{children}</div>
      {imagePosition === "right" ? imageBlock : null}
    </div>
  );
}
