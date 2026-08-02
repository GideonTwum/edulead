"use client";

import { App } from "antd";

export function useAdminMessage() {
  return App.useApp().message;
}
