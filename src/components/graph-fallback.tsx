/**
 * Shared static visual for `GraphHero` — used both while `graph-canvas`
 * (Three.js) loads asynchronously and if it fails to render. Keeping a single
 * component guarantees loading and error states are visually identical, so
 * there is never a layout shift or a blank frame between them.
 */
export function GraphFallback() {
  return <div className="graph-fallback" aria-hidden="true" />;
}
