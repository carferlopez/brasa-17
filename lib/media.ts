import fs from "node:fs";
import path from "node:path";

/**
 * Lee /public/media en build/server y devuelve los nombres de archivo
 * existentes. Los componentes cliente reciben esta lista y deciden si
 * renderizan el asset real o un placeholder evaluable sin assets.
 */
export function getExistingMedia(): string[] {
  const dir = path.join(process.cwd(), "public", "media");
  try {
    return fs.readdirSync(dir).filter((f) => !f.startsWith("."));
  } catch {
    return [];
  }
}
