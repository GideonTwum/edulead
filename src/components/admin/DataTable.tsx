"use client";

import { Table } from "antd";
import type { TableProps } from "antd";

interface DataTableProps<T extends object> extends TableProps<T> {
  emptyText?: string;
}

export function DataTable<T extends object>({
  emptyText = "No data found",
  scroll = { x: "max-content" },
  pagination = { pageSize: 10, showSizeChanger: true, showTotal: (total) => `${total} items` },
  ...props
}: DataTableProps<T>) {
  return (
    <Table<T>
      scroll={scroll}
      pagination={pagination}
      locale={{ emptyText }}
      size="middle"
      {...props}
    />
  );
}
