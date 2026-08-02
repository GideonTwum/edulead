import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal("")),
  DATABASE_URL: z.string().optional().or(z.literal("")),
  DIRECT_URL: z.string().optional().or(z.literal("")),
  RESEND_API_KEY: z.string().optional().or(z.literal("")),
  EMAIL_FROM: z.string().optional().or(z.literal("")),
  ADMIN_NOTIFICATION_EMAIL: z.string().email().optional().or(z.literal("")),
  JOIN_SUBMISSION_NOTIFICATION_EMAIL: z.string().email().optional().or(z.literal("")),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional().or(z.literal("")),
  TURNSTILE_SECRET_KEY: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional().or(z.literal("")),
});

function getEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL,
    JOIN_SUBMISSION_NOTIFICATION_EMAIL: process.env.JOIN_SUBMISSION_NOTIFICATION_EMAIL,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  });

  if (!parsed.success) {
    console.error("Environment validation failed:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  return {
    ...parsed.data,
    siteUrl: parsed.data.NEXT_PUBLIC_SITE_URL,
    supabaseUrl: parsed.data.NEXT_PUBLIC_SUPABASE_URL || "",
    supabaseAnonKey: parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    supabaseServiceKey: parsed.data.SUPABASE_SERVICE_ROLE_KEY || "",
    databaseUrl: parsed.data.DATABASE_URL || "",
    directUrl: parsed.data.DIRECT_URL || "",
    resendApiKey: parsed.data.RESEND_API_KEY || "",
    emailFrom: parsed.data.EMAIL_FROM || "EduLead Network <noreply@eduleadnetwork.org>",
    adminNotificationEmail: parsed.data.ADMIN_NOTIFICATION_EMAIL || "",
    joinNotifyEmail:
      parsed.data.JOIN_SUBMISSION_NOTIFICATION_EMAIL || parsed.data.ADMIN_NOTIFICATION_EMAIL || "",
    turnstileSiteKey: parsed.data.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
    turnstileSecretKey: parsed.data.TURNSTILE_SECRET_KEY || "",
    gaMeasurementId: parsed.data.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    isDev: process.env.NODE_ENV === "development",
    hasDatabase: Boolean(parsed.data.DATABASE_URL),
    hasSupabase: Boolean(parsed.data.NEXT_PUBLIC_SUPABASE_URL && parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasResend: Boolean(parsed.data.RESEND_API_KEY),
    hasTurnstile: Boolean(parsed.data.TURNSTILE_SECRET_KEY && parsed.data.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
  };
}

export const env = getEnv();
