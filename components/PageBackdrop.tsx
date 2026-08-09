"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const SideRays = dynamic(() => import("@/components/ui/SideRays"), {
  ssr: false,
});
const Galaxy = dynamic(() => import("@/components/ui/Galaxy"), { ssr: false });
const LiquidChrome = dynamic(() => import("@/components/ui/LiquidChrome"), {
  ssr: false,
});
const GradientBlinds = dynamic(
  () => import("@/components/ui/GradientBlinds"),
  { ssr: false },
);

export type PageBackdropVariant =
  | "none"
  | "work"
  | "blog"
  | "tools"
  | "admin"
  | "contact";

const LIQUID_BASE: [number, number, number] = [0.05, 0.06, 0.12];

type PageBackdropProps = {
  variant?: PageBackdropVariant;
  className?: string;
};

export function PageBackdrop({
  variant = "none",
  className,
}: PageBackdropProps) {
  const reduceMotion = useReducedMotion();

  if (variant === "none" || reduceMotion) {
    return (
      <div className={cn("site-backdrop", className)} aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 0%, rgba(67,83,255,0.12), transparent 55%)",
          }}
        />
        <div className="site-backdrop-scrim" />
      </div>
    );
  }

  return (
    <div className={cn("site-backdrop", className)} aria-hidden="true">
      <div className="absolute inset-0 opacity-70">
        {variant === "work" ? (
          <SideRays
            speed={1.6}
            rayColor1="#4353ff"
            rayColor2="#96c8ff"
            intensity={1.2}
            spread={1.6}
            origin="top-right"
            saturation={1.1}
            blend={0.7}
            falloff={1.8}
            opacity={0.85}
          />
        ) : null}
        {variant === "blog" ? (
          <Galaxy
            mouseRepulsion={false}
            mouseInteraction={false}
            density={1.2}
            glowIntensity={0.35}
            saturation={0.55}
            hueShift={230}
            transparent
            speed={0.7}
          />
        ) : null}
        {variant === "tools" ? (
          <GradientBlinds
            gradientColors={["#4353ff", "#5b69ff"]}
            angle={28}
            noise={0.2}
            blindCount={14}
            blindMinWidth={70}
            mouseDampening={0.2}
            spotlightRadius={0.45}
            spotlightSoftness={1}
            spotlightOpacity={0.7}
            distortAmount={0}
            shineDirection="left"
          />
        ) : null}
        {variant === "admin" || variant === "contact" ? (
          <LiquidChrome
            baseColor={LIQUID_BASE}
            speed={0.25}
            amplitude={0.28}
            frequencyX={2.2}
            frequencyY={1.6}
            interactive={false}
          />
        ) : null}
      </div>
      <div className="site-backdrop-scrim" />
    </div>
  );
}

type SitePageProps = {
  children: React.ReactNode;
  variant?: PageBackdropVariant;
  className?: string;
  contentClassName?: string;
};

export function SitePage({
  children,
  variant = "none",
  className,
  contentClassName,
}: SitePageProps) {
  return (
    <div className={cn("site-page", className)}>
      <PageBackdrop variant={variant} />
      <div className={cn("site-page-content", contentClassName)}>{children}</div>
    </div>
  );
}
