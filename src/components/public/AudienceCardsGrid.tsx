"use client";

import { AudienceStoryRow } from "./media/AudienceStoryRow";
import { AUDIENCE_GROUPS } from "@/config/audience-groups";

export function AudienceCardsGrid() {
  return (
    <div className="grid gap-6">
      {AUDIENCE_GROUPS.map((group, index) => (
        <AudienceStoryRow key={group.id} group={group} reverse={index % 2 === 1} />
      ))}
    </div>
  );
}
