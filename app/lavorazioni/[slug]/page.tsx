/**
 * Route statica `/lavorazioni/[slug]`: params da `getLavorazioneSlugs`, contenuto da `lib/lavorazioni`.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getLavorazione,
  getLavorazioneSlugs,
} from "@/lib/lavorazioni";
import { LavorazioneDetail } from "./lavorazione-detail";

export function generateStaticParams() {
  return getLavorazioneSlugs().map((slug) => ({ slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const l = getLavorazione(slug);
  if (!l) {
    return { title: "Lavorazione | Sky Carini" };
  }
  return {
    title: `${l.title} | Sky Carini`,
    description: l.excerpt,
  };
}

export default async function LavorazionePage({ params }: PageProps) {
  const { slug } = await params;
  const lavorazione = getLavorazione(slug);
  if (!lavorazione) notFound();

  return <LavorazioneDetail lavorazione={lavorazione} />;
}
