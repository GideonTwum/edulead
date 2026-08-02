"use client";

import { Layout, Grid } from "antd";
import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

const { Content } = Layout;

interface AdminShellProps {
  children: React.ReactNode;
  adminName?: string | null;
  adminEmail?: string;
}

export function AdminShell({ children, adminName, adminEmail }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;
  const siderWidth = collapsed ? 80 : 240;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Layout style={{ marginLeft: isMobile ? 0 : siderWidth, transition: "margin-left 0.2s" }}>
        <AdminHeader
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onMobileMenu={() => setMobileOpen(true)}
          adminName={adminName}
          adminEmail={adminEmail}
        />
        <Content style={{ padding: isMobile ? 16 : 24, background: "#f7f8fa" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
