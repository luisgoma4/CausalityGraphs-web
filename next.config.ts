import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Orígenes desde los que se permite abrir el dev server además de localhost
  // (probar el diseño responsive en el móvil). 172.20.10.x es el hotspot del
  // teléfono; 192.168.1.x, la red de casa. No afecta al build de producción.
  allowedDevOrigins: ["172.20.10.3", "192.168.1.144", "100.80.210.46"],
};

export default nextConfig;
