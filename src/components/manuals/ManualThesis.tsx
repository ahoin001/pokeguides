"use client";

import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import type {
  ManualConstruction,
  ManualEvidence,
  ManualMegaPool,
} from "@/content/manuals";

export function ManualThesis({
  construction,
  megaPool,
  evidence,
}: {
  construction?: ManualConstruction;
  megaPool?: ManualMegaPool;
  evidence?: ManualEvidence;
}) {
  if (!construction && !megaPool && !evidence) return null;

  return (
    <div className="max-w-3xl space-y-6">
      {construction ? (
        <div className="space-y-4 rounded-[28px] border border-line bg-raised/40 p-5">
          <p className="text-[17px] leading-relaxed text-pretty">{construction.thesis}</p>
          <dl className="space-y-3 border-t border-line/70 pt-4">
            <div>
              <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Method
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted">{construction.method}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Win condition
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink/90">
                {construction.winCondition}
              </dd>
            </div>
          </dl>

          {construction.substitutions?.length ? (
            <div className="border-t border-line/70 pt-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Substitutions
              </p>
              <ul className="mt-3 space-y-3">
                {construction.substitutions.map((s) => (
                  <li key={`${s.dropped}-${s.kept}`} className="text-sm leading-relaxed">
                    <p className="font-medium tracking-tight">
                      {s.dropped} → {s.kept}
                    </p>
                    <p className="mt-1 text-muted">{s.why}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {construction.altSlots?.length ? (
            <div className="border-t border-line/70 pt-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Alternate slots
              </p>
              <ul className="mt-3 space-y-3">
                {construction.altSlots.map((a) => {
                  const mon = getPokemon(a.slug);
                  return (
                    <li key={a.slug} className="flex gap-3 text-sm leading-relaxed">
                      {mon ? (
                        <Link
                          href={`/pokemon/${mon.slug}`}
                          className="shrink-0"
                          style={cssVars(mon.palette)}
                        >
                          <PokemonArt
                            slug={mon.slug}
                            src={mon.sprite || mon.artwork}
                            name={mon.name}
                            size={40}
                          />
                        </Link>
                      ) : null}
                      <div>
                        <p className="font-medium tracking-tight">
                          {mon?.name ?? a.slug}
                          {a.insteadOf ? (
                            <span className="font-normal text-muted">
                              {" "}
                              instead of {getPokemon(a.insteadOf)?.name ?? a.insteadOf}
                            </span>
                          ) : null}
                        </p>
                        <p className="mt-1 text-muted">{a.why}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {megaPool ? (
        <div className="rounded-[28px] border border-line bg-sunken/50 p-5">
          <h3 className="text-lg font-semibold tracking-tight">Mega pool</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{megaPool.rule}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/85">{megaPool.previewPressure}</p>
          <ul className="mt-4 space-y-3">
            {megaPool.candidates.map((c) => {
              const mon = getPokemon(c.slug);
              return (
                <li
                  key={c.slug}
                  className="flex gap-3 rounded-2xl border border-line/60 bg-raised/40 p-3"
                  style={mon ? cssVars(mon.palette) : undefined}
                >
                  {mon ? (
                    <PokemonArt
                      slug={mon.slug}
                      src={mon.sprite || mon.artwork}
                      name={mon.name}
                      size={48}
                    />
                  ) : null}
                  <div className="min-w-0">
                    <p className="font-medium tracking-tight">
                      {mon?.name ?? c.slug}
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                        {c.stone}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-muted">{c.when}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {evidence ? (
        <div className="rounded-[28px] border border-line/70 bg-raised/30 p-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h3 className="text-lg font-semibold tracking-tight">Evidence</h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {[evidence.season, evidence.asOf].filter(Boolean).join(" · ")}
            </p>
          </div>
          {evidence.source ? (
            <p className="mt-2 text-sm text-muted">{evidence.source}</p>
          ) : null}
          {evidence.caveat ? (
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{evidence.caveat}</p>
          ) : null}
          {evidence.ladderTop?.length ? (
            <p className="mt-3 text-sm text-muted">
              Ladder center:{" "}
              <span className="text-ink/85">{evidence.ladderTop.join(" · ")}</span>
            </p>
          ) : null}
          {evidence.stats?.length ? (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {evidence.stats.map((s) => (
                <li
                  key={s.label}
                  className="rounded-2xl border border-line/50 bg-bg/40 px-3 py-2.5"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {s.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">{s.value}</p>
                  {s.note ? <p className="mt-1 text-xs text-muted">{s.note}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
