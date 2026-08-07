import type { Metadata } from "next";
import { HeroSection } from "@/components/public/HeroSection";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata = buildPageMetadata(PAGE_SEO.terms);

export default function TermsPage() {
  return (
    <>
      <HeroSection
        headline="Terms of Use"
        subtext="Terms and conditions for using the EduLead Network website."
      />

      <section className="section-padding">
        <div className="container-brand max-w-3xl">
          <Breadcrumbs items={[{ label: "Terms of Use" }]} />

          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-navy">
            <p className="text-brand-grey">
              <em>Last updated: {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</em>
            </p>

            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using the EduLead Network website, you agree to these terms of use. If you do
              not agree, please do not use this website.
            </p>

            <h2>Use of Website</h2>
            <p>
              This website is provided for informational purposes about EduLead Network&apos;s programmes,
              events, and opportunities. You agree to use the site lawfully and not to misuse any forms or
              services.
            </p>

            <h2>Opportunities Directory</h2>
            <p>
              The opportunities listed on this website are curated for informational purposes. EduLead Network
              is not the administering organisation for third-party opportunities. We do not guarantee the
              accuracy of listing details and are not responsible for application outcomes.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              Content on this website — including text, images, and branding — is owned by EduLead Network
              unless otherwise stated. You may not reproduce content without permission.
            </p>

            <h2>Form Submissions</h2>
            <p>
              By submitting forms on this website, you confirm that the information provided is accurate and
              that you consent to being contacted by EduLead Network regarding your submission.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              EduLead Network provides this website &quot;as is&quot; without warranties. We are not liable for
              any damages arising from use of this website or reliance on its content.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the website after changes
              constitutes acceptance of the updated terms.
            </p>

            <h2>Contact</h2>
            <p>
              For questions about these terms, please contact us through our{" "}
              <a href="/contact" className="text-brand-navy underline hover:text-brand-green-dark">
                contact page
              </a>
              .
            </p>

            <p className="rounded-brand-lg bg-amber-50 p-4 text-sm text-brand-grey">
              <strong>Note:</strong> This is a placeholder terms of use document. It should be reviewed and
              finalised by legal counsel before launch.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
