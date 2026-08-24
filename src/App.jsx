import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  HERMOD_CHECKOUT_MODAL,
  HERMOD_HELP,
  HERMOD_PROVIDER_PAID_HOVER,
  HERMOD_UI_CONFIG,
} from "./config.jsx";
import { FAMILIES, PHASES, REQUIREMENTS } from "./data.jsx";
import { useHermodStore } from "./store/useHermodStore.js";

import HelpIcon from "./component/HelpIcon/HelpIcon.jsx";
import PaidHoverCard from "./component/PaidHoverCard/PaidHoverCard.jsx";
import PaidHoverHost from "./component/PaidHoverHost/PaidHoverHost.jsx";
import CheckoutModal from "./component/CheckoutModal/CheckoutModal.jsx";

const ROLE_FILTERS = ["All", "Tank", "Fighter", "Assassin", "Mage", "Marksman", "Support"];


function App() {
  const {
    champions,
    rosterNote,
    phaseIndex,
    preview,
    activeBanSide,
    phasePicks,
    draft,
    lens,
    analysisSide,
    selectedStrategyId,
    roleFilter,
    search,
    activePaidHoverId,
    checkoutContext,
    setRoleFilter,
    setSearch,
    setLens,
    setAnalysisSide,
    setSelectedStrategyId,
    setPreview,
    setActiveBanSide,
    setActivePaidHoverId,
    setCheckoutContext,
    commitPreview,
    undoPhase,
    restart,
    removeBan,
    loadRoster,
  } = useHermodStore();

  useEffect(() => {
    loadRoster();
  }, [loadRoster]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && checkoutContext) {
        setCheckoutContext(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [checkoutContext, setCheckoutContext]);

  const championMap = useMemo(
    () => new Map(champions.map((champion) => [champion.id, champion])),
    [champions]
  );

  const allStrategies = useMemo(
    () =>
      FAMILIES.flatMap((family) =>
        family.strategies.map((strategy) => ({ ...strategy, family: family.name }))
      ),
    []
  );

  const phase = PHASES[phaseIndex] || null;
  const selectedStrategy =
    allStrategies.find((strategy) => strategy.id === selectedStrategyId) || allStrategies[0];

  const usedSet = useMemo(
    () => new Set([...draft.blue, ...draft.red]),
    [draft.blue, draft.red]
  );

  const bannedSet = useMemo(
    () => new Set([...draft.blueBans, ...draft.redBans]),
    [draft.blueBans, draft.redBans]
  );

  const capabilityStrength = (championId, requirementId) =>
    championMap.get(championId)?.capabilities?.[requirementId] || 0;

  const getAnalysisState = (withPreview) => {
    const state = {
      blue: [...draft.blue],
      red: [...draft.red],
      blueBans: [...draft.blueBans],
      redBans: [...draft.redBans],
    };

    if (!withPreview || !preview || !phase) return state;

    if (phase.type === "bans") {
      const key = activeBanSide === "blue" ? "blueBans" : "redBans";
      if (!state[key].includes(preview)) {
        state[key].push(preview);
      }
    } else if (phase.type === "pick" && !phasePicks.includes(preview)) {
      state[phase.side].push(preview);
    }

    return state;
  };

  const teamIds = (side, state) => {
    const ids = [...state[side]];
    if (phase?.type === "pick" && phase.side === side) {
      ids.push(...phasePicks);
    }
    return ids;
  };

  const providersFor = (requirementId, side, state) =>
    teamIds(side, state).filter(
      (championId) => capabilityStrength(championId, requirementId) > 0
    );

  const futureIdsFor = (requirementId, state) => {
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
          !blocked.has(champion.id) && capabilityStrength(champion.id, requirementId) > 0
      )
      .map((champion) => champion.id);
  };

  const getStrategyInfo = (strategy, side, state) => {
    const current = strategy.requirements.filter(
      (requirementId) => providersFor(requirementId, side, state).length > 0
    );

    const missing = strategy.requirements.filter(
      (requirementId) => providersFor(requirementId, side, state).length === 0
    );

    const support = Math.round(
      strategy.requirements.reduce((sum, requirementId) => {
        const maxStrength = providersFor(requirementId, side, state).reduce(
          (max, championId) => Math.max(max, capabilityStrength(championId, requirementId)),
          0
        );
        return sum + Math.min(4, maxStrength);
      }, 0) /
        (strategy.requirements.length * 4) *
        100
    );

    const redundant = strategy.requirements.filter(
      (requirementId) => providersFor(requirementId, side, state).length >= 2
    ).length;

    const single = strategy.requirements.filter(
      (requirementId) => providersFor(requirementId, side, state).length === 1
    ).length;

    const candidateBreadth = new Set(
      missing.flatMap((requirementId) => futureIdsFor(requirementId, state))
    ).size;

    let option = "OPEN";

    if (missing.length === 0) {
      option = "ACTIVE";
    } else if (
      missing.some((requirementId) => futureIdsFor(requirementId, state).length === 0)
    ) {
      option = "CLOSED";
    } else if (
      missing.some((requirementId) => futureIdsFor(requirementId, state).length <= 2)
    ) {
      option = "CONSTRAINED";
    } else if (current.length > 0) {
      option = "EMERGING";
    }

    const realizability = Math.round(
      support * 0.82 + (current.length / strategy.requirements.length) * 18
    );

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
  };

  const getLensInfo = (strategy, side, state) => {
    const info = getStrategyInfo(strategy, side, state);

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
        status:
          info.missing.length ? "EXPOSED" : info.redundant >= 2 ? "ROBUST" : "FRAGILE",
      };
    }

    return {
      main: info.option,
      label: `${info.candidateBreadth} candidate breadth`,
      status: info.option,
    };
  };

  const statusClass = (status) => {
    if (["COVERED", "STRONG", "ROBUST", "ACTIVE"].includes(status)) return "good";
    if (["GAP", "LOW", "EXPOSED", "CLOSED"].includes(status)) return "bad";
    if (["PARTIAL", "BURDENED", "FRAGILE", "CONSTRAINED"].includes(status)) return "warn";
    return "";
  };

  const getStrategyDiff = (strategy) => {
    if (!preview) {
      return { text: "Click a champion to preview the diff.", className: "same" };
    }

    const before = getStrategyInfo(strategy, analysisSide, getAnalysisState(false));
    const after = getStrategyInfo(strategy, analysisSide, getAnalysisState(true));

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
  };

  const isUnavailable = (champion) => {
    if (!phase) return true;
    if (phase.type === "bans") {
      const currentBans = activeBanSide === "blue" ? draft.blueBans : draft.redBans;
      return currentBans.length >= 5 || currentBans.includes(champion.id);
    }
    return usedSet.has(champion.id) || bannedSet.has(champion.id) || phasePicks.includes(champion.id);
  };

  const filteredChampions = champions.filter((champion) => {
    const query = search.trim().toLowerCase();
    const roleMatches = roleFilter === "All" || champion.tags.includes(roleFilter);
    const searchMatches =
      !query ||
      champion.name.toLowerCase().includes(query) ||
      champion.tags.join(" ").toLowerCase().includes(query);
    return roleMatches && searchMatches;
  });

  const lensSpace = {
    objective: ["Strategy Coverage Space", "How much of each named strategy is currently supported?", "strategy_coverage_space"],
    realizability: ["Strategy Realizability Space", "How executable is the support that currently exists?", "strategy_realizability_space"],
    robustness: ["Strategy Robustness Space", "Where does each strategy have redundancy, concentration, or gaps?", "strategy_robustness_space"],
    optionality: ["Strategy Option Space", "Which strategic architectures remain open as the draft evolves?", "strategy_option_space"],
  }[lens];

  const beforeState = getAnalysisState(false);
  const afterState = getAnalysisState(true);

  const selectedLensInfo = getLensInfo(selectedStrategy, analysisSide, beforeState);

  const metricCards = (() => {
    const before = allStrategies.map((strategy) => getStrategyInfo(strategy, analysisSide, beforeState));
    const after = allStrategies.map((strategy) => getStrategyInfo(strategy, analysisSide, afterState));

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
      const average = (items) =>
        Math.round(items.reduce((sum, item) => sum + item.realizability, 0) / items.length);

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
  })();

  const requirementState = (requirementId, state) => {
    const currentProviders = providersFor(requirementId, analysisSide, state);

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
        (max, championId) => Math.max(max, capabilityStrength(championId, requirementId)),
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

    const futureCount = futureIdsFor(requirementId, state).length;

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
  };

  const renderPickSlots = (side) => {
    const locked = draft[side];
    const staged = phase?.type === "pick" && phase.side === side ? phasePicks : [];
    const previewForSide = phase?.type === "pick" && phase.side === side ? preview : null;

    return Array.from({ length: 5 }, (_, index) => {
      const championId = locked[index] || staged[index - locked.length] || null;
      const isStaged = !locked[index] && Boolean(championId);
      const isPreview = !championId && previewForSide && index === locked.length + staged.length;

      if (championId) {
        const champion = championMap.get(championId);
        const kind = isStaged ? "previewPick" : "pick";

        return (
          <PaidHoverHost
            key={`${side}-${index}-${championId}`}
            id={`pick-${side}-${index}-${championId}`}
            className={`pick-slot ${isStaged ? "preview" : ""}`}
            activePaidHoverId={activePaidHoverId}
            setActivePaidHoverId={setActivePaidHoverId}
            card={
              <PaidHoverCard
                kind={kind}
                championName={champion?.name || championId}
                onOpenCheckout={setCheckoutContext}
              />
            }
          >
            <img src={champion?.image} alt="" />
            <span className="meta">
              <strong>{isStaged ? "+ " : ""}{champion?.name || championId}</strong>
              <small>{isStaged ? "Current phase" : "Locked"}</small>
            </span>
          </PaidHoverHost>
        );
      }

      if (isPreview) {
        const champion = championMap.get(previewForSide);
        return (
          <PaidHoverHost
            key={`${side}-${index}-preview-${previewForSide}`}
            id={`pick-${side}-${index}-preview-${previewForSide}`}
            className="pick-slot preview"
            activePaidHoverId={activePaidHoverId}
            setActivePaidHoverId={setActivePaidHoverId}
            card={
              <PaidHoverCard
                kind="previewPick"
                championName={champion?.name || previewForSide}
                onOpenCheckout={setCheckoutContext}
              />
            }
          >
            <img src={champion?.image} alt="" />
            <span className="meta">
              <strong>± {champion?.name || previewForSide}</strong>
              <small>Jenga preview</small>
            </span>
          </PaidHoverHost>
        );
      }

      return (
        <span key={`${side}-${index}-empty`} className="pick-slot empty">
          Open {side === "blue" ? "B" : "R"}{index + 1}
        </span>
      );
    });
  };

  const renderBanSlots = (side) => {
    const ids = side === "blue" ? draft.blueBans : draft.redBans;
    const previewForSide = phase?.type === "bans" && activeBanSide === side ? preview : null;

    return Array.from({ length: 5 }, (_, index) => {
      const championId = ids[index];
      const isPreview = !championId && previewForSide && index === ids.length;

      if (championId) {
        const champion = championMap.get(championId);
        return (
          <PaidHoverHost
            key={`${side}-ban-${index}-${championId}`}
            id={`ban-${side}-${index}-${championId}`}
            className="ban-slot"
            activePaidHoverId={activePaidHoverId}
            setActivePaidHoverId={setActivePaidHoverId}
            card={
              <PaidHoverCard
                kind="ban"
                championName={champion?.name || championId}
                onOpenCheckout={setCheckoutContext}
              />
            }
          >
            <img src={champion?.image} alt="" />
            <strong>{champion?.name || championId}</strong>
            <button
              type="button"
              className="remove"
              aria-label={`Remove ${champion?.name || championId} ban`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                removeBan(side, index);
              }}
            >
              ×
            </button>
          </PaidHoverHost>
        );
      }

      if (isPreview) {
        const champion = championMap.get(previewForSide);
        return (
          <PaidHoverHost
            key={`${side}-ban-${index}-preview-${previewForSide}`}
            id={`ban-${side}-${index}-preview-${previewForSide}`}
            className="ban-slot preview"
            activePaidHoverId={activePaidHoverId}
            setActivePaidHoverId={setActivePaidHoverId}
            card={
              <PaidHoverCard
                kind="previewBan"
                championName={champion?.name || previewForSide}
                onOpenCheckout={setCheckoutContext}
              />
            }
          >
            <img src={champion?.image} alt="" />
            <strong>± {champion?.name || previewForSide}</strong>
          </PaidHoverHost>
        );
      }

      return <span key={`${side}-ban-${index}-empty`} className="ban-slot empty">Open</span>;
    });
  };

  const previewChampion = preview ? championMap.get(preview) : null;
  const centerPreviewKind = phase?.type === "bans" ? "previewBan" : "previewPick";

  return (
    <div className="shell">
      <header className="topbar">
        <div className="copy">
          <div className="eyebrow">Hermod · SoloQ Optionality Lab</div>
          <h1>Move one piece. See what the strategic space becomes.</h1>
          <p className="sub">
            This prototype is an exploration tool, not a “best pick” recommender. Click any available champion to stage a Jenga-piece preview, inspect the diff, then explicitly commit it.
          </p>
        </div>

        <div className="btn-row">
          <button type="button" className="btn" disabled={draft.history.length === 0 && phasePicks.length === 0} onClick={undoPhase}>
            Undo phase
          </button>
          <button type="button" className="btn danger" onClick={restart}>
            Restart draft
          </button>
        </div>
      </header>

      <section className="panel">
        <div className="draft-top">
          <div className="team blue">
            <div className="team-head">
              <span className="blue-text">BLUE PICKS</span>
              <span>{draft.blue.length} / 5</span>
            </div>
            <div className="pick-slots">{renderPickSlots("blue")}</div>
          </div>

          <div className="current-action">
            <div className="eyebrow">Current action</div>
            <div className="phase">
              {!phase ? "DRAFT COMPLETE" : phase.type === "bans" ? "SIMULTANEOUS BANS" : phase.label}
            </div>
            <div className="sub">
              {!phase
                ? "Explore the final strategic state below."
                : phase.type === "bans"
                  ? "Fill both teams' five blind bans."
                  : phase.slots.length === 2
                    ? `${phase.side === "blue" ? "Blue" : "Red"} has two consecutive picks in this phase · ${phasePicks.length}/2 selected`
                    : `${phase.side === "blue" ? "Blue" : "Red"} selects one champion`}
            </div>

            {previewChampion && (
              <PaidHoverHost
                id={`center-preview-${preview}`}
                className="preview-hero"
                activePaidHoverId={activePaidHoverId}
                setActivePaidHoverId={setActivePaidHoverId}
                card={
                  <PaidHoverCard
                    kind={centerPreviewKind}
                    championName={previewChampion.name}
                    onOpenCheckout={setCheckoutContext}
                  />
                }
              >
                <img src={previewChampion.image} alt="" />
                <span>
                  <strong>± {previewChampion.name}</strong>
                  <small>{phase?.type === "bans" ? "ban preview" : "pick preview"}</small>
                </span>
              </PaidHoverHost>
            )}
          </div>

          <div className="team red">
            <div className="team-head">
              <span className="red-text">RED PICKS</span>
              <span>{draft.red.length} / 5</span>
            </div>
            <div className="pick-slots">{renderPickSlots("red")}</div>
          </div>
        </div>

        <div className="bans-wrap">
          <div className="bans">
            <div>
              <div className="team-head">
                <span className="blue-text">BLUE BANS</span>
                <span>{draft.blueBans.length} / 5</span>
              </div>
              <div className="ban-side">{renderBanSlots("blue")}</div>
            </div>

            <div className="ban-center">
              <div className="eyebrow">10 simultaneous bans</div>
              <div className="sub">
                Currently filling {activeBanSide === "blue" ? "Blue" : "Red"} bans · Blue {draft.blueBans.length}/5 · Red {draft.redBans.length}/5
              </div>

              <div className="ban-toggle">
                <button
                  type="button"
                  className={`blue ${activeBanSide === "blue" ? "active" : ""}`}
                  disabled={phase?.type !== "bans"}
                  onClick={() => {
                    setActiveBanSide("blue");
                    setPreview(null);
                  }}
                >
                  Blue
                </button>
                <button
                  type="button"
                  className={`red ${activeBanSide === "red" ? "active" : ""}`}
                  disabled={phase?.type !== "bans"}
                  onClick={() => {
                    setActiveBanSide("red");
                    setPreview(null);
                  }}
                >
                  Red
                </button>
              </div>
            </div>

            <div>
              <div className="team-head">
                <span className="red-text">RED BANS</span>
                <span>{draft.redBans.length} / 5</span>
              </div>
              <div className="ban-side">{renderBanSlots("red")}</div>
            </div>
          </div>
        </div>

        <div className="timeline">
          {PHASES.map((item, index) => (
            <span
              key={item.id}
              className={`phase-chip ${index === phaseIndex ? "active" : index < phaseIndex ? "done" : ""}`}
            >
              {item.label}
            </span>
          ))}
        </div>
      </section>

      <div className="workspace">
        <main className="left">
          <section className="panel">
            <div className="section-head">
              <div>
                <div className="eyebrow">Champion selection area</div>
                <h2>
                  {phase?.type === "bans"
                    ? `Choose a champion to preview as a ${activeBanSide === "blue" ? "Blue" : "Red"} ban`
                    : `Choose a champion to preview for ${phase?.label || "the draft"}`}
                </h2>
                <p className="sub">
                  The full current roster loads from Riot Data Dragon. Selecting a portrait only previews the move.
                </p>
              </div>

              <div className="search-row">
                <input
                  className="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search champions…"
                />

                <div className="filters">
                  {ROLE_FILTERS.map((role) => (
                    <button
                      key={role}
                      type="button"
                      className={`filter ${roleFilter === role ? "active" : ""}`}
                      onClick={() => setRoleFilter(role)}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="champion-scroll">
              {champions.length === 0 && <div className="loading">Loading the current League roster…</div>}

              <div className="champ-grid">
                {filteredChampions.map((champion) => {
                  const unavailable = isUnavailable(champion);
                  const selectedTile = preview === champion.id && !unavailable;

                  let mark = "";
                  if (usedSet.has(champion.id)) mark = "PICKED";
                  else if (bannedSet.has(champion.id)) mark = "BANNED";

                  return (
                    <div
                      key={champion.id}
                      className={`champ ${selectedTile ? "selected" : ""} ${unavailable ? "used" : ""}`}
                    >
                      <button
                        type="button"
                        className="champ-main"
                        disabled={unavailable}
                        onClick={() => setPreview(champion.id)}
                        aria-label={`Preview ${champion.name}`}
                      >
                        {mark && <span className="mark">{mark}</span>}
                        <img src={champion.image} loading="lazy" alt={champion.name} />
                        <strong>{champion.name}</strong>
                      </button>

                      {selectedTile && (
                        <span className="champ-select-overlay">
                          <button type="button" className="champ-select-btn" onClick={commitPreview}>
                            Select
                          </button>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="roster-note">{rosterNote}</div>

            <div className="selection-bar">
              <div className="selection-summary">
                {previewChampion ? (
                  <>
                    <img src={previewChampion.image} alt="" />
                    <div>
                      <strong>{previewChampion.name}</strong>
                      <span>
                        Preview only · inspect the strategic diff, then use Select on the champion portrait to commit it
                      </span>
                    </div>
                  </>
                ) : (
                  <span>No champion previewed yet.</span>
                )}
              </div>

              <div className="btn-row">
                <button type="button" className="btn" onClick={() => setPreview(null)}>
                  Clear preview
                </button>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="lens-head">
              <div>
                <div className="eyebrow term-with-info">
                  <HelpIcon helpKey="strategic_lens" label="Strategic Lens" />
                  Strategic lens
                </div>
                <h2>Read the same draft through four different projections</h2>
              </div>

              <div className="side-tabs">
                <button
                  type="button"
                  className={`blue ${analysisSide === "blue" ? "active" : ""}`}
                  onClick={() => setAnalysisSide("blue")}
                >
                  Analyze Blue
                </button>
                <button
                  type="button"
                  className={`red ${analysisSide === "red" ? "active" : ""}`}
                  onClick={() => setAnalysisSide("red")}
                >
                  Analyze Red
                </button>
              </div>
            </div>

            <div className="lenses">
              {[
                ["objective", "Objective Coverage", "What strategic requirements are currently covered?", "objective_coverage"],
                ["realizability", "Realizability", "How executable are the covered requirements?", "realizability"],
                ["robustness", "Robustness", "Where is support redundant or concentrated?", "robustness"],
                ["optionality", "Optionality", "What named strategies and requirements remain open?", "optionality"],
              ].map(([id, title, description, helpKey]) => (
                <button
                  key={id}
                  type="button"
                  className={`lens ${lens === id ? "active" : ""}`}
                  onClick={() => setLens(id)}
                >
                  <strong className="term-with-info">
                    <HelpIcon helpKey={helpKey} label={title} />
                    {title}
                  </strong>
                  <span>{description}</span>
                </button>
              ))}
            </div>

            <div className="gitbar">
              {metricCards.map(([label, before, after, helpKey]) => {
                const same = String(before) === String(after);
                const beforeNumber = parseFloat(before);
                const afterNumber = parseFloat(after);
                const diffClass = same
                  ? "same"
                  : Number.isFinite(beforeNumber) && Number.isFinite(afterNumber) && afterNumber > beforeNumber
                    ? "add"
                    : "remove";

                return (
                  <div key={label} className="gitmetric">
                    <div className="k">
                      <HelpIcon helpKey={helpKey} label={label} />
                      {label}
                    </div>
                    <div className="v">{before}</div>
                    <div className={`diff ${diffClass}`}>
                      {preview ? `± ${before} → ${after}` : "current state"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="breadcrumb">
              <b>Strategic Lens</b>
              <span>›</span>
              <b>
                {{
                  objective: "Objective Coverage",
                  realizability: "Realizability",
                  robustness: "Robustness",
                  optionality: "Optionality",
                }[lens]}
              </b>
              <span>›</span>
              <span>{lensSpace[0]}</span>
              <span>›</span>
              <span>{selectedStrategy.family}</span>
              <span>›</span>
              <b>{selectedStrategy.name}</b>
            </div>
          </section>

          <section className="panel">
            <div className="section-head">
              <div>
                <div className="eyebrow term-with-info">
                  <HelpIcon helpKey={lensSpace[2]} label={lensSpace[0]} />
                  {lensSpace[0]}
                </div>
                <h2>{lensSpace[1]}</h2>
              </div>

              <div className="sub">
                {preview ? "Green/red text is the staged champion's diff." : "Click a champion above to generate a diff."}
              </div>
            </div>

            {FAMILIES.map((family) => {
              const familyHelpKey = {
                "Composition strategies": "composition_strategies",
                "Access / catch strategies": "access_catch_strategies",
                "Pressure strategies": "pressure_strategies",
              }[family.name];

              return (
                <div key={family.name} className="family">
                  <div className="family-title">
                    <span>
                      <HelpIcon helpKey={familyHelpKey} label={family.name} />
                      {family.name}
                    </span>
                  </div>

                  <div className="strategy-grid">
                    {family.strategies.map((strategy) => {
                      const lensInfo = getLensInfo(strategy, analysisSide, beforeState);
                      const diff = getStrategyDiff(strategy);

                      return (
                        <button
                          key={strategy.id}
                          type="button"
                          className={`strategy ${selectedStrategyId === strategy.id ? "selected" : ""}`}
                          onClick={() => setSelectedStrategyId(strategy.id)}
                        >
                          <div className="strategy-top">
                            <div className="strategy-name">
                              <HelpIcon helpKey={strategy.id} label={strategy.name} />
                              {strategy.name}
                            </div>
                            <span className={`status ${statusClass(lensInfo.status)}`}>
                              {lensInfo.status}
                            </span>
                          </div>

                          <div className="strategy-stat">
                            <span>{lensInfo.label}</span>
                            <b>{lensInfo.main}</b>
                          </div>

                          <div className={`strategy-diff diff ${diff.className}`}>{diff.text}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        </main>

        <aside className="right">
          <section className="panel">
            <div className="detail-head">
              <div>
                <div className="eyebrow term-with-info">
                  <HelpIcon helpKey="selected_named_strategy" label="Selected Named Strategy" />
                  Selected named strategy
                </div>
                <h2 className="term-with-info">
                  <HelpIcon helpKey={selectedStrategy.id} label={selectedStrategy.name} />
                  {selectedStrategy.name}
                </h2>
                <p className="sub">{selectedStrategy.description}</p>
              </div>

              <span className={`status ${statusClass(selectedLensInfo.status)}`}>
                {selectedLensInfo.status}
              </span>
            </div>

            <div className="requirements">
              {selectedStrategy.requirements.map((requirementId) => {
                const currentProviders = providersFor(requirementId, analysisSide, beforeState);
                const afterProviders = providersFor(requirementId, analysisSide, afterState);
                const addedProviders = afterProviders.filter(
                  (championId) => !currentProviders.includes(championId)
                );
                const state = requirementState(requirementId, beforeState);

                let note = state.note;
                let noteClass = "";

                if (preview && addedProviders.length > 0) {
                  note = `+ ${addedProviders
                    .map((championId) => championMap.get(championId)?.name || championId)
                    .join(", ")} becomes a provider`;
                  noteClass = "add";
                } else if (preview && phase?.type === "bans") {
                  const champion = championMap.get(preview);
                  if (champion && capabilityStrength(champion.id, requirementId) > 0) {
                    note = `− banning ${champion.name} narrows this requirement's future pool`;
                    noteClass = "remove";
                  }
                }

                return (
                  <div key={requirementId} className="req">
                    <div className="req-top">
                      <div className="req-name">
                        <HelpIcon helpKey={requirementId} label={REQUIREMENTS[requirementId]} />
                        {REQUIREMENTS[requirementId]}
                      </div>
                      <span className={`status ${state.className}`}>{state.label}</span>
                    </div>

                    <div className="providers">
                      {currentProviders.length > 0 ? (
                        currentProviders.map((championId) => {
                          const champion = championMap.get(championId);
                          return (
                            <PaidHoverHost
                              key={championId}
                              id={`provider-${requirementId}-${championId}`}
                              activePaidHoverId={activePaidHoverId}
                              setActivePaidHoverId={setActivePaidHoverId}
                              card={
                                <PaidHoverCard
                                  kind="current"
                                  championName={champion?.name || championId}
                                  strategyName={selectedStrategy.name}
                                  onOpenCheckout={setCheckoutContext}
                                />
                              }
                            >
                              <span className="provider">
                                <img src={champion?.image} alt="" />
                                {champion?.name || championId}
                              </span>
                            </PaidHoverHost>
                          );
                        })
                      ) : (
                        <span className="sub">No current providers</span>
                      )}

                      {addedProviders.map((championId) => {
                        const champion = championMap.get(championId);
                        return (
                          <PaidHoverHost
                            key={`preview-${championId}`}
                            id={`provider-preview-${requirementId}-${championId}`}
                            activePaidHoverId={activePaidHoverId}
                            setActivePaidHoverId={setActivePaidHoverId}
                            card={
                              <PaidHoverCard
                                kind="preview"
                                championName={champion?.name || championId}
                                strategyName={selectedStrategy.name}
                                onOpenCheckout={setCheckoutContext}
                              />
                            }
                          >
                            <span className="provider preview">
                              <img src={champion?.image} alt="" />
                              + {champion?.name || championId}
                            </span>
                          </PaidHoverHost>
                        );
                      })}
                    </div>

                    <div className={`req-diff ${noteClass}`}>{note}</div>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </div>

      <div className="footer">
        Hermod prototype. Strategic mappings are illustrative for UI experimentation. Hermod is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. Riot Games and League of Legends are trademarks or registered trademarks of Riot Games, Inc.
      </div>

      <CheckoutModal context={checkoutContext} onClose={() => setCheckoutContext(null)} />
    </div>
  );
}

export default App;
