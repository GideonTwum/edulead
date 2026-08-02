import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { newsletterSchema } from "@/lib/validations/forms";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendEmail, newsletterConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const { firstName, email, turnstileToken } = parsed.data;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0];

    const turnstileValid = await verifyTurnstile(turnstileToken, ip);
    if (!turnstileValid) {
      return NextResponse.json({ error: "Security verification failed" }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

    if (existing?.active) {
      return NextResponse.json({ error: "This email is already subscribed" }, { status: 409 });
    }

    if (existing && !existing.active) {
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { active: true, firstName, consent: true, unsubscribedAt: null },
      });
    } else {
      await prisma.newsletterSubscriber.create({
        data: { firstName, email, consent: true },
      });
    }

    const emailResult = await sendEmail({
      to: email,
      subject: "Welcome to EduLead Network Newsletter",
      html: newsletterConfirmationEmail(firstName),
    });

    return NextResponse.json({
      success: true,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Unable to process subscription" }, { status: 500 });
  }
}
