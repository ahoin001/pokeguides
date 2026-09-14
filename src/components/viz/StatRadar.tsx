import type { Stats } from "@/types/pokemon";

const KEYS = ["hp", "atk", "def", "spa", "spd", "spe"] as const;
const LABELS = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];

export function StatRadar({ stats, accent }: { stats: Stats; accent?: string }) {
  const cx = 80;
  const cy = 80;
  const r = 58;
  const pts = KEYS.map((k, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const mag = Math.min(stats[k] / 180, 1) * r;
    return [cx + Math.cos(angle) * mag, cy + Math.sin(angle) * mag];
  });
  const ring = KEYS.map((_, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 160 170" className="h-48 w-48">
      <polygon points={ring} fill="none" stroke="currentColor" opacity="0.15" />
      <polygon
        points={pts.map((p) => p.join(",")).join(" ")}
        fill={accent ?? "var(--mon-vibrant)"}
        fillOpacity="0.35"
        stroke={accent ?? "var(--mon-vibrant)"}
      />
      {LABELS.map((label, i) => {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const x = cx + Math.cos(angle) * 72;
        const y = cy + Math.sin(angle) * 72;
        return (
          <text key={label} x={x} y={y} textAnchor="middle" className="fill-current text-[8px] opacity-70">
            {label}
          </text>
        );
      })}
    </svg>
  );
}
