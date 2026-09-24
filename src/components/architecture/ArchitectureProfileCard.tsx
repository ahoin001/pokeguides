import { getArchitectureProfile, architectureMetricDefs } from "@/lib/architecture/load";
import {
  archetypeLabel,
  computeTeamContext,
} from "@/lib/architecture/team-context";
import type {
  ArchitectureMetricId,
  ArchitectureProfile,
  TeamContextOverlay,
} from "@/lib/architecture/types";

const METRIC_ORDER: ArchitectureMetricId[] = [
  "createFanOut",
  "convertFanOut",
  "engineConverterContinuity",
  "bridgeQuality",
  "engineParticipation",
  "mag",
  "moduleElasticity",
  "engineExclusivityTax",
];

const SHORT_LABEL: Partial<Record<ArchitectureMetricId, string>> = {
  createFanOut: "Create",
  convertFanOut: "Convert",
  engineConverterContinuity: "Continuity",
  bridgeQuality: "Bridge",
  engineParticipation: "Engines",
  mag: "MAG",
  moduleElasticity: "Elasticity",
  engineExclusivityTax: "Tax",
};

function scoreTone(id: ArchitectureMetricId, value: number): string {
  const inverted = id === "engineExclusivityTax";
  const good = inverted ? value <= 1 : value >= 4;
  const mid = inverted ? value <= 3 : value >= 3;
  if (good) return "bg-emerald-400/80";
  if (mid) return "bg-amber-300/75";
  return inverted ? "bg-rose-400/80" : "bg-rose-400/55";
}

function defFor(id: ArchitectureMetricId) {
  return architectureMetricDefs.find((d) => d.id === id);
}

function vizMode(profile: ArchitectureProfile): "create-web" | "convert-dial" | "balanced" {
  const { createFanOut, convertFanOut } = profile.scores;
  if (
    profile.archetype === "conversion-monster" ||
    (convertFanOut >= 4 && convertFanOut > createFanOut)
  ) {
    return "convert-dial";
  }
  if (
    profile.archetype === "connector" ||
    profile.archetype === "bridge" ||
    (createFanOut >= 4 && createFanOut >= convertFanOut)
  ) {
    return "create-web";
  }
  return "balanced";
}

export function ArchitectureProfileCard({
  slug,
  partySlugs = [],
  compact = false,
}: {
  slug: string;
  /** Current six / manual roster for C-MAG / tax / saturation overlays. */
  partySlugs?: string[];
  compact?: boolean;
}) {
  const profile = getArchitectureProfile(slug);
  if (!profile) {
    return (
      <div className="rounded-2xl border border-dashed border-line/80 bg-raised/20 px-4 py-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Architecture
        </p>
        <p className="mt-2 text-sm text-muted">
          No Champions architecture profile for this species yet.
        </p>
      </div>
    );
  }

  const teamCtx =
    partySlugs.filter(Boolean).length >= 2
      ? computeTeamContext(slug, partySlugs)
      : null;
  const mode = vizMode(profile);

  return (
    <div
      className={`rounded-[24px] border border-line bg-raised/35 ${compact ? "p-3.5" : "p-4 md:p-5"}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Architecture
          </p>
          {!compact ? (
            <h3 className="mt-1 text-lg font-semibold tracking-tight">{profile.name}</h3>
          ) : null}
          <p className={`text-sm text-muted ${compact ? "mt-1" : "mt-1.5"}`}>
            {archetypeLabel(profile.archetype)}
            {profile.archetypeSecondary
              ? ` · ${archetypeLabel(profile.archetypeSecondary)}`
              : null}
          </p>
        </div>
        {teamCtx ? <TeamContextChips ctx={teamCtx} baseline={profile} /> : null}
      </header>

      <div
        className={`mt-4 grid gap-4 ${compact ? "" : "lg:grid-cols-[minmax(0,1fr)_minmax(11rem,14rem)]"}`}
      >
        <ScoreBands profile={profile} teamCtx={teamCtx} compact={compact} />
        {!compact ? <ArchitectureViz profile={profile} mode={mode} /> : null}
      </div>

      {!compact ? (
        <>
          <CreateConvertLists profile={profile} />
          {profile.engines?.length ? (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {profile.engines.slice(0, 6).map((e) => (
                <li
                  key={e}
                  className="rounded-full border border-line/70 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted"
                >
                  {e}
                </li>
              ))}
            </ul>
          ) : null}
          {profile.whyUnderOrOverRated ? (
            <p className="mt-3 text-sm text-muted">{profile.whyUnderOrOverRated}</p>
          ) : null}
          {teamCtx?.notes.length ? (
            <ul className="mt-3 space-y-1 text-xs text-muted">
              {teamCtx.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ) : null}
          {profile.antiPatterns?.length ? (
            <p className="mt-3 text-xs text-rose-300/90">
              Avoid: {profile.antiPatterns[0]}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function TeamContextChips({
  ctx,
  baseline,
}: {
  ctx: TeamContextOverlay;
  baseline: ArchitectureProfile;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <span
        className="rounded-full border border-line bg-bg/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink"
        title="Conditional MAG given the current six"
      >
        C-MAG {ctx.cMag}
        {ctx.cMag !== baseline.scores.mag ? (
          <span className="text-muted"> · base {baseline.scores.mag}</span>
        ) : null}
      </span>
      <span
        className="rounded-full border border-line bg-bg/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink"
        title="Exclusivity tax given the current six (higher = worse)"
      >
        Tax {ctx.exclusivityTax}
        {ctx.exclusivityTax !== baseline.scores.engineExclusivityTax ? (
          <span className="text-muted">
            {" "}
            · base {baseline.scores.engineExclusivityTax}
          </span>
        ) : null}
      </span>
      {ctx.saturated ? (
        <span className="rounded-full border border-rose-400/40 bg-rose-400/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-rose-200">
          Saturated
        </span>
      ) : null}
    </div>
  );
}

function ScoreBands({
  profile,
  teamCtx,
  compact,
}: {
  profile: ArchitectureProfile;
  teamCtx: TeamContextOverlay | null;
  compact: boolean;
}) {
  const ids = compact
    ? (["createFanOut", "convertFanOut", "engineConverterContinuity", "engineExclusivityTax", "mag"] as ArchitectureMetricId[])
    : METRIC_ORDER;

  return (
    <ul className="space-y-2">
      {ids.map((id) => {
        const def = defFor(id);
        let value = profile.scores[id];
        if (teamCtx && id === "mag") value = teamCtx.cMag;
        if (teamCtx && id === "engineExclusivityTax") value = teamCtx.exclusivityTax;
        const label = SHORT_LABEL[id] ?? def?.label ?? id;
        return (
          <li key={id} title={def?.meaning}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                {label}
                {id === "engineExclusivityTax" ? " ↑worse" : null}
              </span>
              <span className="font-mono text-xs text-ink">{value}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < value ? scoreTone(id, value) : "bg-line/70"
                  }`}
                />
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ArchitectureViz({
  profile,
  mode,
}: {
  profile: ArchitectureProfile;
  mode: "create-web" | "convert-dial" | "balanced";
}) {
  if (mode === "convert-dial") {
    return <ConvertDial profile={profile} />;
  }
  if (mode === "create-web") {
    return <CreateWeb profile={profile} />;
  }
  return (
    <div className="flex flex-col justify-center gap-3 rounded-2xl border border-line/60 bg-bg/40 p-3">
      <CreateWeb profile={profile} mini />
      <ConvertDial profile={profile} mini />
    </div>
  );
}

function CreateWeb({ profile, mini = false }: { profile: ArchitectureProfile; mini?: boolean }) {
  const spokes = (profile.creates ?? [])
    .flatMap((c) =>
      (c.consumers ?? []).slice(0, 2).map((consumer) => ({
        resource: c.resource,
        consumer,
      })),
    )
    .slice(0, mini ? 4 : 6);

  if (!spokes.length) {
    return (
      <p className="text-xs text-muted">No create fan-out edges authored.</p>
    );
  }

  const size = mini ? 120 : 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = mini ? 42 : 58;

  return (
    <div className="rounded-2xl border border-line/60 bg-bg/40 p-2">
      <p className="mb-1 px-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
        Create web
      </p>
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto block w-full max-w-[11rem]" aria-hidden>
        {spokes.map((s, i) => {
          const angle = (Math.PI * 2 * i) / spokes.length - Math.PI / 2;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          return (
            <g key={`${s.resource}-${s.consumer}-${i}`}>
              <line
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="currentColor"
                className="text-ink/35"
                strokeWidth={1.25}
              />
              <circle cx={x} cy={y} r={3.5} className="fill-emerald-400/80" />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={mini ? 16 : 20} className="fill-ink/90" />
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-bg text-[8px] font-semibold uppercase"
        >
          Create
        </text>
      </svg>
      <ul className="mt-1 space-y-0.5 px-1">
        {spokes.slice(0, mini ? 2 : 4).map((s) => (
          <li key={`${s.resource}-${s.consumer}`} className="truncate text-[10px] text-muted">
            {s.resource} → {s.consumer}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConvertDial({ profile, mini = false }: { profile: ArchitectureProfile; mini?: boolean }) {
  const value = profile.scores.convertFanOut;
  const ecc = profile.scores.engineConverterContinuity;
  const size = mini ? 110 : 150;
  const stroke = mini ? 8 : 10;
  const r = (size - stroke) / 2 - 4;
  const c = 2 * Math.PI * r;
  const pct = value / 5;

  return (
    <div className="rounded-2xl border border-line/60 bg-bg/40 p-2">
      <p className="mb-1 px-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
        Convert dial
      </p>
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto block w-full max-w-[10rem]" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-line"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-sky-400/85"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          className="fill-ink text-[18px] font-semibold"
        >
          {value}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 12}
          textAnchor="middle"
          className="fill-muted text-[8px] uppercase"
        >
          ECC {ecc}
        </text>
      </svg>
      {(profile.converts ?? []).slice(0, mini ? 1 : 3).map((cEdge) => (
        <p key={`${cEdge.resource}-${cEdge.into}`} className="truncate px-1 text-[10px] text-muted">
          {cEdge.resource} → {cEdge.into}
        </p>
      ))}
    </div>
  );
}

function CreateConvertLists({ profile }: { profile: ArchitectureProfile }) {
  const creates = profile.creates ?? [];
  const converts = profile.converts ?? [];
  if (!creates.length && !converts.length) return null;
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {creates.length ? (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Creates</p>
          <ul className="mt-1.5 space-y-1 text-xs text-muted">
            {creates.slice(0, 4).map((c) => (
              <li key={c.resource}>
                <span className="text-ink">{c.resource}</span>
                {c.consumers?.length ? ` · ${c.consumers.slice(0, 3).join(", ")}` : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {converts.length ? (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Converts</p>
          <ul className="mt-1.5 space-y-1 text-xs text-muted">
            {converts.slice(0, 4).map((c) => (
              <li key={`${c.resource}-${c.into}`}>
                <span className="text-ink">{c.resource}</span> → {c.into}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
