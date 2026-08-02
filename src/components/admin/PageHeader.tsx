"use client";

import { Breadcrumb, Typography, Space } from "antd";
import type { ReactNode } from "react";
import Link from "next/link";

const { Title, Paragraph } = Typography;

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  extra?: ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, extra }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          className="mb-3"
          items={breadcrumbs.map((item) => ({
            title: item.href ? <Link href={item.href}>{item.title}</Link> : item.title,
          }))}
        />
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Title level={3} style={{ margin: 0, color: "#151a63" }}>
            {title}
          </Title>
          {description && (
            <Paragraph type="secondary" style={{ margin: "4px 0 0" }}>
              {description}
            </Paragraph>
          )}
        </div>
        {extra && <Space wrap>{extra}</Space>}
      </div>
    </div>
  );
}
