#!/usr/bin/env node
/**
 * Generates Storybook MDX pages from the plain markdown in /docs.
 *
 * Documentation is written as ordinary markdown so it is readable on GitHub,
 * in an editor, and by anyone who never opens Storybook. This script mirrors it
 * into `.storybook/.docs` as MDX so the same text also appears in the sidebar.
 *
 * The generated files are gitignored on purpose: /docs is the single source of
 * truth. Two committed copies of the same prose is two copies to forget to
 * update, and the one nobody edits is the one people read.
 *
 * Adapted from the equivalent script in jackanory. The idea is the same; this
 * version is smaller because it only needs to handle a flat-ish docs tree and
 * does not do asset copying or version stamping.
 */

import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  existsSync,
  statSync,
} from "fs";
import { join, dirname, relative, sep } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = join(ROOT, "docs");
const OUT = join(ROOT, ".storybook", ".docs");

/** Title-cases a filename into something readable in the sidebar. */
function toTitle(name) {
  const stripped = name.replace(/\.md$/, "");

  // ADRs keep their number so the sidebar sorts and reads correctly:
  // "adr-004-styling-approach" -> "ADR 004: Styling Approach"
  const adr = stripped.match(/^adr-(\d+)-(.+)$/);
  if (adr) {
    return `ADR ${adr[1]}: ${adr[2].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`;
  }

  return stripped.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Every markdown file under /docs, with its path relative to /docs. */
function markdownFiles(dir = DOCS) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

/**
 * Escapes the parts of markdown that MDX would try to interpret.
 *
 * MDX parses `{` and `<` as JSX. Prose that mentions `{" "}` or a generic like
 * `Array<string>` outside a code fence would otherwise be a build error rather
 * than text — which is easy to hit when the docs are about code.
 */
function escapeForMdx(markdown) {
  const lines = markdown.split("\n");
  let inFence = false;

  return lines
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;

      // Leave inline code spans alone, escape everything around them.
      return line
        .split(/(`[^`]*`)/g)
        .map((part) =>
          part.startsWith("`") ? part : part.replace(/([<{])/g, "\\$1")
        )
        .join("");
    })
    .join("\n");
}

function generate() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const files = markdownFiles();

  for (const file of files) {
    const rel = relative(DOCS, file);
    const segments = rel.split(sep);
    const name = segments.pop();

    // Folder names become sidebar groups: docs/adr/adr-001.md -> "Adr/ADR 001".
    const group = segments.map(toTitle).join("/");
    const title = [group, toTitle(name)].filter(Boolean).join("/");

    const body = escapeForMdx(readFileSync(file, "utf8"));
    const target = join(OUT, rel.replace(/\.md$/, ".mdx"));

    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(
      target,
      `import { Meta } from "@storybook/addon-docs/blocks";\n\n` +
        `<Meta title="${title}" />\n\n${body}\n`
    );
  }

  // The README is the entry point everywhere else, so it should be here too.
  const readme = join(ROOT, "README.md");
  if (existsSync(readme) && statSync(readme).isFile()) {
    writeFileSync(
      join(OUT, "readme.mdx"),
      `import { Meta } from "@storybook/addon-docs/blocks";\n\n` +
        `<Meta title="Readme" />\n\n${escapeForMdx(readFileSync(readme, "utf8"))}\n`
    );
  }

  console.log(`Generated ${files.length + 1} Storybook doc page(s)`);
}

generate();
