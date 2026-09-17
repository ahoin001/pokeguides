"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { getPokemon } from "@/lib/catalog/lookup";
import { getRankedBySlug, legalSlugFromRankedName } from "@/lib/ranked/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { formatPct, shareLabel } from "@/lib/ranked/format";
import { teammateWhy } from "@/lib/live/compare";
import { MAX_FOES, useLiveMatchStore } from "@/stores/live-match";
import { easeOut, motionTokens } from "@/components/motion/tokens";

export function LiveFoeKit({ foeSlug }: { foeSlug: string }) {
  const [open, setOpen] = useState(false);
  const foes = useLiveMatchStore((s) => s.foes);
  const addFoe = useLiveMatchStore((s) => s.addFoe);
  const reduce = useReducedMotion();

  const mon = getPokemon(foeSlug);
  const ranked = getRankedBySlug(foeSlug);
  if (!mon || !ranked) {
    return (
      <p className="text-sm text-muted">
        No Singles ladder kit for this name yet — compare Spe and types above.
      </p>
    );
  }

  const topMoves = ranked.moves.slice(0, 4);
  const topItem = ranked.items[0] ?? ranked.item;
  const restMoves = ranked.moves.slice(4);
  const restItems = ranked.items.slice(1);

  return (
    <div className="space-y-4" style={cssVars(mon.palette)}>
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Likely kit
        </p>
        <p className="mt-1 text-sm text-muted">
          Common ladder lines — not their exact set.
        </p>
      </div>

      {topItem ? (
        <p className="text-sm">
          <span className="text-muted">Item · </span>
          <span className="font-medium">{shareLabel(topItem)}</span>
          {topItem.pct != null ? (
            <span className="text-muted"> ({formatPct(topItem.pct)})</span>
          ) : null}
        </p>
      ) : null}

      <ul className="flex flex-wrap gap-1.5">
        {topMoves.map((m) => (
          <li
            key={m.name}
            className="rounded-full border border-line/70 bg-raised/40 px-2.5 py-1 text-xs"
          >
            {m.name}
            {m.pct != null ? (
              <span className="ml-1 text-muted">{formatPct(m.pct)}</span>
            ) : null}
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-sm text-muted underline hover:text-ink"
      >
        <CaretDown
          size={12}
          weight="bold"
          className={`transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
        />
        Ladder details
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: motionTokens.state, ease: easeOut }}
            className="overflow-hidden"
          >
            <dl className="space-y-2 border-t border-line/60 pt-3 text-sm">
              {ranked.ability ? (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Ability
                  </dt>
                  <dd className="mt-0.5">{shareLabel(ranked.ability)}</dd>
                </div>
              ) : null}
              {ranked.nature ? (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Nature
                  </dt>
                  <dd className="mt-0.5">{shareLabel(ranked.nature)}</dd>
                </div>
              ) : null}
              {ranked.spread ? (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Leading SP
                  </dt>
                  <dd className="mt-0.5 font-mono text-xs tabular-nums text-muted">
                    {ranked.spread.hp}/{ranked.spread.atk}/{ranked.spread.def}/
                    {ranked.spread.spa}/{ranked.spread.spd}/{ranked.spread.spe}
                    {ranked.spread.pct != null
                      ? ` · ${formatPct(ranked.spread.pct)}`
                      : ""}
                  </dd>
                </div>
              ) : null}
              {restMoves.length || restItems.length ? (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Also seen
                  </dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {[...restItems, ...restMoves].slice(0, 10).map((x) => (
                      <span
                        key={x.name}
                        className="rounded-full border border-line/50 px-2 py-0.5 text-[11px] text-muted"
                      >
                        {x.name}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {ranked.teammates.length ? (
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Often with
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {ranked.teammates.slice(0, 8).map((name) => {
              const slug = legalSlugFromRankedName(name);
              const partner = slug ? getPokemon(slug) : undefined;
              const logged = slug ? foes.includes(slug) : false;
              const full = foes.length >= MAX_FOES;
              const why = teammateWhy(slug ?? "", name);
              return (
                <li key={name}>
                  <button
                    type="button"
                    disabled={!slug || logged || full}
                    onClick={() => slug && addFoe(slug)}
                    title={
                      !slug
                        ? name
                        : logged
                          ? "Already logged"
                          : full
                            ? "Their three is full"
                            : `Add ${name}`
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-raised/40 py-1 pl-1 pr-3 text-left text-sm transition enabled:hover:border-ink/40 disabled:opacity-50"
                    style={partner ? cssVars(partner.palette) : undefined}
                  >
                    {partner ? (
                      <PokemonArt
                        slug={partner.slug}
                        src={partner.sprite || partner.artwork}
                        name={partner.name}
                        size={28}
                      />
                    ) : null}
                    <span className="min-w-0">
                      <span className="block font-medium leading-tight">
                        {partner?.name ?? name}
                      </span>
                      <span className="block text-[11px] text-muted">{why}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
