"use client";

import { Card, Statistic } from "antd";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  color?: string;
}

export function StatCard({ title, value, icon, color = "#151a63" }: StatCardProps) {
  return (
    <Card
      variant="borderless"
      style={{ boxShadow: "0 2px 8px rgba(21,26,99,0.06)" }}
      styles={{ body: { padding: "20px 24px" } }}
    >
      <div className="flex items-start justify-between">
        <Statistic
          title={<span className="text-brand-grey text-sm">{title}</span>}
          value={value}
          valueStyle={{ color, fontWeight: 600, fontSize: 28 }}
        />
        {icon && (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
            style={{ background: "rgba(21,26,99,0.08)", color }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
