import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { programmeInterestSchema } from "@/lib/validations/forms";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendEmail, programmeInterestConfirmation } from "@/lib/email";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { programmeId, ...formData } = body;

    if (!programmeId || typeof programmeId !== "string") {
      return NextResponse.json({ error: "Programme not specified" }, { status: 400 });
    }

    const parsed = programmeInterestSchema.safeParse(formData);
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

    const programme = await prisma.programme.findFirst({
      where: { id: programmeId, published: true, deletedAt: null, interestFormEnabled: true },
    });

    if (!programme) {
      return NextResponse.json({ error: "Programme not found or interest form unavailable" }, { status: 404 });
    }

    await prisma.programmeInterest.create({
      data: {
        programmeId: programme.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        country: data.country,
        institution: data.institution || null,
        motivation: data.motivation,
        consent: data.consent,
      },
    });

    await Promise.allSettled([
      sendEmail({
        to: data.email,
        subject: `Interest received — ${programme.title}`,
        html: programmeInterestConfirmation(data.fullName, programme.title),
      }),
      env.adminNotificationEmail
        ? sendEmail({
            to: env.adminNotificationEmail,
            subject: `Programme Interest: ${programme.title}`,
            html: `<p><strong>${data.fullName}</strong> (${data.email}) expressed interest in ${programme.title}.</p>`,
            replyTo: data.email,
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Programme interest error:", error);
    return NextResponse.json({ error: "Unable to process submission" }, { status: 500 });
  }
}
