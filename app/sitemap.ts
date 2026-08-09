import { caseStudies } from "@/lib/case-studies";
import { servicePages } from "@/lib/service-pages";
import { adminSupabase } from "@/lib/supabase/admin";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const SITE = "https://clydeabenojar.site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: posts } = await adminSupabase
    .from("posts")
    .select("slug, updated_at")
    .eq("published", true);

  const postUrls = (posts ?? []).map((post) => ({
    url: `${SITE}/blog/${post.slug}/`,
    lastModified: new Date(post.updated_at),
  }));

  const workUrls = caseStudies.map((study) => ({
    url: `${SITE}/work/${study.slug}/`,
    lastModified: new Date(),
  }));

  const serviceUrls = servicePages.map((page) => ({
    url: `${SITE}/services/${page.slug}/`,
    lastModified: new Date(),
  }));

  return [
    {
      url: `${SITE}/`,
      lastModified: new Date(),
    },
    {
      url: `${SITE}/work/`,
      lastModified: new Date(),
    },
    ...workUrls,
    {
      url: `${SITE}/services/`,
      lastModified: new Date(),
    },
    ...serviceUrls,
    {
      url: `${SITE}/blog/`,
      lastModified: new Date(),
    },
    {
      url: `${SITE}/free-tools/`,
      lastModified: new Date(),
    },
    {
      url: `${SITE}/free-tools/promptgen/`,
      lastModified: new Date(),
    },
    {
      url: `${SITE}/free-tools/blueprintai/`,
      lastModified: new Date(),
    },
    {
      url: `${SITE}/free-tools/chargen/`,
      lastModified: new Date(),
    },
    {
      url: `${SITE}/song-generator/`,
      lastModified: new Date(),
    },
    ...postUrls,
  ];
}
