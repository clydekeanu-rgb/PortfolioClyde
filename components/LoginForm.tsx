"use client";

import { sendMagicLink } from "@/app/admin/actions";
import { useState } from "react";

export function LoginForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    const formData = new FormData(event.currentTarget);
    const result = await sendMagicLink(formData);

    if (result.success) {
      setMessage("Check your email for a login link.");
    } else {
      setError(result.error ?? "Something went wrong.");
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-secondary">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
          placeholder="clyde@clydeabenojar.site"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-accent px-5 py-2 text-sm font-semibold text-background transition-shadow hover:shadow-glow disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send magic link"}
      </button>

      {message ? <p className="text-sm text-accent-soft">{message}</p> : null}
      {error ? <p className="text-sm text-syntax-keyword">{error}</p> : null}
    </form>
  );
}
