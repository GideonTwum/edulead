"use client";

import { useState } from "react";
import { Form, Input, Select, Switch, Button, Card, Row, Col, InputNumber } from "antd";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/lib/actions/admin/events";
import { EventStatus, EventType } from "@prisma/client";
import type { Event } from "@prisma/client";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ROUTES } from "@/lib/constants";
import { useAdminMessage } from "@/hooks/useAdminMessage";

interface EventFormProps {
  event?: Event | null;
}

function toDateInput(value: Date | null | undefined) {
  if (!value) return undefined;
  return new Date(value).toISOString().slice(0, 10);
}

export function EventForm({ event }: EventFormProps) {
  const message = useAdminMessage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(event);

  const onFinish = async (values: Record<string, unknown>) => {
    setLoading(true);
    const result = isEdit ? await updateEvent(event!.id, values) : await createEvent(values);
    setLoading(false);
    if (result.success) {
      message.success(isEdit ? "Event updated" : "Event created");
      router.push(ROUTES.admin.events);
      router.refresh();
    } else {
      message.error(result.error);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={
        event
          ? {
              ...event,
              date: toDateInput(event.date),
              endDate: toDateInput(event.endDate),
              registrationDeadline: toDateInput(event.registrationDeadline),
            }
          : { status: EventStatus.UPCOMING, eventType: EventType.WORKSHOP, timezone: "Africa/Accra", registrationFormEnabled: false, featured: false, published: false }
      }
    >
      <Card title="Basic Info" className="mb-4">
        <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="excerpt" label="Excerpt" rules={[{ required: true }]}><Input.TextArea rows={2} /></Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}><RichTextEditor minHeight={250} /></Form.Item>
        <Form.Item name="featuredImage" label="Featured Image"><MediaUploader folder="events" /></Form.Item>
      </Card>
      <Card title="Schedule & Location" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={8}><Form.Item name="eventType" label="Event Type"><Select options={Object.values(EventType).map((v) => ({ value: v, label: v.replace(/_/g, " ") }))} /></Form.Item></Col>
          <Col xs={24} md={8}><Form.Item name="date" label="Date" rules={[{ required: true }]}><Input type="date" /></Form.Item></Col>
          <Col xs={24} md={8}><Form.Item name="endDate" label="End Date"><Input type="date" /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={6}><Form.Item name="startTime" label="Start Time"><Input type="time" /></Form.Item></Col>
          <Col xs={24} md={6}><Form.Item name="endTime" label="End Time"><Input type="time" /></Form.Item></Col>
          <Col xs={24} md={6}><Form.Item name="timezone" label="Timezone"><Input /></Form.Item></Col>
          <Col xs={24} md={6}><Form.Item name="capacity" label="Capacity"><InputNumber min={0} className="w-full" /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}><Form.Item name="venue" label="Venue"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item name="onlineLink" label="Online Link"><Input /></Form.Item></Col>
        </Row>
      </Card>
      <Card title="Registration" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={12}><Form.Item name="registrationUrl" label="Registration URL"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item name="registrationDeadline" label="Registration Deadline"><Input type="date" /></Form.Item></Col>
        </Row>
        <Form.Item name="registrationFormEnabled" valuePropName="checked"><Switch checkedChildren="Enable Registration Form" unCheckedChildren="Enable Registration Form" /></Form.Item>
      </Card>
      <Card title="Publishing" className="mb-4">
        <Form.Item name="status" label="Status"><Select options={Object.values(EventStatus).map((v) => ({ value: v, label: v }))} /></Form.Item>
        <div className="flex flex-wrap gap-6">
          <Form.Item name="featured" valuePropName="checked"><Switch checkedChildren="Featured" unCheckedChildren="Featured" /></Form.Item>
          <Form.Item name="published" valuePropName="checked"><Switch checkedChildren="Published" unCheckedChildren="Published" /></Form.Item>
        </div>
      </Card>
      <Button type="primary" htmlType="submit" loading={loading} size="large">{isEdit ? "Update" : "Create"} Event</Button>
    </Form>
  );
}
