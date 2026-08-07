import { PublicHeader } from "@/components/public/navigation/PublicHeader";
import { Footer } from "@/components/public/Footer";
import { GoogleAnalytics } from "@/components/public/GoogleAnalytics";
import { getSiteSettings, getAnnouncement } from "@/lib/data/settings";
import { env } from "@/lib/env";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, announcement] = await Promise.all([getSiteSettings(), getAnnouncement()]);
  const measurementId = env.isDev
    ? null
    : settings?.googleAnalyticsId || env.gaMeasurementId || null;

  return (
    <>
      <GoogleAnalytics measurementId={measurementId} />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <PublicHeader
        settings={settings}
        announcement={
          announcement?.visible && announcement.heading
            ? { text: announcement.heading, link: announcement.buttonUrl }
            : null
        }
      />
      <main id="main-content">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
