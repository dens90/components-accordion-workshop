/**
 * Home: hero, componenti (slider), lavorazioni, percorso qualità, galleria, contatto.
 */

"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { assetUrl } from "@/lib/asset-prefix";
import { getHomeLavorazioneCards } from "@/lib/lavorazioni";
import { ComponentiSlider } from "@/components/home/componenti-slider";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

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

function usePrefersReducedMotion() {
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

export default function Page() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const heroSlides = useMemo(
    () => [
      { src: assetUrl("/hero-01.jpg"), num: "01" },
      { src: assetUrl("/hero-02.jpg"), num: "02" },
      { src: assetUrl("/hero-03.jpg"), num: "03" },
    ],
    []
  );
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const lavorazioneCards = useMemo(() => getHomeLavorazioneCards(), []);

  const galleryItems = useMemo(
    () =>
      GALLERY_LAYOUT.map((item) => ({
        src: assetUrl(item.src),
        cell: item.cell,
      })),
    []
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const navHeight = 72;

  useScrollReveal(rootRef, prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (heroSlides.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveHeroSlide((v) => (v + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [prefersReducedMotion, heroSlides.length]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const run = () => {
      const el = document.getElementById(hash);
      if (!el) return;
      const navEl = document.querySelector("header");
      const offset = navEl
        ? navEl.getBoundingClientRect().height + 12
        : navHeight + 12;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      if (window.lenis?.scrollTo) {
        window.lenis.scrollTo(y);
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };

    const id = window.setTimeout(run, 80);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") {
        setLightboxIndex((i) =>
          i === null ? null : (i + galleryItems.length - 1) % galleryItems.length
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((i) =>
          i === null ? null : (i + 1) % galleryItems.length
        );
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, galleryItems.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [lightboxIndex]);

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

  const scrollToId = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;

      const navEl = document.querySelector("header");
      const offset = navEl
        ? navEl.getBoundingClientRect().height + 12
        : navHeight + 12;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;

      if (window.lenis?.scrollTo) {
        window.lenis.scrollTo(y);
        return;
      }

      window.scrollTo({ top: y, behavior: "smooth" });
    },
    []
  );

  return (
    <div ref={rootRef} className="min-h-full bg-[#050505] text-dirty-white">
      <main>
        <section className="relative min-h-screen bg-[#050505] overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0">
            {heroSlides.map((s, idx) => (
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

          <div className="relative mx-auto max-w-6xl px-6 md:px-8 pt-28 md:pt-32 pb-20 md:pb-24">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 items-start">
              <div className="max-w-2xl">
                <div
                  data-hero
                  className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]"
                >
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
                  <p className="mt-5 text-sm md:text-base leading-relaxed text-[#c7c7c7]">
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
                      scrollToId("collectie");
                    }}
                    className="cursor-pointer text-[11px] uppercase tracking-[0.24em] text-dirty-white hover:text-brass transition-colors"
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
                  <div className="relative flex items-center justify-between text-[11px] uppercase tracking-[0.28em]">
                    {heroSlides.map((s, idx) => (
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

        <section
          id="collectie"
          className="overflow-x-clip py-24 md:py-32 bg-zinc-section border-y border-white/5"
        >
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-12 md:mb-16">
              <div
                data-reveal
                className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]"
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
                className="mt-5 max-w-2xl text-sm md:text-base leading-relaxed text-[#a3a3a3]"
              >
                Produciamo componenti e accessori con standard artigianali, adatti
                a diverse configurazioni di fisarmoniche.
              </p>
            </div>
          </div>
          <ComponentiSlider />
        </section>

        <section id="meesterwerken" className="py-24 md:py-32 bg-[#0a0a0a]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-12 md:mb-16">
              <div
                data-reveal
                className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]"
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
              {lavorazioneCards.map((p, idx) => (
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
                      <p className="mt-3 text-sm leading-relaxed text-[#a3a3a3]">
                        {p.line}
                      </p>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">
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

        <section className="py-20 md:py-28 bg-[#050505]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-14 items-start">
              <div>
                <div
                  data-reveal
                  className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]"
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
                  className="mt-7 space-y-4 text-sm md:text-base text-[#b8b8b8] leading-relaxed"
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

        <section
          id="galleria"
          className="py-24 md:py-32 bg-[#0a0a0a] border-y border-white/5"
        >
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-10 md:mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div
                  data-reveal
                  className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]"
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
                className="max-w-md text-sm leading-relaxed text-[#737373] md:text-right"
              >
                Selezioni dal banco: materiali, finiture e fasi intermedie del
                ciclo produttivo.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5 md:auto-rows-[minmax(140px,auto)]">
              {galleryItems.map((item, idx) => (
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
                    <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-brass/90">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="mt-1 h-px max-w-12 bg-brass/50 transition-all duration-500 group-hover:max-w-20 group-hover:bg-brass" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

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
                  className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]"
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
                  className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-[#a3a3a3]"
                >
                  Ti rispondiamo con indicazioni su componenti, tempi e lavorazioni
                  in base alle specifiche del tuo progetto.
                </p>

                <div data-reveal className="mt-8 space-y-4">
                  <div className="flex cursor-default items-center justify-between rounded-sm border border-white/5 bg-black/10 px-6 py-4">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">
                      Orari
                    </div>
                    <div className="text-sm text-dirty-white">
                      Lun–Ven • 09:00–17:00
                    </div>
                  </div>
                  <div className="cursor-default rounded-sm border border-white/5 bg-black/10 px-6 py-4">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">
                      Indirizzo
                    </div>
                    <div className="mt-2 text-sm text-dirty-white leading-relaxed">
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
                      <span className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">
                        Nome
                      </span>
                      <input
                        className="mt-2 w-full rounded-sm border border-white/10 bg-[#050505] px-4 py-3 text-sm text-dirty-white outline-none focus:border-brass/60"
                        placeholder="Il tuo nome"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">
                        Email
                      </span>
                      <input
                        type="email"
                        className="mt-2 w-full rounded-sm border border-white/10 bg-[#050505] px-4 py-3 text-sm text-dirty-white outline-none focus:border-brass/60"
                        placeholder="nome@dominio.it"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">
                      Messaggio
                    </span>
                    <textarea
                      rows={4}
                      className="mt-2 w-full resize-none rounded-sm border border-white/10 bg-[#050505] px-4 py-3 text-sm text-dirty-white outline-none focus:border-brass/60"
                      placeholder="Raccontaci la parte di cui hai bisogno (modello, quantità, finitura)..."
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-sm bg-brass px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-[#050505] hover:brightness-[1.02] transition-colors"
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
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#737373]">
                SKY CARINI • PARTI PER FISARMONICHE
              </div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#737373]">
                © {new Date().getFullYear()} — Tutti i diritti riservati
              </div>
            </div>
          </div>
        </div>
      </main>

      {lightboxIndex !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] overflow-y-auto bg-black/60 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Immagine ingrandita"
            onClick={closeLightbox}
          >
            <div className="flex min-h-full items-center justify-center px-4 py-20 sm:px-8 sm:py-24">
              <div
                className="relative w-full max-w-6xl border border-brass/35 bg-[#0a0a0a]/95 p-2 shadow-[0_0_100px_rgba(0,0,0,0.75)] sm:p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={closeLightbox}
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

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) =>
                      i === null
                        ? null
                        : (i + galleryItems.length - 1) % galleryItems.length
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
                    setLightboxIndex((i) =>
                      i === null ? null : (i + 1) % galleryItems.length
                    );
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

                <div className="relative mx-auto mt-8 h-[min(78vh,760px)] w-full md:mt-0 md:px-12">
                  <Image
                    src={galleryItems[lightboxIndex].src}
                    alt={`Lavorazione ${lightboxIndex + 1} — ingrandimento`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>

                <p className="mt-4 text-center text-[11px] uppercase tracking-[0.32em] text-brass/90">
                  {String(lightboxIndex + 1).padStart(2, "0")}
                  <span className="mx-2 text-white/25">/</span>
                  {String(galleryItems.length).padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
