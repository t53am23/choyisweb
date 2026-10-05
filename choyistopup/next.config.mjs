import path from "node:path"
import { fileURLToPath } from "node:url"

const appDirectory = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    externalDir: true,
  },
  turbopack: {
    root: path.resolve(appDirectory, ".."),
  },
}

export default nextConfig
