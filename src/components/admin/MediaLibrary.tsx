"use client";

import { useState } from "react";
import { Button, Select, Image, Popconfirm, Input, Upload } from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { deleteMediaAsset } from "@/lib/actions/admin/settings";
import { STORAGE_FOLDERS } from "@/lib/constants";
import type { MediaAsset } from "@prisma/client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useAdminMessage } from "@/hooks/useAdminMessage";

interface MediaLibraryProps {
  assets: MediaAsset[];
}

export function MediaLibrary({ assets: initialAssets }: MediaLibraryProps) {
  const message = useAdminMessage();
  const router = useRouter();
  const [folder, setFolder] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);

  const assets = folder ? initialAssets.filter((a) => a.folder === folder) : initialAssets;

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder || "general");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      message.success("Uploaded");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteMediaAsset(id);
    if (result.success) { message.success("Deleted"); router.refresh(); }
    else message.error(result.error);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select
          allowClear
          placeholder="Filter by folder"
          style={{ width: 200 }}
          value={folder}
          onChange={setFolder}
          options={STORAGE_FOLDERS.map((f) => ({ value: f, label: f }))}
        />
        <Upload
          accept="image/jpeg,image/png,image/webp,application/pdf"
          showUploadList={false}
          beforeUpload={(file) => {
            handleUpload(file);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />} loading={uploading}>
            Upload File
          </Button>
        </Upload>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {assets.map((asset) => (
          <div key={asset.id} className="overflow-hidden rounded-lg border border-brand-border bg-white">
            {asset.mediaType === "IMAGE" ? (
              <Image src={asset.url} alt={asset.altText || asset.originalName} height={140} style={{ objectFit: "cover", width: "100%" }} />
            ) : (
              <div className="flex h-[140px] items-center justify-center bg-brand-off-white text-brand-grey">{asset.mediaType}</div>
            )}
            <div className="p-3">
              <p className="m-0 truncate text-sm font-medium">{asset.originalName}</p>
              <p className="m-0 text-xs text-brand-grey">{asset.folder} · {format(new Date(asset.createdAt), "dd MMM yyyy")}</p>
              <Input.TextArea
                className="mt-2"
                rows={1}
                defaultValue={asset.url}
                readOnly
                size="small"
              />
              <Popconfirm title="Delete this file?" onConfirm={() => handleDelete(asset.id)} okButtonProps={{ danger: true }}>
                <Button type="link" danger size="small" icon={<DeleteOutlined />} className="mt-1 px-0">Delete</Button>
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
