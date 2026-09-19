import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ARCHETYPE_LABEL } from "@/content/archetypes";
import {
  FAMILY_LESSON,
  MANUAL_FAMILY_LABEL,
  manualFamily,
  manualFormat,
  manualHref,
  manualPackHref,
  packList,
  type TeamManual,
} from "@/content/manuals";
import { formatBringLabel, formatManualEyebrow } from "@/lib/format";

export function ManualCard({
  manual,
  sourced,
}: {
  manual: TeamManual;
  sourced: "canonical" | "local";
}) {
  const format = manualFormat(manual);
  const doubles = format === "doubles";
  const showSlugs = manual.box?.length ? manual.box : manual.slugs;
  const mons = showSlugs.map((s) => (s ? getPokemon(s) : undefined));
  const wash = mons.find(Boolean);
  const press = (manual.press ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const never = (manual.pilot?.fail ?? FAMILY_LESSON[manualFamily(manual)].commonFail).trim();
  const lead = manual.slots.find((s) => /lead/i.test(s.role))?.role.trim();
  const pickLine = never || lead;
  const packs = packList(manual);

  return (
    <article
      data-format={format}
      className={`flex h-full flex-col rounded-[28px] border p-5 transition hover:bg-raised ${
        doubles
          ? "border-[color-mix(in_srgb,var(--format-doubles-accent)_40%,var(--line))] bg-[var(--format-doubles-wash)]"
          : "border-line bg-raised/50"
      }`}
      style={wash ? cssVars(wash.palette) : undefined}
    >
      <Link href={manualHref(manual.id)} className="min-w-0 flex-1">
        <div className="flex flex-wrap items-end gap-1.5">
          {mons.map((p, i) =>
            p ? (
              <PokemonArt
                key={p.slug}
                slug={p.slug}
                src={p.artwork}
                name={p.name}
                size={manual.box?.length ? 48 : 64}
              />
            ) : (
              <span
                key={i}
                className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-xs text-muted"
              >
                —
              </span>
            ),
          )}
        </div>
        <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span
            className={`rounded-full px-2 py-0.5 font-medium ${
              doubles
                ? "bg-[color-mix(in_srgb,var(--format-doubles-accent)_25%,transparent)] text-[var(--format-doubles-accent)]"
                : "bg-white/8 text-ink"
            }`}
          >
            {formatManualEyebrow(format)}
          </span>
          <span>{formatBringLabel(format)}</span>
          <span aria-hidden>·</span>
          <span>
            {MANUAL_FAMILY_LABEL[manualFamily(manual)]} · {ARCHETYPE_LABEL[manual.archetype]}
            {sourced === "local" ? " · Yours" : ""}
          </span>
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">{manual.title || "Untitled"}</h2>
        <p className="mt-2 text-sm text-muted">{manual.lede}</p>
        {pickLine ? (
          <p className="mt-3 text-sm leading-snug">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f0c040]">
              {never ? "Never" : "Lead"}
            </span>
            <span className="mt-0.5 block text-muted">{pickLine}</span>
          </p>
        ) : null}
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

      {packs.length ? (
        <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-line/60 pt-3" aria-label="Preview packs">
          {packs.map((pack) => (
            <li key={pack.id}>
              <Link
                href={manualPackHref(manual.id, pack.id)}
                className="inline-flex rounded-full border border-line bg-bg/40 px-2.5 py-1 text-xs font-medium text-muted transition hover:border-ink/40 hover:text-ink"
              >
                {pack.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
