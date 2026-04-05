import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/privacidad", destination: "/legal?tab=privacy",  permanent: false },
      { source: "/terminos",   destination: "/legal?tab=terms",    permanent: false },
      { source: "/cookies",    destination: "/legal?tab=cookies",  permanent: false },
      { source: "/datos",      destination: "/legal?tab=data",     permanent: false },
    ];
  },
};

export default nextConfig;
