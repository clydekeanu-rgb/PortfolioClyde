"use client";

import { useState } from "react";

type BlueprintAIState = {
  step: number;
  style: string | null;
  customStyle: string;
  lighting: string[];
  road: string | null;
  camera: string | null;
  lockViewFromReference: boolean;
  location: string;
  includePerson: boolean;
  cars: string;
  generatedPrompts: { lighting: string; prompt: string }[];
  copiedId: string | null;
};

const REFERENCE_GUARDRAIL =
  "Keep 100% of the referenced image geometry, massing, proportions, and layout exactly. Do not redesign the building, change the floor plan, or invent new forms. Only apply the selected style materials, lighting, environment, and photorealistic finishing. Image should appear as a real image taken from a real place.";

const ARCHITECTURAL_STYLES = [
  "Modern Minimalist",
  "Industrial",
  "Tropical Resort",
  "Japandi",
  "Biophilic",
  "Neo-Mediterranean",
  "Parametric",
  "Brutalist",
  "Custom Style",
];

const LIGHTING_OPTIONS = ["Daytime", "Golden Hour", "Blue Hour", "Night"];
const ROAD_OPTIONS = ["Dry", "Wet", "Puddles", "Snowy"];
const CAMERA_OPTIONS = [
  "Front Elevation",
  "3/4 Perspective",
  "Street-Level Wide",
  "Aerial/Bird's Eye",
];
const CARS_OPTIONS = ["No Cars", "Street Car", "Garage Car", "Multiple"];

type StylePhrases = {
  subject: string;
  details: string;
};

const STYLE_MAP: Record<string, StylePhrases> = {
  "Modern Minimalist": {
    subject: "a modern minimalist house",
    details:
      "smooth white or light gray concrete render exterior, large dark aluminum-framed windows with glass reflections, flat or low-pitch roof with clean lines, minimalist landscaping with tropical plants, small front garden with concrete pavers leading to the entrance",
  },
  Industrial: {
    subject: "an industrial-style house",
    details:
      "raw concrete and steel cladding, exposed structural elements, bold massing, dark-framed industrial windows, utilitarian landscaping with gravel and sparse greenery",
  },
  "Tropical Resort": {
    subject: "a tropical resort-style house",
    details:
      "airy open volumes, warm wood accents, expansive glazing, lush tropical landscaping, resort-like outdoor living spaces and soft natural materials",
  },
  Japandi: {
    subject: "a Japandi-inspired house",
    details:
      "warm wood finishes, restrained geometry, serene material palette, soft natural textures, balanced indoor-outdoor connection with calm landscaping",
  },
  Biophilic: {
    subject: "a biophilic house",
    details:
      "architecture blending with nature, integrated greenery, organic material connections, planted terraces and soft landscaping wrapping the facade",
  },
  "Neo-Mediterranean": {
    subject: "a neo-Mediterranean house",
    details:
      "warm stone and stucco surfaces, arched openings, soft earthy tones, timeless detailing, landscaped courtyard cues and Mediterranean plantings",
  },
  Parametric: {
    subject: "a parametric contemporary house",
    details:
      "fluid computational geometry, sculptural facade rhythms, precision cladding, dramatic curved or faceted forms, and contemporary hardscape",
  },
  Brutalist: {
    subject: "a brutalist house",
    details:
      "monolithic concrete forms, tactile board-formed surfaces, dramatic shadows, heavy massing, sparse landscaping emphasizing the structure",
  },
};

const LIGHT_MAP: Record<string, string> = {
  Daytime:
    "crisp daytime natural lighting with clear balanced contrast and soft shadows across the facade",
  "Golden Hour":
    "golden hour natural lighting with warm sunlight casting soft shadows across the facade",
  "Blue Hour":
    "blue hour lighting with cool twilight tones, soft ambient glow, and atmospheric depth across the facade",
  Night:
    "night lighting with moody artificial illumination, strong contrast, and warm interior window glow",
};

const CAM_MAP: Record<string, string> = {
  "Front Elevation":
    "shot with a professional DSLR camera on a 35mm lens in a clean front elevation view",
  "3/4 Perspective":
    "shot with a professional DSLR camera on a 35mm lens in a three-quarter perspective revealing depth and massing",
  "Street-Level Wide":
    "shot with a professional DSLR camera on a wide lens from street level in a wide composition",
  "Aerial/Bird's Eye":
    "shot with a professional camera from a dramatic aerial bird's-eye view",
};

const ROAD_MAP: Record<string, string> = {
  Dry: "weathered asphalt road in the foreground",
  Wet: "wet reflective asphalt road in the foreground after rain",
  Puddles:
    "asphalt road in the foreground with scattered puddles and rich ground reflections",
  Snowy: "snow-dusted road surface in the foreground with crisp winter texture",
};

const CARS_MAP: Record<string, string> = {
  "Street Car": "one realistic street-parked car",
  "Garage Car": "a realistic car near the garage driveway",
  Multiple: "multiple realistic vehicles appropriate to the street",
};

function createInitialState(): BlueprintAIState {
  return {
    step: 1,
    style: null,
    customStyle: "",
    lighting: [],
    road: null,
    camera: null,
    lockViewFromReference: false,
    location: "Philippines",
    includePerson: false,
    cars: "No Cars",
    generatedPrompts: [],
    copiedId: null,
  };
}

function buildPrompt(
  style: string,
  lighting: string[],
  camera: string,
  road: string,
  location: string,
  includePerson: boolean,
  cars: string,
  customStyle: string,
  lockViewFromReference: boolean,
) {
  const stylePhrases =
    style === "Custom Style"
      ? {
          subject:
            customStyle.trim() || "a custom architectural house",
          details:
            "refined exterior materials, clean contemporary detailing, and carefully composed landscaping",
        }
      : STYLE_MAP[style] || {
          subject: "a contemporary house",
          details:
            "clean architectural detailing, realistic materials, and composed landscaping",
        };

  const locationLabel = location.trim() || "the Philippines";
  const locationSetting = location.trim()
    ? `a suburban neighborhood in ${location.trim()}`
    : "a suburban neighborhood in the Philippines";

  const lightingPhrase =
    lighting.length > 0
      ? lighting.map((entry) => LIGHT_MAP[entry] || entry).join(", ")
      : "balanced natural lighting with soft shadows across the facade";

  const cameraPhrase = lockViewFromReference
    ? "match and lock the camera angle, framing, and perspective exactly from the reference image"
    : CAM_MAP[camera || "Front Elevation"] ||
      "shot with a professional DSLR camera on a 35mm lens";

  const roadPhrase = ROAD_MAP[road || "Dry"] || "weathered asphalt road in the foreground";

  const parts = [
    `Hyper-realistic architectural photography of ${stylePhrases.subject} in ${locationSetting}`,
    "photorealistic render",
    cameraPhrase,
    lightingPhrase,
    stylePhrases.details,
    roadPhrase,
    `realistic ${locationLabel} street setting, concrete sidewalk, wooden electric post with multiple utility wires and electrical lines strung across the scene adding urban realism`,
  ];

  if (includePerson) {
    parts.push(
      "one realistic Filipino person standing casually near the entrance or on the sidewalk for human scale reference, wearing casual everyday clothing, natural pose",
    );
  }

  if (cars !== "No Cars" && CARS_MAP[cars]) {
    parts.push(CARS_MAP[cars]);
  }

  parts.push(
    "ultra-detailed textures, ray-traced global illumination, ambient occlusion, 8K resolution, shallow depth of field with slight bokeh on background, real estate and architectural digest photography quality, no cartoon, no sketch, no obvious 3D model artifacts",
  );

  return [REFERENCE_GUARDRAIL, ...parts].join(", ");
}

export function BlueprintAIApp() {
  const [state, setState] = useState<BlueprintAIState>(createInitialState);

  const canProceed = () => {
    if (state.step === 1) return Boolean(state.style);
    if (state.step === 2) return state.lighting.length > 0;
    if (state.step === 3) return Boolean(state.road);
    if (state.step === 4) return state.lockViewFromReference || Boolean(state.camera);
    return true;
  };

  const handleNext = () => {
    if (state.step === 6) return;

    if (state.step === 5) {
      const prompts = state.lighting.map((lighting) => ({
        lighting,
        prompt: buildPrompt(
          state.style || "Modern Minimalist",
          [lighting],
          state.camera || "Front Elevation",
          state.road || "Dry",
          state.location,
          state.includePerson,
          state.cars,
          state.customStyle,
          state.lockViewFromReference,
        ),
      }));

      setState((current) => ({
        ...current,
        step: 6,
        generatedPrompts: prompts,
        copiedId: null,
      }));
      return;
    }

    setState((current) => ({ ...current, step: current.step + 1 }));
  };

  const handleBack = () => {
    if (state.step === 1) return;
    setState((current) => ({ ...current, step: current.step - 1 }));
  };

  const selectSingle = (key: "style" | "road" | "camera", value: string) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const toggleLighting = (value: string) => {
    setState((current) => ({
      ...current,
      lighting: current.lighting.includes(value)
        ? current.lighting.filter((entry) => entry !== value)
        : [...current.lighting, value],
    }));
  };

  const copyPrompt = async (id: string, prompt: string) => {
    await navigator.clipboard.writeText(prompt);
    setState((current) => ({ ...current, copiedId: id }));
    window.setTimeout(() => {
      setState((current) => ({ ...current, copiedId: null }));
    }, 1800);
  };

  const resetAll = () => {
    setState(createInitialState());
  };

  const renderStepContent = () => {
    if (state.step === 1) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 1 — architectural style'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            What architectural language should define the render?
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Choose a style for the building concept, or describe a custom direction.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {ARCHITECTURAL_STYLES.map((option) => {
              const selected = state.style === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectSingle("style", option)}
                  className={[
                    "rounded-full border border-border bg-surface px-3 py-2 text-left font-mono text-xs transition-all duration-200",
                    selected
                      ? "border-accent/70 bg-accent-soft/20 text-accent-soft"
                      : "text-secondary hover:border-accent/40 hover:text-foreground",
                  ].join(" ")}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {state.style === "Custom Style" ? (
            <div className="mt-6 rounded-md border border-border bg-surface p-4">
              <label className="font-mono text-[11px] uppercase tracking-[0.24em] text-secondary/70">
                custom style
              </label>
              <input
                value={state.customStyle}
                onChange={(event) =>
                  setState((current) => ({ ...current, customStyle: event.target.value }))
                }
                className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 font-readable text-sm text-foreground outline-none ring-0"
                placeholder="Describe the architectural style"
              />
            </div>
          ) : null}
        </div>
      );
    }

    if (state.step === 2) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 2 — time & lighting'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            Which light conditions should the scene use?
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Select one or more lighting moods. Each selection will become its own prompt variant.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {LIGHTING_OPTIONS.map((option) => {
              const selected = state.lighting.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleLighting(option)}
                  className={[
                    "rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs transition-all duration-200",
                    selected
                      ? "border-accent/70 bg-accent-soft/20 text-accent-soft"
                      : "text-secondary hover:border-accent/40 hover:text-foreground",
                  ].join(" ")}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (state.step === 3) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 3 — road & environment'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            How should the ground plane and atmosphere read?
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Choose the environmental condition that best frames the scene.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {ROAD_OPTIONS.map((option) => {
              const selected = state.road === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectSingle("road", option)}
                  className={[
                    "rounded-full border border-border bg-surface px-3 py-2 font-mono text-xs text-left transition-all duration-200",
                    selected
                      ? "border-accent/70 bg-accent-soft/20 text-accent-soft"
                      : "text-secondary hover:border-accent/40 hover:text-foreground",
                  ].join(" ")}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (state.step === 4) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 4 — camera angle'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            Which camera perspective fits the building best?
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Pick the angle that reveals the architecture most clearly.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {CAMERA_OPTIONS.map((option) => {
              const selected = state.camera === option;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={state.lockViewFromReference}
                  onClick={() => selectSingle("camera", option)}
                  className={[
                    "rounded-full border border-border bg-surface px-3 py-2 font-mono text-xs text-left transition-all duration-200",
                    state.lockViewFromReference
                      ? "cursor-not-allowed opacity-40"
                      : selected
                        ? "border-accent/70 bg-accent-soft/20 text-accent-soft"
                        : "text-secondary hover:border-accent/40 hover:text-foreground",
                  ].join(" ")}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-md border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="font-mono text-sm text-foreground">
                  Match & Lock View from Reference Image
                </span>
                <p className="mt-1 font-readable text-xs leading-5 text-secondary">
                  Use the reference image camera — ignore the angle pills above.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setState((current) => ({
                    ...current,
                    lockViewFromReference: !current.lockViewFromReference,
                    camera: !current.lockViewFromReference ? null : current.camera,
                  }))
                }
                className={[
                  "relative h-6 w-11 shrink-0 rounded-full border border-border transition-colors duration-200",
                  state.lockViewFromReference ? "bg-accent" : "bg-background",
                ].join(" ")}
                aria-label="Toggle match and lock view from reference image"
              >
                <span
                  className={[
                    "absolute top-0.5 h-5 w-5 rounded-full bg-background transition-transform duration-200",
                    state.lockViewFromReference ? "left-5" : "left-0.5",
                  ].join(" ")}
                />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (state.step === 5) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 5 — settings'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            Add the final scene details.
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Set a location, decide whether a human figure appears, and choose a vehicle treatment.
          </p>

          <div className="mt-8 space-y-6">
            <div className="rounded-md border border-border bg-surface p-4">
              <label className="font-mono text-[11px] uppercase tracking-[0.24em] text-secondary/70">
                location / region
              </label>
              <input
                value={state.location}
                onChange={(event) =>
                  setState((current) => ({ ...current, location: event.target.value }))
                }
                className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 font-readable text-sm text-foreground outline-none ring-0"
              />
            </div>

            <div className="rounded-md border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-sm text-foreground">Include Person</span>
                <button
                  type="button"
                  onClick={() =>
                    setState((current) => ({ ...current, includePerson: !current.includePerson }))
                  }
                  className={[
                    "relative h-6 w-11 rounded-full border border-border transition-colors duration-200",
                    state.includePerson ? "bg-accent" : "bg-background",
                  ].join(" ")}
                  aria-label="Toggle include person"
                >
                  <span
                    className={[
                      "absolute top-0.5 h-5 w-5 rounded-full bg-background transition-transform duration-200",
                      state.includePerson ? "left-5" : "left-0.5",
                    ].join(" ")}
                  />
                </button>
              </div>
            </div>

            <div className="rounded-md border border-border bg-surface p-4">
              <label className="font-mono text-[11px] uppercase tracking-[0.24em] text-secondary/70">
                cars
              </label>
              <div className="mt-3 flex flex-wrap gap-3">
                {CARS_OPTIONS.map((option) => {
                  const selected = state.cars === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setState((current) => ({ ...current, cars: option }))}
                      className={[
                        "rounded-full border border-border bg-background px-3 py-1 font-mono text-xs transition-all duration-200",
                        selected
                          ? "border-accent/70 bg-accent-soft/20 text-accent-soft"
                          : "text-secondary hover:border-accent/40 hover:text-foreground",
                      ].join(" ")}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (state.step === 6) {
      return (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-accent">{'// step 6 — prompt output'}</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                Ready to copy.
              </h2>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="font-mono text-sm text-secondary transition-colors hover:text-accent"
            >
              ↻ start_over()
            </button>
          </div>

          <div className="mt-8 space-y-5">
            {state.generatedPrompts.map((item) => (
              <div key={item.lighting} className="rounded-md border border-border bg-surface p-5 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {item.lighting}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyPrompt(item.lighting, item.prompt)}
                    className={[
                      "rounded-md border border-border px-3 py-2 font-mono text-xs transition-colors duration-200",
                      state.copiedId === item.lighting
                        ? "border-accent/70 text-accent"
                        : "text-secondary hover:border-accent/40 hover:text-foreground",
                    ].join(" ")}
                  >
                    {state.copiedId === item.lighting ? "✓ Copied" : "↗ Copy"}
                  </button>
                </div>
                <p className="mt-4 whitespace-pre-line font-readable text-sm leading-7 text-secondary">
                  {item.prompt}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col px-6 py-8 sm:py-10">
      <div className="rounded-md border border-border bg-surface/80 p-4 shadow-soft backdrop-blur-sm sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="font-mono text-sm font-semibold text-foreground">
            <span className="text-accent">&lt;</span>BlueprintAI
            <span className="text-accent">/&gt;</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-border sm:w-32">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${(state.step / 6) * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-secondary">
              Step {state.step}/6
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-md border border-border bg-background/70 p-6 shadow-soft sm:p-8">
        {renderStepContent()}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-md border border-border bg-surface/80 p-4 shadow-soft">
        <button
          type="button"
          onClick={handleBack}
          disabled={state.step === 1}
          className="rounded-md border border-border px-4 py-2 font-mono text-sm text-secondary transition-colors hover:border-accent/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed()}
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-background transition-shadow hover:shadow-glow disabled:cursor-not-allowed disabled:bg-surface disabled:text-secondary disabled:shadow-none"
        >
          {state.step === 5 ? "Generate Prompts" : "Next →"}
        </button>
      </div>
    </div>
  );
}
