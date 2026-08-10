import { PrimaryCta } from "@/components/PrimaryCta";

export function Footer() {
  return (
    <footer className="border-t py-8" style={{ borderColor: "var(--v2-border)" }}>
      <div
        className="v2-mono mx-auto flex max-w-6xl flex-col gap-3 px-6 text-sm sm:flex-row sm:items-center sm:justify-between"
        style={{ color: "var(--v2-faint)" }}
      >
        <p>
          {"// "}&copy; {new Date().getFullYear()} Clyde Abenojar
        </p>
        <PrimaryCta
          variant="text"
          magnetic={false}
          source="footer"
          className="sm:text-right"
        />
        <p>clydeabenojar.site</p>
      </div>
    </footer>
  );
}

export { Footer as V2Footer };
