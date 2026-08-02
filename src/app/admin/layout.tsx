import { headers } from "next/headers";
import { AdminProviders } from "@/components/admin/AdminProviders";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLoginPage = pathname === ROUTES.admin.login;

  return (
    <AdminProviders>
      {isLoginPage ? <div className="min-h-screen bg-brand-off-white">{children}</div> : children}
    </AdminProviders>
  );
}
