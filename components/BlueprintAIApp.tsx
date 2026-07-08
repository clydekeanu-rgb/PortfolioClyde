"use client";

import { useState } from "react";

type BlueprintAIState = {
  step: number;
  style: string | null;
  customStyle: string;
  lighting: string[];
  road: string | null;
  camera: string | null;
  location: string;
  includePerson: boolean;
  cars: string;
  generatedPrompts: { lighting: string; prompt: string }[];
  copiedId: string | null;
};

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

const STYLE_MAP: Record<string, string> = {
  "Modern Minimalist":
    "a modern minimalist architectural composition with clean lines, crisp geometry, expansive glazing, and refined materiality",
  Industrial:
    "an industrial architectural scene with raw concrete, steel, exposed structure, and bold massing",
  "Tropical Resort":
    "a tropical resort architecture concept with airy volumes, lush landscaping, and relaxed luxury",
  Japandi:
    "a Japandi architectural design with warm wood, restrained geometry, and serene balance",
  Biophilic:
    "a biophilic architectural concept that blends nature, greenery, and organic connection to the site",
  "Neo-Mediterranean":
    "a neo-Mediterranean architectural concept with warm stone, arches, soft light, and timeless elegance",
  Parametric:
    "a parametric architectural form with fluid geometry, computational rhythm, and sculptural precision",
  Brutalist:
    "a brutalist architectural composition with monolithic forms, tactile concrete, and dramatic shadows",
};

const LIGHT_MAP: Record<string, string> = {
  Daytime: "soft daylight with crisp clarity and balanced contrast",
  "Golden Hour": "golden hour warmth with long directional shadows and cinematic glow",
  "Blue Hour": "blue hour ambience with cool twilight tones and atmospheric depth",
  Night: "night lighting with moody illumination and strong contrast",
};

const CAM_MAP: Record<string, string> = {
  "Front Elevation": "captured in a clean front elevation view",
  "3/4 Perspective": "captured in a three-quarter perspective that reveals depth and massing",
  "Street-Level Wide": "captured from street level in a wide composition",
  "Aerial/Bird's Eye": "captured from a dramatic aerial bird's-eye view",
};

const ROAD_MAP: Record<string, string> = {
  Dry: "on a dry, sun-baked surface with clean texture and warm atmosphere",
  Wet: "after rain with reflective wet pavement and glossy surfaces",
  Puddles: "with scattered puddles and rich reflections across the ground plane",
  Snowy: "in a snowy environment with crisp white atmosphere and quiet texture",
};

function createInitialState(): BlueprintAIState {
  return {
    step: 1,
    style: null,
    customStyle: "",
    lighting: [],
    road: null,
    camera: null,
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
) {
  const styleText = style === "Custom Style"
    ? (customStyle.trim() || "a custom architectural language described by the user")
    : STYLE_MAP[style] || style;

  const lightingText = lighting.length > 0
    ? lighting.map((entry) => LIGHT_MAP[entry]).join(" and ")
    : "balanced cinematic lighting";

  const cameraText = CAM_MAP[camera || "Front Elevation"] || "captured in a polished architectural composition";
  const roadText = ROAD_MAP[road || "Dry"] || "in a refined urban setting";

  const promptParts = [
    `A photorealistic architectural render of ${styleText}, ${cameraText}, ${roadText}, and ${lightingText}.`,
    `Set in ${location || "a striking contemporary setting"}.`,
  ];

  if (includePerson) {
    promptParts.push("Include one human figure to show scale and lived-in atmosphere.");
  }

  if (cars !== "No Cars") {
    promptParts.push(`Include ${cars.toLowerCase()} in the scene.`);
  }

  promptParts.push(
    "Ultra-detailed, cinematic composition, realistic materials, sharp focus, atmospheric depth, high-end visualization, and polished editorial quality.",
  );

  return promptParts.join(" ");
}

export function BlueprintAIApp() {
  const [state, setState] = useState<BlueprintAIState>(createInitialState);

  const canProceed = () => {
    if (state.step === 1) return Boolean(state.style);
    if (state.step === 2) return state.lighting.length > 0;
    if (state.step === 3) return Boolean(state.road);
    if (state.step === 4) return Boolean(state.camera);
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
          <h2 className="mt-2 text-2xl font-semibold text-primary sm:text-3xl">
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
                      : "text-secondary hover:border-accent/40 hover:text-primary",
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
                className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 font-readable text-sm text-primary outline-none ring-0"
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
          <h2 className="mt-2 text-2xl font-semibold text-primary sm:text-3xl">
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
                      : "text-secondary hover:border-accent/40 hover:text-primary",
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
          <h2 className="mt-2 text-2xl font-semibold text-primary sm:text-3xl">
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
                      : "text-secondary hover:border-accent/40 hover:text-primary",
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
          <h2 className="mt-2 text-2xl font-semibold text-primary sm:text-3xl">
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
                  onClick={() => selectSingle("camera", option)}
                  className={[
                    "rounded-full border border-border bg-surface px-3 py-2 font-mono text-xs text-left transition-all duration-200",
                    selected
                      ? "border-accent/70 bg-accent-soft/20 text-accent-soft"
                      : "text-secondary hover:border-accent/40 hover:text-primary",
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

    if (state.step === 5) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 5 — settings'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-primary sm:text-3xl">
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
                className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 font-readable text-sm text-primary outline-none ring-0"
              />
            </div>

            <div className="rounded-md border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-sm text-primary">Include Person</span>
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
                          : "text-secondary hover:border-accent/40 hover:text-primary",
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
              <h2 className="mt-2 text-2xl font-semibold text-primary sm:text-3xl">
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
                  <span className="font-mono text-sm font-semibold text-primary">
                    {item.lighting}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyPrompt(item.lighting, item.prompt)}
                    className={[
                      "rounded-md border border-border px-3 py-2 font-mono text-xs transition-colors duration-200",
                      state.copiedId === item.lighting
                        ? "border-accent/70 text-accent"
                        : "text-secondary hover:border-accent/40 hover:text-primary",
                    ].join(" ")}
                  >
                    {state.copiedId === item.lighting ? "✓ Copied" : "↗ Copy"}
                  </button>
                </div>
                <p className="mt-4 font-readable text-sm leading-7 text-secondary">
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
          <div className="font-mono text-sm font-semibold text-primary">
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
          className="rounded-md border border-border px-4 py-2 font-mono text-sm text-secondary transition-colors hover:border-accent/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
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
