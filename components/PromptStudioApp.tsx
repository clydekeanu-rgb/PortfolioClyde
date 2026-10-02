"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Camera, Building2, User, Sparkles } from "lucide-react";
import { PromptGenApp } from "@/components/PromptGenApp";
import { BlueprintAIApp } from "@/components/BlueprintAIApp";
import { CharGenApp } from "@/components/CharGenApp";

export type PromptStudioMode = "product" | "architecture" | "character";

interface PromptStudioAppProps {
  initialMode?: PromptStudioMode;
}

const MODES = [
  {
    id: "product" as PromptStudioMode,
    title: "Product Photography",
    badge: "PromptGen",
    icon: Camera,
    description: "Studio lighting, presentation styles, angles, textures, and JSON spec generator.",
  },
  {
    id: "architecture" as PromptStudioMode,
    title: "Architecture & Renders",
    badge: "BlueprintAI",
    icon: Building2,
    description: "Building types, architectural styles, camera heights, weather, and realistic elevations.",
  },
  {
    id: "character" as PromptStudioMode,
    title: "Realistic Characters",
    badge: "CharGen",
    icon: User,
    description: "Character poses, attire, candid environments, local realism, and natural expressions.",
  },
];

function PromptStudioContent({ initialMode = "product" }: PromptStudioAppProps) {
  const searchParams = useSearchParams();
  const [activeMode, setActiveMode] = useState<PromptStudioMode>(initialMode);

  useEffect(() => {
    const modeParam = searchParams.get("mode")?.toLowerCase();
    if (modeParam === "architecture" || modeParam === "blueprintai") {
      setActiveMode("architecture");
    } else if (modeParam === "character" || modeParam === "chargen") {
      setActiveMode("character");
    } else if (modeParam === "product" || modeParam === "promptgen") {
      setActiveMode("product");
    }
  }, [searchParams]);

  const handleModeChange = (mode: PromptStudioMode) => {
    setActiveMode(mode);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("mode", mode);
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <div className="w-full">
      {/* Studio Header & Mode Switcher */}
      <div className="mb-10 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs v2-mono mb-4 border"
          style={{
            borderColor: "var(--v2-border)",
            background: "var(--v2-surface)",
            color: "var(--v2-accent-text)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Universal AI Prompt Builder</span>
        </div>

        <h1 className="v2-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--v2-text)]">
          AI Prompt Studio
        </h1>
        <p
          className="mt-3 text-base sm:text-lg max-w-2xl mx-auto"
          style={{ color: "var(--v2-muted)" }}
        >
          Build structured, photorealistic image prompts for Midjourney, Imagen, and FLUX.
          Choose a generator below to begin.
        </p>

        {/* Tab Selector */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl mx-auto text-left">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeChange(mode.id)}
                className="group relative flex flex-col p-4 rounded-xl border text-left transition-all duration-200 active:scale-[0.98]"
                style={{
                  borderColor: isActive
                    ? "var(--v2-accent)"
                    : "var(--v2-border)",
                  background: isActive
                    ? "var(--v2-elevated)"
                    : "var(--v2-surface)",
                }}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors"
                    style={{
                      borderColor: isActive
                        ? "var(--v2-accent)"
                        : "var(--v2-border)",
                      background: isActive
                        ? "var(--v2-accent)"
                        : "var(--v2-elevated)",
                      color: isActive
                        ? "var(--v2-accent-ink)"
                        : "var(--v2-muted)",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span
                    className="v2-mono text-[11px] px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: isActive
                        ? "var(--v2-accent)"
                        : "var(--v2-border)",
                      color: isActive
                        ? "var(--v2-accent-text)"
                        : "var(--v2-faint)",
                    }}
                  >
                    {mode.badge}
                  </span>
                </div>

                <div className="font-medium text-sm text-[var(--v2-text)]">
                  {mode.title}
                </div>
                <div
                  className="mt-1 text-xs line-clamp-2 leading-relaxed"
                  style={{ color: "var(--v2-muted)" }}
                >
                  {mode.description}
                </div>

                {isActive && (
                  <div
                    className="absolute -bottom-px left-4 right-4 h-0.5 rounded-full"
                    style={{ background: "var(--v2-accent)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Wizard */}
      <div className="w-full">
        {activeMode === "product" && <PromptGenApp />}
        {activeMode === "architecture" && <BlueprintAIApp />}
        {activeMode === "character" && <CharGenApp />}
      </div>
    </div>
  );
}

export function PromptStudioApp(props: PromptStudioAppProps) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center v2-mono text-sm" style={{ color: "var(--v2-muted)" }}>
          Loading Prompt Studio...
        </div>
      }
    >
      <PromptStudioContent {...props} />
    </Suspense>
  );
}
