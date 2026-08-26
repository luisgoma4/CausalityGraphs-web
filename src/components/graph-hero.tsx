"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { GraphErrorBoundary } from "@/components/graph-error-boundary";
import { GraphFallback } from "@/components/graph-fallback";

const GraphCanvas = dynamic(() => import("./graph-canvas").then((mod) => mod.GraphCanvas), {
  ssr: false,
  loading: () => <GraphFallback />,
});

export function GraphHero({ label, unavailableMessage }: { label: string; unavailableMessage: string }) {
  const [announced, setAnnounced] = useState(false);

  return (
    <div className="graph-frame graph-background" role="img" aria-label={label}>
      <div className="graph-grid" aria-hidden="true" />
      <GraphErrorBoundary
        fallback={<GraphFallback />}
        onError={() => setAnnounced(true)}
      >
        <GraphCanvas />
      </GraphErrorBoundary>
      <p className="sr-only" aria-live="polite">
        {announced ? unavailableMessage : ""}
      </p>
    </div>
  );
}
