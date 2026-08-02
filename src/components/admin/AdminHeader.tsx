"use client";

import { Layout, Button, Dropdown, Avatar, Space, Grid } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { logoutAction } from "@/lib/actions/admin/auth";

const { Header } = Layout;

interface AdminHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileMenu: () => void;
  adminName?: string | null;
  adminEmail?: string;
}

export function AdminHeader({ collapsed, onToggle, onMobileMenu, adminName, adminEmail }: AdminHeaderProps) {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;

  const menuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      danger: true,
      onClick: () => logoutAction(),
    },
  ];

  return (
    <Header
      style={{
        padding: "0 16px",
        background: "#fff",
        borderBottom: "1px solid #e4e7ec",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 99,
        height: 64,
      }}
    >
      <Button
        type="text"
        icon={isMobile ? <MenuUnfoldOutlined /> : collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={isMobile ? onMobileMenu : onToggle}
        aria-label="Toggle sidebar"
      />

      <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
        <Space className="cursor-pointer">
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ backgroundColor: "#151a63" }}
          />
          {!isMobile && (
            <span className="text-sm text-brand-text">
              {adminName || adminEmail || "Admin"}
            </span>
          )}
        </Space>
      </Dropdown>
    </Header>
  );
}
