import { revalidatePath } from "next/cache";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function parseStringArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function revalidatePublicPaths(paths: string[] = ["/"]) {
  paths.forEach((path) => revalidatePath(path));
}
