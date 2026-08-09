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
        <label
          htmlFor="email"
          className="mb-2 block text-sm"
          style={{ color: "var(--v2-muted)" }}
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="site-input"
          placeholder="clyde@clydeabenojar.site"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="v2-btn v2-btn-primary w-full px-5 py-2 text-sm disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send magic link"}
      </button>

      {message ? (
        <p className="text-sm" style={{ color: "var(--v2-accent-text)" }}>
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm" style={{ color: "var(--color-error)" }}>
          {error}
        </p>
      ) : null}
    </form>
  );
}
