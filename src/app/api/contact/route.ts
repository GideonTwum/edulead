import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { contactSchema } from "@/lib/validations/forms";
import { verifyTurnstile } from "@/lib/turnstile";
import {
  sendEmail,
  contactConfirmationEmail,
  contactAdminNotification,
} from "@/lib/email";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0];

    const turnstileValid = await verifyTurnstile(data.turnstileToken, ip);
    if (!turnstileValid) {
      return NextResponse.json({ error: "Security verification failed" }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        enquiryType: data.enquiryType,
        message: data.message,
        consent: data.consent,
      },
    });

    const notifyEmail = env.adminNotificationEmail;
    const emailPromises = [
      sendEmail({
        to: data.email,
        subject: "We received your message — EduLead Network",
        html: contactConfirmationEmail(data.fullName),
      }),
    ];

    if (notifyEmail) {
      emailPromises.push(
        sendEmail({
          to: notifyEmail,
          subject: `New Contact: ${data.subject}`,
          html: contactAdminNotification({
            name: data.fullName,
            email: data.email,
            subject: data.subject,
            enquiryType: data.enquiryType,
            message: data.message,
          }),
          replyTo: data.email,
        }),
      );
    }

    await Promise.allSettled(emailPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Unable to send message" }, { status: 500 });
  }
}
