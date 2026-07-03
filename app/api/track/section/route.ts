import { NextResponse, type NextRequest } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";

type SectionEntry = {
  section_id: string;
  duration_ms: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitor_id, path, sections } = body ?? {};

    if (
      typeof visitor_id !== "string" ||
      typeof path !== "string" ||
      !Array.isArray(sections)
    ) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }

    const rows = (sections as SectionEntry[])
      .filter(
        (s) =>
          s &&
          typeof s.section_id === "string" &&
          typeof s.duration_ms === "number" &&
          s.duration_ms > 250 && // ignore accidental flicker/scroll-through
          s.duration_ms < 30 * 60 * 1000, // sanity cap: 30 min
      )
      .slice(0, 20)
      .map((s) => ({
        visitor_id: visitor_id.slice(0, 64),
        path: path.slice(0, 512),
        section_id: s.section_id.slice(0, 64),
        duration_ms: Math.round(s.duration_ms),
      }));

    if (rows.length === 0) {
      return NextResponse.json({ ok: true, inserted: 0 });
    }

    const { error } = await adminSupabase.from("section_views").insert(rows);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, inserted: rows.length });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
