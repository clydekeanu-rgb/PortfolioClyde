import Link from "next/link";
import { createPost } from "@/app/admin/actions";
import { PostForm } from "@/components/PostForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Post | Admin",
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/"
          className="font-mono text-sm text-secondary transition-colors hover:text-accent"
        >
          {"← Dashboard"}
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-foreground">New Post</h1>
        <div className="mt-8">
          <PostForm action={createPost} />
        </div>
      </div>
    </main>
  );
}
