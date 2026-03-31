"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { getComponentiSlides } from "@/lib/componenti-slides";

/** Dati slide: costruiti una volta a caricamento modulo (`assetUrl` incluso). */
const SLIDES = getComponentiSlides();

export function ComponentiSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: false,
    dragFree: true,
    loop: true,
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const sync = () => onSelect();
    const id = window.requestAnimationFrame(sync);
    emblaApi.on("select", onSelect);
    emblaApi.on("settle", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      window.cancelAnimationFrame(id);
      emblaApi.off("select", onSelect);
      emblaApi.off("settle", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const onResize = () => emblaApi.reInit();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

  return (
    <div className="w-full min-w-0">
      {/* Layout: corsia full-bleed; titolo sezione resta in max-w-6xl sopra in page */}
      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
        {/* Lenis: `prevent-touch` solo — la rotella resta smooth; `prevent` bloccava Lenis sull’intero carousel. */}
        <div
          className="w-full overflow-hidden pl-3 sm:pl-5 md:pl-6"
          ref={emblaRef}
          data-lenis-prevent-touch
        >
          <div className="flex touch-manipulation gap-3 sm:gap-5 md:gap-6 pr-3 sm:pr-5 md:pr-6">
            {SLIDES.map((item) => (
              <div
                key={item.n}
                className="min-w-0 shrink-0 basis-[min(85vw,340px)] sm:basis-[min(48vw,400px)] md:basis-[min(38vw,460px)] lg:basis-[min(32vw,480px)] xl:basis-[min(28vw,520px)]"
              >
                <div className="group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-sm border border-brass/35 bg-zinc-section shadow-[0_0_0_1px_rgba(229,200,120,0.08)] transition-[border-color,box-shadow] duration-300 group-hover:border-brass/70 group-hover:shadow-[0_0_24px_rgba(229,200,120,0.12)]">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width:640px) 78vw, (max-width:1024px) 42vw, 28vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="mt-4 px-1">
                    <div className="type-meta-label">{item.n}</div>
                    <div className="type-body-lead mt-2 uppercase tracking-[0.12em] text-dirty-white">
                      {item.title}
                    </div>
                    <div className="mt-3 h-px w-10 bg-white/20 transition-all duration-300 group-hover:w-14 group-hover:bg-brass" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-6xl items-center justify-between px-6 md:px-8">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              className="type-button-label cursor-pointer rounded-sm border border-white/15 px-4 py-2 text-[#a3a3a3] transition-colors hover:border-brass/50 hover:text-dirty-white"
              aria-label="Slide precedente"
            >
              Indietro
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="type-button-label cursor-pointer rounded-sm border border-white/15 px-4 py-2 text-[#a3a3a3] transition-colors hover:border-brass/50 hover:text-dirty-white"
              aria-label="Slide successiva"
            >
              Avanti
            </button>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                className={`h-2 w-2 cursor-pointer rounded-full transition-colors ${
                  i === selected ? "bg-brass" : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Vai alla slide ${i + 1}`}
                aria-current={i === selected ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
