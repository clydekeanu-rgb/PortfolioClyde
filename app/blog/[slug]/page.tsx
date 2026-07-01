import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/CommentForm";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { adminSupabase } from "@/lib/supabase/admin";
import type { Comment, Post } from "@/lib/types/blog";
import type { Metadata } from "next";

type BlogPostPageProps = {
  params: { slug: string };
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function getPost(slug: string) {
  const { data } = await adminSupabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  return data as Post | null;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return { title: "Post not found | Clyde Abenojar" };
  }

  return {
    title: `${post.title} | Clyde Abenojar`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `https://clydeabenojar.site/blog/${params.slug}/`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const { data: comments } = await adminSupabase
    .from("comments")
    .select("*")
    .eq("post_id", post.id)
    .eq("approved", true)
    .order("created_at", { ascending: true });

  const approvedComments = (comments ?? []) as Comment[];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <article className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            <Link
              href="/blog/"
              className="font-mono text-sm text-secondary transition-colors hover:text-accent"
            >
              {"← Blog"}
            </Link>

            <header className="mt-8">
              <time
                dateTime={post.created_at}
                className="font-mono text-sm text-accent"
              >
                {formatDate(post.created_at)}
              </time>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
            </header>

            <div
              className="blog-prose mt-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <hr className="mt-12 border-border" />

            <section className="mt-12">
              <h2 className="font-mono text-xl font-semibold text-primary">
                Comments
              </h2>

              {approvedComments.length === 0 ? (
                <p className="mt-4 text-sm text-secondary">
                  No comments yet. Be the first to share your thoughts.
                </p>
              ) : (
                <ul className="mt-6 space-y-6">
                  {approvedComments.map((comment) => (
                    <li
                      key={comment.id}
                      className="rounded-md border border-border bg-surface p-4"
                    >
                      <p className="font-mono text-sm font-semibold text-accent-soft">
                        {comment.name}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-secondary">
                        {comment.body}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <CommentForm postId={post.id} />
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
