import { NextRequest, NextResponse } from "next/server";
import { JoinType } from "@prisma/client";
import prisma from "@/lib/db";
import {
  youngPersonSchema,
  mentorSchema,
  volunteerSchema,
  partnerSchema,
  supporterSchema,
} from "@/lib/validations/forms";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendEmail, joinConfirmationEmail, joinAdminNotification } from "@/lib/email";
import { env } from "@/lib/env";

const schemaMap = {
  "young-person": { schema: youngPersonSchema, type: JoinType.YOUNG_PERSON, label: "Young Person" },
  mentor: { schema: mentorSchema, type: JoinType.MENTOR, label: "Mentor" },
  volunteer: { schema: volunteerSchema, type: JoinType.VOLUNTEER, label: "Volunteer" },
  partner: { schema: partnerSchema, type: JoinType.PARTNER, label: "Partner" },
  supporter: { schema: supporterSchema, type: JoinType.SUPPORTER, label: "Supporter" },
} as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const joinType = body.joinType as keyof typeof schemaMap;

    const config = schemaMap[joinType];
    if (!config) {
      return NextResponse.json({ error: "Invalid submission type" }, { status: 400 });
    }

    const parsed = config.schema.safeParse(body);
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

    const { turnstileToken: _, consent: __, ...formData } = data;
    const name =
      "fullName" in data ? data.fullName :
      "contactPerson" in data ? data.contactPerson : "Unknown";

    await prisma.joinSubmission.create({
      data: {
        joinType: config.type,
        fullName: name,
        email: data.email,
        phone: "phone" in data ? data.phone : null,
        country: "country" in data ? data.country : null,
        formData: formData as object,
      },
    });

    const joinNotify = env.joinNotifyEmail;

    await Promise.allSettled([
      sendEmail({
        to: data.email,
        subject: "Thank you for joining the EduLead movement",
        html: joinConfirmationEmail(name, config.label),
      }),
      joinNotify
        ? sendEmail({
            to: joinNotify,
            subject: `New ${config.label} Submission`,
            html: joinAdminNotification(config.label, name, data.email, JSON.stringify(formData, null, 2)),
            replyTo: data.email,
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Join form error:", error);
    return NextResponse.json({ error: "Unable to process submission" }, { status: 500 });
  }
}
