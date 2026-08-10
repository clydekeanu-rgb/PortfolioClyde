"use client";

import { useEffect, useState } from "react";
import { getCaseStudy } from "@/lib/case-studies";
import { getServicePage } from "@/lib/service-pages";

export type ContactContext = {
  project?: string;
  service?: string;
  note: string;
};

function buildPrefillNote(project?: string | null, service?: string | null) {
  const study = project ? getCaseStudy(project) : undefined;
  const svc = service ? getServicePage(service) : undefined;

  if (study) {
    return `Interested in something like ${study.title}.`;
  }
  if (svc) {
    return `Interested in ${svc.title}.`;
  }
  return "";
}

/** Read `?project=` / `?service=` from the homepage URL for contact forms. */
export function useContactContext(): ContactContext {
  const [ctx, setCtx] = useState<ContactContext>({ note: "" });

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const project = params.get("project")?.trim() || undefined;
      const service = params.get("service")?.trim() || undefined;
      setCtx({
        project,
        service,
        note: buildPrefillNote(project, service),
      });
    } catch {
      setCtx({ note: "" });
    }
  }, []);

  return ctx;
}
