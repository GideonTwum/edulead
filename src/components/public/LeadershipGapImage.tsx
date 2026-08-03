"use client";

import { EditorialImage } from "./media/EditorialImage";
import { PUBLIC_IMAGES } from "@/lib/public-images";

export function LeadershipGapImage() {
  return (
    <EditorialImage
      src={PUBLIC_IMAGES.sections.leadershipGap.src}
      alt={PUBLIC_IMAGES.sections.leadershipGap.alt}
      rounded="2xl"
      aspect="portrait"
      className="mx-auto max-w-md shadow-brand-lg lg:max-w-none"
      sizes="(max-width: 1024px) 90vw, 420px"
    />
  );
}
