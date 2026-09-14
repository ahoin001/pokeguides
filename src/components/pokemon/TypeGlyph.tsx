import type { ReactNode } from "react";
import type { TypeId } from "@/types/pokemon";

/** Official-style type marks. White on a type-colored disc. */
export function TypeGlyph({ type, className = "" }: { type: TypeId; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {GLYPHS[type]}
    </svg>
  );
}

const GLYPHS: Record<TypeId, ReactNode> = {
  normal: (
    <circle cx="12" cy="12" r="6.4" fill="none" stroke="currentColor" strokeWidth="3.2" />
  ),
  fire: (
    <path
      fill="currentColor"
      d="M13.2 1.7c.3 3.4 4.2 5.4 5 9.6.7 3.6-1 7.2-4.8 8.4-4 1.2-7.8-1.2-8.6-5.2-.6-3 1-5.6 3-7-.6 2.4.4 4.2 2.2 4.8C9.2 7.2 10.6 3.8 13.2 1.7Z"
    />
  ),
  water: (
    <path
      fill="currentColor"
      d="M12 2.8c4.2 4.8 7 8.2 7 11.4A7 7 0 1 1 5 14.2C5 11 7.8 7.6 12 2.8Z"
    />
  ),
  electric: (
    <path fill="currentColor" d="M13.9 1.8 5.8 13.4h5.1l-1.5 8.8 9.6-13.2h-5.2L15.4 1.8Z" />
  ),
  grass: (
    <g fill="currentColor">
      <path d="M5.2 18.2 13.4 3.2c2 .8 3.2 2.2 3.4 4L8.8 19.6c-1.4-.2-2.6-1-3.6-1.4Z" />
      <path d="M10 18.6 18.4 3.4c1.8.8 3 2.2 3.2 4L13.6 20c-1.4-.2-2.6-1-3.6-1.4Z" />
    </g>
  ),
  ice: (
    <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M4.4 7.2l15.2 9.6M4.4 16.8 19.6 7.2" />
      <path d="M12 5.4 10.2 3.8M12 5.4l1.8-1.6M12 18.6l-1.8 1.6M12 18.6l1.8 1.6M6.2 8.2 4.2 7.4M6.2 8.2l-.2 2.2M17.8 15.8l2 .8M17.8 15.8l.2-2.2M6.2 15.8l-2 .8M6.2 15.8l-.2-2.2M17.8 8.2l2-.8M17.8 8.2l.2 2.2" />
    </g>
  ),
  fighting: (
    <path
      fill="currentColor"
      d="M9 4.8c.8 0 1.4.6 1.4 1.4v2.6h.2V5.4c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4v3.4h.2V5.8c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4v4.2h.2V6.6c0-.8.6-1.4 1.5-1.4.8 0 1.4.6 1.4 1.4v6.2c0 3.2-2.4 5.6-6.2 5.6-3.2 0-5.6-1.8-6.4-4.6C6 11.4 6.6 9 8.2 7.6V6.2c0-.8.6-1.4 1.4-1.4Z"
    />
  ),
  poison: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12 2.6a7.4 7.4 0 0 1 7.4 7.4c0 2.5-1.2 4-2.3 5.2v2.4c0 1-.9 1.6-1.8 1.4L12 18.4l-3.3.6c-.9.2-1.8-.4-1.8-1.4v-2.4C5.8 14 4.6 12.5 4.6 10A7.4 7.4 0 0 1 12 2.6ZM9 8.8a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Zm6 0a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Z"
    />
  ),
  ground: (
    <path fill="currentColor" d="M3.6 18.2 8.2 7.6h7.6l4.6 10.6H3.6Z" />
  ),
  flying: (
    <path
      fill="currentColor"
      d="M3.4 16.2c6.4-2.2 10.2-8.4 11-14.4 5.2 3.8 7.6 9.8 5 14.8-4.6-1.4-7.2-.4-9.2 2.6 1.2 1.6 1.2 3.4.2 5.2-3.6-2.2-5.8-4.8-7-8.2Z"
    />
  ),
  psychic: (
    <g fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
      <path d="M18.6 12.2a6.4 6.4 0 1 1-2.1-4.6 4.3 4.3 0 1 0-2.2 7.1 2.2 2.2 0 1 1-1.7-2.1" />
    </g>
  ),
  bug: (
    <path fill="currentColor" d="M12 2.8 19.6 7.2v9.6L12 21.2 4.4 16.8V7.2L12 2.8Z" />
  ),
  rock: (
    <path fill="currentColor" d="M8.2 4.6h6.2L20 9.4l-2.2 9.8H6.4L3.8 10.2 8.2 4.6Z" />
  ),
  ghost: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12 2.8c4.2 0 7.2 3.1 7.2 7.2v10.2c0 .7-.8 1.1-1.4.6L16 19.2l-2 1.8-2-1.6-2 1.6-2-1.8-1.8 1.6c-.6.5-1.4.1-1.4-.6V10c0-4.1 3-7.2 7.2-7.2ZM9.2 8.8a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9Zm5.6 0a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9Z"
    />
  ),
  dragon: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M4 14.6 7.6 6.2l3.2 2.2L13.2 2.8l2.6 4.8 3.2-3.4.8 5.2 3.8 2.2-2.4 2.6 1.6 2.2-5.4 2-4.8 2.6-4.2-2.2Zm5.6-3.4a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z"
    />
  ),
  dark: (
    <path fill="currentColor" d="M14.2 3.2a8.6 8.6 0 1 0 6.4 14.2A8.8 8.8 0 0 1 14.2 3.2Z" />
  ),
  steel: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12 2.6 20.2 7.4v9.2L12 21.4 3.8 16.6V7.4L12 2.6Zm0 4.2L7.6 9.2v5.6L12 17.2l4.4-2.4V9.2L12 6.8Z"
    />
  ),
  fairy: (
    <g fill="currentColor">
      <path d="M12 11.2C8.2 4.6 3.8 6.4 6.6 11.6c1.6.6 3.4.4 5.4-.4 1.8.8 3.8 1 5.4.4 2.8-5.2-1.6-7-5.4-.4Z" />
      <path d="M12 12.2c-3.2.4-6.2 2.8-4.8 6 2-1.4 3.6-3.4 4.8-6 1.2 2.6 2.8 4.6 4.8 6 1.4-3.2-1.6-5.6-4.8-6Z" />
      <ellipse cx="12" cy="12.2" rx="0.85" ry="3.1" />
    </g>
  ),
};
