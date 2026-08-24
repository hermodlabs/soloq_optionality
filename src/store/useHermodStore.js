import { create } from "zustand";
import {
  CURATED,
  DATA_DRAGON_VERSION,
  DATA_URL,
  FALLBACK_CHAMPIONS,
  IMG_ROOT,
  PHASES,
} from "../data.jsx";

const initialDraft = {
  blue: [],
  red: [],
  blueBans: [],
  redBans: [],
  history: [],
};

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

  const extras = [
    "fight_reach",
    "space_hold",
    "pick_find",
    "scale_close",
    "protect_position",
  ];
  add(extras[h % extras.length], 2 + (h % 2));

  return q;
}

export const useHermodStore = create((set, get) => ({
  champions: [],
  rosterNote: `Loading Riot Data Dragon ${DATA_DRAGON_VERSION}…`,

  phaseIndex: 0,
  preview: null,
  activeBanSide: "blue",
  phasePicks: [],

  draft: initialDraft,

  lens: "objective",
  analysisSide: "blue",
  selectedStrategyId: "front",

  roleFilter: "All",
  search: "",

  activePaidHoverId: null,
  checkoutContext: null,

  setSearch: (search) => set({ search }),
  setRoleFilter: (roleFilter) => set({ roleFilter }),
  setLens: (lens) => set({ lens }),
  setAnalysisSide: (analysisSide) => set({ analysisSide }),
  setSelectedStrategyId: (selectedStrategyId) => set({ selectedStrategyId }),
  setPreview: (preview) => set({ preview }),
  setActiveBanSide: (activeBanSide) => set({ activeBanSide }),
  setActivePaidHoverId: (activePaidHoverId) => set({ activePaidHoverId }),
  setCheckoutContext: (checkoutContext) => set({ checkoutContext }),

  removeBan: (side, index) =>
    set((state) => ({
      draft: {
        ...state.draft,
        [side === "blue" ? "blueBans" : "redBans"]: (
          side === "blue" ? state.draft.blueBans : state.draft.redBans
        ).filter((_, itemIndex) => itemIndex !== index),
      },
      activeBanSide: side,
      preview: null,
    })),

  loadRoster: async () => {
    let live = true;

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

      if (live) {
        set({
          champions: loaded,
          rosterNote: `${loaded.length} champions · Riot Data Dragon ${DATA_DRAGON_VERSION} · official square champion assets.`,
        });
      }
    } catch {
      const loaded = FALLBACK_CHAMPIONS.map((champion) => ({
        ...champion,
        capabilities: inferCapabilities(champion),
      })).sort((a, b) => a.name.localeCompare(b.name));

      if (live) {
        set({
          champions: loaded,
          rosterNote: `Offline fallback roster shown (${loaded.length} champions).`,
        });
      }
    }

    return () => {
      live = false;
    };
  },

  commitPreview: () => {
    const state = get();
    const { preview, phaseIndex, phasePicks, draft, activeBanSide } = state;
    const phase = PHASES[phaseIndex] || null;

    if (!preview || !phase) return;

    if (phase.type === "bans") {
      const key = activeBanSide === "blue" ? "blueBans" : "redBans";

      if (draft[key].length >= 5 || draft[key].includes(preview)) {
        return;
      }

      const nextDraft = {
        ...draft,
        [key]: [...draft[key], preview],
      };

      let nextBanSide = activeBanSide;

      if (nextDraft[key].length === 5) {
        const other = activeBanSide === "blue" ? "red" : "blue";
        const otherKey = other === "blue" ? "blueBans" : "redBans";

        if (nextDraft[otherKey].length < 5) {
          nextBanSide = other;
        }
      }

      if (nextDraft.blueBans.length === 5 && nextDraft.redBans.length === 5) {
        nextDraft.history = [
          ...nextDraft.history,
          {
            phase: 0,
            snapshot: {
              blue: [],
              red: [],
              blueBans: [...nextDraft.blueBans],
              redBans: [...nextDraft.redBans],
            },
          },
        ];

        set({
          draft: nextDraft,
          activeBanSide: nextBanSide,
          preview: null,
          phaseIndex: 1,
          analysisSide: "blue",
        });
        return;
      }

      set({
        draft: nextDraft,
        activeBanSide: nextBanSide,
        preview: null,
      });
      return;
    }

    const staged = [...phasePicks, preview];
    set({ preview: null });

    if (staged.length === phase.slots.length) {
      const snapshot = {
        blue: [...draft.blue],
        red: [...draft.red],
        blueBans: [...draft.blueBans],
        redBans: [...draft.redBans],
      };

      set((current) => ({
        draft: {
          ...current.draft,
          [phase.side]: [...current.draft[phase.side], ...staged],
          history: [
            ...current.draft.history,
            {
              phase: current.phaseIndex,
              snapshot,
            },
          ],
        },
        phasePicks: [],
        phaseIndex: current.phaseIndex + 1,
        analysisSide:
          PHASES[current.phaseIndex + 1]?.type === "pick"
            ? PHASES[current.phaseIndex + 1].side
            : current.analysisSide,
      }));
    } else {
      set({ phasePicks: staged });
    }
  },

  undoPhase: () => {
    const state = get();
    const { phasePicks, draft, phaseIndex } = state;

    if (phasePicks.length > 0) {
      set({ phasePicks: phasePicks.slice(0, -1), preview: null });
      return;
    }

    const last = draft.history[draft.history.length - 1];
    if (!last) return;

    const nextDraft = {
      blue: [...last.snapshot.blue],
      red: [...last.snapshot.red],
      blueBans: [...last.snapshot.blueBans],
      redBans: [...last.snapshot.redBans],
      history: draft.history.slice(0, -1),
    };

    set({
      draft: nextDraft,
      phaseIndex: last.phase,
      phasePicks: [],
      preview: null,
    });

    const restored = PHASES[last.phase];
    if (restored?.type === "pick") {
      set({ analysisSide: restored.side });
    }
  },

  restart: () =>
    set({
      draft: initialDraft,
      phaseIndex: 0,
      preview: null,
      activeBanSide: "blue",
      phasePicks: [],
      lens: "objective",
      analysisSide: "blue",
      selectedStrategyId: "front",
      activePaidHoverId: null,
      checkoutContext: null,
    }),
}));
