"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
      </div>

      <h1 className="font-display text-2xl font-bold text-brand-navy md:text-3xl">Something Went Wrong</h1>
      <p className="mt-3 max-w-md text-brand-grey">
        We encountered an unexpected error. Please try again, or return to the homepage if the problem
        persists.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button type="button" onClick={reset} className="btn-primary">
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
        <Link href={ROUTES.home} className="btn-secondary">
          <Home className="h-4 w-4" /> Go Home
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 text-xs text-brand-grey">Error reference: {error.digest}</p>
      )}
    </div>
  );
}
