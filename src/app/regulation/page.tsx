import { regulation } from "@/lib/catalog/load";

export const metadata = {
  title: regulation.name,
  description: `${regulation.name} · ${regulation.starts} to ${regulation.ends}`,
};

export default function RegulationPage() {
  return (
    <article className="max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight">{regulation.name}</h1>
      <p className="mt-3 text-muted">
        {regulation.starts} to {regulation.ends}
      </p>
      <div className="mt-8 space-y-4 text-[17px] leading-relaxed">
        <p>{regulation.notes}</p>
        <p>{regulation.slugs.length} Pokémon in this local catalog after sync.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Singles. 3v3. Open team lists.</li>
          <li>Level 50. Perfect IVs. 66 Stat Points, max 32 per stat.</li>
          <li>One Mega Evolution per battle via the Omni Ring.</li>
          <li>Species clause and item clause.</li>
        </ul>
      </div>
    </article>
  );
}
