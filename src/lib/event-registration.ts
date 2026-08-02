import { EventStatus, type Event, type EventRegistration } from "@prisma/client";
import prisma from "@/lib/db";
import type { EventRegistrationInput } from "@/lib/validations/forms";

export const EVENT_REGISTRATION_ERRORS = {
  not_found: "Event could not be found.",
  not_open: "Registration is not open.",
  closed: "Registration has closed.",
  full: "This event is full.",
  duplicate: "You are already registered.",
} as const;

export type EventRegistrationRejectionReason = keyof typeof EVENT_REGISTRATION_ERRORS;

const OPEN_STATUSES: EventStatus[] = [EventStatus.UPCOMING, EventStatus.ONGOING];

export type EventRegistrationEligibilityInput = Pick<
  Event,
  | "published"
  | "deletedAt"
  | "registrationFormEnabled"
  | "status"
  | "registrationDeadline"
  | "date"
  | "endDate"
  | "capacity"
>;

export function validateEventRegistrationEligibility(
  event: EventRegistrationEligibilityInput | null | undefined,
  options: {
    now?: Date;
    registrationCount: number;
    hasExistingRegistration: boolean;
  },
): { ok: true } | { ok: false; reason: EventRegistrationRejectionReason } {
  const now = options.now ?? new Date();

  if (!event || event.deletedAt) {
    return { ok: false, reason: "not_found" };
  }

  if (!event.published || !event.registrationFormEnabled) {
    return { ok: false, reason: "not_open" };
  }

  if (!OPEN_STATUSES.includes(event.status)) {
    return { ok: false, reason: "not_open" };
  }

  if (event.registrationDeadline && now > event.registrationDeadline) {
    return { ok: false, reason: "closed" };
  }

  if (event.status === EventStatus.UPCOMING && now > event.date) {
    return { ok: false, reason: "closed" };
  }

  if (event.status === EventStatus.ONGOING) {
    const eventEnd = event.endDate ?? event.date;
    if (now > eventEnd) {
      return { ok: false, reason: "closed" };
    }
  }

  if (options.hasExistingRegistration) {
    return { ok: false, reason: "duplicate" };
  }

  if (event.capacity !== null && options.registrationCount >= event.capacity) {
    return { ok: false, reason: "full" };
  }

  return { ok: true };
}

export function getEventRegistrationErrorMessage(reason: EventRegistrationRejectionReason): string {
  return EVENT_REGISTRATION_ERRORS[reason];
}

export function getEventRegistrationStatusCode(
  reason: EventRegistrationRejectionReason,
): number {
  return reason === "not_found" ? 404 : reason === "duplicate" ? 409 : 400;
}

export type EventRegistrationCreateData = Pick<
  EventRegistrationInput,
  "fullName" | "email" | "phone" | "institution" | "country" | "reason" | "consent"
>;

export async function createEventRegistration(
  eventId: string,
  data: EventRegistrationCreateData,
  now: Date = new Date(),
): Promise<
  | { ok: true; event: Event; registration: EventRegistration }
  | { ok: false; reason: EventRegistrationRejectionReason }
> {
  const normalizedEmail = data.email.trim().toLowerCase();

  return prisma.$transaction(async (tx) => {
    const event = await tx.event.findFirst({
      where: { id: eventId, deletedAt: null },
    });

    const existingRegistration = await tx.eventRegistration.findFirst({
      where: {
        eventId,
        email: { equals: normalizedEmail, mode: "insensitive" },
      },
    });

    const registrationCount = await tx.eventRegistration.count({
      where: { eventId },
    });

    const eligibility = validateEventRegistrationEligibility(event, {
      now,
      registrationCount,
      hasExistingRegistration: Boolean(existingRegistration),
    });

    if (!eligibility.ok) {
      return eligibility;
    }

    const registration = await tx.eventRegistration.create({
      data: {
        eventId,
        fullName: data.fullName.trim(),
        email: normalizedEmail,
        phone: data.phone?.trim() || null,
        institution: data.institution?.trim() || null,
        country: data.country.trim(),
        reason: data.reason.trim(),
        consent: data.consent,
      },
    });

    return { ok: true, event: event!, registration };
  });
}

export type EventRegistrationEmailPayload = {
  fullName: string;
  email: string;
  eventTitle: string;
  eventDate: string;
};

export async function sendEventRegistrationEmails(
  payload: EventRegistrationEmailPayload,
  sendEmailFn: typeof import("@/lib/email").sendEmail,
  adminNotificationEmail: string,
  templates: {
    confirmation: (name: string, title: string, date: string) => string;
    adminNotification: (title: string, name: string, email: string) => string;
  },
): Promise<{ userEmailSent: boolean; adminEmailSent: boolean }> {
  const [userResult, adminResult] = await Promise.allSettled([
    sendEmailFn({
      to: payload.email,
      subject: `Registration confirmed — ${payload.eventTitle}`,
      html: templates.confirmation(payload.fullName, payload.eventTitle, payload.eventDate),
    }),
    adminNotificationEmail
      ? sendEmailFn({
          to: adminNotificationEmail,
          subject: `New registration: ${payload.eventTitle}`,
          html: templates.adminNotification(
            payload.eventTitle,
            payload.fullName,
            payload.email,
          ),
        })
      : Promise.resolve({ success: true }),
  ]);

  return {
    userEmailSent:
      userResult.status === "fulfilled" && userResult.value.success === true,
    adminEmailSent:
      adminResult.status === "fulfilled" && adminResult.value.success === true,
  };
}
