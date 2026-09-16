"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { ARCHETYPES, ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import type { ArchetypeId } from "@/types/pokemon";

function linkOn(path: string, href: string) {
  if (href === "/") return path === "/";
  if (href === "/meta") return path.startsWith("/meta") || path.startsWith("/usage");
  return path.startsWith(href);
}

export function TeamNavMenu({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const on = linkOn(path, "/team");

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      ref={root}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 ${on ? "text-ink" : "text-muted hover:text-ink"}`}
      >
        Team
        <CaretDown size={12} weight="bold" className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-2"
        >
          <div className="rounded-2xl border border-line/80 bg-bg/95 p-2 shadow-lg backdrop-blur-md">
            <MenuLink href="/team" on={path === "/team"} onNavigate={() => setOpen(false)}>
              Team builder
            </MenuLink>
            <MenuLink href="/team/box" on={path === "/team/box"} onNavigate={() => setOpen(false)}>
              My box
            </MenuLink>
            <p className="mt-2 px-2.5 pb-1 pt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Team archetypes
            </p>
            <MenuLink
              href="/team/archetypes"
              on={path === "/team/archetypes"}
              onNavigate={() => setOpen(false)}
            >
              All archetypes
            </MenuLink>
            {ARCHETYPES.map((a) => (
              <MenuLink
                key={a.id}
                href={archetypeHref(a.id)}
                on={path === archetypeHref(a.id)}
                onNavigate={() => setOpen(false)}
              >
                {ARCHETYPE_LABEL[a.id as ArchetypeId]}
              </MenuLink>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({
  href,
  on,
  onNavigate,
  children,
}: {
  href: string;
  on: boolean;
  onNavigate: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      role="menuitem"
      href={href}
      onClick={onNavigate}
      className={`block rounded-xl px-2.5 py-2 text-sm transition ${
        on ? "bg-white/10 text-ink" : "text-muted hover:bg-white/6 hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

export function TeamLocalBar() {
  const path = usePathname();
  if (!path.startsWith("/team")) return null;
  const builder = path === "/team";
  const box = path === "/team/box";
  const archetypes = path.startsWith("/team/archetypes");
  return (
    <nav aria-label="Team section" className="mb-6 flex flex-wrap gap-2 md:hidden">
      <Link
        href="/team"
        className={`rounded-full px-3.5 py-1.5 text-sm ${
          builder ? "bg-ink text-bg" : "bg-white/6 text-muted hover:text-ink"
        }`}
      >
        Builder
      </Link>
      <Link
        href="/team/box"
        className={`rounded-full px-3.5 py-1.5 text-sm ${
          box ? "bg-ink text-bg" : "bg-white/6 text-muted hover:text-ink"
        }`}
      >
        My box
      </Link>
      <Link
        href="/team/archetypes"
        className={`rounded-full px-3.5 py-1.5 text-sm ${
          archetypes ? "bg-ink text-bg" : "bg-white/6 text-muted hover:text-ink"
        }`}
      >
        Archetypes
      </Link>
    </nav>
  );
}
