"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Books, Crosshair, Notebook, SquaresFour, UsersThree } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import {
  ReferenceLocalBar,
  ReferenceNavMenu,
  TeamLocalBar,
  TeamNavMenu,
} from "@/components/chrome/TeamNavMenu";
import { navLinkOn } from "@/components/chrome/NavDropdown";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";

/** Primary mobile destinations — brand lives in the top bar, so Live replaces Home. */
const MOBILE = [
  { href: "/learn", label: "Learn", icon: Books },
  { href: "/pokedex", label: "Dex", icon: SquaresFour },
  { href: "/live", label: "Live", icon: Crosshair },
  { href: "/team", label: "Team", icon: UsersThree },
  { href: "/manuals", label: "Manuals", icon: Notebook },
];

function DesktopLink({ href, label, path }: { href: string; label: string; path: string }) {
  const on = navLinkOn(path, href);
  return (
    <Link href={href} className={on ? "text-ink" : "text-muted hover:text-ink"}>
      {label}
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Mobile: brand + theme top-right */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-md md:hidden">
        <div className="mx-auto flex h-12 max-w-[1680px] items-center justify-between px-4">
          <Link href="/" className="text-base font-semibold tracking-tight">
            Ringside
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Desktop: grouped nav */}
      <header className="sticky top-0 z-40 hidden border-b border-line/70 bg-bg/80 backdrop-blur-md md:block">
        <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between gap-4 px-6">
          <Link href="/" className="shrink-0 text-lg font-semibold tracking-tight">
            Ringside
          </Link>
          <div className="flex min-w-0 items-center gap-5">
            <nav className="flex items-center gap-5 text-sm lg:gap-6">
              <DesktopLink href="/learn" label="Learn" path={path} />
              <ReferenceNavMenu path={path} />
              <TeamNavMenu path={path} />
              <DesktopLink href="/live" label="Live" path={path} />
              <DesktopLink href="/meta" label="Meta" path={path} />
              <DesktopLink href="/manuals" label="Manuals" path={path} />
            </nav>
            <ThemeToggle className="shrink-0" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1680px] flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-16 md:pt-10">
        <TeamLocalBar />
        <ReferenceLocalBar />
        {children}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line/70 bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-5">
          {MOBILE.map((l) => {
            const on =
              l.href === "/pokedex"
                ? navLinkOn(path, "/reference")
                : navLinkOn(path, l.href);
            const Icon = l.icon;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] ${on ? "text-ink" : "text-muted"}`}
                >
                  <Icon size={22} weight={on ? "fill" : "regular"} />
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
