import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { LoadSampleSix } from "@/components/learn/LoadSampleSix";
import { SlotMatchups } from "@/components/manuals/SlotMatchups";
import type { TeamManual } from "@/content/manuals";

function ChipRow({ label, items }: { label: string; items: string[] }) {
  const chips = items.map((s) => s.trim()).filter(Boolean);
  if (!chips.length) return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={chip} className="rounded-full bg-white/5 px-3 py-1 text-sm">
            {chip}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ManualBriefing({ manual }: { manual: TeamManual }) {
  const ready = manual.slugs.every(Boolean);
  return (
    <div className="mt-8 space-y-6">
      <ul className="grid gap-3 sm:grid-cols-3">
        {manual.slots.map((slot) => {
          const p = slot.slug ? getPokemon(slot.slug) : undefined;
          return (
            <li key={`${slot.slug}-${slot.title}`} className="rounded-3xl border border-line bg-raised/40 p-3">
              <div className="flex items-center gap-3">
                {p ? (
                  <Link href={`/pokemon/${p.slug}`} className="shrink-0">
                    <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={56} />
                  </Link>
                ) : null}
                <div className="min-w-0">
                  <p className="truncate font-semibold">{p?.name ?? (slot.title || "Empty")}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">{slot.title}</p>
                </div>
              </div>
              {p ? <SlotMatchups types={p.types} /> : null}
              {slot.role ? <p className="mt-2 text-sm text-muted">{slot.role}</p> : null}
            </li>
          );
        })}
      </ul>
      {ready ? <LoadSampleSix slugs={[...manual.slugs]} intent={manual.archetype} /> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <ChipRow label="Press" items={manual.press ?? []} />
        <ChipRow label="Refuse" items={manual.refuse ?? []} />
      </div>
    </div>
  );
}
