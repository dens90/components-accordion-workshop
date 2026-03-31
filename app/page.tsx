/**
 * Landing page inspired by Minimal Steel's structure:
 * - Hero: fullscreen, two-column layout (text + tall image placeholder + small numeric indicator)
 * - Collection: header with metal-style caps and a 6-item grid of product types with animated underlines
 * - Philosophy: about/craft section with text + right image placeholder
 * - Masterpieces: project cards with subtle hover motion
 * - Contact: final call-to-action and simple form placeholder
 *
 * Notes:
 * - Replace placeholder "image" divs with real photos/videos when ready (kept as dark blocks for now).
 * - Copy is original and does not reuse Minimal Steel text.
 *
 * Tailwind theme extensions (copy into `tailwind.config.*` if you want named utilities):
 * - letterSpacing:
 *   tightcaps: "0.18em"
 *   widecaps: "0.28em"
 *   ultrawide: "0.35em"
 * - colors (optional neutral scale):
 *   base-900: "#111111"
 *   base-700: "#4b4b4b"
 *   base-500: "#8a8a8a"
 *   base-100: "#f4f4f4"
 */

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import Image from "next/image";

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

const isProd = process.env.NODE_ENV === 'production';
const prefix = isProd ? '/components-accordion-workshop' : '';

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(mql.matches);
    update();

    // Safari fallback: older browsers may not support addEventListener on MediaQueryList.
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }

    mql.addListener(update);
    return () => mql.removeListener(update);
  }, []);

  return prefers;
}

export default function Page() {
  const navRef = useRef<HTMLElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Hero slides (maps to the screenshot "1 — 3" image slider).
  const heroSlides: { src: string, num: string }[] = useMemo(
    () => [
      { src: `${prefix}/hero-01.jpg`, num: "01" },
      { src: `${prefix}/hero-02.jpg`, num: "02" },
      { src: `${prefix}/hero-03.jpg`, num: "03" },
    ],
    []
  );
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const navHeight = useMemo(() => {
    // Best-effort default; we also recompute in the scroll handler on mount.
    return 72;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (heroSlides.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveHeroSlide((v) => (v + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [prefersReducedMotion, heroSlides.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.08,
      smoothWheel: true,
    });

    // Expose for `scrollToId()` so nav clicks can use Lenis' easing.
    (window as unknown as { lenis?: typeof lenis }).lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { lenis?: typeof lenis }).lenis;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!rootRef.current) return;

    if (prefersReducedMotion) return;

    const root = rootRef.current;

    const ctx = gsap.context(() => {
      // Hero entrance (maps to the original "hero text fades/slides" feel).
      gsap.from(
        root.querySelectorAll("[data-hero]"),
        {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
        }
      );

      // Reveal on scroll (headers + cards). Uses IntersectionObserver so we don't
      // depend on ScrollTrigger setup.
      const targets = Array.from(
        root.querySelectorAll<HTMLElement>("[data-reveal]")
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            if (el.dataset.revealed === "true") return;
            el.dataset.revealed = "true";

            const y = el.dataset.revealY ? Number(el.dataset.revealY) : 34;
            const d = el.dataset.revealD ? Number(el.dataset.revealD) : 0.8;

            gsap.fromTo(
              el,
              { opacity: 0, y },
              {
                opacity: 1,
                y: 0,
                duration: d,
                ease: "power3.out",
              }
            );
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      targets.forEach((t) => observer.observe(t));
      return () => observer.disconnect();
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const navEl = navRef.current;
    const offset = navEl ? navEl.getBoundingClientRect().height + 12 : navHeight + 12;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;

    // Prefer Lenis if available. We created Lenis in an effect, so we can
    // reach it via the global handler pattern only if needed; otherwise
    // fallback to native scrolling.
    const anyWindow = window as unknown as { lenis?: { scrollTo: (v: number) => void } };
    if (anyWindow.lenis?.scrollTo) {
      anyWindow.lenis.scrollTo(y);
      return;
    }

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const navLinks = useMemo(
    () => [
      { id: "collectie", label: "COLLEZIONE" },
      { id: "meesterwerken", label: "OPERE" },
      { id: "contatto", label: "CONTATTO" },
    ],
    []
  );

  return (
    <div ref={rootRef} className="min-h-full bg-[#050505] text-[#f5f5f5]">
      <header
        ref={(n) => {
          navRef.current = n;
        }}
        className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur border-b border-white/5"
      >
        <div className="mx-auto max-w-6xl px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-15 w-15 rounded-[2px]"
              aria-hidden="true"
            >
              <Image src={`${prefix}/logo-sky-carini.png`} alt="Sky Carini" width={60} height={60} />
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              SKY CARINI
            </div>
          </div>

          <nav aria-label="Navigazione principale">
            <div className="flex items-center gap-8">
              {navLinks.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(l.id);
                  }}
                  className="group relative text-[11px] uppercase tracking-[0.28em] text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors"
                >
                  <span className="block">{l.label}</span>
                  <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-[#E5C878] transition-[width] duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </nav>
        </div>
      </header>

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
                <div data-hero className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]">
                  PARTI PER FISARMONICHE • CASTELFIDARDO
                </div>

                <div data-hero className="mt-10 space-y-1 leading-[0.9]">
                  <div className="text-5xl md:text-7xl font-light tracking-[0.08em]">SKY</div>
                  <div className="text-5xl md:text-7xl font-light tracking-[0.08em]">CARINI</div>
                </div>

                <div data-hero className="mt-10 max-w-md">
                  <h1 className="text-3xl md:text-4xl font-light leading-tight text-[#E5C878]">
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
                    className="text-[11px] uppercase tracking-[0.24em] text-[#f5f5f5] hover:text-[#E5C878] transition-colors"
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
                        className={`px-1 transition-colors ${
                          idx === activeHeroSlide ? "text-white" : "text-[#8f8f8f] hover:text-white"
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

        <section id="collectie" className="py-24 md:py-32 bg-[#050505]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-12 md:mb-16">
              <div data-reveal className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]">
                COMPONENTI
              </div>
              <h2 data-reveal className="mt-5 text-3xl md:text-4xl font-light leading-tight">
                Tasti, meccaniche e finiture
              </h2>
              <p data-reveal className="mt-5 max-w-2xl text-sm md:text-base leading-relaxed text-[#a3a3a3]">
                Produciamo componenti e accessori con standard artigianali, adatti
                a diverse configurazioni di fisarmoniche.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { n: "01", title: "TASTI & GUIDE" },
                { n: "02", title: "MECCANICHE & REGISTRI" },
                { n: "03", title: "CASSE ARMONICHE" },
                { n: "04", title: "BASSI & CONTRABBASSI" },
                { n: "05", title: "VALVOLE & TENUTE" },
                { n: "06", title: "FINITURE & DECORI" },
              ].map((item, idx) => (
                <button
                  key={item.n}
                  data-reveal
                  data-reveal-y={idx % 2 === 0 ? "24" : "32"}
                  className="group text-left border-b border-white/10 pb-5"
                  type="button"
                >
                  <div className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">{item.n}</div>
                  <div className="mt-3 text-base md:text-lg uppercase tracking-[0.12em] text-[#f2f2f2]">
                    {item.title}
                  </div>
                  <div className="mt-4 h-px w-10 bg-white/20 group-hover:w-16 group-hover:bg-[#E5C878] transition-all duration-300" />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="meesterwerken" className="py-24 md:py-32 bg-[#0b0b0b]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-12 md:mb-16">
              <div data-reveal className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]">
                LAVORAZIONI IN EVIDENZA
              </div>
              <h2 data-reveal className="mt-5 text-3xl md:text-4xl font-light leading-tight">
                Dettagli che fanno la differenza
              </h2>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {[
                {
                  image: `${prefix}/images/lavorazione-1.jpg`,
                  title: "Guide e alloggi",
                  line: "Precisione su quote e accoppiamenti.",
                },
                {
                  image: `${prefix}/images/lavorazione-2.jpg`,
                  title: "Meccaniche scorrevoli",
                  line: "Fluidità e risposta costante nel tempo.",
                },
                {
                  image: `${prefix}/images/lavorazione-3.jpg`,
                  title: "Finiture e decori",
                  line: "Pulizia estetica e coerenza artigianale.",
                },
              ].map((p, idx) => (
                <article
                  key={p.title}
                  data-reveal
                  data-reveal-y={idx % 2 === 0 ? "28" : "36"}
                  className="group border border-white/5 rounded-sm overflow-hidden bg-black/10 hover:bg-black/20 transition-colors"
                >
                  <div className="relative aspect-[4/3] bg-neutral-900">
                    <Image src={p.image} alt={p.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  </div>
                  <div className="p-7">
                    <h3 className="text-base md:text-lg uppercase tracking-[0.1em]">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#a3a3a3]">{p.line}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">
                        Scopri dettagli
                      </span>
                      <span className="h-px w-8 bg-white/20 group-hover:w-12 group-hover:bg-[#E5C878] transition-all duration-300" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-[#050505]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-14 items-start">
              <div>
                <div data-reveal className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]">
                  PERCHÉ SKY CARINI
                </div>
                <h2 data-reveal className="mt-5 text-3xl md:text-4xl font-light leading-tight">
                  Artigianalità concreta, qualità costante
                </h2>
                <ul data-reveal className="mt-7 space-y-4 text-sm md:text-base text-[#b8b8b8] leading-relaxed">
                  <li>• Precisione di lavorazione su ogni componente.</li>
                  <li>• Tolleranze curate e controlli qualità dedicati.</li>
                  <li>• Stabilità nel tempo anche su utilizzo intenso.</li>
                  <li>• Produzione specializzata a Castelfidardo.</li>
                </ul>
              </div>
              <div data-reveal className="relative rounded-sm overflow-hidden border border-white/5 bg-neutral-900">
                <div className="relative aspect-[4/3]">
                  <Image src={`${prefix}/images/banco-lavoro.jpg`} alt="Banco di lavorazione" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="galleria" className="py-24 md:py-32 bg-[#0a0a0a]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-12 md:mb-16">
              <div data-reveal className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]">
                GALLERIA LAVORAZIONI
              </div>
              <h2 data-reveal className="mt-5 text-3xl md:text-4xl font-light leading-tight">
                Dal laboratorio al dettaglio finito
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                `${prefix}/images/gallery-1.jpg`,
                `${prefix}/images/gallery-2.jpg`,
                `${prefix}/images/gallery-3.jpg`,
                `${prefix}/images/gallery-4.jpg`,
                `${prefix}/images/gallery-5.jpg`,
                `${prefix}/images/gallery-6.jpg`,
                `${prefix}/images/gallery-7.jpg`,
                `${prefix}/images/gallery-8.jpg`,
              ].map((src, idx) => (
                <div
                  key={src}
                  data-reveal
                  data-reveal-y={idx % 2 === 0 ? "18" : "26"}
                  className="relative aspect-square rounded-sm overflow-hidden border border-white/5 bg-neutral-900"
                >
                  <Image src={src} alt={`Lavorazione ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contatto" className="py-24 md:py-32 bg-[#050505]">
          <span id="contact" className="block h-0 w-0 overflow-hidden" aria-hidden="true" />
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-14 items-start">
              <div>
                <div data-reveal className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]">
                  CONTATTO
                </div>
                <h2 data-reveal className="mt-5 text-3xl md:text-4xl font-light leading-tight">
                  Richiedi disponibilità e informazioni
                </h2>
                <p data-reveal className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-[#a3a3a3]">
                  Ti rispondiamo con indicazioni su componenti, tempi e lavorazioni
                  in base alle specifiche del tuo progetto.
                </p>

                <div data-reveal className="mt-8 space-y-4">
                  <div className="flex items-center justify-between rounded-sm border border-white/5 bg-black/10 px-6 py-4">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">Orari</div>
                    <div className="text-sm text-[#f5f5f5]">Lun–Ven • 09:00–17:00</div>
                  </div>
                  <div className="rounded-sm border border-white/5 bg-black/10 px-6 py-4">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">Indirizzo</div>
                    <div className="mt-2 text-sm text-[#f5f5f5] leading-relaxed">
                      Castelfidardo, Via Adriatica 51
                      <br />
                      60027 Osimo Stazione AN
                    </div>
                  </div>
                </div>
              </div>

              <div data-reveal className="rounded-sm border border-white/5 bg-black/10 p-7">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4" aria-label="Modulo di contatto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">Nome</span>
                      <input
                        className="mt-2 w-full rounded-sm border border-white/10 bg-[#050505] px-4 py-3 text-sm text-[#f5f5f5] outline-none focus:border-[#E5C878]/60"
                        placeholder="Il tuo nome"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">Email</span>
                      <input
                        type="email"
                        className="mt-2 w-full rounded-sm border border-white/10 bg-[#050505] px-4 py-3 text-sm text-[#f5f5f5] outline-none focus:border-[#E5C878]/60"
                        placeholder="nome@dominio.it"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">Messaggio</span>
                    <textarea
                      rows={4}
                      className="mt-2 w-full resize-none rounded-sm border border-white/10 bg-[#050505] px-4 py-3 text-sm text-[#f5f5f5] outline-none focus:border-[#E5C878]/60"
                      placeholder="Raccontaci la parte di cui hai bisogno (modello, quantità, finitura)..."
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-3 rounded-sm bg-[#E5C878] px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-[#050505] hover:brightness-[1.02] transition-colors"
                  >
                    Richiedi un preventivo
                    <ArrowRight className="text-[#050505]" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-white/5">
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
    </div>
  );
}
