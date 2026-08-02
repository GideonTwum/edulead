"use client";

import { useState } from "react";
import { Select, Drawer, Descriptions, Typography } from "antd";
import { updateJoinSubmissionStatus } from "@/lib/actions/admin/submissions";
import { useRouter } from "next/navigation";
import type { JoinSubmission } from "@prisma/client";
import { StatusTag } from "@/components/admin/StatusTag";
import { format } from "date-fns";
import { useAdminMessage } from "@/hooks/useAdminMessage";

const STATUSES = ["NEW", "REVIEWED", "CONTACTED", "CLOSED"];

interface SubmissionsTableProps {
  submissions: JoinSubmission[];
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const message = useAdminMessage();
  const router = useRouter();
  const [selected, setSelected] = useState<JoinSubmission | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setLoading(id);
    const result = await updateJoinSubmissionStatus(id, status);
    setLoading(null);
    if (result.success) { message.success("Status updated"); router.refresh(); }
    else message.error(result.error);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse bg-white text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-brand-off-white text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr
                key={s.id}
                className="cursor-pointer border-b border-brand-border hover:bg-brand-off-white"
                onClick={() => setSelected(s)}
              >
                <td className="p-3">{s.fullName}</td>
                <td className="p-3"><StatusTag status={s.joinType} label={s.joinType.replace(/_/g, " ")} /></td>
                <td className="p-3">{s.email}</td>
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                  <Select
                    size="small"
                    value={s.status}
                    loading={loading === s.id}
                    style={{ width: 130 }}
                    options={STATUSES.map((st) => ({ value: st, label: st.toLowerCase() }))}
                    onChange={(status) => updateStatus(s.id, status)}
                  />
                </td>
                <td className="p-3">{format(new Date(s.createdAt), "dd MMM yyyy")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Drawer
        title={selected?.fullName}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        width={480}
      >
        {selected && (
          <>
            <Descriptions column={1} size="small" className="mb-4">
              <Descriptions.Item label="Type">{selected.joinType.replace(/_/g, " ")}</Descriptions.Item>
              <Descriptions.Item label="Email">{selected.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selected.phone || "—"}</Descriptions.Item>
              <Descriptions.Item label="Country">{selected.country || "—"}</Descriptions.Item>
              <Descriptions.Item label="Status"><StatusTag status={selected.status} /></Descriptions.Item>
            </Descriptions>
            <Typography.Title level={5}>Form Data</Typography.Title>
            <pre className="overflow-auto rounded-lg bg-brand-off-white p-3 text-xs">
              {JSON.stringify(selected.formData, null, 2)}
            </pre>
          </>
        )}
      </Drawer>
    </>
  );
}
