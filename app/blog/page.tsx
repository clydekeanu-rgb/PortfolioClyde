import Link from "next/link";
import { Footer } from "@/components/Footer";
import { SitePage } from "@/components/PageBackdrop";
import { Reveal } from "@/components/Reveal";
import { SitePageHeader } from "@/components/SectionHeading";
import { adminSupabase } from "@/lib/supabase/admin";
import type { Post } from "@/lib/types/blog";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Clyde Abenojar",
  description:
    "Project write-ups, development notes, and insights from Clyde Abenojar.",
  openGraph: {
    title: "Blog | Clyde Abenojar",
    description:
      "Project write-ups, development notes, and insights from Clyde Abenojar.",
    url: "https://clydeabenojar.site/blog/",
  },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const { data: posts } = await adminSupabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const publishedPosts = (posts ?? []) as Post[];

  return (
    <SitePage variant="blog">
      <main className="min-h-[100dvh] pt-24">
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <SitePageHeader
                eyebrow="Blog"
                title="Project write-ups, dev notes, and more."
              />
            </Reveal>

            {publishedPosts.length === 0 ? (
              <p className="v2-mono mt-12" style={{ color: "var(--v2-muted)" }}>
                {"// no posts yet. check back soon"}
              </p>
            ) : (
              <div className="mt-14 grid gap-6 sm:grid-cols-2">
                {publishedPosts.map((post, index) => (
                  <Reveal key={post.id} delay={index * 0.06}>
                    <Link
                      href={`/blog/${post.slug}/`}
                      className="v2-card group block p-6 transition-colors duration-200 hover:border-[var(--v2-accent)]/40"
                    >
                      <time
                        dateTime={post.created_at}
                        className="v2-mono text-sm"
                        style={{ color: "var(--v2-accent-text)" }}
                      >
                        {formatDate(post.created_at)}
                      </time>
                      <h2 className="v2-display mt-3 text-xl">
                        {post.title}
                      </h2>
                      {post.excerpt ? (
                        <p
                          className="mt-3 text-sm leading-relaxed"
                          style={{ color: "var(--v2-muted)" }}
                        >
                          {post.excerpt}
                        </p>
                      ) : null}
                      <span
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium"
                        style={{ color: "var(--v2-accent-text)" }}
                      >
                        Read more <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </SitePage>
  );
}
