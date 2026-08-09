import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { SiteNav } from "@/components/SiteNav";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://clydeabenojar.site"),
  title: "Clyde Abenojar - AI-assisted Web Builder",
  description:
    "Portfolio of Clyde Abenojar. Web apps, AI tools, and business websites designed and shipped with AI-assisted development workflows.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "Clyde Abenojar - AI-assisted Web Builder",
    description:
      "Web apps, AI tools, and business websites designed and shipped with AI-assisted development workflows.",
    url: "https://clydeabenojar.site",
    siteName: "Clyde Abenojar",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clyde Abenojar - AI-assisted Web Builder",
    description:
      "Web apps, AI tools, and business websites designed and shipped with AI-assisted development workflows.",
    images: ["/og-image.svg"],
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
