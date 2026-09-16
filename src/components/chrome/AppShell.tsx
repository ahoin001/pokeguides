"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Books, House, SquaresFour, UsersThree, ChartLine } from "@phosphor-icons/react";
import type { ReactNode } from "react";

const LINKS = [
  { href: "/", label: "Home", icon: House },
  { href: "/learn", label: "Learn", icon: Books },
  { href: "/pokedex", label: "Dex", icon: SquaresFour },
  { href: "/team", label: "Team", icon: UsersThree },
  { href: "/usage", label: "Usage", icon: ChartLine },
];

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-40 hidden border-b border-line/70 bg-bg/80 backdrop-blur-md md:block">
        <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Ringside
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {LINKS.slice(1).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={path.startsWith(l.href) ? "text-ink" : "text-muted hover:text-ink"}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/meta" className={path.startsWith("/meta") ? "text-ink" : "text-muted hover:text-ink"}>
              Meta
            </Link>
            <Link href="/compare" className={path.startsWith("/compare") ? "text-ink" : "text-muted hover:text-ink"}>
              Compare
            </Link>
            <Link href="/manuals" className={path.startsWith("/manuals") ? "text-ink" : "text-muted hover:text-ink"}>
              Manuals
            </Link>
            <Link href="/types" className={path.startsWith("/types") ? "text-ink" : "text-muted hover:text-ink"}>
              Types
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1680px] flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-16 md:pt-10">
        {children}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line/70 bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-5">
          {LINKS.map((l) => {
            const on = l.href === "/" ? path === "/" : path.startsWith(l.href);
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
