"use client";

import { useState } from "react";
import { Form, Input, Select, Switch, Button, Card, Row, Col } from "antd";
import { useRouter } from "next/navigation";
import { createProgramme, updateProgramme } from "@/lib/actions/admin/programmes";
import { ProgrammeCategory, ProgrammeStatus } from "@prisma/client";
import type { Programme } from "@prisma/client";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ROUTES } from "@/lib/constants";
import { useAdminMessage } from "@/hooks/useAdminMessage";

interface ProgrammeFormProps {
  programme?: Programme | null;
}

function toDateInput(value: Date | null | undefined) {
  if (!value) return undefined;
  return new Date(value).toISOString().slice(0, 10);
}

export function ProgrammeForm({ programme }: ProgrammeFormProps) {
  const message = useAdminMessage();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(programme);

  const onFinish = async (values: Record<string, unknown>) => {
    setLoading(true);
    const result = isEdit
      ? await updateProgramme(programme!.id, values)
      : await createProgramme(values);
    setLoading(false);
    if (result.success) {
      message.success(isEdit ? "Programme updated" : "Programme created");
      router.push(ROUTES.admin.programmes);
      router.refresh();
    } else {
      message.error(result.error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={
        programme
          ? {
              ...programme,
              startDate: toDateInput(programme.startDate),
              endDate: toDateInput(programme.endDate),
              applicationDeadline: toDateInput(programme.applicationDeadline),
            }
          : { status: ProgrammeStatus.PLANNED, interestFormEnabled: true, featured: false, published: false }
      }
    >
      <Card title="Basic Info" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select options={Object.values(ProgrammeCategory).map((v) => ({ value: v, label: v.replace(/_/g, " ") }))} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="excerpt" label="Excerpt" rules={[{ required: true }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <RichTextEditor minHeight={250} />
        </Form.Item>
        <Form.Item name="featuredImage" label="Featured Image">
          <MediaUploader folder="programmes" />
        </Form.Item>
      </Card>

      <Card title="Details" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={8}><Form.Item name="format" label="Format"><Input /></Form.Item></Col>
          <Col xs={24} md={8}><Form.Item name="targetAudience" label="Target Audience"><Input /></Form.Item></Col>
          <Col xs={24} md={8}><Form.Item name="location" label="Location"><Input /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={8}><Form.Item name="startDate" label="Start Date"><Input type="date" /></Form.Item></Col>
          <Col xs={24} md={8}><Form.Item name="endDate" label="End Date"><Input type="date" /></Form.Item></Col>
          <Col xs={24} md={8}><Form.Item name="applicationDeadline" label="Application Deadline"><Input type="date" /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}><Form.Item name="externalApplicationUrl" label="External Application URL"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item name="contactEmail" label="Contact Email"><Input type="email" /></Form.Item></Col>
        </Row>
      </Card>

      <Card title="Publishing" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="status" label="Status">
              <Select options={Object.values(ProgrammeStatus).map((v) => ({ value: v, label: v.replace(/_/g, " ") }))} />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex flex-wrap gap-6">
          <Form.Item name="interestFormEnabled" valuePropName="checked"><Switch checkedChildren="Interest Form" unCheckedChildren="Interest Form" /></Form.Item>
          <Form.Item name="featured" valuePropName="checked"><Switch checkedChildren="Featured" unCheckedChildren="Featured" /></Form.Item>
          <Form.Item name="published" valuePropName="checked"><Switch checkedChildren="Published" unCheckedChildren="Published" /></Form.Item>
        </div>
      </Card>

      <Button type="primary" htmlType="submit" loading={loading} size="large">
        {isEdit ? "Update Programme" : "Create Programme"}
      </Button>
    </Form>
  );
}
