import { PHASES } from "../data.jsx";

export const draftController = {
  getCurrentPhase(phaseIndex) {
    return PHASES[phaseIndex] || null;
  },

  getAnalysisState({ draft, preview, phase, phasePicks, activeBanSide }) {
    const state = {
      blue: [...draft.blue],
      red: [...draft.red],
      blueBans: [...draft.blueBans],
      redBans: [...draft.redBans],
    };

    if (!preview || !phase) return state;

    if (phase.type === "bans") {
      const key = activeBanSide === "blue" ? "blueBans" : "redBans";
      if (
        !state[key].includes(preview) &&
        !state.blueBans.includes(preview) &&
        !state.redBans.includes(preview)
      ) {
        state[key].push(preview);
      }
    } else if (phase.type === "pick" && !phasePicks.includes(preview)) {
      state[phase.side].push(preview);
    }

    return state;
  },

  isChampionUnavailable({ championId, draft, phase, phasePicks, activeBanSide, usedSet, bannedSet }) {
    if (!phase) return true;

    if (phase.type === "bans") {
      const currentBans = activeBanSide === "blue" ? draft.blueBans : draft.redBans;
      return (
        currentBans.length >= 5 ||
        currentBans.includes(championId) ||
        bannedSet.has(championId)
      );
    }

    return usedSet.has(championId) || bannedSet.has(championId) || phasePicks.includes(championId);
  },

  commitPreview({ draft, preview, phaseIndex, phasePicks, activeBanSide }) {
    const phase = PHASES[phaseIndex] || null;
    if (!preview || !phase) return null;

    if (phase.type === "bans") {
      const key = activeBanSide === "blue" ? "blueBans" : "redBans";

      if (
        draft[key].length >= 5 ||
        draft[key].includes(preview) ||
        draft.blueBans.includes(preview) ||
        draft.redBans.includes(preview)
      ) {
        return null;
      }

      const nextDraft = {
        ...draft,
        [key]: [...draft[key], preview],
      };

      let nextBanSide = activeBanSide;
      if (nextDraft[key].length === 5) {
        const other = activeBanSide === "blue" ? "red" : "blue";
        const otherKey = other === "blue" ? "blueBans" : "redBans";
        if (nextDraft[otherKey].length < 5) nextBanSide = other;
      }

      if (nextDraft.blueBans.length === 5 && nextDraft.redBans.length === 5) {
        return {
          draft: {
            ...nextDraft,
            history: [
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
            ],
          },
          activeBanSide: nextBanSide,
          preview: null,
          phaseIndex: 1,
          analysisSide: "blue",
        };
      }

      return {
        draft: nextDraft,
        activeBanSide: nextBanSide,
        preview: null,
      };
    }

    const staged = [...phasePicks, preview];

    if (staged.length === phase.slots.length) {
      const snapshot = {
        blue: [...draft.blue],
        red: [...draft.red],
        blueBans: [...draft.blueBans],
        redBans: [...draft.redBans],
      };

      return {
        draft: {
          ...draft,
          [phase.side]: [...draft[phase.side], ...staged],
          history: [
            ...draft.history,
            {
              phase: phaseIndex,
              snapshot,
            },
          ],
        },
        phasePicks: [],
        preview: null,
        phaseIndex: phaseIndex + 1,
        analysisSide: PHASES[phaseIndex + 1]?.type === "pick" ? PHASES[phaseIndex + 1].side : "blue",
      };
    }

    return {
      phasePicks: staged,
      preview: null,
    };
  },

  undoPhase({ draft, phasePicks, phaseIndex }) {
    if (phasePicks.length > 0) {
      return {
        phasePicks: phasePicks.slice(0, -1),
        preview: null,
      };
    }

    const last = draft.history[draft.history.length - 1];
    if (!last) return null;

    const nextDraft = {
      blue: [...last.snapshot.blue],
      red: [...last.snapshot.red],
      blueBans: [...last.snapshot.blueBans],
      redBans: [...last.snapshot.redBans],
      history: draft.history.slice(0, -1),
    };

    const restored = PHASES[last.phase];

    return {
      draft: nextDraft,
      phaseIndex: last.phase,
      phasePicks: [],
      preview: null,
      analysisSide: restored?.type === "pick" ? restored.side : "blue",
    };
  },

  removeBan({ draft, side, index }) {
    const key = side === "blue" ? "blueBans" : "redBans";

    return {
      draft: {
        ...draft,
        [key]: (side === "blue" ? draft.blueBans : draft.redBans).filter((_, itemIndex) => itemIndex !== index),
      },
      activeBanSide: side,
      preview: null,
    };
  },
};
