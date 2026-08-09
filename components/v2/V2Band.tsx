/**
 * Full-bleed CSS band separating hero from work.
 * Skewed black/white chevron tape with infinite horizontal shift.
 */
export function V2Band() {
  return (
    <div className="v2-band" aria-hidden="true">
      <div className="moving-arrow-band" />
    </div>
  );
}
