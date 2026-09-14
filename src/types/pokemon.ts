export const TYPE_IDS = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

export type TypeId = (typeof TYPE_IDS)[number];

export const ROLE_IDS = [
  "support",
  "breaker",
  "speed",
  "weather",
  "mega",
] as const;

export type RoleId = (typeof ROLE_IDS)[number];

export const LITERACY_ROLE_IDS = [
  "sweeper",
  "wall",
  "disruptor",
  "wallbreaker",
  "pivot",
  "setter",
] as const;

export type LiteracyRoleId = (typeof LITERACY_ROLE_IDS)[number];

export const ARCHETYPE_IDS = [
  "balance",
  "hyper-offense",
  "trick-room",
  "rain",
  "sun",
  "grassy",
] as const;

export type ArchetypeId = (typeof ARCHETYPE_IDS)[number];

export const KIT_TAGS = [
  "pivot",
  "priority",
  "setup",
  "recovery",
  "status",
  "trick-room",
  "tailwind",
  "hazards",
] as const;
export type KitTag = (typeof KIT_TAGS)[number];

export type SpeciesColor =
  | "black"
  | "blue"
  | "brown"
  | "gray"
  | "green"
  | "pink"
  | "purple"
  | "red"
  | "white"
  | "yellow";

export type PokemonForm =
  | "base"
  | "mega"
  | "mega-z"
  | "alolan"
  | "galarian"
  | "hisuian"
  | "other";

export type Palette = {
  dominant: string;
  vibrant: string;
  muted: string;
  ink: string;
  wash: string;
  source: "artwork" | "species-fallback";
};

export type Stats = {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
  bst: number;
};

export type SampleSp = {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
};

export type CatalogEntry = {
  id: number;
  slug: string;
  name: string;
  dexNo: number;
  types: [TypeId] | [TypeId, TypeId];
  form: PokemonForm;
  isLegal: true;
  featured: boolean;
  role?: RoleId;
  usageRank?: number;
  stats: Stats;
  speedAt0: number;
  speedAt32: number;
  abilities: string[];
  kitTags: KitTag[];
  artwork: string;
  sprite: string;
  tokens: string;
  speciesColor: SpeciesColor;
  palette: Palette;
  source: "pokeapi" | "overlay";
};

export type Editorial = {
  slug: string;
  job: string;
  role: RoleId;
  partners: string[];
  checks: string[];
  checkedBy: string[];
  sampleSp: SampleSp;
  kit: string;
};

export type Regulation = {
  id: string;
  name: string;
  starts: string;
  ends: string;
  notes: string;
  slugs: string[];
};
