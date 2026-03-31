/**
 * Funzionalità: scroll ancorato con offset header (Lenis se presente, altrimenti nativo).
 * Dati: altezza header da `headerRoot` o dal primo `header` nel DOM, fallback 72px.
 */

const HEADER_FALLBACK_PX = 72;
const OFFSET_GAP_PX = 12;

/** Hash URL: solo ID HTML sicuri (no caratteri che aprono vector XSS in altri contesti). */
export function isSafeHtmlAnchorId(id: string): boolean {
  return id.length > 0 && id.length <= 128 && /^[a-zA-Z0-9_-]+$/.test(id);
}

export function scrollToAnchorById(
  id: string,
  options?: { headerRoot?: HTMLElement | null }
): void {
  if (typeof window === "undefined") return;
  if (!isSafeHtmlAnchorId(id)) return;

  const el = document.getElementById(id);
  if (!el) return;

  const navEl =
    options?.headerRoot ?? document.querySelector<HTMLElement>("header");
  const offset =
    (navEl?.getBoundingClientRect().height ?? HEADER_FALLBACK_PX) +
    OFFSET_GAP_PX;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;

  if (window.lenis?.scrollTo) {
    window.lenis.scrollTo(y);
    return;
  }

  window.scrollTo({ top: y, behavior: "smooth" });
}
