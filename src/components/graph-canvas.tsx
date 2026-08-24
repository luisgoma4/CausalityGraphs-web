"use client";

import { Float, Line, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type NodeDefinition = {
  position: [number, number, number];
  color: string;
  scale: number;
};

const nodes: NodeDefinition[] = [
  { position: [-2.6, -0.3, 0.2], color: "#1eb9a5", scale: 0.42 },
  { position: [-0.5, 1.9, -0.5], color: "#2553d2", scale: 0.4 },
  { position: [2.3, 1.2, 0.6], color: "#f6f8ff", scale: 0.36 },
  { position: [2.2, -0.8, -0.2], color: "#88c8ff", scale: 0.34 },
  { position: [-0.2, -2.0, 0.1], color: "#64d9eb", scale: 0.43 },
  { position: [-1.4, -1.3, 0.8], color: "#0b1830", scale: 0.24 },
];

const edges = [
  [0, 1],
  [1, 2],
  [2, 4],
  [4, 0],
  [5, 4],
  [5, 2],
];

type Tier = "low" | "mid" | "high";

const TIER_GEOMETRY: Record<Tier, { node: number; glow: number; torusRadial: number; torusTubular: number }> = {
  high: { node: 48, glow: 24, torusRadial: 18, torusTubular: 160 },
  mid: { node: 32, glow: 16, torusRadial: 14, torusTubular: 96 },
  low: { node: 20, glow: 12, torusRadial: 10, torusTubular: 64 },
};

function NetworkScene({
  reducedMotion,
  tier,
  scrollProgress,
}: {
  reducedMotion: boolean;
  tier: Tier;
  scrollProgress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const elapsedRef = useRef(0);
  const { invalidate } = useThree();
  const geometry = TIER_GEOMETRY[tier];

  const edgeCurves = useMemo(
    () =>
      edges.map(([from, to], index) => {
        const start = new THREE.Vector3(...nodes[from].position);
        const end = new THREE.Vector3(...nodes[to].position);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        mid.z += index % 2 === 0 ? 0.7 : -0.45;
        mid.y += index % 3 === 0 ? 0.35 : -0.25;
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        return curve.getPoints(36).map((point) => [point.x, point.y, point.z] as [number, number, number]);
      }),
    [],
  );

  // Reduced motion: compute the scroll-driven pose once per scroll change instead of
  // continuously lerping every frame, then request a single render via invalidate().
  useEffect(() => {
    if (!reducedMotion) return;

    const scrollTilt = THREE.MathUtils.lerp(-0.18, 0.34, scrollProgress);
    const scrollOrbit = scrollProgress * Math.PI * 0.42;
    const lift = THREE.MathUtils.lerp(0.18, -0.34, scrollProgress);

    if (groupRef.current) {
      groupRef.current.rotation.y = scrollOrbit;
      groupRef.current.rotation.x = scrollTilt;
      groupRef.current.position.y = lift;
      groupRef.current.position.x = scrollProgress * 0.9 - 0.25;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = scrollProgress * 1.45;
      ringRef.current.rotation.x = 1.05 + scrollProgress * 0.45;
    }
    if (glowRef.current) {
      glowRef.current.position.x = scrollProgress * 0.75;
      glowRef.current.position.y = -scrollProgress * 0.65;
    }
    invalidate();
  }, [reducedMotion, scrollProgress, invalidate]);

  useFrame((state, delta) => {
    if (reducedMotion) return;

    elapsedRef.current += delta;
    const t = elapsedRef.current;
    const pointerX = state.pointer.x * 0.22;
    const pointerY = state.pointer.y * 0.12;
    const scrollTilt = THREE.MathUtils.lerp(-0.18, 0.34, scrollProgress);
    const scrollOrbit = scrollProgress * Math.PI * 0.42;
    const lift = THREE.MathUtils.lerp(0.18, -0.34, scrollProgress);

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointerX + scrollOrbit,
        0.05,
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointerY + scrollTilt,
        0.05,
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        lift + Math.sin(t * 0.45) * 0.08,
        0.05,
      );
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, scrollProgress * 0.9 - 0.25, 0.05);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = THREE.MathUtils.lerp(
        ringRef.current.rotation.z,
        scrollProgress * 1.45 + t * 0.12,
        0.05,
      );
      ringRef.current.rotation.x = THREE.MathUtils.lerp(
        ringRef.current.rotation.x,
        1.05 + scrollProgress * 0.45 + Math.sin(t * 0.3) * 0.08,
        0.05,
      );
    }

    if (glowRef.current) {
      glowRef.current.position.x = THREE.MathUtils.lerp(
        glowRef.current.position.x,
        scrollProgress * 0.75 + Math.sin(t * 0.5) * 0.25,
        0.04,
      );
      glowRef.current.position.y = THREE.MathUtils.lerp(
        glowRef.current.position.y,
        -scrollProgress * 0.65 + Math.cos(t * 0.4) * 0.18,
        0.04,
      );
    }
  });

  return (
    <>
      <fog attach="fog" args={["#dce7f7", 7, 14]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 4]} intensity={2.2} color="#dff8ff" />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#63d6e8" distance={10} />
      <pointLight position={[4, 2, 4]} intensity={14} color="#3a6eff" distance={12} />

      <PerspectiveCamera makeDefault position={[0, 0, tier !== "high" ? 8.1 : 7.4]} fov={tier !== "high" ? 40 : 36} />

      <mesh ref={glowRef} position={[0, 0, -3.2]}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#89dff2" transparent opacity={0.12} />
      </mesh>

      <mesh ref={ringRef} rotation={[1.06, 0.26, 0]} position={[0.15, 0.05, -0.6]}>
        <torusGeometry args={[3.15, 0.024, geometry.torusRadial, geometry.torusTubular]} />
        <meshStandardMaterial color="#d7e6ff" transparent opacity={0.55} metalness={0.5} roughness={0.22} />
      </mesh>

      <group ref={groupRef}>
        {edgeCurves.map((points, index) => (
          <Line
            key={`edge-${index}`}
            points={points}
            color={index % 2 === 0 ? "#5ce3de" : "#2f73ff"}
            lineWidth={1.15}
            transparent
            opacity={0.8}
          />
        ))}

        {nodes.map((node, index) => (
          <Float
            key={`${node.color}-${index}`}
            speed={reducedMotion ? 0 : 1.4 + index * 0.08}
            rotationIntensity={reducedMotion ? 0 : 0.12}
            floatIntensity={reducedMotion ? 0 : tier === "high" ? 0.4 : 0.28}
          >
            <group position={node.position}>
              <mesh>
                <sphereGeometry args={[node.scale, geometry.node, geometry.node]} />
                <meshPhysicalMaterial
                  color={node.color}
                  roughness={0.18}
                  metalness={0.3}
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                />
              </mesh>
              <mesh scale={1.9}>
                <sphereGeometry args={[node.scale, geometry.glow, geometry.glow]} />
                <meshBasicMaterial color={node.color} transparent opacity={0.12} />
              </mesh>
            </group>
          </Float>
        ))}
      </group>
    </>
  );
}

export function GraphCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tier, setTier] = useState<Tier>("high");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const midQuery = window.matchMedia("(max-width: 760px)");
    const lowQuery = window.matchMedia("(max-width: 480px)");

    const update = () => {
      setReducedMotion(motionQuery.matches);
      setTier(lowQuery.matches ? "low" : midQuery.matches ? "mid" : "high");
    };

    update();
    motionQuery.addEventListener("change", update);
    midQuery.addEventListener("change", update);
    lowQuery.addEventListener("change", update);

    return () => {
      motionQuery.removeEventListener("change", update);
      midQuery.removeEventListener("change", update);
      lowQuery.removeEventListener("change", update);
    };
  }, []);

  // Pause rendering entirely when the hero is scrolled out of view or the tab is hidden.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(node);

    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateScroll = () => {
      frame = 0;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setScrollProgress(Math.min(window.scrollY / maxScroll, 1));
    };

    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const active = inView && tabVisible;
  const frameloop = !active ? "never" : reducedMotion ? "demand" : "always";

  return (
    <div ref={containerRef} className="graph-canvas">
      <Canvas
        dpr={tier === "high" ? [1, 1.6] : [1, 1.2]}
        gl={{ antialias: tier === "high", alpha: true }}
        frameloop={frameloop}
      >
        <NetworkScene reducedMotion={reducedMotion} tier={tier} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
