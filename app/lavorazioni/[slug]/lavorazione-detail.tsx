"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { Lavorazione } from "@/lib/lavorazioni";
import { assetUrl } from "@/lib/asset-prefix";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

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

export function LavorazioneDetail({ lavorazione }: { lavorazione: Lavorazione }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

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
          <nav data-hero className="text-[11px] uppercase tracking-[0.28em] text-[#8f8f8f]">
            <Link
              href="/#meesterwerken"
              className="cursor-pointer transition-colors hover:text-brass"
            >
              ← Lavorazioni
            </Link>
          </nav>

          <p
            data-hero
            className="mt-10 text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]"
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
            className="mt-4 max-w-2xl text-sm md:text-base text-[#a3a3a3] leading-relaxed"
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
                className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]"
              >
                Procedura tecnica
              </h2>
              <p
                data-reveal
                data-reveal-y="28"
                className="mt-6 text-sm md:text-base leading-relaxed text-[#c7c7c7]"
              >
                {lavorazione.technicalDescription}
              </p>
            </div>
            <aside className="border-t border-white/10 lg:border-t-0 lg:border-l lg:pl-10 pt-10 lg:pt-0">
              <h2
                data-reveal
                className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]"
              >
                In sintesi
              </h2>
              <ul
                data-reveal
                data-reveal-y="24"
                className="mt-6 space-y-3 text-sm text-[#a3a3a3]"
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
              className="text-[11px] uppercase tracking-[0.35em] text-[#8f8f8f]"
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
              {lavorazione.gallery.map((src, idx) => (
                <div
                  key={src + idx}
                  data-reveal
                  data-reveal-y={idx % 2 === 0 ? "22" : "30"}
                  className="relative aspect-[4/3] overflow-hidden rounded-sm border border-white/10 bg-zinc-section"
                >
                  <Image
                    src={assetUrl(src)}
                    alt={`${lavorazione.title} — ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <div className="border-t border-white/5 bg-zinc-section/50">
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
    </div>
  );
}
