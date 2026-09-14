"use client";

import { useState } from "react";
import { hpAtLevel50, sampleSpTotal, statAtLevel50 } from "@/lib/champions/stats";
import type { SampleSp } from "@/types/pokemon";

const BASE = { hp: 80, atk: 100, def: 80, spa: 80, spd: 80, spe: 100 };
const KEYS = ["hp", "atk", "def", "spa", "spd", "spe"] as const;

export function StatAllocator() {
  const [sp, setSp] = useState<SampleSp>({ hp: 4, atk: 32, def: 0, spa: 0, spd: 0, spe: 30 });
  const used = sampleSpTotal(sp);

  return (
    <div className="rounded-3xl border border-line bg-raised/50 p-5">
      <p className="text-sm text-muted">Classroom breaker. 66 SP cap. Max 32.</p>
      <p className={`mt-2 font-mono text-sm ${used > 66 ? "text-red-400" : "text-muted"}`}>{used} / 66</p>
      <div className="mt-6 space-y-4">
        {KEYS.map((k) => {
          const value = k === "hp" ? hpAtLevel50(BASE[k], sp[k]) : statAtLevel50(BASE[k], sp[k]);
          return (
            <label key={k} className="block">
              <div className="mb-1 flex justify-between text-sm">
                <span className="uppercase">{k}</span>
                <span className="font-mono text-muted">
                  {sp[k]} SP · {value}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={32}
                value={sp[k]}
                onChange={(e) => setSp((s) => ({ ...s, [k]: Number(e.target.value) }))}
                className="w-full accent-[var(--mon-vibrant)]"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
