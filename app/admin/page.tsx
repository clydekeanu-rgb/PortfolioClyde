import Link from "next/link";
import {
  approveComment,
  deleteComment,
  deletePost,
  togglePublish,
} from "@/app/admin/actions";
import { LogoutButton } from "@/components/LogoutButton";
import { adminSupabase } from "@/lib/supabase/admin";
import { getAnalyticsStats } from "@/lib/analytics/get-stats";
import type { CommentWithPost, Post } from "@/lib/types/blog";

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

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
  const stats = await getAnalyticsStats();

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-accent">Admin /&gt;</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">Dashboard</h1>
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
          <h2 className="font-mono text-lg font-semibold text-foreground">
            Analytics{" "}
            <span className="text-sm font-normal text-secondary">
              (last 30 days)
            </span>
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-md border border-border bg-surface p-4">
              <p className="font-mono text-xs text-secondary">Page Visits</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {stats.totalVisits}
              </p>
            </div>
            <div className="rounded-md border border-border bg-surface p-4">
              <p className="font-mono text-xs text-secondary">
                Unique Visitors
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {stats.uniqueVisitors}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="font-mono text-sm font-semibold text-secondary">
                Top Pages
              </h3>
              {stats.topPages.length === 0 ? (
                <p className="mt-3 text-sm text-secondary">No data yet.</p>
              ) : (
                <div className="mt-3 overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-surface">
                      <tr>
                        <th className="px-4 py-2 font-mono text-secondary">
                          Page
                        </th>
                        <th className="px-4 py-2 font-mono text-secondary">
                          Visits
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topPages.map((page) => (
                        <tr key={page.path} className="border-b border-border/70">
                          <td className="px-4 py-2 font-mono text-foreground">
                            {page.path}
                          </td>
                          <td className="px-4 py-2 text-secondary">
                            {page.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-mono text-sm font-semibold text-secondary">
                Time Spent per Landing Section
              </h3>
              {stats.sectionStats.length === 0 ? (
                <p className="mt-3 text-sm text-secondary">No data yet.</p>
              ) : (
                <div className="mt-3 overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-surface">
                      <tr>
                        <th className="px-4 py-2 font-mono text-secondary">
                          Section
                        </th>
                        <th className="px-4 py-2 font-mono text-secondary">
                          Avg. Time
                        </th>
                        <th className="px-4 py-2 font-mono text-secondary">
                          Views
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.sectionStats.map((section) => (
                        <tr
                          key={section.sectionId}
                          className="border-b border-border/70"
                        >
                          <td className="px-4 py-2 font-medium text-foreground">
                            {section.label}
                          </td>
                          <td className="px-4 py-2 text-secondary">
                            {section.avgSeconds}s
                          </td>
                          <td className="px-4 py-2 text-secondary">
                            {section.views}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {stats.recentVisits.length > 0 ? (
            <div className="mt-6">
              <h3 className="font-mono text-sm font-semibold text-secondary">
                Recent Visits
              </h3>
              <div className="mt-3 overflow-x-auto rounded-md border border-border">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="border-b border-border bg-surface">
                    <tr>
                      <th className="px-4 py-2 font-mono text-secondary">
                        Page
                      </th>
                      <th className="px-4 py-2 font-mono text-secondary">
                        When
                      </th>
                      <th className="px-4 py-2 font-mono text-secondary">
                        Referrer
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentVisits.map((visit, i) => (
                      <tr key={i} className="border-b border-border/70">
                        <td className="px-4 py-2 font-mono text-foreground">
                          {visit.path}
                        </td>
                        <td className="px-4 py-2 text-secondary">
                          {formatDateTime(visit.created_at)}
                        </td>
                        <td className="px-4 py-2 text-secondary">
                          {visit.referrer ?? "direct"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>

        <section className="mt-12">
          <h2 className="font-mono text-lg font-semibold text-foreground">Posts</h2>

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
                      <td className="px-4 py-3 font-medium text-foreground">
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
          <h2 className="font-mono text-lg font-semibold text-foreground">
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
                      <p className="mt-3 text-sm text-foreground">{comment.body}</p>
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
