"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// IDs of the landing-page sections we want dwell-time on.
// These already exist in the DOM today (Hero, About, Projects, Contact).
const TRACKED_SECTION_IDS = ["hero-canvas", "about", "work", "contact"];

const VISITOR_ID_KEY = "cv_visitor_id";
const VISIBILITY_THRESHOLD = 0.5; // section counts as "viewed" at 50%+ visible

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = generateUUID();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode, etc.) - fall back to a
    // per-page-load id. Under-counts unique visitors slightly but never breaks.
    return generateUUID();
  }
}

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const visitorId = getVisitorId();

    // 1. Record the page visit once per page load.
    fetch("/api/track/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitor_id: visitorId,
        path: pathname,
        referrer: document.referrer || null,
      }),
      keepalive: true,
    }).catch(() => {
      // Analytics failures should never affect the visitor's experience.
    });

    // 2. Track time-in-view for known landing-page sections, if present.
    const elements = TRACKED_SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) {
      return;
    }

    const accumulatedMs: Record<string, number> = {};
    const enteredAt: Record<string, number> = {};

    const markEnter = (id: string) => {
      enteredAt[id] = performance.now();
    };

    const markExit = (id: string) => {
      const start = enteredAt[id];
      if (start !== undefined) {
        accumulatedMs[id] = (accumulatedMs[id] ?? 0) + (performance.now() - start);
        delete enteredAt[id];
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting && entry.intersectionRatio >= VISIBILITY_THRESHOLD) {
            markEnter(id);
          } else {
            markExit(id);
          }
        }
      },
      { threshold: [VISIBILITY_THRESHOLD] },
    );

    elements.forEach((el) => observer.observe(el));

    const flush = () => {
      // Close out any sections currently in view before sending.
      Object.keys(enteredAt).forEach(markExit);

      const sections = Object.entries(accumulatedMs)
        .filter(([, ms]) => ms > 0)
        .map(([section_id, duration_ms]) => ({ section_id, duration_ms }));

      if (sections.length === 0) return;

      const payload = JSON.stringify({
        visitor_id: visitorId,
        path: pathname,
        sections,
      });

      // sendBeacon survives page unload; fetch does not.
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/track/section", blob);
      } else {
        fetch("/api/track/section", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }

      // Reset so we don't double-count on repeated flushes.
      Object.keys(accumulatedMs).forEach((key) => delete accumulatedMs[key]);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", flush);

    return () => {
      flush();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", flush);
    };
  }, [pathname]);

  return null;
}
