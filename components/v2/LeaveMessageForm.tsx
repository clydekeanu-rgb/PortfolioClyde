"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type Status = "idle" | "pending" | "success" | "error";

export function LeaveMessageForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("pending");
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "message",
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });

      if (res.status === 204) {
        setStatus("success");
        form.reset();
        return;
      }

      const json = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!res.ok) {
        setStatus("error");
        setError(
          json?.error ||
            (res.status === 502
              ? "Server could not reach the lead service. Please try again in a minute."
              : "Something went wrong. Please try again."),
        );
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border px-5 py-8 text-left" style={{ borderColor: "var(--v2-border)", background: "rgba(14,15,18,0.72)" }}>
        <p className="v2-eyebrow" style={{ color: "var(--v2-accent-text)" }}>
          Message sent
        </p>
        <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--v2-muted)" }}>
          Thanks — I&apos;ll read it and reply soon.
        </p>
        <button
          type="button"
          className="v2-btn v2-btn-outline mt-6 px-4 py-2 text-sm"
          onClick={() => setStatus("idle")}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="text-left" noValidate>
      <p className="v2-eyebrow" style={{ color: "var(--v2-accent-text)" }}>
        Leave a message
      </p>
      <h3 className="v2-display mt-2 text-xl sm:text-2xl">Tell me what you need</h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--v2-muted)" }}>
        Brief note is fine. I&apos;ll follow up by email.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <label className="sr-only" htmlFor="message-name">
          Name
        </label>
        <input
          id="message-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Name"
          className="site-input"
          disabled={status === "pending"}
        />

        <label className="sr-only" htmlFor="message-email">
          Email
        </label>
        <input
          id="message-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          className="site-input"
          disabled={status === "pending"}
        />

        <label className="sr-only" htmlFor="message-body">
          Message
        </label>
        <textarea
          id="message-body"
          name="message"
          required
          rows={5}
          placeholder="What are you trying to ship?"
          className="site-input min-h-[8rem] resize-y"
          disabled={status === "pending"}
        />

        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="message-website">Company website</label>
          <input
            id="message-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm" style={{ color: "#f87171" }} role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="v2-btn v2-btn-primary mt-5 w-full px-5 py-3 text-sm sm:w-auto"
        disabled={status === "pending"}
      >
        {status === "pending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
