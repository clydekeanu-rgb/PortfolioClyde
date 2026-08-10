import { adminSupabase } from "@/lib/supabase/admin";

export type AnalyticsStats = {
  totalVisits: number;
  uniqueVisitors: number;
  topPages: { path: string; count: number }[];
  sectionStats: {
    sectionId: string;
    label: string;
    avgSeconds: number;
    views: number;
  }[];
  recentVisits: { path: string; created_at: string; referrer: string | null }[];
  topCtaEvents: { eventName: string; count: number }[];
  ctaByPath: { path: string; count: number }[];
  ctaByProject: { project: string; count: number }[];
};

const SECTION_LABELS: Record<string, string> = {
  "hero-canvas": "Hero",
  about: "About",
  work: "Projects",
  contact: "Contact",
};

const WINDOW_DAYS = 30;
const ROW_LIMIT = 5000;

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const since = new Date();
  since.setDate(since.getDate() - WINDOW_DAYS);
  const sinceIso = since.toISOString();

  const [{ data: visits }, { data: sections }, { data: ctas }] =
    await Promise.all([
      adminSupabase
        .from("page_visits")
        .select("path, visitor_id, referrer, created_at")
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: false })
        .limit(ROW_LIMIT),
      adminSupabase
        .from("section_views")
        .select("section_id, duration_ms")
        .gte("created_at", sinceIso)
        .limit(ROW_LIMIT),
      adminSupabase
        .from("cta_events")
        .select("event_name, path, meta, created_at")
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: false })
        .limit(ROW_LIMIT),
    ]);

  const visitRows = visits ?? [];
  const totalVisits = visitRows.length;
  const uniqueVisitors = new Set(visitRows.map((r) => r.visitor_id)).size;

  const pageCounts = new Map<string, number>();
  visitRows.forEach((r) => {
    pageCounts.set(r.path, (pageCounts.get(r.path) ?? 0) + 1);
  });
  const topPages = Array.from(pageCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const sectionRows = sections ?? [];
  const sectionAgg = new Map<string, { total: number; count: number }>();
  sectionRows.forEach((s) => {
    const entry = sectionAgg.get(s.section_id) ?? { total: 0, count: 0 };
    entry.total += s.duration_ms;
    entry.count += 1;
    sectionAgg.set(s.section_id, entry);
  });
  const sectionStats = Array.from(sectionAgg.entries())
    .map(([sectionId, { total, count }]) => ({
      sectionId,
      label: SECTION_LABELS[sectionId] ?? sectionId,
      avgSeconds: Math.round(total / count / 100) / 10,
      views: count,
    }))
    .sort((a, b) => b.views - a.views);

  const recentVisits = visitRows.slice(0, 20).map((r) => ({
    path: r.path,
    created_at: r.created_at,
    referrer: r.referrer,
  }));

  const ctaRows = ctas ?? [];
  const eventCounts = new Map<string, number>();
  const pathCounts = new Map<string, number>();
  const projectCounts = new Map<string, number>();

  ctaRows.forEach((row) => {
    eventCounts.set(
      row.event_name,
      (eventCounts.get(row.event_name) ?? 0) + 1,
    );
    pathCounts.set(row.path, (pathCounts.get(row.path) ?? 0) + 1);
    const meta = row.meta as { project?: string } | null;
    if (meta?.project && typeof meta.project === "string") {
      projectCounts.set(
        meta.project,
        (projectCounts.get(meta.project) ?? 0) + 1,
      );
    }
  });

  const topCtaEvents = Array.from(eventCounts.entries())
    .map(([eventName, count]) => ({ eventName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const ctaByPath = Array.from(pathCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const ctaByProject = Array.from(projectCounts.entries())
    .map(([project, count]) => ({ project, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalVisits,
    uniqueVisitors,
    topPages,
    sectionStats,
    recentVisits,
    topCtaEvents,
    ctaByPath,
    ctaByProject,
  };
}
