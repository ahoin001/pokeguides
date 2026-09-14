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

export function PokemonArt({ slug, src, name, share, size = 220, className = "" }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      layoutId={reduce || !share ? undefined : `mon-${slug}`}
      className={`relative ${className}`}
      style={{ width: size, height: size, maxWidth: "100%" }}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes={`${size}px`}
          className="object-contain"
          priority={size > 200}
        />
      ) : (
        <div className="absolute inset-0 rounded-full bg-white/5" />
      )}
    </motion.div>
  );
}
