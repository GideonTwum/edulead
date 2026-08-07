import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ContactForm } from "@/components/public/ContactForm";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { SocialLinks } from "@/components/public/SocialLinks";
import { getSiteSettings, getPageSections, getSection } from "@/lib/data/settings";
import { PageKey } from "@prisma/client";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata = buildPageMetadata({
  ...PAGE_SEO.contact,
  useAbsoluteTitle: true,
});

export default async function ContactPage() {
  const [settings, sections] = await Promise.all([getSiteSettings(), getPageSections(PageKey.CONTACT)]);
  const hero = getSection(sections, "hero");
  const info = getSection(sections, "contact-info");

  return (
    <>
      <HeroSection
        headline={hero?.heading ?? "Contact Us"}
        subtext={
          hero?.body ??
          "We welcome enquiries about our programmes, partnerships, events, and how to get involved. As an emerging organisation, we aim to respond within a few business days."
        }
      />

      <section className="section-padding">
        <div className="container-brand">
          <Breadcrumbs items={[{ label: "Contact" }]} />

          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            <div>
              <SectionHeading
                eyebrow="Message"
                title="Send Us a Message"
                description="Fill out the form and we will get back to you."
                align="left"
                className="mb-8 !max-w-none"
              />
              <ContactForm />
            </div>

            <aside className="space-y-6">
              <div className="rounded-brand-lg bg-white p-8 shadow-brand">
                <h3 className="font-display text-xl font-bold text-brand-navy">Contact Information</h3>
                <p className="mt-2 text-sm text-brand-grey">
                  {info?.body ?? "Reach out through any of the channels below."}
                </p>

                <dl className="mt-6 space-y-4 text-sm">
                  {settings.generalEmail && (
                    <div className="flex gap-3">
                      <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-green-dark" aria-hidden="true" />
                      <div>
                        <dt className="font-medium text-brand-navy">Email</dt>
                        <dd>
                          <a href={`mailto:${settings.generalEmail}`} className="text-brand-grey hover:text-brand-navy">
                            {settings.generalEmail}
                          </a>
                        </dd>
                      </div>
                    </div>
                  )}
                  {settings.phone && (
                    <div className="flex gap-3">
                      <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-green-dark" aria-hidden="true" />
                      <div>
                        <dt className="font-medium text-brand-navy">Phone</dt>
                        <dd>
                          <a href={`tel:${settings.phone}`} className="text-brand-grey hover:text-brand-navy">
                            {settings.phone}
                          </a>
                        </dd>
                      </div>
                    </div>
                  )}
                  {settings.whatsapp && (
                    <div className="flex gap-3">
                      <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-green-dark" aria-hidden="true" />
                      <div>
                        <dt className="font-medium text-brand-navy">WhatsApp</dt>
                        <dd>
                          <a
                            href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-grey hover:text-brand-navy"
                          >
                            {settings.whatsapp}
                          </a>
                        </dd>
                      </div>
                    </div>
                  )}
                  {settings.address && (
                    <div className="flex gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-green-dark" aria-hidden="true" />
                      <div>
                        <dt className="font-medium text-brand-navy">Address</dt>
                        <dd className="text-brand-grey">{settings.address}</dd>
                      </div>
                    </div>
                  )}
                </dl>

                {!settings.generalEmail && !settings.phone && !settings.address && (
                  <p className="mt-4 text-sm text-brand-grey">
                    Contact details are being finalised. Use the form to reach us in the meantime.
                  </p>
                )}

                <div className="mt-6 border-t border-brand-border pt-6">
                  <p className="mb-3 text-sm font-medium text-brand-navy">Follow Us</p>
                  <SocialLinks settings={settings} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
