"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, Layers } from "lucide-react";
import {
  RENDER_CATEGORIES,
  RENDERS_DATA,
  type RenderCategory,
  type RenderItem,
} from "@/lib/renders-data";
import { RendersLightbox } from "./RendersLightbox";

export function RendersGallery() {
  const [activeCategory, setActiveCategory] = useState<RenderCategory>("all");
  const [selectedItem, setSelectedItem] = useState<RenderItem | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return RENDERS_DATA;
    return RENDERS_DATA.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div id="gallery" className="scroll-mt-24">
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar">
        {RENDER_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count =
            cat.id === "all"
              ? RENDERS_DATA.length
              : RENDERS_DATA.filter((i) => i.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                isActive
                  ? "text-white"
                  : "text-[var(--v2-muted)] hover:text-[var(--v2-text)] hover:bg-[var(--v2-surface)]"
              }`}
              style={{
                border: isActive
                  ? "1px solid var(--v2-accent)"
                  : "1px solid var(--v2-border)",
                backgroundColor: isActive
                  ? "var(--v2-accent)"
                  : "var(--v2-bg)",
              }}
            >
              <span>{cat.label}</span>
              <span
                className={`ml-2 text-xs v2-mono ${
                  isActive ? "text-white/80" : "text-[var(--v2-faint)]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Renders Grid */}
      <motion.div
        layout
        className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const isFeatured = item.featured && activeCategory === "all";

            return (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className={`group relative flex flex-col rounded-[12px] overflow-hidden border transition-all duration-200 hover:border-[var(--v2-accent)] ${
                  isFeatured ? "md:col-span-2 lg:col-span-2" : "col-span-1"
                }`}
                style={{
                  backgroundColor: "var(--v2-surface)",
                  borderColor: "var(--v2-border)",
                }}
              >
                {/* Image Container */}
                <div
                  className="relative w-full overflow-hidden cursor-pointer bg-[var(--v2-bg)]"
                  style={{
                    aspectRatio: isFeatured ? "16/9" : "16/10",
                  }}
                  onClick={() => setSelectedItem(item)}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={
                      isFeatured
                        ? "(max-width: 768px) 100vw, 80vw"
                        : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    }
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    quality={90}
                  />

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md"
                      style={{
                        backgroundColor: "rgba(21, 23, 28, 0.85)",
                        border: "1px solid var(--v2-border)",
                      }}
                    >
                      <Maximize2 className="h-3.5 w-3.5 text-[var(--v2-accent-text)]" />
                      Inspect High Res
                    </span>
                  </div>

                  {/* Project Tag Pill */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span
                      className="v2-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md"
                      style={{
                        backgroundColor: "rgba(14, 15, 18, 0.85)",
                        borderColor: "var(--v2-border)",
                        color: "var(--v2-text)",
                      }}
                    >
                      {item.project}
                    </span>
                  </div>
                </div>

                {/* Card Content Footer */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <h3
                      className="text-sm sm:text-base font-semibold tracking-tight transition-colors group-hover:text-[var(--v2-accent-text)]"
                      style={{ color: "var(--v2-text)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mt-1 text-xs leading-relaxed line-clamp-2"
                      style={{ color: "var(--v2-muted)" }}
                    >
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between gap-2"
                    style={{ borderColor: "var(--v2-border)" }}
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Layers className="h-3 w-3 text-[var(--v2-faint)]" />
                      {item.software.map((tool) => (
                        <span
                          key={tool}
                          className="v2-mono text-[10px] px-2 py-0.5 rounded border"
                          style={{
                            borderColor: "var(--v2-border)",
                            backgroundColor: "var(--v2-bg)",
                            color: "var(--v2-faint)",
                          }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      aria-label={`View ${item.title}`}
                      className="text-xs font-medium shrink-0 transition-colors hover:text-[var(--v2-text)]"
                      style={{ color: "var(--v2-accent-text)" }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Component */}
      <RendersLightbox
        item={selectedItem}
        items={filteredItems}
        onClose={() => setSelectedItem(null)}
        onSelect={(item) => setSelectedItem(item)}
      />
    </div>
  );
}
