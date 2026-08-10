export const CONTACT_EMAIL = "clyde@clydeabenojar.site";

export const PRIMARY_CTA_LABEL = "Book a call";

/** Homepage contact section (discovery call + leave a message). */
export const PRIMARY_CTA_HREF = "/#contact";

export function projectInquiryMailto(subject = "Project Inquiry") {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export function projectInquirySubject(projectTitle: string) {
  return `Project inquiry — ${projectTitle}`;
}

/**
 * Primary CTA URL. Query must come before the hash so `?project=` is readable
 * on the homepage via `window.location.search`.
 */
export function primaryCtaHref(options?: { project?: string; service?: string }) {
  const params = new URLSearchParams();
  if (options?.project) params.set("project", options.project);
  if (options?.service) params.set("service", options.service);
  const query = params.toString();
  return query ? `/?${query}#contact` : PRIMARY_CTA_HREF;
}
