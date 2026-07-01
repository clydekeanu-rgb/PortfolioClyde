"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const links = [
  { label: "Work", href: "/#work", id: "work", page: false },
  { label: "Blog", href: "/blog/", id: "blog", page: true },
  { label: "About", href: "/#about", id: "about", page: false },
  { label: "Contact", href: "/#contact", id: "contact", page: false },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("work");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sections = links
      .filter((link) => !link.page)
      .map((link) => document.getElementById(link.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) {
          setActive(visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0.01 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm"
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold text-primary">
          <span className="text-accent">&lt;</span>Clyde
          <span className="text-accent">/&gt;</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) =>
            link.page ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-secondary transition-colors hover:text-primary"
              >
                {link.label} <span className="text-accent">/&gt;</span>
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active === link.id
                    ? "text-accent-soft"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {link.label} <span className="text-accent">/&gt;</span>
              </a>
            ),
          )}
          <a
            href="/#contact"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-background transition-shadow hover:shadow-glow"
          >
            Hire Me
          </a>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-primary md:hidden"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-2">
            {links.map((link) =>
              link.page ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2 py-3 text-sm font-medium text-secondary hover:bg-surface hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label} <span className="text-accent">/&gt;</span>
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2 py-3 text-sm font-medium text-secondary hover:bg-surface hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label} <span className="text-accent">/&gt;</span>
                </a>
              ),
            )}
            <a
              href="/#contact"
              className="mt-2 rounded-md bg-accent px-4 py-3 text-center text-sm font-semibold text-background"
              onClick={() => setIsOpen(false)}
            >
              Hire Me
            </a>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
