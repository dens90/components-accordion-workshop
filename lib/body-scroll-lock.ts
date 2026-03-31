/**
 * Rimuove il lock scroll su html/body (es. lightbox) e risincronizza Lenis dopo transizioni / back browser.
 */
export function releaseBodyScrollLock(): void {
  if (typeof document === "undefined") return;
  document.documentElement.style.removeProperty("overflow");
  document.body.style.removeProperty("overflow");
  if (typeof window === "undefined") return;
  window.requestAnimationFrame(() => {
    window.lenis?.resize();
  });
}
