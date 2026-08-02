"use client";

import { useState } from "react";
import { Form, Input, Switch, Button, Card, Row, Col } from "antd";
import { updateSiteSettings } from "@/lib/actions/admin/settings";
import type { SiteSetting } from "@prisma/client";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { useAdminMessage } from "@/hooks/useAdminMessage";

interface SettingsFormProps {
  settings: SiteSetting | null;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const message = useAdminMessage();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: Record<string, unknown>) => {
    setLoading(true);
    const result = await updateSiteSettings(values);
    setLoading(false);
    if (result.success) message.success("Settings saved");
    else message.error(result.error);
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={
        settings ?? {
          organisationName: "EduLead Network",
          tagline: "Education for Leadership and Change",
          newsletterFromName: "EduLead Network",
          maintenanceMode: false,
        }
      }
    >
      <Card title="Organisation" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={12}><Form.Item name="organisationName" label="Organisation Name" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item name="tagline" label="Tagline"><Input /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} md={12}><Form.Item name="logoUrl" label="Logo"><MediaUploader folder="branding" /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item name="faviconUrl" label="Favicon"><MediaUploader folder="branding" accept="image/png,image/jpeg,image/webp,image/x-icon" /></Form.Item></Col>
        </Row>
      </Card>
      <Card title="Contact" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={8}><Form.Item name="generalEmail" label="General Email"><Input type="email" /></Form.Item></Col>
          <Col xs={24} md={8}><Form.Item name="phone" label="Phone"><Input /></Form.Item></Col>
          <Col xs={24} md={8}><Form.Item name="whatsapp" label="WhatsApp"><Input /></Form.Item></Col>
        </Row>
        <Form.Item name="address" label="Address"><Input.TextArea rows={2} /></Form.Item>
      </Card>
      <Card title="Social Media" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={12}><Form.Item name="facebookUrl" label="Facebook"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item name="twitterUrl" label="Twitter / X"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item name="instagramUrl" label="Instagram"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item name="linkedinUrl" label="LinkedIn"><Input /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item name="youtubeUrl" label="YouTube"><Input /></Form.Item></Col>
        </Row>
      </Card>
      <Card title="SEO & Analytics" className="mb-4">
        <Form.Item name="defaultSeoTitle" label="Default SEO Title"><Input /></Form.Item>
        <Form.Item name="defaultSeoDescription" label="Default SEO Description"><Input.TextArea rows={2} /></Form.Item>
        <Form.Item name="googleAnalyticsId" label="Google Analytics ID"><Input placeholder="G-XXXXXXXXXX" /></Form.Item>
      </Card>
      <Card title="Notifications" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={12}><Form.Item name="contactNotifyEmail" label="Contact Notification Email"><Input type="email" /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item name="joinNotifyEmail" label="Join Submission Email"><Input type="email" /></Form.Item></Col>
          <Col xs={24} md={12}><Form.Item name="newsletterFromName" label="Newsletter From Name"><Input /></Form.Item></Col>
        </Row>
      </Card>
      <Card title="Other" className="mb-4">
        <Form.Item name="footerText" label="Footer Text"><Input.TextArea rows={2} /></Form.Item>
        <Form.Item name="maintenanceMode" label="Maintenance Mode" valuePropName="checked"><Switch /></Form.Item>
      </Card>
      <Button type="primary" htmlType="submit" loading={loading} size="large">Save Settings</Button>
    </Form>
  );
}
