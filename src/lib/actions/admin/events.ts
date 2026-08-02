"use server";

import prisma from "@/lib/db";
import { logAudit } from "@/lib/auth";
import { EventStatus, EventType } from "@prisma/client";
import { generateUniqueSlug } from "@/lib/slug";
import { getAdminId } from "./shared";
import { parseDate, revalidatePublicPaths, type ActionResult } from "./utils";

export async function getEvents() {
  await getAdminId();
  return prisma.event.findMany({
    where: { deletedAt: null },
    orderBy: { date: "desc" },
    include: { _count: { select: { registrations: true } } },
  });
}

export async function getEvent(id: string) {
  await getAdminId();
  return prisma.event.findFirst({
    where: { id, deletedAt: null },
    include: { registrations: { orderBy: { createdAt: "desc" } } },
  });
}

export async function createEvent(data: Record<string, unknown>): Promise<ActionResult<{ id: string }>> {
  try {
    const adminId = await getAdminId();
    const title = data.title as string;
    const slug = await generateUniqueSlug(title, "event");

    const created = await prisma.event.create({
      data: {
        title,
        slug,
        excerpt: (data.excerpt as string) || "",
        description: (data.description as string) || "",
        featuredImage: (data.featuredImage as string) || null,
        eventType: (data.eventType as EventType) || EventType.WORKSHOP,
        date: parseDate(data.date as string) || new Date(),
        endDate: parseDate(data.endDate as string),
        startTime: (data.startTime as string) || null,
        endTime: (data.endTime as string) || null,
        timezone: (data.timezone as string) || "Africa/Accra",
        venue: (data.venue as string) || null,
        onlineLink: (data.onlineLink as string) || null,
        registrationUrl: (data.registrationUrl as string) || null,
        registrationFormEnabled: Boolean(data.registrationFormEnabled),
        registrationDeadline: parseDate(data.registrationDeadline as string),
        capacity: data.capacity ? Number(data.capacity) : null,
        featured: Boolean(data.featured),
        status: (data.status as EventStatus) || EventStatus.UPCOMING,
        published: Boolean(data.published),
        seoTitle: (data.seoTitle as string) || null,
        seoDescription: (data.seoDescription as string) || null,
      },
    });

    await logAudit(adminId, "CREATE", "Event", created.id);
    await revalidatePublicPaths(["/events", `/events/${slug}`]);
    return { success: true, data: { id: created.id } };
  } catch {
    return { success: false, error: "Failed to create event" };
  }
}

export async function updateEvent(id: string, data: Record<string, unknown>): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    const title = data.title as string | undefined;
    const slug = title ? await generateUniqueSlug(title, "event", id) : undefined;

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title, slug }),
        excerpt: data.excerpt as string | undefined,
        description: data.description as string | undefined,
        featuredImage: (data.featuredImage as string) || null,
        eventType: data.eventType as EventType | undefined,
        date: data.date !== undefined ? parseDate(data.date as string) || new Date() : undefined,
        endDate: data.endDate !== undefined ? parseDate(data.endDate as string) : undefined,
        startTime: (data.startTime as string) || null,
        endTime: (data.endTime as string) || null,
        timezone: data.timezone as string | undefined,
        venue: (data.venue as string) || null,
        onlineLink: (data.onlineLink as string) || null,
        registrationUrl: (data.registrationUrl as string) || null,
        registrationFormEnabled: data.registrationFormEnabled as boolean | undefined,
        registrationDeadline:
          data.registrationDeadline !== undefined ? parseDate(data.registrationDeadline as string) : undefined,
        capacity: data.capacity !== undefined ? (data.capacity ? Number(data.capacity) : null) : undefined,
        featured: data.featured as boolean | undefined,
        status: data.status as EventStatus | undefined,
        published: data.published as boolean | undefined,
        seoTitle: (data.seoTitle as string) || null,
        seoDescription: (data.seoDescription as string) || null,
      },
    });

    await logAudit(adminId, "UPDATE", "Event", id);
    await revalidatePublicPaths(["/events", `/events/${updated.slug}`]);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update event" };
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    await prisma.event.update({ where: { id }, data: { deletedAt: new Date(), published: false } });
    await logAudit(adminId, "DELETE", "Event", id);
    await revalidatePublicPaths(["/events"]);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete event" };
  }
}

export async function updateEventRegistrationStatus(
  id: string,
  status: string,
  internalNote?: string,
): Promise<ActionResult> {
  try {
    await getAdminId();
    await prisma.eventRegistration.update({
      where: { id },
      data: { status: status as "NEW" | "REVIEWED" | "CONTACTED" | "CLOSED", internalNote: internalNote || null },
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update registration status" };
  }
}
