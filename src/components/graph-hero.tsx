"use client";

import dynamic from "next/dynamic";
import { GraphErrorBoundary } from "@/components/graph-error-boundary";

const GraphCanvas = dynamic(() => import("./graph-canvas").then((mod) => mod.GraphCanvas), {
  ssr: false,
  loading: () => <div className="graph-fallback" aria-hidden="true" />,
});

export function GraphHero({ caption }: { caption: string }) {
  return (
    <div className="graph-frame graph-background">
      <div className="graph-halo graph-halo-a" aria-hidden="true" />
      <div className="graph-halo graph-halo-b" aria-hidden="true" />
      <div className="graph-grid" aria-hidden="true" />
      <GraphErrorBoundary fallback={<div className="graph-fallback" aria-hidden="true" />}>
        <GraphCanvas />
      </GraphErrorBoundary>
      <div className="graph-overlay" aria-hidden="true" />
      <div className="graph-caption">
        <span className="signal" aria-hidden="true" />
        {caption}
      </div>
    </div>
  );
}
