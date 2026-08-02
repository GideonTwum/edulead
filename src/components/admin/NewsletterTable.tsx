"use client";

import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { exportNewsletterSubscribers } from "@/lib/actions/admin/newsletter";
import { DataTable } from "@/components/admin/DataTable";
import { StatusTag } from "@/components/admin/StatusTag";
import type { NewsletterSubscriber } from "@prisma/client";
import { format } from "date-fns";
import { useAdminMessage } from "@/hooks/useAdminMessage";

interface NewsletterTableProps {
  subscribers: NewsletterSubscriber[];
}

export function NewsletterTable({ subscribers }: NewsletterTableProps) {
  const message = useAdminMessage();
  const handleExport = async () => {
    try {
      const csv = await exportNewsletterSubscribers();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      message.success("Export downloaded");
    } catch {
      message.error("Export failed");
    }
  };

  const columns = [
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Status", dataIndex: "active", key: "active", render: (v: boolean) => <StatusTag status={v ? "ACTIVE" : "ARCHIVED"} label={v ? "Active" : "Unsubscribed"} /> },
    { title: "Subscribed", dataIndex: "subscribedAt", key: "subscribedAt", render: (v: Date) => format(new Date(v), "dd MMM yyyy") },
  ];

  return (
    <>
      <div className="mb-4">
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
          Export Active Subscribers (CSV)
        </Button>
      </div>
      <DataTable rowKey="id" dataSource={subscribers} columns={columns} />
    </>
  );
}
