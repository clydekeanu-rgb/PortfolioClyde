import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./v2.css";

export const metadata: Metadata = {
  title: "Clyde Abenojar - Graphite Preview",
  description:
    "Preview of the redesigned landing page for clydeabenojar.site.",
  robots: { index: false, follow: false },
};

export default function V2Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`v2 ${GeistSans.variable} ${GeistMono.variable}`}>
      {children}
    </div>
  );
}
