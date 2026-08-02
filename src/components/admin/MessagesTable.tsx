"use client";

import { useState } from "react";
import { Select, Drawer, Descriptions } from "antd";
import { updateContactMessageStatus } from "@/lib/actions/admin/messages";
import { useRouter } from "next/navigation";
import type { ContactMessage } from "@prisma/client";
import { StatusTag } from "@/components/admin/StatusTag";
import { format } from "date-fns";
import { useAdminMessage } from "@/hooks/useAdminMessage";

const STATUSES = ["NEW", "READ", "REPLIED", "ARCHIVED"];

interface MessagesTableProps {
  messages: ContactMessage[];
}

export function MessagesTable({ messages }: MessagesTableProps) {
  const message = useAdminMessage();
  const router = useRouter();
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setLoading(id);
    const result = await updateContactMessageStatus(id, status);
    setLoading(null);
    if (result.success) {
      message.success("Status updated");
      router.refresh();
      if (selected?.id === id) setSelected({ ...selected, status: status as ContactMessage["status"] });
    } else {
      message.error(result.error);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse bg-white text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-brand-off-white text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr
                key={m.id}
                className="cursor-pointer border-b border-brand-border hover:bg-brand-off-white"
                onClick={() => { setSelected(m); if (m.status === "NEW") updateStatus(m.id, "READ"); }}
              >
                <td className="p-3">{m.fullName}</td>
                <td className="p-3">{m.subject}</td>
                <td className="p-3">{m.enquiryType}</td>
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                  <Select
                    size="small"
                    value={m.status}
                    loading={loading === m.id}
                    style={{ width: 120 }}
                    options={STATUSES.map((st) => ({ value: st, label: st.toLowerCase() }))}
                    onChange={(status) => updateStatus(m.id, status)}
                  />
                </td>
                <td className="p-3">{format(new Date(m.createdAt), "dd MMM yyyy")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Drawer title={selected?.subject} open={Boolean(selected)} onClose={() => setSelected(null)} width={480}>
        {selected && (
          <Descriptions column={1} size="small">
            <Descriptions.Item label="From">{selected.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{selected.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selected.phone || "—"}</Descriptions.Item>
            <Descriptions.Item label="Enquiry Type">{selected.enquiryType}</Descriptions.Item>
            <Descriptions.Item label="Status"><StatusTag status={selected.status} /></Descriptions.Item>
            <Descriptions.Item label="Message">{selected.message}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </>
  );
}
