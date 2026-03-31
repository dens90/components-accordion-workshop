"use client";

import { useEffect, useState } from "react";

/**
 * Funzionalità: `prefers-reduced-motion` dal sistema (accessibilità).
 * Usato per disattivare animazioni GSAP / reveal dove definito.
 */
export function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(mql.matches);
    update();

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }

    mql.addListener(update);
    return () => mql.removeListener(update);
  }, []);

  return prefers;
}
