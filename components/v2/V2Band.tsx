/**
 * Full-bleed CSS band separating hero from work.
 * Three skewed black/white chevron tapes; adjacent strips move opposite ways.
 */
export function V2Band() {
  return (
    <div className="v2-band" aria-hidden="true">
      <div className="moving-arrow-band moving-arrow-band--forward" />
      <div className="moving-arrow-band moving-arrow-band--reverse" />
      <div className="moving-arrow-band moving-arrow-band--forward" />
    </div>
  );
}
