"use client";

import { useState } from "react";
import { submitComment } from "@/app/blog/actions";

type CommentFormProps = {
  postId: string;
};

export function CommentForm({ postId }: CommentFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    const formData = new FormData(event.currentTarget);
    formData.set("postId", postId);

    const result = await submitComment(formData);

    if (result.success) {
      setStatus("success");
      event.currentTarget.reset();
    } else {
      setStatus("error");
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <h3 className="font-mono text-lg font-semibold text-foreground">Leave a comment</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-secondary">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-secondary">
            Email (not displayed publicly)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="body" className="mb-2 block text-sm text-secondary">
          Comment
        </label>
        <textarea
          id="body"
          name="body"
          rows={4}
          required
          className="w-full rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-background transition-shadow hover:shadow-glow disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit comment"}
      </button>

      {status === "success" ? (
        <p className="text-sm text-accent-soft">
          Your comment is awaiting moderation.
        </p>
      ) : null}

      {status === "error" ? (
        <p className="text-sm text-syntax-keyword">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </form>
  );
}
