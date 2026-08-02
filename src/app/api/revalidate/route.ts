import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const { paths, tags } = await request.json();

    if (Array.isArray(tags)) {
      tags.forEach((tag: string) => revalidateTag(tag));
    }

    if (Array.isArray(paths)) {
      paths.forEach((path: string) => revalidatePath(path));
    } else {
      revalidatePath("/", "layout");
    }

    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
