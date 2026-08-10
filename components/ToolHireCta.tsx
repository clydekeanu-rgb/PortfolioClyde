"use client";

import { PrimaryCta } from "@/components/PrimaryCta";

type ToolHireCtaProps = {
  audience: string;
  hireLine: string;
  toolSlug: string;
};

export function ToolHireCta({ audience, hireLine, toolSlug }: ToolHireCtaProps) {
  return (
    <aside
      className="mt-16 rounded-xl border px-6 py-8 sm:px-8"
      style={{
        borderColor: "var(--v2-border)",
        background: "var(--v2-surface)",
      }}
    >
      <p className="v2-eyebrow" style={{ color: "var(--v2-accent-text)" }}>
        Who it&apos;s for
      </p>
      <p
        className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base"
        style={{ color: "var(--v2-muted)" }}
      >
        {audience}
      </p>
      <h2 className="v2-display mt-6 text-xl sm:text-2xl">{hireLine}</h2>
      <p
        className="mt-3 max-w-xl text-sm leading-relaxed"
        style={{ color: "var(--v2-muted)" }}
      >
        I build guided tools, wizards, and product features like this into real
        apps — with your branding, data, and workflow.
      </p>
      <div className="mt-6">
        <PrimaryCta
          className="px-5 py-3 text-sm"
          source={`tool_${toolSlug}`}
        />
      </div>
    </aside>
  );
}
