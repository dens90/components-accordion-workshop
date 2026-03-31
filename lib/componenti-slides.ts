import { assetUrl } from "./asset-prefix";

export type ComponenteSlide = {
  n: string;
  title: string;
  image: string;
};

/** Placeholder macro: maps to existing gallery assets (01–06). */
export function getComponentiSlides(): ComponenteSlide[] {
  const titles = [
    "TASTI & GUIDE",
    "MECCANICHE & REGISTRI",
    "CASSE ARMONICHE",
    "BASSI & CONTRABBASSI",
    "VALVOLE & TENUTE",
    "FINITURE & DECORI",
  ] as const;

  return titles.map((title, i) => ({
    n: String(i + 1).padStart(2, "0"),
    title,
    image: assetUrl(`/images/gallery-${i + 1}.jpg`),
  }));
}
