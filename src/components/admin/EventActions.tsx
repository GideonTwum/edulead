"use client";

import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteEvent } from "@/lib/actions/admin/events";
import { useRouter } from "next/navigation";
import { useAdminMessage } from "@/hooks/useAdminMessage";

export function EventActions({ id }: { id: string }) {
  const message = useAdminMessage();
  const router = useRouter();
  return (
    <Popconfirm
      title="Delete this event?"
      onConfirm={async () => {
        const result = await deleteEvent(id);
        if (result.success) { message.success("Deleted"); router.refresh(); }
        else message.error(result.error);
      }}
      okButtonProps={{ danger: true }}
    >
      <Button type="link" danger icon={<DeleteOutlined />} size="small">Delete</Button>
    </Popconfirm>
  );
}
