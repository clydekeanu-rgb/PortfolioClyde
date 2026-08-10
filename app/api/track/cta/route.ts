import { NextResponse, type NextRequest } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";

const BOT_UA_PATTERNS = [
  "bot",
  "crawl",
  "spider",
  "slurp",
  "headless",
  "facebookexternalhit",
];

function looksLikeBot(userAgent: string) {
  const ua = userAgent.toLowerCase();
  return BOT_UA_PATTERNS.some((pattern) => ua.includes(pattern));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitor_id, event_name, path, target, meta } = body ?? {};

    if (
      typeof visitor_id !== "string" ||
      typeof event_name !== "string" ||
      typeof path !== "string" ||
      typeof target !== "string"
    ) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") ?? "";
    if (looksLikeBot(userAgent)) {
      return NextResponse.json({ skipped: true });
    }

    const { error } = await adminSupabase.from("cta_events").insert({
      visitor_id: visitor_id.slice(0, 64),
      event_name: event_name.slice(0, 120),
      path: path.slice(0, 512),
      target: target.slice(0, 512),
      meta:
        meta && typeof meta === "object" && !Array.isArray(meta) ? meta : null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
