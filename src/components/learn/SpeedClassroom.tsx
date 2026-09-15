import { getPokemon } from "@/lib/catalog/load";
import { SpeedTape } from "@/components/viz/SpeedTape";

const HONEST = ["whimsicott", "corviknight", "garchomp"];
const SCALE = ["excadrill", "primarina", "dragonite"];

export function SpeedClassroom() {
  const honest = HONEST.map((s) => getPokemon(s)).filter(Boolean);
  const scale = SCALE.map((s) => getPokemon(s)).filter(Boolean);
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-[28px] border border-line bg-raised/40 p-4">
        <h3 className="font-semibold tracking-tight">Honest Balance</h3>
        <p className="mt-1 text-sm text-muted">Cott clocks. Corvi is slow on purpose. Garchomp inherits Tailwind.</p>
        <div className="mt-4">
          <SpeedTape mons={honest.filter((p): p is NonNullable<typeof p> => Boolean(p))} />
        </div>
      </div>
      <div className="rounded-[28px] border border-line bg-raised/40 p-4">
        <h3 className="font-semibold tracking-tight">Scale Sweep</h3>
        <p className="mt-1 text-sm text-muted">Drill races. Primarina is the special stay. Dragonite cleans if Ice is gone.</p>
        <div className="mt-4">
          <SpeedTape mons={scale.filter((p): p is NonNullable<typeof p> => Boolean(p))} />
        </div>
      </div>
    </div>
  );
}
