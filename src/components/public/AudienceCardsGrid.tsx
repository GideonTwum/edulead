"use client";

import { GraduationCap, Users, Briefcase, Globe, Heart } from "lucide-react";
import { AudienceCard } from "./media/AudienceCard";
import { TARGET_AUDIENCES } from "@/lib/constants";
import { AUDIENCE_IMAGES } from "@/lib/public-images";

const audienceIcons = [GraduationCap, Users, Briefcase, Globe, Heart, Users];

export function AudienceCardsGrid() {
  return (
    <div className="grid gap-6">
      {TARGET_AUDIENCES.map((audience, i) => {
        const Icon = audienceIcons[i] ?? Users;
        return (
          <AudienceCard
            key={audience}
            title={audience}
            image={AUDIENCE_IMAGES[i] ?? AUDIENCE_IMAGES[0]}
            icon={Icon}
            reverse={i % 2 === 1}
          />
        );
      })}
    </div>
  );
}
