"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Switch, Button, Card, Select, InputNumber } from "antd";
import { updatePageContent } from "@/lib/actions/admin/pages";
import { PageKey } from "@prisma/client";
import type { PageContent } from "@prisma/client";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useAdminMessage } from "@/hooks/useAdminMessage";

const PAGE_KEYS = Object.values(PageKey);

interface PageContentEditorProps {
  sections: PageContent[];
}

export function PageContentEditor({ sections: initialSections }: PageContentEditorProps) {
  const message = useAdminMessage();
  const router = useRouter();
  const [filter, setFilter] = useState<PageKey | "ALL">("ALL");
  const [loading, setLoading] = useState<string | null>(null);

  const sections =
    filter === "ALL" ? initialSections : initialSections.filter((s) => s.pageKey === filter);

  const handleSave = async (section: PageContent, values: Record<string, unknown>) => {
    setLoading(section.id);
    const result = await updatePageContent(section.id, {
      heading: values.heading as string,
      subheading: values.subheading as string,
      body: values.body as string,
      imageUrl: values.imageUrl as string,
      buttonLabel: values.buttonLabel as string,
      buttonUrl: values.buttonUrl as string,
      visible: values.visible as boolean,
      published: values.published as boolean,
      sortOrder: values.sortOrder as number,
    });
    setLoading(null);
    if (result.success) {
      message.success(`Updated ${section.sectionKey}`);
      router.refresh();
    } else {
      message.error(result.error);
    }
  };

  return (
    <div>
      <Select
        defaultValue="ALL"
        style={{ width: 200, marginBottom: 16 }}
        onChange={setFilter}
        options={[
          { value: "ALL", label: "All Pages" },
          ...PAGE_KEYS.map((key) => ({ value: key, label: key.replace(/_/g, " ") })),
        ]}
      />
      <div className="space-y-4">
        {sections.map((section) => (
          <Card
            key={section.id}
            title={
              <span>
                {section.pageKey} / <strong>{section.sectionKey}</strong>
              </span>
            }
            size="small"
          >
            <Form
              layout="vertical"
              initialValues={{
                heading: section.heading,
                subheading: section.subheading,
                body: section.body,
                imageUrl: section.imageUrl,
                buttonLabel: section.buttonLabel,
                buttonUrl: section.buttonUrl,
                visible: section.visible,
                published: section.published,
                sortOrder: section.sortOrder,
              }}
              onFinish={(values) => handleSave(section, values)}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Form.Item name="heading" label="Heading">
                  <Input />
                </Form.Item>
                <Form.Item name="subheading" label="Subheading">
                  <Input />
                </Form.Item>
              </div>
              <Form.Item name="body" label="Body">
                <RichTextEditor />
              </Form.Item>
              <Form.Item name="imageUrl" label="Image">
                <MediaUploader folder="general" />
              </Form.Item>
              <div className="grid gap-4 md:grid-cols-2">
                <Form.Item name="buttonLabel" label="Button Label">
                  <Input />
                </Form.Item>
                <Form.Item name="buttonUrl" label="Button URL">
                  <Input />
                </Form.Item>
              </div>
              <div className="flex flex-wrap gap-6">
                <Form.Item name="visible" label="Visible" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item name="published" label="Published" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item name="sortOrder" label="Sort Order">
                  <InputNumber min={0} />
                </Form.Item>
              </div>
              <Button type="primary" htmlType="submit" loading={loading === section.id}>
                Save Section
              </Button>
            </Form>
          </Card>
        ))}
      </div>
    </div>
  );
}
