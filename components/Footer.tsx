export function Footer() {
  return (
    <footer className="rw-footer py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">
          {"// "}&copy; {new Date().getFullYear()} Clyde Abenojar
        </p>
        <p className="font-mono">clydeabenojar.site</p>
      </div>
    </footer>
  );
}
