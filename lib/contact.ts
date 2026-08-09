export const CONTACT_EMAIL = "clyde@clydeabenojar.site";

export function projectInquiryMailto(subject = "Project Inquiry") {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export function projectInquirySubject(projectTitle: string) {
  return `Project inquiry — ${projectTitle}`;
}
