"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { DISCOVERY_TIME_OPTIONS } from "@/lib/lead";

type Status = "idle" | "pending" | "success" | "error";

function todayIsoDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DiscoveryCallForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const minDate = useMemo(() => todayIsoDate(), []);
  const timezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
      return "UTC";
    }
  }, []);

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
          type: "discovery",
          name: data.get("name"),
          email: data.get("email"),
          preferredDate: data.get("preferredDate"),
          preferredTime: data.get("preferredTime"),
          timezone: data.get("timezone"),
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
        setError(json?.error ?? "Something went wrong. Please try again.");
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
      <div
        className="rounded-xl border px-5 py-8 text-left"
        style={{
          borderColor: "var(--v2-border)",
          background: "rgba(14,15,18,0.72)",
        }}
      >
        <p className="v2-eyebrow" style={{ color: "var(--v2-accent-text)" }}>
          Request received
        </p>
        <p
          className="mt-3 text-base leading-relaxed"
          style={{ color: "var(--v2-muted)" }}
        >
          Thanks — I&apos;ll confirm a discovery call time by email.
        </p>
        <button
          type="button"
          className="v2-btn v2-btn-outline mt-6 px-4 py-2 text-sm"
          onClick={() => setStatus("idle")}
        >
          Book another slot
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="text-left" noValidate>
      <p className="v2-eyebrow" style={{ color: "var(--v2-accent-text)" }}>
        Discovery call
      </p>
      <h3 className="v2-display mt-2 text-xl sm:text-2xl">
        Book a discovery call
      </h3>
      <p
        className="mt-2 text-sm leading-relaxed"
        style={{ color: "var(--v2-muted)" }}
      >
        Pick a preferred time. I&apos;ll confirm availability from there.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <label className="sr-only" htmlFor="discovery-name">
          Name
        </label>
        <input
          id="discovery-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Name"
          className="site-input"
          disabled={status === "pending"}
        />

        <label className="sr-only" htmlFor="discovery-email">
          Email
        </label>
        <input
          id="discovery-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          className="site-input"
          disabled={status === "pending"}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              className="mb-1.5 block text-xs"
              style={{ color: "var(--v2-muted)" }}
              htmlFor="discovery-date"
            >
              Preferred date
            </label>
            <input
              id="discovery-date"
              name="preferredDate"
              type="date"
              required
              min={minDate}
              className="site-input"
              disabled={status === "pending"}
            />
          </div>
          <div>
            <label
              className="mb-1.5 block text-xs"
              style={{ color: "var(--v2-muted)" }}
              htmlFor="discovery-time"
            >
              Preferred time
            </label>
            <select
              id="discovery-time"
              name="preferredTime"
              required
              className="site-input"
              defaultValue=""
              disabled={status === "pending"}
            >
              <option value="" disabled>
                Select a time
              </option>
              {DISCOVERY_TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <input type="hidden" name="timezone" value={timezone} />
        <p className="v2-mono text-xs" style={{ color: "var(--v2-faint)" }}>
          Times shown in your timezone: {timezone}
        </p>

        <label className="sr-only" htmlFor="discovery-note">
          Project note
        </label>
        <textarea
          id="discovery-note"
          name="message"
          rows={3}
          placeholder="Optional: what should we cover on the call?"
          className="site-input min-h-[5rem] resize-y"
          disabled={status === "pending"}
        />

        <div
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor="discovery-website">Company website</label>
          <input
            id="discovery-website"
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
        {status === "pending" ? "Sending…" : "Request discovery call"}
      </button>
    </form>
  );
}
