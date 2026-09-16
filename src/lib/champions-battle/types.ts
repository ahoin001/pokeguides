/** Champions Battle Data API shapes — https://championsbattledata.com/api_guide */

export type ChampionsFormat = "Singles" | "Doubles";

export type BattleRow = {
  pokemon?: string;
  column_position?: number;
  category: string;
  rank: number;
  name: string;
  percentage?: string;
  percentage_value?: number | null;
  stat_up?: string;
  stat_down?: string;
  hp_points?: number | string;
  attack_points?: number | string;
  defense_points?: number | string;
  sp_atk_points?: number | string;
  sp_def_points?: number | string;
  speed_points?: number | string;
};

export type BattleResponse = {
  pokemon: string;
  showdownId: string;
  format: ChampionsFormat | string;
  season: string;
  date?: string | null;
  source: string;
  archived?: boolean;
  rows: BattleRow[];
};

export type DailyBattleSlice = {
  season: string;
  date: string;
  source: string;
  archived?: boolean;
  rows: BattleRow[];
};

export type DailyBattleResponse = {
  pokemon: string;
  showdownId: string;
  format: ChampionsFormat | string;
  requestedDays: number;
  season?: string;
  daily: DailyBattleSlice[];
};

export type IndexPokemon = {
  name: string;
  showdownId: string;
  slug?: string;
  summary?: {
    types?: string[];
    baseStats?: Record<string, number>;
    battleSummary?: {
      Current?: {
        Singles?: {
          top?: {
            move?: { name?: string; percentage_value?: number | null; column_position?: number };
            held_item?: { name?: string; percentage_value?: number | null };
            ability?: { name?: string; percentage_value?: number | null };
            teammate?: { name?: string; percentage_value?: number | null };
          };
        };
        Doubles?: {
          top?: {
            move?: { name?: string; percentage_value?: number | null; column_position?: number };
            held_item?: { name?: string; percentage_value?: number | null };
          };
        };
      };
    };
  };
};

export type ChampionsIndex = {
  generatedAt?: string;
  defaultSeason?: string;
  dailyDataFolders?: string[];
  pokemon?: IndexPokemon[];
};

export type KitShare = {
  name: string;
  pct?: number;
};

export type KitSpread = {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
  pct?: number;
};

export type ParsedBattleKit = {
  moves: KitShare[];
  items: KitShare[];
  abilities: KitShare[];
  natures: KitShare[];
  spreads: KitSpread[];
  teammates: KitShare[];
};

export type DailyMovePoint = {
  date: string;
  season: string;
  move?: string;
  movePct?: number;
  item?: string;
  itemPct?: number;
};
