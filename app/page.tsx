/**
 * Home — sezioni: hero, componenti (slider Embla), lavorazioni, qualità, galleria + lightbox, contatto.
 * Dati lista: `HERO_SLIDES`, `HOME_LAVORAZIONE_CARDS`, `GALLERY_ITEMS` (prefissi asset da `assetUrl`).
 */

"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { assetUrl } from "@/lib/asset-prefix";
import { getHomeLavorazioneCards } from "@/lib/lavorazioni";
import { scrollToAnchorById } from "@/lib/scroll-to-section";
import { ImageLightbox } from "@/components/image-lightbox";
import { ComponentiSlider } from "@/components/home/componenti-slider";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 3.5L10.5 8L6 12.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Galleria: path pubblici + classi griglia responsive (immagini risolte con `assetUrl` sotto). */
const GALLERY_LAYOUT = [
  {
    src: "/images/gallery-1.jpg",
    cell: "md:col-span-8 md:row-span-2 min-h-[280px] md:min-h-[360px]",
  },
  {
    src: "/images/gallery-2.jpg",
    cell: "md:col-span-4 min-h-[200px] md:min-h-[172px]",
  },
  {
    src: "/images/gallery-3.jpg",
    cell: "md:col-span-4 min-h-[200px] md:min-h-[172px]",
  },
  {
    src: "/images/gallery-4.jpg",
    cell: "md:col-span-4 min-h-[220px]",
  },
  {
    src: "/images/gallery-5.jpg",
    cell: "md:col-span-4 min-h-[220px]",
  },
  {
    src: "/images/gallery-6.jpg",
    cell: "md:col-span-4 min-h-[220px]",
  },
  {
    src: "/images/gallery-7.jpg",
    cell: "md:col-span-6 min-h-[240px]",
  },
  {
    src: "/images/gallery-8.jpg",
    cell: "md:col-span-6 min-h-[240px]",
  },
] as const;

const HERO_SLIDES = [
  { src: assetUrl("/hero-01.jpg"), num: "01" },
  { src: assetUrl("/hero-02.jpg"), num: "02" },
  { src: assetUrl("/hero-03.jpg"), num: "03" },
] as const;

const HOME_LAVORAZIONE_CARDS = getHomeLavorazioneCards();

const GALLERY_ITEMS = GALLERY_LAYOUT.map((item) => ({
  src: assetUrl(item.src),
  cell: item.cell,
}));

const GALLERY_LIGHTBOX_IMAGES = GALLERY_ITEMS.map((item, idx) => ({
  src: item.src,
  alt: `Lavorazione ${idx + 1}`,
}));

export default function Page() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useScrollReveal(rootRef, prefersReducedMotion);

  // Hero: rotazione slide (disattivata se motion ridotta o una sola slide).
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (HERO_SLIDES.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveHeroSlide((v) => (v + 1) % HERO_SLIDES.length);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [prefersReducedMotion]);

  // Deep link `#id`: scroll dopo mount (hash validato in `scrollToAnchorById`).
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const id = window.setTimeout(() => scrollToAnchorById(hash), 80);
    return () => window.clearTimeout(id);
  }, []);

  // Hero: entrata GSAP (solo se motion completa).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!rootRef.current) return;
    if (prefersReducedMotion) return;

    const root = rootRef.current;

    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-hero]"), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={rootRef} className="min-h-full bg-[#050505] text-dirty-white">
      <main>
        {/* --- Hero --- */}
        <section className="relative min-h-screen bg-[#050505] overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0">
            {HERO_SLIDES.map((s, idx) => (
              <div
                key={s.src}
                className={`absolute inset-0 transition-opacity duration-900 ease-out ${
                  idx === activeHeroSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={s.src}
                  alt=""
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="object-cover scale-[1.05] brightness-[0.75]"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_28%,rgba(229,200,120,0.16),transparent_58%)]" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 md:px-8 pt-36 md:pt-48 pb-20 md:pb-24">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 items-start">
              <div className="max-w-2xl">
                <div data-hero className="type-section-label">
                  PARTI PER FISARMONICHE • CASTELFIDARDO
                </div>

                <div data-hero className="mt-10 space-y-1 leading-[0.9]">
                  <div className="text-5xl md:text-7xl font-light tracking-[0.08em]">
                    SKY
                  </div>
                  <div className="text-5xl md:text-7xl font-light tracking-[0.08em]">
                    CARINI
                  </div>
                </div>

                <div data-hero className="mt-10 max-w-md">
                  <h1 className="text-3xl md:text-4xl font-light leading-tight text-brass">
                    Parti e accessori per accordion
                  </h1>
                  <p className="type-body-lead mt-5 text-[#c7c7c7]">
                    Azienda artigianale di Castelfidardo specializzata nella produzione
                    di componenti tecnici per fisarmoniche: precisione, tolleranze curate
                    e affidabilità nel tempo.
                  </p>
                </div>

                <div data-hero className="mt-8 flex items-center gap-6">
                  <a
                    href="#collectie"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToAnchorById("collectie");
                    }}
                    className="type-cta-link cursor-pointer text-dirty-white hover:text-brass transition-colors"
                  >
                    Scopri i componenti
                  </a>
                  <div className="h-px w-10 bg-white/15" aria-hidden="true" />
                </div>
              </div>

              <div className="relative min-h-[440px] md:min-h-[560px]">
                <div
                  data-hero
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-[220px] md:w-[260px]"
                >
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/15" />
                  <div className="type-meta-label relative flex items-center justify-between">
                    {HERO_SLIDES.map((s, idx) => (
                      <button
                        key={s.num}
                        type="button"
                        onClick={() => setActiveHeroSlide(idx)}
                        className={`cursor-pointer px-1 transition-colors ${
                          idx === activeHeroSlide
                            ? "text-white"
                            : "text-[#8f8f8f] hover:text-white"
                        }`}
                        aria-label={`Vai alla slide ${s.num}`}
                      >
                        {s.num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Componenti (slider in componente dedicato) --- */}
        <section
          id="collectie"
          className="overflow-x-clip py-24 md:py-32 bg-zinc-section border-y border-white/5"
        >
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-12 md:mb-16">
              <div
                data-reveal
                className="type-section-label"
              >
                COMPONENTI
              </div>
              <h2
                data-reveal
                className="mt-5 text-3xl md:text-4xl font-light leading-tight text-dirty-white"
              >
                Tasti, meccaniche e finiture
              </h2>
              <p
                data-reveal
                className="type-body-lead mt-5 max-w-2xl text-[#a3a3a3]"
              >
                Produciamo componenti e accessori con standard artigianali, adatti
                a diverse configurazioni di fisarmoniche.
              </p>
            </div>
          </div>
          <ComponentiSlider />
        </section>

        {/* --- Lavorazioni: card da `lib/lavorazioni` (slug → `/lavorazioni/[slug]`) --- */}
        <section id="meesterwerken" className="py-24 md:py-32 bg-[#0a0a0a]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-12 md:mb-16">
              <div
                data-reveal
                className="type-section-label"
              >
                LAVORAZIONI IN EVIDENZA
              </div>
              <h2
                data-reveal
                className="mt-5 text-3xl md:text-4xl font-light leading-tight text-dirty-white"
              >
                Dettagli che fanno la differenza
              </h2>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {HOME_LAVORAZIONE_CARDS.map((p, idx) => (
                <Link
                  key={p.slug}
                  href={`/lavorazioni/${p.slug}`}
                  data-reveal
                  data-reveal-y={idx % 2 === 0 ? "28" : "36"}
                  className="group block cursor-pointer border border-white/5 rounded-sm overflow-hidden bg-black/10 hover:bg-black/20 transition-colors"
                >
                  <article>
                    <div className="relative aspect-[4/3] bg-zinc-section">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    </div>
                    <div className="p-7">
                      <h3 className="text-base md:text-lg uppercase tracking-[0.1em] text-dirty-white">
                        {p.title}
                      </h3>
                      <p className="type-body-lead mt-3 text-[#a3a3a3]">
                        {p.line}
                      </p>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="type-meta-label">
                          Scopri dettagli
                        </span>
                        <span className="h-px w-8 bg-white/20 group-hover:w-12 group-hover:bg-brass transition-all duration-300" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- Perché Sky Carini --- */}
        <section className="py-20 md:py-28 bg-[#050505]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-14 items-start">
              <div>
                <div
                  data-reveal
                  className="type-section-label"
                >
                  PERCHÉ SKY CARINI
                </div>
                <h2
                  data-reveal
                  className="mt-5 text-3xl md:text-4xl font-light leading-tight text-dirty-white"
                >
                  Artigianalità concreta, qualità costante
                </h2>
                <ul
                  data-reveal
                  className="type-body-lead mt-7 space-y-4 text-[#b8b8b8]"
                >
                  <li>• Precisione di lavorazione su ogni componente.</li>
                  <li>• Tolleranze curate e controlli qualità dedicati.</li>
                  <li>• Stabilità nel tempo anche su utilizzo intenso.</li>
                  <li>• Produzione specializzata a Castelfidardo.</li>
                </ul>
              </div>
              <div
                data-reveal
                className="relative rounded-sm overflow-hidden border border-white/5 bg-zinc-section"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={assetUrl("/images/banco-lavoro.jpg")}
                    alt="Banco di lavorazione"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Galleria + lightbox (portal su `document.body`) --- */}
        <section
          id="galleria"
          className="py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5"
        >
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-10 md:mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div
                  data-reveal
                  className="type-section-label"
                >
                  GALLERIA LAVORAZIONI
                </div>
                <h2
                  data-reveal
                  className="mt-5 text-3xl md:text-4xl font-light leading-tight text-dirty-white"
                >
                  Dal laboratorio al dettaglio finito
                </h2>
              </div>
              <p
                data-reveal
                className="type-body-lead max-w-md text-[#737373] md:text-right"
              >
                Selezioni dal banco: materiali, finiture e fasi intermedie del
                ciclo produttivo.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5 md:auto-rows-[minmax(140px,auto)]">
              {GALLERY_ITEMS.map((item, idx) => (
                <button
                  key={item.src}
                  type="button"
                  data-reveal
                  data-reveal-y={
                    idx % 3 === 0 ? "20" : idx % 3 === 1 ? "28" : "22"
                  }
                  onClick={() => setLightboxIndex(idx)}
                  className={`group relative block w-full cursor-pointer overflow-hidden rounded-sm border border-brass/20 bg-zinc-section p-0 text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition-[border-color,box-shadow] duration-500 hover:border-brass/45 hover:shadow-[0_0_32px_rgba(229,200,120,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/60 ${item.cell}`}
                  aria-label={`Apri immagine ${idx + 1} ingrandita`}
                >
                  <Image
                    src={item.src}
                    alt={`Lavorazione ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
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
          </div>
        </section>

        {/* --- Contatto (form ancora solo UI, nessun invio backend) --- */}
        <section id="contatto" className="py-24 md:py-32 bg-[#050505]">
          <span
            id="contact"
            className="block h-0 w-0 overflow-hidden"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-14 items-start">
              <div>
                <div
                  data-reveal
                  className="type-section-label"
                >
                  CONTATTO
                </div>
                <h2
                  data-reveal
                  className="mt-5 text-3xl md:text-4xl font-light leading-tight text-dirty-white"
                >
                  Richiedi disponibilità e informazioni
                </h2>
                <p
                  data-reveal
                  className="type-body-lead mt-6 max-w-2xl text-[#a3a3a3]"
                >
                  Ti rispondiamo con indicazioni su componenti, tempi e lavorazioni
                  in base alle specifiche del tuo progetto.
                </p>

                <div data-reveal className="mt-8 space-y-4">
                  <div className="flex cursor-default items-center justify-between rounded-sm border border-white/5 bg-black/10 px-6 py-4">
                    <div className="type-meta-label">
                      Orari
                    </div>
                    <div className="type-body-lead text-dirty-white">
                      Lun–Ven • 09:00–17:00
                    </div>
                  </div>
                  <div className="cursor-default rounded-sm border border-white/5 bg-black/10 px-6 py-4">
                    <div className="type-meta-label">
                      Indirizzo
                    </div>
                    <div className="type-body-lead mt-2 text-dirty-white">
                      Castelfidardo, Via Adriatica 51
                      <br />
                      60027 Osimo Stazione AN
                    </div>
                  </div>
                </div>
              </div>

              <div
                data-reveal
                className="rounded-sm border border-white/5 bg-zinc-section/40 p-7"
              >
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-4"
                  aria-label="Modulo di contatto"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="type-meta-label">
                        Nome
                      </span>
                      <input
                        className="type-body-lead mt-2 w-full rounded-sm border border-white/10 bg-[#050505] px-4 py-3 text-dirty-white outline-none focus:border-brass/60"
                        placeholder="Il tuo nome"
                      />
                    </label>
                    <label className="block">
                      <span className="type-meta-label">
                        Email
                      </span>
                      <input
                        type="email"
                        className="type-body-lead mt-2 w-full rounded-sm border border-white/10 bg-[#050505] px-4 py-3 text-dirty-white outline-none focus:border-brass/60"
                        placeholder="nome@dominio.it"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="type-meta-label">
                      Messaggio
                    </span>
                    <textarea
                      rows={4}
                      className="type-body-lead mt-2 w-full resize-none rounded-sm border border-white/10 bg-[#050505] px-4 py-3 text-dirty-white outline-none focus:border-brass/60"
                      placeholder="Raccontaci la parte di cui hai bisogno (modello, quantità, finitura)..."
                    />
                  </label>
                  <button
                    type="submit"
                    className="type-button-label inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-sm bg-brass px-4 py-3 text-[#050505] hover:brightness-[1.02] transition-colors"
                  >
                    Richiedi un preventivo
                    <ArrowRight className="text-[#050505]" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-white/5 bg-zinc-section/30">
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
      </main>

      <ImageLightbox
        images={GALLERY_LIGHTBOX_IMAGES}
        activeIndex={lightboxIndex}
        onActiveIndexChange={setLightboxIndex}
      />
    </div>
  );
}
