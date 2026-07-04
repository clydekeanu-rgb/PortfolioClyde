import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { SiteBackground } from "@/components/SiteBackground";

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
    <html lang="en">
      <body className="font-sans antialiased">
        <SiteBackground>
          <Analytics />
          {children}
        </SiteBackground>
      </body>
    </html>
  );
}
