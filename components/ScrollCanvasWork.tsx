"use client";

import NextImage from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  WORK_CARDS,
  WORK_FRAME_COUNT,
  WORK_TEXT_FADE_END,
  workFramePath,
} from "@/lib/scroll-work";

export function ScrollCanvasWork() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const telemetryRef = useRef<HTMLSpanElement | null>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const prevVisibleIdsRef = useRef("");

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= WORK_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = workFramePath(i);
      const bump = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / WORK_FRAME_COUNT);
        if (loadedCount === WORK_FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      img.onload = bump;
      img.onerror = bump;
      imgs.push(img);
    }
    framesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let drawW: number;
    let drawH: number;
    if (canvasRatio > imgRatio) {
      drawW = cw;
      drawH = cw / imgRatio;
    } else {
      drawH = ch;
      drawW = ch * imgRatio;
    }

    if (window.innerWidth <= 768) {
      drawW *= 1.3;
      drawH *= 1.3;
    }

    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    drawFrame(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);
    lastFrameRef.current = 0;
  }, [loaded, drawFrame]);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const section = sectionRef.current;
        if (!section || !loadedRef.current) return;

        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const progress =
          scrollable <= 0
            ? 0
            : Math.min(1, Math.max(0, -rect.top / scrollable));

        const frameIndex = Math.min(
          WORK_FRAME_COUNT - 1,
          Math.floor(progress * WORK_FRAME_COUNT),
        );
        if (frameIndex !== lastFrameRef.current) {
          lastFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }

        if (introRef.current) {
          const opacity = Math.max(0, 1 - progress / WORK_TEXT_FADE_END);
          introRef.current.style.opacity = String(opacity);
          introRef.current.style.transform = `translateY(${(1 - opacity) * 12}px)`;
        }

        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${progress})`;
        }

        if (telemetryRef.current) {
          const projects = WORK_CARDS.filter((card) => card.id !== "see-more");
          const seeMore = WORK_CARDS.find((card) => card.id === "see-more");
          if (seeMore && progress >= seeMore.show) {
            telemetryRef.current.textContent = "MORE";
          } else {
            const idx = Math.min(
              projects.length,
              Math.max(1, Math.ceil(progress * projects.length)),
            );
            telemetryRef.current.textContent = `${String(idx).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
          }
        }

        const newVisible = new Set<string>();
        for (const card of WORK_CARDS) {
          if (progress >= card.show && progress <= card.hide) {
            newVisible.add(card.id);
          }
        }
        const newIds = [...newVisible].sort().join(",");
        if (newIds !== prevVisibleIdsRef.current) {
          prevVisibleIdsRef.current = newIds;
          setVisibleCards(newVisible);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [drawFrame]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="scroll-animation relative"
    >
      <div
        className="sentry-stage sticky top-0 min-h-[100dvh] w-full overflow-hidden bg-background"
        style={{
          height: "100dvh",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 h-full w-full"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
        />

        <div className="sentry-vignette pointer-events-none absolute inset-0 z-[2]" />

        <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center px-6">
          {WORK_CARDS.filter((card) => card.image).map((card) => {
            const visible = visibleCards.has(card.id);
            return (
              <div
                key={`img-${card.id}`}
                className={`absolute transition-all duration-[500ms] ease-out ${
                  visible
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-3 scale-[0.97] opacity-0"
                }`}
                aria-hidden={!visible}
              >
                <div className="sentry-frame relative flex h-[min(52vh,420px)] w-[min(72vw,640px)] items-center justify-center overflow-hidden md:h-[min(58vh,520px)] md:w-[min(48vw,720px)]">
                  <NextImage
                    src={card.image!}
                    alt={card.name}
                    fill
                    sizes="(max-width: 768px) 72vw, 48vw"
                    className="object-contain p-1"
                    priority={card.id === "w0"}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 70%, rgba(21,15,35,0.45) 100%)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div
          ref={introRef}
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-5 px-6 pb-24 md:px-12 md:pb-28"
          style={{ transition: "opacity 80ms linear, transform 80ms linear" }}
        >
          <p className="sentry-eyebrow">Work // Selected</p>
          <h2 className="sentry-display max-w-[16ch] text-5xl leading-[1.1] text-primary md:text-7xl lg:text-[88px] lg:leading-[1.2]">
            A few things
            <br />
            <span className="sentry-lime-chip">I&apos;ve built.</span>
          </h2>
          <p className="sentry-body max-w-[42ch]">
            Scroll through the case studies — end-to-end products, shipped.
          </p>
        </div>

        {WORK_CARDS.map((card) => {
          const visible = visibleCards.has(card.id);
          return (
            <div
              key={`name-${card.id}`}
              className={`pointer-events-none absolute left-6 z-10 max-w-[90%] top-20 md:bottom-28 md:top-auto md:left-12 md:max-w-[min(34%,20rem)] ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{
                transition: "opacity 400ms ease-out, transform 400ms ease-out",
              }}
              aria-hidden={!visible}
            >
              <h3 className="sentry-display leading-[1.1] text-primary text-[calc(3rem-10px)] font-medium md:text-[calc(4.5rem-10px)] lg:text-[calc(60px-10px)]">
                {card.name}
              </h3>
            </div>
          );
        })}

        <div className="pointer-events-none absolute right-6 top-20 z-10 flex items-center gap-3 md:right-10 md:top-24">
          <span className="sentry-micro text-secondary">Project</span>
          <span ref={telemetryRef} className="sentry-micro text-accent">
            01 / 07
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="sentry-progress-track mx-6 mb-3 h-px md:mx-10">
            <div
              ref={progressFillRef}
              className="h-full origin-left bg-accent"
              style={{
                transform: "scaleX(0)",
                transition: "transform 80ms linear",
              }}
            />
          </div>
          <div className="mx-6 flex justify-between pb-4 sentry-micro text-secondary md:mx-10">
            <span>SEQ WORK / {WORK_FRAME_COUNT}</span>
            <span>Scroll ↓</span>
          </div>
        </div>

        {WORK_CARDS.map((card, index) => {
          const visible = visibleCards.has(card.id);
          const position =
            index % 3 === 0
              ? "top-[22%] right-6 md:right-12"
              : index % 3 === 1
                ? "top-1/2 -translate-y-1/2 right-6 md:right-12"
                : "bottom-24 right-6 md:bottom-28 md:right-12";

          return (
            <div
              key={card.id}
              className={`pointer-events-none absolute ${position} z-20 w-[min(420px,90vw)]`}
            >
              <Link
                href={card.href}
                className={`card-surface block pointer-events-auto p-6 transition-all duration-[400ms] ease-out ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-5 opacity-0"
                }`}
              >
                <p className="sentry-micro text-accent">{card.number}</p>
                <p className="sentry-card-body mt-3 md:text-lg">
                  {card.description}
                </p>
                <p className="mt-4 sentry-micro text-accent">
                  {card.cta ?? "view case study →"}
                </p>
              </Link>
            </div>
          );
        })}

        {!loaded ? (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-background px-6">
            <p className="sentry-micro text-secondary">
              Loading work &nbsp;·&nbsp; {Math.round(loadProgress * 100)}%
            </p>
            <div className="sentry-progress-track h-px w-60 md:w-80">
              <div
                className="h-full bg-accent transition-[width] duration-150 ease-out"
                style={{ width: `${Math.round(loadProgress * 100)}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
