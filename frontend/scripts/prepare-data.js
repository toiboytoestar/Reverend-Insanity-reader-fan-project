#!/usr/bin/env node
/**
 * Prepare chapter data for a static build.
 *
 * If `frontend/public/data/index.json` already exists we assume the data is
 * committed and skip.  Otherwise we copy from `../backend/data/` (the source
 * of truth in the mono-repo) so any static host can serve chapters directly.
 *
 * Vercel runs this automatically because it is wired to the `prebuild`
 * npm/yarn lifecycle hook in package.json.
 */
const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "..", "public", "data");
const targetIndex = path.join(target, "index.json");
const source = path.join(__dirname, "..", "..", "backend", "data");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

if (fs.existsSync(targetIndex)) {
  console.log("[prepare-data] public/data/index.json already present, skipping copy.");
  process.exit(0);
}
if (!fs.existsSync(source)) {
  console.warn(
    "[prepare-data] No source data directory found at " +
      source +
      ". If you are deploying only the frontend, commit /frontend/public/data instead."
  );
  process.exit(0);
}
console.log(`[prepare-data] Copying chapter data ${source} -> ${target}`);
copyDir(source, target);
console.log("[prepare-data] Done.");
