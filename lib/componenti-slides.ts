/** Dati slider home: titoli + immagini gallery 01–06 (`public/images/gallery-*.jpg`). */
import { assetUrl } from "./asset-prefix";

export type ComponenteSlide = {
  n: string;
  title: string;
  image: string;
};

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
