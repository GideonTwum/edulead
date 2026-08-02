import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface JoinMovementButtonProps {
  className?: string;
  onNavigate?: () => void;
}

export function JoinMovementButton({ className, onNavigate }: JoinMovementButtonProps) {
  return (
    <Link
      href={ROUTES.join}
      onClick={onNavigate}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-brand-navy transition-all",
        "hover:bg-brand-green-dark hover:shadow-brand active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-dark",
        className,
      )}
    >
      Join the Movement
    </Link>
  );
}
