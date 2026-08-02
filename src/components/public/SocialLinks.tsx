import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialLinksProps {
  settings?: {
    facebookUrl?: string | null;
    twitterUrl?: string | null;
    instagramUrl?: string | null;
    linkedinUrl?: string | null;
    youtubeUrl?: string | null;
  } | null;
  className?: string;
}

export function SocialLinks({ settings, className }: SocialLinksProps) {
  const links = [
    { url: settings?.facebookUrl, icon: Facebook, label: "Facebook" },
    { url: settings?.twitterUrl, icon: Twitter, label: "Twitter" },
    { url: settings?.instagramUrl, icon: Instagram, label: "Instagram" },
    { url: settings?.linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { url: settings?.youtubeUrl, icon: Youtube, label: "YouTube" },
  ].filter((l) => l.url);

  if (links.length === 0) return null;

  return (
    <div className={cn("flex gap-3", className)}>
      {links.map(({ url, icon: Icon, label }) => (
        <a
          key={label}
          href={url!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-green hover:text-brand-navy"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
