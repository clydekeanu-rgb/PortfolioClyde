import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { SiteNav } from "@/components/SiteNav";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://clydeabenojar.site"),
  title: {
    default: "Clyde Abenojar | AI-assisted Web Builder & Full Stack Developer",
    template: "%s | Clyde Abenojar",
  },
  description:
    "Clyde Abenojar designs and ships custom web apps, AI automation tools, and business websites. Scoped carefully, built fast. View work and book a call.",
  alternates: {
    canonical: "./",
  },
  authors: [{ name: "Clyde Abenojar", url: "https://clydeabenojar.site" }],
  creator: "Clyde Abenojar",
  publisher: "Clyde Abenojar",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "Clyde Abenojar | AI-assisted Web Builder & Full Stack Developer",
    description:
      "Custom web apps, AI automation pipelines, and business websites designed and shipped with AI-assisted workflows.",
    url: "https://clydeabenojar.site",
    siteName: "Clyde Abenojar",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Clyde Abenojar - AI-assisted Web Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clyde Abenojar | AI-assisted Web Builder & Full Stack Developer",
    description:
      "Custom web apps, AI automation pipelines, and business websites designed and shipped with AI-assisted workflows.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://cdn.simpleicons.org" />
        <JsonLd />
      </head>
      <body className={`${GeistSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <Analytics />
          <SiteNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
