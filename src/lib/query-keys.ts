export const queryKeys = {
  catalog: ["catalog"] as const,
  pokemon: (slug: string, regulation: string) =>
    ["pokemon", slug, regulation] as const,
  editorial: (slug: string) => ["editorial", slug] as const,
};
