"use client";

import { useEffect, type RefObject } from "react";

/**
 * Funzionalità: reveal on scroll via CSS (no GSAP) — evita conflitti con Lenis durante smooth scroll.
 * Selettore: `[data-reveal]`; opzioni `data-reveal-y`, `data-reveal-d` (numeri, fallback se non validi).
 */
export function useScrollReveal(
  rootRef: RefObject<HTMLElement | null>,
  prefersReducedMotion: boolean
) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!rootRef.current) return;

    const root = rootRef.current;
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (prefersReducedMotion) {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.classList.contains("is-revealed")) return;

          const yRaw = el.dataset.revealY ? Number(el.dataset.revealY) : 28;
          const dRaw = el.dataset.revealD ? Number(el.dataset.revealD) : 0.8;
          const y = Number.isFinite(yRaw) ? yRaw : 28;
          const d = Number.isFinite(dRaw) ? dRaw : 0.8;
          el.style.setProperty("--reveal-y", `${y}px`);
          el.style.setProperty("--reveal-duration", `${d}s`);

          requestAnimationFrame(() => {
            el.classList.add("is-revealed");
          });
          observer.unobserve(el);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [rootRef, prefersReducedMotion]);
}
