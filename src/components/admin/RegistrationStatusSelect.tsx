"use client";

import { useState } from "react";
import { Select } from "antd";
import { updateEventRegistrationStatus } from "@/lib/actions/admin/events";
import { useRouter } from "next/navigation";
import type { EventRegistration } from "@prisma/client";
import { useAdminMessage } from "@/hooks/useAdminMessage";

const STATUSES = ["NEW", "REVIEWED", "CONTACTED", "CLOSED"];

export function RegistrationStatusSelect({ record }: { record: EventRegistration }) {
  const message = useAdminMessage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Select
      size="small"
      value={record.status}
      loading={loading}
      style={{ width: 130 }}
      options={STATUSES.map((s) => ({ value: s, label: s.toLowerCase() }))}
      onChange={async (status) => {
        setLoading(true);
        const result = await updateEventRegistrationStatus(record.id, status);
        setLoading(false);
        if (result.success) { message.success("Status updated"); router.refresh(); }
        else message.error(result.error);
      }}
    />
  );
}
