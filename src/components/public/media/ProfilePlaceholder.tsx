import { EditorialImage } from "./EditorialImage";
import { cn } from "@/lib/utils";

interface ProfilePlaceholderProps {
  message?: string;
  className?: string;
}

export function ProfilePlaceholder({
  message = "Our leadership team will be introduced soon.",
  className,
}: ProfilePlaceholderProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-brand-lg", className)}>
      <EditorialImage
        src="/images/placeholders/team-coming-soon.svg"
        alt="Illustrative placeholder — leadership team introduction coming soon"
        rounded="lg"
        aspect="wide"
        className="min-h-[16rem]"
        sizes="(max-width: 768px) 100vw, 800px"
      />
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-brand-navy/90 via-brand-navy/40 to-transparent p-8">
        <p className="max-w-xl font-display text-2xl font-bold text-white md:text-3xl">{message}</p>
      </div>
    </div>
  );
}
