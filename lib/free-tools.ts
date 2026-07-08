import type { Project } from "@/components/ProjectCard";

export const freeTools: Project[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  // Add more free tools here later with numbers 03, 04, etc.
];
