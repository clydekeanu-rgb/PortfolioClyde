import { NextResponse, type NextRequest } from "next/server";
import { validateLeadPayload } from "@/lib/lead";

type UpstreamResult = {
  ok: boolean;
  status: number;
  text: string;
};

/**
 * Apps Script web apps usually 302 once (sometimes more). Following redirects
 * automatically converts POST → GET, so doPost never runs. Keep POSTing to
 * each Location until we get a non-redirect response.
 */
async function postToAppsScript(
  webhookUrl: string,
  payload: unknown,
): Promise<UpstreamResult> {
  const body = JSON.stringify(payload);
  // text/plain avoids some preflight/proxy quirks; Apps Script still gives us contents
  const headers = { "Content-Type": "text/plain;charset=utf-8" };
  let url = webhookUrl.trim();

  for (let hop = 0; hop < 6; hop++) {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
      redirect: "manual",
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
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

    if (!upstream.ok || !appsScriptAccepted(upstream.text)) {
      console.error("[lead] webhook failed", {
        status: upstream.status,
        body: upstream.text.slice(0, 400),
      });
      return NextResponse.json(
        {
          error:
            "Could not save to the sheet. Check Apps Script deployment and SPREADSHEET_ID.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[lead] unexpected error", error);
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}
