export const DATA_DRAGON_VERSION = "16.16.1";
export const DATA_URL = `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/data/en_US/champion.json`;
export const IMG_ROOT = `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/img/champion/`;

export const PHASES = [
  { id: "bans", label: "10 BANS", type: "bans" },
  { id: "b1", label: "B1", type: "pick", side: "blue", slots: [0] },
  { id: "r12", label: "R1 + R2", type: "pick", side: "red", slots: [0, 1] },
  { id: "b23", label: "B2 + B3", type: "pick", side: "blue", slots: [1, 2] },
  { id: "r34", label: "R3 + R4", type: "pick", side: "red", slots: [2, 3] },
  { id: "b45", label: "B4 + B5", type: "pick", side: "blue", slots: [3, 4] },
  { id: "r5", label: "R5", type: "pick", side: "red", slots: [4] },
];

export const REQUIREMENTS = {
  fight_start: "Start favorable fight",
  fight_reach: "Reach priority target",
  fight_follow: "Maintain follow-through",
  protect_position: "Safe positioning",
  protect_peel: "Peel & disrupt",
  protect_recover: "Recovery & sustain",
  space_deny: "Deny enemy movement",
  space_hold: "Hold key areas",
  space_force: "Force repositioning",
  pick_find: "Find target",
  pick_isolate: "Isolate target",
  pick_finish: "Finish target",
  scale_safe: "Safe scaling",
  scale_convert: "Convert opening",
  scale_close: "Close fight / game",
  poke_pressure: "Apply ranged attrition",
  split_threat: "Create side-lane threat",
  split_escape: "Survive side-lane pressure",
};

export const FAMILIES = [
  {
    name: "Composition strategies",
    strategies: [
      { id: "front", name: "Front-to-Back Teamfight", description: "Establish a stable battle line, absorb contact, then convert through sustained damage.", requirements: ["fight_start", "fight_follow", "protect_position", "protect_peel", "scale_convert"] },
      { id: "protect", name: "Protect Hypercarry", description: "Concentrate resources around one scaling damage source and preserve its output.", requirements: ["protect_position", "protect_peel", "protect_recover", "scale_safe", "scale_convert"] },
      { id: "zone", name: "Zone-Control Teamfight", description: "Shape where the fight can happen and punish entry into prepared space.", requirements: ["space_deny", "space_hold", "space_force", "fight_follow"] },
      { id: "poke", name: "Poke & Disengage", description: "Create health and position advantages before hard commitment.", requirements: ["poke_pressure", "space_force", "protect_position", "protect_peel"] },
    ],
  },
  {
    name: "Access / catch strategies",
    strategies: [
      { id: "pick", name: "Pick & Collapse", description: "Find an exposed target, isolate it, and finish before the enemy can stabilize.", requirements: ["pick_find", "pick_isolate", "pick_finish", "fight_reach"] },
      { id: "engage", name: "Engage & Follow-through", description: "Create a reliable fight entry and maintain enough access to finish it.", requirements: ["fight_start", "fight_reach", "fight_follow"] },
    ],
  },
  {
    name: "Pressure strategies",
    strategies: [
      { id: "split", name: "Split Pressure", description: "Force the opponent to divide and convert side pressure into cross-map gain.", requirements: ["split_threat", "split_escape", "scale_safe", "scale_close"] },
      { id: "pressure_pick", name: "Pressure into Pick", description: "Use space pressure to force movement, then punish the exposed transition.", requirements: ["space_deny", "space_force", "pick_find", "pick_finish"] },
    ],
  },
];

export const CURATED = {
  Sejuani: { fight_start: 4, fight_reach: 4, protect_peel: 2, space_hold: 2, pick_isolate: 3 },
  Jinx: { fight_follow: 3, protect_position: 1, scale_safe: 3, scale_convert: 4, scale_close: 4 },
  Orianna: { fight_follow: 3, protect_position: 2, space_deny: 4, space_hold: 4, space_force: 3, scale_convert: 2 },
  Milio: { protect_position: 4, protect_peel: 2, protect_recover: 4, scale_safe: 3, scale_convert: 2 },
  Rakan: { fight_start: 4, fight_reach: 4, protect_peel: 3, pick_find: 3, pick_isolate: 3 },
  Lulu: { protect_position: 4, protect_peel: 4, protect_recover: 4, scale_safe: 3, scale_convert: 2 },
  Ornn: { fight_start: 3, protect_position: 2, space_hold: 3, scale_safe: 2 },
  Jayce: { space_deny: 3, space_force: 4, pick_find: 3, pick_finish: 3, scale_convert: 1, poke_pressure: 4 },
  Nautilus: { fight_start: 4, fight_reach: 4, pick_find: 3, pick_isolate: 4 },
  Maokai: { fight_start: 4, fight_reach: 2, space_hold: 3, pick_find: 3 },
  Azir: { fight_follow: 3, space_deny: 4, space_hold: 3, scale_safe: 4, scale_close: 3, poke_pressure: 2 },
  Ashe: { fight_start: 3, pick_find: 4, space_force: 2, scale_convert: 2, poke_pressure: 2 },
  Varus: { space_deny: 3, space_force: 3, pick_find: 3, pick_finish: 3, poke_pressure: 4 },
  Vi: { fight_reach: 4, pick_isolate: 4, pick_finish: 2 },
  Ahri: { pick_find: 4, pick_isolate: 3, pick_finish: 3, space_force: 2 },
  Braum: { protect_position: 3, protect_peel: 4, protect_recover: 2, space_hold: 2 },
  Kennen: { fight_start: 3, fight_follow: 3, space_force: 3 },
  Gnar: { fight_start: 2, space_hold: 3, space_force: 3, pick_finish: 2 },
  Alistar: { fight_start: 4, protect_peel: 3, space_hold: 2 },
  "Kai'Sa": { fight_follow: 3, fight_reach: 2, pick_finish: 3, scale_convert: 3 },
  Fiora: { split_threat: 4, split_escape: 3, scale_safe: 2, scale_close: 3 },
  Jax: { split_threat: 4, split_escape: 2, scale_safe: 3, scale_close: 3 },
  Ezreal: { poke_pressure: 4, protect_position: 2, space_force: 2, scale_safe: 2 },
};

export const FALLBACK_CHAMPIONS = [
  ["Aatrox","Aatrox","Fighter"],["Ahri","Ahri","Mage","Assassin"],["Alistar","Alistar","Tank","Support"],["Ashe","Ashe","Marksman","Support"],
  ["Azir","Azir","Mage","Marksman"],["Braum","Braum","Tank","Support"],["Ezreal","Ezreal","Marksman","Mage"],["Fiora","Fiora","Fighter","Assassin"],
  ["Gnar","Gnar","Fighter","Tank"],["Jax","Jax","Fighter"],["Jayce","Jayce","Fighter","Marksman"],["Jinx","Jinx","Marksman"],
  ["Kaisa","Kai'Sa","Marksman"],["Kennen","Kennen","Mage","Fighter"],["Lulu","Lulu","Support","Mage"],["Maokai","Maokai","Tank","Support"],
  ["Milio","Milio","Support","Mage"],["Nautilus","Nautilus","Tank","Support"],["Orianna","Orianna","Mage","Support"],["Ornn","Ornn","Tank","Fighter"],
  ["Rakan","Rakan","Support"],["Sejuani","Sejuani","Tank","Fighter"],["Varus","Varus","Marksman","Mage"],["Vi","Vi","Fighter","Assassin"]
].map((x) => ({
  id: x[0],
  name: x[1],
  tags: x.slice(2),
  image: `${IMG_ROOT}${x[0]}.png`,
}));
