"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Layers,
  Info,
} from "lucide-react";
import type { RenderItem } from "@/lib/renders-data";

interface RendersLightboxProps {
  item: RenderItem | null;
  items: RenderItem[];
  onClose: () => void;
  onSelect: (item: RenderItem) => void;
}

export function RendersLightbox({
  item,
  items,
  onClose,
  onSelect,
}: RendersLightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;

  const handleNext = useCallback(() => {
    if (currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % items.length;
    setIsZoomed(false);
    onSelect(items[nextIdx]);
  }, [currentIndex, items, onSelect]);

  const handlePrev = useCallback(() => {
    if (currentIndex === -1) return;
    const prevIdx = (currentIndex - 1 + items.length) % items.length;
    setIsZoomed(false);
    onSelect(items[prevIdx]);
  }, [currentIndex, items, onSelect]);

  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "z" || e.key === "Z") {
        setIsZoomed((prev) => !prev);
      } else if (e.key === "i" || e.key === "I") {
        setShowInfo((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, handleNext, handlePrev, onClose]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-8"
        style={{
          backgroundColor: "rgba(8, 9, 12, 0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Top Controls Bar */}
        <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3">
            <span
              className="v2-mono text-xs px-2.5 py-1 rounded-full border"
              style={{
                backgroundColor: "var(--v2-surface)",
                borderColor: "var(--v2-border)",
                color: "var(--v2-text)",
              }}
            >
              {currentIndex + 1} / {items.length}
            </span>
            <span
              className="hidden sm:inline-block text-xs font-medium truncate max-w-[280px]"
              style={{ color: "var(--v2-muted)" }}
            >
              {item.project}
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsZoomed((prev) => !prev)}
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
              className="p-2 rounded-full border transition-colors hover:bg-[var(--v2-elevated)]"
              style={{
                backgroundColor: "var(--v2-surface)",
                borderColor: "var(--v2-border)",
                color: "var(--v2-text)",
              }}
              title="Toggle Zoom (Z)"
            >
              {isZoomed ? (
                <ZoomOut className="h-4 w-4" />
              ) : (
                <ZoomIn className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowInfo((prev) => !prev)}
              aria-label={showInfo ? "Hide details" : "Show details"}
              className="p-2 rounded-full border transition-colors hover:bg-[var(--v2-elevated)]"
              style={{
                backgroundColor: showInfo
                  ? "var(--v2-elevated)"
                  : "var(--v2-surface)",
                borderColor: showInfo
                  ? "var(--v2-accent)"
                  : "var(--v2-border)",
                color: showInfo ? "var(--v2-accent-text)" : "var(--v2-text)",
              }}
              title="Toggle Metadata (I)"
            >
              <Info className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close lightbox"
              className="p-2 rounded-full border transition-colors hover:bg-[var(--v2-elevated)]"
              style={{
                backgroundColor: "var(--v2-surface)",
                borderColor: "var(--v2-border)",
                color: "var(--v2-text)",
              }}
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous image"
          className="absolute left-2 sm:left-4 z-20 p-3 rounded-full border transition-transform active:scale-95 hover:bg-[var(--v2-elevated)]"
          style={{
            backgroundColor: "rgba(21, 23, 28, 0.8)",
            borderColor: "var(--v2-border)",
            color: "var(--v2-text)",
          }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next image"
          className="absolute right-2 sm:right-4 z-20 p-3 rounded-full border transition-transform active:scale-95 hover:bg-[var(--v2-elevated)]"
          style={{
            backgroundColor: "rgba(21, 23, 28, 0.8)",
            borderColor: "var(--v2-border)",
            color: "var(--v2-text)",
          }}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Image Display Area */}
        <div
          className={`relative w-full h-full flex items-center justify-center overflow-auto transition-all ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed((prev) => !prev)}
        >
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: isZoomed ? 1.5 : 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="relative max-w-5xl max-h-[82vh] w-full flex items-center justify-center p-2 select-none"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={1920}
              height={1080}
              className="rounded-[12px] object-contain max-h-[75vh] w-auto shadow-2xl"
              style={{
                border: "1px solid var(--v2-border)",
              }}
              priority
              quality={95}
            />
          </motion.div>
        </div>

        {/* Bottom Metadata Drawer */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 inset-x-4 sm:inset-x-8 max-w-4xl mx-auto rounded-[12px] p-4 sm:p-5 border shadow-2xl z-20"
              style={{
                backgroundColor: "rgba(21, 23, 28, 0.92)",
                backdropFilter: "blur(12px)",
                borderColor: "var(--v2-border)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="v2-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded border"
                      style={{
                        borderColor: "var(--v2-border)",
                        color: "var(--v2-accent-text)",
                        backgroundColor: "var(--v2-bg)",
                      }}
                    >
                      {item.project}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--v2-faint)" }}
                    >
                      •
                    </span>
                    <span
                      className="text-xs capitalize font-medium"
                      style={{ color: "var(--v2-muted)" }}
                    >
                      {item.category.replace("-", " ")}
                    </span>
                  </div>
                  <h3
                    className="text-sm sm:text-base font-semibold tracking-tight"
                    style={{ color: "var(--v2-text)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm leading-relaxed max-w-2xl"
                    style={{ color: "var(--v2-muted)" }}
                  >
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--v2-border)]">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Layers
                      className="h-3.5 w-3.5"
                      style={{ color: "var(--v2-muted)" }}
                    />
                    <span
                      className="v2-mono text-[11px]"
                      style={{ color: "var(--v2-faint)" }}
                    >
                      Stack:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.software.map((tool) => (
                      <span
                        key={tool}
                        className="v2-mono text-[11px] px-2 py-0.5 rounded-full border"
                        style={{
                          borderColor: "var(--v2-border)",
                          backgroundColor: "var(--v2-bg)",
                          color: "var(--v2-text)",
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
