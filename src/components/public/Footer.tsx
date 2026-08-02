import Link from "next/link";
import Image from "next/image";
import { NAV_ITEMS, ROUTES } from "@/lib/constants";
import { SocialLinks } from "./SocialLinks";

interface FooterProps {
  settings?: {
    organisationName?: string;
    tagline?: string;
    logoUrl?: string | null;
    generalEmail?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    footerText?: string | null;
    facebookUrl?: string | null;
    twitterUrl?: string | null;
    instagramUrl?: string | null;
    linkedinUrl?: string | null;
    youtubeUrl?: string | null;
  } | null;
}

export function Footer({ settings }: FooterProps) {
  const orgName = settings?.organisationName ?? "EduLead Network";
  const mission =
    settings?.footerText ??
    "EduLead Network exists to bridge the gap between education and leadership by providing structured mentorship, policy exposure, and career development support to young people.";

  return (
    <footer className="gradient-navy text-white">
      <div className="container-brand section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href={ROUTES.home} className="inline-block">
              <Image
                src={settings?.logoUrl ?? "/logo.jpeg"}
                alt={`${orgName} logo`}
                width={160}
                height={60}
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/80">{mission}</p>
            <SocialLinks settings={settings} className="mt-6" />
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-brand-green">
              Navigation
            </h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/80 transition-colors hover:text-brand-green">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-brand-green">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              {settings?.generalEmail && (
                <li>
                  <a href={`mailto:${settings.generalEmail}`} className="hover:text-brand-green">
                    {settings.generalEmail}
                  </a>
                </li>
              )}
              {settings?.phone && <li>{settings.phone}</li>}
              {settings?.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-green"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {!settings?.generalEmail && !settings?.phone && (
                <li className="text-white/60">Contact details coming soon</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-brand-green">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={ROUTES.privacy} className="text-white/80 hover:text-brand-green">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={ROUTES.terms} className="text-white/80 hover:text-brand-green">
                  Terms of Use
                </Link>
              </li>
              <li>
                <a href="#newsletter" className="text-white/80 hover:text-brand-green">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} {orgName}. All rights reserved.
          </p>
          <Link href={ROUTES.admin.login} className="text-xs text-white/40 hover:text-white/60">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
