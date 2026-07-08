import { adminSupabase } from "@/lib/supabase/admin";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: posts } = await adminSupabase
    .from("posts")
    .select("slug, updated_at")
    .eq("published", true);

  const postUrls = (posts ?? []).map((post) => ({
    url: `https://clydeabenojar.site/blog/${post.slug}/`,
    lastModified: new Date(post.updated_at),
  }));

  return [
    {
      url: "https://clydeabenojar.site/",
      lastModified: new Date(),
    },
    {
      url: "https://clydeabenojar.site/blog/",
      lastModified: new Date(),
    },
    {
      url: "https://clydeabenojar.site/free-tools/",
      lastModified: new Date(),
    },
    {
      url: "https://clydeabenojar.site/free-tools/promptgen/",
      lastModified: new Date(),
    },
    {
      url: "https://clydeabenojar.site/free-tools/blueprintai/",
      lastModified: new Date(),
    },
    {
      url: "https://clydeabenojar.site/free-tools/chargen/",
      lastModified: new Date(),
    },
    {
      url: "https://clydeabenojar.site/song-generator/",
      lastModified: new Date(),
    },
    ...postUrls,
  ];
}
