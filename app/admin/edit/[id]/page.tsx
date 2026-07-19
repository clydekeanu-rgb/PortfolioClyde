import Link from "next/link";
import { notFound } from "next/navigation";
import { updatePost } from "@/app/admin/actions";
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
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/"
          className="font-mono text-sm text-secondary transition-colors hover:text-accent"
        >
          {"← Dashboard"}
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-foreground">Edit Post</h1>
        <div className="mt-8">
          <PostForm post={post} action={boundUpdate} />
        </div>
      </div>
    </main>
  );
}
