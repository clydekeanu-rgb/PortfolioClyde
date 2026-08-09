"use client";

import { useEffect, useState } from "react";

type Chip = { label: string; value: string };

type FieldKey =
  | "location"
  | "time"
  | "outfit"
  | "pose"
  | "hands"
  | "expression"
  | "camera";

type CharGenState = {
  step: number;
  shotType: "normal" | "selfie";
  selfieAngle: string | null;
  selfieHand: string | null;
  selfieMirror: string | null;
  location: string | null;
  locationOther: string;
  time: string | null;
  timeOther: string;
  outfit: string | null;
  outfitOther: string;
  pose: string | null;
  poseOther: string;
  hands: string | null;
  handsOther: string;
  expression: string | null;
  expressionOther: string;
  camera: string | null;
  cameraOther: string;
  showBold: { location: boolean; outfit: boolean; pose: boolean };
  generatedPrompt: string;
  editedPrompt: string;
  copied: boolean;
};

const TOTAL_STEPS = 9;
const PROMPT_LIMIT = 800;
const STORAGE_KEY = "cg_pr";
const OTHER = "__other__";

const SELFIE_ANGLES: Chip[] = [
  {
    label: "Eye Level",
    value: "arm extended at eye level, classic front-facing selfie",
  },
  {
    label: "High Angle",
    value:
      "arm raised above head angling camera slightly downward, high-angle selfie",
  },
  {
    label: "Low Angle",
    value:
      "arm extended slightly below eye level, camera angled slightly upward, low-angle selfie",
  },
  {
    label: "Side Diagonal",
    value:
      "arm extended to one side at a diagonal, camera angled back toward her face, off-center candid selfie",
  },
];

const SELFIE_HANDS: Chip[] = [
  {
    label: "Right Hand",
    value: "right hand holding phone, thumb on side, fingers wrapped naturally",
  },
  {
    label: "Left Hand",
    value: "left hand holding phone, thumb on side, fingers wrapped naturally",
  },
  {
    label: "Both Hands",
    value:
      "both hands gripping the phone, one holding, one steadying — two-handed selfie grip",
  },
];

const SELFIE_MIRROR: Chip[] = [
  {
    label: "Direct",
    value: "direct front-facing selfie, no mirror",
  },
  {
    label: "Mirror",
    value:
      "mirror selfie — standing in front of a wall mirror, phone and hand visible in reflection",
  },
];

const LOCATIONS: Chip[] = [
  {
    label: "Living Room",
    value:
      "living room of a typical Filipino home, worn sala set, tiled floor, electric fan nearby",
  },
  {
    label: "Bedroom",
    value:
      "small Filipino bedroom, single bed with printed sheets, low dresser, jalousie window",
  },
  {
    label: "Kitchen",
    value:
      "Filipino home kitchen, gas range, rice cooker, tiled walls, fluorescent light",
  },
  {
    label: "Bathroom Door",
    value:
      "bathroom doorway of a Philippine home, wooden door, tabo and timba visible, tiled floor",
  },
  {
    label: "School",
    value:
      "Philippine school hallway, painted concrete walls, bulletin board, classroom doors",
  },
  {
    label: "Minimart",
    value:
      "small Philippine minimart, fluorescent lighting, refrigerator units, snack shelves",
  },
  {
    label: "Rooftop",
    value:
      "Philippine rooftop, concrete parapet wall, water tank, hazy sky, laundry lines",
  },
  {
    label: "Jeepney Stop",
    value:
      "Philippine jeepney stop, colorful jeepney in background, concrete sidewalk",
  },
  {
    label: "Palengke",
    value:
      "Philippine wet market entrance, corrugated iron roof, wet concrete floor, produce stalls",
  },
  {
    label: "Sari-Sari",
    value:
      "small Philippine sari-sari store, wooden shelves with snacks and sachets, wire mesh counter",
  },
];

const BOLD_LOCATIONS: Chip[] = [
  {
    label: "Beach",
    value:
      "tropical Philippine beach, white sand, golden hour, waves in background, near the water's edge",
  },
  {
    label: "Hotel Room",
    value:
      "dim warmly-lit hotel room, unmade white bed, sheer curtains, warm window light, intimate setting",
  },
  {
    label: "Bathroom",
    value:
      "steamy tiled bathroom, fogged mirror, soft warm backlight, post-shower atmosphere",
  },
  {
    label: "Bar / Club",
    value:
      "low-lit Philippine bar, neon lights, dark ambient, bar counter in background, night crowd behind her",
  },
  {
    label: "Car Backseat",
    value:
      "car backseat, tinted windows, soft ambient seat light, leather seat visible, parked at night",
  },
  {
    label: "Poolside",
    value:
      "poolside at a Philippine resort, blue pool water reflecting light, wet concrete deck, warm afternoon sun",
  },
];

const TIMES: Chip[] = [
  {
    label: "Midday",
    value: "midday, bright harsh overhead sunlight, strong shadows",
  },
  {
    label: "Late Afternoon",
    value: "late afternoon, warm golden side-light, long soft shadows",
  },
  {
    label: "Morning",
    value: "early morning, soft diffused light, cool blue-white tones",
  },
  {
    label: "Dusk",
    value:
      "blue hour or dusk, fading light, cool tones, interior lights beginning to glow",
  },
  {
    label: "Night",
    value:
      "nighttime, artificial indoor lighting only, fluorescent or warm bulb light, deep shadows",
  },
  {
    label: "Overcast",
    value:
      "overcast day, flat even diffused light, soft shadows, no harsh highlights",
  },
];

const OUTFITS: Chip[] = [
  {
    label: "Sando + Shorts",
    value:
      "plain white or pastel sando and maong shorts, typical casual Filipina home wear",
  },
  {
    label: "School Uniform",
    value:
      "school uniform, white polo blouse, pleated skirt, ID lanyard, Philippine school style",
  },
  {
    label: "Daster",
    value:
      "daster, loose Filipino house dress, floral or checkered cotton print, comfortable",
  },
  {
    label: "Oversized Tee",
    value:
      "casual oversized t-shirt and sweatpants or pajama pants, at-home loungewear",
  },
  {
    label: "Jeans + Tee",
    value:
      "jeans and a plain fitted t-shirt, casual everyday Filipino street wear",
  },
  {
    label: "Summer Dress",
    value: "simple summer dress, light cotton, floral or plain, knee-length",
  },
  {
    label: "Athletic Wear",
    value: "athletic wear, sports tank top with leggings or jogging pants",
  },
];

const BOLD_OUTFITS: Chip[] = [
  {
    label: "Bikini + Shorts",
    value:
      "tied bikini top in a tropical print, paired with denim cutoff shorts, beach-ready",
  },
  {
    label: "One-Piece Swimsuit",
    value:
      "form-fitting one-piece swimsuit, slightly wet from the pool, natural drape",
  },
  {
    label: "Crop Top + Low-rise",
    value:
      "fitted crop top with low-rise jeans, midriff showing, relaxed Gen Z energy",
  },
  {
    label: "Sports Bra + Shorts",
    value: "sports bra and biker shorts, athleisure, form-fitting, natural body",
  },
  {
    label: "Mini Dress",
    value:
      "short fitted mini dress, hemline above the knee, casual going-out look",
  },
  {
    label: "Wrapped Towel",
    value:
      "wrapped in a bath towel only, tucked at the chest, post-shower, bare shoulders",
  },
];

const POSES: Chip[] = [
  {
    label: "Standing",
    value: "standing naturally, weight shifted to one leg, arms relaxed at sides",
  },
  {
    label: "Sitting",
    value:
      "sitting on a chair or couch, legs together, back relaxed, hands in lap",
  },
  {
    label: "Leaning on Wall",
    value: "leaning against a wall with one shoulder, arms loosely crossed",
  },
  {
    label: "Floor Sit",
    value:
      "sitting on the floor, legs to one side, one hand supporting on the floor",
  },
  {
    label: "Walking",
    value: "walking slowly and naturally, mid-stride, arms moving loosely",
  },
  {
    label: "Looking Away",
    value:
      "looking away from camera, gaze off-frame, chin turned, candid moment",
  },
];

const BOLD_POSES: Chip[] = [
  {
    label: "Lying on Bed",
    value:
      "lying on her back or side on a bed, head propped on one hand, legs relaxed, candid",
  },
  {
    label: "In Water",
    value:
      "standing ankle-deep at the shoreline, looking back at camera over shoulder",
  },
  {
    label: "Window Lean",
    value:
      "back leaning against a large window, soft backlight silhouette, arms loosely at sides",
  },
  {
    label: "Doorframe",
    value:
      "one shoulder leaning against a doorframe, weight shifted to one hip, relaxed",
  },
  {
    label: "Against Wall",
    value:
      "sitting on the floor with back against a wall or bed frame, knees slightly bent",
  },
  {
    label: "Arching Back",
    value:
      "standing with a subtle back arch, one hand on hip, chin slightly tilted up, confident",
  },
];

const HANDS: Chip[] = [
  {
    label: "Natural",
    value: "arms naturally at sides, no deliberate hand placement",
  },
  {
    label: "Collarbone",
    value:
      "one hand resting at her collarbone, fingertips lightly touching skin",
  },
  {
    label: "Hand on Hip",
    value: "one hand on her hip, palm flat, elbow angled out naturally",
  },
  {
    label: "Both on Hips",
    value:
      "both hands on hips, palms flat, elbows angled out, shoulders relaxed",
  },
  {
    label: "Holding Own Arm",
    value:
      "one arm slightly crossed, hand resting loosely on opposite forearm",
  },
  {
    label: "In Pockets",
    value: "one or both hands in pockets, thumbs hooked in denim",
  },
  {
    label: "Holding Prop",
    value:
      "one hand holding a small prop, a coffee cup or small bag, casually",
  },
  {
    label: "Fingers at Lips",
    value: "fingertips of one hand lightly resting at her lips",
  },
  {
    label: "Limp Wrist",
    value:
      "wrist bent inward, hand loosely drooped, a delicate limp-wrist gesture",
  },
];

const EXPRESSIONS: Chip[] = [
  {
    label: "Neutral",
    value:
      "neutral-soft expression, calm eyes at camera, mouth gently closed, relaxed jaw",
  },
  {
    label: "Faint Smile",
    value:
      "soft faint almost-smile, relaxed eyes with warmth, mouth mostly closed",
  },
  {
    label: "Sleepy",
    value:
      "slightly sleepy and relaxed, eyes soft and barely heavy, warm at corners",
  },
  {
    label: "Shy Soft",
    value:
      "mild self-conscious faint smile, low-effort, aware of camera but not performing",
  },
  {
    label: "Serious",
    value: "direct and mildly serious gaze at camera, mouth softly closed",
  },
  {
    label: "Distracted",
    value:
      "slightly distracted, eyes angled just off-camera, mouth softly parted",
  },
  {
    label: "Downward",
    value:
      "soft downward gaze, eyes looking slightly down, quiet introspective look",
  },
  {
    label: "Mid-Blink",
    value:
      "natural mid-blink, caught in a slow blink, a genuine unplanned moment",
  },
  {
    label: "Lips Parted",
    value:
      "lips slightly parted and relaxed as if mid-breath, eyes soft at camera",
  },
];

const CAMERAS: Chip[] = [
  {
    label: "iPhone 7",
    value:
      "iPhone 7 realism: warm color rendering, limited dynamic range, digital noise, JPEG artifacts",
  },
  {
    label: "iPhone 12",
    value:
      "iPhone 12 realism: clean and sharp, improved dynamic range, accurate skin tones, minimal noise",
  },
  {
    label: "Old Android",
    value:
      "old Android: oversaturated colors, strong digital noise, aggressive edge sharpening",
  },
  {
    label: "Low-Light",
    value:
      "grainy low-light phone photo: high ISO noise, motion blur, underexposed shadows, warm cast",
  },
  {
    label: "DSLR 50mm",
    value:
      "entry-level DSLR 50mm: natural perspective, clean sharp subject, shallow depth, grain at ISO 800",
  },
  {
    label: "DSLR 85mm",
    value:
      "mirrorless 85mm portrait: telephoto perspective, soft background separation, accurate skin tones",
  },
];

function createInitialState(): CharGenState {
  return {
    step: 1,
    shotType: "normal",
    selfieAngle: SELFIE_ANGLES[0].value,
    selfieHand: SELFIE_HANDS[0].value,
    selfieMirror: SELFIE_MIRROR[0].value,
    location: null,
    locationOther: "",
    time: null,
    timeOther: "",
    outfit: null,
    outfitOther: "",
    pose: null,
    poseOther: "",
    hands: null,
    handsOther: "",
    expression: null,
    expressionOther: "",
    camera: null,
    cameraOther: "",
    showBold: { location: false, outfit: false, pose: false },
    generatedPrompt: "",
    editedPrompt: "",
    copied: false,
  };
}

function resolveField(
  selected: string | null,
  other: string,
): string {
  if (selected === OTHER) return other.trim();
  return selected || "";
}

function fieldComplete(selected: string | null, other: string): boolean {
  if (!selected) return false;
  if (selected === OTHER) return other.trim().length > 0;
  return true;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function assemblePrompt(state: CharGenState): string {
  const location = resolveField(state.location, state.locationOther);
  const time = resolveField(state.time, state.timeOther);
  const outfit = resolveField(state.outfit, state.outfitOther);
  const pose = resolveField(state.pose, state.poseOther);
  const hands = resolveField(state.hands, state.handsOther);
  const expression = resolveField(state.expression, state.expressionOther);
  const camera = resolveField(state.camera, state.cameraOther);

  let shotBlock = "";
  if (state.shotType === "selfie") {
    const angle = state.selfieAngle || "arm at eye level";
    const hand = state.selfieHand || "right hand";
    const mirror = state.selfieMirror || "direct selfie";
    shotBlock = ` SELFIE SHOT: She takes the photo herself. ${hand}. Angle: ${angle}. ${mirror}. Her hand and phone are visible in frame.`;
  } else {
    shotBlock =
      " NORMAL SHOT: Photo taken by someone else. Both her hands are free.";
  }

  const handsLine =
    hands && !hands.includes("Natural") ? ` HAND POSE: ${hands}.` : "";

  return (
    `Use the reference photo as the subject. Preserve 100% of her facial structure, identity, ethnicity, skin tone, hair, and body proportions exactly. No retouching, no filters, no idealization.` +
    ` Realistic photo of the same person in: ${location}. Time: ${time}.` +
    shotBlock +
    ` POSE: ${pose}.` +
    handsLine +
    ` EXPRESSION: ${expression}.` +
    ` OUTFIT: ${outfit}. Fabric drapes and fits naturally.` +
    ` FACIAL REALISM: identical to reference. Natural pores, skin texture, peach fuzz, under-eye shadows, real lip texture. No skin smoothing.` +
    ` CAMERA: ${camera}. Candid, unfiltered, authentic.`
  );
}

function ChipButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs transition-all duration-200",
        selected
          ? "border-accent/70 bg-accent-soft/20 text-accent-soft"
          : "text-secondary hover:border-accent/40 hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function FieldStep({
  stepLabel,
  title,
  description,
  options,
  boldOptions,
  boldLabel,
  showBold,
  onToggleBold,
  selected,
  other,
  otherPlaceholder,
  onSelect,
  onOtherChange,
}: {
  stepLabel: string;
  title: string;
  description: string;
  options: Chip[];
  boldOptions?: Chip[];
  boldLabel?: string;
  showBold?: boolean;
  onToggleBold?: () => void;
  selected: string | null;
  other: string;
  otherPlaceholder: string;
  onSelect: (value: string) => void;
  onOtherChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="font-mono text-sm text-accent">{stepLabel}</p>
      <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {options.map((option) => (
          <ChipButton
            key={option.value}
            label={option.label}
            selected={selected === option.value}
            onClick={() => onSelect(option.value)}
          />
        ))}
        <ChipButton
          label="Other…"
          selected={selected === OTHER}
          onClick={() => onSelect(OTHER)}
        />
      </div>

      {selected === OTHER ? (
        <div className="mt-4 rounded-md border border-border bg-surface p-4">
          <input
            value={other}
            onChange={(event) => onOtherChange(event.target.value)}
            placeholder={otherPlaceholder}
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-readable text-sm text-foreground outline-none ring-0"
          />
        </div>
      ) : null}

      {boldOptions && boldLabel && onToggleBold ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={onToggleBold}
            className="font-mono text-sm text-secondary transition-colors hover:text-accent"
          >
            {showBold ? "▾" : "▸"} {boldLabel}
          </button>
          {showBold ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {boldOptions.map((option) => (
                <ChipButton
                  key={option.value}
                  label={option.label}
                  selected={selected === option.value}
                  onClick={() => onSelect(option.value)}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function CharGenApp() {
  const [state, setState] = useState<CharGenState>(createInitialState);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState((current) => ({
          ...current,
          editedPrompt: saved,
          generatedPrompt: saved,
        }));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const selectField = (key: FieldKey, value: string) => {
    setState((current) => ({
      ...current,
      [key]: value,
      ...(value !== OTHER
        ? { [`${key}Other`]: "" }
        : {}),
    }));
  };

  const canProceed = () => {
    if (state.step === 1) {
      if (state.shotType === "normal") return true;
      return Boolean(
        state.selfieAngle && state.selfieHand && state.selfieMirror,
      );
    }
    if (state.step === 2) return fieldComplete(state.location, state.locationOther);
    if (state.step === 3) return fieldComplete(state.time, state.timeOther);
    if (state.step === 4) return fieldComplete(state.outfit, state.outfitOther);
    if (state.step === 5) return fieldComplete(state.pose, state.poseOther);
    if (state.step === 6) return fieldComplete(state.hands, state.handsOther);
    if (state.step === 7) {
      return fieldComplete(state.expression, state.expressionOther);
    }
    if (state.step === 8) return fieldComplete(state.camera, state.cameraOther);
    return true;
  };

  const handleNext = () => {
    if (state.step === TOTAL_STEPS) return;

    if (state.step === 8) {
      const prompt = assemblePrompt(state);
      try {
        window.localStorage.setItem(STORAGE_KEY, prompt);
      } catch {
        // ignore
      }
      setState((current) => ({
        ...current,
        step: 9,
        generatedPrompt: prompt,
        editedPrompt: prompt,
        copied: false,
      }));
      return;
    }

    setState((current) => ({ ...current, step: current.step + 1 }));
  };

  const handleBack = () => {
    if (state.step === 1) return;
    setState((current) => ({ ...current, step: current.step - 1 }));
  };

  const resetAll = () => {
    setState(createInitialState());
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const randomizeAll = () => {
    const locationPool = [...LOCATIONS, ...BOLD_LOCATIONS];
    const outfitPool = [...OUTFITS, ...BOLD_OUTFITS];
    const posePool = [...POSES, ...BOLD_POSES];
    const location = pickRandom(locationPool);
    const outfit = pickRandom(outfitPool);
    const pose = pickRandom(posePool);
    const shotType = Math.random() < 0.4 ? "selfie" : "normal";

    setState((current) => ({
      ...current,
      shotType,
      selfieAngle: pickRandom(SELFIE_ANGLES).value,
      selfieHand: pickRandom(SELFIE_HANDS).value,
      selfieMirror: pickRandom(SELFIE_MIRROR).value,
      location: location.value,
      locationOther: "",
      time: pickRandom(TIMES).value,
      timeOther: "",
      outfit: outfit.value,
      outfitOther: "",
      pose: pose.value,
      poseOther: "",
      hands: pickRandom(HANDS).value,
      handsOther: "",
      expression: pickRandom(EXPRESSIONS).value,
      expressionOther: "",
      camera: pickRandom(CAMERAS).value,
      cameraOther: "",
      showBold: {
        location: BOLD_LOCATIONS.some((item) => item.value === location.value),
        outfit: BOLD_OUTFITS.some((item) => item.value === outfit.value),
        pose: BOLD_POSES.some((item) => item.value === pose.value),
      },
    }));
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(state.editedPrompt);
    setState((current) => ({ ...current, copied: true }));
    window.setTimeout(() => {
      setState((current) => ({ ...current, copied: false }));
    }, 1800);
  };

  const promptLen = state.editedPrompt.length;
  const warnAt = Math.floor(PROMPT_LIMIT * 0.85);

  const renderStepContent = () => {
    if (state.step === 1) {
      return (
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-accent">
                {"// step 1 — shot type"}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
                How is the photo taken?
              </h2>
              <p className="mt-3 max-w-2xl font-readable text-sm leading-7 text-secondary sm:text-base">
                Choose a normal shot or a selfie, then set selfie details if needed.
              </p>
            </div>
            <button
              type="button"
              onClick={randomizeAll}
              className="rounded-md border border-border px-3 py-2 font-mono text-xs text-secondary transition-colors hover:border-accent/40 hover:text-accent"
            >
              Randomize Everything
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {(
              [
                {
                  key: "normal" as const,
                  label: "Normal Shot",
                  hint: "taken by someone else",
                },
                {
                  key: "selfie" as const,
                  label: "Selfie",
                  hint: "she holds the camera",
                },
              ] as const
            ).map((option) => {
              const selected = state.shotType === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() =>
                    setState((current) => ({ ...current, shotType: option.key }))
                  }
                  className={[
                    "rounded-md border border-border bg-surface px-4 py-4 text-left transition-all duration-200",
                    selected
                      ? "border-accent/70 bg-accent-soft/20"
                      : "hover:border-accent/40",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "font-mono text-sm font-semibold",
                      selected ? "text-accent-soft" : "text-foreground",
                    ].join(" ")}
                  >
                    {option.label}
                  </span>
                  <p className="mt-1 font-readable text-xs text-secondary">
                    {option.hint}
                  </p>
                </button>
              );
            })}
          </div>

          {state.shotType === "selfie" ? (
            <div className="mt-8 space-y-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary/70">
                  Selfie Angle
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {SELFIE_ANGLES.map((option) => (
                    <ChipButton
                      key={option.value}
                      label={option.label}
                      selected={state.selfieAngle === option.value}
                      onClick={() =>
                        setState((current) => ({
                          ...current,
                          selfieAngle: option.value,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary/70">
                  Holding Hand
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {SELFIE_HANDS.map((option) => (
                    <ChipButton
                      key={option.value}
                      label={option.label}
                      selected={state.selfieHand === option.value}
                      onClick={() =>
                        setState((current) => ({
                          ...current,
                          selfieHand: option.value,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary/70">
                  Mirror or Direct
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {SELFIE_MIRROR.map((option) => (
                    <ChipButton
                      key={option.value}
                      label={option.label}
                      selected={state.selfieMirror === option.value}
                      onClick={() =>
                        setState((current) => ({
                          ...current,
                          selfieMirror: option.value,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      );
    }

    if (state.step === 2) {
      return (
        <FieldStep
          stepLabel="// step 2 — location"
          title="Where is she?"
          description="Pick a Philippines-realism setting, or describe your own."
          options={LOCATIONS}
          boldOptions={BOLD_LOCATIONS}
          boldLabel="Bold & Flirty Locations"
          showBold={state.showBold.location}
          onToggleBold={() =>
            setState((current) => ({
              ...current,
              showBold: {
                ...current.showBold,
                location: !current.showBold.location,
              },
            }))
          }
          selected={state.location}
          other={state.locationOther}
          otherPlaceholder="Describe your own location..."
          onSelect={(value) => selectField("location", value)}
          onOtherChange={(value) =>
            setState((current) => ({ ...current, locationOther: value }))
          }
        />
      );
    }

    if (state.step === 3) {
      return (
        <FieldStep
          stepLabel="// step 3 — time of day"
          title="What time of day is it?"
          description="Choose the lighting mood for the scene."
          options={TIMES}
          selected={state.time}
          other={state.timeOther}
          otherPlaceholder="Describe your own time/lighting..."
          onSelect={(value) => selectField("time", value)}
          onOtherChange={(value) =>
            setState((current) => ({ ...current, timeOther: value }))
          }
        />
      );
    }

    if (state.step === 4) {
      return (
        <FieldStep
          stepLabel="// step 4 — outfit"
          title="What is she wearing?"
          description="Select an outfit, including bold options if you want."
          options={OUTFITS}
          boldOptions={BOLD_OUTFITS}
          boldLabel="Bold & Flirty Outfits"
          showBold={state.showBold.outfit}
          onToggleBold={() =>
            setState((current) => ({
              ...current,
              showBold: {
                ...current.showBold,
                outfit: !current.showBold.outfit,
              },
            }))
          }
          selected={state.outfit}
          other={state.outfitOther}
          otherPlaceholder="Describe your own outfit..."
          onSelect={(value) => selectField("outfit", value)}
          onOtherChange={(value) =>
            setState((current) => ({ ...current, outfitOther: value }))
          }
        />
      );
    }

    if (state.step === 5) {
      return (
        <FieldStep
          stepLabel="// step 5 — pose"
          title="How is she posed?"
          description="Pick a natural pose for the frame."
          options={POSES}
          boldOptions={BOLD_POSES}
          boldLabel="Bold & Flirty Poses"
          showBold={state.showBold.pose}
          onToggleBold={() =>
            setState((current) => ({
              ...current,
              showBold: {
                ...current.showBold,
                pose: !current.showBold.pose,
              },
            }))
          }
          selected={state.pose}
          other={state.poseOther}
          otherPlaceholder="Describe your own pose..."
          onSelect={(value) => selectField("pose", value)}
          onOtherChange={(value) =>
            setState((current) => ({ ...current, poseOther: value }))
          }
        />
      );
    }

    if (state.step === 6) {
      return (
        <FieldStep
          stepLabel="// step 6 — hand pose"
          title="Where are her hands?"
          description="Set a deliberate hand pose, or keep it natural."
          options={HANDS}
          selected={state.hands}
          other={state.handsOther}
          otherPlaceholder="Describe your own hand pose..."
          onSelect={(value) => selectField("hands", value)}
          onOtherChange={(value) =>
            setState((current) => ({ ...current, handsOther: value }))
          }
        />
      );
    }

    if (state.step === 7) {
      return (
        <FieldStep
          stepLabel="// step 7 — expression"
          title="What expression fits the moment?"
          description="Choose a calm, candid facial expression."
          options={EXPRESSIONS}
          selected={state.expression}
          other={state.expressionOther}
          otherPlaceholder="Describe your own expression..."
          onSelect={(value) => selectField("expression", value)}
          onOtherChange={(value) =>
            setState((current) => ({ ...current, expressionOther: value }))
          }
        />
      );
    }

    if (state.step === 8) {
      return (
        <FieldStep
          stepLabel="// step 8 — camera feel"
          title="What camera look should it mimic?"
          description="Phone realism or DSLR feel — pick the rendering style."
          options={CAMERAS}
          selected={state.camera}
          other={state.cameraOther}
          otherPlaceholder="Describe your own camera style..."
          onSelect={(value) => selectField("camera", value)}
          onOtherChange={(value) =>
            setState((current) => ({ ...current, cameraOther: value }))
          }
        />
      );
    }

    if (state.step === 9) {
      return (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-accent">
                {"// step 9 — prompt output"}
              </p>
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

          <div className="mt-8 v2-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span
                className={[
                  "font-mono text-xs",
                  promptLen > PROMPT_LIMIT
                    ? "text-syntax-keyword"
                    : promptLen >= warnAt
                      ? "text-syntax-string"
                      : "text-secondary",
                ].join(" ")}
              >
                {promptLen} / {PROMPT_LIMIT}
              </span>
              <button
                type="button"
                onClick={copyPrompt}
                className={[
                  "rounded-md border border-border px-3 py-2 font-mono text-xs transition-colors duration-200",
                  state.copied
                    ? "border-accent/70 text-accent"
                    : "text-secondary hover:border-accent/40 hover:text-foreground",
                ].join(" ")}
              >
                {state.copied ? "✓ Copied" : "↗ Copy"}
              </button>
            </div>

            {promptLen > PROMPT_LIMIT ? (
              <p className="mt-3 font-mono text-xs text-syntax-keyword">
                Prompt is {promptLen - PROMPT_LIMIT} chars over the{" "}
                {PROMPT_LIMIT}-char limit.
              </p>
            ) : promptLen >= warnAt ? (
              <p className="mt-3 font-mono text-xs text-syntax-string">
                Approaching {PROMPT_LIMIT}-char limit ({PROMPT_LIMIT - promptLen}{" "}
                remaining).
              </p>
            ) : null}

            <textarea
              value={state.editedPrompt}
              onChange={(event) => {
                const value = event.target.value;
                setState((current) => ({ ...current, editedPrompt: value }));
                try {
                  window.localStorage.setItem(STORAGE_KEY, value);
                } catch {
                  // ignore
                }
              }}
              rows={12}
              className="mt-4 w-full rounded-md border border-border bg-background px-4 py-3 font-readable text-sm leading-7 text-secondary outline-none ring-0"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col py-6">
      <div className="rounded-xl border border-border bg-surface/90 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="font-mono text-sm font-semibold text-foreground">
            <span className="text-accent">&lt;</span>CharGen
            <span className="text-accent">/&gt;</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-border sm:w-32">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${(state.step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-secondary">
              Step {state.step}/{TOTAL_STEPS}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-md border border-border bg-background/70 p-6  sm:p-8">
        {renderStepContent()}
      </div>

      {state.step < TOTAL_STEPS ? (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-md border border-border bg-surface/80 p-4 ">
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
            className="v2-btn v2-btn-primary px-5 py-2 text-sm disabled:cursor-not-allowed disabled:bg-surface disabled:text-secondary disabled:shadow-none"
          >
            {state.step === 8 ? "Generate Prompt" : "Next →"}
          </button>
        </div>
      ) : (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-md border border-border bg-surface/80 p-4 ">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-md border border-border px-4 py-2 font-mono text-sm text-secondary transition-colors hover:border-accent/40 hover:text-foreground"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="rounded-md border border-border px-4 py-2 font-mono text-sm text-secondary transition-colors hover:border-accent/40 hover:text-foreground"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
