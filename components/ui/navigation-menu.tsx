"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type AnimatedNavItem = {
  name: string;
  href: string;
};

const defaultNavItems: AnimatedNavItem[] = [
  { name: "Work", href: "/work/" },
  { name: "Services", href: "/services/" },
  { name: "Free Tools", href: "/free-tools/" },
  { name: "Blog", href: "/blog/" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

const EXPAND_SCROLL_THRESHOLD = 80;
const MOBILE_MQ = "(max-width: 767px)";

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

const containerVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "100%",
    transition: {
      y: { type: "spring" as const, damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3rem",
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
      when: "afterChildren" as const,
      staggerChildren: 0.05,
      staggerDirection: -1 as const,
    },
  },
};

const logoVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { type: "spring" as const, damping: 15 },
  },
  collapsed: {
    opacity: 0,
    x: -25,
    rotate: -180,
    transition: { duration: 0.3 },
  },
};

const logoVariantsMobile = {
  expanded: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { type: "spring" as const, damping: 15 },
  },
  collapsed: {
    opacity: 0,
    x: 25,
    rotate: 180,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring" as const, damping: 15 },
  },
  collapsed: {
    opacity: 0,
    x: -20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const collapsedIconVariants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 300,
      delay: 0.15,
    },
  },
};

type AnimatedNavFramerProps = {
  items?: AnimatedNavItem[];
  brand?: string;
  mobileBrand?: string;
  brandHref?: string;
  className?: string;
};

export function AnimatedNavFramer({
  items = defaultNavItems,
  brand = "Clyde Abenojar",
  mobileBrand = "Clyde",
  brandHref = "/",
  className,
}: AnimatedNavFramerProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [isExpanded, setExpanded] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  React.useEffect(() => {
    if (!isExpanded || !isMobile) {
      setMenuOpen(false);
    }
  }, [isExpanded, isMobile]);

  React.useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (reduceMotion) {
      setExpanded(true);
      lastScrollY.current = latest;
      return;
    }

    const previous = lastScrollY.current;

    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      setMenuOpen(false);
      scrollPositionOnCollapse.current = latest;
    } else if (
      !isExpanded &&
      latest < previous &&
      scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD
    ) {
      setExpanded(true);
    }

    lastScrollY.current = latest;
  });

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  const brandLabel = isMobile ? mobileBrand : brand;
  const alignRightWhenCollapsed = isMobile && !isExpanded;

  return (
    <div className={cn("fixed inset-x-0 top-6 z-50", className)}>
      <div
        className={cn(
          "mx-auto flex max-w-6xl px-6",
          alignRightWhenCollapsed ? "justify-end" : "justify-start",
        )}
      >
        <div ref={rootRef} className="relative w-full">
          <motion.nav
            initial={reduceMotion ? false : { y: -80, opacity: 0 }}
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={containerVariants}
            whileHover={!isExpanded && !reduceMotion ? { scale: 1.1 } : {}}
            whileTap={!isExpanded && !reduceMotion ? { scale: 0.95 } : {}}
            onClick={handleNavClick}
            aria-label="Primary"
            style={{ originX: isMobile ? 1 : 0 }}
            className={cn(
              "relative flex h-12 items-center overflow-hidden rounded-full border border-border bg-background/80 shadow-lg backdrop-blur-sm",
              isMobile ? "ml-auto" : "mr-auto",
              isExpanded ? "justify-between" : "cursor-pointer justify-center",
            )}
          >
            <motion.a
              href={brandHref}
              variants={isMobile ? logoVariantsMobile : logoVariants}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-shrink-0 items-center whitespace-nowrap px-5 text-sm font-semibold tracking-tight text-foreground"
            >
              {brandLabel}
            </motion.a>

            {/* Desktop inline links */}
            <motion.div
              className={cn(
                "hidden items-center gap-1 pr-5 md:flex md:gap-4",
                !isExpanded && "pointer-events-none",
              )}
            >
              {items.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  variants={itemVariants}
                  onClick={(e) => e.stopPropagation()}
                  className="whitespace-nowrap px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.name}
                </motion.a>
              ))}
            </motion.div>

            {/* Mobile hamburger (expanded only) */}
            {isExpanded ? (
              <button
                type="button"
                className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5 md:hidden"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((open) => !open);
                }}
              >
                {menuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            ) : null}

            {/* Collapsed hamburger glyph */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <motion.div
                variants={collapsedIconVariants}
                animate={isExpanded ? "expanded" : "collapsed"}
              >
                <Menu className="h-6 w-6 text-foreground" aria-hidden="true" />
              </motion.div>
            </div>
          </motion.nav>

          {/* Mobile dropdown */}
          {isMobile && isExpanded && menuOpen ? (
            <div
              id="mobile-nav-menu"
              role="menu"
              className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-full min-w-[12rem] overflow-hidden rounded-2xl border border-border bg-background/95 py-2 shadow-lg backdrop-blur-md"
            >
              {items.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  role="menuitem"
                  className="block px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
