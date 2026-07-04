"use client";

import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type DotWaveInstance = {
  destroy: () => void;
};

type DotWaveConstructor = new (options: Record<string, unknown>) => DotWaveInstance;

export function SiteBackground() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced || reduceMotion) {
      return;
    }

    let dotWaveInstance: DotWaveInstance | null = null;
    let script: HTMLScriptElement | null = null;

    const initDotWave = () => {
      const DotWave = (window as Window & { DotWave?: DotWaveConstructor })
        .DotWave;
      const container = document.getElementById("global-dot-wave");

      if (!DotWave || !container || container.querySelector("canvas")) {
        return;
      }

      dotWaveInstance = new DotWave({
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

    const existingScript = document.querySelector(
      'script[src="/libs/dotwave.min.js"]',
    );

    if (
      existingScript &&
      (window as Window & { DotWave?: DotWaveConstructor }).DotWave
    ) {
      initDotWave();
    } else {
      script = document.createElement("script");
      script.src = "/libs/dotwave.min.js";
      script.async = true;
      script.onload = initDotWave;
      document.body.appendChild(script);
    }

    return () => {
      dotWaveInstance?.destroy();
      if (script?.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isAdmin, reduceMotion]);

  if (isAdmin) {
    return null;
  }

  return (
    <div
      id="global-dot-wave"
      className="pointer-events-none fixed inset-0 z-[-1]"
    />
  );
}
