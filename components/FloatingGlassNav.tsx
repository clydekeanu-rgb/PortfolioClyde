"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Dock } from "@/components/ui/dock";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
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
  { label: "Work", href: "/work/", external: true },
  { label: "Free Tools", href: "/free-tools/", external: true },
  { label: "Blog", href: "/blog/", external: true },
  { label: "About", href: "#about", external: false },
  { label: "Contact", href: "#contact", external: false },
] as const;

const glassShell =
  "rw-nav-shell relative mt-0 origin-left overflow-hidden rounded-full border backdrop-blur-xl";

function NavLabel({ label }: { label: string }) {
  return (
    <>
      {label} <span className="rw-brand">/&gt;</span>
    </>
  );
}

function BrandLink({
  compact,
  reduceMotion,
}: {
  compact: boolean;
  reduceMotion: boolean | null;
}) {
  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34 };

  return (
    <Link
      href="/homepage-redo/"
      className="inline-flex shrink-0 items-center px-1 text-sm font-semibold rw-text"
    >
      <span className="rw-brand">&lt;</span>
      <span>Clyde</span>
      <AnimatePresence initial={false}>
        {compact ? (
          <motion.span
            key="surname"
            className="inline-block overflow-hidden whitespace-nowrap"
            initial={reduceMotion ? false : { opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={reduceMotion ? undefined : { opacity: 0, width: 0 }}
            transition={transition}
          >
            {" "}
            Abenojar
          </motion.span>
        ) : null}
      </AnimatePresence>
      <span className="rw-brand">/&gt;</span>
    </Link>
  );
}

function HireButton({ className }: { className?: string }) {
  return (
    <InteractiveHoverButton
      href="#contact"
      className={cn("rw-ihb rw-ihb-fill", className)}
    >
      Hire Me
    </InteractiveHoverButton>
  );
}

export function FloatingGlassNav() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (compact) setOpen(false);
  }, [compact]);

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 380, damping: 32 };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50">
      <div className="mx-auto max-w-5xl px-6">
        <div className="pointer-events-auto w-max max-w-full origin-left">
          {/* Desktop */}
          <Dock
            disableMagnification
            className={cn(
              glassShell,
              "hidden items-center md:flex",
              compact ? "h-11 gap-0 px-3" : "h-14 gap-5 px-5",
            )}
          >
            <BrandLink compact={compact} reduceMotion={reduceMotion} />

            <AnimatePresence initial={false}>
              {!compact ? (
                <motion.div
                  key="desktop-links"
                  className="flex items-center gap-5"
                  initial={reduceMotion ? false : { opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={
                    reduceMotion
                      ? undefined
                      : { opacity: 0, width: 0, marginLeft: 0 }
                  }
                  transition={transition}
                >
                  <div
                    className="mx-1 h-5 w-px shrink-0 bg-[var(--rw-border)]"
                    aria-hidden="true"
                  />
                  {links.map((link) =>
                    link.external ? (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rw-nav-link whitespace-nowrap text-sm font-medium transition-colors"
                      >
                        <NavLabel label={link.label} />
                      </Link>
                    ) : (
                      <a
                        key={link.href}
                        href={link.href}
                        className="rw-nav-link whitespace-nowrap text-sm font-medium transition-colors"
                      >
                        <NavLabel label={link.label} />
                      </a>
                    ),
                  )}
                  <HireButton />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <BorderBeam
              size={compact ? 56 : 80}
              duration={8}
              colorFrom="#C049FF"
              colorTo="#E879FF"
              borderWidth={1.25}
            />
          </Dock>

          {/* Mobile */}
          <Dock
            disableMagnification
            className={cn(
              glassShell,
              "flex items-center md:hidden",
              compact ? "h-11 gap-0 px-3" : "h-14 gap-3 px-3",
            )}
          >
            <BrandLink compact={compact} reduceMotion={reduceMotion} />

            <AnimatePresence initial={false}>
              {!compact ? (
                <motion.div
                  key="mobile-actions"
                  className="flex items-center gap-3"
                  initial={reduceMotion ? false : { opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={reduceMotion ? undefined : { opacity: 0, width: 0 }}
                  transition={transition}
                >
                  <HireButton className="h-8 whitespace-nowrap rounded-full px-3 text-xs font-semibold" />
                  <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger
                      render={
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="rounded-full border-[var(--rw-border)] bg-[var(--rw-surface-2)] text-[var(--rw-text)]"
                          aria-label="Open menu"
                        />
                      }
                    >
                      <Menu size={16} />
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="railway border-[var(--rw-border)] bg-[var(--rw-bg)] text-[var(--rw-text)]"
                    >
                      <SheetHeader>
                        <SheetTitle className="font-mono text-[var(--rw-text)]">
                          <span className="rw-brand">&lt;</span>Clyde
                          <span className="rw-brand">/&gt;</span>
                        </SheetTitle>
                      </SheetHeader>
                      <div className="flex flex-col gap-1 px-4">
                        {links.map((link) =>
                          link.external ? (
                            <SheetClose
                              key={link.href}
                              render={
                                <Link
                                  href={link.href}
                                  className="rounded-[8px] px-2 py-3 text-sm font-medium text-[var(--rw-muted)] hover:bg-[var(--rw-surface)] hover:text-[var(--rw-text)]"
                                />
                              }
                            >
                              <NavLabel label={link.label} />
                            </SheetClose>
                          ) : (
                            <SheetClose
                              key={link.href}
                              render={
                                <a
                                  href={link.href}
                                  className="rounded-[8px] px-2 py-3 text-sm font-medium text-[var(--rw-muted)] hover:bg-[var(--rw-surface)] hover:text-[var(--rw-text)]"
                                />
                              }
                            >
                              <NavLabel label={link.label} />
                            </SheetClose>
                          ),
                        )}
                        <SheetClose
                          render={
                            <InteractiveHoverButton
                              href="#contact"
                              className="rw-ihb rw-ihb-fill mt-2 w-full rounded-full px-4 py-3 text-sm"
                            />
                          }
                        >
                          Hire Me
                        </SheetClose>
                      </div>
                    </SheetContent>
                  </Sheet>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <BorderBeam
              size={compact ? 50 : 70}
              duration={8}
              colorFrom="#C049FF"
              colorTo="#E879FF"
              borderWidth={1.25}
            />
          </Dock>
        </div>
      </div>
    </div>
  );
}
