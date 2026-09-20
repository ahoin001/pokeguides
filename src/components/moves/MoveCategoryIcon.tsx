import type { MoveCategory } from "@/lib/champions/damage";

const LABEL: Record<MoveCategory, string> = {
  physical: "Physical",
  special: "Special",
  status: "Status",
};

/**
 * Compact category mark for battle move chrome.
 * Physical = burst, Special = rings, Status = status bar.
 */
export function MoveCategoryIcon({
  category,
  className = "h-5 w-5",
}: {
  category: MoveCategory;
  className?: string;
}) {
  const title = LABEL[category];
  if (category === "physical") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
        <title>{title}</title>
        <path d="M12 2.5 14.8 9l6.7.6-5.1 4.5 1.6 6.5L12 17.2 6 20.6l1.6-6.5L2.5 9.6 9.2 9 12 2.5Z" />
      </svg>
    );
  }
  if (category === "special") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <title>{title}</title>
        <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="6.5" />
        <circle cx="12" cy="12" r="10" opacity="0.55" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <title>{title}</title>
      <rect x="3" y="10" width="18" height="4" rx="2" />
      <circle cx="7" cy="12" r="1.4" fill="var(--battle-panel)" />
      <circle cx="12" cy="12" r="1.4" fill="var(--battle-panel)" />
      <circle cx="17" cy="12" r="1.4" fill="var(--battle-panel)" />
    </svg>
  );
}

export function moveCategoryLabel(category: MoveCategory) {
  return LABEL[category];
}
