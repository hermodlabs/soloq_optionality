export function buildChampionMap(champions) {
  return new Map(champions.map((champion) => [champion.id, champion]));
}

export function getAnalysisState({ draft, preview, phase, phasePicks, activeBanSide }) {
  const state = {
    blue: [...draft.blue],
    red: [...draft.red],
    blueBans: [...draft.blueBans],
    redBans: [...draft.redBans],
  };

  if (!preview || !phase) return state;

  if (phase.type === "bans") {
    const key = activeBanSide === "blue" ? "blueBans" : "redBans";
    if (!state[key].includes(preview)) state[key].push(preview);
  } else if (phase.type === "pick" && !phasePicks.includes(preview)) {
    state[phase.side].push(preview);
  }

  return state;
}

export function getTeamIds({ side, state, phase, phasePicks }) {
  const ids = [...state[side]];
  if (phase?.type === "pick" && phase.side === side) ids.push(...phasePicks);
  return ids;
}

export function getCapabilityStrength(championMap, championId, requirementId) {
  return championMap.get(championId)?.capabilities?.[requirementId] || 0;
}

export function getProvidersFor({ requirementId, side, state, phase, phasePicks, championMap }) {
  return getTeamIds({ side, state, phase, phasePicks }).filter(
    (championId) => getCapabilityStrength(championMap, championId, requirementId) > 0
  );
}

export function getFutureIdsFor({ requirementId, state, phasePicks, champions, championMap }) {
  const blocked = new Set([
    ...state.blue,
    ...state.red,
    ...state.blueBans,
    ...state.redBans,
    ...phasePicks,
  ]);

  return champions
    .filter(
      (champion) =>
        !blocked.has(champion.id) &&
        getCapabilityStrength(championMap, champion.id, requirementId) > 0
    )
    .map((champion) => champion.id);
}

export function getStrategyInfo({ strategy, side, state, phase, phasePicks, champions, championMap }) {
  const current = strategy.requirements.filter(
    (requirementId) => getProvidersFor({ requirementId, side, state, phase, phasePicks, championMap }).length > 0
  );

  const missing = strategy.requirements.filter(
    (requirementId) => getProvidersFor({ requirementId, side, state, phase, phasePicks, championMap }).length === 0
  );

  const support = Math.round(
    strategy.requirements.reduce((sum, requirementId) => {
      const maxStrength = getProvidersFor({ requirementId, side, state, phase, phasePicks, championMap }).reduce(
        (max, championId) => Math.max(max, getCapabilityStrength(championMap, championId, requirementId)),
        0
      );
      return sum + Math.min(4, maxStrength);
    }, 0) /
      (strategy.requirements.length * 4) *
      100
  );

  const redundant = strategy.requirements.filter(
    (requirementId) => getProvidersFor({ requirementId, side, state, phase, phasePicks, championMap }).length >= 2
  ).length;

  const single = strategy.requirements.filter(
    (requirementId) => getProvidersFor({ requirementId, side, state, phase, phasePicks, championMap }).length === 1
  ).length;

  const candidateBreadth = new Set(
    missing.flatMap((requirementId) =>
      getFutureIdsFor({ requirementId, state, phasePicks, champions, championMap })
    )
  ).size;

  let option = "OPEN";

  if (missing.length === 0) {
    option = "ACTIVE";
  } else if (missing.some((requirementId) => getFutureIdsFor({ requirementId, state, phasePicks, champions, championMap }).length === 0)) {
    option = "CLOSED";
  } else if (missing.some((requirementId) => getFutureIdsFor({ requirementId, state, phasePicks, champions, championMap }).length <= 2)) {
    option = "CONSTRAINED";
  } else if (current.length > 0) {
    option = "EMERGING";
  }

  const realizability = Math.round(support * 0.82 + (current.length / strategy.requirements.length) * 18);

  return {
    current,
    missing,
    support,
    redundant,
    single,
    candidateBreadth,
    option,
    realizability,
  };
}

export function getLensInfo({ strategy, side, state, lens, phase, phasePicks, champions, championMap }) {
  const info = getStrategyInfo({ strategy, side, state, phase, phasePicks, champions, championMap });

  if (lens === "objective") {
    return {
      main: `${info.current.length}/${strategy.requirements.length}`,
      label: "requirements covered",
      status:
        info.current.length === strategy.requirements.length
          ? "COVERED"
          : info.current.length
            ? "PARTIAL"
            : "GAP",
    };
  }

  if (lens === "realizability") {
    return {
      main: `${info.realizability}%`,
      label: "illustrative execution fit",
      status:
        info.realizability >= 70 ? "STRONG" : info.realizability >= 40 ? "BURDENED" : "LOW",
    };
  }

  if (lens === "robustness") {
    return {
      main: `${info.redundant}R · ${info.single}S`,
      label: "redundant / single points",
      status: info.missing.length ? "EXPOSED" : info.redundant >= 2 ? "ROBUST" : "FRAGILE",
    };
  }

  return {
    main: info.option,
    label: `${info.candidateBreadth} candidate breadth`,
    status: info.option,
  };
}

export function getStatusClass(status) {
  if (["COVERED", "STRONG", "ROBUST", "ACTIVE"].includes(status)) return "good";
  if (["GAP", "LOW", "EXPOSED", "CLOSED"].includes(status)) return "bad";
  if (["PARTIAL", "BURDENED", "FRAGILE", "CONSTRAINED"].includes(status)) return "warn";
  return "";
}

export function getStrategyDiff({ strategy, analysisSide, preview, lens, draft, phase, phasePicks, activeBanSide, champions, championMap }) {
  if (!preview) {
    return { text: "Click a champion to preview the diff.", className: "same" };
  }

  const beforeState = getAnalysisState({ draft, preview: null, phase, phasePicks, activeBanSide });
  const afterState = getAnalysisState({ draft, preview, phase, phasePicks, activeBanSide });

  const before = getStrategyInfo({ strategy, side: analysisSide, state: beforeState, phase, phasePicks, champions, championMap });
  const after = getStrategyInfo({ strategy, side: analysisSide, state: afterState, phase, phasePicks, champions, championMap });

  if (lens === "objective") {
    if (before.current.length === after.current.length) {
      return { text: "No coverage change", className: "same" };
    }

    return {
      text: `${before.current.length}/${strategy.requirements.length} → ${after.current.length}/${strategy.requirements.length} covered`,
      className: after.current.length > before.current.length ? "add" : "remove",
    };
  }

  if (lens === "realizability") {
    if (before.realizability === after.realizability) {
      return { text: "No realizability change", className: "same" };
    }

    return {
      text: `${before.realizability}% → ${after.realizability}% realizability`,
      className: after.realizability > before.realizability ? "add" : "remove",
    };
  }

  if (lens === "robustness") {
    if (before.redundant === after.redundant && before.single === after.single) {
      return { text: "No robustness change", className: "same" };
    }

    return {
      text: `redundant ${before.redundant}→${after.redundant} · single ${before.single}→${after.single}`,
      className: after.redundant > before.redundant ? "add" : "same",
    };
  }

  if (before.option === after.option && before.candidateBreadth === after.candidateBreadth) {
    return { text: "No optionality change", className: "same" };
  }

  return {
    text: `${before.option} → ${after.option} · breadth ${before.candidateBreadth}→${after.candidateBreadth}`,
    className: after.option === "CLOSED" ? "remove" : "add",
  };
}

export function getMetricCards({ allStrategies, lens, analysisSide = "blue", beforeState, afterState, phase, phasePicks, champions, championMap }) {
  const before = allStrategies.map((strategy) =>
    getStrategyInfo({ strategy, side: analysisSide, state: beforeState, phase, phasePicks, champions, championMap })
  );
  const after = allStrategies.map((strategy) =>
    getStrategyInfo({ strategy, side: analysisSide, state: afterState, phase, phasePicks, champions, championMap })
  );

  if (lens === "objective") {
    const average = (items) =>
      Math.round(
        items.reduce(
          (sum, item, index) => sum + item.current.length / allStrategies[index].requirements.length,
          0
        ) /
          allStrategies.length *
          100
      );

    return [
      ["Average coverage", `${average(before)}%`, `${average(after)}%`, "average_coverage"],
      ["Covered", before.filter((item, index) => item.current.length === allStrategies[index].requirements.length).length, after.filter((item, index) => item.current.length === allStrategies[index].requirements.length).length, "covered"],
      ["Partial", before.filter((item, index) => item.current.length > 0 && item.current.length < allStrategies[index].requirements.length).length, after.filter((item, index) => item.current.length > 0 && item.current.length < allStrategies[index].requirements.length).length, "partial"],
      ["Gaps", before.filter((item) => item.current.length === 0).length, after.filter((item) => item.current.length === 0).length, "gaps"],
    ];
  }

  if (lens === "realizability") {
    const average = (items) => Math.round(items.reduce((sum, item) => sum + item.realizability, 0) / items.length);

    return [
      ["Average fit", `${average(before)}%`, `${average(after)}%`, "average_fit"],
      ["Strong", before.filter((item) => item.realizability >= 70).length, after.filter((item) => item.realizability >= 70).length, "strong"],
      ["Burdened", before.filter((item) => item.realizability >= 40 && item.realizability < 70).length, after.filter((item) => item.realizability >= 40 && item.realizability < 70).length, "burdened"],
      ["Low", before.filter((item) => item.realizability < 40).length, after.filter((item) => item.realizability < 40).length, "low"],
    ];
  }

  if (lens === "robustness") {
    return [
      ["Redundant", before.reduce((sum, item) => sum + item.redundant, 0), after.reduce((sum, item) => sum + item.redundant, 0), "redundant"],
      ["Single points", before.reduce((sum, item) => sum + item.single, 0), after.reduce((sum, item) => sum + item.single, 0), "single_points"],
      ["Exposed", before.filter((item) => item.missing.length > 0).length, after.filter((item) => item.missing.length > 0).length, "exposed"],
      ["Complete", before.filter((item) => item.missing.length === 0).length, after.filter((item) => item.missing.length === 0).length, "complete"],
    ];
  }

  return [
    ["Open / emerging", before.filter((item) => ["OPEN", "EMERGING"].includes(item.option)).length, after.filter((item) => ["OPEN", "EMERGING"].includes(item.option)).length, "open_emerging"],
    ["Active", before.filter((item) => item.option === "ACTIVE").length, after.filter((item) => item.option === "ACTIVE").length, "active"],
    ["Constrained", before.filter((item) => item.option === "CONSTRAINED").length, after.filter((item) => item.option === "CONSTRAINED").length, "constrained"],
    ["Closed", before.filter((item) => item.option === "CLOSED").length, after.filter((item) => item.option === "CLOSED").length, "closed"],
  ];
}

export function getRequirementState({ requirementId, state, analysisSide, lens, phase, phasePicks, champions, championMap }) {
  const currentProviders = getProvidersFor({ requirementId, side: analysisSide, state, phase, phasePicks, championMap });

  if (lens === "objective") {
    return {
      label: currentProviders.length ? "COVERED" : "GAP",
      className: currentProviders.length ? "good" : "bad",
      note: currentProviders.length
        ? `${currentProviders.length} current provider${currentProviders.length === 1 ? "" : "s"}`
        : "No current provider",
    };
  }

  if (lens === "realizability") {
    const strength = currentProviders.reduce(
      (max, championId) => Math.max(max, getCapabilityStrength(championMap, championId, requirementId)),
      0
    );
    const value = Math.round((strength / 4) * 85 + (currentProviders.length ? 15 : 0));

    return {
      label: value >= 75 ? "STRONG" : value ? "BURDENED" : "UNREALIZED",
      className: value >= 75 ? "good" : value ? "warn" : "bad",
      note: value ? `${value}% illustrative execution fit` : "No current provider",
    };
  }

  if (lens === "robustness") {
    if (currentProviders.length >= 2) {
      return {
        label: "REDUNDANT",
        className: "good",
        note: `${currentProviders.length} current providers`,
      };
    }
    if (currentProviders.length === 1) {
      return {
        label: "SINGLE POINT",
        className: "warn",
        note: "One current provider",
      };
    }
    return { label: "GAP", className: "bad", note: "No current provider" };
  }

  const futureCount = getFutureIdsFor({ requirementId, state, phasePicks, champions, championMap }).length;

  if (currentProviders.length >= 2) {
    return { label: "REDUNDANT", className: "good", note: "Multiple current providers" };
  }

  if (currentProviders.length === 1) {
    return {
      label: futureCount ? "ANCHORED" : "LOCKED",
      className: futureCount ? "" : "warn",
      note: futureCount ? "Future alternatives still exist" : "No future alternative",
    };
  }

  return futureCount
    ? { label: "OPEN", className: "good", note: "Requirement remains open" }
    : { label: "CLOSED", className: "bad", note: "No remaining route" };
}

export function filterChampions({ champions, search, roleFilter }) {
  const query = search.trim().toLowerCase();

  return champions.filter((champion) => {
    const roleMatches = roleFilter === "All" || champion.tags.includes(roleFilter);
    const searchMatches =
      !query ||
      champion.name.toLowerCase().includes(query) ||
      champion.tags.join(" ").toLowerCase().includes(query);

    return roleMatches && searchMatches;
  });
}

export function getLensSpace(lens) {
  return {
    objective: [
      "Strategy Coverage Space",
      "How much of each named strategy is currently supported?",
      "strategy_coverage_space",
    ],
    realizability: [
      "Strategy Realizability Space",
      "How executable is the support that currently exists?",
      "strategy_realizability_space",
    ],
    robustness: [
      "Strategy Robustness Space",
      "Where does each strategy have redundancy, concentration, or gaps?",
      "strategy_robustness_space",
    ],
    optionality: [
      "Strategy Option Space",
      "Which strategic architectures remain open as the draft evolves?",
      "strategy_option_space",
    ],
  }[lens];
}
