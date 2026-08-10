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
    title: "PromptGen",
    subtitle: "Product Photography Prompt Builder",
    description:
      "A guided wizard that builds structured AI image-generation prompts for product photography — category, presentation style, model details, shot setup, background, lighting, mood, and output size — then generates a copyable JSON spec and prompt preview.",
    tags: ["Free Tool", "AI Prompt Builder"],
    href: "/free-tools/promptgen/",
    external: false,
    liveUrl: "/free-tools/promptgen/",
    image: "/images/promptgen.png",
    number: "00",
    audience:
      "E-commerce brands, product marketers, and studios who need consistent AI product-photo prompts without rewriting from scratch.",
    hireLine: "Need PromptGen-style tooling built into your product or workflow?",
    seoTitle: "Free AI product photography prompt builder | PromptGen",
    seoDescription:
      "Guided wizard for structured Midjourney/Imagen product-photo prompts — free tool by Clyde Abenojar. Need this in your product? Book a call.",
  },
  {
    slug: "blueprintai",
    title: "BlueprintAI",
    subtitle: "Architectural Render Prompt Builder",
    description:
      "A guided wizard for turning a building concept into a detailed photorealistic-render prompt — architectural style, lighting, camera angle, weather, and scene extras — ready to paste into Midjourney, Imagen, or any image model.",
    tags: ["Free Tool", "AI Prompt Builder"],
    href: "/free-tools/blueprintai/",
    external: false,
    liveUrl: "/free-tools/blueprintai/",
    image: "/images/blueprintai.png",
    number: "01",
    audience:
      "Architects, developers, and visualization freelancers who want photorealistic building renders without wrestling prompt syntax.",
    hireLine: "Want a custom render or design prompt tool for your firm?",
    seoTitle: "Free architectural render prompt builder | BlueprintAI",
    seoDescription:
      "Turn building concepts into detailed AI render prompts — free tool by Clyde Abenojar. Need a custom version for your team? Book a call.",
  },
  {
    slug: "chargen",
    title: "CharGen",
    subtitle: "Philippines-Realism Prompt Builder",
    description:
      "A streamlined prompt builder for crafting localized scene descriptions and image prompts with a focused set of style, pose, location, and expression controls.",
    tags: ["Free Tool", "Prompt Builder"],
    href: "/free-tools/chargen/",
    external: false,
    liveUrl: "/free-tools/chargen/",
    image: "/images/promptgen.png",
    number: "02",
    audience:
      "Creators and marketers who need Philippines-realistic character and scene prompts with local context.",
    hireLine: "Need a localized prompt or content tool built for your brand?",
    seoTitle: "Free Philippines-realism image prompt builder | CharGen",
    seoDescription:
      "Build localized PH-realistic scene and character prompts — free tool by Clyde Abenojar. Want this customized for your workflow? Book a call.",
  },
];

export function getFreeTool(slug: string): FreeTool | undefined {
  return freeTools.find((tool) => tool.slug === slug);
}
