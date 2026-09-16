import { resolveFlows, type TeamManual } from "@/content/manuals";

/** Classroom manuals author `flows` inline. Locals fall back to phases. */
export function flowsFor(manual: TeamManual) {
  const authored = (manual.flows ?? []).filter((f) => f.forks.length);
  if (authored.length) return authored;
  return resolveFlows(manual);
}
