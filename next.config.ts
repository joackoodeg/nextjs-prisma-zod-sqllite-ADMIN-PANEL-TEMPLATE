import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client", "@prisma/adapter-libsql"],
  /* config options here */
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
