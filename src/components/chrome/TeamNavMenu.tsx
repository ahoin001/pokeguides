"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ARCHETYPES, ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import type { ArchetypeId } from "@/types/pokemon";
import { NavDropdown, NavMenuLink, navLinkOn } from "@/components/chrome/NavDropdown";

export function TeamNavMenu({ path }: { path: string }) {
  return (
    <NavDropdown label="Team" active={navLinkOn(path, "/team")} widthClassName="w-56">
      {({ close }) => (
        <>
          <NavMenuLink href="/team" on={path === "/team"} onNavigate={close}>
            Team builder
          </NavMenuLink>
          <NavMenuLink href="/team/box" on={path === "/team/box"} onNavigate={close}>
            My box
          </NavMenuLink>
          <p className="mt-2 px-2.5 pb-1 pt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Team archetypes
          </p>
          <NavMenuLink
            href="/team/archetypes"
            on={path === "/team/archetypes"}
            onNavigate={close}
          >
            All archetypes
          </NavMenuLink>
          {ARCHETYPES.map((a) => (
            <NavMenuLink
              key={a.id}
              href={archetypeHref(a.id)}
              on={path === archetypeHref(a.id)}
              onNavigate={close}
            >
              {ARCHETYPE_LABEL[a.id as ArchetypeId]}
            </NavMenuLink>
          ))}
        </>
      )}
    </NavDropdown>
  );
}

export function ReferenceNavMenu({ path }: { path: string }) {
  return (
    <NavDropdown
      label="Reference"
      active={navLinkOn(path, "/reference")}
      widthClassName="w-64"
    >
      {({ close }) => (
        <>
          <NavMenuLink
            href="/pokedex"
            on={path.startsWith("/pokedex") || path.startsWith("/pokemon")}
            onNavigate={close}
            hint="Legal roster"
          >
            Dex
          </NavMenuLink>
          <NavMenuLink
            href="/moves"
            on={path.startsWith("/moves")}
            onNavigate={close}
            hint="Moves and abilities"
          >
            Moves
          </NavMenuLink>
          <NavMenuLink
            href="/types"
            on={path.startsWith("/types")}
            onNavigate={close}
            hint="Type chart playground"
          >
            Types
          </NavMenuLink>
          <NavMenuLink
            href="/compare"
            on={path.startsWith("/compare")}
            onNavigate={close}
            hint="Coverage checker"
          >
            Coverage
          </NavMenuLink>
        </>
      )}
    </NavDropdown>
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
        className={`rounded-full px-3.5 py-1.5 text-sm transition active:scale-[0.98] ${
          builder ? "bg-ink text-bg" : "bg-overlay text-muted hover:text-ink"
        }`}
      >
        Builder
      </Link>
      <Link
        href="/team/box"
        className={`rounded-full px-3.5 py-1.5 text-sm transition active:scale-[0.98] ${
          box ? "bg-ink text-bg" : "bg-overlay text-muted hover:text-ink"
        }`}
      >
        My box
      </Link>
      <Link
        href="/team/archetypes"
        className={`rounded-full px-3.5 py-1.5 text-sm transition active:scale-[0.98] ${
          archetypes ? "bg-ink text-bg" : "bg-overlay text-muted hover:text-ink"
        }`}
      >
        Archetypes
      </Link>
    </nav>
  );
}

export function ReferenceLocalBar() {
  const path = usePathname();
  const onReference =
    path.startsWith("/pokedex") ||
    path.startsWith("/moves") ||
    path.startsWith("/types") ||
    path.startsWith("/compare") ||
    path.startsWith("/pokemon");
  if (!onReference) return null;

  const tabs = [
    { href: "/pokedex", label: "Dex", on: path.startsWith("/pokedex") || path.startsWith("/pokemon") },
    { href: "/moves", label: "Moves", on: path.startsWith("/moves") },
    { href: "/types", label: "Types", on: path.startsWith("/types") },
    { href: "/compare", label: "Coverage", on: path.startsWith("/compare") },
  ] as const;

  return (
    <nav aria-label="Reference section" className="mb-6 flex flex-wrap gap-2 md:hidden">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`rounded-full px-3.5 py-1.5 text-sm transition active:scale-[0.98] ${
            t.on ? "bg-ink text-bg" : "bg-overlay text-muted hover:text-ink"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
