import { homeFaq } from "@/lib/home-faq";

export function HomeFaq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="pb-8 pt-8">
      <div className="mx-auto max-w-6xl px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <p className="v2-eyebrow">{"// faq"}</p>
        <h2 className="v2-display mt-3 text-2xl sm:text-3xl">
          Before you book a call
        </h2>
        <dl className="mt-10 grid gap-8 md:grid-cols-2">
          {homeFaq.map((item) => (
            <div key={item.question}>
              <dt className="v2-display text-lg">{item.question}</dt>
              <dd
                className="mt-3 text-sm leading-relaxed sm:text-base"
                style={{ color: "var(--v2-muted)" }}
              >
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
