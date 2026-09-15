"use client";

import { motion } from "motion/react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { TYPE_LABEL } from "@/lib/champions/types";
import type { TypeId } from "@/types/pokemon";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { fadeUp } from "@/components/motion/tokens";

export function SafeSwitchCallout({
  slug,
  holes,
  compact = false,
}: {
  slug: string | null;
  holes: TypeId[];
  compact?: boolean;
}) {
  const mon = slug ? getPokemon(slug) : undefined;
  if (!mon && !holes.length) return null;

  return (
    <motion.div
      {...fadeUp}
      className={`flex items-center gap-3 rounded-[22px] border border-ink/25 bg-ink text-bg shadow-[0_10px_28px_rgba(0,0,0,0.28)] ${
        compact ? "px-3 py-2" : "px-4 py-3"
      }`}
      style={mon ? cssVars(mon.palette) : undefined}
    >
      {mon ? (
        <PokemonArt slug={mon.slug} src={mon.artwork} name={mon.name} size={compact ? 40 : 52} share />
      ) : null}
      <div className="min-w-0">
        {mon ? (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bg/70">Safe switch</p>
            <p className={`font-semibold tracking-tight ${compact ? "text-base" : "text-lg"}`}>{mon.name}</p>
          </>
        ) : null}
        {holes.length ? (
          <p className={`text-bg/75 ${compact ? "text-xs" : "text-sm"} ${mon ? "mt-0.5" : ""}`}>
            Shared hole · {holes.map((t) => TYPE_LABEL[t]).join(", ")}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
