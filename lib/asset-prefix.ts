/**
 * Produzione (export statico / GitHub Pages): `basePath` = `/components-accordion-workshop`.
 * Sviluppo: stringa vuota. Allineato a `next.config` (`basePath` / `assetPrefix`).
 * Usa `assetUrl("/images/...")` per `next/image` e href a file statici.
 */
export function getAssetPrefix(): string {
  return process.env.NODE_ENV === "production"
    ? "/components-accordion-workshop"
    : "";
}

export function assetUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getAssetPrefix()}${normalized}`;
}
