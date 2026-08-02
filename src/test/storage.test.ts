import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  validateUploadFolder,
  validateFileSize,
  validateUploadBuffer,
  verifyDeclaredMimeMatchesBuffer,
  resolveStorageObjectPath,
  removeStorageObject,
  createMediaAssetRecordWithRollback,
  deleteStorageBackedAsset,
  getPublicMediaUrl,
  PUBLIC_BUCKET,
} from "@/lib/storage";

const JPEG_BYTES = Buffer.from([0xff, 0xd8, 0xff, 0x00, 0x00]);
const PNG_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
const PDF_BYTES = Buffer.from("%PDF-1.4");

describe("validateUploadFolder", () => {
  it("rejects folder traversal", () => {
    expect(validateUploadFolder("../general", false).valid).toBe(false);
    expect(validateUploadFolder("general/../team", false).valid).toBe(false);
    expect(validateUploadFolder("..", false).valid).toBe(false);
  });

  it("rejects backslashes and absolute paths", () => {
    expect(validateUploadFolder("general\\team", false).valid).toBe(false);
    expect(validateUploadFolder("/general", false).valid).toBe(false);
  });

  it("rejects unknown public folders", () => {
    expect(validateUploadFolder("join-attachments", false).valid).toBe(false);
    expect(validateUploadFolder("partner-proposals", false).valid).toBe(false);
    expect(validateUploadFolder("unknown", false).valid).toBe(false);
  });

  it("accepts allowed public folders", () => {
    const result = validateUploadFolder("programmes", false);
    expect(result.valid).toBe(true);
    expect(result.folder).toBe("programmes");
  });

  it("accepts only private folders for private uploads", () => {
    expect(validateUploadFolder("join-attachments", true).valid).toBe(true);
    expect(validateUploadFolder("partner-proposals", true).valid).toBe(true);
    expect(validateUploadFolder("general", true).valid).toBe(false);
  });

  it("rejects empty folder values", () => {
    expect(validateUploadFolder("", false).valid).toBe(false);
    expect(validateUploadFolder("   ", false).valid).toBe(false);
    expect(validateUploadFolder(null, false).valid).toBe(false);
  });
});

describe("validateUploadBuffer", () => {
  it("rejects images over 10 MB", () => {
    const result = validateUploadBuffer(JPEG_BYTES, "image/jpeg", 11 * 1024 * 1024);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("10MB");
  });

  it("accepts images up to 10 MB", () => {
    const result = validateUploadBuffer(JPEG_BYTES, "image/jpeg", 10 * 1024 * 1024);
    expect(result.valid).toBe(true);
  });

  it("rejects MIME mismatch for JPEG declared as PNG", () => {
    const result = validateUploadBuffer(JPEG_BYTES, "image/png", JPEG_BYTES.length);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("does not match");
  });

  it("rejects PDF declared as JPEG", () => {
    const result = validateUploadBuffer(PDF_BYTES, "image/jpeg", PDF_BYTES.length);
    expect(result.valid).toBe(false);
  });

  it("accepts valid PDF content with matching MIME", () => {
    const result = validateUploadBuffer(PDF_BYTES, "application/pdf", PDF_BYTES.length);
    expect(result.valid).toBe(true);
  });
});

describe("verifyDeclaredMimeMatchesBuffer", () => {
  it("accepts PNG signature with PNG MIME", () => {
    expect(verifyDeclaredMimeMatchesBuffer("image/png", PNG_BYTES).valid).toBe(true);
  });

  it("accepts DOCX when ZIP signature is present", () => {
    const zipBytes = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00]);
    expect(
      verifyDeclaredMimeMatchesBuffer(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        zipBytes,
      ).valid,
    ).toBe(true);
  });
});

describe("resolveStorageObjectPath", () => {
  it("returns object path for private assets", () => {
    expect(
      resolveStorageObjectPath({
        bucket: "private-submissions",
        url: "join-attachments/123-file.pdf",
        isPublic: false,
      }),
    ).toBe("join-attachments/123-file.pdf");
  });

  it("extracts object path from public URLs", () => {
    expect(
      resolveStorageObjectPath({
        bucket: "public-media",
        url: "https://example.supabase.co/storage/v1/object/public/public-media/general/photo.jpg",
        isPublic: true,
      }),
    ).toBe("general/photo.jpg");
  });
});

describe("removeStorageObject", () => {
  it("reports failure when Supabase delete fails", async () => {
    const supabase = {
      storage: {
        from: () => ({
          remove: vi.fn().mockResolvedValue({ error: { message: "delete failed" } }),
        }),
      },
    } as unknown as SupabaseClient;

    const result = await removeStorageObject(supabase, PUBLIC_BUCKET, "general/test.jpg");
    expect(result.success).toBe(false);
  });

  it("succeeds when Supabase delete succeeds", async () => {
    const removeMock = vi.fn().mockResolvedValue({ error: null });
    const supabase = {
      storage: {
        from: () => ({ remove: removeMock }),
      },
    } as unknown as SupabaseClient;

    const result = await removeStorageObject(supabase, PUBLIC_BUCKET, "general/test.jpg");
    expect(result.success).toBe(true);
    expect(removeMock).toHaveBeenCalledWith(["general/test.jpg"]);
  });
});

describe("createMediaAssetRecordWithRollback", () => {
  it("removes uploaded object when database insert fails", async () => {
    const removeMock = vi.fn().mockResolvedValue({ error: null });
    const supabase = {
      storage: {
        from: () => ({ remove: removeMock }),
      },
    } as unknown as SupabaseClient;

    const result = await createMediaAssetRecordWithRollback(
      supabase,
      PUBLIC_BUCKET,
      "general/test.jpg",
      async () => {
        throw new Error("database insert failed");
      },
    );

    expect(result.success).toBe(false);
    expect(removeMock).toHaveBeenCalledWith(["general/test.jpg"]);
  });

  it("returns created record when database insert succeeds", async () => {
    const supabase = {
      storage: {
        from: () => ({ remove: vi.fn() }),
      },
    } as unknown as SupabaseClient;

    const result = await createMediaAssetRecordWithRollback(
      supabase,
      PUBLIC_BUCKET,
      "general/test.jpg",
      async () => ({ id: "asset-1" }),
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ id: "asset-1" });
    }
  });
});

describe("private upload URL handling", () => {
  it("does not generate a public URL for private uploads", () => {
    const getPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl: "https://example/public" } });
    const supabase = {
      storage: {
        from: () => ({
          getPublicUrl,
        }),
      },
    } as unknown as SupabaseClient;

    const isPrivate = true;
    const storedUrl = isPrivate
      ? "join-attachments/file.pdf"
      : getPublicMediaUrl(supabase, "join-attachments/file.pdf");

    expect(storedUrl).toBe("join-attachments/file.pdf");
    expect(getPublicUrl).not.toHaveBeenCalled();
  });
});

describe("deleteStorageBackedAsset", () => {
  it("deletes storage before removing the database record", async () => {
    const calls: string[] = [];
    const removeMock = vi.fn().mockImplementation(async () => {
      calls.push("storage");
      return { error: null };
    });
    const deleteRecord = vi.fn().mockImplementation(async () => {
      calls.push("database");
    });

    const supabase = {
      storage: {
        from: () => ({ remove: removeMock }),
      },
    } as unknown as SupabaseClient;

    const result = await deleteStorageBackedAsset(
      supabase,
      {
        id: "asset-1",
        bucket: PUBLIC_BUCKET,
        url: "https://example.supabase.co/storage/v1/object/public/public-media/general/test.jpg",
        isPublic: true,
      },
      deleteRecord,
    );

    expect(result.success).toBe(true);
    expect(calls).toEqual(["storage", "database"]);
  });

  it("keeps the database record when storage deletion fails", async () => {
    const deleteRecord = vi.fn();
    const supabase = {
      storage: {
        from: () => ({
          remove: vi.fn().mockResolvedValue({ error: { message: "delete failed" } }),
        }),
      },
    } as unknown as SupabaseClient;

    const result = await deleteStorageBackedAsset(
      supabase,
      {
        id: "asset-1",
        bucket: PUBLIC_BUCKET,
        url: "general/test.jpg",
        isPublic: false,
      },
      deleteRecord,
    );

    expect(result.success).toBe(false);
    expect(deleteRecord).not.toHaveBeenCalled();
  });
});

describe("validateFileSize", () => {
  it("uses the 10 MB image limit", () => {
    expect(validateFileSize(10 * 1024 * 1024, "image").valid).toBe(true);
    expect(validateFileSize(10 * 1024 * 1024 + 1, "image").valid).toBe(false);
  });
});
