import { getPokemon } from "@/lib/catalog/load";
import type { CatalogEntry } from "@/types/pokemon";
import {
  emptySlot,
  flexPool,
  resolveActiveBox,
  type TeamManual,
} from "@/content/manuals";

export function legalSlug(slug: string) {
  return Boolean(slug && getPokemon(slug));
}

export function hydrateManual(manual: TeamManual) {
  const mons = manual.slugs.map((slug) => (slug ? getPokemon(slug) : undefined));
  return { manual, mons: mons.filter((p): p is CatalogEntry => Boolean(p)) };
}

function padSix<T>(items: T[], fill: () => T): T[] {
  const out = [...items];
  while (out.length < 6) out.push(fill());
  return out.slice(0, 6);
}

export function syncSlugsFromSlots(manual: TeamManual): TeamManual {
  if (manual.packs?.length) {
    const rosterSrc = manual.roster?.length ? manual.roster : manual.slots;
    const bySlug = new Map(rosterSrc.filter((s) => s.slug).map((s) => [s.slug, s]));
    const boxRaw = (manual.box?.length ? [...manual.box] : rosterSrc.map((s) => s.slug))
      .map((s) => s || "")
      .slice(0, 6);
    while (boxRaw.length < 6) boxRaw.push("");
    const six = boxRaw as [string, string, string, string, string, string];

    const roster = padSix(
      six.map((slug, i) => {
        if (slug && bySlug.has(slug)) return bySlug.get(slug)!;
        const prior = rosterSrc[i];
        if (prior && (!prior.slug || prior.slug === slug)) return { ...prior, slug };
        return { ...emptySlot(), slug };
      }),
      () => emptySlot(),
    );

    const packs = manual.packs.map((p) => {
      const bring: [string, string, string] = [
        p.slugs[0] ?? "",
        p.slugs[1] ?? "",
        p.slugs[2] ?? "",
      ];
      return {
        ...p,
        slugs: bring,
        strategy: p.strategy ? { ...p.strategy, bring } : p.strategy,
      };
    });

    const core: [string, string, string] = manual.core ??
      packs[0]?.slugs ?? [six[0], six[1], six[2]];
    const active = packs[0]?.slugs ?? core;
    const slots = active.map((slug) => {
      const hit = roster.find((r) => r.slug === slug);
      return hit ?? { ...emptySlot(), slug };
    });

    return {
      ...manual,
      box: six,
      roster,
      packs,
      core,
      slugs: active,
      slots,
    };
  }

  const slugs = manual.slots.map((s) => s.slug).filter(Boolean);
  const three: [string, string, string] = [slugs[0] ?? "", slugs[1] ?? "", slugs[2] ?? ""];
  return { ...manual, slugs: three };
}

export function validateManual(manual: TeamManual) {
  const errors: string[] = [];
  if (!manual.title.trim()) errors.push("Name the manual.");

  if (manual.packs?.length) {
    const box = (manual.box ?? []).filter(Boolean);
    const alts = flexPool(manual);
    const altSlugs = new Set(alts.map((a) => a.slug));
    if (box.length < 3) errors.push("Register at least three Pokémon on the six.");
    if (new Set(box).size !== box.length) errors.push("Species clause on the six. No duplicates.");
    for (const slug of box) {
      if (!legalSlug(slug)) errors.push(`${slug} is not legal in this regulation.`);
    }
    for (const alt of alts) {
      if (!legalSlug(alt.slug)) errors.push(`Flex ${alt.slug} is not legal in this regulation.`);
      if (box.includes(alt.slug)) {
        errors.push(`Flex ${alt.slug} is already on the registered six — drop it from the flex pool.`);
      }
      if (alt.insteadOf && box.length && !box.includes(alt.insteadOf)) {
        errors.push(`Flex ${alt.slug}: insteadOf ${alt.insteadOf} is not on the six.`);
      }
      if (!alt.why.trim()) errors.push(`Flex ${alt.slug}: say why the swap exists.`);
    }
    for (const pack of manual.packs) {
      const bring = pack.slugs.filter(Boolean);
      if (bring.length !== 3) {
        errors.push(`Package “${pack.label || pack.id}” needs three Pokémon.`);
        continue;
      }
      if (new Set(bring).size !== bring.length) {
        errors.push(`Package “${pack.label || pack.id}” has duplicate species.`);
      }
      const swap = pack.requiresSwap;
      if (swap?.out || swap?.in) {
        if (!swap.out || !swap.in) {
          errors.push(`Package “${pack.label || pack.id}”: swap needs both out and in.`);
        } else {
          if (box.length && !box.includes(swap.out)) {
            errors.push(`Package “${pack.label || pack.id}”: swap out ${swap.out} is not on the six.`);
          }
          if (!altSlugs.has(swap.in)) {
            errors.push(
              `Package “${pack.label || pack.id}”: swap in ${swap.in} is not in the flex pool.`,
            );
          }
        }
      }
      const active = resolveActiveBox(manual, pack.id);
      if (active.length && new Set(active).size !== active.length) {
        errors.push(
          `Package “${pack.label || pack.id}”: swap breaks species clause on the active six.`,
        );
      }
      for (const slug of bring) {
        if (active.length && !active.includes(slug)) {
          errors.push(
            `Package “${pack.label || pack.id}”: ${slug} is not on the active six` +
              (swap?.in ? ` (after ${swap.out} → ${swap.in}).` : "."),
          );
        }
      }
      if (!pack.label.trim()) errors.push(`Give package ${pack.id} a label.`);
    }
    return errors;
  }

  const slugs = manual.slots.map((s) => s.slug).filter(Boolean);
  if (slugs.length !== 3) errors.push("Pick three Pokémon.");
  if (new Set(slugs).size !== slugs.length) errors.push("Species clause. No duplicates.");
  for (const slug of slugs) {
    if (!legalSlug(slug)) errors.push(`${slug} is not legal in this regulation.`);
  }
  return errors;
}
