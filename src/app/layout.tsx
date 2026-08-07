import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { AntdRegistry } from "@/components/AntdRegistry";
import { SEO, absoluteUrl, buildOpenGraph, buildTwitterMeta, getSiteUrl, truncateDescription } from "@/lib/seo";
import { ROOT_FAVICON_METADATA } from "@/lib/favicon";
import "./globals.css";

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SEO.defaultTitle,
    template: SEO.titleTemplate,
  },
  description: truncateDescription(SEO.defaultDescription),
  openGraph: buildOpenGraph({
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    path: "/",
  }),
  twitter: buildTwitterMeta(SEO.defaultTitle, SEO.defaultDescription),
  robots: { index: true, follow: true },
  icons: ROOT_FAVICON_METADATA,
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
