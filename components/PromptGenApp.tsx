"use client";

import { useMemo, useState } from "react";

type PromptGenState = {
  step: number;
  category: string | null;
  presentationStyles: string[];
  modelDetails: Record<string, string[]>;
  shotSetup: Record<string, string[]>;
  backgrounds: string[];
  lighting: string[];
  imageStyles: string[];
  moods: string[];
  textOverlayEnabled: boolean;
  textOverlay: Record<string, string[]>;
  imageSize: string | null;
  generatedOutput: { prompt: string; details: unknown } | null;
  copied: boolean;
};

const CATEGORIES = [
  "Beauty",
  "Clothes",
  "Food",
  "Electronics (handheld)",
  "Appliance",
];

const PRESENTATION_STYLES: Record<string, string[]> = {
  Beauty: [
    "Jar upright on surface",
    "Bottle standing upright",
    "Product laid flat",
    "Multiple products stacked",
    "Cap removed / open product",
    "Product with spill / texture shown",
    "Model holding product",
    "Model applying product",
  ],
  Clothes: [
    "Flat lay / folded",
    "On hanger",
    "Ghost mannequin",
    "Worn by model — full body",
    "Worn by model — half body",
    "Detail / fabric close-up",
  ],
  Food: [
    "Plated on dish",
    "In original packaging",
    "Surrounded by ingredients",
    "Held in hand",
    "Close-up macro of texture",
    "Mid-action (pouring, cutting, biting)",
    "Styled with props / tableware",
  ],
  "Electronics (handheld)": [
    "Floating / levitating",
    "On desk / flat surface",
    "Held in hand",
    "On charging stand",
    "Inside open box (unboxing)",
    "In use / worn (earbuds, watch)",
    "Detail / port close-up",
  ],
  Appliance: [
    "Standalone on counter",
    "In use — model interacting",
    "Lifestyle scene (kitchen / living room)",
    "Isolated on white studio",
    "Detail / control panel close-up",
    "Side / three-quarter angle hero",
  ],
};

const MODEL_DETAILS: Record<string, string[]> = {
  Gender: ["Female", "Male", "Non-binary / unspecified"],
  "Age range": [
    "Teen (15–18)",
    "Young adult (19–28)",
    "Adult (29–45)",
    "Mature (46+)",
  ],
  Ethnicity: [
    "East Asian",
    "Southeast Asian",
    "South Asian",
    "Black",
    "Latino / Hispanic",
    "White / Caucasian",
    "Middle Eastern",
    "Mixed",
    "Unspecified",
  ],
  "Body framing": ["Hands only", "Half body", "Full body", "Face + product"],
};

const SHOT_SETUP: Record<string, string[]> = {
  "Camera angle": [
    "Top-down / flat lay",
    "45° angle",
    "Eye-level",
    "Low angle",
    "Macro / extreme close-up",
  ],
  "Shot distance": ["Wide shot", "Medium shot", "Tight crop / hero shot"],
};

const BACKGROUNDS = [
  "White studio",
  "Seamless gradient",
  "Dark / moody black",
  "Marble",
  "Wood surface",
  "Concrete",
  "Pastel solid color",
  "Lifestyle scene (indoor)",
  "Outdoor / natural setting",
  "Bokeh / blurred background",
];

const LIGHTING = [
  "Soft box",
  "Natural window light",
  "Golden hour",
  "Neon accent",
  "Hard dramatic light",
  "Rim light",
  "Ring light",
  "Backlit / silhouette",
  "Studio strobe",
];

const IMAGE_STYLE = [
  "Social media (IG / TikTok / Pinterest)",
  "Advertisement (bold, product hero)",
  "Editorial (magazine, artistic)",
];

const MOODS = [
  "Luxury",
  "Minimal",
  "Vibrant",
  "Rustic",
  "Cinematic",
  "Clean commercial",
  "Dark & moody",
  "Pastel soft",
  "Editorial bold",
  "Earthy / organic",
];

const TEXT_OVERLAY: Record<string, string[]> = {
  "Font style": [
    "Bold sans-serif",
    "Elegant serif",
    "Handwritten script",
    "Neon glow",
    "Minimal outline",
    "Grunge / distressed",
    "Retro stamp",
  ],
  Placement: ["Top center", "Center", "Bottom center", "Bottom corner", "Top corner"],
  "Color tone": ["White / light", "Black / dark", "Gold", "Vibrant / colorful", "Metallic silver"],
};

const IMAGE_SIZES = [
  "TikTok / IG Stories & Reels — 9:16",
  "Instagram / Facebook feed — 1:1",
  "Instagram portrait feed — 4:5",
  "Facebook / Google display ad — 16:9",
  "Pinterest / long-form feed — 2:3",
  "Shopee / Lazada product listing — 1:1",
  "Twitter / X post — 16:9",
  "LinkedIn post — 1.91:1",
  "Print / billboard — 4:3",
];

function isModelInclusive(styles: string[]) {
  const keywords = ["model", "worn", "held", "hand", "in use"];
  return styles.some((style) =>
    keywords.some((keyword) => style.toLowerCase().includes(keyword)),
  );
}

function createInitialState(): PromptGenState {
  return {
    step: 1,
    category: null,
    presentationStyles: [],
    modelDetails: {},
    shotSetup: {},
    backgrounds: [],
    lighting: [],
    imageStyles: [],
    moods: [],
    textOverlayEnabled: false,
    textOverlay: {},
    imageSize: null,
    generatedOutput: null,
    copied: false,
  };
}

function toggleInList(list: string[], item: string) {
  return list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];
}

function toggleNestedObject(
  object: Record<string, string[]>,
  group: string,
  item: string,
) {
  const nextGroup = object[group] ?? [];
  return {
    ...object,
    [group]: toggleInList(nextGroup, item),
  };
}

export function PromptGenApp() {
  const [state, setState] = useState<PromptGenState>(createInitialState);

  const showModelStep = useMemo(() => {
    return !!state.category && isModelInclusive(state.presentationStyles);
  }, [state.category, state.presentationStyles]);

  const canGenerate = !!state.category && state.presentationStyles.length > 0;

  const updateStep = (nextStep: number) => {
    setState((current) => ({ ...current, step: nextStep }));
  };

  const handleNext = () => {
    if (state.step === 10) {
      generatePrompt();
      return;
    }

    if (state.step === 2 && !showModelStep) {
      updateStep(4);
      return;
    }

    updateStep(state.step + 1);
  };

  const handleBack = () => {
    if (state.step === 4 && !showModelStep) {
      updateStep(2);
      return;
    }

    updateStep(Math.max(1, state.step - 1));
  };

  const toggleMultiSelection = (key: string, value: string) => {
    setState((current) => {
      if (key.includes("::")) {
        const [objectKey, group] = key.split("::");
        if (objectKey === "modelDetails") {
          return {
            ...current,
            modelDetails: toggleNestedObject(current.modelDetails, group, value),
          };
        }
        if (objectKey === "shotSetup") {
          return {
            ...current,
            shotSetup: toggleNestedObject(current.shotSetup, group, value),
          };
        }
        if (objectKey === "textOverlay") {
          return {
            ...current,
            textOverlay: toggleNestedObject(current.textOverlay, group, value),
          };
        }
      }

      if (key === "presentationStyles") {
        return {
          ...current,
          presentationStyles: toggleInList(current.presentationStyles, value),
        };
      }
      if (key === "backgrounds") {
        return {
          ...current,
          backgrounds: toggleInList(current.backgrounds, value),
        };
      }
      if (key === "lighting") {
        return {
          ...current,
          lighting: toggleInList(current.lighting, value),
        };
      }
      if (key === "imageStyles") {
        return {
          ...current,
          imageStyles: toggleInList(current.imageStyles, value),
        };
      }
      if (key === "moods") {
        return {
          ...current,
          moods: toggleInList(current.moods, value),
        };
      }

      return current;
    });
  };

  const handleSingleSelection = (key: string, value: string) => {
    setState((current) => {
      if (key === "category") {
        return {
          ...current,
          category: value,
          presentationStyles: [],
          modelDetails: {},
        };
      }
      if (key === "imageSize") {
        return {
          ...current,
          imageSize: value,
        };
      }
      return current;
    });
  };

  const generatePrompt = () => {
    const hardcoded =
      "Use the reference image for the product appearance only (shape, color, label, finish, packaging). Do not follow its composition, lighting, or background — those are defined in this prompt.";
    const parts: string[] = [];

    if (state.category) {
      parts.push(`A professional product photograph of ${state.category.toLowerCase()} items.`);
    }
    if (state.presentationStyles.length) {
      parts.push(`The presentation style is ${state.presentationStyles.join(", ")}.`);
    }

    if (showModelStep) {
      const modelParts: string[] = [];
      if (state.modelDetails["Gender"]?.length) {
        modelParts.push(state.modelDetails["Gender"].join("/"));
      }
      if (state.modelDetails["Age range"]?.length) {
        modelParts.push(state.modelDetails["Age range"].join(", "));
      }
      if (state.modelDetails.Ethnicity?.length) {
        modelParts.push(state.modelDetails.Ethnicity.join(", "));
      }
      if (state.modelDetails["Body framing"]?.length) {
        modelParts.push(`framed as ${state.modelDetails["Body framing"].join(", ")}`);
      }
      if (modelParts.length) {
        parts.push(`Featuring a model who is ${modelParts.join(" ")}.`);
      }
    }

    const setupParts: string[] = [];
    if (state.shotSetup["Camera angle"]?.length) {
      setupParts.push(`shot from a ${state.shotSetup["Camera angle"].join(" and ")} angle`);
    }
    if (state.shotSetup["Shot distance"]?.length) {
      setupParts.push(`with a ${state.shotSetup["Shot distance"].join(" and ")}`);
    }
    if (setupParts.length) {
      parts.push(`The scene is ${setupParts.join(" ")}.`);
    }

    if (state.backgrounds.length) {
      parts.push(`The background features ${state.backgrounds.join(", ")}.`);
    }
    if (state.lighting.length) {
      parts.push(`Illuminated by ${state.lighting.join(", ")} lighting.`);
    }
    if (state.imageStyles.length) {
      parts.push(`Styled for ${state.imageStyles.join(", ")}.`);
    }
    if (state.moods.length) {
      parts.push(`The overall mood is ${state.moods.join(", ")}.`);
    }

    if (state.textOverlayEnabled) {
      const textParts: string[] = [];
      if (state.textOverlay["Font style"]?.length) {
        textParts.push(`in ${state.textOverlay["Font style"].join(", ")} font`);
      }
      if (state.textOverlay.Placement?.length) {
        textParts.push(`placed at the ${state.textOverlay.Placement.join(", ")}`);
      }
      if (state.textOverlay["Color tone"]?.length) {
        textParts.push(`with a ${state.textOverlay["Color tone"].join(", ")} color tone`);
      }
      if (textParts.length) {
        parts.push(`Includes text overlay ${textParts.join(" ")}.`);
      }
    }

    if (state.imageSize) {
      parts.push(`The final image should be optimized for ${state.imageSize}.`);
    }

    const prompt = `${hardcoded} ${parts.join(" ")}`;
    const details = {
      category: state.category,
      presentationStyles: state.presentationStyles,
      modelDetails: showModelStep ? state.modelDetails : null,
      shotSetup: state.shotSetup,
      backgrounds: state.backgrounds,
      lighting: state.lighting,
      imageStyles: state.imageStyles,
      moods: state.moods,
      textOverlay: state.textOverlayEnabled ? state.textOverlay : null,
      imageSize: state.imageSize,
    };

    setState((current) => ({
      ...current,
      step: 11,
      generatedOutput: { prompt, details },
      copied: false,
    }));
  };

  const copyToClipboard = async () => {
    if (!state.generatedOutput) {
      return;
    }

    const text = JSON.stringify(state.generatedOutput, null, 2);
    await navigator.clipboard.writeText(text);
    setState((current) => ({ ...current, copied: true }));
    window.setTimeout(() => {
      setState((current) => ({ ...current, copied: false }));
    }, 2000);
  };

  const resetAll = () => {
    setState(createInitialState());
  };

  const renderStepContent = () => {
    if (state.step === 1) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 1 — product category'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            What are you photographing?
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Choose the product category to tailor the rest of the prompt.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {CATEGORIES.map((option) => {
              const selected = state.category === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSingleSelection("category", option)}
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

    if (state.step === 2) {
      const options = state.category ? PRESENTATION_STYLES[state.category] ?? [] : [];
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 2 — presentation style'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            How should it be presented?
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Select all presentation styles that apply.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {options.map((option) => {
              const selected = state.presentationStyles.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleMultiSelection("presentationStyles", option)}
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

    if (state.step === 3 && showModelStep) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 3 — model details'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            Describe the model
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Your presentation style includes a model — set the details below.
          </p>
          <div className="mt-8 space-y-6">
            {Object.entries(MODEL_DETAILS).map(([group, options]) => (
              <div key={group}>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary/70">
                  {group}
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {options.map((option) => {
                    const selected = state.modelDetails[group]?.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleMultiSelection(`modelDetails::${group}`, option)}
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
            ))}
          </div>
        </div>
      );
    }

    if (state.step === 4) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 4 — shot setup'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            Camera angle & distance
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Define how the shot is framed.
          </p>
          <div className="mt-8 space-y-6">
            {Object.entries(SHOT_SETUP).map(([group, options]) => (
              <div key={group}>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary/70">
                  {group}
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {options.map((option) => {
                    const selected = state.shotSetup[group]?.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleMultiSelection(`shotSetup::${group}`, option)}
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
            ))}
          </div>
        </div>
      );
    }

    if (state.step === 5) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 5 — background'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            Choose the environment
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Pick one or more backgrounds for the shot.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {BACKGROUNDS.map((option) => {
              const selected = state.backgrounds.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleMultiSelection("backgrounds", option)}
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

    if (state.step === 6) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 6 — lighting'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            Define the lighting setup
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Select the lighting style(s) that fit the mood.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {LIGHTING.map((option) => {
              const selected = state.lighting.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleMultiSelection("lighting", option)}
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

    if (state.step === 7) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 7 — image style / usage'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            What&apos;s this image for?
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Select the intended use case.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {IMAGE_STYLE.map((option) => {
              const selected = state.imageStyles.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleMultiSelection("imageStyles", option)}
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

    if (state.step === 8) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 8 — mood / aesthetic'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            What vibe should it convey?
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Select one or more moods.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {MOODS.map((option) => {
              const selected = state.moods.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleMultiSelection("moods", option)}
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

    if (state.step === 9) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 9 — text overlay'}</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Add text overlay?
            </h2>
            <button
              type="button"
              onClick={() =>
                setState((current) => ({
                  ...current,
                  textOverlayEnabled: !current.textOverlayEnabled,
                }))
              }
              className={[
                "relative h-6 w-11 rounded-full border border-border transition-colors duration-200",
                state.textOverlayEnabled ? "bg-accent" : "bg-surface",
              ].join(" ")}
              aria-label="Toggle text overlay"
            >
              <span
                className={[
                  "absolute top-0.5 h-5 w-5 rounded-full bg-background transition-transform duration-200",
                  state.textOverlayEnabled ? "left-5" : "left-0.5",
                ].join(" ")}
              />
            </button>
          </div>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Optional — turn on to configure font, placement, and color.
          </p>
          {state.textOverlayEnabled ? (
            <div className="mt-8 space-y-6">
              {Object.entries(TEXT_OVERLAY).map(([group, options]) => (
                <div key={group}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary/70">
                    {group}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {options.map((option) => {
                      const selected = state.textOverlay[group]?.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleMultiSelection(`textOverlay::${group}`, option)}
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
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    if (state.step === 10) {
      return (
        <div>
          <p className="font-mono text-sm text-accent">{'// step 10 — image size / platform'}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            Select the output format
          </h2>
          <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
            Choose the platform or aspect ratio this image is for.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {IMAGE_SIZES.map((option) => {
              const selected = state.imageSize === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSingleSelection("imageSize", option)}
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

    if (state.step === 11 && state.generatedOutput) {
      return (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              {'// Generated Prompt'}
            </h2>
            <button
              type="button"
              onClick={resetAll}
              className="font-mono text-sm text-secondary transition-colors hover:text-accent"
            >
              ↻ start_over()
            </button>
          </div>

          <div className="mt-8 rounded-md border border-border bg-surface p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-secondary/70">
                json output
              </span>
              <button
                type="button"
                onClick={copyToClipboard}
                className={[
                  "rounded-md border border-border px-3 py-2 font-mono text-xs transition-colors duration-200",
                  state.copied
                    ? "border-accent/70 text-accent"
                    : "text-secondary hover:border-accent/40 hover:text-foreground",
                ].join(" ")}
              >
                {state.copied ? "✓ Copied!" : "↗ Copy JSON"}
              </button>
            </div>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-secondary">
              {JSON.stringify(state.generatedOutput, null, 2)}
            </pre>
          </div>

          <div className="mt-6 rounded-md border border-border bg-surface p-6 shadow-soft">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-secondary/70">
              prompt preview
            </span>
            <p className="mt-3 font-readable text-base leading-8 text-foreground">
              “{state.generatedOutput.prompt}”
            </p>
          </div>

          <p className="mt-8 text-center font-mono text-sm text-secondary/70">
            {'// generated with PromptGen — built by '}{" "}
            <a
              href="https://clydeabenojar.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary transition-colors hover:text-accent"
            >
              Clyde Abenojar
            </a>
          </p>
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
            <span className="text-accent">&lt;</span>PromptGen
            <span className="text-accent">/&gt;</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-border sm:w-32">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${(state.step / 10) * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-secondary">
              Step {state.step}/10
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-md border border-border bg-background/70 p-6 shadow-soft sm:p-8">
        {renderStepContent()}
      </div>

      {state.step < 11 ? (
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
            disabled={state.step === 10 && !canGenerate}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-background transition-shadow hover:shadow-glow disabled:cursor-not-allowed disabled:bg-surface disabled:text-secondary disabled:shadow-none"
          >
            {state.step === 10 ? "Generate Prompt" : "Next →"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
