"use client";

import { useState } from "react";
import { Form, Input, Select, Switch, Button, Card, Row, Col } from "antd";
import { useRouter } from "next/navigation";
import { createOpportunity, updateOpportunity } from "@/lib/actions/admin/opportunities";
import { LocationType, OpportunityStatus, OpportunityType } from "@prisma/client";
import type { Opportunity } from "@prisma/client";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ROUTES } from "@/lib/constants";
import { useAdminMessage } from "@/hooks/useAdminMessage";

interface OpportunityFormProps {
  opportunity?: Opportunity | null;
}

function toDateInput(value: Date | null | undefined) {
  if (!value) return undefined;
  return new Date(value).toISOString().slice(0, 10);
}

export function OpportunityForm({ opportunity }: OpportunityFormProps) {
  const message = useAdminMessage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(opportunity);

  const onFinish = async (values: Record<string, unknown>) => {
    setLoading(true);
    const result = isEdit
      ? await updateOpportunity(opportunity!.id, values)
      : await createOpportunity(values);
    setLoading(false);
    if (result.success) {
      message.success(isEdit ? "Opportunity updated" : "Opportunity created");
      router.push(ROUTES.admin.opportunities);
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
        opportunity
          ? { ...opportunity, deadline: toDateInput(opportunity.deadline), tags: opportunity.tags.join(", ") }
          : { status: OpportunityStatus.ACTIVE, locationType: LocationType.REMOTE, featured: false, published: false }
      }
    >
      <Card title="Basic Info" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={12}><Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item name="organisation" label="Organisation" rules={[{ required: true }]}><Input /></Form.Item></Col>
        </Row>
        <Form.Item name="excerpt" label="Excerpt" rules={[{ required: true }]}><Input.TextArea rows={2} /></Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}><RichTextEditor minHeight={250} /></Form.Item>
        <Form.Item name="featuredImage" label="Featured Image"><MediaUploader folder="opportunities" /></Form.Item>
      </Card>
      <Card title="Details" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="opportunityType" label="Type" rules={[{ required: true }]}>
              <Select options={Object.values(OpportunityType).map((v) => ({ value: v, label: v.replace(/_/g, " ") }))} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}><Form.Item name="locationType" label="Location Type"><Select options={Object.values(LocationType).map((v) => ({ value: v, label: v.replace(/_/g, " ") }))} /></Form.Item></Col>
          <Col xs={24} md={8}><Form.Item name="country" label="Country"><Input /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}><Form.Item name="deadline" label="Deadline"><Input type="date" /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item name="applicationUrl" label="Application URL"><Input /></Form.Item></Col>
        </Row>
        <Form.Item name="eligibility" label="Eligibility"><Input.TextArea rows={3} /></Form.Item>
        <Form.Item name="tags" label="Tags (comma-separated)"><Input /></Form.Item>
      </Card>
      <Card title="Publishing" className="mb-4">
        <Form.Item name="status" label="Status"><Select options={Object.values(OpportunityStatus).map((v) => ({ value: v, label: v }))} /></Form.Item>
        <div className="flex flex-wrap gap-6">
          <Form.Item name="featured" valuePropName="checked"><Switch checkedChildren="Featured" unCheckedChildren="Featured" /></Form.Item>
          <Form.Item name="published" valuePropName="checked"><Switch checkedChildren="Published" unCheckedChildren="Published" /></Form.Item>
        </div>
      </Card>
      <Button type="primary" htmlType="submit" loading={loading} size="large">{isEdit ? "Update" : "Create"} Opportunity</Button>
    </Form>
  );
}
