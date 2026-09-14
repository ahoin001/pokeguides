import Link from "next/link";
import type { ChecklistItem } from "@/lib/champions/team-checklist";

export function TeamChecklist({ items }: { items: ChecklistItem[] }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">Before you lock it</h2>
      <ul className="mt-4 divide-y divide-line rounded-3xl border border-line">
        {items.map((item) => (
          <li key={item.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">
                  <span className={item.ok ? "text-ink" : "text-muted"}>{item.ok ? "Set" : "Open"}</span>
                  <span className="text-muted"> · </span>
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-muted">{item.detail}</p>
              </div>
              <Link href={item.href} className="shrink-0 text-sm underline">
                Read
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
