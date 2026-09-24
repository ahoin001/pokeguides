"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

type Props = {
  slug: string;
  src: string;
  name: string;
  share?: boolean;
  size?: number;
  className?: string;
};

/** Discrete widths so any future re-enable of optimization stays cheap. */
const SIZE_BUCKETS = [32, 48, 64, 96, 128, 256] as const;

function bucketSize(size: number): number {
  for (const b of SIZE_BUCKETS) {
    if (size <= b) return b;
  }
  return SIZE_BUCKETS[SIZE_BUCKETS.length - 1];
}

export function PokemonArt({ slug, src, name, share, size = 220, className = "" }: Props) {
  const reduce = useReducedMotion();
  const displaySize = size;
  const optSize = bucketSize(size);

  return (
    <motion.div
      layoutId={reduce || !share ? undefined : `mon-${slug}`}
      className={`relative ${className}`}
      style={{ width: displaySize, height: displaySize, maxWidth: "100%" }}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes={`${optSize}px`}
          className="object-contain"
          priority={displaySize > 200}
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 rounded-full bg-white/5" />
      )}
    </motion.div>
  );
}
