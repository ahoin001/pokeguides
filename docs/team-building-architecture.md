# Pokémon Champions VGC Team-Building Architecture Thesis

## A reference sheet for Regulation M-C team construction

Lab-derived framework for Ringside: how we evaluate sixes, packages, bench modules, and candidate Pokémon.

**Use this when:** writing or reviewing team manuals, scoring synergy, proposing roster adds, flex/bench swaps, or searching the catalog for interesting architectural fits (not just usage rank).

**Related:** [manual-authoring-prompt.md](./manual-authoring-prompt.md) (JSON schema + packages), [formats.md](./formats.md).

This document codifies the framework we developed for answering a much harder question than “which six Pokémon are strongest?”

> **What six Pokémon create the largest number of robust, meaningfully different, failure-resistant winning systems?**

The central thesis is that elite VGC teams are not merely collections of individually strong Pokémon, nor are they necessarily built around one dominant combo. The strongest constructions tend to behave more like **networks of overlapping strategic modules**: different four-Pokémon packages can generate different board states, different clocks, and different ways of converting small advantages into wins.

Current M-C tournament evidence strongly supports that view. The format contains multiple successful architectures rather than one solved shell: Raichu/Rillaboom/Sneasler/Gholdengo, Sand/Indeedee/Sneasler structures, Gengar/Politoed/Archaludon control, and Pelipper/Archaludon/Swampert/Grimmsnarl all have meaningful tournament evidence despite playing fundamentally different games. ([Pokémon Zone][1])

---

# I. Core Thesis

## 1. Do not build “six good Pokémon”

The basic unit of VGC team construction is not the Pokémon.

It is not even the pair.

It is the **winning subsystem**.

Because a player selects four of six, a six-Pokémon roster should function as a **Strategy Generator**:

> **The registered six should produce several coherent four-Pokémon teams, and those fours should contain multiple interacting three-Pokémon subsystems.**

A team therefore has two levels:

**Registered Team**
→ the strategic possibility space.

**Bring Four**
→ the actual mini-team played in a matchup.

The six is valuable partly because of what each Pokémon does and partly because of **how many strategically coherent subsets the six contains**.

---

# II. The Fundamental Architecture Model

Our original model was:

> **Engine → Converter → Win Condition**

We later refined it to:

> **Infrastructure → Engine → Converter → Clock**

Each layer matters.

| Layer              | Definition                                                     | Example                                        |
| ------------------ | -------------------------------------------------------------- | ---------------------------------------------- |
| **Infrastructure** | Changes the rules/resources of the board                       | Psychic Terrain, Sand, Grassy Terrain, screens |
| **Engine**         | Produces repeatable usable advantage                           | Coaching, Fake Out loops, Stamina, Intimidate  |
| **Converter**      | Turns that advantage into actual progress                      | Excadrill, Gholdengo, Metagross                |
| **Clock**          | Creates a state that becomes increasingly difficult to survive | Corviknight scaling, Perish Song, Sand offense |

A Pokémon can occupy multiple layers simultaneously.

That is generally valuable because it reduces “dead support” turns.

---

# III. The Roles We Use

## Engine

Creates a repeatable useful resource or state.

Examples:

* terrain
* weather
* stat boosts
* Intimidate cycling
* Fake Out
* screens
* Stamina
* speed control.

## Converter

Turns a useful state into damage or positional progress.

Examples:

* Excadrill converting Sand into speed and pressure
* Gholdengo converting protected turns into Nasty Plot or Make It Rain
* Metagross converting screens/terrain into something it can actively attack.

## Scaler

Becomes progressively harder to answer as turns/resources accumulate.

Examples:

* Corviknight
* Gholdengo
* Kommo-o
* Annihilape
* Kingambit.

## Disruptor / State Controller

Prevents the opponent from playing their preferred game.

Examples:

* Trick
* Encore
* Fake Out
* Perish Song
* screens
* priority denial
* terrain manipulation.

## Connector

Participates usefully in many different subsystems.

A good connector is not merely “support.”

It lets resources move between modules.

Examples:

* Sneasler
* Salamence
* Rillaboom
* Indeedee-M.

## Bridge

Connects two otherwise distinct strategic modules without requiring either one to compromise.

This became particularly important after examining Baltimore.

---

# IV. The Most Important Architectural Metrics

## Marginal Architecture Gain — MAG

> **What becomes strategically possible because this Pokémon exists?**

High MAG means a Pokémon creates new territory rather than merely duplicating an existing function.

Examples:

Adding another fast physical attacker to an already-fast physical team may have low MAG.

Adding Farigiraf may have high MAG because it introduces:

* Trick Room
* priority denial
* slow-mode compatibility.

---

## Conditional MAG — C-MAG

MAG must be contextual.

> **How much new territory does Pokémon X add specifically to these other five Pokémon?**

A generally excellent Pokémon can have poor C-MAG if its role is already saturated.

Conversely, a niche Pokémon can have enormous C-MAG if it patches an architectural weakness.

---

## Infrastructure Fan-Out

> **How many strategically meaningful teammates can consume what this Pokémon creates?**

Sneasler has high fan-out because Coaching can improve many physical recipients.

Rillaboom has high fan-out because terrain influences:

* healing
* Grassy Glide
* Ground damage
* Seed activation
* positioning.

---

## Scaling Fan-Out

> **How many different recipients can a scaling tool meaningfully accelerate?**

This is especially relevant to Coaching.

A Coaching user with only one worthwhile recipient has low fan-out.

A Coaching user supporting Corviknight, Tyranitar, Excadrill and other threats has high fan-out.

---

# V. Conversion Pathways

Resources are only valuable if they can become progress.

For each engine ask:

> **How many ways can this resource be converted?**

Example:

### Grassy Terrain

Can become:

* Rillaboom priority
* Grassy Seed activation
* passive recovery
* Ground mitigation
* safer setup
* potentially consumable terrain for Steel Roller.

A team with several conversion pathways gets more value from one infrastructure slot.

---

# VI. Shared Infrastructure

The most efficient teams often use one resource to support several routes.

## Infrastructure Reuse

> **How many distinct win routes consume the same resource?**

Psychic Terrain can create:

* priority denial
* Psychic Seed
* Expanding Force pressure
* safe setup conditions.

Sand can create:

* Excadrill speed
* Tyranitar pressure
* residual/defensive implications.

Infrastructure reuse increases slot efficiency.

---

# VII. Consumable Infrastructure

A newer concept that emerged from Metagross analysis.

> **Can a resource create value while existing and then create additional value when intentionally removed or consumed?**

Example:

Grassy Terrain:

1. heals teammates;
2. enables priority;
3. reduces Ground damage;
4. can later be consumed by **Steel Roller**.

Likewise Psychic Terrain can first deny priority and then become Steel Roller ammunition.

This means terrain is not just a persistent state.

It can function like **stored board currency**.

---

# VIII. Competing Clocks

Strong teams often operate several kinds of clocks simultaneously.

## Immediate Clock

> “If you don't respond right now, something dies.”

Examples:

Excadrill
Garchomp
Raichu
Metagross.

## Short-Term Tempo Clock

> “I will accumulate positional advantage across the next few turns.”

Examples:

Fake Out
Tailwind
Intimidate cycling.

## Scaling Clock

> “The longer this remains unchecked, the harder the game becomes.”

Examples:

Corviknight
Gholdengo
Kommo-o.

## Reactive Clock

> “Your own actions increase my threat.”

Examples:

Milotic
Annihilape
Archaludon.

## Temporal Clock

> “Passing turns itself advances my win condition.”

Examples:

Perish Song
poison
screens + sustain
weather/terrain recovery.

The best teams often force opponents to answer **multiple clocks operating on different timelines**.

---

# IX. Threat Saturation

> **How many simultaneous threats require fundamentally different answers?**

This matters more than simply having high damage.

A team could present:

* Fake Out
* Tailwind
* Trick Room
* setup
* spread damage
* priority
* Perish Song.

If one defensive action does not address all of these, the opponent faces strategic overload.

---

# X. Targeting Ambiguity

> **How difficult is it for the opponent to identify the correct target?**

If the opponent must decide between:

* stopping Corviknight
* stopping Sneasler
* removing Sand
* controlling Salamence

their targeting choice creates opportunity elsewhere.

This becomes especially important when several threats **convert the opponent's attention into resources for teammates**.

---

# XI. Counterplay Conversion

This was one of our most important discoveries.

Ordinary team building asks:

> “What happens when the opponent doesn't answer my threat?”

Our framework asks:

> **“What happens when the opponent answers it correctly?”**

Weak architecture:

> opponent answers A → A stops working.

Strong architecture:

> opponent answers A → B gets more room.

Examples:

Opponent Intimidates physical attackers
→ Milotic can activate Competitive.

Opponent attacks Annihilape
→ Rage Fist becomes stronger.

Opponent commits heavily to Corviknight
→ Sand offense gets freedom.

This produces an **adversarial flywheel**.

---

# XII. Opponent Action Conversion Rate — OACR

> **How often do normal opponent actions create value for our team?**

Relevant opponent actions include:

* attacking
* Intimidating
* protecting
* switching
* boosting
* targeting
* ignoring
* changing weather
* changing terrain
* setting speed control.

A high-OACR architecture makes “correct play” less clean.

---

# XIII. Counterplay Debt

Sometimes stopping one threat is possible—but expensive.

> **What useful thing must the opponent neglect in order to execute their counterplay?**

If stopping Corviknight requires two attacks, perhaps Excadrill gets a free turn.

If stopping Gholdengo requires preserving one specific answer, another attacker gets positional freedom.

That lost opportunity is **Counterplay Debt**.

---

# XIV. Forced-Response Density — FRD

The Gengar control architecture led us to this metric.

> **How many different tools force the opponent to abandon their preferred line?**

Examples:

* Fake Out
* Encore
* Perish Song
* redirection
* Sleep
* Trick Room
* screens
* Steel Roller terrain removal.

Gengar/Politoed/Archaludon is one of the clearest current examples of this philosophy; the trio has appeared on 386 teams with 215 Top-16 finishes, roughly 1.96× expectation. ([Pokémon Zone][2])

---

# XV. Advantage Generation Rate — AGR

Not all teams create advantage in the same way.

AGR asks:

> **How frequently can the team manufacture a meaningful favorable state without requiring a hard prediction?**

Examples of low-read advantage:

* Fake Out
* Intimidate
* screens
* weather
* Tailwind
* terrain
* redirection
* Perish Song
* Trick Room.

A team that repeatedly produces small advantages can convert nominally even matchups into favorable game states.

---

# XVI. Advantage Retention

Creating advantage is not enough.

> **How well does the team preserve accumulated advantage?**

Corviknight demonstrates this beautifully:

Psychic Seed
→ bulk

Coaching
→ more stats

Bulk Up
→ additional scaling

Roost
→ retain accumulated value

Power Trip
→ eventually cash it out.

Durable Rain achieves the same goal differently through:

* screens
* Stamina
* recovery
* Sinistcha support.

---

# XVII. Advantage Recovery

> **After losing a favorable state, how easily can the team create a different one?**

Examples:

Lose Sand
→ use Corviknight scaling.

Lose setup route
→ use Excadrill.

Lose Gengar
→ Archaludon rain remains.

Lose rain
→ Metagross/Swampert/screens remain.

This became one of the major reasons modular architectures outperform linear ones.

---

# XVIII. Opponent Progress Suppression

Durable Rain taught us that advantage can come from preventing progress rather than generating immediate pressure.

> **How much useful progress does an otherwise-correct opponent action actually accomplish?**

Screens + recovery + Stamina can make an attack “correct” but inefficient.

This creates another style of advantage:

> **Your turn happened, but it didn't accomplish enough.**

---

# XIX. Resource Economy

Resources include more than HP.

Relevant resources include:

* HP
* turns
* Tailwind turns
* weather turns
* terrain turns
* boosts
* positioning
* Fake Outs
* switches
* opponent attention
* information
* accumulated Rage Fist
* screen turns
* remaining Pokémon.

A strong team asks:

> **How much progress can we extract before spending our scarce resources?**

---

# XX. Resource Generator → Converter → Protector

A useful micro-model:

**Generator**
creates the resource.

**Converter**
turns it into progress.

**Protector**
preserves the resource long enough to be valuable.

Example:

Indeedee
→ Psychic Terrain

Sneasler
→ Coaching

Corviknight
→ converts boosts

Roost
→ protects accumulated value.

---

# XXI. Loop Architecture

Elite teams tend to contain **repeatable loops**, not merely one-time combos.

Example:

Fake Out
→ positioning
→ setup
→ pivot
→ re-enter
→ Fake Out again.

Or:

Intimidate
→ reduce damage
→ pivot
→ re-enter
→ Intimidate.

Or:

screens
→ survive
→ recover
→ accumulate Stamina/setup
→ convert.

Loops create sustainable resource economies.

---

# XXII. Counterplay Loops

Even stronger:

> **The opponent's attempt to interrupt one loop powers another loop.**

Example:

Attack Annihilape
→ Rage Fist.

Intimidate physical core
→ Milotic.

Focus Corviknight
→ offensive partner gets room.

This is the ideal form of counterplay conversion.

---

# XXIII. Route Dependency Index — RDI

> **How many winning routes disappear if one Pokémon is removed?**

High RDI = fragile.

Low RDI = resilient.

A Pokémon can be extremely important and still create unhealthy dependency.

For example, if one Rillaboom simultaneously provides:

* terrain
* Sneasler activation
* Fake Out
* priority
* healing

then removing it may damage several paths at once.

That is useful power—but also dependency.

---

# XXIV. Slot Replacement Value

Different from RDI.

> **How much functional value disappears when this specific Pokémon is removed?**

High Slot Replacement Value is not automatically bad.

It simply tells us that the slot is structurally central.

The goal is to prevent that centrality from becoming a **single failure point**.

---

# XXV. Failure Resistance

Test architecture under failure.

Questions:

* primary lead dies
* Mega dies early
* speed control fails
* weather disappears
* terrain is overwritten
* setup is denied
* primary converter is removed
* opponent never triggers reactive ability
* opponent knows the set.

A team should not only have a powerful optimal line.

It should retain meaningful routes when that line fails.

---

# XXVI. Surviving Routes

> **How many credible ways to win remain after an important engine or Pokémon is removed?**

This metric is often more informative than theoretical synergy.

Baltimore performs particularly well because:

* Corviknight can disappear and Sand still works;
* Sand can disappear and Corviknight still works.

---

# XXVII. Failure Correlation Index — FCI

One of the most important late-stage discoveries.

Two win conditions are not truly independent merely because they involve different Pokémon.

> **FCI measures how many routes share the same failure condition.**

Example:

Four physical sweepers may look like four win conditions.

If Intimidate damages all four, they have high failure correlation.

Three speed-based routes may look diverse.

If Trick Room punishes all three, they have high failure correlation.

Low FCI is desirable.

---

# XXVIII. Orthogonal Failure Design

The ideal is:

> **Different routes should lose to different answers.**

Healthy architecture:

Route A loses to weather removal.
Route B loses to setup denial.
Route C loses to Intimidate.
Route D loses to special defense.

Unhealthy architecture:

Route A loses to Trick Room.
Route B loses to Trick Room.
Route C loses to Trick Room.

This is **true strategic diversity**.

---

# XXIX. Failure Inversion Count — FIC

Even better than low failure correlation:

> **How many opponent answers actively make another route better?**

Examples:

Intimidate
→ Milotic Competitive.

Opponent moves faster
→ Trick Room becomes more valuable.

Opponent attacks Annihilape
→ Rage Fist.

Opponent creates terrain
→ Metagross may consume it.

Opponent spends two actions stopping one scaler
→ another converter receives space.

This is the highest form of counterplay conversion.

---

# XXX. Redundancy: Good and Bad

## Functional Redundancy

Several Pokémon can perform related roles through different mechanisms.

Example:

* Fake Out
* Tailwind
* priority
* Trick Room

all influence tempo, but fail differently.

This is healthy.

## Correlated Redundancy

Several tools perform the same function and fail to the same answer.

Example:

three Fake Out users into Psychic Terrain.

That appears redundant, but the redundancy collapses simultaneously.

---

# XXXI. Threat-Profile Diversity

Diversity is not merely:

physical vs special.

Threat types include:

* immediate KO threat
* setup threat
* reactive threat
* board-control threat
* temporal threat
* priority threat
* positional threat
* attrition threat.

A six becomes harder to answer when these threats require distinct forms of counterplay.

---

# XXXII. Scaling Diversity

Different scaling mechanisms matter more than simply having multiple setup Pokémon.

Examples:

**Self-scaling**
→ Corviknight Bulk Up.

**Special scaling**
→ Gholdengo Nasty Plot.

**External scaling**
→ Sneasler Coaching.

**Opponent-action scaling**
→ Annihilape.

**Reactive scaling**
→ Milotic.

A team containing several different scaling mechanisms can reduce failure correlation.

---

# XXXIII. Speed Inversion

Do not always fight speed control on the opponent's axis.

> **Can our team benefit from the opposite speed state?**

Examples:

fast Salamence + slow Kingambit.

Raichu + Trick Room Farigiraf/Golisopod.

The goal is not:

> always be faster.

It is:

> **have productive states regardless of which speed regime exists.**

---

# XXXIV. Positional Commitment

Some resources require staying on the field.

Example:

Annihilape's accumulated Rage Fist value.

Leaving can reset or sacrifice meaningful progress.

This creates **positional commitment**.

Milotic tends to have lower commitment because its strategic identity survives switching more easily.

A healthy team should contain a portfolio of:

* high-commitment scalers
* low-commitment pivots
* autonomous attackers.

---

# XXXV. Resource Lock

A resource is locked when leaving the field destroys it.

Examples:

* boosts
* Rage Fist accumulation
* temporary positioning states
* some setup structures.

High power with extreme resource lock may be less usable than slightly lower power with greater flexibility.

---

# XXXVI. Autonomous Conversion

> **How well can a Pokémon turn its own presence into progress without needing a particular opponent action?**

High autonomy:

* Garchomp
* Gholdengo
* Metagross.

More reactive:

* Milotic
* Annihilape.

Teams generally benefit from combining both.

---

# XXXVII. Preview Tax

> **How much does preparing for one plausible mode weaken the opponent against another plausible mode?**

Baltimore:

prepare for Sand
→ Corviknight may gain room.

prepare for Corviknight
→ Sand becomes easier to execute.

Durable Rain:

prepare for Rain
→ Charizard/Venusaur dual-weather branch can alter assumptions.

Preview Tax is one reason modular teams can outperform their raw matchup numbers.

---

# XXXVIII. Package Density

There are 15 possible bring-four combinations from a six.

## Effective Package Density — EPD

> **How many of the 15 combinations are genuinely coherent?**

Not every one needs to be good.

But teams with more viable fours are harder to predict and less dependent on one matchup script.

---

# XXXIX. Independent Package Density

EPD alone is insufficient.

> **How many viable bring-four packages have meaningfully different failure conditions?**

A team could have 12 usable packages but all depend on the same engine.

That is less resilient than seven packages split across several independent systems.

---

# XL. Package Entropy

This was a critical refinement.

> **How strategically different are the viable bring-four packages?**

High package density + low entropy:

> many fours, same basic game.

High package density + high entropy:

> many fours that ask the opponent entirely different questions.

Baltimore is unusually strong here.

---

# XLI. Strategic Modularity

> **Does the team contain several internally coherent modules connected by shared bridge Pokémon?**

The ideal graph is **not** six Pokémon where every Pokémon depends on every other Pokémon.

That can become fragile.

The healthier structure resembles:

> several dense local clusters joined by high-value bridge nodes.

Baltimore is a prime example.

---

# XLII. Architecture Root

> **The smallest subsystem whose removal fundamentally changes the team's identity.**

Examples from our current research:

### Raichu Tempo Root

**Raichu / Rillaboom / Sneasler / Gholdengo**

This four has excellent tournament evidence: 104 teams, 69 Top-16 finishes and roughly **3.01× expected Top-16 performance**; Incineroar/Floette is its most common completion. ([Pokémon Zone][1])

### Sand Root

**Tyranitar / Excadrill / Salamence**

Supports multiple distinct module families.

### Gengar Control Root

**Gengar / Politoed / Archaludon**

386 teams, 215 Top-16 finishes and about **1.96× expected**. ([Pokémon Zone][2])

### Durable Rain Root

**Pelipper / Archaludon / Swampert / Grimmsnarl**

659 teams, 332 Top-16 finishes and about **2.13× expected**. ([Pokémon Zone][3])

---

# XLIII. Architecture Module

> **A slot or pair of slots that changes how the root wins without invalidating the root.**

Example:

Durable Rain root +

**Sinistcha / Metagross**

→ preservation / attrition.

The same root +

**Charizard / Venusaur**

→ weather ambiguity / faster conversion.

Both completions have substantial current tournament representation. The Metagross/Sinistcha completion is listed at 59.3% across 168 teams, while the Charizard/Venusaur completion is around 65% across roughly 129–130 teams. These are observational, selected samples rather than controlled comparisons. ([Pokémon Zone][3])

---

# XLIV. Module Elasticity

> **How many strategically different modules can an architecture root support while remaining competitively functional?**

This is one of the clearest signs of a good “strategy generator.”

High Module Elasticity means we can customize a root for:

* ladder
* tournament
* specific meta
* pilot preference

without rebuilding from scratch.

---

# XLV. Bridge Quality

> **How effectively can one Pokémon participate in separate modules without weakening either?**

High Bridge Quality examples:

### Salamence

Can contribute:

* Intimidate
* Tailwind
* immediate offense
* Mega pressure

without demanding a particular team identity.

### Sneasler

Can:

* Coach Corviknight
* support Sand attackers
* function offensively itself.

### Indeedee-M

Can:

* activate Psychic Seed
* block priority
* disrupt with Trick
* weaken special attackers
* contribute damage.

Bridge Quality is one of the reasons some Pokémon repeatedly appear across otherwise unrelated successful architectures.

---

# XLVI. Information Resilience

> **How much of the team's value survives after the opponent knows exactly what it does?**

This matters enormously in Bo3.

Low-information-resilience strategy:

> surprise is the primary advantage.

High-information-resilience strategy:

> knowledge does not remove the pressure.

Examples:

Screens remain screens after being revealed.

Perish Song still creates a deadline.

Competitive still taxes Intimidate.

Sand Rush still exists.

Baltimore's modularity also helps: revealing Corviknight does not reveal away Sand.

---

# XLVII. Information-Invariant Pressure

A subset of Information Resilience.

> **A mechanic is information-invariant if the opponent understanding it does not meaningfully eliminate its forcing effect.**

Examples:

* Fake Out
* Perish Song
* screens
* Armor Tail
* Intimidate
* Stamina.

This helps distinguish robust control from surprise gimmicks.

---

# XLVIII. Adaptation Depth

Bo3 introduces another layer.

Game 1:
Plan A.

Game 2:
opponent adapts.

Game 3:

> **How many meaningful second-order adaptations remain?**

High adaptation depth means the team can choose:

* A again with altered sequencing
* B
* C
* hybrid A/B.

Baltimore appears unusually strong here because its modes overlap rather than existing as completely separate fours.

---

# XLIX. Human Complexity / WRA

Architecture cannot be evaluated purely theoretically.

## Human Complexity

Measures:

* number of branching decisions
* lead complexity
* sequencing burden
* information burden
* positional precision required.

## Win Route Actualization — WRA

> **executed winning routes ÷ theoretically available winning routes**

A team can have enormous theoretical architecture but poor WRA if the pilot cannot consistently identify the correct route.

This is why Milotic Sand can plausibly be preferable to Corviknight Sand for some pilots:

less intricate ceiling, but easier route actualization.

Piloting remains inseparable from team quality.

---

# L. Why We Should Maintain Multiple Teams

The framework does **not** imply that one perfect six exists.

Quite the opposite.

Different architecture families optimize different things.

| Architecture               | What it primarily optimizes                         |
| -------------------------- | --------------------------------------------------- |
| **Raichu Tempo**           | rapid low-read advantage generation                 |
| **Baltimore Modular Sand** | package entropy + low failure correlation           |
| **Milotic Sand**           | reactive robustness + easier execution              |
| **Gengar Control**         | forced-response density + temporal pressure         |
| **Durable Rain**           | advantage retention + opponent-progress suppression |
| **Dual-Speed Farigiraf**   | failure inversion + speed ambiguity                 |

Therefore the proper project is:

> **Build several exceptional teams representing different strategic philosophies, then choose among them based on matchup environment, tournament structure and pilot comfort.**

---

# LI. Architecture 1 — Raichu Tempo Conversion

## Root

**Raichu / Rillaboom / Sneasler / Gholdengo**

The current four has particularly strong tournament-core evidence: 104 recorded teams, 69 Top-16 finishes and roughly 3.01× expected performance. ([Pokémon Zone][1])

The underlying Raichu/Rillaboom/Sneasler triad also shows about **2.86× expected Top-16 frequency**. ([Pokémon Zone][4])

## Identity

> **Manufacture safe turns quickly and turn them into immediate offensive progress.**

## Strengths

* huge AGR
* strong Fake Out pressure
* terrain reuse
* physical/special conversion
* strong opening tempo.

## Structural weakness

Several paths share:

* terrain
* priority
* Fake Out
* fast-board assumptions.

So Failure Correlation is higher than Baltimore.

## Development direction

Do **not** add more tempo merely because it synergizes.

Add a module that loses differently.

Current best research candidates:

**Salamence**
→ Tailwind, Intimidate, autonomous offense.

**Farigiraf**
→ speed inversion, anti-priority.

**Kingambit**
→ slow endgame.

**Metagross**
→ physical conversion + counter-infrastructure.

---

# LII. Architecture 2 — Baltimore Modular Sand

## Reference structure

**Tyranitar / Excadrill / Salamence / Indeedee-M / Sneasler / Corviknight**

## Identity

> **Several overlapping modules with unusually low shared failure conditions.**

### Sand module

Tyranitar / Excadrill.

### Setup-war module

Indeedee / Sneasler / Corviknight.

### Fast general offense

Salamence / Tyranitar / Excadrill / Sneasler.

The important part is not merely that each module is good.

It is that:

> stopping one does not automatically stop the others.

## Key architectural property

**Low Failure Correlation.**

Weather denial:
→ Sand suffers.

Corviknight remains.

Setup denial:
→ Corviknight suffers.

Sand remains.

Terrain denial:
→ Psychic Seed plan suffers.

White Herb Sneasler still functions.

This is among the strongest architecture lessons we extracted from Baltimore.

---

# LIII. Architecture 3 — Milotic Sand

Reference:

**Tyranitar / Excadrill / Salamence / Indeedee-M / Sneasler / Milotic**

The Excadrill/Indeedee/Milotic/Tyranitar four appears on 37 teams in the current database, with 20 Top-16 finishes and 2.13× expected performance; 35 of those 37 teams use Sneasler + Salamence as the completion. Lloyd Villar won a current event 13–1 with the resulting six. ([Pokémon Zone][5])

## Identity

> **Turn normal counterplay against physical offense into reactive resources.**

Intimidate physical core
→ potential Competitive Milotic.

Refuse to Intimidate
→ physical core operates more freely.

This is **Failure Inversion**.

## Why preserve this separately from Corviknight Sand?

Corviknight and Milotic solve different architectural problems.

Corviknight:

* higher setup ceiling
* higher Preview Tax
* higher package entropy.

Milotic:

* lower commitment
* simpler routes
* higher reactive robustness
* likely higher WRA for many pilots.

---

# LIV. Architecture 4 — Gengar Forced-Response Control

## Root

**Gengar / Politoed / Archaludon**

The trio currently shows 386 teams, 215 Top-16 finishes and roughly **1.96× expected Top-16 representation**. ([Pokémon Zone][2])

The most common completion:

**Vivillon / Incineroar / Swampert**

accounts for 172 teams with a listed 60.6% full-team win rate. ([Pokémon Zone][2])

## Identity

> **Remove clean turns from the opponent while maintaining multiple clocks.**

Tools:

* rain
* Stamina
* Fake Out
* Encore
* Perish
* redirection
* sleep
* Swampert physical conversion.

## Primary strength

**Forced-Response Density.**

The opponent repeatedly has to abandon their preferred line.

## Secondary strength

Perish provides a clock whose failure conditions differ radically from ordinary damage.

## Structural warning

Do not oversaturate control.

The architecture still needs enough conversion to actually cash out the turns it creates.

That is why Swampert is so important.

---

# LV. Architecture 5 — Durable Rain / Progress Suppression

## Root

**Pelipper / Archaludon / Swampert / Grimmsnarl**

This four has some of the strongest distributed current evidence:

659 teams
332 Top-16 finishes
approximately **2.13× expectation**. ([Pokémon Zone][3])

Related roots also remain strong:

Archaludon/Grimmsnarl/Pelipper:
**2.17× expected**. ([Pokémon Zone][6])

Archaludon/Grimmsnarl/Swampert:
**2.12× expected**. ([Pokémon Zone][7])

Pelipper/Archaludon/Swampert:
**1.89× expected** across well over 1,300 teams. ([Pokémon Zone][8])

## Identity

> **Make normal opponent actions produce insufficient progress.**

Screens
→ effective HP.

Stamina
→ attacks potentially improve defense.

Sinistcha
→ recovery/redirection.

Rain
→ modifies damage environment.

Metagross/Swampert
→ cash out preserved turns.

## Main branch A

**Sinistcha / Metagross**

→ maximum preservation and conversion stability.

## Main branch B

**Charizard / Venusaur**

→ weather ambiguity + faster offense.

The same four-mon root supports both branches. ([Pokémon Zone][3])

That is an excellent example of **Module Elasticity**.

---

# LVI. Architecture 6 — Dual-Speed Failure Inversion

This remains our most interesting dedicated experiment.

Conceptual root:

**Farigiraf + slow converter + fast converter**

Potential slow pieces:

* Golisopod
* Kingambit
* Camerupt.

Potential fast pieces:

* Raichu
* Salamence
* Garchomp.

Supporting candidates:

* Rillaboom
* Incineroar
* Milotic.

## Identity

> **Instead of merely surviving the wrong speed regime, actively exploit it.**

Opponent Tailwinds
→ Trick Room becomes attractive.

Opponent uses Trick Room
→ slow converter thrives.

Opponent Intimidates
→ Milotic.

Opponent relies on priority
→ Farigiraf.

Opponent uses Electric offense
→ Raichu.

This architecture aims for extremely high **Failure Inversion Count**.

---

# LVII. The Architecture-Building Workflow

This is the practical methodology we should use whenever constructing a new team.

### Phase 1 — Candidate discovery

Do not search only for high usage + high win rate.

Look for:

* high usage + rising adoption
* low/moderate usage + high win rate
* high-rating concentration
* unusual tournament concentration
* multiple viable modes
* unique board-rule interaction
* strong specific cores despite mediocre individual results.

### Phase 2 — Identify architecture roots

Find the smallest subsystem that already performs a coherent strategic job.

Do not automatically start with six.

### Phase 3 — Map resources

For every Pokémon record:

**creates**
**converts**
**protects**
**scales**.

### Phase 4 — Map clocks

Identify:

* immediate
* tempo
* scaling
* reactive
* temporal.

### Phase 5 — Calculate C-MAG

Ask what every additional slot adds **that the root does not already have**.

### Phase 6 — Audit bring-four packages

Of 15 possible fours:

* how many are coherent?
* how many have at least one engine?
* how many have a converter?
* how many have multiple clocks?

### Phase 7 — Audit Package Entropy

Do those fours actually play differently?

### Phase 8 — Build failure-condition graph

Map opponent answers against routes.

### Phase 9 — Lower FCI

Replace redundant routes whose failure conditions overlap unnecessarily.

### Phase 10 — Seek Failure Inversion

Prefer modules where the opponent's answer to A improves B.

### Phase 11 — Test Information Resilience

Assume the opponent knows everything.

Does the architecture still work?

### Phase 12 — Account for WRA

Choose the version the pilot can actually execute.

---

# LVIII. The Main Diagnostic Questions

When examining any candidate Pokémon or team, these are the questions that matter most:

1. **What resource does this Pokémon create?**
2. **Who converts that resource?**
3. **Who protects the converter?**
4. **What clock does this create?**
5. **What happens when the opponent correctly counters it?**
6. **Does that counterplay create value elsewhere?**
7. **How many teammates benefit from this Pokémon?**
8. **Does it introduce a genuinely new speed regime?**
9. **Does it duplicate an existing failure condition?**
10. **If it dies, what routes remain?**
11. **If its intended partner dies, is it still useful?**
12. **Does it increase Package Entropy?**
13. **Does it create Preview Tax?**
14. **Does it lower Failure Correlation?**
15. **Does it increase Human Complexity enough to lower WRA?**

---

# LIX. The Biggest Errors This Framework Helps Us Avoid

## Usage-rate slavery

High usage tells us:

> what the metagame frequently presents.

It does **not** tell us:

> what our six should contain.

---

## Synergy worship

Six Pokémon can have enormous theoretical synergy and still be fragile if all interactions depend on one state.

---

## Support saturation

Too many Pokémon can create turns without anyone converting those turns.

Gengar-control testing made this especially obvious.

---

## False redundancy

Three Fake Out users do not automatically create three independent tempo engines.

Psychic Terrain can suppress all three.

---

## Overvaluing the ideal line

A team that looks incredible when everything works may be worse than a slightly lower-ceiling team whose architecture survives disruption.

---

## Treating backup plans as independence

Plan B is not truly independent if the same answer kills Plan A and Plan B.

---

## Confusing surprise with robustness

A strategy that works once because it is unknown may have poor Information Resilience.

---

## Ignoring pilot burden

Theoretical route density is worthless if the pilot consistently chooses the wrong one.

---

# LX. Current Research Priorities

The framework suggests we should build **architecture families**, not crown one universal roster.

### Project A — Tempo Conversion

Root:
**Raichu / Rillaboom / Sneasler / Gholdengo**

Goal:
reduce correlated dependence on terrain/Fake Out/fast-board play.

Main modules to investigate:
**Salamence, Farigiraf, Kingambit, Metagross.**

---

### Project B — Modular Sand

Root:
**Tyranitar / Excadrill / Salamence**

Branches:

**Indeedee / Sneasler / Corviknight**

**Indeedee / Sneasler / Milotic**

**Rillaboom / Milotic / Gholdengo**

Goal:
maximize orthogonal failure and package entropy.

---

### Project C — Forced-Response Control

Root:
**Gengar / Politoed / Archaludon**

Likely completion:
**Incineroar / Vivillon / Swampert**

Goal:
maximize FRD while preserving enough conversion.

---

### Project D — Progress Suppression

Root:
**Pelipper / Archaludon / Swampert / Grimmsnarl**

Branches:

**Sinistcha / Metagross**

or

**Charizard / Venusaur**

Goal:
decide whether we want maximum stability or greater Preview Tax.

---

### Project E — Failure Inversion

Root concept:
**Farigiraf + slow converter + fast converter + Milotic-style reactive infrastructure**

Goal:
create a team where common opponent answers actively improve alternate modes.

---

# LXI. Working Definition of an Elite Team

Our current best formulation is:

> **An elite VGC team is a low-failure-correlation network of overlapping modules that creates repeated low-read advantages, converts them through multiple clocks, preserves enough functional redundancy to survive disruption, and forces the opponent to use different answers against different routes.**

A stronger version:

> **The best six are not necessarily those with the most synergy. They are the six whose useful four-Pokémon packages create the greatest number of distinct winning states without sharing the same failure conditions.**

And the strongest diagnostic question remains:

> **When the opponent makes the correct play against one of our routes, does the architecture still give us somewhere productive to go?**

The ideal answer is even stronger:

> **Does their correct answer make another route better?**

---

# APPENDIX A — Metric Glossary

| Metric                          | Meaning                                                       |
| ------------------------------- | ------------------------------------------------------------- |
| **MAG**                         | Marginal Architecture Gain                                    |
| **C-MAG**                       | Architecture added specifically given the other five          |
| **OACR**                        | Frequency with which opponent actions generate value for us   |
| **AGR**                         | Frequency of low-read favorable-state creation                |
| **FRD**                         | Number of tools that force opponent responses                 |
| **RDI**                         | Percentage of routes dependent on one Pokémon                 |
| **FCI**                         | Degree to which several routes lose to the same answer        |
| **FIC**                         | Number of opponent answers that strengthen an alternate route |
| **EPD**                         | Number of genuinely coherent bring-four packages              |
| **Independent Package Density** | Viable packages with distinct failure conditions              |
| **Package Entropy**             | Strategic diversity among viable bring-four packages          |
| **Infrastructure Fan-Out**      | Number of meaningful consumers of a generated resource        |
| **Scaling Fan-Out**             | Number of meaningful recipients of a scaling mechanism        |
| **Bridge Quality**              | Ability to connect independent modules without compromise     |
| **Module Elasticity**           | Number of distinct modules a root can successfully support    |
| **Slot Replacement Value**      | Functional loss when one Pokémon is removed                   |
| **Information Resilience**      | Value retained after opponent knows the strategy              |
| **Adaptation Depth**            | Number of meaningful later-set strategic pivots               |
| **Human Complexity**            | Execution burden on the pilot                                 |
| **WRA**                         | Winning routes actually executed relative to routes available |

---

# APPENDIX B — Resource Taxonomy

## Board-state resources

Weather
Terrain
Screens
Tailwind
Trick Room
priority permission/denial.

## Tempo resources

Fake Out
redirection
Encore
Sleep
Trick
forced switching.

## Stat resources

Coaching
Bulk Up
Nasty Plot
Stamina
Competitive
Defiant.

## Positional resources

switching
pivoting
Intimidate recycling
safe board entries.

## Temporal resources

Perish turns
screen turns
weather turns
terrain recovery
poison/chip clocks.

## Information resources

hidden Mega choice
multiple possible modes
set ambiguity
lead ambiguity.

---

# APPENDIX C — Edge Taxonomy

## Amplification Edge

A directly increases B's power.

Example:
Sneasler → Corviknight through Coaching.

## Protection Edge

A helps B retain resources.

Example:
screens → setup attacker.

## Conversion Edge

A creates a state B spends.

Example:
Tyranitar → Sand → Excadrill.

## Reset Edge

A helps B recover from a negative state.

Example:
pivoting out to reset stat drops.

## Counterplay Edge

Opponent's response to A creates value for B.

Example:
physical core → Intimidate → Milotic.

## Infrastructure-Consumption Edge

B deliberately consumes the state A created.

Example:
Rillaboom → terrain → Metagross Steel Roller.

---

# APPENDIX D — Clock Taxonomy

| Clock         | Question asked of opponent                                              |
| ------------- | ----------------------------------------------------------------------- |
| **Immediate** | Can you survive the next attack?                                        |
| **Tempo**     | Can you stop us accumulating positioning advantage?                     |
| **Scaling**   | Can you prevent this Pokémon becoming unmanageable?                     |
| **Reactive**  | Can you act without feeding our response?                               |
| **Temporal**  | Can you win before the clock expires?                                   |
| **Attrition** | Can you generate progress faster than we regenerate/preserve resources? |

---

# APPENDIX E — Failure Taxonomy

When evaluating a six, test at minimum:

| Failure                  | What it tests                 |
| ------------------------ | ----------------------------- |
| Weather removed          | engine dependence             |
| Terrain overwritten      | terrain/Seed dependency       |
| Tailwind lost            | speed dependence              |
| Trick Room imposed       | speed inversion               |
| Priority denied          | priority dependence           |
| Intimidate spammed       | physical correlation          |
| Setup denied             | scaler dependency             |
| Fake Out neutralized     | tempo correlation             |
| Primary Mega KO'd        | exclusive-resource dependence |
| Main converter KO'd      | surviving clocks              |
| Reactive trigger refused | autonomous floor              |
| Opponent knows sets      | information resilience        |
| Game 3 adaptation        | adaptation depth              |

---

# APPENDIX F — Evidence Hierarchy

When deciding whether an architecture deserves development, evidence should be weighted roughly in this order:

### Strongest

Large repeated tournament-core evidence across many teams.

### Strong

Multiple strong tournaments using substantially the same six/core.

### Useful

One elite major-event finish backed by coherent mechanics.

### Exploratory

Small-sample tournament result plus strong architecture.

### Hypothesis

Mechanically plausible idea with little competitive evidence.

The key is not to confuse:

> **mechanistic plausibility**

with:

> **competitive validation.**

Both matter, but they answer different questions.

---

# APPENDIX G — Current Evidence Anchors

### Raichu/Rillaboom/Sneasler/Gholdengo

104 teams, 69 Top-16 finishes, approximately **3.01× expected**. ([Pokémon Zone][1])

### Raichu/Rillaboom/Sneasler

131 teams, 88 Top-16 finishes, approximately **2.86× expected**. ([Pokémon Zone][4])

### Milotic Sand four

Excadrill/Indeedee/Milotic/Tyranitar:
37 teams, 20 Top-16s, approximately **2.13× expected**; 35 of 37 complete with Sneasler/Salamence. ([Pokémon Zone][5])

### Gengar Control root

Archaludon/Gengar/Politoed:
386 teams, 215 Top-16s, approximately **1.96× expected**. ([Pokémon Zone][2])

### Durable Rain root

Archaludon/Grimmsnarl/Pelipper/Swampert:
659 teams, 332 Top-16s, approximately **2.13× expected**. ([Pokémon Zone][3])

### Durable Rain supporting triad

Archaludon/Grimmsnarl/Pelipper:
1,115 teams, 593 Top-16s, approximately **2.17× expected**. ([Pokémon Zone][6])

### Pelipper/Archaludon/Swampert

1,384 teams, 640 Top-16s, approximately **1.89× expected**. ([Pokémon Zone][8])

### Durable Rain completion flexibility

Archaludon/Grimmsnarl/Pelipper/Swampert completes most commonly with Sinistcha/Metagross at 59.3% across 168 teams or Charizard/Venusaur around 65% across roughly 129 teams. These are observational full-team rates, not causal comparisons. ([Pokémon Zone][3])

---

# APPENDIX H — The Short Version for the Top of Your Notion Page

> **Pokémon Champions VGC Team-Building Thesis**
>
> A great six is not merely six strong Pokémon and not merely one highly synergistic combo. It is a **strategy generator**: a roster capable of producing several coherent bring-four packages with different clocks, different conversion pathways, and preferably different failure conditions.
>
> Build around **architecture roots** and add high-C-MAG **modules**. Favor shared infrastructure with multiple consumers, bridge Pokémon that connect independent modules, and win conditions that create competing clocks.
>
> Measure not only how many ways a team can win, but whether those routes fail to the same opponent answer. This is **Failure Correlation**. The strongest teams use **orthogonal failure design**: weather removal may stop one mode, setup denial another, Intimidate another, but no single answer collapses everything.
>
> Better still is **Failure Inversion**: when the opponent's correct answer to one route strengthens another—such as Intimidate activating Milotic or speed escalation making Trick Room more valuable.
>
> Evaluate every team through **Package Density, Package Entropy, Bridge Quality, Advantage Generation, Counterplay Conversion, Information Resilience, Adaptation Depth and WRA**.
>
> The final objective is:
>
> **A low-failure-correlation network of overlapping modules that repeatedly generates advantages, converts them through multiple independent clocks, survives disruption, and remains strategically flexible after the opponent understands what it is doing.**
>
> The defining test is:
>
> **When the opponent makes the correct play against our current route, do we still have somewhere productive to go?**
>
> The ideal team goes one step further:
>
> **Their correct answer becomes our next resource.**

[1]: https://www.pokemon-zone.com/champions/team-cores/gholdengo%2Braichu%2Brillaboom%2Bsneasler/ "Gholdengo + Raichu + Rillaboom + Sneasler - Team Core - Pokémon Zone"
[2]: https://www.pokemon-zone.com/champions/team-cores/archaludon%2Bgengar%2Bpolitoed/ "Archaludon + Gengar + Politoed - Team Core - Pokémon Zone"
[3]: https://www.pokemon-zone.com/champions/team-cores/archaludon%2Bgrimmsnarl%2Bpelipper%2Bswampert/ "Archaludon + Grimmsnarl + Pelipper + Swampert - Team Core - Pokémon Zone"
[4]: https://www.pokemon-zone.com/champions/team-cores/raichu%2Brillaboom%2Bsneasler/ "Raichu + Rillaboom + Sneasler - Team Core - Pokémon Zone"
[5]: https://www.pokemon-zone.com/champions/team-cores/excadrill%2Bindeedee%2Bmilotic%2Btyranitar/ "Excadrill + Indeedee + Milotic + Tyranitar - Team Core - Pokémon Zone"
[6]: https://www.pokemon-zone.com/champions/team-cores/archaludon%2Bgrimmsnarl%2Bpelipper/ "Archaludon + Grimmsnarl + Pelipper - Team Core - Pokémon Zone"
[7]: https://www.pokemon-zone.com/champions/team-cores/archaludon%2Bgrimmsnarl%2Bswampert/ "Archaludon + Grimmsnarl + Swampert - Team Core - Pokémon Zone"
[8]: https://www.pokemon-zone.com/champions/team-cores/archaludon%2Bpelipper%2Bswampert/ "Archaludon + Pelipper + Swampert - Team Core - Pokémon Zone"
