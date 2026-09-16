import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CBD_CACHE_TAGS } from "@/lib/champions-battle/client";

/**
 * On-demand cache bust for Champions Battle Data.
 * GET /api/champions/revalidate?tag=cbd-battle&secret=...
 * Without tag, refreshes index + battle + daily tags.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const expected = process.env.CBD_REVALIDATE_SECRET;
  if (expected && secret !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const tag = url.searchParams.get("tag");
  const tags = tag
    ? [tag]
    : [
        CBD_CACHE_TAGS.index,
        CBD_CACHE_TAGS.battle,
        CBD_CACHE_TAGS.daily,
        CBD_CACHE_TAGS.board,
      ];

  for (const t of tags) {
    revalidateTag(t, "max");
  }

  return NextResponse.json({ ok: true, revalidated: tags, at: Date.now() });
}
