import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const playwrightCli = require.resolve("@playwright/test/cli")
const result = spawnSync(process.execPath, [playwrightCli, "test", ...process.argv.slice(2)], {
  env: {
    ...process.env,
    // Keeping Playwright's web-server channel open avoids an early child-process exit on Windows.
    DEBUG: process.env.DEBUG || "pw:webserver",
  },
  stdio: "inherit",
})

if (result.error) throw result.error
process.exit(result.status ?? 1)
