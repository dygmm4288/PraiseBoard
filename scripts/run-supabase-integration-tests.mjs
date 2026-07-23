import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const supabaseBin = path.join(rootDir, "node_modules", ".bin", "supabase");
const jestBin = path.join(rootDir, "node_modules", ".bin", "jest");

const status = JSON.parse(
  execFileSync(
    supabaseBin,
    ["status", "--workdir", "test/supabase-local", "-o", "json"],
    {
      cwd: rootDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "inherit"],
    },
  ),
);

const result = spawnSync(
  jestBin,
  ["--config", "jest.integration.config.js", "--runInBand"],
  {
    cwd: rootDir,
    env: {
      ...process.env,
      EXPO_PUBLIC_SUPABASE_URL: status.API_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: status.ANON_KEY,
    },
    stdio: "inherit",
  },
);

process.exit(result.status ?? 1);
