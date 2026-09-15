"use client";

import { useState } from "react";
import { getPokemon } from "@/lib/catalog/load";
import { cssVars } from "@/lib/champions/palette";
import { PokemonArt } from "@/components/pokemon/PokemonArt";
import { TypeBadge } from "@/components/pokemon/TypeBadge";

type Side = {
  label: string;
  slugs: [string, string, string];
  wincon: string;
  hole: string;
  likelyLead: string;
};

const YOU: Side = {
  label: "Honest Balance",
  slugs: ["whimsicott", "corviknight", "garchomp"],
  wincon: "garchomp",
  hole: "garchomp",
  likelyLead: "whimsicott",
};

const THEM: Side = {
  label: "Scale Sweep",
  slugs: ["excadrill", "primarina", "dragonite"],
  wincon: "dragonite",
  hole: "dragonite",
  likelyLead: "excadrill",
};

const PIN_COPY: Record<"wincon" | "hole" | "lead", Record<string, string>> = {
  wincon: {
    garchomp: "Earthquake after Tailwind. The cleaner. Never lead it into Ice.",
    dragonite: "Multiscale kite. Extreme Speed once the wall is gone.",
  },
  hole: {
    garchomp: "4× Ice. Corvi is the patch — 1× Ice, not a resist.",
    dragonite: "4× Ice. Hide it. Primarina is the special patch, not an Ice sponge.",
  },
  lead: {
    whimsicott: "Clock first. Prankster Tailwind is +1 — Fake Out still flinches you.",
    excadrill: "Mold Breaker sand. They lead this unless Ice is already the plan.",
  },
};

const VERDICTS: Record<string, { ok: boolean; body: string }> = {
  whimsicott: {
    ok: true,
    body: "Clock. Tailwind before Drill or Dragonite dictate. Then switch — not U-turn into Garchomp.",
  },
  corviknight: {
    ok: true,
    body: "Safe if you expect Ice or Fairy. You give up the clock. Use this when Cott dies on send.",
  },
  garchomp: {
    ok: false,
    body: "Their wincon is Dragonite. Ice is on Primarina. Leading the cleaner donates the 4×. Keep Garchomp in the bag.",
  },
};

type Pin = "wincon" | "hole" | "lead";

export function PreviewBoard() {
  const [pin, setPin] = useState<Pin>("wincon");
  const [focus, setFocus] = useState<string | null>(null);
  const [send, setSend] = useState<string | null>(null);
  const verdict = send ? VERDICTS[send] : undefined;

  function onTap(slug: string) {
    setFocus(slug);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["wincon", "hole", "lead"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setPin(key)}
            className={`rounded-full px-3.5 py-1.5 text-sm capitalize transition ${
              pin === key ? "bg-ink text-bg" : "bg-white/6 text-muted hover:bg-white/10 hover:text-ink"
            }`}
          >
            {key === "lead" ? "Likely lead" : key === "wincon" ? "Wincon" : "Hole"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SideTray side={YOU} pin={pin} focus={focus} onTap={onTap} yours />
        <SideTray side={THEM} pin={pin} focus={focus} onTap={onTap} />
      </div>

      {focus ? (
        <p className="rounded-2xl border border-line bg-raised/50 px-4 py-3 text-sm leading-relaxed">
          {pinLabel(pin, focus)}
        </p>
      ) : (
        <p className="text-sm text-muted">Tap a name to pin wincon, hole, or likely lead.</p>
      )}

      <div>
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Your first send</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {YOU.slugs.map((slug) => {
            const p = getPokemon(slug);
            if (!p) return null;
            const on = send === slug;
            return (
              <li key={slug}>
                <button
                  type="button"
                  onClick={() => setSend(slug)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                    on ? "border-ink/50 bg-white/10" : "border-line bg-raised/40 hover:bg-raised"
                  }`}
                >
                  <PokemonArt slug={p.slug} src={p.sprite || p.artwork} name={p.name} size={28} />
                  {p.name}
                </button>
              </li>
            );
          })}
        </ul>
        {verdict ? (
          <p className={`mt-3 text-[15px] leading-relaxed ${verdict.ok ? "text-ink" : "text-muted"}`}>
            <span className="font-medium text-ink">{verdict.ok ? "Respects their wincon. " : "Donates the cleaner. "}</span>
            {verdict.body}
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted">Pick your send. The board answers whether it respects their kite.</p>
        )}
      </div>
    </div>
  );
}

function pinLabel(pin: Pin, slug: string) {
  return PIN_COPY[pin][slug] ?? "Not a pin on this board. Try the names the pins highlight.";
}

function SideTray({
  side,
  pin,
  focus,
  onTap,
  yours,
}: {
  side: Side;
  pin: Pin;
  focus: string | null;
  onTap: (slug: string) => void;
  yours?: boolean;
}) {
  const marked =
    pin === "wincon" ? side.wincon : pin === "hole" ? side.hole : side.likelyLead;

  return (
    <div className="rounded-[28px] border border-line bg-sunken/70 p-4">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
        {yours ? "You" : "Them"} · {side.label}
      </p>
      <ol className="mt-3 grid grid-cols-3 gap-2">
        {side.slugs.map((slug) => {
          const p = getPokemon(slug);
          if (!p) return null;
          const lit = slug === marked;
          const on = focus === slug;
          return (
            <li key={slug}>
              <button
                type="button"
                onClick={() => onTap(slug)}
                className={`flex w-full flex-col items-center rounded-2xl border px-1.5 py-2 text-center transition ${
                  on ? "border-ink/50 bg-white/10" : lit ? "border-white/25 bg-raised/70" : "border-line bg-raised/40"
                }`}
                style={cssVars(p.palette)}
              >
                <PokemonArt slug={p.slug} src={p.artwork} name={p.name} size={56} />
                <span className="mt-1 block truncate text-xs font-medium">{p.name}</span>
                {lit ? (
                  <span className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">
                    {pin === "lead" ? "Lead" : pin}
                  </span>
                ) : null}
                <span className="mt-1 flex flex-wrap justify-center gap-0.5">
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
