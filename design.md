# Graphite - Brand & Design Spec

Brand system for clydeabenojar.site. Applied sitewide across public pages, tools, blog, work, admin, and standalone apps. Supersedes the Railway (purple) and Sentry (lime/violet) themes.

## 1. Personality

The page is the portfolio piece. Every surface should read as deliberate engineering: quiet, precise, fast. One voice: a builder who scopes carefully and ships working products. The code-comment motif (`// comments`, `fn()` labels) stays, but restrained: mono type is an accent, never the body voice.

- Calm confidence over loudness. No glows, no gradient text, no neon.
- Motion is proof of craft: physical, interruptible, and always justified.
- Dark-only. The whole site is one theme; sections never invert.

## 2. Color

Neutral graphite base, bone text, exactly one accent: ultramarine. No purple, no lime, no secondary accent anywhere.

| Token | Value | Use |
| --- | --- | --- |
| `--v2-bg` | `#0e0f12` | Page background |
| `--v2-surface` | `#15171c` | Cards, panels |
| `--v2-elevated` | `#1b1e24` | Hover surfaces, popovers |
| `--v2-border` | `#26292f` | Hairlines, card borders |
| `--v2-text` | `#eceef2` | Primary text (off-white, never `#fff`) |
| `--v2-muted` | `#9ba0aa` | Secondary text |
| `--v2-faint` | `#878d99` | Tertiary text, mono meta (AA on bg and surface) |
| `--v2-accent` | `#4353ff` | The single accent: CTA fills, focus rings |
| `--v2-accent-hover` | `#5b69ff` | Accent hover state |
| `--v2-accent-text` | `#9aa3ff` | Accent-colored text links on dark surfaces (AA) |
| `--v2-accent-ink` | `#ffffff` | Text on accent fills |

Rules:

- Accent appears on interactive elements and small emphasis only. Never as large background washes or text gradients.
- Shadows are tinted to the background (`rgba(5, 6, 10, ...)`), never pure black, and used only where elevation means something.
- Contrast: body text AA minimum against its surface; CTAs 4.5:1 minimum.

## 3. Typography

- **Display + body:** Geist Sans (`geist/font/sans`).
- **Mono accent:** Geist Mono (`geist/font/mono`) for eyebrows, meta, code-voice labels.
- Display scale: `clamp` based, tracking `-0.02em` or tighter, leading 1.02 to 1.1. Emphasis inside headlines uses weight or italic of the same family, never a second family.
- Body: 16 to 18px, leading ~1.6, `max-w-[65ch]`, color `--v2-muted` with `--v2-text` for strong spans.
- Mono labels: 11 to 13px, uppercase optional. Max one eyebrow per 3 sections on any page.

## 4. Shape & Space

- Radius system: cards and media 12px, pill radius for buttons, 8px inputs. No other radii.
- Hairline borders (`1px solid --v2-border`) group content before cards do; reach for spacing and dividers first.
- Section rhythm: `py-24` to `py-32`. Content container `max-w-6xl` with `px-6`.
- Layout bias: asymmetric. Left-aligned headers, split grids, off-center compositions. Centered layouts only for the contact closer.

## 5. Motion

Motion demonstrates capability, so it must be flawless rather than plentiful. Every animation answers one of: hierarchy, storytelling, feedback, state change.

Tokens:

```css
--ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1);
```

| Interaction | Spec |
| --- | --- |
| Button press | `scale(0.97)`, 120ms, ease-out. Every pressable element. |
| Hover states | 150 to 200ms, `ease` |
| Entrances (load, in-view) | 400 to 700ms, ease-out-strong, `translateY` 16 to 24px + fade, stagger 50 to 80ms |
| Pointer physics (magnetic, tilt) | Springs via `useMotionValue` + `useSpring`, never `useState` |
| Scroll scrub | `useScroll` + `useTransform` on `transform`/`opacity` only |
| Springs | Default critically damped (`bounce: 0`); bounce max 0.2, only after momentum gestures |

Hard rules:

- Only `transform`, `opacity`, `clip-path`, and `filter` animate.
- No `window.addEventListener("scroll")`. Use `useScroll`, IntersectionObserver, or CSS scroll-driven animations.
- Everything above hover-level motion collapses under `prefers-reduced-motion: reduce` to opacity-only or static.
- Hover animations gate behind `@media (hover: hover) and (pointer: fine)`.
- UI feedback stays under 300ms. Marketing/storytelling motion may run longer.
- Max one marquee per page. No infinite loops on informational content.

## 6. Components

- **Buttons:** pill. Primary = accent fill, white text. Secondary = hairline outline, text `--v2-text`, hover raises to `--v2-elevated`. Both scale on press.
- **Cards:** `--v2-surface`, 12px radius, hairline border. No drop shadows at rest; elevation only on interaction or stacking.
- **Nav:** slim (64px), translucent `backdrop-blur`, hairline bottom edge only when content scrolls beneath. Hides on scroll-down, returns on scroll-up.
- **Images:** real screenshots or photography only. 12px radius. No overlaid pills or labels on images.

## 7. Copy

- No em-dashes anywhere. Use commas, colons, periods, or parentheses.
- Headlines 8 words max; sub-paragraphs 25 words max.
- One label per intent per page (one contact label, one portfolio label).
- Concrete verbs. Banned: elevate, seamless, unleash, next-gen, revolutionize.
- Code-voice labels (mono `//`, `fn()`) are seasoning: hero eyebrow and footer, not every section.

## 8. Do / Don't

| Do | Don't |
| --- | --- |
| One accent, locked page-wide | Purple glows, gradient text, neon |
| Hairlines and spacing for grouping | Card boxes around everything |
| Springs for pointer-driven motion | Linear or `ease-in` UI animation |
| Real screenshots | Div-built fake UI previews |
| Left-aligned, asymmetric layouts | Centered hero over a mesh gradient |
| `min-h-[100dvh]` heroes | `h-screen` |
