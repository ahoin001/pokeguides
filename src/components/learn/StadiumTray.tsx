import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import type { LessonExample } from "@/content/curriculum";
import { FORMAT_BRING, type BattleFormat } from "@/lib/format";

export function StadiumTray({
  you,
  them = [],
  youLabel = "Your three — open list",
  themLabel = "Theirs — empty until preview",
  format = "singles",
}: {
  you: LessonExample[];
  them?: LessonExample[];
  youLabel?: string;
  themLabel?: string;
  /** Singles pads to 3; Doubles pads to a bring of 4. */
  format?: BattleFormat;
}) {
  const bring = FORMAT_BRING[format];
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Tray label={youLabel} slots={padBring(you, bring)} cols={bring} />
      <Tray label={themLabel} slots={padBring(them, bring)} cols={bring} empty />
    </div>
  );
}

function padBring(list: LessonExample[], bring: number): (LessonExample | undefined)[] {
  return Array.from({ length: bring }, (_, i) => list[i]);
}

function Tray({
  label,
  slots,
  cols,
  empty,
}: {
  label: string;
  slots: (LessonExample | undefined)[];
  cols: number;
  empty?: boolean;
}) {
  return (
    <div className={`rounded-[28px] border border-line bg-sunken/70 p-4 ${empty ? "opacity-80" : ""}`}>
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted">{label}</p>
      <ol
        className={`mt-3 grid gap-2 ${cols === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}
      >
        {slots.map((slot, i) => (
          <Seat key={slot?.slug ?? `empty-${i}`} example={slot} />
        ))}
      </ol>
    </div>
  );
}

function Seat({ example }: { example?: LessonExample }) {
  const p = example ? getPokemon(example.slug) : undefined;
  if (!p) {
    return (
      <li className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-raised/20">
        <span className="text-xs text-muted">Empty</span>
      </li>
    );
  }
  return (
    <li className="rounded-2xl border border-line bg-raised/50 p-2" style={cssVars(p.palette)}>
      <Link href={`/pokemon/${p.slug}`} className="flex flex-col items-center text-center">
        <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={64} />
        <span className="mt-1 block truncate text-xs font-medium">{p.name}</span>
        {example?.caption ? <span className="mt-0.5 text-[10px] text-muted">{example.caption}</span> : null}
        <span className="mt-1 flex flex-wrap justify-center gap-0.5">
          {p.types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </span>
      </Link>
    </li>
  );
}
