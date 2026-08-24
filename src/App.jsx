import React, { useEffect, useMemo, useState } from "react";
import { HERMOD_HELP } from "./config.jsx";
import { FAMILIES, PHASES, REQUIREMENTS } from "./data.jsx";
import { draftController } from "./domain/draftController.js";
import {
  buildChampionMap,
  filterChampions as filterChampionList,
  getAnalysisState as computeAnalysisState,
  getCapabilityStrength,
  getFutureIdsFor as computeFutureIdsFor,
  getLensInfo as computeLensInfo,
  getLensSpace,
  getMetricCards as computeMetricCards,
  getProvidersFor as computeProvidersFor,
  getRequirementState as computeRequirementState,
  getStatusClass,
  getStrategyDiff as computeStrategyDiff,
  getStrategyInfo as computeStrategyInfo,
} from "./domain/strategyAnalyzer.js";
import { paidFeatureController } from "./domain/paidFeatureController.js";
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

  const championMap = useMemo(() => buildChampionMap(champions), [champions]);

  const allStrategies = useMemo(
    () =>
      FAMILIES.flatMap((family) =>
        family.strategies.map((strategy) => ({ ...strategy, family: family.name }))
      ),
    []
  );

  const phase = draftController.getCurrentPhase(phaseIndex);
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
    getCapabilityStrength(championMap, championId, requirementId);

  const summarizeChampionContributions = (champion) => {
    if (!champion?.capabilities) return [];

    return Object.entries(champion.capabilities)
      .sort(([, left], [, right]) => right - left)
      .slice(0, 3)
      .map(([requirementId, value]) => ({
        label: REQUIREMENTS[requirementId] || requirementId.replace(/_/g, " "),
        value,
      }));
  };

  const getAnalysisState = (withPreview) =>
    computeAnalysisState({
      draft,
      preview: withPreview ? preview : null,
      phase,
      phasePicks,
      activeBanSide,
    });

  const providersFor = (requirementId, side, state) =>
    computeProvidersFor({ requirementId, side, state, phase, phasePicks, championMap });

  const futureIdsFor = (requirementId, state) =>
    computeFutureIdsFor({ requirementId, state, phasePicks, champions, championMap });

  const getStrategyInfo = (strategy, side, state) =>
    computeStrategyInfo({ strategy, side, state, phase, phasePicks, champions, championMap });

  const getLensInfo = (strategy, side, state) =>
    computeLensInfo({ strategy, side, state, lens, phase, phasePicks, champions, championMap });

  const getStrategyDiff = (strategy) =>
    computeStrategyDiff({
      strategy,
      analysisSide,
      preview,
      lens,
      draft,
      phase,
      phasePicks,
      activeBanSide,
      champions,
      championMap,
    });

  const isUnavailable = (champion) =>
    draftController.isChampionUnavailable({
      championId: champion.id,
      draft,
      phase,
      phasePicks,
      activeBanSide,
      usedSet,
      bannedSet,
    });

  const filteredChampions = filterChampionList({ champions, search, roleFilter });
  const lensSpace = getLensSpace(lens);

  const beforeState = getAnalysisState(false);
  const afterState = getAnalysisState(true);
  const selectedLensInfo = getLensInfo(selectedStrategy, analysisSide, beforeState);

  const metricCards = computeMetricCards({
    allStrategies,
    lens,
    analysisSide,
    beforeState,
    afterState,
    phase,
    phasePicks,
    champions,
    championMap,
  });

  const requirementState = (requirementId, state) =>
    computeRequirementState({
      requirementId,
      state,
      analysisSide,
      lens,
      phase,
      phasePicks,
      champions,
      championMap,
    });

  const [activeRequirementDetail, setActiveRequirementDetail] = useState(null);

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
                contributions={summarizeChampionContributions(champion)}
                onOpenCheckout={(payload) =>
                  setCheckoutContext(paidFeatureController.createCheckoutContext(payload))
                }
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
                contributions={summarizeChampionContributions(champion)}
                onOpenCheckout={(payload) =>
                  setCheckoutContext(paidFeatureController.createCheckoutContext(payload))
                }
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
                contributions={summarizeChampionContributions(champion)}
                onOpenCheckout={(payload) =>
                  setCheckoutContext(paidFeatureController.createCheckoutContext(payload))
                }
              />
            }
          >
            <img src={champion?.image} alt="" />
            <strong>{champion?.name || championId}</strong>
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
                contributions={summarizeChampionContributions(champion)}
                onOpenCheckout={(payload) =>
                  setCheckoutContext(paidFeatureController.createCheckoutContext(payload))
                }
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

  const analysisThemeClass = analysisSide === "red" ? "is-red-team" : "is-blue-team";

  return (
    <div className={`shell ${analysisThemeClass}`}>
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
                    contributions={summarizeChampionContributions(previewChampion)}
                    onOpenCheckout={(payload) =>
                      setCheckoutContext(paidFeatureController.createCheckoutContext(payload))
                    }
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

      </section>

      <section className="panel strategic-lens-panel">
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
                              {strategy.name}
                            </div>
                            <span className={`status ${getStatusClass(lensInfo.status)}`}>
                              {lensInfo.status}
                            </span>
                          </div>

                          <div className="strategy-stat">
                            <b>{lensInfo.main}</b>
                            <span className="strategy-description">{strategy.description}</span>
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

              <span className={`status ${getStatusClass(selectedLensInfo.status)}`}>
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

                const requirementDetail = HERMOD_HELP[requirementId] || {};

                return (
                  <div
                    key={requirementId}
                    className="req"
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveRequirementDetail({
                      title: REQUIREMENTS[requirementId],
                      strategyName: selectedStrategy.name,
                      body: requirementDetail.description || "This requirement contributes to the current named strategy.",
                      status: state.label,
                    })}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setActiveRequirementDetail({
                          title: REQUIREMENTS[requirementId],
                          strategyName: selectedStrategy.name,
                          body: requirementDetail.description || "This requirement contributes to the current named strategy.",
                          status: state.label,
                        });
                      }
                    }}
                  >
                    <div className="req-top">
                      <div className="req-name">{REQUIREMENTS[requirementId]}</div>
                      <span className={`status ${state.className}`}>{state.label}</span>
                    </div>

                    <div className="req-description">
                      {requirementDetail.description || "This requirement contributes to the current named strategy."}
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
                                  onOpenCheckout={(payload) =>
                                    setCheckoutContext(
                                      paidFeatureController.createCheckoutContext(payload)
                                    )
                                  }
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
                                onOpenCheckout={(payload) =>
                                  setCheckoutContext(
                                    paidFeatureController.createCheckoutContext(payload)
                                  )
                                }
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

      {activeRequirementDetail && (
        <div className="strategy-lightbox" onClick={() => setActiveRequirementDetail(null)}>
          <div
            className="strategy-lightbox-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="strategy-lightbox-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="strategy-lightbox-head">
              <div>
                <div className="eyebrow">{activeRequirementDetail.strategyName}</div>
                <h3 id="strategy-lightbox-title">{activeRequirementDetail.title}</h3>
              </div>
              <button
                type="button"
                className="checkout-close"
                onClick={() => setActiveRequirementDetail(null)}
                aria-label="Close requirement detail"
              >
                ×
              </button>
            </div>

            <p className="strategy-lightbox-body">{activeRequirementDetail.body}</p>

            <div className="strategy-lightbox-meta">
              <span>Current status</span>
              <strong>{activeRequirementDetail.status}</strong>
            </div>
          </div>
        </div>
      )}

      <CheckoutModal context={checkoutContext} onClose={() => setCheckoutContext(null)} />
    </div>
  );
}

export default App;
