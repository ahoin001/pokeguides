import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { AuthorPrompts } from "@/lib/manuals/author-prompts";

function extractFence(markdown: string, heading: string): string {
  const at = markdown.indexOf(heading);
  if (at < 0) throw new Error(`Missing heading ${heading}`);
  const after = markdown.slice(at + heading.length);
  const open = after.indexOf("```");
  if (open < 0) throw new Error(`Missing code fence after ${heading}`);
  const bodyStart = after.indexOf("\n", open);
  const close = after.indexOf("```", bodyStart + 1);
  if (bodyStart < 0 || close < 0) throw new Error(`Unclosed code fence after ${heading}`);
  return after.slice(bodyStart + 1, close).trim();
}

/** Paste-ready authoring prompts from docs/. Server only — the docs stay the source. */
export async function loadAuthorPrompts(): Promise<AuthorPrompts> {
  const root = process.cwd();
  const [singlesMd, doublesMd] = await Promise.all([
    readFile(path.join(root, "docs/manual-authoring-prompt.md"), "utf8"),
    readFile(path.join(root, "docs/manual-authoring-prompt-doubles.md"), "utf8"),
  ]);
  return {
    singles: extractFence(singlesMd, "## Paste-ready prompt (Singles)"),
    doubles: extractFence(doublesMd, "## Paste-ready prompt (Doubles only)"),
  };
}
