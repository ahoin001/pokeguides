"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { Button } from "@/components/ui/Button";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { TYPE_LABEL } from "@/lib/champions/types";
import type { TypeId } from "@/types/pokemon";
import type { FlowFork, ManualFlow } from "@/content/manuals";
import { MANUAL_SCROLL_MT } from "./ManualToc";
import { easeOut, motionTokens } from "@/components/motion/tokens";

const MOVE_TYPE: Record<string, TypeId> = {
  earthquake: "ground",
  "iron head": "steel",
  "stone edge": "rock",
  "rock slide": "rock",
  "swords dance": "normal",
  "dragon dance": "dragon",
  outrage: "dragon",
  "dragon claw": "dragon",
  "extreme speed": "normal",
  moonblast: "fairy",
  surf: "water",
  "hydro pump": "water",
  "ice beam": "ice",
  "calm mind": "psychic",
  protect: "normal",
  "fake out": "normal",
  "flare blitz": "fire",
  "parting shot": "dark",
  "will-o-wisp": "fire",
  snarl: "dark",
  taunt: "dark",
  tailwind: "flying",
  encore: "normal",
  "u-turn": "bug",
  "brave bird": "flying",
  roost: "flying",
  "body press": "fighting",
  "iron defense": "steel",
  "scale shot": "dragon",
  "grassy glide": "grass",
  "wood hammer": "grass",
  "dire claw": "poison",
  "close combat": "fighting",
  "double-edge": "normal",
  hurricane: "flying",
  "weather ball": "water",
  "electro shot": "electric",
  "wave crash": "water",
  "last respects": "ghost",
  "aqua jet": "water",
  "trick room": "psychic",
  psychic: "psychic",
  "energy ball": "grass",
  "kowtow cleave": "dark",
  "sucker punch": "dark",
  "make it rain": "steel",
  "shadow ball": "ghost",
  "heat wave": "fire",
  "solar beam": "grass",
  "pyro ball": "fire",
  "high jump kick": "fighting",
  "flash cannon": "steel",
  "draco meteor": "dragon",
  "dazzling gleam": "fairy",
  "thunder wave": "electric",
  "nasty plot": "dark",
  "hyper voice": "normal",
  "focus blast": "fighting",
};

const INK_DARK: TypeId[] = ["electric", "ice", "ground", "normal", "bug", "steel", "fairy"];

function moveType(name: string): TypeId | undefined {
  const key = name.split(/\s*(?:[/]|,\s*| or )\s*/)[0]?.trim().toLowerCase();
  return key ? MOVE_TYPE[key] : undefined;
}

function findFork(forks: FlowFork[], id: string): FlowFork | undefined {
  for (const fork of forks) {
    if (fork.id === id) return fork;
    if (fork.forks) {
      const hit = findFork(fork.forks, id);
      if (hit) return hit;
    }
  }
  return undefined;
}

function crumbLabel(fork: FlowFork) {
  if (fork.move) return fork.move;
  const slug = fork.send || fork.out;
  const mon = slug ? getPokemon(slug) : undefined;
  if (mon && fork.when === "This Pokémon is out") return `${mon.name} is out`;
  if (mon && fork.send && !fork.when) return mon.name;
  return fork.when;
}

function washSlug(flow: ManualFlow, path: string[]) {
  for (let i = path.length - 1; i >= 0; i -= 1) {
    const fork = findFork(flow.forks, path[i]);
    const slug = fork?.send || fork?.out;
    if (slug) return slug;
  }
  return undefined;
}

function MoveChip({ name }: { name: string }) {
  const type = moveType(name);
  if (!type) {
    return <span className="rounded-full bg-white/8 px-2.5 py-1 text-xs font-medium">{name}</span>;
  }
  const ink = INK_DARK.includes(type) ? "text-[#1a1a1a]" : "text-white";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold tracking-tight ${ink}`}
      style={{ background: `var(--type-${type})`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)" }}
      title={TYPE_LABEL[type]}
    >
      {name}
    </span>
  );
}

export function ManualFlowchart({ flow }: { flow: ManualFlow }) {
  const [path, setPath] = useState<string[]>([]);
  const [mode, setMode] = useState<"path" | "all">("path");
  const wash = washSlug(flow, path);
  const mon = wash ? getPokemon(wash) : undefined;
  const crumbs = useMemo(
    () => path.map((id) => findFork(flow.forks, id)).filter((f): f is FlowFork => Boolean(f)),
    [flow.forks, path],
  );

  function onKey(e: KeyboardEvent<HTMLElement>) {
    if (e.key !== "Escape") return;
    e.preventDefault();
    setPath((p) => p.slice(0, -1));
  }

  return (
    <MotionConfig reducedMotion="user">
    <section
      id={`flow-${flow.id}`}
      className={`mt-16 ${MANUAL_SCROLL_MT}`}
      style={mon ? cssVars(mon.palette) : undefined}
      tabIndex={0}
      onKeyDown={onKey}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{flow.title}</h2>
          {flow.lede ? <p className="mt-2 max-w-[52ch] text-sm text-muted">{flow.lede}</p> : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          className="shrink-0 text-xs"
          onClick={() => {
            if (mode === "path") {
              setMode("all");
              setPath([]);
            } else {
              setMode("path");
            }
          }}
        >
          {mode === "path" ? "Show every branch" : "Follow a path"}
        </Button>
      </div>

      {crumbs.length ? (
        <ol className="mt-4 flex flex-wrap items-center gap-1.5 text-sm">
          {crumbs.map((fork, i) => (
            <li key={fork.id} className="flex items-center gap-1.5">
              {i > 0 ? <span className="text-muted">→</span> : null}
              <button
                type="button"
                className="rounded-full bg-white/8 px-2.5 py-1 text-left hover:bg-white/12"
                onClick={() => setPath(path.slice(0, i + 1))}
              >
                {crumbLabel(fork)}
              </button>
            </li>
          ))}
        </ol>
      ) : null}

      <div className="relative mt-5 overflow-hidden rounded-[28px] border border-line bg-raised/40">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background: mon
              ? `radial-gradient(90% 80% at 100% 0%, color-mix(in srgb, var(--mon-wash) 28%, transparent), transparent 62%)`
              : undefined,
          }}
        />
        <div className="relative p-2 md:p-3">
          <ForkList
            forks={flow.forks}
            ancestors={[]}
            path={path}
            mode={mode}
            duration={motionTokens.layout}
            onPick={(id, ancestors) =>
              setPath((p) => {
                const next = [...ancestors, id];
                if (p.length >= next.length && next.every((x, i) => p[i] === x)) return ancestors;
                return next;
              })
            }
          />
        </div>
      </div>
    </section>
    </MotionConfig>
  );
}

function ForkList({
  forks,
  ancestors,
  path,
  mode,
  duration,
  onPick,
}: {
  forks: FlowFork[];
  ancestors: string[];
  path: string[];
  mode: "path" | "all";
  duration: number;
  onPick: (id: string, ancestors: string[]) => void;
}) {
  const depth = ancestors.length;
  const selected = path[depth];
  const rootGrid = depth === 0 && path.length === 0;
  return (
    <ul
      className={
        depth
          ? "ml-3 border-l border-line/80 pl-3 md:ml-4 md:pl-4"
          : rootGrid
            ? "grid gap-1 sm:grid-cols-2 xl:grid-cols-3"
            : ""
      }
    >
      {forks.map((fork) => {
        const dim = mode === "path" && selected && selected !== fork.id;
        return (
          <li key={fork.id} className={dim ? "opacity-35 transition-opacity duration-200 motion-reduce:transition-none" : "opacity-100 transition-opacity duration-200 motion-reduce:transition-none"}>
            <ForkNode
              fork={fork}
              ancestors={ancestors}
              path={path}
              mode={mode}
              duration={duration}
              onPick={onPick}
            />
          </li>
        );
      })}
    </ul>
  );
}

function ForkNode({
  fork,
  ancestors,
  path,
  mode,
  duration,
  onPick,
}: {
  fork: FlowFork;
  ancestors: string[];
  path: string[];
  mode: "path" | "all";
  duration: number;
  onPick: (id: string, ancestors: string[]) => void;
}) {
  const children = fork.forks?.filter((f) => f.when || f.then) ?? [];
  const hasKids = children.length > 0;
  const depth = ancestors.length;
  const chosen = path[depth] === fork.id;
  const open = mode === "all" ? hasKids : chosen && hasKids;
  const slug = fork.send || fork.out;
  const mon = slug ? getPokemon(slug) : undefined;
  const question = mon && fork.when === "This Pokémon is out" ? `${mon.name} is out` : fork.when;
  const leaf = Boolean(fork.then) && !hasKids;

  return (
    <div className="py-1">
      {hasKids ? (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => onPick(fork.id, ancestors)}
          className={`flex min-h-11 w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-white/6 ${
            chosen ? "bg-white/8" : ""
          }`}
        >
          <CaretDown
            size={14}
            weight="bold"
            className={`mt-1 shrink-0 text-muted transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-medium uppercase tracking-wide text-muted">If</span>
            <span className="mt-0.5 block font-medium leading-snug">{question}</span>
            {fork.then ? <span className="mt-1 block text-sm text-muted">{fork.then}</span> : null}
          </span>
          {mon ? (
            <PokemonArt slug={mon.slug} src={mon.sprite || mon.artwork} name={mon.name} size={40} className="shrink-0" />
          ) : null}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onPick(fork.id, ancestors)}
          className={`flex min-h-11 w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-white/6 ${
            chosen ? "bg-white/8" : ""
          }`}
        >
          {mon ? (
            <PokemonArt slug={mon.slug} src={mon.sprite || mon.artwork} name={mon.name} size={48} className="shrink-0" />
          ) : (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink/50" />
          )}
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-medium uppercase tracking-wide text-muted">{leaf ? "If" : "Then"}</span>
            <span className="mt-0.5 block text-sm leading-snug text-muted">{fork.when}</span>
            {fork.then ? <span className="mt-1 block font-medium leading-snug">{fork.then}</span> : null}
            {fork.move ? (
              <span className="mt-2 block">
                <MoveChip name={fork.move} />
              </span>
            ) : null}
            {fork.why ? <span className="mt-1.5 block text-xs leading-snug text-muted">{fork.why}</span> : null}
          </span>
        </button>
      )}
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration, ease: easeOut }}
            className="overflow-hidden"
          >
            <ForkList
              forks={children}
              ancestors={[...ancestors, fork.id]}
              path={path}
              mode={mode}
              duration={duration}
              onPick={onPick}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
