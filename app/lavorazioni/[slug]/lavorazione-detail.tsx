/**
 * Dettaglio lavorazione: hero GSAP, testo da `Lavorazione`, galleria con `assetUrl` sui path.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import type { Lavorazione } from "@/lib/lavorazioni";
import { assetUrl } from "@/lib/asset-prefix";
import { ImageLightbox } from "@/components/image-lightbox";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function LavorazioneDetail({ lavorazione }: { lavorazione: Lavorazione }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryLightboxImages = useMemo(
    () =>
      lavorazione.gallery.map((src, idx) => ({
        src: assetUrl(src),
        alt: `${lavorazione.title} — ${idx + 1}`,
      })),
    [lavorazione.gallery, lavorazione.title]
  );

  useScrollReveal(rootRef, prefersReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!rootRef.current) return;
    if (prefersReducedMotion) return;

    const root = rootRef.current;
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-hero]"), {
        opacity: 0,
        y: 36,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.1,
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion, lavorazione.slug]);

  const hero = assetUrl(lavorazione.heroImage);

  return (
    <div
      ref={rootRef}
      className="min-h-full bg-[#050505] text-dirty-white pt-[4.5rem] md:pt-24"
    >
      <main className="pb-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8 py-12 md:py-16">
          <nav data-hero className="type-meta-label">
            <Link
              href="/#meesterwerken"
              className="cursor-pointer transition-colors hover:text-brass"
            >
              ← Lavorazioni
            </Link>
          </nav>

          <p
            data-hero
            className="type-section-label mt-10"
          >
            LAVORAZIONE
          </p>
          <h1
            data-hero
            className="mt-4 text-3xl md:text-5xl font-light leading-tight text-dirty-white"
          >
            {lavorazione.title}
          </h1>
          <p
            data-hero
            className="type-body-lead mt-4 max-w-2xl text-[#a3a3a3]"
          >
            {lavorazione.excerpt}
          </p>

          <div
            data-hero
            className="relative mt-12 aspect-[21/9] max-h-[420px] overflow-hidden rounded-sm border border-white/10 bg-zinc-section"
          >
            <Image
              src={hero}
              alt={lavorazione.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width:768px) 100vw, 72rem"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="mt-16 md:mt-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.35fr)] gap-12 lg:gap-16">
            <div>
              <h2
                data-reveal
                className="type-section-label"
              >
                Procedura tecnica
              </h2>
              <p
                data-reveal
                data-reveal-y="28"
                className="type-body-lead mt-6 text-[#c7c7c7]"
              >
                {lavorazione.technicalDescription}
              </p>
            </div>
            <aside className="border-t border-white/10 lg:border-t-0 lg:border-l lg:pl-10 pt-10 lg:pt-0">
              <h2
                data-reveal
                className="type-section-label"
              >
                In sintesi
              </h2>
              <ul
                data-reveal
                data-reveal-y="24"
                className="type-body-lead mt-6 space-y-3 text-[#a3a3a3]"
              >
                <li className="flex gap-2">
                  <span className="text-brass">—</span>
                  Controlli in processo
                </li>
                <li className="flex gap-2">
                  <span className="text-brass">—</span>
                  Tolleranze funzionali
                </li>
                <li className="flex gap-2">
                  <span className="text-brass">—</span>
                  Coerenza con il meccanismo
                </li>
              </ul>
            </aside>
          </div>

          <section className="mt-20 md:mt-28">
            <h2
              data-reveal
              className="type-section-label"
            >
              Galleria
            </h2>
            <p
              data-reveal
              className="mt-3 text-lg md:text-xl font-light text-dirty-white"
            >
              Immagini di dettaglio
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {galleryLightboxImages.map((item, idx) => (
                <button
                  key={item.src + idx}
                  type="button"
                  data-reveal
                  data-reveal-y={idx % 2 === 0 ? "22" : "30"}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-sm border border-brass/20 bg-zinc-section p-0 text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition-[border-color,box-shadow] duration-500 hover:border-brass/45 hover:shadow-[0_0_32px_rgba(229,200,120,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/60"
                  aria-label={`Apri immagine ${idx + 1} ingrandita`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-90 md:opacity-100" />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <span className="type-gallery-index">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="mt-1 h-px max-w-12 bg-brass/50 transition-all duration-500 group-hover:max-w-20 group-hover:bg-brass" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      <ImageLightbox
        images={galleryLightboxImages}
        activeIndex={lightboxIndex}
        onActiveIndexChange={setLightboxIndex}
      />

      <div className="border-t border-white/5 bg-zinc-section/50">
        <div className="mx-auto max-w-6xl px-6 md:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="type-footer-muted">
              SKY CARINI • PARTI PER FISARMONICHE
            </div>
            <div className="type-footer-muted">
              © {new Date().getFullYear()} — Tutti i diritti riservati
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
