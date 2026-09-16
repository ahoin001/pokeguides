import type { LessonBand } from "@/content/curriculum";

const SRC: Record<LessonBand, string> = {
  "poke-ball": "/balls/poke-ball.svg",
  "great-ball": "/balls/great-ball.svg",
  "ultra-ball": "/balls/ultra-ball.svg",
  "master-ball": "/balls/master-ball.svg",
};

const LABEL: Record<LessonBand, string> = {
  "poke-ball": "Poké Ball",
  "great-ball": "Great Ball",
  "ultra-ball": "Ultra Ball",
  "master-ball": "Master Ball",
};

export function ballSrc(band: LessonBand) {
  return SRC[band];
}

export function ballLabel(band: LessonBand) {
  return LABEL[band];
}

export function BallIcon({
  band,
  size = 28,
  className = "",
  decorative = true,
}: {
  band: LessonBand;
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static public SVG icons
    <img
      src={SRC[band]}
      alt={decorative ? "" : LABEL[band]}
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
      draggable={false}
    />
  );
}
