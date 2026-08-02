import { NextRequest, NextResponse } from "next/server";
import { eventRegistrationSchema } from "@/lib/validations/forms";
import { verifyTurnstile } from "@/lib/turnstile";
import {
  sendEmail,
  eventRegistrationConfirmation,
  eventRegistrationAdminNotification,
} from "@/lib/email";
import { env } from "@/lib/env";
import { formatDate } from "@/lib/utils";
import {
  createEventRegistration,
  getEventRegistrationErrorMessage,
  getEventRegistrationStatusCode,
  sendEventRegistrationEmails,
} from "@/lib/event-registration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, ...rest } = body;
    const parsed = eventRegistrationSchema.safeParse(rest);

    if (!parsed.success || !eventId || typeof eventId !== "string") {
      return NextResponse.json(
        { error: parsed.error?.errors[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0];
    if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) {
      return NextResponse.json({ error: "Security verification failed" }, { status: 400 });
    }

    const result = await createEventRegistration(eventId, parsed.data);

    if (!result.ok) {
      return NextResponse.json(
        { error: getEventRegistrationErrorMessage(result.reason) },
        { status: getEventRegistrationStatusCode(result.reason) },
      );
    }

    const eventDate = formatDate(result.event.date);
    const emailResult = await sendEventRegistrationEmails(
      {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        eventTitle: result.event.title,
        eventDate,
      },
      sendEmail,
      env.adminNotificationEmail,
      {
        confirmation: eventRegistrationConfirmation,
        adminNotification: eventRegistrationAdminNotification,
      },
    );

    return NextResponse.json({
      success: true,
      emailSent: emailResult.userEmailSent,
    });
  } catch (error) {
    console.error("Event registration error:", error);
    return NextResponse.json({ error: "Unable to process registration" }, { status: 500 });
  }
}
