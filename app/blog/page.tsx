import Link from "next/link";
import { Footer } from "@/components/Footer";
import { FloatingGlassNav } from "@/components/FloatingGlassNav";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
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
    <>
      <FloatingGlassNav />
      <main className="min-h-screen pt-24">
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <SectionHeading>Blog</SectionHeading>
              <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                Project write-ups, dev notes, and more...
              </h1>
            </Reveal>

            {publishedPosts.length === 0 ? (
              <p className="mt-12 font-mono text-secondary">
                {"// no posts yet — check back soon"}
              </p>
            ) : (
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {publishedPosts.map((post, index) => (
                  <Reveal key={post.id} delay={index * 0.08}>
                    <Link
                      href={`/blog/${post.slug}/`}
                      className="group block rounded-md border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/60 hover:shadow-glow"
                    >
                      <time
                        dateTime={post.created_at}
                        className="font-mono text-sm text-accent"
                      >
                        {formatDate(post.created_at)}
                      </time>
                      <h2 className="mt-3 text-xl font-bold text-foreground transition-colors group-hover:text-accent-soft">
                        {post.title}
                      </h2>
                      {post.excerpt ? (
                        <p className="mt-3 text-sm leading-relaxed text-secondary">
                          {post.excerpt}
                        </p>
                      ) : null}
                      <span className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-secondary transition-colors group-hover:text-accent">
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
    </>
  );
}
