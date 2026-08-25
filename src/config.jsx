export const HERMOD_UI_CONFIG = {
  paidTooltipCloseDelayMs: 300,
};

export const HERMOD_CHECKOUT_MODAL = {
  eyebrow: "Unlock paid analysis",
  title: "Adversarial analysis",
  featureName: "Adversarial analysis",
  price: "$9.99",
  buttonText: "Unlock analysis",
  demoNote: "Demo checkout only. No payment will be processed.",
  successText: "Demo complete. No payment was processed.",
  labels: {
    name: "Name on card",
    cardNumber: "Card number",
    expiry: "Expiry",
    cvc: "CVC",
  },
  placeholders: {
    name: "Alex Morgan",
    cardNumber: "4242 4242 4242 4242",
    expiry: "MM / YY",
    cvc: "123",
  },
};

export const HERMOD_PROVIDER_PAID_HOVER = {
  badgeText: "Paid feature",

  currentProvider: {
    title: "See the capabilities this champion provides",
    text: "This paid analysis will explain the specific capabilities this selected champion contributes to the named strategy.",
  },

  previewProvider: {
    title: "See the capabilities this champion would add",
    text: "This paid analysis will explain the capabilities this champion would contribute to the named strategy if you select it.",
  },

  pickArea: {
    title: "See what this pick contributes",
    text: "This paid analysis will explain the strategic capabilities, dependencies, and pathways this selected champion contributes to the current draft.",
  },

  banArea: {
    title: "See what this ban removes",
    text: "This paid analysis will explain which strategic capabilities, pathways, and future options are reduced or removed by this ban.",
  },

  previewPickArea: {
    title: "See what this pick would contribute",
    text: "This paid analysis will explain the strategic capabilities and pathways this champion would add if you commit the current preview.",
  },

  previewBanArea: {
    title: "See what this ban would remove",
    text: "This paid analysis will explain which strategic capabilities and future options would be reduced if you commit the current preview.",
  },

  buttonText: "Full analysis",
};

export const HERMOD_HELP = {
  strategic_lens: {
    title: "Strategic Lens",
    description: "A way of reading the same draft through one strategic question. Changing the lens changes the interpretation, not the champions.",
  },
  strategic_coverage: {
    title: "Strategic Coverage",
    description: "Shows which strategic archetypes and pathways the current team can structurally support.",
  },
  adversarial_fit: {
    title: "Adversarial Fit",
    description: "Opponent, patch, and game-state context modulate the effective strength of every lens by changing how the plan is actually tested.",
  },
  realizability: {
    title: "Realizability",
    description: "Shows whether the capabilities implied by the draft are practical to execute.",
  },
  robustness: {
    title: "Robustness",
    description: "Shows how well a strategy survives failure or disruption, including redundancy and concentrated dependencies.",
  },
  optionality: {
    title: "Optionality",
    description: "Shows what the draft can still become as picks and bans accumulate.",
  },

  average_coverage: {
    title: "Average Coverage",
    description: "A compact orientation metric for how much of the displayed strategy requirements are currently covered. It is not a recommendation score.",
  },
  covered: { title: "Covered", description: "All modeled requirements for this strategy are currently supported." },
  partial: { title: "Partial", description: "Some modeled requirements are covered, while others remain open." },
  gaps: { title: "Gaps", description: "Strategies or requirements that currently have no provider." },
  average_fit: { title: "Average Fit", description: "Illustrative execution fit for the current strategy space." },
  strong: { title: "Strong", description: "Relatively strong modeled execution support." },
  burdened: { title: "Burdened", description: "Execution is possible but carries more modeled burden." },
  low: { title: "Low", description: "Little modeled execution support is present." },
  redundant: { title: "Redundant", description: "More than one current provider supports the requirement." },
  single_points: { title: "Single Points", description: "Requirements currently supported by exactly one provider." },
  exposed: { title: "Exposed", description: "The strategy contains uncovered or concentrated structural weaknesses." },
  complete: { title: "Complete", description: "Every modeled requirement for the strategy is currently covered." },
  open_emerging: { title: "Open / Emerging", description: "Strategies that remain reachable; emerging strategies already have some support." },
  active: { title: "Active", description: "All modeled requirements for the named strategy are covered." },
  constrained: { title: "Constrained", description: "The strategy remains possible, but its remaining routes are narrowing." },
  closed: { title: "Closed", description: "The model no longer sees a remaining route to satisfy one or more requirements." },

  strategy_coverage_space: {
    title: "Strategic Coverage Space",
    description: "The collection of named strategies viewed through Strategic Coverage.",
  },
  strategy_realizability_space: {
    title: "Strategy Realizability Space",
    description: "The same strategy collection viewed through execution feasibility.",
  },
  strategy_robustness_space: {
    title: "Strategy Robustness Space",
    description: "The same strategy collection viewed through redundancy and vulnerability.",
  },
  strategy_option_space: {
    title: "Strategy Option Space",
    description: "The set of named strategic architectures the team can still move toward.",
  },
  strategy_composition_space: {
    title: "Strategy Composition Space",
    description: "The portion of the strategy space concerned with recognizable team-composition architectures.",
  },

  teamfight: {
    title: "Teamfight",
    description: "The family of compositions that answer the question: how are we structuring the decisive 5v5 battle?",
  },
  pick_catch: {
    title: "Pick / Catch",
    description: "The family focused on isolating and collapsing a vulnerable enemy target before the full fight can form.",
  },
  range_control: {
    title: "Range Control",
    description: "The family that wins by maintaining distance, imposing attrition, and making enemy commitment unfavorable.",
  },
  distributed_pressure: {
    title: "Distributed Pressure",
    description: "The family that creates side-lane or cross-map pressure and converts enemy division into leverage.",
  },

  front: {
    title: "Front-to-Back",
    description: "A teamfight archetype that establishes a stable battle line, protects sustained damage, and converts through frontline control.",
    explanation: "Front-to-back teamfight is a control-and-conversion strategy: it wants to win the opening exchange, protect the damage core, maintain follow-through, and then convert that stable layout into sustained pressure. The model ties this strategy to Start favorable fight, Safe positioning, Peel & disrupt, Maintain follow-through, and Convert opening because the true goal is not a single burst window but a durable frontline that keeps the carry alive long enough to turn the fight into an attrition contest. In Reddit terms, the common thread is that the comp must survive the first contact and keep the backline functional, otherwise the fight collapses before the team reaches the late-game value it was trying to create.",
    provenance: [
      { label: "r/leagueoflegends — teamfight structures and frontline/backline spacing", url: "https://www.reddit.com/r/leagueoflegends/search/?q=front%20to%20back%20teamfight" },
      { label: "r/summonerschool — how frontline comps stabilize fights and protect carries", url: "https://www.reddit.com/r/summonerschool/search/?q=frontline%20backline%20teamfight" },
      { label: "r/LoLMeta — front-to-back team composition discussions", url: "https://www.reddit.com/r/LoLMeta/search/?q=front%20to%20back%20teamfight" },
    ],
  },
  protect: {
    title: "Protect-the-Carry",
    description: "A teamfight archetype that concentrates protection, peel, and resources around a high-value scaling damage source.",
    explanation: "Protect Hypercarry is built around preserving the conditions under which one carry can become dominant. The requirements behind it are Safe positioning, Peel & disrupt, Recovery & sustain, and Safe scaling, which together keep the carry in a useful lane and alive long enough to convert a small lead into a full late-game advantage. The strategy is not just about defending a single champion; it is about giving that champion enough safety, tempo, and follow-up room so they can convert value without being punished for playing on their own terms. Reddit discussion usually frames this as a carry-protection problem: if the damage source cannot stay in position and survive the first exchange, the entire comp loses its point.",
    provenance: [
      { label: "r/leagueoflegends — protecting carries in late-game teamfights", url: "https://www.reddit.com/r/leagueoflegends/search/?q=protect%20hypercarry%20league%20of%20legends" },
      { label: "r/summonerschool — carry protection and peel priorities", url: "https://www.reddit.com/r/summonerschool/search/?q=carry%20protection%20peel" },
      { label: "r/LoLMeta — hypercarry compositions and peel value", url: "https://www.reddit.com/r/LoLMeta/search/?q=carry%20protection%20teamfight" },
    ],
  },
  zone: {
    title: "Dive / Backline Access",
    description: "A teamfight archetype built to reach and punish the enemy backline before they can stabilize.",
    explanation: "Zone-Control Teamfight works by making the enemy answer to your geometry rather than their preferred angle. The key requirements are Deny enemy movement, Hold key areas, Force repositioning, and Maintain follow-through, because the strategy only becomes meaningful when the team can deny lanes, choke the map, and punish the forced decision that follows. The Reddit logic behind this strategy is consistent: if the enemy can choose comfortable space, the fight becomes a contest of skill and timing; if the team can deny that comfort, the fight becomes a contest of the map and bad decisions.",
    provenance: [
      { label: "r/leagueoflegends — zone control and fight geometry discussions", url: "https://www.reddit.com/r/leagueoflegends/search/?q=zone%20control%20teamfight" },
      { label: "r/summonerschool — map control, choke points, and positioning", url: "https://www.reddit.com/r/summonerschool/search/?q=zone%20control%20map%20control" },
      { label: "r/LoLMeta — control comps and terrain denial", url: "https://www.reddit.com/r/LoLMeta/search/?q=zone%20control%20league%20of%20legends" },
    ],
  },
  poke: {
    title: "Wombo / AoE Teamfight",
    description: "A teamfight archetype that coordinates AoE control, burst, and initiation into synchronized fight windows.",
    explanation: "Poke & Disengage is an attrition strategy designed to win the fight before the enemy can fully commit. It depends on Apply ranged attrition, Force repositioning, Safe positioning, and Peel & disrupt so the team can chip away at the opponent while preserving its own spacing and safety. The real point of the plan is to turn each exchange into a resource problem for the enemy: if they must answer your range and your reposition, they lose tempo and the fight becomes a choice between bad trades and bad geometry. The Reddit discussion around poke comps is very consistent on this point: the comp is not trying to out-duel at point-blank range, it is trying to force a worse trade and then survive to repeat it.",
    provenance: [
      { label: "r/leagueoflegends — poke comps, disengage, and range advantages", url: "https://www.reddit.com/r/leagueoflegends/search/?q=poke%20and%20disengage%20league%20of%20legends" },
      { label: "r/summonerschool — ranged attrition and spacing fundamentals", url: "https://www.reddit.com/r/summonerschool/search/?q=poke%20disengage%20attrition" },
      { label: "r/LoLMeta — poke composition discussions", url: "https://www.reddit.com/r/LoLMeta/search/?q=poke%20composition%20league%20of%20legends" },
    ],
  },
  split: {
    title: "Split-Push",
    description: "A distributed-pressure archetype that creates side-lane threats to divide the opponent and convert that response into cross-map opportunities.",
    explanation: "Split Pressure is a map-and-attention strategy: it creates a side-lane threat, survives the counter-response, and then converts the enemy's forced division into objective and tempo advantage. The specific requirements behind it are Create side-lane threat, Survive side-lane pressure, Safe scaling, and Close fight / game, which capture the fact that the idea only works if the team can create pressure without immediately collapsing and then use that pressure to force an answer the opponent does not want. The Reddit framing is consistent: a split comp is not just a lane threat, it is a way to make the enemy solve an extra problem, and once that problem is created, the team gains time, space, and positional leverage.",
    provenance: [
      { label: "r/leagueoflegends — split pressure and side-lane map control", url: "https://www.reddit.com/r/leagueoflegends/search/?q=split%20pressure%20league%20of%20legends" },
      { label: "r/summonerschool — forcing enemies to split and respond to side pressure", url: "https://www.reddit.com/r/summonerschool/search/?q=split%20pressure%20side%20lane" },
      { label: "r/LoLMeta — composition pressure and map split discussions", url: "https://www.reddit.com/r/LoLMeta/search/?q=split%20pressure%20league%20of%20legends" },
    ],
  },
  pick: {
    title: "Pick & Collapse",
    description: "A strategy that finds an exposed target, isolates it, and collapses before the opposing team can stabilize.",
    explanation: "Pick & Collapse is a sequence strategy: the team first finds a vulnerable target, then reaches them, isolates them, and finishes before the enemy can re-form. The requirements behind it are Find target, Isolate target, Finish target, and Reach priority target, which summarize exactly why the plan is built around execution windows rather than raw front-to-back pressure. In practice, the strategy is trying to collapse a fight into one decisive moment: once the team has created access and removed the target's protection, the comp wins by converting a single mistake into a real advantage rather than entering a broad teamfight with no defined aim.",
    provenance: [
      { label: "r/leagueoflegends — pick compositions and target isolation discussions", url: "https://www.reddit.com/r/leagueoflegends/search/?q=pick%20and%20collapse%20league%20of%20legends" },
      { label: "r/summonerschool — isolating priority targets and collapsing fights", url: "https://www.reddit.com/r/summonerschool/search/?q=pick%20collapse%20target%20isolation" },
      { label: "r/LoLMeta — dive, pick, and collapse teamfight strategy", url: "https://www.reddit.com/r/LoLMeta/search/?q=pick%20collapse%20teamfight" },
    ],
  },
  engage: {
    title: "Engage & Follow-through",
    description: "A strategy built around reliably starting a favorable fight and maintaining enough access to finish it.",
    explanation: "Engage & Follow-through is about solving the sequence problem: the team has to start the fight on favorable terms and then keep enough pressure to convert the opening into a real objective or damage swing. The strategy is anchored on Start favorable fight, Reach priority target, and Maintain follow-through, because a single clean engage is only valuable if the team can create access and then keep the pressure alive rather than resetting into a weaker fight. The Reddit thread pattern behind this strategy is consistent: good engages are not just flashy initiations, they are openings that preserve the team's ability to keep the enemy under pressure long enough to convert the first contact into value.",
    provenance: [
      { label: "r/leagueoflegends — engage and follow-through fight plans", url: "https://www.reddit.com/r/leagueoflegends/search/?q=engage%20follow%20through%20teamfight" },
      { label: "r/summonerschool — engage timing and follow-up fundamentals", url: "https://www.reddit.com/r/summonerschool/search/?q=engage%20follow%20through" },
      { label: "r/LoLMeta — sequence-rich engage comps and follow-up value", url: "https://www.reddit.com/r/LoLMeta/search/?q=engage%20follow%20through%20league%20of%20legends" },
    ],
  },
  pressure_pick: {
    title: "Poke-Siege",
    description: "A range-control archetype that uses space and ranged pressure to force bad movement and punish unfavorable commitments.",
    explanation: "Pressure into Pick turns map pressure into a target problem. The team first denies movement, forces the enemy to reposition, finds the exposed target, and then finishes before they can recover. The central requirements are Deny enemy movement, Force repositioning, Find target, and Finish target, which captures the exact sequence behind the strategy: create a bad movement choice, turn that into a vulnerable target, and convert the pressure into a decisive window. Reddit discussion usually treats this as a forced-rotation plan rather than a burst plan, because the whole point is to make the enemy answer to your pressure before they are ready to fight on their own terms.",
    provenance: [
      { label: "r/leagueoflegends — pressure into pick and forced rotation ideas", url: "https://www.reddit.com/r/leagueoflegends/search/?q=pressure%20into%20pick%20league%20of%20legends" },
      { label: "r/summonerschool — map pressure and punished rotations", url: "https://www.reddit.com/r/summonerschool/search/?q=pressure%20into%20pick%20rotation" },
      { label: "r/LoLMeta — pressure to pick and side-lane punish comps", url: "https://www.reddit.com/r/LoLMeta/search/?q=pressure%20pick%20league%20of%20legends" },
    ],
  },

  fight_start: {
    title: "Start Favorable Fight",
    description: "Create or force an engagement under conditions that favor your team.",
    explanation: "The purpose of start favorable fight is to make the enemy answer on your terms instead of theirs. A team that can initiate from a strong position is not merely attacking earlier; it is taking control of the fight geometry, timing, and angle selection. This capability matters across multiple strategies because good initiation is the prerequisite for pick plans, front-to-back builds, and any composition that wants to convert advantage into control without wasting resources.",
    provenance: [
      { label: "r/leagueoflegends — favorable fight initiation and engage timing", url: "https://www.reddit.com/r/leagueoflegends/search/?q=favorable%20fight%20initiation%20league%20of%20legends" },
      { label: "r/summonerschool — how teamfight starts shape the rest of the skirmish", url: "https://www.reddit.com/r/summonerschool/search/?q=teamfight%20start%20favorable%20engage" },
      { label: "r/LoLMeta — engage sequencing and opening fight value", url: "https://www.reddit.com/r/LoLMeta/search/?q=favorable%20fight%20engage%20league%20of%20legends" },
    ],
  },
  fight_reach: {
    title: "Reach Priority Target",
    description: "Access an important enemy target despite distance, frontline, terrain, or defensive control.",
    explanation: "Reach priority target is a purpose-oriented capability: it creates the path from a teamfight setup to an actual objective. If the team cannot reach the key enemy, the other pieces of the plan are merely theoretical. This requirement shows up in dive, pick, and engage-heavy strategies because all of them require the ability to convert a setup into contact with a target that matters.",
    provenance: [
      { label: "r/leagueoflegends — reaching priority targets and dive routes", url: "https://www.reddit.com/r/leagueoflegends/search/?q=reach%20priority%20target%20league%20of%20legends" },
      { label: "r/summonerschool — target access and dive compromises", url: "https://www.reddit.com/r/summonerschool/search/?q=target%20access%20priority%20target" },
      { label: "r/LoLMeta — engage routes and carry access discussions", url: "https://www.reddit.com/r/LoLMeta/search/?q=priority%20target%20access%20league%20of%20legends" },
    ],
  },
  fight_follow: {
    title: "Maintain Follow-through",
    description: "Continue applying useful pressure after the initial engagement.",
    explanation: "Maintain follow-through exists because a good start is not enough if the team cannot convert it into continued pressure. The objective is to keep pressure alive after the initial engage so the enemy cannot reset or recover on their terms. This is central to front-to-back, engage, and pick compositions, because they all need the follow-up phase to productively turn the opening into a real advantage.",
    provenance: [
      { label: "r/leagueoflegends — follow-through and fight momentum", url: "https://www.reddit.com/r/leagueoflegends/search/?q=follow%20through%20teamfight%20league%20of%20legends" },
      { label: "r/summonerschool — maintaining pressure after engage", url: "https://www.reddit.com/r/summonerschool/search/?q=follow%20through%20pressure%20teamfight" },
      { label: "r/LoLMeta — momentum conversion after engage", url: "https://www.reddit.com/r/LoLMeta/search/?q=maintain%20follow%20through%20league%20of%20legends" },
    ],
  },
  protect_position: {
    title: "Safe Positioning",
    description: "Allow an important damage source to occupy a useful position without being immediately forced out, isolated, or killed.",
    explanation: "Safe positioning exists to protect the conditions under which the carry can actually use their strengths. A damage core only matters if it can stand in a useful area and make value decisions. This requirement is fundamental in protect hypercarry, front-to-back, and poke comps because all of them need the carry to stay effective and not be punished by poor placement or forced repositioning.",
    provenance: [
      { label: "r/leagueoflegends — safe positioning and carry placement", url: "https://www.reddit.com/r/leagueoflegends/search/?q=safe%20positioning%20carry%20league%20of%20legends" },
      { label: "r/summonerschool — why positioning is the real carry protection", url: "https://www.reddit.com/r/summonerschool/search/?q=safe%20positioning%20carry" },
      { label: "r/LoLMeta — carry positioning and value retention", url: "https://www.reddit.com/r/LoLMeta/search/?q=carry%20safe%20positioning" },
    ],
  },
  protect_peel: {
    title: "Peel & Disrupt",
    description: "Interrupt enemy access to a protected ally through control, displacement, threat, or denial.",
    explanation: "Peel and disrupt is the mechanism that preserves the carry's ability to play and not be punished by enemy access. It is not just about saving someone from being dived; it is about keeping the map and the fight from being decided by whichever side gets the first clean angle. This capability is highly reusable because it supports protect hypercarry, front-to-back, and any strategy where one teammate must remain functional while others absorb the risk.",
    provenance: [
      { label: "r/leagueoflegends — peel, disruption, and shield value in comps", url: "https://www.reddit.com/r/leagueoflegends/search/?q=peel%20disrupt%20carry%20league%20of%20legends" },
      { label: "r/summonerschool — the role of peel in protecting value carries", url: "https://www.reddit.com/r/summonerschool/search/?q=peel%20carry%20protection" },
      { label: "r/LoLMeta — peel value and target denial around carry windows", url: "https://www.reddit.com/r/LoLMeta/search/?q=peel%20carry%20teamfight" },
    ],
  },
  protect_recover: {
    title: "Recovery & Sustain",
    description: "Stabilize after taking damage or surviving an initial enemy action.",
    explanation: "Recovery and sustain exists to preserve the strategy after the first few seconds of a fight. The team is trying to survive the initial pressure so that a later fight or objective transition can happen on its own terms. This matters across protect-style and backline-heavy compositions because the plan often fails not at the first hit, but at the moment the team has to recover after losing tempo.",
    provenance: [
      { label: "r/leagueoflegends — sustain and recovery in prolonged fights", url: "https://www.reddit.com/r/leagueoflegends/search/?q=recovery%20sustain%20teamfight%20league%20of%20legends" },
      { label: "r/summonerschool — fight sustain and surviving the opening exchange", url: "https://www.reddit.com/r/summonerschool/search/?q=sustain%20after%20engage" },
      { label: "r/LoLMeta — sustain vs burst and recovery in comp design", url: "https://www.reddit.com/r/LoLMeta/search/?q=sustain%20recovery%20league%20of%20legends" },
    ],
  },
  space_deny: {
    title: "Deny Enemy Movement",
    description: "Make important areas dangerous, expensive, or impossible for the opponent to enter.",
    explanation: "Deny enemy movement is a strategic goal that restructures the map before the fight begins. The purpose is to remove enemy freedom of choice by making key routes or lanes dangerous or impossible to run through. This requirement is shared across zone-control, pressure, and split-pressure strategies because they all get value from limiting the opponent's ability to choose comfortable fight geometry.",
    provenance: [
      { label: "r/leagueoflegends — denying movement and map control discussions", url: "https://www.reddit.com/r/leagueoflegends/search/?q=deny%20enemy%20movement%20league%20of%20legends" },
      { label: "r/summonerschool — map control and movement denial", url: "https://www.reddit.com/r/summonerschool/search/?q=movement%20denial%20map%20control" },
      { label: "r/LoLMeta — zoning, denial, and route control", url: "https://www.reddit.com/r/LoLMeta/search/?q=movement%20denial%20league%20of%20legends" },
    ],
  },
  space_hold: {
    title: "Hold Key Areas",
    description: "Remain effective in strategically important terrain.",
    explanation: "Hold key areas exists to keep the team on the strategic ground it wants instead of conceding the map. The purpose is not just to occupy one place; it is to maintain pressure and safety in the terrain that decides the fight. This matters in zone-control and front-to-back strategies because holding a key area gives the team positional leverage without requiring a perfect fight start.",
    provenance: [
      { label: "r/leagueoflegends — holding key areas and terrain value", url: "https://www.reddit.com/r/leagueoflegends/search/?q=hold%20key%20areas%20league%20of%20legends" },
      { label: "r/summonerschool — terrain control and area denial", url: "https://www.reddit.com/r/summonerschool/search/?q=hold%20key%20areas%20terrain" },
      { label: "r/LoLMeta — key area control and positional advantage", url: "https://www.reddit.com/r/LoLMeta/search/?q=key%20area%20hold" },
    ],
  },
  space_force: {
    title: "Force Repositioning",
    description: "Make the opponent move away from a preferred position, formation, or area.",
    explanation: "Force repositioning is a purpose-driven way to break enemy comfort. The team is creating a decision the opponent does not want to make: move, lose the angle, or play on worse terms. This requirement supports pressure-to-pick, poke, and zone-control styles because they all depend on converting the enemy's bad movement into an advantage they can exploit.",
    provenance: [
      { label: "r/leagueoflegends — forcing reposition and bad movement", url: "https://www.reddit.com/r/leagueoflegends/search/?q=force%20repositioning%20league%20of%20legends" },
      { label: "r/summonerschool — forcing bad movement and teamfight geometry", url: "https://www.reddit.com/r/summonerschool/search/?q=force%20repositioning%20teamfight" },
      { label: "r/LoLMeta — repositioning pressure and fight disruption", url: "https://www.reddit.com/r/LoLMeta/search/?q=repositioning%20pressure" },
    ],
  },
  pick_find: {
    title: "Find Target",
    description: "Identify an enemy who can be attacked before the rest of the enemy team can respond effectively.",
    explanation: "Find target is the capability that makes an aggressive plan coherent. It is the act of turning a generic fight into a precise opportunity: the team identifies a vulnerable target and has a route or timing to execute on it. This requirement is central to pick and collapse and pressure-to-pick because without a targeted route, the team is simply trading or contesting instead of converting a moment into a decisive swing.",
    provenance: [
      { label: "r/leagueoflegends — finding targets and isolating priority threats", url: "https://www.reddit.com/r/leagueoflegends/search/?q=find%20target%20priority%20target%20league%20of%20legends" },
      { label: "r/summonerschool — target finding and priority selection", url: "https://www.reddit.com/r/summonerschool/search/?q=find%20target%20priority%20selection" },
      { label: "r/LoLMeta — target selection and isolation discussions", url: "https://www.reddit.com/r/LoLMeta/search/?q=target%20find%20priority%20carry" },
    ],
  },
  pick_isolate: {
    title: "Isolate Target",
    description: "Separate a target from protection, reinforcement, or a safe escape route.",
    explanation: "Isolate target is the purpose of making the target vulnerable to a sequence of actions rather than a single contact. It matters because a priority target is not an opportunity until it has been separated from the enemy's safety mechanism. This requirement supports pick and collapse, engage, and split-pressure strategies, since they all aim to make one target available before the enemy can respond with a full reset.",
    provenance: [
      { label: "r/leagueoflegends — isolating priority targets and carry protection", url: "https://www.reddit.com/r/leagueoflegends/search/?q=isolate%20target%20league%20of%20legends" },
      { label: "r/summonerschool — removing protection and collapsing onto targets", url: "https://www.reddit.com/r/summonerschool/search/?q=isolate%20target%20carry%20protection" },
      { label: "r/LoLMeta — target isolation and enemy reset mechanics", url: "https://www.reddit.com/r/LoLMeta/search/?q=target%20isolation%20teamfight" },
    ],
  },
  pick_finish: {
    title: "Finish Target",
    description: "Convert access or isolation into a completed kill or decisive removal.",
    explanation: "Finish target is the conversion step that turns a good opportunity into a win. A team can create access and isolation, but if it cannot convert the sequence into a clean elimination or forced reset, the comp loses the benefit of the setup. This capability matters in pressure-to-pick and pick and collapse plans because they are value engines built on turning a vulnerable target into decisive advantage.",
    provenance: [
      { label: "r/leagueoflegends — finishing targets after isolation and access", url: "https://www.reddit.com/r/leagueoflegends/search/?q=finish%20target%20league%20of%20legends" },
      { label: "r/summonerschool — kill execution and target confirmation", url: "https://www.reddit.com/r/summonerschool/search/?q=finish%20target%20kill%20execution" },
      { label: "r/LoLMeta — conversion after target isolation", url: "https://www.reddit.com/r/LoLMeta/search/?q=target%20finish%20teamfight" },
    ],
  },
  scale_safe: {
    title: "Safe Scaling",
    description: "Reach later-game power without accepting excessive strategic risk.",
    explanation: "Safe scaling is about preserving a plan through the mid and late game instead of forcing a brittle route to value. The purpose is not to be weak early; it is to build a path where the carry can become dangerous without being vulnerable for the entire game. This capability matters in protect hypercarry, split pressure, and front-to-back structures that expect power to accumulate later rather than instantly.",
    provenance: [
      { label: "r/leagueoflegends — safe scaling and slow value comp design", url: "https://www.reddit.com/r/leagueoflegends/search/?q=safe%20scaling%20league%20of%20legends" },
      { label: "r/summonerschool — scaling safely without overcommitting", url: "https://www.reddit.com/r/summonerschool/search/?q=safe%20scaling" },
      { label: "r/LoLMeta — late-game comp scaling and risk management", url: "https://www.reddit.com/r/LoLMeta/search/?q=safe%20scaling%20teamfight" },
    ],
  },
  scale_convert: {
    title: "Convert Opening",
    description: "Turn an advantage or mistake into meaningful damage, objectives, or map control.",
    explanation: "Convert opening exists because advantage is valuable only when it turns into outcomes. The purpose is to translate a good opening, a baited fight, or a granted mistake into damage, objectives, or map leverage. This is central to front-to-back and protect-style strategies, because they need to turn safety and control into actual results rather than simply surviving the exchange.",
    provenance: [
      { label: "r/leagueoflegends — converting advantages into objective or damage pressure", url: "https://www.reddit.com/r/leagueoflegends/search/?q=convert%20opening%20league%20of%20legends" },
      { label: "r/summonerschool — objective conversion and fight value", url: "https://www.reddit.com/r/summonerschool/search/?q=convert%20opening" },
      { label: "r/LoLMeta — pressure-to-objective conversion", url: "https://www.reddit.com/r/LoLMeta/search/?q=convert%20opportunity%20teamfight" },
    ],
  },
  scale_close: {
    title: "Close Fight / Game",
    description: "Turn accumulated advantage into decisive fights, objectives, or a finished game.",
    explanation: "Close fight or game is the final objective of a strategy: not just to survive or gain tempo, but to force the enemy into a losing end state. This capability matters when the team is ahead and wants to convert the pressure into a decisive objective or the last set of teamfights. It is important in split pressure, safe scaling, and front-to-back plans where the goal is not just to be strong, but to win the endgame on their terms.",
    provenance: [
      { label: "r/leagueoflegends — closing fights and winning the late game", url: "https://www.reddit.com/r/leagueoflegends/search/?q=close%20fight%20game%20league%20of%20legends" },
      { label: "r/summonerschool — converting advantages into wins", url: "https://www.reddit.com/r/summonerschool/search/?q=close%20fight%20game" },
      { label: "r/LoLMeta — objective conversion and closing power", url: "https://www.reddit.com/r/LoLMeta/search/?q=close%20fight%20teamfight" },
    ],
  },
  poke_pressure: {
    title: "Apply Ranged Attrition",
    description: "Create advantage by damaging or pressuring opponents before full commitment.",
    explanation: "Apply ranged attrition is the purpose of poke-based strategies: create a resource problem for the enemy before they can choose a clean engagement. The objective is to make every fight expensive for the opponent by attacking before full commitment, reducing their options, and forcing them to answer to your range rather than their preferred geometry. This is central to poke and disengage comps because they win by gradually converting not full commitment, but the pressure of being unable to answer safely.",
    provenance: [
      { label: "r/leagueoflegends — ranged attrition and poke pressure", url: "https://www.reddit.com/r/leagueoflegends/search/?q=ranged%20attrition%20league%20of%20legends" },
      { label: "r/summonerschool — poke pressure and trading fundamentals", url: "https://www.reddit.com/r/summonerschool/search/?q=ranged%20attrition%20poke" },
      { label: "r/LoLMeta — poking and wearing down before commitment", url: "https://www.reddit.com/r/LoLMeta/search/?q=poke%20pressure%20league%20of%20legends" },
    ],
  },
  split_threat: {
    title: "Create Side-Lane Threat",
    description: "Create meaningful pressure away from the main group so the opponent must divide resources.",
    explanation: "Create side-lane threat is the purpose of generating a split problem rather than a direct front-line fight. The comp is trying to create a second front that forces the opponent to choose how to respond, which immediately creates resource and attention pressure. This matters in split pressure and pressure-to-pick strategies because the entire plan depends on forcing the enemy to divide, then turning that answer into a map or objective advantage.",
    provenance: [
      { label: "r/leagueoflegends — side-lane threat and map split pressure", url: "https://www.reddit.com/r/leagueoflegends/search/?q=side%20lane%20threat%20league%20of%20legends" },
      { label: "r/summonerschool — split pressure and forcing resource division", url: "https://www.reddit.com/r/summonerschool/search/?q=split%20pressure%20side%20lane" },
      { label: "r/LoLMeta — map pressure and side-lane threats", url: "https://www.reddit.com/r/LoLMeta/search/?q=side%20lane%20threat" },
    ],
  },
  split_escape: {
    title: "Survive Side-Lane Pressure",
    description: "Avoid collapse or remain useful when multiple opponents respond to the side lane.",
    explanation: "Survive side-lane pressure is the second half of a split-pressure plan: it ensures that the team can actually benefit from creating the threat without immediately collapsing. The purpose is to maintain enough health, spacing, or follow-up to keep the threat meaningful after the enemy answers. This requirement matters because a split threat that dies immediately is not an advantage; it is a tax. It is especially important in side-pressure and split-based compositions that must remain useful after a response arrives.",
    provenance: [
      { label: "r/leagueoflegends — surviving side-lane pressure and split responses", url: "https://www.reddit.com/r/leagueoflegends/search/?q=survive%20side%20lane%20pressure%20league%20of%20legends" },
      { label: "r/summonerschool — surviving split responses and maintaining map pressure", url: "https://www.reddit.com/r/summonerschool/search/?q=survive%20side%20lane%20pressure" },
      { label: "r/LoLMeta — split pressure survival and pressure-retention plans", url: "https://www.reddit.com/r/LoLMeta/search/?q=survive%20side%20pressure" },
    ],
  },

  selected_named_strategy: {
    title: "Selected Named Strategy",
    description: "The strategy opened for detailed inspection. This panel shows its modeled requirements and current champion providers.",
  },
};

export const CHAMPION_CAPABILITY_GUIDANCE = {
  fight_start: {
    summary: "Helps the team dictate the opening exchange and pick the geometry of the first fight.",
    explanation: "This capability matters because the first contact is usually where the team decides whether it controls the fight or merely responds to it. Champions with reliable engage, hard initiation, or strong fight starts make it possible to choose the angle, target, and timing before the enemy is ready.",
    provenance: [
      { label: "CommunityDragon — champion ability toolkit and mechanics", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — engage timing and teamfight openings", url: "https://www.reddit.com/r/leagueoflegends/search/?q=teamfight%20start%20engage%20timing" },
      { label: "r/summonerschool — why opening fights changes the whole skirmish", url: "https://www.reddit.com/r/summonerschool/search/?q=teamfight%20start%20engage" },
    ],
  },
  fight_reach: {
    summary: "Creates the route from setup into real pressure or kill windows.",
    explanation: "Reach is a capability because it turns a plan into contact. If the team cannot get to the relevant target, the rest of the setup is only theory; this is what allows a fight to become a decisive access sequence instead of a slow contest.",
    provenance: [
      { label: "CommunityDragon — champion mobility and engage data", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — dive routes and priority target access", url: "https://www.reddit.com/r/leagueoflegends/search/?q=reach%20priority%20target%20dive" },
      { label: "r/summonerschool — target access and route selection", url: "https://www.reddit.com/r/summonerschool/search/?q=target%20access%20priority%20target" },
    ],
  },
  fight_follow: {
    summary: "Keeps pressure alive after the first commitment so the opening becomes a real advantage.",
    explanation: "This is the follow-through capability: a clean start is only valuable if the team can keep the enemy under pressure long enough to convert the initial advantage. It is what differentiates a well-timed engage from a one-shot that ends before the team has made the fight matter.",
    provenance: [
      { label: "CommunityDragon — ability sequencing and follow-up data", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — follow-through and teamfight momentum", url: "https://www.reddit.com/r/leagueoflegends/search/?q=follow%20through%20teamfight%20momentum" },
      { label: "r/summonerschool — maintaining pressure after engage", url: "https://www.reddit.com/r/summonerschool/search/?q=follow%20through%20pressure%20teamfight" },
    ],
  },
  protect_position: {
    summary: "Lets key teammates stay in useful spaces long enough to produce value.",
    explanation: "Safe positioning is a capability because it preserves the conditions for the carry or main threat to operate. If a champion keeps the damage core in a safe lane, angle, or spacing pattern, the whole team gets more of the value from the strategy instead of sacrificing it to bad positioning.",
    provenance: [
      { label: "CommunityDragon — positioning and spell geometry references", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — carry positioning and safe lanes", url: "https://www.reddit.com/r/leagueoflegends/search/?q=safe%20positioning%20carry%20teamfight" },
      { label: "r/summonerschool — why positioning is the real form of carry protection", url: "https://www.reddit.com/r/summonerschool/search/?q=safe%20positioning%20carry" },
    ],
  },
  protect_peel: {
    summary: "Disrupts enemy access to the team’s value source and keeps the carry alive.",
    explanation: "Peel and disrupt is a true capability because it shapes the enemy’s ability to reach the protected target. This is how the team prevents a clean angle, interrupts an access path, or denies the enemy the first clean contact that would otherwise end the fight.",
    provenance: [
      { label: "CommunityDragon — control, displacement, and utility data", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — peel and disruption in teamfight setups", url: "https://www.reddit.com/r/leagueoflegends/search/?q=peel%20disruption%20teamfight" },
      { label: "r/summonerschool — the role of peel in protecting value carries", url: "https://www.reddit.com/r/summonerschool/search/?q=peel%20carry%20protection" },
    ],
  },
  protect_recover: {
    summary: "Allows the team to recover after the initial exchange and stay in the fight.",
    explanation: "Recovery is a capability because it allows a team to survive the first wave of pressure and keep the strategy alive. Without it, the team may win the first contact but lose the plan at the second or third exchange when the damage is already spent.",
    provenance: [
      { label: "CommunityDragon — sustain and heal toolkit references", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — scaling and sustain after the opening trade", url: "https://www.reddit.com/r/leagueoflegends/search/?q=sustain%20recovery%20teamfight" },
      { label: "r/summonerschool — surviving the opening exchange and staying relevant", url: "https://www.reddit.com/r/summonerschool/search/?q=sustain%20after%20engage" },
    ],
  },
  space_deny: {
    summary: "Cuts off the enemy’s routes and makes key lanes expensive or impossible to enter.",
    explanation: "This capability is fundamentally about map control. It removes the enemy’s freedom of choice, narrows the space they can use, and makes them answer to your desired geometry rather than their preferred route.",
    provenance: [
      { label: "CommunityDragon — control and area denial ability references", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — movement denial and map control", url: "https://www.reddit.com/r/leagueoflegends/search/?q=deny%20enemy%20movement%20map%20control" },
      { label: "r/summonerschool — zoning and movement denial", url: "https://www.reddit.com/r/summonerschool/search/?q=movement%20denial%20map%20control" },
    ],
  },
  space_hold: {
    summary: "Keeps the team on the terrain that matters instead of conceding it to the enemy.",
    explanation: "Holding key areas is a capability because terrain and map control can be the difference between a favorable fight and a forced one. It lets the team stay on the ground that makes their strengths matter while denying the enemy the same comfort.",
    provenance: [
      { label: "CommunityDragon — terrain and control ability references", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — holding key areas and terrain value", url: "https://www.reddit.com/r/leagueoflegends/search/?q=hold%20key%20area%20teamfight" },
      { label: "r/summonerschool — why position on the map creates the fight", url: "https://www.reddit.com/r/summonerschool/search/?q=terrain%20control%20fight%20geometry" },
    ],
  },
  space_force: {
    summary: "Forces bad movement and breaks the enemy’s preferred positioning.",
    explanation: "This capability matters because a team does not just need pressure; it needs pressure that changes the enemy’s answer. By forcing a reposition, the team turns a comfortable shape into a disadvantage and creates a target or time window it can exploit.",
    provenance: [
      { label: "CommunityDragon — displacement and movement tools", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — forcing reposition and bad movement", url: "https://www.reddit.com/r/leagueoflegends/search/?q=force%20repositioning%20bad%20movement" },
      { label: "r/summonerschool — why forced movement creates real advantage", url: "https://www.reddit.com/r/summonerschool/search/?q=forced%20reposition%20teamfight" },
    ],
  },
  pick_find: {
    summary: "Finds a vulnerable target before the rest of the enemy can respond.",
    explanation: "Target finding is a capability because it converts a generic teamfight into a specific plan. It lets the team identify the real value point, choose the win condition, and avoid entering a broad teamfight without an objective.",
    provenance: [
      { label: "CommunityDragon — priority target and vision tools", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — target finding and priority selection", url: "https://www.reddit.com/r/leagueoflegends/search/?q=find%20target%20priority%20selection" },
      { label: "r/summonerschool — target prioritization in skirmishes", url: "https://www.reddit.com/r/summonerschool/search/?q=target%20finding%20priority%20target" },
    ],
  },
  pick_isolate: {
    summary: "Separates a target from safety, protection, or its backup plan.",
    explanation: "Isolation matters because a target is not valuable while it still has protection and escape routes. This capability strips away the safety margin, turning a live target into a vulnerable one and forcing the enemy to defend a bad geometry.",
    provenance: [
      { label: "CommunityDragon — crowd control and isolation tools", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — isolated targets and carry protection", url: "https://www.reddit.com/r/leagueoflegends/search/?q=isolation%20target%20teamfight" },
      { label: "r/summonerschool — how isolation changes fight value", url: "https://www.reddit.com/r/summonerschool/search/?q=isolate%20target%20carry%20protection" },
    ],
  },
  pick_finish: {
    summary: "Turns a created opening into a clean kill or forced reset.",
    explanation: "This is the conversion step. A team can create access and isolation, but without a reliable finish it cannot turn the setup into a decisive advantage. The finish capability is what turns a good opening into a real win condition.",
    provenance: [
      { label: "CommunityDragon — execution and burst tool references", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — finishing targets after isolation", url: "https://www.reddit.com/r/leagueoflegends/search/?q=finish%20target%20after%20isolation" },
      { label: "r/summonerschool — target execution and kill conversion", url: "https://www.reddit.com/r/summonerschool/search/?q=finish%20target%20kill%20execution" },
    ],
  },
  scale_safe: {
    summary: "Builds power without taking on excessive strategic risk.",
    explanation: "This capability is about the path to value: a champion or comp can be strong only if it can become dangerous without creating a brittle or fragile plan. Safe scaling creates a stable progression into the mid and late game instead of overcommitting too early.",
    provenance: [
      { label: "CommunityDragon — scaling and long-game kit references", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — safe scaling and comp design", url: "https://www.reddit.com/r/leagueoflegends/search/?q=safe%20scaling%20comp%20design" },
      { label: "r/summonerschool — scaling without overcommitting", url: "https://www.reddit.com/r/summonerschool/search/?q=safe%20scaling" },
    ],
  },
  scale_convert: {
    summary: "Transforms a lead, opening, or mistake into measurable fight value.",
    explanation: "Conversion is what makes advantage matter. A team may create a good start or a favorable angle, but if it cannot turn it into damage, objectives, or a strong fight rhythm, the lead is wasted and the strategy never becomes real.",
    provenance: [
      { label: "CommunityDragon — objective and damage conversion references", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — convert openings into objective pressure", url: "https://www.reddit.com/r/leagueoflegends/search/?q=convert%20opening%20objective%20pressure" },
      { label: "r/summonerschool — objective conversion and fight value", url: "https://www.reddit.com/r/summonerschool/search/?q=convert%20opening" },
    ],
  },
  scale_close: {
    summary: "Maximizes late-game pressure and turns advantage into a decisive end state.",
    explanation: "This capability is about the endgame. It matters when the team has already built a lead and now needs to convert that pressure into a final objective, decisive fight, or decisive map state instead of simply trading and surviving.",
    provenance: [
      { label: "CommunityDragon — late-game and objective pressure references", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — close game pressure and objective conversion", url: "https://www.reddit.com/r/leagueoflegends/search/?q=close%20fight%20game%20pressure" },
      { label: "r/summonerschool — converting advantage into wins", url: "https://www.reddit.com/r/summonerschool/search/?q=convert%20advantage%20wins" },
    ],
  },
  poke_pressure: {
    summary: "Creates a resource problem by forcing the enemy to answer at the wrong range.",
    explanation: "Poke pressure is a capability because it makes every interaction more expensive for the enemy. By forcing range-based decisions early, the team can wear the opponent down before they are ready to commit or fight on their preferred terms.",
    provenance: [
      { label: "CommunityDragon — ranged attack patterns and poke tools", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — poke pressure and range advantages", url: "https://www.reddit.com/r/leagueoflegends/search/?q=poke%20pressure%20range%20advantages" },
      { label: "r/summonerschool — ranged attrition and spacing fundamentals", url: "https://www.reddit.com/r/summonerschool/search/?q=poke%20pressure%20attrition" },
    ],
  },
  split_threat: {
    summary: "Forces the enemy to split attention and respond to pressure away from the main fight.",
    explanation: "Split pressure is valuable because it creates a second problem the enemy did not choose. Once the enemy has to divide attention, the team gains time, space, and objective leverage, even if the immediate fight never becomes a perfect frontal engagement.",
    provenance: [
      { label: "CommunityDragon — side pressure and objective control references", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — split pressure and side-lane threat", url: "https://www.reddit.com/r/leagueoflegends/search/?q=split%20pressure%20side%20lane%20threat" },
      { label: "r/summonerschool — forcing enemies to divide resources", url: "https://www.reddit.com/r/summonerschool/search/?q=split%20pressure%20resource%20division" },
    ],
  },
  split_escape: {
    summary: "Keeps the split pressure threat alive after the enemy answers.",
    explanation: "This capability is essential because a split threat is only useful if it remains relevant after the enemy reacts. If the team cannot survive the counter-response, then the threat becomes a temporary tax instead of a real map or tempo advantage.",
    provenance: [
      { label: "CommunityDragon — survival and disengage references", url: "https://www.communitydragon.org/" },
      { label: "r/leagueoflegends — surviving side-lane pressure and split responses", url: "https://www.reddit.com/r/leagueoflegends/search/?q=survive%20split%20pressure%20side%20lane" },
      { label: "r/summonerschool — surviving responses and retaining map pressure", url: "https://www.reddit.com/r/summonerschool/search/?q=survive%20side%20pressure%20map" },
    ],
  },
};

if (typeof window !== "undefined") {
  window.HERMOD_UI_CONFIG = HERMOD_UI_CONFIG;
  window.HERMOD_CHECKOUT_MODAL = HERMOD_CHECKOUT_MODAL;
  window.HERMOD_PROVIDER_PAID_HOVER = HERMOD_PROVIDER_PAID_HOVER;
  window.HERMOD_HELP = HERMOD_HELP;
}
