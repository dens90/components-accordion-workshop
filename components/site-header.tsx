"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { assetUrl } from "@/lib/asset-prefix";
import { scrollToAnchorById } from "@/lib/scroll-to-section";

/** Sezione header: anchor verso home (`#collectie`, …); su altre pagine `Link` a `/#id`. */
const navLinks = [
  { id: "collectie", label: "COLLEZIONE" },
  { id: "meesterwerken", label: "OPERE" },
  { id: "contatto", label: "CONTATTO" },
] as const;

const LOGO_SRC = assetUrl("/logo-sky-carini.png");

export function SiteHeader() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);

  const isHome = pathname === "/" || pathname === "";

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur border-b border-white/5"
    >
      <div className="mx-auto max-w-6xl px-6 py-3 md:py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="h-15 w-15 rounded-[2px]" aria-hidden="true">
            <Image
              src={LOGO_SRC}
              alt="Sky Carini"
              width={60}
              height={60}
            />
          </div>
          <div className="type-brand-mark">SKY CARINI</div>
        </Link>

        <nav aria-label="Navigazione principale">
          <div className="flex items-center gap-8">
            {navLinks.map((l) =>
              isHome ? (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToAnchorById(l.id, { headerRoot: navRef.current });
                  }}
                  className="type-nav-link group relative text-[#a3a3a3] hover:text-dirty-white transition-colors cursor-pointer"
                >
                  <span className="block">{l.label}</span>
                  <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-brass transition-[width] duration-300 group-hover:w-full" />
                </a>
              ) : (
                <Link
                  key={l.id}
                  href={`/#${l.id}`}
                  className="type-nav-link group relative text-[#a3a3a3] hover:text-dirty-white transition-colors cursor-pointer"
                >
                  <span className="block">{l.label}</span>
                  <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-brass transition-[width] duration-300 group-hover:w-full" />
                </Link>
              )
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
