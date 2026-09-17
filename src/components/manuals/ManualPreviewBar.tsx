"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { MANUAL_SCROLL_MT } from "@/components/manuals/ManualToc";
import { resolvePackStrategy, type ManualPack, type SlotManual } from "@/content/manuals";

export function ManualLineup({
  box,
  core,
  roster,
  packs,
  packId,
  activeSlugs,
  onPickSlug,
  onSelectPack,
}: {
  box: string[];
  core: string[];
  roster: SlotManual[];
  packs: ManualPack[];
  packId: string;
  activeSlugs: string[];
  onPickSlug: (slug: string) => void;
  onSelectPack: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const coreSet = new Set(core);
  const active = new Set(activeSlugs);
  const bySlug = new Map(roster.map((s) => [s.slug, s]));
  const coreRow = box.filter((slug) => coreSet.has(slug));
  const flexRow = box.filter((slug) => !coreSet.has(slug));
  const pack = packs.find((p) => p.id === packId) ?? packs[0];
  const wash = getPokemon(coreRow[0] ?? box[0]);

  return (
    <section
      id="packages"
      className={`relative mt-10 max-w-3xl overflow-hidden rounded-[32px] border border-ink/20 bg-sunken shadow-[0_22px_60px_rgba(0,0,0,0.42)] ${MANUAL_SCROLL_MT}`}
      style={wash ? cssVars(wash.palette) : undefined}
    >
      <div className="relative p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Packages from the six</h2>
            <p className="mt-1 max-w-[48ch] text-sm text-muted">
              Core is who the three is built around. Flex is the slot you swap after preview. Each
              pack is a bring you can cut from this six.
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {coreRow.length} core · {flexRow.length} flex · {packs.length} packs
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <SeatRow
            label="Core"
            slugs={coreRow}
            active={active}
            bySlug={bySlug}
            size={72}
            onPick={onPickSlug}
          />
          {flexRow.length ? (
            <div className="rounded-[24px] border border-white/[0.08] bg-bg/50 px-3 py-3 sm:px-4">
              <SeatRow
                label="Flex"
                slugs={flexRow}
                active={active}
                bySlug={bySlug}
                size={56}
                onPick={onPickSlug}
              />
            </div>
          ) : null}
        </div>

        <div id="preview" className={`mt-6 ${MANUAL_SCROLL_MT}`}>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Preview pack
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {packs.map((p) => {
              const on = p.id === pack?.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => onSelectPack(p.id)}
                    className={`rounded-full px-4 py-2 text-left transition ${
                      on
                        ? "bg-ink text-bg shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
                        : "border border-line bg-raised/40 text-muted hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    <span className="block text-sm font-medium tracking-tight">{p.label}</span>
                    {on ? (
                      <span className="mt-0.5 block max-w-[28ch] text-xs text-bg/70">{p.when}</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <AnimatePresence mode="wait">
            {pack ? (
              <motion.div
                key={pack.id}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: motionTokens.state, ease: easeOut }}
                className="mt-4 space-y-4"
              >
                <PackStrategyBlock pack={pack} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function PackStrategyBlock({ pack }: { pack: ManualPack }) {
  const plan = resolvePackStrategy(pack);
  const names = plan.bring
    .map((slug) => getPokemon(slug)?.name)
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="max-w-[56ch] space-y-3">
      <p className="text-[15px] leading-relaxed text-ink/90">{pack.identity}</p>
      <dl className="space-y-2.5 border-t border-white/[0.08] pt-3">
        <div>
          <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Saw
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-ink/85">{plan.opponentPattern}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Bring
          </dt>
          <dd className="mt-1 text-sm font-medium tracking-tight text-ink">{names}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Purpose
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-ink/85">{plan.purpose}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Win condition
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-ink/85">{plan.winCondition}</dd>
        </div>
        {plan.megaChoice || plan.megaOptions?.length ? (
          <div>
            <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Mega
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink/85">
              {plan.megaChoice
                ? `${getPokemon(plan.megaChoice)?.name ?? plan.megaChoice} preferred`
                : null}
              {plan.megaOptions && plan.megaOptions.length > 1 ? (
                <span className="text-muted">
                  {plan.megaChoice ? " — also " : ""}
                  {plan.megaOptions
                    .filter((s) => s !== plan.megaChoice)
                    .map((s) => getPokemon(s)?.name ?? s)
                    .join(" / ")}
                </span>
              ) : null}
            </dd>
          </div>
        ) : null}
        {plan.winconMode ? (
          <div>
            <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Wincon mode
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink/85">{plan.winconMode}</dd>
          </div>
        ) : null}
      </dl>
      {(plan.targets.length > 0 || plan.refuses.length > 0) && (
        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
          {plan.targets.length > 0 ? (
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Targets
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {plan.targets.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-line/80 bg-raised/30 px-2.5 py-0.5 text-xs text-ink/80"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {plan.refuses.length > 0 ? (
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Refuse
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {plan.refuses.map((r) => (
                  <li
                    key={r}
                    className="rounded-full border border-line/50 px-2.5 py-0.5 text-xs text-muted"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function SeatRow({
  label,
  slugs,
  active,
  bySlug,
  size,
  onPick,
}: {
  label: string;
  slugs: string[];
  active: Set<string>;
  bySlug: Map<string, SlotManual>;
  size: number;
  onPick: (slug: string) => void;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <ul className="mt-2 flex flex-wrap gap-2 sm:gap-3">
        {slugs.map((slug) => {
          const mon = getPokemon(slug);
          const slot = bySlug.get(slug);
          if (!mon) return null;
          const on = active.has(slug);
          return (
            <li key={slug}>
              <button
                type="button"
                onClick={() => onPick(slug)}
                aria-pressed={on}
                className={`flex min-h-11 min-w-[5.5rem] flex-col items-center rounded-[22px] border px-3 py-2.5 text-center transition ${
                  on
                    ? "border-ink/40 bg-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.32)]"
                    : "border-transparent bg-transparent opacity-45 hover:opacity-90"
                }`}
                style={cssVars(mon.palette)}
              >
                <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={size} />
                <span className="mt-1.5 block max-w-[7.5rem] truncate text-sm font-medium tracking-tight">
                  {mon.name}
                </span>
                <span className="mt-0.5 block max-w-[7.5rem] truncate text-[11px] text-muted">
                  {slot?.title ?? slot?.role ?? label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
