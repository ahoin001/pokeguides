import type { CatalogEntry } from "@/types/pokemon";

export function SpeedTape({ mons }: { mons: CatalogEntry[] }) {
  if (!mons.length) return null;
  const max = Math.max(...mons.map((m) => m.speedAt32), 1);
  return (
    <div className="space-y-3">
      {mons
        .slice()
        .sort((a, b) => b.speedAt32 - a.speedAt32)
        .map((m) => (
          <div key={m.slug}>
            <div className="mb-1 flex justify-between text-xs">
              <span>{m.name}</span>
              <span className="font-mono text-muted">
                {m.speedAt0} / {m.speedAt32}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(m.speedAt32 / max) * 100}%`,
                  background: m.palette.vibrant,
                }}
              />
            </div>
          </div>
        ))}
      <p className="text-xs text-muted">Level 50 speed at 0 SP and 32 SP. Nature not applied.</p>
    </div>
  );
}
