"use client";

import { Layout, Menu, Drawer, Grid } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  ReadOutlined,
  CalendarOutlined,
  BulbOutlined,
  TeamOutlined,
  FormOutlined,
  MailOutlined,
  NotificationOutlined,
  PictureOutlined,
  SettingOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";

const { Sider } = Layout;

const navItems = [
  { key: ROUTES.admin.dashboard, icon: <DashboardOutlined />, label: "Dashboard" },
  { key: ROUTES.admin.pages, icon: <FileTextOutlined />, label: "Pages" },
  { key: ROUTES.admin.programmes, icon: <ReadOutlined />, label: "Programmes" },
  { key: ROUTES.admin.opportunities, icon: <BulbOutlined />, label: "Opportunities" },
  { key: ROUTES.admin.events, icon: <CalendarOutlined />, label: "Events" },
  { key: ROUTES.admin.articles, icon: <FormOutlined />, label: "Articles" },
  { key: ROUTES.admin.team, icon: <TeamOutlined />, label: "Team" },
  { key: ROUTES.admin.submissions, icon: <FormOutlined />, label: "Join Submissions" },
  { key: ROUTES.admin.messages, icon: <MailOutlined />, label: "Messages" },
  { key: ROUTES.admin.newsletter, icon: <NotificationOutlined />, label: "Newsletter" },
  { key: ROUTES.admin.media, icon: <PictureOutlined />, label: "Media" },
  { key: ROUTES.admin.settings, icon: <SettingOutlined />, label: "Settings" },
];

function SidebarContent({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  const selectedKey =
    navItems.find((item) => pathname === item.key || pathname.startsWith(`${item.key}/`))?.key ||
    ROUTES.admin.dashboard;

  return (
    <div className="flex h-full flex-col">
      <div
        className="flex shrink-0 items-center gap-3 px-4 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold"
          style={{ background: "#b5d334", color: "#151a63" }}
        >
          EL
        </div>
        {!collapsed && (
          <div>
            <p className="m-0 text-sm font-semibold text-white">EduLead</p>
            <p className="m-0 text-xs text-white/60">Admin Panel</p>
          </div>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={navItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: (
              <Link href={item.key} onClick={onNavigate}>
                {item.label}
              </Link>
            ),
          }))}
          style={{ border: "none", marginTop: 8 }}
        />
      </div>
      <div
        className="shrink-0 px-4 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)", background: "#151a63" }}
      >
        <Link
          href={ROUTES.home}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm !text-white transition-colors hover:!text-white hover:bg-[rgba(181,211,52,0.15)]"
          style={{ color: "#ffffff" }}
          onClick={onNavigate}
        >
          <GlobalOutlined style={{ color: "#ffffff" }} />
          {!collapsed && <span style={{ color: "#ffffff" }}>View Site</span>}
        </Link>
      </div>
    </div>
  );
}

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ collapsed, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={onMobileClose}
        width={260}
        styles={{ body: { padding: 0, background: "#151a63", height: "100%" } }}
        closable={false}
      >
        <SidebarContent onNavigate={onMobileClose} />
      </Drawer>
    );
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={240}
      style={{
        overflow: "hidden",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <SidebarContent collapsed={collapsed} />
    </Sider>
  );
}
