"use client";

import { SectionHeading } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type SectionHeadingCompatProps = {
  children: string;
  center?: boolean;
};

/** @deprecated Prefer importing SectionHeading from Reveal or using SitePageHeader. */
export function SectionHeadingCompat({
  children,
  center = false,
}: SectionHeadingCompatProps) {
  return <SectionHeading center={center}>{children}</SectionHeading>;
}

export { SectionHeading };

type SitePageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
};

export function SitePageHeader({
  eyebrow,
  title,
  description,
  center = false,
  className,
}: SitePageHeaderProps) {
  return (
    <div className={cn(center && "text-center", className)}>
      <SectionHeading center={center}>{eyebrow}</SectionHeading>
      <h1
        className={cn(
          "v2-display mt-4 text-[clamp(2rem,4vw,3rem)]",
          center && "mx-auto",
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed sm:text-lg",
            center && "mx-auto",
          )}
          style={{ color: "var(--v2-muted)" }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
