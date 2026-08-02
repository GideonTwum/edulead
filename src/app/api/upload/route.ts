import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import {
  validateUploadBuffer,
  validateUploadFolder,
  generateStoragePath,
  getMediaType,
  getPublicMediaUrl,
  createMediaAssetRecordWithRollback,
  PUBLIC_BUCKET,
  PRIVATE_BUCKET,
} from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folderInput = formData.get("folder") as string | null;
    const isPrivate = formData.get("isPrivate") === "true";
    const altText = (formData.get("altText") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const folderValidation = validateUploadFolder(folderInput, isPrivate);
    if (!folderValidation.valid || !folderValidation.folder) {
      return NextResponse.json({ error: folderValidation.error || "Invalid folder" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const validation = validateUploadBuffer(buffer, file.type, file.size);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const folder = folderValidation.folder;
    const storagePath = generateStoragePath(folder, file.name);
    const bucket = isPrivate ? PRIVATE_BUCKET : PUBLIC_BUCKET;

    const supabase = createServiceClient();
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("[upload] storage upload failed", { bucket, message: uploadError.message });
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const publicUrl = isPrivate ? null : getPublicMediaUrl(supabase, storagePath);

    const recordResult = await createMediaAssetRecordWithRollback(
      supabase,
      bucket,
      storagePath,
      () =>
        prisma.mediaAsset.create({
          data: {
            fileName: storagePath.split("/").pop() || file.name,
            originalName: file.name,
            url: isPrivate ? storagePath : publicUrl!,
            bucket,
            folder,
            mediaType: getMediaType(file.type),
            mimeType: file.type,
            size: file.size,
            altText,
            isPublic: !isPrivate,
          },
        }),
    );

    if (!recordResult.success) {
      return NextResponse.json({ error: recordResult.error }, { status: 500 });
    }

    return NextResponse.json({ asset: recordResult.data, url: publicUrl });
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[upload] unexpected error", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
