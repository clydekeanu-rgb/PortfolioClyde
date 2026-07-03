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
    const { visitor_id, path, referrer } = body ?? {};

    if (typeof visitor_id !== "string" || typeof path !== "string") {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") ?? "";

    if (looksLikeBot(userAgent)) {
      return NextResponse.json({ skipped: true });
    }

    const { error } = await adminSupabase.from("page_visits").insert({
      visitor_id: visitor_id.slice(0, 64),
      path: path.slice(0, 512),
      referrer: typeof referrer === "string" ? referrer.slice(0, 512) : null,
      user_agent: userAgent.slice(0, 512),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
