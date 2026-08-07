import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { redirectIfAuthenticatedAdmin } from "@/lib/auth";
import { sanitizeAdminRedirect } from "@/lib/auth/admin-access";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

interface AdminLoginPageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  await redirectIfAuthenticatedAdmin(params.redirect);

  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-off-white" />}>
      <LoginForm initialError={params.error ?? null} redirectTo={sanitizeAdminRedirect(params.redirect)} />
    </Suspense>
  );
}
