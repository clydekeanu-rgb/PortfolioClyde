"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import { slugify } from "@/lib/utils/slug";
import type { Post } from "@/lib/types/blog";

type PostFormProps = {
  post?: Post;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
};

export function PostForm({ post, action }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(post?.slug));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("excerpt", excerpt);
    formData.set("content", content);
    formData.set("published", published ? "true" : "false");

    const result = await action(formData);

    if (result.success) {
      router.push("/admin/?success=saved");
      router.refresh();
    } else {
      setError(result.error ?? "Something went wrong.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="mb-2 block text-sm text-secondary">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          className="w-full rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-2 block text-sm text-secondary">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={(event) => {
            setSlugEdited(true);
            setSlug(event.target.value);
          }}
          className="w-full rounded-md border border-border bg-surface px-4 py-2 font-mono text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-2 block text-sm text-secondary">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          className="w-full rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-secondary">Content</label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      <label className="flex items-center gap-3 text-sm text-foreground">
        <input
          type="checkbox"
          checked={published}
          onChange={(event) => setPublished(event.target.checked)}
          className="h-4 w-4 rounded border-border bg-surface accent-accent"
        />
        Published
      </label>

      {error ? <p className="text-sm text-syntax-keyword">{error}</p> : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-background transition-shadow hover:shadow-glow disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : post ? "Update post" : "Create post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/")}
          className="rounded-md border border-border px-5 py-2 text-sm text-secondary transition-colors hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
