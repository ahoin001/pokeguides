"use client";

import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { ManualSection } from "@/components/manuals/ManualSection";
import { ManualArchitectureStrip, ManualEndgameTiles } from "@/components/manuals/ManualPackDossier";
import type {
  ManualControlPlane,
  ManualEngine,
  ManualMatchupScript,
  ManualPreviewTree,
  ManualSequence,
  ManualTradeLedger,
  TeamManual,
} from "@/content/manuals";

export function SequenceBeats({ sequence }: { sequence: ManualSequence }) {
  return (
    <ol className="space-y-2">
      {sequence.title ? (
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          {sequence.title}
        </p>
      ) : null}
      {sequence.beats.map((beat, i) => {
        const mon = beat.slug ? getPokemon(beat.slug) : undefined;
        return (
          <li key={`${beat.click}-${i}`} className="flex items-start gap-3">
            <span className="mt-0.5 font-mono text-[10px] tabular-nums text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            {mon ? (
              <span className="mt-0.5 shrink-0" style={cssVars(mon.palette)}>
                <PokemonArt
                  slug={mon.slug}
                  src={mon.sprite || mon.artwork}
                  name={mon.name}
                  size={28}
                />
              </span>
            ) : null}
            <div className="min-w-0">
              <p className="text-sm font-medium leading-snug">
                {mon ? `${mon.name} · ` : ""}
                {beat.click}
              </p>
              {beat.why ? <p className="mt-0.5 text-xs text-muted">{beat.why}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ManualEngineBoard({ engines }: { engines: ManualEngine[] }) {
  if (!engines.length) return null;
  return (
    <ul className="grid gap-3 lg:grid-cols-3">
      {engines.map((engine, i) => (
        <li key={engine.id} className="rounded-[24px] border border-line/70 bg-raised/30 px-4 py-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Engine {String(i + 1).padStart(2, "0")}
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight">{engine.label}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{engine.how}</p>
          <p className="mt-3 text-xs leading-relaxed text-ink/80">{engine.path.join(" → ")}</p>
          {engine.dependsOn ? (
            <p className="mt-3 text-xs text-muted">Needs: {engine.dependsOn}</p>
          ) : null}
          {engine.disrupt ? (
            <p className="mt-1 text-xs text-muted">Denied by: {engine.disrupt}</p>
          ) : null}
          {engine.fallback ? (
            <p className="mt-1 text-xs text-muted">If denied: {engine.fallback}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function ManualControlTriangle({ planes }: { planes: ManualControlPlane[] }) {
  if (!planes.length) return null;
  const speed = planes.filter((p) => p.id !== "coaching");
  const coaching = planes.filter((p) => p.id === "coaching");
  return (
    <div className="space-y-3">
      <ul className="grid gap-3 sm:grid-cols-3">
        {speed.map((plane) => {
          const mon = getPokemon(plane.setterSlug);
          return (
            <li
              key={plane.id}
              className="rounded-[24px] border border-line/70 bg-raised/30 px-4 py-4"
              style={mon ? cssVars(mon.palette) : undefined}
            >
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                {plane.label}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {mon ? (
                  <PokemonArt
                    slug={mon.slug}
                    src={mon.sprite || mon.artwork}
                    name={mon.name}
                    size={40}
                  />
                ) : null}
                <p className="text-sm font-semibold">{mon?.name ?? plane.setterSlug}</p>
              </div>
              <p className="mt-2 text-sm text-muted">{plane.effect}</p>
              <p className="mt-1 text-xs text-muted">{plane.whoBenefits}</p>
            </li>
          );
        })}
      </ul>
      {coaching.map((plane) => {
        const mon = getPokemon(plane.setterSlug);
        return (
          <p key={plane.id} className="text-sm text-muted">
            Fourth plane: <span className="font-medium text-ink">{plane.label}</span>
            {mon ? ` from ${mon.name}` : ""} — {plane.effect}. {plane.whoBenefits}.
          </p>
        );
      })}
    </div>
  );
}

export function ManualPreviewTrees({
  trees,
  onSelectPack,
}: {
  trees: ManualPreviewTree[];
  onSelectPack?: (packId: string) => void;
}) {
  if (!trees.length) return null;
  return (
    <ol className="grid gap-4 lg:grid-cols-2">
      {trees.map((tree) => (
        <li key={tree.ask} className="rounded-[24px] border border-line/70 bg-raised/30 px-5 py-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Memorize
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight">{tree.ask}</p>
          <ul className="mt-4 space-y-3">
            {tree.branches.map((b) => (
              <li key={b.when}>
                {b.bringPackId && onSelectPack ? (
                  <button
                    type="button"
                    onClick={() => onSelectPack(b.bringPackId!)}
                    className="w-full rounded-2xl border border-line/60 bg-raised/40 px-3 py-3 text-left transition hover:border-ink/30"
                  >
                    <p className="text-sm font-medium">{b.when}</p>
                    <p className="mt-1 text-sm text-muted">{b.then}</p>
                    {b.note ? <p className="mt-1 text-xs text-muted">{b.note}</p> : null}
                  </button>
                ) : (
                  <div>
                    <p className="text-sm font-medium">{b.when}</p>
                    <p className="mt-1 text-sm text-muted">{b.then}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export function ManualMatchupScripts({
  scripts,
  packs,
  onSelectPack,
}: {
  scripts: ManualMatchupScript[];
  packs: { id: string; label: string }[];
  onSelectPack?: (packId: string) => void;
}) {
  if (!scripts.length) return null;
  return (
    <ul className="grid gap-3 lg:grid-cols-2">
      {scripts.map((script) => {
        const pack = packs.find((p) => p.id === script.packId);
        return (
          <li key={script.id} className="rounded-[24px] border border-line/70 bg-raised/30 px-5 py-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-lg font-semibold tracking-tight">{script.foe}</p>
              {pack && onSelectPack ? (
                <button
                  type="button"
                  onClick={() => onSelectPack(script.packId)}
                  className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted transition hover:border-ink/40 hover:text-ink"
                >
                  {pack.label}
                </button>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{script.why}</p>
            <div className="mt-4">
              <SequenceBeats sequence={script.sequence} />
            </div>
            {script.trap ? (
              <p className="mt-3 text-xs text-muted">Trap: {script.trap}</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function ManualTradeLedger({ ledger }: { ledger: ManualTradeLedger }) {
  const droppedMon = getPokemon(ledger.dropped.slug);
  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[24px] border border-line/70 bg-raised/30 px-5 py-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            We dropped
          </p>
          <p className="mt-2 text-lg font-semibold">{droppedMon?.name ?? ledger.dropped.slug}</p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            {ledger.dropped.lost.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[24px] border border-line/70 bg-raised/30 px-5 py-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            We gained
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            {ledger.gained.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
      {ledger.rejectedAlts?.length ? (
        <ul className="space-y-3">
          {ledger.rejectedAlts.map((alt) => {
            const mon = getPokemon(alt.slug);
            return (
              <li key={alt.slug} className="rounded-[24px] border border-line/70 px-5 py-4">
                <p className="text-sm font-medium">Not v1: {mon?.name ?? alt.slug}</p>
                <p className="mt-1 text-sm text-muted">{alt.whyNot}</p>
              </li>
            );
          })}
        </ul>
      ) : null}
      {ledger.laterTests?.length ? (
        <ul className="space-y-3">
          {ledger.laterTests.map((test) => {
            const mon = getPokemon(test.slug);
            return (
              <li key={`${test.slug}-${test.change}`} className="text-sm">
                <span className="font-medium">{mon?.name ?? test.slug}</span>
                <span className="text-muted"> — {test.change}. {test.whenToTest}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function ManualDoublesArchitecture({ parent }: { parent: TeamManual }) {
  const engines = parent.engines ?? [];
  const planes = parent.controlPlanes ?? [];
  const layers = parent.architecture ?? [];
  const endgames = parent.construction?.endgames ?? [];
  if (!engines.length && !planes.length && !layers.length && !endgames.length) return null;
  return (
    <ManualSection
      id="architecture"
      title="Architecture"
      purpose="Three engines kept. Four ways to control the clock. Two Tailwinds that mean different things."
    >
      <div className="space-y-8">
        {engines.length ? <ManualEngineBoard engines={engines} /> : null}
        {planes.length ? <ManualControlTriangle planes={planes} /> : null}
        {endgames.length ? <ManualEndgameTiles endgames={endgames} /> : null}
        {layers.length ? <ManualArchitectureStrip layers={layers} /> : null}
      </div>
    </ManualSection>
  );
}
