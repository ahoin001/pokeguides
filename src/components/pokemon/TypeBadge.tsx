import { TYPE_LABEL } from "@/lib/champions/types";
import type { TypeId } from "@/types/pokemon";
import { TypeGlyph } from "./TypeGlyph";

const INK_DARK: TypeId[] = ["electric", "ice", "ground", "normal", "bug", "steel", "fairy"];

export function TypeBadge({
  type,
  size = "md",
}: {
  type: TypeId;
  size?: "sm" | "md";
}) {
  const ink = INK_DARK.includes(type) ? "text-[#1a1a1a]" : "text-white";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold tracking-tight ${ink} ${
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
      }`}
      style={{
        background: `var(--type-${type})`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)",
      }}
    >
      <TypeGlyph
        type={type}
        className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"}
      />
      {TYPE_LABEL[type]}
    </span>
  );
}
