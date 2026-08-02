import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface HeaderLogoProps {
  logoUrl: string;
  compact?: boolean;
  onNavigate?: () => void;
  className?: string;
}

export function HeaderLogo({
  logoUrl,
  compact = false,
  onNavigate,
  className,
}: HeaderLogoProps) {
  return (
    <Link
      href={ROUTES.home}
      onClick={onNavigate}
      aria-label="EduLead Network Home"
      className={cn("inline-flex h-full shrink-0 items-center", className)}
    >
      <Image
        src={logoUrl}
        alt=""
        aria-hidden
        width={240}
        height={64}
        priority
        className={cn(
          "h-auto w-auto max-w-full object-contain object-left transition-all duration-300",
          compact
            ? "max-h-9 sm:max-h-10 xl:max-h-11"
            : "max-h-10 sm:max-h-11 xl:max-h-12",
          compact
            ? "max-w-[132px] sm:max-w-[148px] xl:max-w-[168px]"
            : "max-w-[140px] sm:max-w-[160px] md:max-w-[180px] xl:max-w-[200px] 2xl:max-w-[220px]",
        )}
      />
    </Link>
  );
}
