import Link from "next/link";
import {
  approveComment,
  deleteComment,
  deletePost,
  togglePublish,
} from "@/app/admin/actions";
import { LogoutButton } from "@/components/LogoutButton";
import { adminSupabase } from "@/lib/supabase/admin";
import type { CommentWithPost, Post } from "@/lib/types/blog";

type AdminPageProps = {
  searchParams: { success?: string };
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { data: posts } = await adminSupabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: pendingComments } = await adminSupabase
    .from("comments")
    .select("*, posts(title, slug)")
    .eq("approved", false)
    .order("created_at", { ascending: false });

  const allPosts = (posts ?? []) as Post[];
  const comments = (pendingComments ?? []) as CommentWithPost[];

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-accent">Admin /&gt;</p>
            <h1 className="mt-1 text-3xl font-bold text-primary">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/new/"
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-background transition-shadow hover:shadow-glow"
            >
              New Post
            </Link>
            <LogoutButton />
          </div>
        </div>

        {searchParams.success === "saved" ? (
          <p className="mt-6 rounded-md border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent-soft">
            Post saved successfully.
          </p>
        ) : null}

        <section className="mt-10">
          <h2 className="font-mono text-lg font-semibold text-primary">Posts</h2>

          {allPosts.length === 0 ? (
            <p className="mt-4 text-sm text-secondary">
              No posts yet. Create your first one.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-border bg-surface">
                  <tr>
                    <th className="px-4 py-3 font-mono text-secondary">Title</th>
                    <th className="px-4 py-3 font-mono text-secondary">Status</th>
                    <th className="px-4 py-3 font-mono text-secondary">Date</th>
                    <th className="px-4 py-3 font-mono text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allPosts.map((post) => (
                    <tr key={post.id} className="border-b border-border/70">
                      <td className="px-4 py-3 font-medium text-primary">
                        {post.title}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-mono ${
                            post.published
                              ? "bg-accent/20 text-accent-soft"
                              : "bg-border text-secondary"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-secondary">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/edit/${post.id}/`}
                            className="rounded border border-border px-2 py-1 text-xs text-secondary transition-colors hover:text-accent"
                          >
                            Edit
                          </Link>
                          <form action={deletePost.bind(null, post.id)}>
                            <button
                              type="submit"
                              className="rounded border border-border px-2 py-1 text-xs text-secondary transition-colors hover:text-syntax-keyword"
                            >
                              Delete
                            </button>
                          </form>
                          <form
                            action={togglePublish.bind(null, post.id, post.published)}
                          >
                            <button
                              type="submit"
                              className="rounded border border-border px-2 py-1 text-xs text-secondary transition-colors hover:text-accent"
                            >
                              {post.published ? "Unpublish" : "Publish"}
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-mono text-lg font-semibold text-primary">
            Pending Comments
          </h2>

          {comments.length === 0 ? (
            <p className="mt-4 text-sm text-secondary">No pending comments.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="rounded-md border border-border bg-surface p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-semibold text-accent-soft">
                        {comment.name}
                      </p>
                      <p className="mt-1 text-xs text-secondary">
                        on{" "}
                        {comment.posts ? (
                          <Link
                            href={`/blog/${comment.posts.slug}/`}
                            className="text-accent hover:underline"
                          >
                            {comment.posts.title}
                          </Link>
                        ) : (
                          "Unknown post"
                        )}
                      </p>
                      <p className="mt-3 text-sm text-primary">{comment.body}</p>
                    </div>
                    <div className="flex gap-2">
                      <form action={approveComment.bind(null, comment.id)}>
                        <button
                          type="submit"
                          className="rounded border border-accent/40 px-3 py-1 text-xs text-accent transition-colors hover:bg-accent/10"
                        >
                          Approve
                        </button>
                      </form>
                      <form action={deleteComment.bind(null, comment.id)}>
                        <button
                          type="submit"
                          className="rounded border border-border px-3 py-1 text-xs text-secondary transition-colors hover:text-syntax-keyword"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
