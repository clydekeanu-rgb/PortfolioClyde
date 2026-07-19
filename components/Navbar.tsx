"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { label: "Work", href: "/work/", id: "work", page: true },
  { label: "Free Tools", href: "/free-tools/", id: "free-tools", page: true },
  { label: "Blog", href: "/blog/", id: "blog", page: true },
  { label: "About", href: "/#about", id: "about", page: false },
  { label: "Contact", href: "/#contact", id: "contact", page: false },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("work");
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,backdrop-filter,border-color] duration-300",
        scrolled
          ? "border-border bg-background/95 backdrop-blur-md"
          : "border-transparent bg-background/70 backdrop-blur-sm",
      )}
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold text-foreground">
          <span className="text-accent">&lt;</span>Clyde
          <span className="text-accent">/&gt;</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) =>
            link.page ? (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-secondary transition-colors hover:text-foreground"
              >
                {link.label} <span className="text-accent">/&gt;</span>
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors",
                  active === link.id
                    ? "text-accent-soft"
                    : "text-secondary hover:text-foreground",
                )}
              >
                {link.label} <span className="text-accent">/&gt;</span>
                {active === link.id && !reduceMotion && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 h-px w-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
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

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="border-border bg-surface text-foreground md:hidden"
                aria-label="Open menu"
              />
            }
          >
            <Menu size={18} />
          </SheetTrigger>
          <SheetContent side="right" className="border-border bg-background">
            <SheetHeader>
              <SheetTitle className="font-mono text-foreground">
                <span className="text-accent">&lt;</span>Clyde
                <span className="text-accent">/&gt;</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4">
              {links.map((link) =>
                link.page ? (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        className="rounded-md px-2 py-3 text-sm font-medium text-secondary hover:bg-surface hover:text-foreground"
                      />
                    }
                  >
                    {link.label} <span className="text-accent">/&gt;</span>
                  </SheetClose>
                ) : (
                  <SheetClose
                    key={link.href}
                    render={
                      <a
                        href={link.href}
                        className="rounded-md px-2 py-3 text-sm font-medium text-secondary hover:bg-surface hover:text-foreground"
                      />
                    }
                  >
                    {link.label} <span className="text-accent">/&gt;</span>
                  </SheetClose>
                ),
              )}
              <SheetClose
                render={
                  <a
                    href="/#contact"
                    className="mt-2 rounded-md bg-accent px-4 py-3 text-center text-sm font-semibold text-background"
                  />
                }
              >
                Hire Me
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  );
}
