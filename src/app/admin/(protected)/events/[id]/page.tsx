import { PageHeader } from "@/components/admin/PageHeader";
import { EventForm } from "@/components/admin/EventForm";
import { DataTable } from "@/components/admin/DataTable";
import { getEvent } from "@/lib/actions/admin/events";
import { ROUTES } from "@/lib/constants";
import { notFound } from "next/navigation";
import { Card } from "antd";
import { RegistrationStatusSelect } from "@/components/admin/RegistrationStatusSelect";
import { format } from "date-fns";
import type { EventRegistration } from "@prisma/client";

export default async function AdminEventEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const event = isNew ? null : await getEvent(id);
  if (!isNew && !event) notFound();

  const registrationColumns = [
    { title: "Name", dataIndex: "fullName", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Institution", dataIndex: "institution", key: "institution" },
    { title: "Registered", dataIndex: "createdAt", key: "createdAt", render: (v: Date) => format(new Date(v), "dd MMM yyyy") },
    { title: "Status", key: "status", render: (_: unknown, record: EventRegistration) => <RegistrationStatusSelect record={record} /> },
  ];

  return (
    <div>
      <PageHeader title={isNew ? "New Event" : "Edit Event"} breadcrumbs={[{ title: "Events", href: ROUTES.admin.events }, { title: isNew ? "New" : event!.title }]} />
      <EventForm event={event} />
      {!isNew && event && event.registrations.length > 0 && (
        <Card title={`Registrations (${event.registrations.length})`} className="mt-6">
          <DataTable rowKey="id" dataSource={event.registrations} columns={registrationColumns} pagination={{ pageSize: 5 }} />
        </Card>
      )}
    </div>
  );
}
