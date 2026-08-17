"use client";

import { useState } from "react";
import { Form, Input, Switch, Button, Card, Row, Col, InputNumber, Modal } from "antd";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/lib/actions/admin/team";
import type { TeamMember } from "@prisma/client";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAdminMessage } from "@/hooks/useAdminMessage";

interface TeamManagerProps {
  members: TeamMember[];
}

export function TeamManager({ members }: TeamManagerProps) {
  const message = useAdminMessage();
  const router = useRouter();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ active: true, showEmail: false, displayOrder: members.length });
    setOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditing(member);
    form.setFieldsValue(member);
    setOpen(true);
  };

  const onFinish = async (values: Record<string, unknown>) => {
    setLoading(true);
    const result = editing
      ? await updateTeamMember(editing.id, values)
      : await createTeamMember(values);
    setLoading(false);
    if (result.success) {
      message.success(editing ? "Member updated" : "Member created");
      setOpen(false);
      router.refresh();
    } else {
      message.error(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteTeamMember(id);
    if (result.success) { message.success("Member deleted"); router.refresh(); }
    else message.error(result.error);
  };

  return (
    <>
      <div className="mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Add Team Member</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card
            key={member.id}
            cover={member.profileImage ? <img src={member.profileImage} alt={member.fullName} className="h-48 object-cover" /> : undefined}
            actions={[
              <Button key="edit" type="link" icon={<EditOutlined />} onClick={() => openEdit(member)}>Edit</Button>,
              <Button key="delete" type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(member.id)}>Delete</Button>,
            ]}
          >
            <Card.Meta
              title={member.fullName}
              description={
                <>
                  <p className="m-0 text-brand-grey">{member.role}</p>
                  {!member.active && <span className="text-xs text-orange-500">Inactive</span>}
                </>
              }
            />
          </Card>
        ))}
      </div>
      <Modal
        title={editing ? "Edit Team Member" : "Add Team Member"}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="slug" label="URL Slug" rules={[{ required: true }]}><Input placeholder="elizabeth-dansoa-osei" /></Form.Item></Col>
          </Row>
          <Form.Item name="role" label="Role"><Input placeholder="Optional — add when confirmed" /></Form.Item>
          <Form.Item name="biography" label="Biography" rules={[{ required: true }]}><RichTextEditor minHeight={150} /></Form.Item>
          <Form.Item name="profileImage" label="Profile Image"><MediaUploader folder="team" /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="email" label="Email"><Input type="email" /></Form.Item></Col>
            <Col span={12}><Form.Item name="linkedinUrl" label="LinkedIn URL"><Input /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="displayOrder" label="Display Order"><InputNumber min={0} className="w-full" /></Form.Item></Col>
            <Col span={8}><Form.Item name="showEmail" valuePropName="checked"><Switch checkedChildren="Show Email" unCheckedChildren="Show Email" /></Form.Item></Col>
            <Col span={8}><Form.Item name="active" valuePropName="checked"><Switch checkedChildren="Active" unCheckedChildren="Active" /></Form.Item></Col>
          </Row>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {editing ? "Update Member" : "Add Member"}
          </Button>
        </Form>
      </Modal>
    </>
  );
}
