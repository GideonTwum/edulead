"use client";

import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteProgramme } from "@/lib/actions/admin/programmes";
import { useRouter } from "next/navigation";
import { useAdminMessage } from "@/hooks/useAdminMessage";

export function ProgrammeActions({ id }: { id: string }) {
  const message = useAdminMessage();
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteProgramme(id);
    if (result.success) {
      message.success("Programme deleted");
      router.refresh();
    } else {
      message.error(result.error);
    }
  };

  return (
    <Popconfirm title="Delete this programme?" onConfirm={handleDelete} okText="Delete" okButtonProps={{ danger: true }}>
      <Button type="link" danger icon={<DeleteOutlined />} size="small">Delete</Button>
    </Popconfirm>
  );
}
