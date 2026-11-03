export type RenderCategory =
  | "all"
  | "exterior"
  | "outdoor"
  | "interior"
  | "ai-concept"
  | "plans";

export interface CategoryInfo {
  id: RenderCategory;
  label: string;
  count?: number;
}

export interface RenderItem {
  id: string;
  title: string;
  project: string;
  category: "exterior" | "outdoor" | "interior" | "ai-concept" | "plans";
  image: string;
  aspectRatio: "16/9" | "4/3" | "3/2" | "21/9" | "1/1";
  software: string[];
  tags: string[];
  description: string;
  featured?: boolean;
}

export const RENDER_CATEGORIES: CategoryInfo[] = [
  { id: "all", label: "All Works" },
  { id: "exterior", label: "Exterior Architecture" },
  { id: "outdoor", label: "Outdoor Sanctuary" },
  { id: "interior", label: "Interiors" },
  { id: "ai-concept", label: "AI Concept Renders" },
  { id: "plans", label: "Floor Plans" },
];

export const SOFTWARE_PIPELINE = [
  {
    name: "SketchUp",
    role: "Precision 3D Modeling",
    badge: "Modeling",
    description: "Detailed volumetric massing, structural framing, and spatial layouts.",
  },
  {
    name: "Enscape",
    role: "Real-time Visualization",
    badge: "Realtime",
    description: "Instant lighting validation, camera staging, and walk-through perspectives.",
  },
  {
    name: "V-Ray",
    role: "Photoreal Production",
    badge: "Ray Tracing",
    description: "Physically accurate materials, subsurface scattering, and dusk/night lighting.",
  },
  {
    name: "Archiwyn AI",
    role: "Rapid Concept Exploration",
    badge: "Generative AI",
    description: "Prompt-guided architectural facade variants and material ideation.",
  },
  {
    name: "Photoshop",
    role: "Post-Processing",
    badge: "Finishing",
    description: "Atmospheric depth, color grading, reflection balancing, and compositing.",
  },
];

export const RENDERS_DATA: RenderItem[] = [
  {
    id: "villa-day-angle",
    title: "Villa Horizon — Cantilevered Day Angle",
    project: "Villa Horizon Residence",
    category: "exterior",
    image: "/renders/villa-day-angle.png",
    aspectRatio: "16/9",
    software: ["SketchUp", "Enscape", "Photoshop"],
    tags: ["Residential", "Modernist", "Daylight", "Cantilever"],
    description:
      "Dynamic daytime perspective highlighting floating cantilevered roof slabs, vertical timber shading screens, double-height curtain wall glazing, and paved driveway entry.",
    featured: true,
  },
  {
    id: "villa-pool-sanctuary",
    title: "Villa Horizon — Sunken Pool & Spa Sanctuary",
    project: "Villa Horizon Residence",
    category: "outdoor",
    image: "/renders/villa-pool-sanctuary.png",
    aspectRatio: "16/9",
    software: ["SketchUp", "Enscape", "Photoshop"],
    tags: ["Outdoor Living", "Pool & Spa", "Water Feature", "Teak Decking"],
    description:
      "Aerial overview of an outdoor retreat with a sunken geometric swimming pool, integrated raised hydrotherapy spa, natural stacked stone waterfall wall, and ipe timber sun deck.",
    featured: true,
  },
  {
    id: "villa-night",
    title: "Villa Horizon — Night Architectural Lighting",
    project: "Villa Horizon Residence",
    category: "exterior",
    image: "/renders/villa-night.png",
    aspectRatio: "16/9",
    software: ["SketchUp", "V-Ray", "Photoshop"],
    tags: ["Residential", "Night Lighting", "Warm Accents", "Curtain Wall"],
    description:
      "Nighttime lighting study featuring concealed warm LED soffit strips, low-voltage stone pathway illumination, and interior light diffusion through double-height sheer drapery.",
    featured: true,
  },
  {
    id: "villa-golden-hour",
    title: "Villa Horizon — Golden Hour Balcony",
    project: "Villa Horizon Residence",
    category: "exterior",
    image: "/renders/villa-golden-hour.png",
    aspectRatio: "16/9",
    software: ["SketchUp", "V-Ray", "Photoshop"],
    tags: ["Residential", "Golden Hour", "Balcony", "Entry Portal"],
    description:
      "Dusk perspective highlighting warm sunset reflections across glazed balustrades, organic stone masonry accents, and inviting entryway scale.",
    featured: true,
  },
  {
    id: "villa-sunset-wide",
    title: "Villa Horizon — Sunset Perimeter View",
    project: "Villa Horizon Residence",
    category: "exterior",
    image: "/renders/villa-sunset-wide.png",
    aspectRatio: "16/9",
    software: ["SketchUp", "Enscape", "Photoshop"],
    tags: ["Residential", "Sunset", "Perimeter Wall", "Landscape"],
    description:
      "Wide-angle sunset study capturing horizontal timber boundary fencing, manicured perimeter landscape, and warm interior illumination bleeding out to the motor court.",
  },
  {
    id: "villa-day-front",
    title: "Villa Horizon — Frontal Daylight Facade",
    project: "Villa Horizon Residence",
    category: "exterior",
    image: "/renders/villa-day-front.png",
    aspectRatio: "16/9",
    software: ["SketchUp", "Enscape", "Photoshop"],
    tags: ["Residential", "Facade", "Daylight", "Timber Screen"],
    description:
      "Direct daylight frontal elevation revealing the interplay between board-formed concrete perimeter boundaries and warm natural timber upper balcony screens.",
  },
  {
    id: "kitchen-interior",
    title: "Culinary Suite — Modern Kitchen Interior",
    project: "Private Luxury Residence",
    category: "interior",
    image: "/renders/kitchen-interior.jpg",
    aspectRatio: "16/9",
    software: ["SketchUp", "V-Ray", "Photoshop"],
    tags: ["Interior", "Kitchen", "Cabinetry", "Ambient Lighting"],
    description:
      "Luxury kitchen visualization featuring handleless matte cabinetry, waterfall-edge marble island, concealed cove LED lighting, and integrated architectural fixtures.",
    featured: true,
  },
  {
    id: "residence-laguna",
    title: "Laguna Residence — Modern Tropical",
    project: "Laguna Residence",
    category: "exterior",
    image: "/renders/residence-laguna.jpg",
    aspectRatio: "16/9",
    software: ["SketchUp", "Enscape", "Photoshop"],
    tags: ["Residential", "Tropical Modern", "Landscape"],
    description:
      "Tropical contemporary residential facade framed by lush perimeter plantings, broad eaves for solar mitigation, and modern entry stonework.",
  },
  {
    id: "residence-23",
    title: "Project 23 — Minimalist Residential Block",
    project: "Project 23",
    category: "exterior",
    image: "/renders/residence-23.jpg",
    aspectRatio: "16/9",
    software: ["SketchUp", "V-Ray", "Photoshop"],
    tags: ["Residential", "Minimalism", "Geometric"],
    description:
      "Minimalist volumetric massing study utilizing clean white stucco planes, vertical wood screening, and dark fenestration framing.",
  },
  {
    id: "plan-level-1",
    title: "Villa Horizon — Ground Level Floor Plan",
    project: "Villa Horizon Residence",
    category: "plans",
    image: "/renders/plan-level-1.png",
    aspectRatio: "4/3",
    software: ["SketchUp", "Photoshop"],
    tags: ["Floor Plan", "Architectural Drawing", "Spatial Zoning"],
    description:
      "Complete ground-floor architectural schematic detailing entry portal, open-plan living and dining pavilion, ensuite guest quarters, dual carport, and pool terrace threshold.",
    featured: true,
  },
  {
    id: "plan-basement",
    title: "Villa Horizon — Basement & Structural Plan",
    project: "Villa Horizon Residence",
    category: "plans",
    image: "/renders/plan-basement.png",
    aspectRatio: "4/3",
    software: ["SketchUp", "Photoshop"],
    tags: ["Basement Plan", "Foundation", "Structural Schematic"],
    description:
      "Sub-grade structural layout illustrating basement vehicle staging, MEP utility zones, structural foundation walls, and vertical circulation elevator/stairwell core.",
  },
  {
    id: "archiwyn-render-05",
    title: "Archiwyn Concept 05 — Facade Shading Study",
    project: "Archiwyn AI Series",
    category: "ai-concept",
    image: "/renders/archiwyn-render-05.jpg",
    aspectRatio: "16/9",
    software: ["SketchUp", "Archiwyn AI", "Photoshop"],
    tags: ["AI Concept", "Archiwyn", "Commercial Facade"],
    description:
      "Rapid facade ideation exploring rhythmic vertical louvers and glazed panels for solar control and visual texture.",
  },
  {
    id: "archiwyn-render-14",
    title: "Archiwyn Concept 14 — Urban Commercial Angle",
    project: "Archiwyn AI Series",
    category: "ai-concept",
    image: "/renders/archiwyn-render-14.jpg",
    aspectRatio: "16/9",
    software: ["SketchUp", "Archiwyn AI", "Photoshop"],
    tags: ["AI Concept", "Archiwyn", "Urban Architecture"],
    description:
      "Corner perspective of an urban multi-story development testing cantilevered glass volumes and textured masonry podiums.",
  },
  {
    id: "archiwyn-render-15",
    title: "Archiwyn Concept 15 — Mixed-Use Massing",
    project: "Archiwyn AI Series",
    category: "ai-concept",
    image: "/renders/archiwyn-render-15.jpg",
    aspectRatio: "16/9",
    software: ["SketchUp", "Archiwyn AI", "Photoshop"],
    tags: ["AI Concept", "Archiwyn", "Mixed Use"],
    description:
      "Atmospheric daylight render evaluating modular balcony setbacks and vertical green walls in an urban context.",
  },
  {
    id: "archiwyn-render-16",
    title: "Archiwyn Concept 16 — Street-Level Perspective",
    project: "Archiwyn AI Series",
    category: "ai-concept",
    image: "/renders/archiwyn-render-16.jpg",
    aspectRatio: "16/9",
    software: ["SketchUp", "Archiwyn AI", "Photoshop"],
    tags: ["AI Concept", "Archiwyn", "Pedestrian Realm"],
    description:
      "Pedestrian-scale rendering exploring streetscape integration, glazed retail ground floor, and warm canopy soffits.",
  },
  {
    id: "archiwyn-render-19",
    title: "Archiwyn Concept 19 — Contemporary Pavilion",
    project: "Archiwyn AI Series",
    category: "ai-concept",
    image: "/renders/archiwyn-render-19.jpg",
    aspectRatio: "16/9",
    software: ["SketchUp", "Archiwyn AI", "Photoshop"],
    tags: ["AI Concept", "Archiwyn", "Pavilion"],
    description:
      "Single-story contemporary pavilion study featuring expansive overhangs, floor-to-ceiling glass, and minimalist concrete plinth.",
  },
  {
    id: "archiwyn-render-26",
    title: "Archiwyn Concept 26 — Twilight Form Exploration",
    project: "Archiwyn AI Series",
    category: "ai-concept",
    image: "/renders/archiwyn-render-26.jpg",
    aspectRatio: "16/9",
    software: ["SketchUp", "Archiwyn AI", "Photoshop"],
    tags: ["AI Concept", "Archiwyn", "Twilight"],
    description:
      "Twilight lighting study showcasing geometric facade articulation with interior warmth glowing through calibrated apertures.",
  },
  {
    id: "archiwyn-render-31",
    title: "Archiwyn Concept 31 — Canopy & Courtyard",
    project: "Archiwyn AI Series",
    category: "ai-concept",
    image: "/renders/archiwyn-render-31.jpg",
    aspectRatio: "16/9",
    software: ["SketchUp", "Archiwyn AI", "Photoshop"],
    tags: ["AI Concept", "Archiwyn", "Courtyard"],
    description:
      "Internal courtyard perspective highlighting permeable shading canopies, reflecting pools, and natural ventilation corridors.",
  },
  {
    id: "archiwyn-render-32",
    title: "Archiwyn Concept 32 — Linear Glazed Atrium",
    project: "Archiwyn AI Series",
    category: "ai-concept",
    image: "/renders/archiwyn-render-32.jpg",
    aspectRatio: "16/9",
    software: ["SketchUp", "Archiwyn AI", "Photoshop"],
    tags: ["AI Concept", "Archiwyn", "Atrium"],
    description:
      "Linear double-height atrium study with structural steel ribs, diffused skylight glazing, and polished concrete floor planes.",
  },
];
