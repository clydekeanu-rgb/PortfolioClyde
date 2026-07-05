"use client";

import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

type DotWaveInstance = {
  destroy: () => void;
};

type DotWaveConstructor = new (options: Record<string, unknown>) => DotWaveInstance;

type SiteBackgroundProps = {
  children: ReactNode;
};

export function SiteBackground({ children }: SiteBackgroundProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isAdmin = pathname.startsWith("/admin");
  const dotWaveRef = useRef<DotWaveInstance | null>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const tryInit = () => {
      scriptLoadedRef.current = true;
    };

    const existingScript = document.querySelector(
      'script[src="/libs/dotwave.min.js"]',
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if ((window as Window & { DotWave?: DotWaveConstructor }).DotWave) {
        tryInit();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "/libs/dotwave.min.js";
    script.async = true;
    script.onload = tryInit;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      dotWaveRef.current?.destroy();
      dotWaveRef.current = null;
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced || reduceMotion) {
      dotWaveRef.current?.destroy();
      dotWaveRef.current = null;
      return;
    }

    const destroyDotWave = () => {
      dotWaveRef.current?.destroy();
      dotWaveRef.current = null;
    };

    const initDotWave = () => {
      const DotWave = (window as Window & { DotWave?: DotWaveConstructor })
        .DotWave;
      const container = document.getElementById("global-dot-wave");

      if (!DotWave || !container) {
        return;
      }

      dotWaveRef.current = new DotWave({
        container,
        numDots: 320,
        dotColor: "#7C3AED",
        backgroundColor: "transparent",
        dotMinOpacity: 0.15,
        dotMaxOpacity: 0.5,
        influenceRadius: 180,
        dotStretch: true,
        zIndex: 0,
      });
    };

    destroyDotWave();

    if ((window as Window & { DotWave?: DotWaveConstructor }).DotWave) {
      initDotWave();
      return;
    }

    let intervalId: number | null = null;
    const timeoutId = window.setTimeout(() => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }, 3000);

    intervalId = window.setInterval(() => {
      if ((window as Window & { DotWave?: DotWaveConstructor }).DotWave) {
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
        clearTimeout(timeoutId);
        initDotWave();
      }
    }, 50);

    return () => {
      destroyDotWave();
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
      clearTimeout(timeoutId);
    };
  }, [pathname, isAdmin, reduceMotion]);

  if (isAdmin) {
    return children;
  }

  return (
    <div id="global-dot-wave" className="relative min-h-screen">
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
