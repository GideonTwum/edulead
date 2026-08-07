import type { Metadata } from "next";
import { HeroSection } from "@/components/public/HeroSection";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata = buildPageMetadata(PAGE_SEO.privacy);

export default function PrivacyPage() {
  return (
    <>
      <HeroSection
        headline="Privacy Policy"
        subtext="How EduLead Network collects, uses, and protects your personal information."
      />

      <section className="section-padding">
        <div className="container-brand max-w-3xl">
          <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-navy">
            <p className="text-brand-grey">
              <em>Last updated: {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</em>
            </p>

            <h2>Introduction</h2>
            <p>
              EduLead Network (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your
              privacy. This policy explains how we collect, use, and safeguard personal information when you
              visit our website or submit forms.
            </p>

            <h2>Information We Collect</h2>
            <p>We may collect the following information when you interact with our website:</p>
            <ul>
              <li>Name, email address, and phone number submitted through contact or join forms</li>
              <li>Information provided in programme interest and event registration forms</li>
              <li>Newsletter subscription details</li>
              <li>Basic analytics data (page views, device type) via Google Analytics, if enabled</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Respond to enquiries and process form submissions</li>
              <li>Send newsletters and updates you have subscribed to</li>
              <li>Improve our website and programmes</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Data Sharing</h2>
            <p>
              We do not sell your personal data. We may share information with service providers who assist
              us in operating our website (e.g., email delivery, hosting), subject to confidentiality
              agreements.
            </p>

            <h2>Data Retention</h2>
            <p>
              We retain personal data only for as long as necessary to fulfil the purposes outlined in this
              policy, or as required by law.
            </p>

            <h2>Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data by contacting us.
              You may unsubscribe from our newsletter at any time.
            </p>

            <h2>Cookies</h2>
            <p>
              Our website may use cookies for analytics and functionality. You can manage cookie preferences
              through your browser settings.
            </p>

            <h2>Contact</h2>
            <p>
              For privacy-related enquiries, please contact us through our{" "}
              <a href="/contact" className="text-brand-navy underline hover:text-brand-green-dark">
                contact page
              </a>
              .
            </p>

            <p className="rounded-brand-lg bg-amber-50 p-4 text-sm text-brand-grey">
              <strong>Note:</strong> This is a placeholder privacy policy. It should be reviewed and finalised
              by legal counsel before launch.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
