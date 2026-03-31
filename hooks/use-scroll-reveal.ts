"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

export function useScrollReveal(
  rootRef: RefObject<HTMLElement | null>,
  prefersReducedMotion: boolean
) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!rootRef.current) return;
    if (prefersReducedMotion) return;

    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const targets = Array.from(
        root.querySelectorAll<HTMLElement>("[data-reveal]")
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            if (el.dataset.revealed === "true") return;
            el.dataset.revealed = "true";

            const y = el.dataset.revealY ? Number(el.dataset.revealY) : 34;
            const d = el.dataset.revealD ? Number(el.dataset.revealD) : 0.8;

            gsap.fromTo(
              el,
              { opacity: 0, y },
              {
                opacity: 1,
                y: 0,
                duration: d,
                ease: "power3.out",
              }
            );
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      targets.forEach((t) => observer.observe(t));
      return () => observer.disconnect();
    }, root);

    return () => ctx.revert();
  }, [rootRef, prefersReducedMotion]);
}
