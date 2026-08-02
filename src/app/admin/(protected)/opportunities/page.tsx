"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusTag } from "@/components/admin/StatusTag";
import { getOpportunities } from "@/lib/actions/admin/opportunities";
import { ROUTES } from "@/lib/constants";
import { Button, Space, Spin } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import Link from "next/link";
import { OpportunityActions } from "@/components/admin/OpportunityActions";
import type { Opportunity } from "@prisma/client";

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOpportunities().then((data) => {
      setOpportunities(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    { title: "Title", dataIndex: "title", key: "title", ellipsis: true },
    { title: "Organisation", dataIndex: "organisation", key: "organisation", ellipsis: true },
    { title: "Type", dataIndex: "opportunityType", key: "type", render: (v: string) => v.replace(/_/g, " ") },
    { title: "Status", dataIndex: "status", key: "status", render: (v: string) => <StatusTag status={v} /> },
    {
      title: "Actions", key: "actions",
      render: (_: unknown, record: { id: string }) => (
        <Space>
          <Link href={`${ROUTES.admin.opportunities}/${record.id}`}><Button type="link" icon={<EditOutlined />} size="small">Edit</Button></Link>
          <OpportunityActions id={record.id} />
        </Space>
      ),
    },
  ];

  if (loading) return <Spin className="flex justify-center py-20" size="large" />;

  return (
    <div>
      <PageHeader title="Opportunities" description="Manage scholarships, fellowships, and career opportunities" extra={<Link href={`${ROUTES.admin.opportunities}/new`}><Button type="primary" icon={<PlusOutlined />}>Add Opportunity</Button></Link>} />
      <DataTable rowKey="id" dataSource={opportunities} columns={columns} />
    </div>
  );
}
