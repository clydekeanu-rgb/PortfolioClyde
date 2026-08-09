import Link from "next/link";
import { createPost } from "@/app/admin/actions";
import { SitePage } from "@/components/PageBackdrop";
import { PostForm } from "@/components/PostForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Post | Admin",
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
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
          <h1 className="v2-display mt-4 text-3xl">New Post</h1>
          <div className="mt-8">
            <PostForm action={createPost} />
          </div>
        </div>
      </main>
    </SitePage>
  );
}
