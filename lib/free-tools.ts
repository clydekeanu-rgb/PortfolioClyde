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
  // Add more free tools here later with numbers 01, 02, etc.
];
