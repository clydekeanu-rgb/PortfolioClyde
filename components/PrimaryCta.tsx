"use client";

import { MagneticButton } from "@/components/v2/MagneticButton";
import {
  PRIMARY_CTA_LABEL,
  primaryCtaHref,
} from "@/lib/contact";
import { trackCta } from "@/lib/analytics/track-cta";
import { cn } from "@/lib/utils";

type PrimaryCtaProps = {
  className?: string;
  label?: string;
  href?: string;
  project?: string;
  service?: string;
  /** Use outline style instead of primary fill. */
  variant?: "primary" | "outline" | "text";
  /** Skip magnetic hover (e.g. dense nav). */
  magnetic?: boolean;
  source?: string;
  children?: React.ReactNode;
};

export function PrimaryCta({
  className,
  label = PRIMARY_CTA_LABEL,
  href,
  project,
  service,
  variant = "primary",
  magnetic = true,
  source = "primary_cta",
  children,
}: PrimaryCtaProps) {
  const resolvedHref = href ?? primaryCtaHref({ project, service });
  const content = children ?? label;

  const onClick = () => {
    trackCta("cta_click", resolvedHref, {
      source,
      project: project ?? null,
      service: service ?? null,
      label: typeof content === "string" ? content : label,
    });
  };

  const variantClass =
    variant === "outline"
      ? "v2-btn v2-btn-outline"
      : variant === "text"
        ? "v2-mono text-sm transition-colors hover:text-[var(--v2-text)]"
        : "v2-btn v2-btn-primary";

  if (magnetic && variant !== "text") {
    return (
      <MagneticButton
        href={resolvedHref}
        className={cn(variantClass, className)}
        onClick={onClick}
      >
        {content}
      </MagneticButton>
    );
  }

  return (
    <a
      href={resolvedHref}
      className={cn(variantClass, className)}
      onClick={onClick}
      style={
        variant === "text" ? { color: "var(--v2-accent-text)" } : undefined
      }
    >
      {content}
    </a>
  );
}
