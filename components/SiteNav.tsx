"use client";

import { usePathname } from "next/navigation";
import { AnimatedNavFramer } from "@/components/ui/navigation-menu";

const navItems = [
  { name: "Work", href: "/work/" },
  { name: "Services", href: "/services/" },
  { name: "Free Tools", href: "/free-tools/" },
  { name: "Blog", href: "/blog/" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

export function SiteNav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <AnimatedNavFramer
      brand="Clyde Abenojar"
      brandHref="/"
      items={navItems}
    />
  );
}
