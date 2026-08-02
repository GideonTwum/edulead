"use client";

import { Tag } from "antd";

const STATUS_COLORS: Record<string, string> = {
  NEW: "blue",
  REVIEWED: "cyan",
  CONTACTED: "orange",
  CLOSED: "default",
  READ: "cyan",
  REPLIED: "green",
  ARCHIVED: "default",
  DRAFT: "default",
  SCHEDULED: "purple",
  PUBLISHED: "green",
  ACTIVE: "green",
  EXPIRED: "orange",
  PLANNED: "default",
  COMING_SOON: "purple",
  OPEN: "green",
  ONGOING: "blue",
  COMPLETED: "default",
  UPCOMING: "blue",
  ONGOING_EVENT: "green",
  CANCELLED: "red",
};

interface StatusTagProps {
  status: string;
  label?: string;
}

export function StatusTag({ status, label }: StatusTagProps) {
  const color = STATUS_COLORS[status] || "default";
  const display = label || status.replace(/_/g, " ");

  return (
    <Tag color={color} style={{ textTransform: "capitalize" }}>
      {display.toLowerCase()}
    </Tag>
  );
}
