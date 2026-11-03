"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Sunset, Moon, Sparkles, Layers } from "lucide-react";

type TimeSlot = "day" | "golden" | "sunset" | "night";

interface TimePreset {
  id: TimeSlot;
  label: string;
  icon: typeof Sun;
  image: string;
  lightingNotes: string;
  renderEngine: string;
  timeTag: string;
}

const TIME_PRESETS: TimePreset[] = [
  {
    id: "day",
    label: "Daylight",
    icon: Sun,
    image: "/renders/villa-day-angle.png",
    lightingNotes: "Direct 5400K sun angle with crisp cantilever shadow drops and glass reflections.",
    renderEngine: "SketchUp + Enscape + Photoshop",
    timeTag: "12:00 PM Daylight",
  },
  {
    id: "golden",
    label: "Golden Hour",
    icon: Sparkles,
    image: "/renders/villa-golden-hour.png",
    lightingNotes: "Warm 3200K low-angle sunlight hitting upper timber louvers and entrance portal.",
    renderEngine: "SketchUp + V-Ray + Photoshop",
    timeTag: "05:30 PM Golden Hour",
  },
  {
    id: "sunset",
    label: "Sunset Wide",
    icon: Sunset,
    image: "/renders/villa-sunset-wide.png",
    lightingNotes: "Rich twilight sky gradient balancing interior ambient glow and perimeter lighting.",
    renderEngine: "SketchUp + Enscape + Photoshop",
    timeTag: "06:15 PM Sunset",
  },
  {
    id: "night",
    label: "Night Illumination",
    icon: Moon,
    image: "/renders/villa-night.png",
    lightingNotes: "Architectural 2700K warm LED soffits, pathway markers, and sheer curtain diffusion.",
    renderEngine: "SketchUp + V-Ray + Photoshop",
    timeTag: "08:30 PM Night Lighting",
  },
];

export function TimeOfDayViewer() {
  const [activeSlot, setActiveSlot] = useState<TimeSlot>("day");

  const currentPreset =
    TIME_PRESETS.find((p) => p.id === activeSlot) ?? TIME_PRESETS[0];

  return (
    <div
      className="rounded-[12px] border overflow-hidden p-4 sm:p-6 mb-12"
      style={{
        backgroundColor: "var(--v2-surface)",
        borderColor: "var(--v2-border)",
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b"
        style={{ borderColor: "var(--v2-border)" }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className="v2-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded border"
              style={{
                borderColor: "var(--v2-border)",
                color: "var(--v2-accent-text)",
                backgroundColor: "var(--v2-bg)",
              }}
            >
              Interactive Rig
            </span>
            <span className="text-xs" style={{ color: "var(--v2-faint)" }}>
              •
            </span>
            <span className="text-xs font-medium" style={{ color: "var(--v2-muted)" }}>
              Villa Horizon Facade
            </span>
          </div>
          <h2
            className="text-base sm:text-lg font-semibold tracking-tight mt-1"
            style={{ color: "var(--v2-text)" }}
          >
            Time of Day Lighting Study
          </h2>
        </div>

        {/* Time Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {TIME_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isActive = activeSlot === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setActiveSlot(preset.id)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-[var(--v2-muted)] hover:text-[var(--v2-text)] hover:bg-[var(--v2-elevated)]"
                }`}
                style={{
                  backgroundColor: isActive
                    ? "var(--v2-accent)"
                    : "var(--v2-bg)",
                  border: isActive
                    ? "1px solid var(--v2-accent)"
                    : "1px solid var(--v2-border)",
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Image Viewer */}
      <div className="relative mt-5 aspect-[16/9] w-full rounded-[10px] overflow-hidden bg-[var(--v2-bg)] border border-[var(--v2-border)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPreset.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full h-full"
          >
            <Image
              src={currentPreset.image}
              alt={currentPreset.label}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
              quality={95}
            />

            {/* Time Stamp Badge */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <span
                className="v2-mono text-xs px-3 py-1.5 rounded-full border shadow-md backdrop-blur-md"
                style={{
                  backgroundColor: "rgba(14, 15, 18, 0.85)",
                  borderColor: "var(--v2-border)",
                  color: "var(--v2-text)",
                }}
              >
                {currentPreset.timeTag}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Technical Notes Footer */}
      <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        style={{ color: "var(--v2-muted)" }}
      >
        <p className="leading-relaxed">
          <span className="font-medium text-[var(--v2-text)]">Lighting setup: </span>
          {currentPreset.lightingNotes}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <Layers className="h-3.5 w-3.5 text-[var(--v2-faint)]" />
          <span className="v2-mono text-[11px]" style={{ color: "var(--v2-faint)" }}>
            {currentPreset.renderEngine}
          </span>
        </div>
      </div>
    </div>
  );
}
