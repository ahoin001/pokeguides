import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Ringside",
  description: "Learn Pokémon Champions. Browse the legal roster. Build a three.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full">
        {/*
          THESIS: The Pokémon stays the object. Pages rearrange catalog entries; they do not dump a National Dex.
          OWN-WORLD: Cool stadium dark, official type tokens, each creature washes the surface from extracted art.
          STORY: Learn the format, open a legal mon, compare, put three on a field.
          FIRST VIEWPORT: Split home, regulation chip, Learn / Browse.
          FORM: Team preview under stadium lights.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
        */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
