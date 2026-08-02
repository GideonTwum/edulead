import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = env.hasResend ? new Resend(env.resendApiKey) : null;

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  if (!resend) {
    if (env.isDev) {
      console.log("[Email Dev Mode]", { to, subject });
      return { success: true, id: "dev-mode" };
    }
    return { success: false, error: "Email service not configured" };
  }

  try {
    const result = await resend.emails.send({
      from: env.emailFrom,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo,
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error: String(error) };
  }
}

function emailLayout(content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F7F8FA;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F8FA;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(21,26,99,0.08);">
          <tr>
            <td style="background:#151A63;padding:24px 32px;">
              <h1 style="margin:0;color:#B5D334;font-size:22px;font-weight:bold;">EduLead Network</h1>
              <p style="margin:4px 0 0;color:#FFFFFF;font-size:13px;opacity:0.8;">Education for Leadership and Change</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background:#F7F8FA;padding:20px 32px;border-top:1px solid #E4E7EC;">
              <p style="margin:0;color:#667085;font-size:12px;text-align:center;">
                © ${new Date().getFullYear()} EduLead Network. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function contactConfirmationEmail(name: string) {
  return emailLayout(`
    <h2 style="color:#151A63;margin:0 0 16px;">Thank you for contacting us</h2>
    <p style="color:#151A2D;line-height:1.6;margin:0 0 16px;">Dear ${name},</p>
    <p style="color:#151A2D;line-height:1.6;margin:0 0 16px;">
      We have received your message and a member of the EduLead Network team will respond as soon as possible.
    </p>
    <p style="color:#667085;font-size:14px;margin:0;">This is an automated confirmation. Please do not reply to this email.</p>
  `);
}

export function contactAdminNotification(data: { name: string; email: string; subject: string; enquiryType: string; message: string }) {
  return emailLayout(`
    <h2 style="color:#151A63;margin:0 0 16px;">New Contact Message</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#667085;font-size:14px;">Name</td><td style="padding:8px 0;color:#151A2D;font-weight:600;">${data.name}</td></tr>
      <tr><td style="padding:8px 0;color:#667085;font-size:14px;">Email</td><td style="padding:8px 0;color:#151A2D;">${data.email}</td></tr>
      <tr><td style="padding:8px 0;color:#667085;font-size:14px;">Type</td><td style="padding:8px 0;color:#151A2D;">${data.enquiryType}</td></tr>
      <tr><td style="padding:8px 0;color:#667085;font-size:14px;">Subject</td><td style="padding:8px 0;color:#151A2D;">${data.subject}</td></tr>
    </table>
    <div style="margin-top:16px;padding:16px;background:#F7F8FA;border-radius:8px;">
      <p style="color:#151A2D;line-height:1.6;margin:0;white-space:pre-wrap;">${data.message}</p>
    </div>
  `);
}

export function joinConfirmationEmail(name: string, type: string) {
  return emailLayout(`
    <h2 style="color:#151A63;margin:0 0 16px;">Thank you for joining the movement</h2>
    <p style="color:#151A2D;line-height:1.6;margin:0 0 16px;">Dear ${name},</p>
    <p style="color:#151A2D;line-height:1.6;margin:0 0 16px;">
      Thank you for expressing your interest in EduLead Network as a <strong>${type}</strong>.
      Our team will review your submission and be in touch.
    </p>
  `);
}

export function joinAdminNotification(type: string, name: string, email: string, summary: string) {
  return emailLayout(`
    <h2 style="color:#151A63;margin:0 0 16px;">New Join Submission: ${type}</h2>
    <p style="color:#151A2D;"><strong>${name}</strong> (${email})</p>
    <div style="margin-top:16px;padding:16px;background:#F7F8FA;border-radius:8px;">
      <p style="color:#151A2D;line-height:1.6;margin:0;white-space:pre-wrap;">${summary}</p>
    </div>
  `);
}

export function programmeInterestConfirmation(name: string, programme: string) {
  return emailLayout(`
    <h2 style="color:#151A63;margin:0 0 16px;">Programme Interest Received</h2>
    <p style="color:#151A2D;line-height:1.6;margin:0 0 16px;">Dear ${name},</p>
    <p style="color:#151A2D;line-height:1.6;margin:0;">
      Thank you for expressing interest in <strong>${programme}</strong>.
      We will be in touch with more information.
    </p>
  `);
}

export function eventRegistrationConfirmation(name: string, eventTitle: string, eventDate: string) {
  return emailLayout(`
    <h2 style="color:#151A63;margin:0 0 16px;">Event Registration Confirmed</h2>
    <p style="color:#151A2D;line-height:1.6;margin:0 0 16px;">Dear ${name},</p>
    <p style="color:#151A2D;line-height:1.6;margin:0 0 8px;">You are registered for:</p>
    <p style="color:#151A63;font-weight:600;margin:0 0 4px;">${eventTitle}</p>
    <p style="color:#667085;margin:0;">${eventDate}</p>
  `);
}

export function eventRegistrationAdminNotification(eventTitle: string, name: string, email: string) {
  return emailLayout(`
    <h2 style="color:#151A63;margin:0 0 16px;">New Event Registration</h2>
    <p style="color:#151A2D;"><strong>${name}</strong> (${email}) registered for <strong>${eventTitle}</strong>.</p>
  `);
}

export function newsletterConfirmationEmail(name: string) {
  return emailLayout(`
    <h2 style="color:#151A63;margin:0 0 16px;">Welcome to EduLead Network</h2>
    <p style="color:#151A2D;line-height:1.6;margin:0 0 16px;">Dear ${name},</p>
    <p style="color:#151A2D;line-height:1.6;margin:0;">
      Thank you for subscribing to our newsletter. You will receive updates on programmes, events, opportunities, and insights.
    </p>
  `);
}
