export const HERMOD_UI_CONFIG = {
  paidTooltipCloseDelayMs: 300,
};

export const HERMOD_CHECKOUT_MODAL = {
  eyebrow: "Unlock paid analysis",
  title: "Strategic capability analysis",
  featureName: "Champion capability analysis",
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

  buttonText: "View paid analysis",
};

export const HERMOD_HELP = {
  strategic_lens: {
    title: "Strategic Lens",
    description: "A way of reading the same draft through one strategic question. Changing the lens changes the interpretation, not the champions.",
  },
  objective_coverage: {
    title: "Objective Coverage",
    description: "Shows which strategic requirements the current team already satisfies.",
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
    title: "Strategy Coverage Space",
    description: "The collection of named strategies viewed through Objective Coverage.",
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

  composition_strategies: {
    title: "Composition Strategies",
    description: "Named strategies describing the overall architecture of how several champions work together.",
  },
  access_catch_strategies: {
    title: "Access / Catch Strategies",
    description: "Strategies centered on reaching, isolating, or collapsing onto important enemy targets.",
  },
  pressure_strategies: {
    title: "Pressure Strategies",
    description: "Strategies that create movement, space, or map pressure and convert the opponent's response.",
  },

  front: {
    title: "Front-to-Back Teamfight",
    description: "A teamfight architecture that establishes a stable battle line, protects sustained damage, and works through enemy frontline.",
  },
  protect: {
    title: "Protect Hypercarry",
    description: "A composition that concentrates protection, peel, and resources around a high-value scaling damage source.",
  },
  zone: {
    title: "Zone-Control Teamfight",
    description: "A composition that shapes where opponents can safely move or fight.",
  },
  poke: {
    title: "Poke & Disengage",
    description: "A composition that creates health or position advantages from range and avoids unfavorable hard commitment.",
  },
  split: {
    title: "Split Pressure",
    description: "A composition that creates side-lane threats to divide the opponent and convert that response into cross-map opportunities.",
  },
  pick: {
    title: "Pick & Collapse",
    description: "A strategy that finds an exposed target, isolates it, and collapses before the opposing team can stabilize.",
  },
  engage: {
    title: "Engage & Follow-through",
    description: "A strategy built around reliably starting a favorable fight and maintaining enough access to finish it.",
  },
  pressure_pick: {
    title: "Pressure into Pick",
    description: "A strategy that uses space or movement pressure to force an exposed transition and punish it.",
  },

  fight_start: { title: "Start Favorable Fight", description: "Create or force an engagement under conditions that favor your team." },
  fight_reach: { title: "Reach Priority Target", description: "Access an important enemy target despite distance, frontline, terrain, or defensive control." },
  fight_follow: { title: "Maintain Follow-through", description: "Continue applying useful pressure after the initial engagement." },
  protect_position: { title: "Safe Positioning", description: "Allow an important damage source to occupy a useful position without being immediately forced out, isolated, or killed." },
  protect_peel: { title: "Peel & Disrupt", description: "Interrupt enemy access to a protected ally through control, displacement, threat, or denial." },
  protect_recover: { title: "Recovery & Sustain", description: "Stabilize after taking damage or surviving an initial enemy action." },
  space_deny: { title: "Deny Enemy Movement", description: "Make important areas dangerous, expensive, or impossible for the opponent to enter." },
  space_hold: { title: "Hold Key Areas", description: "Remain effective in strategically important terrain." },
  space_force: { title: "Force Repositioning", description: "Make the opponent move away from a preferred position, formation, or area." },
  pick_find: { title: "Find Target", description: "Identify an enemy who can be attacked before the rest of the enemy team can respond effectively." },
  pick_isolate: { title: "Isolate Target", description: "Separate a target from protection, reinforcement, or a safe escape route." },
  pick_finish: { title: "Finish Target", description: "Convert access or isolation into a completed kill or decisive removal." },
  scale_safe: { title: "Safe Scaling", description: "Reach later-game power without accepting excessive strategic risk." },
  scale_convert: { title: "Convert Opening", description: "Turn an advantage or mistake into meaningful damage, objectives, or map control." },
  scale_close: { title: "Close Fight / Game", description: "Turn accumulated advantage into decisive fights, objectives, or a finished game." },
  poke_pressure: { title: "Apply Ranged Attrition", description: "Create advantage by damaging or pressuring opponents before full commitment." },
  split_threat: { title: "Create Side-Lane Threat", description: "Create meaningful pressure away from the main group so the opponent must divide resources." },
  split_escape: { title: "Survive Side-Lane Pressure", description: "Avoid collapse or remain useful when multiple opponents respond to the side lane." },

  selected_named_strategy: {
    title: "Selected Named Strategy",
    description: "The strategy opened for detailed inspection. This panel shows its modeled requirements and current champion providers.",
  },
};

if (typeof window !== "undefined") {
  window.HERMOD_UI_CONFIG = HERMOD_UI_CONFIG;
  window.HERMOD_CHECKOUT_MODAL = HERMOD_CHECKOUT_MODAL;
  window.HERMOD_PROVIDER_PAID_HOVER = HERMOD_PROVIDER_PAID_HOVER;
  window.HERMOD_HELP = HERMOD_HELP;
}
