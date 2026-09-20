"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { Popover } from "@/components/ui/Popover";

export function navLinkOn(path: string, href: string) {
  if (href === "/") return path === "/";
  if (href === "/meta") return path.startsWith("/meta") || path.startsWith("/usage");
  if (href === "/reference") {
    return (
      path.startsWith("/pokedex") ||
      path.startsWith("/moves") ||
      path.startsWith("/types") ||
      path.startsWith("/compare") ||
      path.startsWith("/pokemon")
    );
  }
  return path.startsWith(href);
}

export function NavMenuLink({
  href,
  on,
  onNavigate,
  children,
  hint,
}: {
  href: string;
  on: boolean;
  onNavigate: () => void;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <Link
      role="menuitem"
      href={href}
      onClick={onNavigate}
      className={`block rounded-xl px-2.5 py-2 transition active:scale-[0.99] ${
        on ? "bg-overlay text-ink" : "text-muted hover:bg-overlay hover:text-ink"
      }`}
    >
      <span className="block text-sm">{children}</span>
      {hint ? <span className="mt-0.5 block text-[11px] text-muted">{hint}</span> : null}
    </Link>
  );
}

export function NavDropdown({
  label,
  active,
  widthClassName = "w-56",
  children,
}: {
  label: string;
  active: boolean;
  widthClassName?: string;
  children: (opts: { close: () => void }) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        align="center"
        role="menu"
        widthClassName={widthClassName}
        panelClassName="border-line/80 bg-bg/95 p-2 backdrop-blur-md"
        trigger={({ open: isOpen, toggle, triggerProps }) => (
          <button
            type="button"
            {...triggerProps}
            onClick={toggle}
            className={`inline-flex items-center gap-1 transition ${
              active ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {label}
            <CaretDown
              size={12}
              weight="bold"
              className={`transition-transform duration-200 ease-out ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        )}
      >
        {children({ close })}
      </Popover>
    </div>
  );
}
