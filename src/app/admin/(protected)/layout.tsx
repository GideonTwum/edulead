import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <AdminShell adminName={admin.profile.fullName} adminEmail={admin.user.email ?? admin.profile.email}>
      {children}
    </AdminShell>
  );
}
