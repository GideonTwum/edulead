import { DashboardClient } from "@/components/admin/DashboardClient";
import { getDashboardStats } from "@/lib/data/content";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  return <DashboardClient stats={stats} />;
}
