import { CURATED, DATA_DRAGON_VERSION, DATA_URL, FALLBACK_CHAMPIONS, IMG_ROOT } from "../data.jsx";

function hashName(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function inferCapabilities(champion) {
  if (CURATED[champion.name]) return CURATED[champion.name];

  const q = {};
  const tags = champion.tags || [];
  const h = hashName(champion.name);
  const add = (key, value) => {
    q[key] = Math.max(q[key] || 0, value);
  };

  if (tags.includes("Tank")) {
    add("fight_start", 3);
    add("protect_peel", 3);
    add("space_hold", 3);
  }
  if (tags.includes("Support")) {
    add("protect_position", 3);
    add("protect_peel", 3);
    add("protect_recover", 2);
  }
  if (tags.includes("Assassin")) {
    add("fight_reach", 3);
    add("pick_find", 3);
    add("pick_isolate", 3);
    add("pick_finish", 4);
  }
  if (tags.includes("Marksman")) {
    add("fight_follow", 3);
    add("scale_convert", 3);
    add("scale_safe", 2);
    add("poke_pressure", 2);
  }
  if (tags.includes("Mage")) {
    add("space_deny", 3);
    add("space_force", 3);
    add("fight_follow", 2);
    add("poke_pressure", 2);
  }
  if (tags.includes("Fighter")) {
    add("fight_start", 2);
    add("pick_finish", 3);
    add("split_threat", 3);
    add("split_escape", 2);
  }

  const extras = ["fight_reach", "space_hold", "pick_find", "scale_close", "protect_position"];
  add(extras[h % extras.length], 2 + (h % 2));

  return q;
}

export const rosterController = {
  async loadRoster() {
    try {
      const response = await fetch(DATA_URL, { mode: "cors" });
      if (!response.ok) throw new Error("Data Dragon unavailable");

      const json = await response.json();
      const loaded = Object.values(json.data)
        .map((champion) => ({
          id: champion.id,
          name: champion.name,
          tags: champion.tags || [],
          image: `${IMG_ROOT}${champion.image.full}`,
        }))
        .map((champion) => ({
          ...champion,
          capabilities: inferCapabilities(champion),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      return {
        champions: loaded,
        rosterNote: `${loaded.length} champions · Riot Data Dragon ${DATA_DRAGON_VERSION} · official square champion assets.`,
      };
    } catch {
      const loaded = FALLBACK_CHAMPIONS.map((champion) => ({
        ...champion,
        capabilities: inferCapabilities(champion),
      })).sort((a, b) => a.name.localeCompare(b.name));

      return {
        champions: loaded,
        rosterNote: `Offline fallback roster shown (${loaded.length} champions).`,
      };
    }
  },
};
