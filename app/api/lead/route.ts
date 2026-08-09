import { NextResponse, type NextRequest } from "next/server";
import { validateLeadPayload } from "@/lib/lead";
import { adminSupabase } from "@/lib/supabase/admin";

type UpstreamResult = {
  ok: boolean;
  status: number;
  text: string;
};

/**
 * Apps Script web apps usually 302. Auto-follow turns POST into GET.
 * Re-POST to each Location. Never throw — callers must stay online.
 */
async function postToAppsScript(
  webhookUrl: string,
  payload: unknown,
): Promise<UpstreamResult> {
  try {
    const body = JSON.stringify(payload);
    const headers = { "Content-Type": "text/plain;charset=utf-8" };
    let url = webhookUrl.trim();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    try {
      for (let hop = 0; hop < 5; hop++) {
        const res = await fetch(url, {
          method: "POST",
          headers,
          body,
          redirect: "manual",
          signal: controller.signal,
        });

        if (res.status >= 300 && res.status < 400) {
          const location =
            res.headers.get("location") ?? res.headers.get("Location");
          if (!location) {
            return {
              ok: false,
              status: res.status,
              text: `Redirect ${res.status} without Location`,
            };
          }
          url = new URL(location, url).toString();
          continue;
        }

        const text = await res.text().catch(() => "");
        return { ok: res.ok, status: res.status, text };
      }

      return { ok: false, status: 310, text: "Too many Apps Script redirects" };
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, status: 500, text: message };
  }
}

function appsScriptAccepted(text: string) {
  try {
    const parsed = JSON.parse(text) as { ok?: boolean };
    return parsed?.ok === true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = validateLeadPayload(body);

    if (!result.ok) {
      const status = result.error === "Rejected." ? 204 : 400;
      if (status === 204) {
        return new NextResponse(null, { status: 204 });
      }
      return NextResponse.json({ error: result.error }, { status });
    }

    const userAgent = request.headers.get("user-agent") ?? "";
    const payload = {
      timestamp: new Date().toISOString(),
      type: result.data.type,
      name: result.data.name,
      email: result.data.email,
      message: result.data.message ?? "",
      preferred_date: result.data.preferredDate ?? "",
      preferred_time: result.data.preferredTime ?? "",
      timezone: result.data.timezone ?? "",
      user_agent: userAgent.slice(0, 512),
    };

    // Primary store: Supabase (reliable on Vercel). Sheets is best-effort.
    const { error: dbError } = await adminSupabase.from("leads").insert({
      type: payload.type,
      name: payload.name,
      email: payload.email,
      message: payload.message || null,
      preferred_date: payload.preferred_date || null,
      preferred_time: payload.preferred_time || null,
      timezone: payload.timezone || null,
      user_agent: payload.user_agent || null,
    });

    if (dbError) {
      console.error("[lead] supabase insert failed", dbError.message);
      return NextResponse.json(
        {
          error:
            "Could not save your message. If this keeps happening, the leads table may be missing — see docs/supabase-leads.sql.",
        },
        { status: 500 },
      );
    }

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
    if (webhookUrl) {
      const upstream = await postToAppsScript(webhookUrl, payload);
      if (!upstream.ok || !appsScriptAccepted(upstream.text)) {
        console.error("[lead] sheets sync failed (lead still saved)", {
          status: upstream.status,
          body: upstream.text.slice(0, 400),
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[lead] unexpected error", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 400 },
    );
  }
}
