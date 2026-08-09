import { NextResponse, type NextRequest } from "next/server";
import { validateLeadPayload } from "@/lib/lead";

/**
 * Google Apps Script web apps respond to POST with a 302 to
 * script.googleusercontent.com. Fetch with redirect:"follow" turns that
 * into a GET, so doPost never runs and the sheet stays empty while the
 * caller still sees HTTP 200. Re-POST to the redirect location instead.
 */
async function postToAppsScript(webhookUrl: string, payload: unknown) {
  const body = JSON.stringify(payload);
  const headers = { "Content-Type": "text/plain;charset=utf-8" };

  const first = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body,
    redirect: "manual",
  });

  if (first.status >= 300 && first.status < 400) {
    const location = first.headers.get("location");
    if (!location) {
      return first;
    }
    return fetch(location, {
      method: "POST",
      headers,
      body,
      redirect: "follow",
    });
  }

  return first;
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

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Lead capture is not configured yet." },
        { status: 503 },
      );
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

    const upstream = await postToAppsScript(webhookUrl, payload);
    const upstreamText = await upstream.text().catch(() => "");

    if (!upstream.ok) {
      console.error("[lead] webhook failed", upstream.status, upstreamText.slice(0, 300));
      return NextResponse.json(
        { error: "Could not save your message. Try again shortly." },
        { status: 502 },
      );
    }

    // Apps Script may return { ok: false } with HTTP 200
    try {
      const parsed = JSON.parse(upstreamText) as { ok?: boolean };
      if (parsed && parsed.ok === false) {
        console.error("[lead] webhook reported failure", upstreamText.slice(0, 300));
        return NextResponse.json(
          { error: "Could not save your message. Try again shortly." },
          { status: 502 },
        );
      }
    } catch {
      // Non-JSON success bodies from Apps Script are still treated as ok
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[lead] unexpected error", error);
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}
