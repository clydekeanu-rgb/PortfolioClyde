import Link from "next/link";
import { notFound } from "next/navigation";
import { updatePost } from "@/app/admin/actions";
import { SitePage } from "@/components/PageBackdrop";
import { PostForm } from "@/components/PostForm";
import { adminSupabase } from "@/lib/supabase/admin";
import type { Post } from "@/lib/types/blog";
import type { Metadata } from "next";

type EditPostPageProps = {
  params: { id: string };
};

export const metadata: Metadata = {
  title: "Edit Post | Admin",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { data } = await adminSupabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single();

  const post = data as Post | null;

  if (!post) {
    notFound();
  }

  const boundUpdate = updatePost.bind(null, post.id);

  return (
    <SitePage variant="admin">
      <main className="min-h-[100dvh] px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/admin/"
            className="v2-mono text-sm transition-colors hover:text-[var(--v2-text)]"
            style={{ color: "var(--v2-muted)" }}
          >
            {"← Dashboard"}
          </Link>
          <h1 className="v2-display mt-4 text-3xl">Edit Post</h1>
          <div className="mt-8">
            <PostForm post={post} action={boundUpdate} />
          </div>
        </div>
      </main>
    </SitePage>
  );
}
