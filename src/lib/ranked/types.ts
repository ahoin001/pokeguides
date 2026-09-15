import type { Palette } from "@/types/pokemon";

export type RankedShare = {
  name: string;
  pct?: number;
};

export type RankedSpread = {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
  pct?: number;
};

export type RankedSinglesEntry = {
  rank: number;
  showdownId: string;
  name: string;
  slug?: string;
  types: string[];
  ability?: RankedShare;
  nature?: RankedShare;
  spread?: RankedSpread;
  item?: RankedShare;
  items: RankedShare[];
  moves: RankedShare[];
  teammates: string[];
};

export type RankedSinglesSnapshot = {
  fetchedAt: string;
  generatedAt: string;
  asOf: string;
  season: string;
  regulation: string;
  format: "singles";
  source: string;
  sourceUrl: string;
  note: string;
  count: number;
  pokemon: RankedSinglesEntry[];
};

export type RankedRow = RankedSinglesEntry & {
  artwork?: string;
  sprite?: string;
  palette?: Palette;
};
