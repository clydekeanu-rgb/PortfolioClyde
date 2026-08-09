"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Menu } from "lucide-react";
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
  brandHref?: string;
  className?: string;
};

export function AnimatedNavFramer({
  items = defaultNavItems,
  brand = "Clyde Abenojar",
  brandHref = "/",
  className,
}: AnimatedNavFramerProps) {
  const reduceMotion = useReducedMotion();
  const [isExpanded, setExpanded] = React.useState(true);

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (reduceMotion) {
      setExpanded(true);
      lastScrollY.current = latest;
      return;
    }

    const previous = lastScrollY.current;

    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
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

  return (
    <div className={cn("fixed inset-x-0 top-6 z-50", className)}>
      <div className="mx-auto flex max-w-6xl justify-start px-6">
        <motion.nav
          initial={reduceMotion ? false : { y: -80, opacity: 0 }}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={containerVariants}
          whileHover={!isExpanded && !reduceMotion ? { scale: 1.1 } : {}}
          whileTap={!isExpanded && !reduceMotion ? { scale: 0.95 } : {}}
          onClick={handleNavClick}
          aria-label="Primary"
          style={{ originX: 0 }}
          className={cn(
            "relative mr-auto flex h-12 items-center overflow-hidden rounded-full border border-border bg-background/80 shadow-lg backdrop-blur-sm",
            isExpanded ? "justify-between" : "cursor-pointer justify-center",
          )}
        >
          <motion.a
            href={brandHref}
            variants={logoVariants}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-shrink-0 items-center whitespace-nowrap px-5 text-sm font-semibold tracking-tight text-foreground"
          >
            {brand}
          </motion.a>

          <motion.div
            className={cn(
              "flex items-center gap-1 pr-5 sm:gap-4",
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

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              variants={collapsedIconVariants}
              animate={isExpanded ? "expanded" : "collapsed"}
            >
              <Menu className="h-6 w-6 text-foreground" aria-hidden="true" />
            </motion.div>
          </div>
        </motion.nav>
      </div>
    </div>
  );
}
