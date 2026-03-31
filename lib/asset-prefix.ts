/**
 * Static export + GitHub Pages: in production, assets live under basePath.
 * Use assetUrl("/images/foo.jpg") for next/image src and static file paths.
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
