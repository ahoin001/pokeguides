import type { Palette, SpeciesColor } from "@/types/pokemon";

export const SPECIES_FALLBACK: Record<SpeciesColor, string> = {
  black: "#2a2a2e",
  blue: "#3d6cb3",
  brown: "#8a5a36",
  gray: "#6b7280",
  green: "#3f8f5b",
  pink: "#d4899c",
  purple: "#7a4ea3",
  red: "#c4453a",
  white: "#c9c6be",
  yellow: "#d4b43c",
};

function hexToRgb(hex: string) {
  const n = hex.replace("#", "");
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const lin = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrast(a: string, b: string) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

function mix(hex: string, toward: string, amount: number) {
  const a = hexToRgb(hex);
  const b = hexToRgb(toward);
  return rgbToHex(
    Math.round(a.r + (b.r - a.r) * amount),
    Math.round(a.g + (b.g - a.g) * amount),
    Math.round(a.b + (b.b - a.b) * amount),
  );
}

export function inkFor(washBase: string) {
  const dark = "#12141a";
  const light = "#f4f1ea";
  return contrast(light, washBase) >= 4.5 ? light : dark;
}

export function paletteFromHex(hex: string, source: Palette["source"]): Palette {
  const vibrant = hex;
  const muted = mix(hex, "#1a1d26", 0.45);
  const dominant = mix(hex, "#12141a", 0.2);
  return {
    dominant,
    vibrant,
    muted,
    ink: inkFor(dominant),
    wash: hex,
    source,
  };
}

export function fallbackPalette(color: SpeciesColor): Palette {
  return paletteFromHex(SPECIES_FALLBACK[color], "species-fallback");
}

export function cssVars(palette: Palette): Record<string, string> {
  return {
    "--mon-dominant": palette.dominant,
    "--mon-vibrant": palette.vibrant,
    "--mon-muted": palette.muted,
    "--mon-ink": palette.ink,
    "--mon-wash": palette.wash,
  };
}
