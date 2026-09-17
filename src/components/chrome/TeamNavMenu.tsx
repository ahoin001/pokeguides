"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { ARCHETYPES, ARCHETYPE_LABEL, archetypeHref } from "@/content/archetypes";
import type { ArchetypeId } from "@/types/pokemon";
import { Popover } from "@/components/ui/Popover";

function linkOn(path: string, href: string) {
  if (href === "/") return path === "/";
  if (href === "/meta") return path.startsWith("/meta") || path.startsWith("/usage");
  return path.startsWith(href);
}

export function TeamNavMenu({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const on = linkOn(path, "/team");

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Popover
        open={open}
        onOpenChange={setOpen}
        align="center"
        role="menu"
        widthClassName="w-56"
        panelClassName="border-line/80 bg-bg/95 p-2 backdrop-blur-md"
        trigger={({ open: isOpen, toggle, triggerProps }) => (
          <button
            type="button"
            {...triggerProps}
            onClick={toggle}
            className={`inline-flex items-center gap-1 transition ${
              on ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            Team
            <CaretDown
              size={12}
              weight="bold"
              className={`transition-transform duration-200 ease-out ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        )}
      >
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
      </Popover>
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
      className={`block rounded-xl px-2.5 py-2 text-sm transition active:scale-[0.99] ${
        on ? "bg-overlay text-ink" : "text-muted hover:bg-overlay hover:text-ink"
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
