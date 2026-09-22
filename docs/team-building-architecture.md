# Pokémon Champions Team-Building Architecture Reference

Lab-derived framework for Ringside: how we evaluate sixes, packages, bench modules, and candidate Pokémon.

**Use this when:** writing or reviewing team manuals, scoring synergy, proposing roster adds, flex/bench swaps, or searching the catalog for interesting architectural fits (not just usage rank).

**Related:** [manual-authoring-prompt.md](./manual-authoring-prompt.md) (JSON schema + packages), [formats.md](./formats.md).

---

## 1. The Fundamental Shift

### Old question

> “What six Pokémon synergize well together?”

### New question

> **“What six Pokémon create the largest number of winning 3-Pokémon systems?”**

For doubles, because you bring 4 of 6:

> **“What six Pokémon create the largest number of coherent 4-Pokémon packages and winning 3-Pokémon interactions inside those packages?”**

This distinction is the foundation of the framework.

A great team isn't necessarily six Pokémon that all love each other.

It is six Pokémon that create a **network of possible game plans**.

---

## 2. Team = Strategy Generator

Treat a team as a:

> **Strategy Generator / Swiss Army Knife**

Instead of one linear game plan:

**Lead → execute combo → win**

we want:

**Preview → identify opponent structure → select package → create state → convert state → adapt → transition into a win condition**

The team should be able to change its *method of winning* without becoming incoherent.

---

## 3. The Core Functional Roles

Every Pokémon can occupy multiple roles.

### Engine

Creates a useful board state or resource.

Examples: Grassy Terrain, Psychic Terrain, Rain, Tailwind, Trick Room, stat changes, Fake Out positioning, Lightning Rod redirection, opponent-triggered resources.

### Converter

Turns an existing state into immediate progress.

Examples: Garchomp converting positioning into damage; Sylveon converting speed/positioning into spread damage; Gholdengo converting safe positioning into Make It Rain pressure; H-Arcanine converting a protected turn into enormous damage.

### Scaler

Gets progressively stronger or more difficult to answer.

Examples: Gholdengo + Nasty Plot; Ceruledge + Swords Dance; Sneasler + Coaching; Annihilape + Rage Fist.

### Disruptor / State Controller

Prevents the opponent from executing their intended game.

Examples: Fake Out, Intimidate, speed control, Hypnosis, priority, terrain manipulation, redirection, stat suppression.

### Connector

Interacts positively with many members of the team.

A connector doesn't merely have synergy with one partner.

It has **many useful edges** across the architecture.

### Bridge

Connects otherwise separate strategic clusters.

For example, a Pokémon might connect physical offense, special offense, speed control, and defensive play without necessarily being the strongest member of any one cluster.

---

## 4. Engine ≠ Win Condition

A Pokémon creating a state does not mean that state itself wins.

**Rillaboom** creates Grassy Terrain — the important question becomes:

> **Who converts Grassy Terrain into winning progress?**

Possible answers: Ceruledge → Grassy Seed; Rillaboom → boosted Grass damage; team → recovery/positioning; others → benefit indirectly.

So:

> **Engine → Converter → Win Condition**

is much more useful than simply asking whether two Pokémon “synergize.”

---

## 5. Conversion Pathways

Measure **how many ways a resource can become actual progress.**

Example — Rillaboom creates Grassy Terrain. Possible conversions: Grassy Glide, Wood Hammer, Ceruledge's Grassy Seed, terrain-based positioning, recovery, reduced Ground damage.

That's a **conversion network**, not merely synergy.

> **How many useful things can the team do with what it generates?**

---

## 6. Network Density

Think of the team as a graph.

Pokémon = nodes. Useful interactions = edges.

Examples:

- **Rillaboom → Ceruledge** — creates Grassy Terrain; converts Grassy Seed
- **Raichu → Gholdengo** — Lightning Rod / Fake Out positioning; converts into safe setup
- **Staraptor → Gholdengo** — Intimidate / Tailwind / positioning; converts into offensive tempo

A strong team has a high number of **meaningful edges**.

> **Not all edges are equal.**

---

## 7. Edge Taxonomy

### 1. Amplification Edge

A makes B stronger. Example: Sneasler → Garchomp through Coaching.

### 2. Protection Edge

A helps B safely retain or accumulate value. Example: Raichu → Gholdengo through Lightning Rod.

### 3. Conversion Edge

A creates a state that B converts. Example: Rillaboom → Ceruledge (Grassy Terrain → Grassy Seed).

### 4. Reset Edge

A allows B to recover from a negative state. Example: pivoting → remove/re-enter → reset Intimidate drops.

U-turn matters architecturally: it **does not prevent Intimidate** and U-turn damage is still reduced. Instead: Intimidate → pivot out → re-enter → fresh offensive state. It's a **reset valve**.

### 5. Counterplay Edge

The opponent's attempt to stop A creates value for B.

---

## 8. Counterplay Conversion

> **“What happens when the opponent correctly responds to my threat?”**

Weak team: Opponent counters A → plan collapses.

Strong team: Opponent counters A → B becomes stronger.

Example: Opponent attacks Annihilape → Rage Fist; Intimidate → Defiant; ignore Annihilape → Ceruledge/Gholdengo gets room. That produces an **adversarial flywheel**.

---

## 9. Opponent Action Conversion Rate — OACR

> **How often do common opponent actions create value for us?**

Potential opponent actions: Attack, Intimidate, Fake Out, Protect, Switch, set weather/terrain, boost, target a particular Pokémon, ignore a threat, double target, attempt speed control.

A team with high OACR makes the opponent's normal actions less clean.

---

## 10. Trigger Breadth

Not all reactive Pokémon are equally reactive.

**Milotic** — Competitive triggers primarily on stat drops → relatively narrow trigger breadth.

**Annihilape** — can react to attacks → Rage Fist; stat drops → Defiant → broader trigger breadth.

> **State-reactive vs interaction-reactive**

- Milotic: **State-reactive control**
- Annihilape: **Interaction-reactive pressure**

---

## 11. Conditionality vs Commitment

**Conditionality** — How dependent is the engine on the opponent doing something specific?

- Milotic: “I really want Intimidate/stat drops.”
- Annihilape: “You attacking me is enough.”

**Commitment** — How much value does the Pokémon lose by leaving the field?

Annihilape's Rage Fist creates **Positional Commitment + Resource Lock**. Milotic can generally leave without losing an equivalent accumulated resource.

- Milotic: narrower trigger, lower commitment
- Annihilape: broader trigger, higher commitment

---

## 12. Positional Commitment

High: “I need to remain here to keep my accumulated advantage.”

Low: “I can leave, reset, and return without losing much.”

Use this to distinguish superficially similar engines.

---

## 13. Resource Lock

A resource is **locked** when leaving the field causes it to disappear or substantially change.

Examples: Rage Fist accumulation, certain boosts, temporary board states, positioning-dependent pressure.

> **More power does not necessarily mean more usable power.**

A high-power engine that cannot safely leave the field can create architectural fragility.

---

## 14. Autonomous Conversion

> **How effectively does a Pokémon turn its own positioning/resources into progress without requiring a specific opponent response?**

**High:** Garchomp (enter → threaten → force positioning → progress); H-Arcanine (enter → enormous damage immediately).

**Lower:** Annihilape (dangerous, but part of scaling depends on being attacked / interacting).

This is why Garchomp remains architecturally interesting.

---

## 15. Marginal Architecture Gain — MAG

When adding Pokémon X:

> **How much NEW strategic territory does X add?**

Not “Is X strong?” or “Does X synergize?”

> **“What disappears from the architecture if I don't use X?”**

If A duplicates four things the team already does → **low MAG**.

If B introduces a new speed regime, damage axis, matchup solution, conversion route, or defensive interaction → **high MAG**.

Look beyond usage statistics.

---

## 16. Slot Replacement Value

> **“If I remove this Pokémon, how many functions and loops disappear?”**

High SRV: speed control + Intimidate + pivoting + physical pressure + defensive utility + a matchup answer — remove it and multiple systems disappear. That slot is architecturally expensive to replace.

---

## 17. Route Dependency Index — RDI

> **What percentage of the team's winning routes disappear when one Pokémon is removed?**

High RDI: “If Gholdengo dies, my entire team becomes something else.”

Low RDI: “Gholdengo dying hurts, but I still have several legitimate ways to win.”

Example low-fragility control network: Raichu / Rillaboom / Staraptor / Gholdengo / Ceruledge / Milotic — removing one component doesn't necessarily collapse the system.

---

## 18. Failure Resistance

A great team should have:

> **surviving routes after something goes wrong.**

What if lead gets KO'd? Mega target dies? Speed control fails? Scaler gets ignored? Main attacker Intimidated? Opponent sets Trick Room? Preferred engine denied?

Not: “How strong is the ideal line?”

> **“How much of the architecture survives when the ideal line fails?”**

---

## 19. Surviving Routes

Operational failure resistance. If Gholdengo disappears, Ceruledge scaling / Milotic control / Raichu tempo / Rillaboom priority / Staraptor speed control can still exist. That is **route redundancy**.

---

## 20. Redundancy in Function, Diversity in Conversion

> **Multiple ways to perform important functions, but different mechanisms for converting those functions into victory.**

Example — multiple forms of speed/tempo: Fake Out, Tailwind, priority, speed manipulation — different kinds of advantage → resilience without pure redundancy.

---

## 21. Threat-Profile Diversity

Not merely Physical + Special.

- **Kill threats** — Garchomp, H-Arcanine, Sylveon
- **Board manipulators** — Raichu, Rillaboom, Staraptor
- **Attack punishers** — Annihilape, Milotic
- **Scalers** — Gholdengo, Ceruledge
- **Switch/pivot threats** — Rillaboom, Staraptor
- **Speed threats** — Tailwind, priority, natural speed

Many threat *types* force different answers.

---

## 22. Targeting Ambiguity

> **How many dangerous targets can the opponent reasonably choose?**

If only one is threatening: “Kill that one.” Easy.

If they must choose among Gholdengo setup, Ceruledge setup, Annihilape scaling, Sylveon Hyper Voice, Garchomp attacking, Raichu board control → **Targeting Ambiguity**.

---

## 23. Threat Saturation

> **How many simultaneous threats require fundamentally different answers?**

Tailwind + Fake Out + special spread + physical burst + setup + priority + Intimidate — opponent cannot solve all with one defensive action.

---

## 24. Scaling Diversity

“Having setup” isn't enough — want **different kinds of scaling**.

- Self-scaling — Ceruledge → Swords Dance
- Special scaling — Gholdengo → Nasty Plot
- Coaching scaling — Sneasler → partner
- Opponent-action scaling — Annihilape → Rage Fist
- Reactive scaling — Milotic → Competitive

These behave differently under counterplay.

---

## 25. Competing Clocks

### Clock 1 — Immediate

Garchomp, H-Arcanine, Sylveon, Rillaboom — “I can create damage now.”

### Clock 2 — Short-term

Fake Out, Tailwind, positioning — “I gain tempo over the next few turns.”

### Clock 3 — Scaling

Gholdengo, Ceruledge, Sneasler — “If you don't stop this, the game gets progressively worse.”

### Clock 4 — Reactive

Milotic, Annihilape — “Your actions themselves can accelerate my win condition.”

A great team makes the opponent answer **multiple clocks simultaneously**.

---

## 26. The Adversarial Flywheel

> **Opponent acts → their action changes the board → our network converts that change → their next response becomes harder → our resources compound → multiple clocks approach their win conditions simultaneously.**

The team behaves like a system rather than a collection of Pokémon.

---

## 27. Resource Economy

Resources: HP, turns, Fake Outs, Tailwind turns, boosts, terrain turns, positioning, switches, speed advantage, accumulated Rage Fist, defensive resources, opponent attention.

> **How much progress can I extract before I have to commit to the endgame?**

---

## 28. Resource Generator → Converter → Protector

- **Generator** creates the resource
- **Converter** spends it to produce progress
- **Protector** keeps it alive long enough to matter

Example: Rillaboom generates terrain → Ceruledge converts via Grassy Seed → Staraptor/Raichu protect setup through positioning/control. Complete loop.

---

## 29. Loop Architecture

Strong teams contain **repeatable positive interactions**, not one-time combos.

Examples:

- Fake Out → favorable position → Tailwind → attack → pivot → re-enter → Fake Out again
- Intimidate → reduced physical pressure → pivot → re-enter → Intimidate again
- Grassy Terrain → Ceruledge Seed → Swords Dance → Bitter Blade recovery → continue scaling

Loops enable **repeatable resource extraction**.

---

## 30. Counterplay Loops

> The opponent's attempt to break your loop becomes fuel for another loop.

Opponent attacks Annihilape → Rage Fist grows; ignores it → Ceruledge/Gholdengo gets room; Intimidates → Defiant; focuses Ceruledge → infrastructure survives and another win route opens. **Adversarial loop.**

---

## 31. Architecture Fragility

> **How many loops can one opponent action destroy simultaneously?**

High: One Taunt kills the entire strategy.

Low: Taunt stops one route, but three others remain.

Critical distinction from raw synergy.

---

## 32. Speed Inversion

A team doesn't necessarily need to beat every speed-control strategy on the same axis.

> **Can the team exploit the opposite speed regime?**

Normal: Tailwind → fast offense. Opposite: Kingambit → slow-mode scaling.

Not only “How do I stop Trick Room?” but **“Can I make Trick Room economically useful to me?”**

---

## 33. Autonomous vs Reactive Architecture

A six should have a **portfolio** of engine types.

| Type | Behavior | Examples |
|------|----------|----------|
| Autonomous | Works largely on its own | Garchomp |
| Reactive | Stronger from opponent behavior | Milotic, Annihilape |
| Committed | Accumulates by staying in | Annihilape |
| Low-commitment | Pivot/reset without losing much | Milotic, Garchomp |

Ideal team isn't six autonomous or six reactive — it has a **portfolio**.

---

## 34. Architectural Surprise

Not gimmick. Not “nobody has seen this Pokémon.”

> **How difficult is it for the opponent to identify the actual win condition from team preview?**

If they can't tell Tailwind vs Gholdengo setup vs physical burst vs Ceruledge scaling vs reactive counterplay vs immediate conversion → **Architectural Surprise**.

---

## 35. Human Complexity

> The theoretically strongest architecture isn't necessarily the strongest ladder team.

Every additional branch increases decision load, sequencing complexity, preview complexity, execution mistakes.

> **Strategic depth must be balanced against Human Complexity.**

A team with 20 theoretical routes at 40% execution may lose to 10 routes at 90% execution.

---

## 36. Win Route Actualization — WRA

> **WRA = executed winning routes / available winning routes**

Theoretical route density ≠ actual route density the pilot can identify and execute.

---

## 37. MAG + WRA

Opposite problems:

- **MAG** — “Does this Pokémon add enough architecture?”
- **WRA** — “Can I actually use the architecture I've built?”

Huge MAG + huge complexity may hurt WRA. Simple low-MAG may improve WRA without enough strategic territory. Want the **sweet spot**.

---

## 38. Reserve Value

A Pokémon doesn't have to be in the six to be valuable.

> **Reserve Value** — How much strategic territory can this cover if the metagame or matchup changes?

Modules like Garchomp, Milotic, Ceruledge, Annihilape, Kingambit, Corviknight can be valuable even when not simultaneously registered.

---

## 39. Bench Pokémon Should Be Modules, Not “Alternates”

Bad bench: “Here are four other good Pokémon.”

Good bench: “Here are four strategic modules that change what the six does.”

| Module | Architectural shift |
|--------|---------------------|
| Garchomp | control/scaling → immediate autonomous conversion |
| Milotic | direct offense → reactive control |
| Ceruledge | immediate conversion → self-scaling |
| Annihilape | self-contained strategy → opponent-action scaling |

Each swap has an **architectural delta**.

---

## 40. Architectural Delta

When swapping X → Y, don't merely ask “Is Y better?”

Ask: **Gains** / **Losses** / **Identity change** / **Matchup change** / **Loop change** / **Win-condition change**.

---

## 41. Swap Cost

No swap is free. Ceruledge → Garchomp gains autonomous conversion, immediate Ground, less setup dependence; loses self-scaling, Grassy Seed interaction, Swords Dance route.

> **Choose the correct architecture for the problem** — not “find the strongest Pokémon.”

---

## 42. Package Architecture

For doubles (bring 4 of 6), the six should produce multiple **packages of four**.

Each package: identity, lead pair, back pair, turn-1 plan, loops, conversion edges, win condition, bring-in triggers, matchup purpose.

The four are a **mini-team**. The six are the **strategy generator that produces those mini-teams**.

For Champions Singles (bring 3 of 6), the same idea applies to **preview packs of three**.

---

## 43. Package Independence

A good six shouldn't require “these exact four or the team doesn't work.” Multiple packages should emerge and **overlap without being identical**.

Examples: Conversion package; Scaling package; Immediate-control package; Counterplay package.

---

## 44. Bring as a Strategic Decision

Not “my four/three strongest.”

> **“Which bring creates the correct clock portfolio against this opponent?”**

Preview: **What does this opponent want to make inevitable?** Then: **Which bring prevents that while creating my own?**

---

## 45. The Three-Layer Team Test

1. **Pokémon** — Are these individually good?
2. **Interactions** — Do they create useful edges?
3. **Architecture** — Does the six generate multiple independent winning systems?

Most team-building stops at Layer 2. Goal is Layer 3.

---

## 46. Candidate Pokémon Checklist

### Individual

- What does it do by itself?
- Autonomous conversion?
- What resources does it generate / consume?

### Network

- Who does it create value for / who creates value for it?
- How many edges, and of what kinds?

### Architecture

- New route? Replaced route? MAG? Slot Replacement Value? What if it dies?

### Counterplay

- Opponent attacks / ignores / Intimidates / protects / switches / uses speed control?

### Resource

- Generate / convert / protect / reset / lock?

### Timing

- Immediate / short-term / scaling / reactive clock?

### Execution

- Complexity? Decision load? Can the pilot realize theoretical value (WRA)?

---

## 47. Architecture We Are Searching For

> **A low-fragility, high-MAG network with multiple independent conversion pathways, multiple competing clocks, broad counterplay conversion, diverse scaling mechanisms, high threat saturation, strong resource economy, and enough simplicity that the pilot can actually realize the routes.**

Or:

> **Don't build six Pokémon. Build a machine that keeps generating ways to win.**

Most important test — not “Does this team have synergy?”

> **“When the opponent makes the correct play, does my architecture still give me somewhere productive to go?”**
