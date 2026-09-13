import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ["app/dashboard/ai/page.tsx", "components/ui/sidebar.tsx"],
    rules: { "react-hooks/purity": "off" },
  },
  {
    files: [
      "app/dashboard/airtime/page.tsx",
      "components/ui/carousel.tsx",
      "components/ui/use-mobile.tsx",
      "hooks/use-mobile.ts",
    ],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
  {
    files: ["components/dashboard/sidebar.tsx"],
    rules: { "react-hooks/static-components": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
])
