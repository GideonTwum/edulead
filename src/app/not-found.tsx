"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <span className="font-display text-8xl font-bold text-brand-navy/10 md:text-9xl">404</span>
        <span className="absolute inset-0 flex items-center justify-center font-display text-4xl font-bold text-brand-navy md:text-5xl">
          404
        </span>
      </div>

      <h1 className="font-display text-2xl font-bold text-brand-navy md:text-3xl">Page Not Found</h1>
      <p className="mt-3 max-w-md text-brand-grey">
        The page you are looking for does not exist or may have been moved. Let us help you find your way back.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href={ROUTES.home} className="btn-primary">
          <Home className="h-4 w-4" /> Go Home
        </Link>
        <button type="button" onClick={() => history.back()} className="btn-secondary">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </div>

      <nav className="mt-12" aria-label="Helpful links">
        <p className="mb-3 text-sm font-medium text-brand-grey">Popular pages</p>
        <ul className="flex flex-wrap justify-center gap-4 text-sm">
          <li>
            <Link href={ROUTES.about} className="text-brand-navy hover:text-brand-green-dark">
              About
            </Link>
          </li>
          <li>
            <Link href={ROUTES.programmes} className="text-brand-navy hover:text-brand-green-dark">
              Programmes
            </Link>
          </li>
          <li>
            <Link href={ROUTES.join} className="text-brand-navy hover:text-brand-green-dark">
              Join Us
            </Link>
          </li>
          <li>
            <Link href={ROUTES.contact} className="text-brand-navy hover:text-brand-green-dark">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
