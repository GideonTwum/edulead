import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { AntdRegistry } from "@/components/AntdRegistry";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "EduLead Network | Education for Leadership and Change",
    template: "%s | EduLead Network",
  },
  description:
    "EduLead Network bridges the gap between education and leadership by equipping young people with mentorship, policy exposure, and career guidance.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "EduLead Network",
  },
  robots: { index: true, follow: true },
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
