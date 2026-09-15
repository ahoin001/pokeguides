import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ARCHETYPE_LABEL } from "@/content/archetypes";
import { MANUAL_FAMILY_LABEL, manualFamily, manualHref, type TeamManual } from "@/content/manuals";

export function ManualCard({
  manual,
  sourced,
}: {
  manual: TeamManual;
  sourced: "canonical" | "local";
}) {
  const mons = manual.slugs.map((s) => (s ? getPokemon(s) : undefined));
  const wash = mons.find(Boolean);
  const press = (manual.press ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 3);

  return (
    <Link
      href={manualHref(manual.id)}
      className="flex h-full flex-col rounded-[28px] border border-line bg-raised/50 p-5 transition hover:bg-raised"
      style={wash ? cssVars(wash.palette) : undefined}
    >
      <div className="flex items-end gap-2">
        {mons.map((p, i) =>
          p ? (
            <PokemonArt key={p.slug} slug={p.slug} src={p.artwork} name={p.name} size={64} />
          ) : (
            <span key={i} className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-xs text-muted">
              —
            </span>
          ),
        )}
      </div>
      <p className="mt-4 text-xs text-muted">
        {MANUAL_FAMILY_LABEL[manualFamily(manual)]} · {ARCHETYPE_LABEL[manual.archetype]}
        {sourced === "local" ? " · Yours" : ""}
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight">{manual.title || "Untitled three"}</h2>
      <p className="mt-2 text-sm text-muted">{manual.lede}</p>
      {press.length ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {press.map((chip) => (
            <li key={chip} className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-muted">
              {chip}
            </li>
          ))}
        </ul>
      ) : null}
    </Link>
  );
}
