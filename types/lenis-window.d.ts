/** Estende `Window` per istanza Lenis impostata da `LenisProvider` (scroll programmatico). */
import type Lenis from "@studio-freight/lenis";

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export {};
