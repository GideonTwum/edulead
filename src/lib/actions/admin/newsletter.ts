"use server";

import prisma from "@/lib/db";
import { getAdminId } from "./shared";

export async function getNewsletterSubscribers() {
  await getAdminId();
  return prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: "desc" } });
}

export async function exportNewsletterSubscribers(): Promise<string> {
  await getAdminId();
  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { active: true },
    orderBy: { subscribedAt: "desc" },
  });

  const header = "First Name,Email,Subscribed At\n";
  const rows = subscribers
    .map(
      (s) =>
        `"${s.firstName.replace(/"/g, '""')}","${s.email.replace(/"/g, '""')}","${s.subscribedAt.toISOString()}"`,
    )
    .join("\n");

  return header + rows;
}
