"use client";

import {
  Briefcase,
  Home,
  Linkedin,
  Mail,
  Newspaper,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import type { ComponentType, SVGProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.701-1.333-1.701-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const NAV_ITEMS: { href: string; label: string; icon: IconType }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/work/", label: "Work", icon: Briefcase },
  { href: "/free-tools/", label: "Free Tools", icon: Wrench },
  { href: "/blog/", label: "Blog", icon: Newspaper },
  { href: "/#about", label: "About", icon: User },
  { href: "/#contact", label: "Contact", icon: Mail },
];

const SOCIAL_ITEMS: {
  href: string;
  label: string;
  icon: IconType;
  external?: boolean;
}[] = [
  {
    href: "https://www.linkedin.com/in/clyde-keanu-abenojar-b3b578346",
    label: "LinkedIn",
    icon: Linkedin,
    external: true,
  },
  {
    href: "https://github.com/clydekeanu-rgb",
    label: "GitHub",
    icon: GithubIcon,
    external: true,
  },
  {
    href: "mailto:clyde@clydeabenojar.site",
    label: "Email",
    icon: Mail,
  },
];

function DockNavLink({
  href,
  label,
  icon: Icon,
  external,
}: {
  href: string;
  label: string;
  icon: IconType;
  external?: boolean;
}) {
  const className = cn(
    buttonVariants({ variant: "ghost", size: "icon" }),
    "size-12 rounded-full text-foreground hover:bg-white/10 hover:text-accent",
  );
  const icon = <Icon className="size-4" />;

  return (
    <Tooltip>
      <TooltipTrigger
        delay={0}
        render={
          external ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={className}
            />
          ) : (
            <Link href={href} aria-label={label} className={className} />
          )
        }
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="font-mono text-[10px] uppercase tracking-[0.18em]"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function FloatingGlassNav() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 pb-[env(safe-area-inset-bottom)]">
      <TooltipProvider delay={0}>
        <Dock
          direction="middle"
          iconSize={40}
          iconMagnification={reduceMotion ? 40 : 58}
          iconDistance={120}
          disableMagnification={!!reduceMotion}
          className={cn(
            "sentry-dock pointer-events-auto mt-0",
          )}
        >
          {NAV_ITEMS.map((item) => (
            <DockIcon key={item.label}>
              <DockNavLink {...item} />
            </DockIcon>
          ))}
          <Separator orientation="vertical" className="mx-1 h-8 bg-white/15" />
          {SOCIAL_ITEMS.map((item) => (
            <DockIcon key={item.label}>
              <DockNavLink {...item} />
            </DockIcon>
          ))}
        </Dock>
      </TooltipProvider>
    </div>
  );
}
