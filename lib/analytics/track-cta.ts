"use client";

const VISITOR_ID_KEY = "cv_visitor_id";

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export type CtaMeta = Record<string, string | number | boolean | null | undefined>;

/** Fire-and-forget CTA click / conversion event. Never throws. */
export function trackCta(
  eventName: string,
  target: string,
  meta?: CtaMeta,
) {
  try {
    const payload = JSON.stringify({
      visitor_id: getVisitorId(),
      event_name: eventName.slice(0, 120),
      path: typeof window !== "undefined" ? window.location.pathname : "/",
      target: target.slice(0, 512),
      meta: meta ?? null,
    });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/track/cta", blob);
      return;
    }

    fetch("/api/track/cta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics must never affect UX.
  }
}
