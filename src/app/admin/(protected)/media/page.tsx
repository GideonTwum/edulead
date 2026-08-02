import { PageHeader } from "@/components/admin/PageHeader";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { getMediaAssets } from "@/lib/actions/admin/settings";

export default async function AdminMediaPage() {
  const assets = await getMediaAssets();
  return (
    <div>
      <PageHeader title="Media Library" description="Upload and manage images and documents" />
      <MediaLibrary assets={assets} />
    </div>
  );
}
