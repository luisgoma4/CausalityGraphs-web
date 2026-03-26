"use client";

import dynamic from "next/dynamic";

const GraphCanvas = dynamic(() => import("./graph-canvas").then((mod) => mod.GraphCanvas), {
  ssr: false,
  loading: () => <div className="graph-fallback" aria-hidden="true" />,
});

export function GraphHero() {
  return (
    <div className="graph-frame graph-background" aria-hidden="true">
      <div className="graph-halo graph-halo-a" />
      <div className="graph-halo graph-halo-b" />
      <div className="graph-grid" />
      <GraphCanvas />
      <div className="graph-overlay" />
      <div className="graph-caption">
        <span className="signal" />
        Scroll to move through the causal field.
      </div>
    </div>
  );
}
