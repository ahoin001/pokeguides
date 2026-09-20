import Link from "next/link";
import { LEARN_ROLE_IDS, ROLE_LABEL, ROLES } from "@/content/roles";
import { LITERACY_ROLES } from "@/content/literacy-roles";
import { RoleCard } from "@/components/learn/RoleCard";
import { roleHref } from "@/content/roles";

export const metadata = {
  title: "Jobs",
  description: "What a Pokémon is for in Champions 3v3 — support, breaker, speed, weather, Mega.",
};

export default function RolesHub() {
  const shown = ROLES.filter((role) => LEARN_ROLE_IDS.includes(role.id));
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm text-muted">
        <Link href="/learn/jobs" className="hover:text-ink">
          Jobs
        </Link>
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">What a Pokémon is for</h1>
      <p className="mt-4 text-lg text-muted">
        In Champions 3v3, a Pokémon is a job. Stats tell the body. Ability and movepool tell the job. Nothing on the
        card says sweeper.
      </p>
      <p className="mt-4 text-[17px] leading-relaxed text-muted">
        High Speed plus Attack looks like a sweeper. Without a boosting move, priority, or a Scarf story it may just be
        a fast breaker. U-turn is what makes a pivot. Trick Room or Tailwind is what makes a Speed Controller. Read the
        body first, then check whether the kit can actually do the job.
      </p>

      <ol className="mt-10 space-y-3">
        {shown.map((role) => (
          <li key={role.id}>
            <RoleCard role={role} />
          </li>
        ))}
      </ol>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">How to tell what a Pokémon is</h2>
        <ol className="mt-6 space-y-5 text-[17px] leading-relaxed">
          <li>
            <p className="font-medium">Are Attack or Special Attack high, and is Speed high too?</p>
            <p className="mt-1 text-muted">Sweeper. In this format that is a breaker, a Speed racer, or a Mega.</p>
          </li>
          <li>
            <p className="font-medium">Are HP and the defenses the stats that jump off the page?</p>
            <p className="mt-1 text-muted">Wall. It takes a hit so you can switch to the Pokémon that wins.</p>
          </li>
          <li>
            <p className="font-medium">Low raw stats, weird utility, and enough Speed to go first?</p>
            <p className="mt-1 text-muted">Disruptor. Taunt, Thunder Wave, Will-O-Wisp. Damage is optional.</p>
          </li>
          <li>
            <p className="font-medium">Does the field change the moment it enters?</p>
            <p className="mt-1 text-muted">Setter. Rain, sun, Grassy Terrain, Trick Room.</p>
          </li>
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Names other sites use</h2>
        <p className="mt-3 text-muted">
          Guides still say sweeper and wallbreaker. Those map onto Champions jobs. The dex filter stays on jobs.
        </p>
        <ul className="mt-6 divide-y divide-line rounded-3xl border border-line">
          {LITERACY_ROLES.map((lit) => (
            <li key={lit.id} className="px-5 py-4">
              <p className="font-medium">{lit.name}</p>
              {lit.alsoCalled.length ? (
                <p className="mt-1 text-xs text-muted">Also called {lit.alsoCalled.join(", ")}</p>
              ) : null}
              <p className="mt-1 text-sm text-muted">{lit.oneLiner}</p>
              <p className="mt-2 text-xs text-muted">
                In Champions:{" "}
                {lit.mapsTo
                  .filter((id) => LEARN_ROLE_IDS.includes(id))
                  .map((id, i) => (
                    <span key={id}>
                      {i ? ", " : ""}
                      <Link href={roleHref(id)} className="underline">
                        {ROLE_LABEL[id]}
                      </Link>
                    </span>
                  ))}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <Link href="/learn/building" className="mt-12 block text-sm text-muted hover:text-ink">
        Next: How you build a three
      </Link>
    </article>
  );
}
