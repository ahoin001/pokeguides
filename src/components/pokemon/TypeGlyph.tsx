import type { TypeId } from "@/types/pokemon";

/**
 * Official Pokémon Champions type marks (white glyphs).
 * Assets live in /public/types — same symbols used in Champions UI / OP.GG Champions.
 */
export function TypeGlyph({ type, className = "" }: { type: TypeId; className?: string }) {
  return (
    // Local SVG glyphs; next/image is unnecessary for tiny static marks.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/types/${type}.svg`}
      alt=""
      width={64}
      height={64}
      className={className}
      draggable={false}
      aria-hidden
    />
  );
}
