"use client";

import { usePathname } from "next/navigation";
import { AnimatedNavFramer } from "@/components/ui/navigation-menu";

import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from "@/lib/contact";

const navItems = [
  { name: "Work", href: "/work/" },
  { name: "Services", href: "/services/" },
  { name: "Free Tools", href: "/free-tools/" },
  { name: "Blog", href: "/blog/" },
  { name: "About", href: "/#about" },
];

export function SiteNav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <AnimatedNavFramer
      brand="Clyde Abenojar"
      mobileBrand="Clyde"
      brandHref="/"
      items={navItems}
      cta={{ name: PRIMARY_CTA_LABEL, href: PRIMARY_CTA_HREF }}
    />
  );
}
