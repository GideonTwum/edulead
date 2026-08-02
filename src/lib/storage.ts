import {
  ALLOWED_DOCUMENT_TYPES,
  ALLOWED_IMAGE_TYPES,
  FILE_LIMITS,
  PRIVATE_MEDIA_FOLDERS,
  PUBLIC_MEDIA_FOLDERS,
} from "@/lib/constants";
import type { MediaAsset } from "@prisma/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export const PUBLIC_BUCKET = "public-media";
export const PRIVATE_BUCKET = "private-submissions";

const JPEG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff]);
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PDF_SIGNATURE = Buffer.from("%PDF");
const OLE_SIGNATURE = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);

export type AllowedMimeType =
  | (typeof ALLOWED_IMAGE_TYPES)[number]
  | (typeof ALLOWED_DOCUMENT_TYPES)[number];

export function validateUploadFolder(
  folder: string | null | undefined,
  isPrivate: boolean,
): { valid: boolean; error?: string; folder?: string } {
  if (folder == null || typeof folder !== "string") {
    return { valid: false, error: "Folder is required" };
  }

  const trimmed = folder.trim();
  if (!trimmed) {
    return { valid: false, error: "Folder is required" };
  }

  if (
    trimmed.includes("..") ||
    trimmed.includes("\\") ||
    trimmed.startsWith("/") ||
    trimmed.endsWith("/") ||
    trimmed.includes("//")
  ) {
    return { valid: false, error: "Invalid folder" };
  }

  if (trimmed.includes("/")) {
    return { valid: false, error: "Invalid folder" };
  }

  const allowed = (isPrivate ? PRIVATE_MEDIA_FOLDERS : PUBLIC_MEDIA_FOLDERS) as readonly string[];
  if (!allowed.includes(trimmed)) {
    return { valid: false, error: "Invalid folder" };
  }

  return { valid: true, folder: trimmed };
}

export function validateFileSize(
  size: number,
  category: "image" | "document",
): { valid: boolean; error?: string } {
  const maxSize = category === "image" ? FILE_LIMITS.image : FILE_LIMITS.document;
  if (size > maxSize) {
    return {
      valid: false,
      error: `File size must be under ${maxSize / (1024 * 1024)}MB`,
    };
  }
  return { valid: true };
}

export function validateDeclaredMime(
  declaredMime: string,
  category: "image" | "document",
): { valid: boolean; error?: string } {
  const allowedTypes = category === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES;
  if (!allowedTypes.includes(declaredMime as never)) {
    return { valid: false, error: "File type not allowed" };
  }
  return { valid: true };
}

function hasPrefix(buffer: Buffer, signature: Buffer): boolean {
  return buffer.length >= signature.length && buffer.subarray(0, signature.length).equals(signature);
}

function isWebp(buffer: Buffer): boolean {
  return (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

function isZipArchive(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
}

/**
 * Detect file type from magic bytes.
 * DOCX shares the ZIP signature with other archive types; only treat ZIP as DOCX when
 * the declared MIME is DOCX during verification.
 */
export function detectMimeFromBuffer(buffer: Buffer): AllowedMimeType | null {
  if (hasPrefix(buffer, JPEG_SIGNATURE)) return "image/jpeg";
  if (hasPrefix(buffer, PNG_SIGNATURE)) return "image/png";
  if (isWebp(buffer)) return "image/webp";
  if (hasPrefix(buffer, PDF_SIGNATURE)) return "application/pdf";
  if (hasPrefix(buffer, OLE_SIGNATURE)) return "application/msword";
  return null;
}

export function verifyDeclaredMimeMatchesBuffer(
  declaredMime: string,
  buffer: Buffer,
): { valid: boolean; error?: string } {
  if (declaredMime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    // DOCX is a ZIP container. Signature-only validation cannot distinguish DOCX from other ZIP files.
    if (!isZipArchive(buffer)) {
      return { valid: false, error: "File content does not match declared type" };
    }
    return { valid: true };
  }

  if (declaredMime === "application/msword") {
    if (!hasPrefix(buffer, OLE_SIGNATURE)) {
      return { valid: false, error: "File content does not match declared type" };
    }
    return { valid: true };
  }

  const detected = detectMimeFromBuffer(buffer);
  if (!detected || detected !== declaredMime) {
    return { valid: false, error: "File content does not match declared type" };
  }

  return { valid: true };
}

export function validateUploadBuffer(
  buffer: Buffer,
  declaredMime: string,
  size: number,
): { valid: boolean; error?: string; category?: "image" | "document" } {
  const category = declaredMime.startsWith("image/") ? "image" : "document";

  const sizeValidation = validateFileSize(size, category);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  const mimeValidation = validateDeclaredMime(declaredMime, category);
  if (!mimeValidation.valid) {
    return mimeValidation;
  }

  const contentValidation = verifyDeclaredMimeMatchesBuffer(declaredMime, buffer);
  if (!contentValidation.valid) {
    return contentValidation;
  }

  return { valid: true, category };
}

export function validateFile(
  file: File,
  type: "image" | "document",
): { valid: boolean; error?: string } {
  const declaredMime = file.type;
  const category = type;

  const sizeValidation = validateFileSize(file.size, category);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  const mimeValidation = validateDeclaredMime(declaredMime, category);
  if (!mimeValidation.valid) {
    return mimeValidation;
  }

  return { valid: true };
}

export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .slice(0, 200);
}

export function generateStoragePath(folder: string, fileName: string): string {
  const sanitized = sanitizeFileName(fileName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const ext = sanitized.split(".").pop() || "";
  const base = sanitized.replace(/\.[^.]+$/, "");
  return `${folder}/${timestamp}-${random}-${base}.${ext}`;
}

export function getMediaType(mimeType: string): "IMAGE" | "PDF" | "DOCUMENT" | "OTHER" {
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.includes("word") || mimeType.includes("document")) return "DOCUMENT";
  return "OTHER";
}

export function resolveStorageObjectPath(asset: Pick<MediaAsset, "bucket" | "url" | "isPublic">): string | null {
  if (!asset.isPublic) {
    if (asset.url.startsWith(`${asset.bucket}/`)) {
      return asset.url.slice(asset.bucket.length + 1);
    }
    return asset.url;
  }

  const publicMarker = `/object/public/${asset.bucket}/`;
  const markerIndex = asset.url.indexOf(publicMarker);
  if (markerIndex !== -1) {
    return asset.url.slice(markerIndex + publicMarker.length);
  }

  const bucketMarker = `${asset.bucket}/`;
  const bucketIndex = asset.url.indexOf(bucketMarker);
  if (bucketIndex !== -1) {
    return asset.url.slice(bucketIndex + bucketMarker.length);
  }

  return null;
}

export function getPublicMediaUrl(
  supabase: SupabaseClient,
  storagePath: string,
): string {
  const { data } = supabase.storage.from(PUBLIC_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function removeStorageObject(
  supabase: SupabaseClient,
  bucket: string,
  objectPath: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.storage.from(bucket).remove([objectPath]);

  if (error) {
    console.error("[storage] delete failed", {
      bucket,
      objectPath,
      message: error.message,
    });
    return { success: false, error: "Failed to delete file from storage" };
  }

  return { success: true };
}

export async function deleteStorageBackedAsset(
  supabase: SupabaseClient,
  asset: Pick<MediaAsset, "id" | "bucket" | "url" | "isPublic">,
  deleteRecord: (id: string) => Promise<void>,
): Promise<{ success: boolean; error?: string }> {
  const objectPath = resolveStorageObjectPath(asset);
  if (!objectPath) {
    return { success: false, error: "Unable to resolve storage path" };
  }

  const removed = await removeStorageObject(supabase, asset.bucket, objectPath);
  if (!removed.success) {
    return removed;
  }

  await deleteRecord(asset.id);
  return { success: true };
}

export async function createMediaAssetRecordWithRollback<T>(
  supabase: SupabaseClient,
  bucket: string,
  objectPath: string,
  createRecord: () => Promise<T>,
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await createRecord();
    return { success: true, data };
  } catch (error) {
    console.error("[upload] database insert failed", error);

    const cleanup = await removeStorageObject(supabase, bucket, objectPath);
    if (!cleanup.success) {
      console.error("[upload] storage cleanup failed after database error", {
        bucket,
        objectPath,
      });
    }

    return { success: false, error: "Upload failed" };
  }
}
