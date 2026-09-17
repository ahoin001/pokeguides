/** Temporary Live Match diagnostics — safe to leave until deploy is confirmed. */

export type LiveDebugPayload = Record<string, unknown>;

declare global {
  interface Window {
    __RINGSIDE_LIVE?: {
      events: { t: number; tag: string; data?: LiveDebugPayload }[];
      last?: { tag: string; data?: LiveDebugPayload; t: number };
    };
  }
}

function push(tag: string, data?: LiveDebugPayload) {
  if (typeof window === "undefined") return;
  const bag = (window.__RINGSIDE_LIVE ??= { events: [] });
  const entry = { t: Date.now(), tag, data };
  bag.events.push(entry);
  if (bag.events.length > 80) bag.events.shift();
  bag.last = entry;
}

/** warn so it shows even when info is filtered; also mirrors to window.__RINGSIDE_LIVE */
export function liveDebug(tag: string, data?: LiveDebugPayload) {
  push(tag, data);
  if (data !== undefined) console.warn(tag, data);
  else console.warn(tag);
}

export function liveDebugError(tag: string, data?: LiveDebugPayload) {
  push(tag, data);
  if (data !== undefined) console.error(tag, data);
  else console.error(tag);
}
