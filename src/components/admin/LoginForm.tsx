"use client";

import { Form, Input, Button, Card, Alert, Typography } from "antd";
import { loginAction } from "@/lib/actions/admin/auth";
import { getAdminAccessErrorMessage } from "@/lib/auth/admin-access";
import { useState } from "react";
import Image from "next/image";

const { Title, Text } = Typography;

interface LoginFormProps {
  redirectTo: string;
  initialError?: string | null;
}

export function LoginForm({ redirectTo, initialError = null }: LoginFormProps) {
  const [error, setError] = useState<string | null>(
    getAdminAccessErrorMessage(initialError),
  );
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("redirect", redirectTo);

    const result = await loginAction(formData);
    if (result && !result.success) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-brand-lg" styles={{ body: { padding: 32 } }}>
        <div className="mb-8 text-center">
          <Image src="/logo.jpeg" alt="EduLead Network" width={64} height={64} className="mx-auto mb-4" />
          <Title level={3} style={{ margin: 0, color: "#151A63" }}>
            Admin Login
          </Title>
          <Text type="secondary">EduLead Network Dashboard</Text>
        </div>

        {error && <Alert message={error} type="error" showIcon className="mb-4" />}

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
          >
            <Input size="large" autoComplete="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password size="large" autoComplete="current-password" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
