export default function AboutPage() {
  return (
    <article className="max-w-2xl space-y-4 text-[17px] leading-relaxed">
      <h1 className="text-4xl font-semibold tracking-tight">About</h1>
      <p>
        Ringside is a personal fan companion for Pokémon Champions. It is not affiliated with Nintendo, Game Freak,
        or The Pokémon Company.
      </p>
      <p>
        Species data, sprites, and official artwork come from{" "}
        <a className="underline" href="https://pokeapi.co">
          PokéAPI
        </a>
        . Palettes are extracted at sync time from that artwork. Legal slugs are a local Regulation M-C overlay.
      </p>
      <p>The browser searches the local catalog. It does not query PokéAPI on each keystroke.</p>
    </article>
  );
}
