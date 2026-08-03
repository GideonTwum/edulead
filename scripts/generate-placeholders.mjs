import fs from "fs";
import path from "path";

const palettes = [
  { bg: ["#0f1a33", "#1e3a5f", "#2a4a6b"], accent: "#b5d334" },
  { bg: ["#142038", "#243b55", "#3d5a80"], accent: "#c4dc4a" },
  { bg: ["#1a2744", "#2d3f5e", "#4a6080"], accent: "#a8c92e" },
  { bg: ["#121f35", "#2a3d5c", "#3e5678"], accent: "#d4e157" },
];

function svg(label, idx) {
  const p = palettes[idx % palettes.length];
  const [c1, c2, c3] = p.bg;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="55%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="30%" r="50%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect width="1200" height="800" fill="url(#glow)"/>
  <circle cx="180" cy="620" r="140" fill="${p.accent}" opacity="0.12"/>
  <circle cx="980" cy="180" r="100" fill="${p.accent}" opacity="0.08"/>
  <rect x="80" y="520" width="320" height="4" rx="2" fill="${p.accent}" opacity="0.5"/>
  <rect x="80" y="540" width="220" height="4" rx="2" fill="white" opacity="0.15"/>
  <text x="80" y="680" fill="white" opacity="0.9" font-family="Georgia, serif" font-size="28" font-weight="600">${label}</text>
  <text x="80" y="720" fill="white" opacity="0.45" font-family="system-ui, sans-serif" font-size="16">Illustrative placeholder — replace with editorial photo</text>
</svg>`;
}

const files = {
  "hero/main.svg": ["Students collaborating", 0],
  "hero/secondary.svg": ["Mentorship moment", 1],
  "hero/mentorship.svg": ["Mentorship", 2],
  "hero/policy.svg": ["Policy dialogue", 3],
  "students/undergraduate.svg": ["University students", 0],
  "students/graduate.svg": ["Graduate researchers", 1],
  "students/young-professional.svg": ["Young professionals", 2],
  "students/civic-leader.svg": ["Youth leaders", 3],
  "students/first-generation.svg": ["First-generation students", 0],
  "students/public-service.svg": ["Public service pathways", 1],
  "programmes/mentorship.svg": ["Mentorship programme", 0],
  "programmes/policy.svg": ["Policy leadership", 1],
  "programmes/career.svg": ["Career development", 2],
  "programmes/dialogue.svg": ["Youth dialogue", 3],
  "programmes/civic.svg": ["Civic leadership", 0],
  "programmes/default.svg": ["Leadership programme", 1],
  "resources/collaboration.svg": ["Collaboration", 0],
  "resources/events.svg": ["Workshops and events", 1],
  "resources/opportunities.svg": ["Opportunities", 2],
  "resources/insights.svg": ["Learning together", 3],
  "resources/team.svg": ["Team in conversation", 0],
  "professionals/mentorship-growth.svg": ["Mentorship and growth", 1],
  "professionals/vision.svg": ["Young leaders", 2],
  "professionals/join-movement.svg": ["Join the movement", 3],
  "professionals/newsletter.svg": ["Community network", 0],
  "professionals/story.svg": ["Our story", 1],
  "professionals/approach.svg": ["Our approach", 2],
  "placeholders/team-coming-soon.svg": ["Leadership team coming soon", 3],
  "placeholders/banner.svg": ["EduLead Network", 0],
};

const base = path.join(process.cwd(), "public", "images");
for (const [rel, [label, idx]] of Object.entries(files)) {
  const full = path.join(base, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, svg(label, idx));
}
console.log(`Created ${Object.keys(files).length} SVG placeholders`);
