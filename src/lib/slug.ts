import slugify from "slugify";
import prisma from "@/lib/db";

export function createSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, trim: true });
}

export async function generateUniqueSlug(
  text: string,
  model: "programme" | "opportunity" | "event" | "article",
  excludeId?: string,
): Promise<string> {
  const base = createSlug(text);
  let slug = base;
  let counter = 1;

  while (true) {
    let existing = null;
    switch (model) {
      case "programme":
        existing = await prisma.programme.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) } });
        break;
      case "opportunity":
        existing = await prisma.opportunity.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) } });
        break;
      case "event":
        existing = await prisma.event.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) } });
        break;
      case "article":
        existing = await prisma.article.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) } });
        break;
    }
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
}
