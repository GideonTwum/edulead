"use client";

import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteArticle } from "@/lib/actions/admin/articles";
import { useRouter } from "next/navigation";
import { useAdminMessage } from "@/hooks/useAdminMessage";

export function ArticleActions({ id }: { id: string }) {
  const message = useAdminMessage();
  const router = useRouter();
  return (
    <Popconfirm
      title="Delete this article?"
      onConfirm={async () => {
        const result = await deleteArticle(id);
        if (result.success) { message.success("Deleted"); router.refresh(); }
        else message.error(result.error);
      }}
      okButtonProps={{ danger: true }}
    >
      <Button type="link" danger icon={<DeleteOutlined />} size="small">Delete</Button>
    </Popconfirm>
  );
}
