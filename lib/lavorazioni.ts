import { assetUrl } from "./asset-prefix";

export type Lavorazione = {
  slug: string;
  title: string;
  excerpt: string;
  /** Path under public, e.g. /images/lavorazione-1.jpg */
  heroImage: string;
  technicalDescription: string;
  /** Paths under public */
  gallery: string[];
};

const LAVORAZIONI_DATA: Lavorazione[] = [
  {
    slug: "guide-e-alloggi",
    title: "Guide e alloggi",
    excerpt: "Precisione su quote e accoppiamenti.",
    heroImage: "/images/lavorazione-1.jpg",
    technicalDescription:
      "Le guide e gli alloggi vengono lavorati con attenzione alle quote nominali e alle tolleranze funzionali, così che ogni accoppiamento scorra senza giochi eccessivi e senza interferenze. Il processo prevede misure ripetute lungo la serie, controlli visivi sulla geometria e rifinitura delle superfici a contatto per ridurre attrito e rumorosità in esercizio. Su richiesta possiamo adattare profili e forature a disegni del cliente, mantenendo coerenza con il resto del meccanismo.",
    gallery: [
      "/images/gallery-1.jpg",
      "/images/gallery-2.jpg",
      "/images/gallery-3.jpg",
    ],
  },
  {
    slug: "meccaniche-scorrevoli",
    title: "Meccaniche scorrevoli",
    excerpt: "Fluidità e risposta costante nel tempo.",
    heroImage: "/images/lavorazione-2.jpg",
    technicalDescription:
      "Le meccaniche scorrevoli richiedono equilibrio tra leggerezza al tocco e tenuta nel tempo: regoliamo corsa, finecorsa e punti di lubrificazione in funzione del modello. Ogni assieme viene provato per verificare assenza di rigidezze locali e comportamento uniforme su tutta l’estensione. Materiali e trattamenti superficiali sono scelti per limitare usura e mantenere la risposta elastica anche dopo cicli intensivi.",
    gallery: [
      "/images/gallery-4.jpg",
      "/images/gallery-5.jpg",
      "/images/gallery-6.jpg",
    ],
  },
  {
    slug: "finiture-e-decori",
    title: "Finiture e decori",
    excerpt: "Pulizia estetica e coerenza artigianale.",
    heroImage: "/images/lavorazione-3.jpg",
    technicalDescription:
      "Finiture e decori chiudono il ciclo produttivo: smaltature, verniciature e dettagli ornamentali sono applicati in modo controllato per evitare spessori irregolari sulle zone funzionali. Definiamo con il cliente palette, lucentezza e grado di copertura, rispettando i vincoli tecnici del materiale di base. Il risultato è un aspetto coerente con lo strumento, senza compromettere tolleranze e movimenti.",
    gallery: [
      "/images/gallery-7.jpg",
      "/images/gallery-8.jpg",
      "/images/lavorazione-3.jpg",
    ],
  },
];

export function getAllLavorazioni(): Lavorazione[] {
  return LAVORAZIONI_DATA;
}

export function getLavorazione(slug: string): Lavorazione | undefined {
  return LAVORAZIONI_DATA.find((l) => l.slug === slug);
}

export function getLavorazioneSlugs(): string[] {
  return LAVORAZIONI_DATA.map((l) => l.slug);
}

export type HomeLavorazioneCard = {
  slug: string;
  title: string;
  line: string;
  image: string;
};

export function getHomeLavorazioneCards(): HomeLavorazioneCard[] {
  return LAVORAZIONI_DATA.map((l) => ({
    slug: l.slug,
    title: l.title,
    line: l.excerpt,
    image: assetUrl(l.heroImage),
  }));
}
