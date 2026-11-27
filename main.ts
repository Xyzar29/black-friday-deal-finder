// main.ts — DealHound entrypoint (make.fun program/v1).
//
// Copies the static site (app/) and its screenshots (screenshots/) from
// this repository into the output directory, then writes the dossier
// (dossier.json) that the make.fun gate re-derives from those same files.
//
// Runs on Node 22 with the standard library only. It is deterministic:
// two runs over the same repository write byte-identical output.
// The output directory itself is never removed (the grader mounts it),
// only its previous contents are cleared.

import { buildDossier } from "./vendor/makefun-frontend.ts";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";

const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function clearDirectoryContents(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    return;
  }
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

function copyTree(name: string): void {
  const source = join(REPO_ROOT, name);
  if (!existsSync(source)) {
    throw new Error(`main.ts: missing ${name}/ in the repository`);
  }
  cpSync(source, join(OUT_DIR, name), { recursive: true });
}

clearDirectoryContents(OUT_DIR);
copyTree("app");
copyTree("screenshots");

const dossier = buildDossier(OUT_DIR, DOSSIER_CAPS);
const dossierPath = join(OUT_DIR, "dossier.json");
writeFileSync(dossierPath, dossier);

// Round-trip check: the dossier we just wrote must parse back and
// describe exactly the app/ and screenshots/ we handed in, so a
// truncated or corrupted write fails here instead of at the gate.
const writtenBack = JSON.parse(readFileSync(dossierPath, "utf8"));
const text = writtenBack.text as string;
if (!text.includes("app/index.html") || !text.includes("app/data.js")) {
  throw new Error("main.ts: dossier round-trip check failed (missing app files)");
}
if (!Array.isArray(writtenBack.images) || writtenBack.images.length < 3) {
  throw new Error("main.ts: dossier round-trip check failed (missing screenshots)");
}

const shotCount = readdirSync(join(OUT_DIR, "screenshots")).length;
console.log(
  `DealHound: wrote ${OUT_DIR} (app/, ${shotCount} screenshots, dossier.json ${dossier.length} bytes)`,
);
