"use client";

import { useState } from "react";
import { Form, Input, Select, Switch, Button, Card, Row, Col, InputNumber } from "antd";
import { useRouter } from "next/navigation";
import { createArticle, updateArticle } from "@/lib/actions/admin/articles";
import { ArticleStatus } from "@prisma/client";
import type { Article, ArticleCategory } from "@prisma/client";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ROUTES } from "@/lib/constants";
import { useAdminMessage } from "@/hooks/useAdminMessage";

interface ArticleFormProps {
  article?: Article | null;
  categories: ArticleCategory[];
}

function toDateInput(value: Date | null | undefined) {
  if (!value) return undefined;
  return new Date(value).toISOString().slice(0, 10);
}

export function ArticleForm({ article, categories }: ArticleFormProps) {
  const message = useAdminMessage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(article);

  const onFinish = async (values: Record<string, unknown>) => {
    setLoading(true);
    const result = isEdit ? await updateArticle(article!.id, values) : await createArticle(values);
    setLoading(false);
    if (result.success) {
      message.success(isEdit ? "Article updated" : "Article created");
      router.push(ROUTES.admin.articles);
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
        article
          ? { ...article, tags: article.tags.join(", "), publishedAt: toDateInput(article.publishedAt) }
          : { status: ArticleStatus.DRAFT, featured: false }
      }
    >
      <Card title="Content" className="mb-4">
        <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="excerpt" label="Excerpt" rules={[{ required: true }]}><Input.TextArea rows={2} /></Form.Item>
        <Form.Item name="content" label="Content" rules={[{ required: true }]}><RichTextEditor minHeight={300} /></Form.Item>
        <Form.Item name="featuredImage" label="Featured Image"><MediaUploader folder="articles" /></Form.Item>
      </Card>
      <Card title="Author & Category" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={8}><Form.Item name="authorName" label="Author Name"><Input /></Form.Item></Col>
          <Col xs={24} md={8}>
            <Form.Item name="categoryId" label="Category">
              <Select allowClear options={categories.map((c) => ({ value: c.id, label: c.name }))} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}><Form.Item name="readingTime" label="Reading Time (min)"><InputNumber min={1} className="w-full" /></Form.Item></Col>
        </Row>
        <Form.Item name="tags" label="Tags (comma-separated)"><Input /></Form.Item>
      </Card>
      <Card title="Publishing" className="mb-4">
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item name="status" label="Status">
              <Select options={Object.values(ArticleStatus).map((v) => ({ value: v, label: v }))} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}><Form.Item name="publishedAt" label="Publish Date"><Input type="date" /></Form.Item></Col>
        </Row>
        <Form.Item name="featured" valuePropName="checked"><Switch checkedChildren="Featured" unCheckedChildren="Featured" /></Form.Item>
      </Card>
      <Button type="primary" htmlType="submit" loading={loading} size="large">{isEdit ? "Update" : "Create"} Article</Button>
    </Form>
  );
}
