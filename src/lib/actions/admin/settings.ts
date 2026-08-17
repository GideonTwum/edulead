"use server";

import prisma from "@/lib/db";
import { logAudit } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { deleteStorageBackedAsset } from "@/lib/storage";
import { revalidateSiteWideContent } from "@/lib/revalidation";
import { getAdminId } from "./shared";
import type { ActionResult } from "./utils";

export async function getMediaAssets(folder?: string) {
  await getAdminId();
  return prisma.mediaAsset.findMany({
    where: folder ? { folder } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function updateMediaAsset(
  id: string,
  data: { altText?: string; usedIn?: string },
): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    await prisma.mediaAsset.update({ where: { id }, data });
    await logAudit(adminId, "UPDATE", "MediaAsset", id);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update media asset" };
  }
}

export async function deleteMediaAsset(id: string): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });

    if (!asset) {
      return { success: false, error: "Asset not found" };
    }

    const supabase = createServiceClient();
    const deleted = await deleteStorageBackedAsset(supabase, asset, async (assetId) => {
      await prisma.mediaAsset.delete({ where: { id: assetId } });
    });

    if (!deleted.success) {
      return { success: false, error: deleted.error || "Failed to delete file from storage" };
    }

    await logAudit(adminId, "DELETE", "MediaAsset", id);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete media asset" };
  }
}

export async function getSiteSettingsAdmin() {
  await getAdminId();
  const settings = await prisma.siteSetting.findFirst();
  return settings;
}

export async function updateSiteSettings(data: Record<string, unknown>): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    const existing = await prisma.siteSetting.findFirst();

    const payload = {
      organisationName: data.organisationName as string | undefined,
      tagline: data.tagline as string | undefined,
      logoUrl: (data.logoUrl as string) || null,
      faviconUrl: (data.faviconUrl as string) || null,
      generalEmail: (data.generalEmail as string) || null,
      phone: (data.phone as string) || null,
      whatsapp: (data.whatsapp as string) || null,
      address: (data.address as string) || null,
      facebookUrl: (data.facebookUrl as string) || null,
      twitterUrl: (data.twitterUrl as string) || null,
      instagramUrl: (data.instagramUrl as string) || null,
      linkedinUrl: (data.linkedinUrl as string) || null,
      youtubeUrl: (data.youtubeUrl as string) || null,
      defaultSeoTitle: (data.defaultSeoTitle as string) || null,
      defaultSeoDescription: (data.defaultSeoDescription as string) || null,
      googleAnalyticsId: (data.googleAnalyticsId as string) || null,
      contactNotifyEmail: (data.contactNotifyEmail as string) || null,
      joinNotifyEmail: (data.joinNotifyEmail as string) || null,
      newsletterFromName: data.newsletterFromName as string | undefined,
      maintenanceMode: data.maintenanceMode as boolean | undefined,
      footerText: (data.footerText as string) || null,
    };

    if (existing) {
      await prisma.siteSetting.update({ where: { id: existing.id }, data: payload });
      await logAudit(adminId, "UPDATE", "SiteSetting", existing.id);
    } else {
      const created = await prisma.siteSetting.create({
        data: {
          ...payload,
          organisationName: (data.organisationName as string) || "EduLead Network",
          tagline: (data.tagline as string) || "Education for Leadership and Change",
        },
      });
      await logAudit(adminId, "CREATE", "SiteSetting", created.id);
    }

    revalidateSiteWideContent();
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update settings" };
  }
}
