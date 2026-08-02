"use client";

import { Upload, Button, Image, Spin } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { UploadFile } from "antd";
import { useAdminMessage } from "@/hooks/useAdminMessage";

interface MediaUploaderProps {
  value?: string | null;
  onChange?: (url: string | null) => void;
  folder?: string;
  accept?: string;
  label?: string;
}

export function MediaUploader({
  value,
  onChange,
  folder = "general",
  accept = "image/jpeg,image/png,image/webp",
  label = "Upload Image",
}: MediaUploaderProps) {
  const message = useAdminMessage();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const url = data.url as string;
      onChange?.(url);
      message.success("File uploaded successfully");
      setFileList([]);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
    return false;
  };

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative inline-block">
          <Image
            src={value}
            alt="Uploaded"
            width={200}
            height={120}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            className="absolute right-1 top-1 bg-white/80"
            onClick={() => onChange?.(null)}
          />
        </div>
      )}
      <Upload
        accept={accept}
        fileList={fileList}
        beforeUpload={(file) => {
          handleUpload(file);
          return false;
        }}
        onChange={({ fileList: fl }) => setFileList(fl)}
        showUploadList={false}
        maxCount={1}
      >
        <Button icon={loading ? <Spin size="small" /> : <UploadOutlined />} loading={loading} disabled={loading}>
          {label}
        </Button>
      </Upload>
    </div>
  );
}
