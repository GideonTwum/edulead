/**
 * Homepage hero background slideshow images.
 * Add new entries here — no component edits required.
 */

export interface HeroSlideImage {
  src: string;
  alt: string;
  /** Optional focal point for object-position (percentage) */
  objectPosition?: string;
}

export const HERO_SLIDESHOW_IMAGES: HeroSlideImage[] = [
  {
    src: "/images/hero/youth-slide-1.png",
    alt: "Illustrative photo — young Black students collaborating around a tablet outdoors",
    objectPosition: "center 30%",
  },
  {
    src: "/images/hero/youth-slide-2.png",
    alt: "Illustrative photo — group of young Black students together on a university campus",
    objectPosition: "center 35%",
  },
  {
    src: "/images/hero/youth-slide-3.png",
    alt: "Illustrative photo — young Black friends smiling together outdoors",
    objectPosition: "center 40%",
  },
];

/** Slideshow timing (ms) */
export const HERO_SLIDESHOW_CONFIG = {
  slideDurationMs: 7000,
  fadeDurationMs: 1000,
  kenBurnsScale: 1.05,
} as const;
