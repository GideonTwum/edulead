"use client";

import { App, ConfigProvider } from "antd";
import { adminTheme } from "@/lib/admin/theme";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={adminTheme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
