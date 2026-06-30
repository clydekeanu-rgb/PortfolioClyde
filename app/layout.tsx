import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://clydeabenojar.site"),
  title: "Clyde Abenojar - AI-assisted Web Builder",
  description:
    "Portfolio of Clyde Abenojar. Web apps, AI tools, and business websites designed and shipped with AI-assisted development workflows.",
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
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
