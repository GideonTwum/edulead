"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusTag } from "@/components/admin/StatusTag";
import { getArticles } from "@/lib/actions/admin/articles";
import { ROUTES } from "@/lib/constants";
import { Button, Space, Spin } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import Link from "next/link";
import { ArticleActions } from "@/components/admin/ArticleActions";
import { format } from "date-fns";
import type { Article, ArticleCategory } from "@prisma/client";

type ArticleRow = Article & { category?: ArticleCategory | null };

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    { title: "Title", dataIndex: "title", key: "title", ellipsis: true },
    { title: "Category", dataIndex: ["category", "name"], key: "category", render: (v: string | undefined) => v || "—" },
    { title: "Status", dataIndex: "status", key: "status", render: (v: string) => <StatusTag status={v} /> },
    { title: "Published", dataIndex: "publishedAt", key: "publishedAt", render: (v: Date | null) => v ? format(new Date(v), "dd MMM yyyy") : "—" },
    {
      title: "Actions", key: "actions",
      render: (_: unknown, record: { id: string }) => (
        <Space>
          <Link href={`${ROUTES.admin.articles}/${record.id}`}><Button type="link" icon={<EditOutlined />} size="small">Edit</Button></Link>
          <ArticleActions id={record.id} />
        </Space>
      ),
    },
  ];

  if (loading) return <Spin className="flex justify-center py-20" size="large" />;

  return (
    <div>
      <PageHeader title="Articles" description="Manage insights, blog posts, and resources" extra={<Link href={`${ROUTES.admin.articles}/new`}><Button type="primary" icon={<PlusOutlined />}>Add Article</Button></Link>} />
      <DataTable rowKey="id" dataSource={articles} columns={columns} />
    </div>
  );
}
