"use client";

import Link from "next/link";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import type {
  ManualArchitectureLayer,
  ManualCheatRow,
  ManualCoverageNote,
  ManualEndgame,
  ManualGameState,
  ManualPack,
  ManualPackRole,
  ManualSpeedBenchmark,
} from "@/content/manuals";
import { resolvePackStrategy } from "@/content/manuals";
import { ManualFlowchart } from "@/components/manuals/ManualFlowchart";
import { TeamCoverage } from "@/components/manuals/TeamCoverage";
import type { CoverageMember } from "@/lib/champions/team-coverage";

export function ManualArchitectureStrip({ layers }: { layers: ManualArchitectureLayer[] }) {
  if (!layers.length) return null;
  return (
    <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {layers.map((layer, i) => (
        <li
          key={layer.title}
          className="rounded-[24px] border border-line/70 bg-raised/30 px-4 py-4"
        >
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            {String(i + 1).padStart(2, "0")}
          </p>
          <p className="mt-2 text-base font-semibold tracking-tight">{layer.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{layer.body}</p>
          {layer.slugs?.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {layer.slugs.map((slug) => {
                const mon = getPokemon(slug);
                if (!mon) return null;
                return (
                  <li key={slug} className="flex items-center gap-1.5" style={cssVars(mon.palette)}>
                    <PokemonArt
                      slug={mon.slug}
                      src={mon.sprite || mon.artwork}
                      name={mon.name}
                      size={28}
                    />
                    <span className="text-[11px] font-medium">{mon.name}</span>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function ManualEndgameTiles({ endgames }: { endgames: ManualEndgame[] }) {
  if (!endgames.length) return null;
  return (
    <ul className="grid gap-3 md:grid-cols-3">
      {endgames.map((e, i) => (
        <li key={e.id} className="rounded-[24px] border border-line/70 bg-raised/30 px-4 py-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Endgame {i + 1}
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight">{e.label}</p>
          <p className="mt-1 text-xs font-medium text-ink/80">{e.path}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{e.how}</p>
        </li>
      ))}
    </ul>
  );
}

export function ManualBenchmarkTable({ rows }: { rows: ManualSpeedBenchmark[] }) {
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto rounded-[24px] border border-line/70">
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line/70 bg-raised/40">
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Target
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Their Spe
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Yours
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Nature call
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.target} className="border-b border-line/50 last:border-0">
              <td className="px-4 py-3 font-medium">{r.target}</td>
              <td className="px-4 py-3 font-mono tabular-nums text-muted">{r.theirSpe}</td>
              <td className="px-4 py-3 font-mono tabular-nums text-muted">{r.yourSpe}</td>
              <td className="px-4 py-3 text-muted">{r.natureImplication}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ManualPackRoles({ roles }: { roles: ManualPackRole[] }) {
  if (!roles.length) return null;
  return (
    <ul className="grid gap-3 md:grid-cols-3">
      {roles.map((role) => {
        const mon = getPokemon(role.slug);
        return (
          <li
            key={role.slug}
            className="rounded-[24px] border border-line/70 bg-bg/35 px-4 py-4"
            style={mon ? cssVars(mon.palette) : undefined}
          >
            <div className="flex items-center gap-3">
              {mon ? (
                <PokemonArt
                  slug={mon.slug}
                  src={mon.sprite || mon.artwork}
                  name={mon.name}
                  size={44}
                />
              ) : null}
              <div className="min-w-0">
                <p className="truncate font-semibold tracking-tight">{mon?.name ?? role.slug}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {role.macro}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{role.micro}</p>
            {role.gives ? (
              <p className="mt-2 text-[12px] text-ink/80">Gives: {role.gives}</p>
            ) : null}
            {role.threatens?.length ? (
              <ul className="mt-3 flex flex-wrap gap-1">
                {role.threatens.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-line/50 bg-raised/40 px-2 py-0.5 text-[10px] text-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function ManualMacroJobStrip({
  roles,
  gamePlan,
}: {
  roles: ManualPackRole[];
  gamePlan?: string;
}) {
  if (!roles.length) return null;
  return (
    <div className="rounded-[24px] border border-line/70 bg-raised/25 px-4 py-4">
      {gamePlan ? <p className="mb-4 text-sm text-muted">{gamePlan}</p> : null}
      <ol className="flex flex-col gap-2 md:flex-row md:items-stretch md:gap-0">
        {roles.map((role, i) => {
          const mon = getPokemon(role.slug);
          return (
            <li key={role.slug} className="flex min-w-0 flex-1 items-stretch md:items-center">
              <div className="flex min-w-0 flex-1 flex-col justify-center rounded-2xl border border-line/60 bg-bg/40 px-3 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {role.macro}
                </p>
                <p className="mt-1 truncate text-sm font-semibold">{mon?.name ?? role.slug}</p>
              </div>
              {i < roles.length - 1 ? (
                <span aria-hidden className="hidden px-2 text-muted md:flex md:items-center">
                  →
                </span>
              ) : null}
              {i < roles.length - 1 ? (
                <span aria-hidden className="py-1 text-center text-muted md:hidden">
                  ↓
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ManualCheatTable({ rows }: { rows: ManualCheatRow[] }) {
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto rounded-[24px] border border-line/70">
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line/70 bg-raised/40">
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Situation
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Preferred thought
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.situation} className="border-b border-line/50 last:border-0 align-top">
              <td className="px-4 py-3 text-muted">{r.situation}</td>
              <td className="px-4 py-3 font-medium text-ink/90">{r.thought}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ManualPackDossier({
  pack,
  coverageMembers,
  notes = [],
}: {
  pack: ManualPack;
  coverageMembers: CoverageMember[];
  notes?: ManualCoverageNote[];
}) {
  const strategy = resolvePackStrategy(pack);
  const roles = pack.roles ?? [];
  const macroFlow = pack.flows?.find(
    (f) => f.id === "macro" || f.title.toLowerCase().includes("package"),
  );
  const dossierFlows = (pack.flows ?? []).filter(
    (f) =>
      f !== macroFlow &&
      !["lead", "mid", "late"].includes(f.id) &&
      (f.forks?.length ?? 0) > 0,
  );

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-line/70 bg-raised/30 p-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          When to bring
        </p>
        <p className="mt-2 text-base font-medium tracking-tight">{strategy.opponentPattern}</p>
        <p className="mt-2 max-w-[60ch] text-sm text-muted">{strategy.purpose}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Targets</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {strategy.targets.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line/60 bg-bg/40 px-2.5 py-1 text-[11px]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Refuse</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {strategy.refuses.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line/60 bg-bg/40 px-2.5 py-1 text-[11px] text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm">
          <span className="font-medium">Wins by: </span>
          <span className="text-muted">{strategy.winCondition}</span>
        </p>
        {strategy.megaChoice ? (
          <p className="mt-2 text-xs text-muted">
            Mega: {getPokemon(strategy.megaChoice)?.name ?? strategy.megaChoice}
          </p>
        ) : null}
      </div>

      {roles.length ? (
        <div className="space-y-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Roles in this package
          </p>
          <ManualPackRoles roles={roles} />
          <ManualMacroJobStrip roles={roles} gamePlan={strategy.gamePlan} />
        </div>
      ) : null}

      {macroFlow ? (
        <div>
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Package flow
          </p>
          <ManualFlowchart flow={macroFlow} />
        </div>
      ) : null}

      {dossierFlows.length ? (
        <div className="space-y-6">
          {dossierFlows.map((flow) => (
            <div key={flow.id}>
              <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                {flow.title}
              </p>
              {flow.lede ? <p className="mb-3 max-w-[52ch] text-sm text-muted">{flow.lede}</p> : null}
              <ManualFlowchart flow={flow} />
            </div>
          ))}
        </div>
      ) : null}

      {pack.gameStates?.length ? (
        <div>
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Four game states
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {pack.gameStates.map((s) => (
              <li
                key={s.id}
                className="rounded-[24px] border border-line/70 bg-raised/25 px-4 py-3"
              >
                <p className="text-sm font-semibold tracking-tight">{s.label}</p>
                <p className="mt-1 text-[12px] text-muted">{s.trigger}</p>
                <p className="mt-2 text-sm text-ink/85">{s.play}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {pack.cheatSheet?.length ? (
        <div>
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Cheat sheet
          </p>
          <ManualCheatTable rows={pack.cheatSheet} />
        </div>
      ) : null}

      <TeamCoverage members={coverageMembers} notes={notes} title="This three · kit coverage" />

      <p className="text-xs text-muted">
        Sets for{" "}
        {pack.slugs
          .map((s) => getPokemon(s)?.name)
          .filter(Boolean)
          .join(" · ")}{" "}
        —{" "}
        <Link href="#sets" className="underline hover:text-ink">
          jump to kits
        </Link>
      </p>
    </div>
  );
}
