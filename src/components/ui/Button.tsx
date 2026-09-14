import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "line";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const look =
    variant === "primary"
      ? "bg-ink text-bg hover:bg-white"
      : variant === "line"
        ? "border border-line bg-transparent text-ink hover:border-ink/40"
        : "text-ink hover:bg-white/5";
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.98] disabled:opacity-40 ${look} ${className}`}
      {...props}
    />
  );
}
