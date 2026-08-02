"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusTag } from "@/components/admin/StatusTag";
import { getProgrammes } from "@/lib/actions/admin/programmes";
import { ROUTES } from "@/lib/constants";
import { Button, Space, Spin } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import Link from "next/link";
import { ProgrammeActions } from "@/components/admin/ProgrammeActions";
import type { Programme } from "@prisma/client";

export default function AdminProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProgrammes().then((data) => {
      setProgrammes(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    { title: "Title", dataIndex: "title", key: "title", ellipsis: true },
    { title: "Category", dataIndex: "category", key: "category", render: (v: string) => v.replace(/_/g, " ") },
    { title: "Status", dataIndex: "status", key: "status", render: (v: string) => <StatusTag status={v} /> },
    { title: "Published", dataIndex: "published", key: "published", render: (v: boolean) => <StatusTag status={v ? "PUBLISHED" : "DRAFT"} label={v ? "Yes" : "No"} /> },
    {
      title: "Actions", key: "actions",
      render: (_: unknown, record: { id: string }) => (
        <Space>
          <Link href={`${ROUTES.admin.programmes}/${record.id}`}><Button type="link" icon={<EditOutlined />} size="small">Edit</Button></Link>
          <ProgrammeActions id={record.id} />
        </Space>
      ),
    },
  ];

  if (loading) return <Spin className="flex justify-center py-20" size="large" />;

  return (
    <div>
      <PageHeader title="Programmes" description="Manage leadership programmes and training initiatives" extra={<Link href={`${ROUTES.admin.programmes}/new`}><Button type="primary" icon={<PlusOutlined />}>Add Programme</Button></Link>} />
      <DataTable rowKey="id" dataSource={programmes} columns={columns} />
    </div>
  );
}
