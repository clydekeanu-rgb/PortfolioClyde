import { NextResponse, type NextRequest } from "next/server";
import { validateLeadPayload } from "@/lib/lead";

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

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
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

    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Could not save your message. Try again shortly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}
