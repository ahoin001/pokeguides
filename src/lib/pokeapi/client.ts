const BASE = "https://pokeapi.co/api/v2";

export async function pokeGet<T>(path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`PokeAPI ${res.status} ${url}`);
  }
  return res.json() as Promise<T>;
}

export type PokePokemon = {
  id: number;
  name: string;
  types: { slot: number; type: { name: string } }[];
  abilities: { is_hidden: boolean; ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: { front_default: string | null };
    };
  };
  species: { name: string; url: string };
  moves: { move: { name: string } }[];
};

export type PokeSpecies = {
  id: number;
  name: string;
  color: { name: string };
  names: { name: string; language: { name: string } }[];
};

export function displayName(species: PokeSpecies, slug: string) {
  const en = species.names.find((n) => n.language.name === "en");
  if (en) {
    if (slug.includes("mega-z")) return `Mega ${en.name} Z`;
    if (slug.includes("-mega-y")) return `Mega ${en.name} Y`;
    if (slug.includes("-mega-x")) return `Mega ${en.name} X`;
    if (slug.endsWith("-mega")) return `Mega ${en.name}`;
    if (slug.endsWith("-alola")) return `Alolan ${en.name}`;
    if (slug.endsWith("-galar")) return `Galarian ${en.name}`;
    if (slug.endsWith("-hisui")) return `Hisuian ${en.name}`;
    if (slug.endsWith("-female")) return `${en.name} F`;
    if (slug.endsWith("-male")) return `${en.name} M`;
  }
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
