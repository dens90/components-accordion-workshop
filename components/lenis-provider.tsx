/**
 * Funzionalità: smooth scroll globale; espone `window.lenis` per scroll ancorato (vedi `lib/scroll-to-section`).
 */
"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect, type ReactNode } from "react";
import { releaseBodyScrollLock } from "@/lib/body-scroll-lock";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) releaseBodyScrollLock();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.08,
      smoothWheel: true,
    });

    window.lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return children;
}
