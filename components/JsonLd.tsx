export function JsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Clyde Abenojar",
    url: "https://clydeabenojar.site",
    description:
      "Web apps, AI tools, and business websites designed and shipped with AI-assisted development workflows.",
    inLanguage: "en-US",
    publisher: {
      "@type": "Person",
      name: "Clyde Abenojar",
    },
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Clyde Abenojar",
    url: "https://clydeabenojar.site",
    image: "https://clydeabenojar.site/images/add_profile_photo.jpg",
    jobTitle: "AI-assisted Web Builder & Full Stack Developer",
    description:
      "Full stack builder specializing in Next.js web applications, AI automation tools, and production business websites.",
    sameAs: [
      "https://github.com/clydekeanu-rgb",
      "https://linkedin.com/in/clyde-abenojar",
    ],
    knowsAbout: [
      "Web Development",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "AI Workflow Automation",
      "n8n",
      "PostgreSQL",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Clyde Abenojar Web Development",
    url: "https://clydeabenojar.site",
    image: "https://clydeabenojar.site/images/add_profile_photo.jpg",
    priceRange: "$$",
    areaServed: "Worldwide",
    founder: {
      "@type": "Person",
      name: "Clyde Abenojar",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
