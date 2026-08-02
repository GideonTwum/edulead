import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined, options?: Intl.DateTimeFormatOptions) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}

export function formatDateTime(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isDeadlinePassed(deadline: Date | string | null | undefined) {
  if (!deadline) return false;
  const d = typeof deadline === "string" ? new Date(deadline) : deadline;
  return d < new Date();
}

export function calculateReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}

export function generateCsv(rows: Record<string, unknown>[], headers?: string[]): string {
  if (rows.length === 0) return "";
  const cols = headers ?? Object.keys(rows[0]);
  const escape = (val: unknown) => {
    const str = String(val ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const lines = [cols.join(",")];
  for (const row of rows) {
    lines.push(cols.map((col) => escape(row[col])).join(","));
  }
  return lines.join("\n");
}

export function getDeadlineStatus(deadline: Date | string | null | undefined): "active" | "expired" | "none" {
  if (!deadline) return "none";
  return isDeadlinePassed(deadline) ? "expired" : "active";
}
