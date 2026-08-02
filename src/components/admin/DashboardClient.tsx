"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ROUTES } from "@/lib/constants";
import {
  ReadOutlined,
  CalendarOutlined,
  BulbOutlined,
  FormOutlined,
  TeamOutlined,
  MailOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Card, Row, Col, List, Typography } from "antd";
import Link from "next/link";

const { Text } = Typography;

interface DashboardClientProps {
  stats: {
    programmes: number;
    events: number;
    opportunities: number;
    articles: number;
    joinSubmissions: number;
    messages: number;
    subscribers: number;
  };
}

export function DashboardClient({ stats }: DashboardClientProps) {
  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your EduLead Network content and activity" />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><StatCard title="Published Programmes" value={stats.programmes} icon={<ReadOutlined />} /></Col>
        <Col xs={24} sm={12} lg={6}><StatCard title="Upcoming Events" value={stats.events} icon={<CalendarOutlined />} color="#b5d334" /></Col>
        <Col xs={24} sm={12} lg={6}><StatCard title="Active Opportunities" value={stats.opportunities} icon={<BulbOutlined />} /></Col>
        <Col xs={24} sm={12} lg={6}><StatCard title="Published Articles" value={stats.articles} icon={<FormOutlined />} color="#667085" /></Col>
        <Col xs={24} sm={12} lg={8}><StatCard title="New Join Submissions" value={stats.joinSubmissions} icon={<TeamOutlined />} color="#fa8c16" /></Col>
        <Col xs={24} sm={12} lg={8}><StatCard title="Unread Messages" value={stats.messages} icon={<MailOutlined />} color="#fa541c" /></Col>
        <Col xs={24} sm={12} lg={8}><StatCard title="Newsletter Subscribers" value={stats.subscribers} icon={<NotificationOutlined />} /></Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <Card title="Quick Actions" variant="borderless">
            <List
              dataSource={[
                { label: "Manage Programmes", href: ROUTES.admin.programmes },
                { label: "Review Join Submissions", href: ROUTES.admin.submissions },
                { label: "View Contact Messages", href: ROUTES.admin.messages },
                { label: "Edit Site Settings", href: ROUTES.admin.settings },
              ]}
              renderItem={(item) => (
                <List.Item><Link href={item.href}><Text style={{ color: "#151a63" }}>{item.label}</Text></Link></List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Needs Attention" variant="borderless">
            <List
              dataSource={[
                stats.joinSubmissions > 0 && `${stats.joinSubmissions} new join submission(s) to review`,
                stats.messages > 0 && `${stats.messages} unread contact message(s)`,
              ].filter(Boolean) as string[]}
              locale={{ emptyText: "All caught up!" }}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
