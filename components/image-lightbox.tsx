"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { releaseBodyScrollLock } from "@/lib/body-scroll-lock";

export type LightboxImage = { src: string; alt: string };

type ImageLightboxProps = {
  images: readonly LightboxImage[];
  activeIndex: number | null;
  onActiveIndexChange: (next: number | null) => void;
};

/**
 * Overlay fullscreen: sfondo blur, immagine contain, prev/next/chiudi (stesso pattern della galleria home).
 */
export function ImageLightbox({
  images,
  activeIndex,
  onActiveIndexChange,
}: ImageLightboxProps) {
  const close = useCallback(() => onActiveIndexChange(null), [onActiveIndexChange]);

  useEffect(() => {
    if (activeIndex === null || images.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") {
        onActiveIndexChange(
          (activeIndex + images.length - 1) % images.length
        );
      }
      if (e.key === "ArrowRight") {
        onActiveIndexChange((activeIndex + 1) % images.length);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeIndex, close, images.length, onActiveIndexChange]);

  useEffect(() => {
    if (activeIndex === null) return;
    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      releaseBodyScrollLock();
    };
  }, [activeIndex]);

  /* Back browser con overlay aperto: React può non ripristinare subito lo scroll; popstate sblocca subito. */
  useEffect(() => {
    if (activeIndex === null) return;
    const onPopState = () => releaseBodyScrollLock();
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [activeIndex]);

  /* Sicurezza: se il componente smonta (navigazione) mentre l’effetto sopra ha lasciato il lock attivo. */
  useEffect(() => {
    return () => releaseBodyScrollLock();
  }, []);

  if (activeIndex === null || images.length === 0) return null;

  const current = images[activeIndex];
  if (!current) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] overflow-y-auto bg-black/60 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Immagine ingrandita"
      onClick={close}
    >
      <div className="flex min-h-full items-center justify-center px-4 py-20 sm:px-8 sm:py-24">
        <div
          className="relative w-full max-w-6xl border border-brass/35 bg-[#0a0a0a]/95 p-2 shadow-[0_0_100px_rgba(0,0,0,0.75)] sm:p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-2 top-2 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-white/10 bg-black/50 text-dirty-white transition-colors hover:border-brass/50 hover:text-brass sm:right-3 sm:top-3"
            aria-label="Chiudi"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onActiveIndexChange(
                    (activeIndex + images.length - 1) % images.length
                  );
                }}
                className="absolute left-1 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm border border-white/10 bg-black/50 text-dirty-white transition-colors hover:border-brass/50 hover:text-brass md:flex"
                aria-label="Immagine precedente"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  aria-hidden="true"
                >
                  <path
                    d="M14 6l-6 6 6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onActiveIndexChange((activeIndex + 1) % images.length);
                }}
                className="absolute right-1 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm border border-white/10 bg-black/50 text-dirty-white transition-colors hover:border-brass/50 hover:text-brass md:flex md:right-14"
                aria-label="Immagine successiva"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  aria-hidden="true"
                >
                  <path
                    d="M10 6l6 6-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          <div className="relative mx-auto mt-8 h-[min(78vh,760px)] w-full md:mt-0 md:px-12">
            <Image
              src={current.src}
              alt={`${current.alt} — ingrandimento`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {images.length > 1 && (
            <p className="type-brass-caption mt-4 text-center">
              {String(activeIndex + 1).padStart(2, "0")}
              <span className="mx-2 text-white/25">/</span>
              {String(images.length).padStart(2, "0")}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
