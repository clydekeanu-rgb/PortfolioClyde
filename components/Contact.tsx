"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SectionHeading } from "@/components/SectionHeading";

const email = "clyde@clydeabenojar.site";

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <AnimatedSection id="contact" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading center>Contact</SectionHeading>
        <h2 className="mt-8 text-center text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-primary">
          Let&apos;s build something.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-center text-base leading-7 text-secondary">
          Open to freelance projects and collaborations.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm transition-colors hover:border-accent">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-accent">
                  <Mail size={18} />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase text-secondary">
                  const email =
                </p>
                <a
                  href={`mailto:${email}`}
                  className="mt-2 block break-words text-lg font-semibold text-primary hover:text-accent-soft"
                >
                  {email}
                </a>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border text-secondary transition-colors hover:border-accent hover:text-accent-soft"
              >
                {copied ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm transition-colors hover:border-accent">
            <p className="text-xs font-semibold uppercase text-secondary">
              function startConversation()
            </p>
            <h3 className="mt-4 text-2xl font-semibold leading-snug text-primary">
              Have a product, site, or workflow that needs a careful build?
            </h3>
            <a
              href={`mailto:${email}?subject=Project%20Inquiry`}
              className="mt-6 inline-flex rounded-md bg-accent px-5 py-3 text-sm font-semibold text-background transition-shadow hover:shadow-glow"
            >
              &gt; send_message()
            </a>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-xl space-y-3 text-sm text-secondary">
          <a
            href="https://www.linkedin.com/in/clyde-keanu-abenojar-b3b578346"
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-colors hover:text-accent-soft"
          >
            <span className="text-accent">&gt;</span>{" "}
            linkedin.com/in/clyde-keanu-abenojar-b3b578346
          </a>
          <a
            href="https://github.com/clydekeanu-rgb"
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-colors hover:text-accent-soft"
          >
            <span className="text-accent">&gt;</span> github.com/clydekeanu-rgb
          </a>
          <a
            href={`mailto:${email}`}
            className="block transition-colors hover:text-accent-soft"
          >
            <span className="text-accent">&gt;</span> {email}
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}
