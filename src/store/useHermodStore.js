import { create } from "zustand";
import { DATA_DRAGON_VERSION } from "../data.jsx";
import { draftController } from "../domain/draftController.js";
import { rosterController } from "../domain/rosterController.js";

const initialDraft = {
  blue: [],
  red: [],
  blueBans: [],
  redBans: [],
  history: [],
};

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
  setActivePaidHoverId: (activePaidHoverId) =>
    set((state) => ({
      activePaidHoverId:
        typeof activePaidHoverId === "function"
          ? activePaidHoverId(state.activePaidHoverId)
          : activePaidHoverId,
    })),
  setCheckoutContext: (checkoutContext) => set({ checkoutContext }),

  removeBan: (side, index) => {
    const next = draftController.removeBan({ draft: get().draft, side, index });
    if (next) set(next);
  },

  loadRoster: async () => {
    const roster = await rosterController.loadRoster();
    set(roster);
    return () => undefined;
  },

  commitPreview: () => {
    const state = get();
    const next = draftController.commitPreview({
      draft: state.draft,
      preview: state.preview,
      phaseIndex: state.phaseIndex,
      phasePicks: state.phasePicks,
      activeBanSide: state.activeBanSide,
    });

    if (!next) return;

    set(next);
  },

  undoPhase: () => {
    const state = get();
    const next = draftController.undoPhase({
      draft: state.draft,
      phasePicks: state.phasePicks,
      phaseIndex: state.phaseIndex,
    });

    if (next) set(next);
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
