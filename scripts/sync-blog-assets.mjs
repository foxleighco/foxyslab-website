/**
 * Copies non-markdown assets from content/blog/ to public/images/blog/
 * so they're available at build time. Run as a prebuild step.
 */

import { readdir, stat, mkdir, copyFile } from "fs/promises";
import { join, extname } from "path";

const CONTENT_DIR = "content/blog";
const PUBLIC_DIR = "public/images/blog";
const MD_EXTENSIONS = new Set([".md", ".mdx"]);

async function syncAssets() {
  let entries;
  try {
    entries = await readdir(CONTENT_DIR, { withFileTypes: true });
  } catch {
    console.log("No content/blog directory found, skipping asset sync.");
    return;
  }

  let copied = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const slug = entry.name;
    const srcDir = join(CONTENT_DIR, slug);
    const destDir = join(PUBLIC_DIR, slug);

    const files = await readdir(srcDir);
    const assets = files.filter((f) => !MD_EXTENSIONS.has(extname(f)));

    if (assets.length === 0) continue;

    await mkdir(destDir, { recursive: true });

    for (const file of assets) {
      const src = join(srcDir, file);
      const dest = join(destDir, file);

      // Only copy if source is newer or dest doesn't exist
      try {
        const [srcStat, destStat] = await Promise.all([
          stat(src),
          stat(dest).catch(() => null),
        ]);

        if (destStat && srcStat.mtimeMs <= destStat.mtimeMs) continue;
      } catch {
        // dest doesn't exist, copy it
      }

      await copyFile(src, dest);
      copied++;
    }
  }

  if (copied > 0) {
    console.log(`Synced ${copied} blog asset(s) to ${PUBLIC_DIR}`);
  }
}

syncAssets();
