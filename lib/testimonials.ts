/**
 * Named client testimonials — fill in when you have permission to quote.
 * Until then the homepage uses outcome lines from case studies instead.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company?: string;
  projectSlug?: string;
};

export const testimonials: Testimonial[] = [];
