"use client";

// AsciiArt — "Neon Nebula", made with the 21st.dev ASCII editor and baked
// to its exact rendered output (looping video + poster). Zero dependencies:
// one <video> that fills its parent. Drop it behind or inside your content:
// <div className="relative h-96"><AsciiArt className="absolute inset-0" /></div>
// Remix the source recipe (styles, animation, palette) in the editor:
// https://21st.dev/community/ascii/editor?from=0d9813a1-8a52-4899-912d-4975bc123c7c

type AsciiArtProps = {
  className?: string;
  /** When true, show the poster still instead of autoplaying the loop. */
  staticOnly?: boolean;
};

export function AsciiArt({ className, staticOnly = false }: AsciiArtProps) {
  const poster =
    "https://assets.21st.dev/ascii-recipes/thumbnails/user_3GfKZHMVrEGaZQLVz5Qufduwjfk/5a2bb8d2-7315-4c9d-a2ff-0b1bc615c76c.webp";
  const src =
    "https://assets.21st.dev/ascii-recipes/videos/user_3GfKZHMVrEGaZQLVz5Qufduwjfk/b1e07644-b9c3-4bf3-a409-44a1e95759db.mp4";

  if (staticOnly) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={className}
        src={poster}
        alt="Neon Nebula ASCII art"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    );
  }

  return (
    <video
      className={className}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      aria-label="Neon Nebula animated ASCII art"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
}
