import type { MoveCategory } from "@/lib/champions/damage";

const LABEL: Record<MoveCategory, string> = {
  physical: "Physical",
  special: "Special",
  status: "Status",
};

/**
 * Official Pokémon Champions move-category marks (Physical / Special / Status).
 * Assets in /public/categories — HOME/Champions symbols (refresh: `npx tsx scripts/fetch-category-icons.ts`).
 */
export function MoveCategoryIcon({
  category,
  className = "h-5 w-5 object-contain",
}: {
  category: MoveCategory;
  className?: string;
}) {
  return (
    // Local marks; next/image unnecessary for tiny static icons.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/categories/${category}.png`}
      alt=""
      width={64}
      height={48}
      className={className}
      draggable={false}
      aria-hidden
      title={LABEL[category]}
    />
  );
}

export function moveCategoryLabel(category: MoveCategory) {
  return LABEL[category];
}
