import type { Project } from "@/components/ProjectCard";

export type FreeTool = Project & {
  slug: string;
  audience: string;
  hireLine: string;
  seoTitle: string;
  seoDescription: string;
};

export const freeTools: FreeTool[] = [
  {
    slug: "promptgen",
    title: "AI Prompt Studio",
    subtitle: "Universal AI Prompt Builder",
    description:
      "An all-in-one structured prompt generator for Product Photography, Architectural Renders, and Realistic Characters. Switch modes instantly, fine-tune angles, materials, and lighting, and generate copy-ready prompts for Midjourney, Imagen, and FLUX.",
    tags: ["Free Tool", "AI Prompt Builder", "Multi-Mode"],
    href: "/free-tools/promptgen/",
    external: false,
    liveUrl: "/free-tools/promptgen/",
    image: "/images/promptgen.jpg",
    number: "00",
    audience:
      "E-commerce brands, 3D visualizers, and creators who need fast, structured AI prompts without wrestling syntax from scratch.",
    hireLine: "Need custom AI prompt builders or specialized workflow tools for your team?",
    seoTitle: "Free AI Prompt Builder | Product, Architecture & Character Studio",
    seoDescription:
      "Structured AI prompt generator for Midjourney & Imagen. Build photorealistic prompts for products, architectural renders, and characters with Clyde Abenojar's free studio.",
  },
  {
    slug: "background-remover",
    title: "Background Remover",
    subtitle: "In-Browser AI Background Removal",
    description:
      "Free, private background removal powered by BiRefNet running entirely in your browser via WebGPU/WASM. No image uploads, zero server latency, and full-resolution transparent PNG export.",
    tags: ["Free Tool", "AI Vision", "Client-Side", "BiRefNet"],
    href: "/free-tools/background-remover/",
    external: false,
    liveUrl: "/free-tools/background-remover/",
    image: "/images/background-remover.jpg",
    number: "01",
    audience:
      "Designers, creators, and sellers who want fast, high-fidelity background removal without uploading private media to third-party servers.",
    hireLine: "Need on-device AI or custom vision models integrated into your web app?",
    seoTitle: "Free In-Browser Background Remover | 100% Private Client-Side AI",
    seoDescription:
      "Remove backgrounds from photos entirely inside your browser with BiRefNet. Private, client-side WebGPU processing with transparent PNG export.",
  },
  {
    slug: "qr-generator",
    title: "QR Code Studio",
    subtitle: "Client-Side Custom QR Generator",
    description:
      "Free, private, fully customizable QR code generator with live camera scannability verification. Create branded codes for URLs, Wi-Fi, vCards, WhatsApp, and more with custom dots, logos, and frame banners.",
    tags: ["Free Tool", "QR Generator", "Client-Side", "Vector SVG"],
    href: "/free-tools/qr-generator/",
    external: false,
    liveUrl: "/free-tools/qr-generator/",
    image: "/images/qr-generator.jpg",
    number: "02",
    audience:
      "Designers, businesses, and event organizers who need high-resolution, branded QR codes with guaranteed real-world camera scannability.",
    hireLine: "Need branded QR generation or visual tooling integrated into your platform?",
    seoTitle: "Free Custom QR Code Generator | Client-Side & High Resolution",
    seoDescription:
      "Create custom styled QR codes with gradients, logos, and frames directly in your browser. Real-time scannability check with PNG and SVG export.",
  },
];

export function getFreeTool(slug: string): FreeTool | undefined {
  const direct = freeTools.find((tool) => tool.slug === slug);
  if (direct) return direct;
  // Aliases for merged prompt generators
  if (slug === "blueprintai" || slug === "chargen" || slug === "prompt-generator") {
    return freeTools.find((tool) => tool.slug === "promptgen");
  }
  return undefined;
}
