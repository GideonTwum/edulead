"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusTag } from "@/components/admin/StatusTag";
import { getEvents } from "@/lib/actions/admin/events";
import { ROUTES } from "@/lib/constants";
import { Button, Space, Spin } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import Link from "next/link";
import { EventActions } from "@/components/admin/EventActions";
import { format } from "date-fns";

type EventRow = Awaited<ReturnType<typeof getEvents>>[number];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    { title: "Title", dataIndex: "title", key: "title", ellipsis: true },
    { title: "Type", dataIndex: "eventType", key: "type", render: (v: string) => v.replace(/_/g, " ") },
    { title: "Date", dataIndex: "date", key: "date", render: (v: Date) => format(new Date(v), "dd MMM yyyy") },
    { title: "Status", dataIndex: "status", key: "status", render: (v: string) => <StatusTag status={v} /> },
    { title: "Registrations", dataIndex: ["_count", "registrations"], key: "registrations" },
    {
      title: "Actions", key: "actions",
      render: (_: unknown, record: { id: string }) => (
        <Space>
          <Link href={`${ROUTES.admin.events}/${record.id}`}><Button type="link" icon={<EditOutlined />} size="small">Edit</Button></Link>
          <EventActions id={record.id} />
        </Space>
      ),
    },
  ];

  if (loading) return <Spin className="flex justify-center py-20" size="large" />;

  return (
    <div>
      <PageHeader title="Events" description="Manage workshops, webinars, and policy dialogues" extra={<Link href={`${ROUTES.admin.events}/new`}><Button type="primary" icon={<PlusOutlined />}>Add Event</Button></Link>} />
      <DataTable rowKey="id" dataSource={events} columns={columns} />
    </div>
  );
}
