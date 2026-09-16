"use client";

import { motion } from "motion/react";
import { Crosshair } from "@phosphor-icons/react";
import { easeOut, motionTokens } from "@/components/motion/tokens";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import type { TeamThreat } from "@/lib/champions/team-threats";

export function ThreatsList({
  threats,
  onScout,
}: {
  threats: TeamThreat[];
  onScout: (slug: string) => void;
}) {
  if (!threats.length) {
    return (
      <p className="text-sm text-muted">
        No meta threats clearing the bar yet — fill more of the bench, or the ranked snapshot is thin.
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted">
        Ranked names whose STABs hit enough of your three. Scout opens the matchup dock.
      </p>
      <ul className="mt-4 divide-y divide-line/70 overflow-hidden rounded-[22px] border border-line">
        {threats.map((t, i) => (
          <motion.li
            key={t.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.state, ease: easeOut, delay: i * 0.03 }}
          >
            <button
              type="button"
              onClick={() => onScout(t.slug)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-white/[0.04]"
            >
              <PokemonArt
                slug={t.slug}
                src={t.sprite || t.artwork}
                name={t.name}
                share
                size={44}
                className="shrink-0"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold tracking-tight">{t.name}</span>
                <span className="mt-1 flex flex-wrap gap-1">
                  {t.types.map((type) => (
                    <TypeBadge key={type} type={type} size="sm" />
                  ))}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-xs tabular-nums ${
                  t.weakCount >= t.teamSize
                    ? "bg-rose-500/25 text-rose-100"
                    : t.weakCount >= Math.ceil(t.teamSize * 0.66)
                      ? "bg-amber-500/20 text-amber-100"
                      : "bg-white/8 text-muted"
                }`}
              >
                {t.weakCount}/{t.teamSize} weak
              </span>
              <Crosshair size={16} className="shrink-0 text-muted" weight="bold" aria-hidden />
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
