import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("public/workers");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log("Building in-browser background remover worker bundle...");
execSync(
  'npx esbuild app/free-tools/background-remover/remover.worker.ts --bundle --format=esm --target=es2022 --outfile=public/workers/remover.worker.js --define:process.env.NODE_ENV=\'"production"\'',
  { stdio: "inherit" }
);
console.log("Worker bundled successfully to public/workers/remover.worker.js");
