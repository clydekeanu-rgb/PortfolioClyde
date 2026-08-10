export const LAPTOP_MOCKUP_SLUGS = new Set([
  "promise-surrogacy",
  "konstru",
  "pickleball-pavilion",
  "property-maintenance",
]);

export function usesLaptopMockup(slug: string) {
  return LAPTOP_MOCKUP_SLUGS.has(slug);
}

export function browserUrl(liveUrl?: string) {
  if (!liveUrl || liveUrl.startsWith("/")) return undefined;
  return liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
