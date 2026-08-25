import React, { useEffect, useMemo, useRef, useState } from "react";
import { Network } from "vis-network/peer";
import { CHAMPION_CAPABILITY_GUIDANCE, HERMOD_HELP } from "./config.jsx";
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

function ConditionNetworkGraph({ conditions, championMap, onChampionClick }) {
  return (
    <div className="condition-table-wrap">
      <table className="condition-table">
        <thead>
          <tr>
            <th>Condition</th>
            <th>Champion</th>
          </tr>
        </thead>
        <tbody>
          {conditions.map((condition) => (
            <tr key={condition.id || condition.label}>
              <td className="condition-cell">
                <div className="condition-cell-content">
                  <strong>{condition.label}</strong>
                  <span>{condition.text || condition.label}</span>
                </div>
              </td>
              <td className="condition-provider-cell">
                <div className="condition-provider-list">
                  {(condition.providers || []).map((championId) => {
                    const champion = championMap.get(championId);
                    if (!champion) return null;

                    return (
                      <button
                        key={`${condition.id}-${championId}`}
                        type="button"
                        className="condition-provider-pill"
                        onClick={() => onChampionClick(champion)}
                        title={champion.name}
                      >
                        <img src={champion.image} alt={champion.name} />
                        <span>{champion.name}</span>
                      </button>
                    );
                  })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
    allStrategies.find((strategy) => strategy.id === selectedStrategyId) || allStrategies[0] || null;

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
      .map(([requirementId, value]) => {
        const capabilityGuide = CHAMPION_CAPABILITY_GUIDANCE[requirementId] || {};
        return {
          label: REQUIREMENTS[requirementId] || requirementId.replace(/_/g, " "),
          value,
          summary: capabilityGuide.summary || "This capability contributes to a meaningful strategic pattern.",
          explanation: capabilityGuide.explanation || "The champion’s toolkit supports this requirement through repeated mechanical and tactical patterns seen in play.",
          provenance: capabilityGuide.provenance || [],
        };
      });
  };

  const summarizeChampionBanImpact = (champion) => {
    if (!champion?.capabilities) return [];

    return Object.entries(champion.capabilities)
      .sort(([, left], [, right]) => right - left)
      .slice(0, 3)
      .map(([requirementId, value]) => {
        const requirementLabel = REQUIREMENTS[requirementId] || requirementId.replace(/_/g, " ");
        const capabilityGuide = CHAMPION_CAPABILITY_GUIDANCE[requirementId] || {};
        return {
          label: requirementLabel,
          value,
          summary: `This ban removes a key route to ${requirementLabel.toLowerCase()} from the draft.`,
          explanation: capabilityGuide.explanation
            ? `This ban matters because it strips away the champion’s contribution to ${requirementLabel.toLowerCase()}, forcing the team to rely on weaker or slower alternatives for this requirement.`
            : `Banning this champion narrows the team’s ability to satisfy ${requirementLabel.toLowerCase()} and weakens that strategic path.`,
          provenance: capabilityGuide.provenance || [],
        };
      });
  };

  const summarizeChampionAnalysis = (champion, kind) => {
    if (!champion) return [];
    const isBanAnalysis = kind === "ban" || kind === "previewBan";
    return isBanAnalysis ? summarizeChampionBanImpact(champion) : summarizeChampionContributions(champion);
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
  const selectedLensInfo = selectedStrategy ? getLensInfo(selectedStrategy, analysisSide, beforeState) : null;

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
  const [activeStrategyDetail, setActiveStrategyDetail] = useState(null);
  const [activeChampionAnalysis, setActiveChampionAnalysis] = useState(null);

  const selectedStrategyEntry = selectedStrategy ? HERMOD_HELP[selectedStrategy.id] || {} : {};

  const adversarialSignals = useMemo(() => {
    if (!selectedStrategy) return [];
    const strategyId = selectedStrategy.id;

    const byStrategy = {
      front: [
        {
          label: "Enemy backline access",
          text: "The enemy can contest the carry if the fight does not start on your terms and your frontline cannot hold the first exchange.",
        },
        {
          label: "Damage conversion pressure",
          text: "Your sustained damage wins only if the compensation cycle remains intact; the first lost exchange can collapse the plan.",
        },
        {
          label: "Primary vulnerability",
          text: "The carry is still the clearest pressure point, so a single failed peel turn can erase the whole sequence.",
        },
      ],
      protect: [
        {
          label: "Enemy dive pressure",
          text: "The plan fails quickly if the opponent can reach your carry before the team has stacked peel or vision control.",
        },
        {
          label: "Sustain mismatch",
          text: "If your sustain does not outlast the enemy's burst, the carry is no longer safe enough to convert the lead.",
        },
        {
          label: "Single dependency",
          text: "This strategy is still very dependent on one damage source staying alive long enough to turn the fight.",
        },
      ],
      zone: [
        {
          label: "Reroute pressure",
          text: "Enemy movement and pick timing can invalidate your preferred fight geometry before you ever get to the key lane.",
        },
        {
          label: "Backline disruption",
          text: "If the enemy reaches your vulnerable targets early, your control plan loses the initiative and turns into an attrition fight.",
        },
        {
          label: "Flexibility risk",
          text: "This plan is most dangerous when the enemy has no clean answer; once they force the fight elsewhere, your geometry weakens.",
        },
      ],
      poke: [
        {
          label: "Range denial",
          text: "Enemy disengage can stop your ranged pressure before the fight has even become an exchange of real value.",
        },
        {
          label: "Position loss",
          text: "Once you are forced to commit, the stronger side benefits from the range trap and your value window can disappear.",
        },
        {
          label: "Counter-commit risk",
          text: "You are structurally strong while preserving distance, but the plan becomes brittle if the enemy can choose the fight on their terms.",
        },
      ],
      pick: [
        {
          label: "Vision pressure",
          text: "If the enemy can see the approach or peel your objective target, the opening collapses before the pick arrives.",
        },
        {
          label: "Target denial",
          text: "The plan is only as good as the target selection window; if the enemy rotates early, you lose the timing advantage.",
        },
        {
          label: "Collapse fragility",
          text: "A single failed engage or failed follow-through can turn a nice pick into a losing 5v5.",
        },
      ],
      split: [
        {
          label: "Side-lane counterplay",
          text: "The enemy can deny your split lane before it becomes a real map threat, then punish your weak side of the map.",
        },
        {
          label: "Response pressure",
          text: "A clean response collapse can cut off the whole lane before your side pressure becomes meaningful.",
        },
        {
          label: "Map tempo risk",
          text: "This plan is only healthy if the objective timing stays favorable; if they can answer the split without overcommitting, your leverage drops quickly.",
        },
      ],
      pressure_pick: [
        {
          label: "Movement denial",
          text: "Your plan depends on the enemy making bad movement choices; if they accept the trade, the pressure becomes static and fragile.",
        },
        {
          label: "Trade pressure",
          text: "The window is strongest only if you can convert the forced reposition into a real target problem before the fight resets.",
        },
        {
          label: "Counter-rotation risk",
          text: "The opponent can absorb the pressure and then exploit the reduced team positioning once the fight is forced.",
        },
      ],
    };

    return byStrategy[strategyId] || [
      {
        label: "Opponent pressure detected",
        text: "The enemy will try to remove the conditions that make this plan work before it becomes a real advantage.",
      },
      {
        label: "Execution stress",
        text: "The plan is structurally viable, but it still carries dependency risk if the opponent can remove the required timing window.",
      },
      {
        label: "Recovery path",
        text: "This strategy remains viable if the team can answer the enemy's first disruption with a faster second wave or a cleaner pivot.",
      },
    ];
  }, [selectedStrategy]);

  const draftMetaModel = useMemo(() => {
    if (!selectedStrategy) {
      return {
        strategy: "",
        description: "",
        pathways: [],
        capabilities: [],
        conditions: [],
        exposures: [],
      };
    }

    const entries = selectedStrategy.requirements.map((requirementId) => {
      const state = requirementState(requirementId, beforeState);
      const currentProviders = providersFor(requirementId, analysisSide, beforeState);
      const label = REQUIREMENTS[requirementId] || requirementId.replace(/_/g, " ");
      return {
        id: requirementId,
        label,
        strength: state.label,
        providerCount: currentProviders.length,
        description: HERMOD_HELP[requirementId]?.description || "This is a meaningful requirement in the current draft structure.",
      };
    });

    const capabilities = [...entries]
      .sort((left, right) => {
        const order = { Strong: 3, Medium: 2, Low: 1, Gap: 0 };
        return (order[right.strength] || 0) - (order[left.strength] || 0);
      })
      .slice(0, 4);

    const pathways = [
      entries.slice(0, 3).map((entry) => entry.label).join(" → "),
      entries.slice(1, 4).map((entry) => entry.label).join(" → "),
    ].filter((path) => path && path.split(" → ").length > 1);

    const conditions = entries
      .filter((entry) => entry.providerCount > 0)
      .slice(0, 3)
      .map((entry) => {
        const providerIds = providersFor(entry.id, analysisSide, beforeState);
        const providerNames = providerIds
          .map((championId) => championMap.get(championId)?.name || championId)
          .slice(0, 3);

        const text = providerNames.length > 0
          ? `${entry.label} is currently supported by ${providerNames.join(", ")}.`
          : `${entry.label} is currently supported by its current draft pattern.`;

        return {
          id: entry.id,
          label: entry.label,
          text,
          providers: providerIds,
        };
      });

    const exposures = entries
      .filter((entry) => entry.providerCount === 0)
      .slice(0, 3)
      .map((entry) => `${entry.label} is still a structural exposure for this plan.`);

    return {
      strategy: selectedStrategy.name,
      description: selectedStrategy.description,
      pathways: pathways.length > 0 ? pathways : [selectedStrategy.name],
      capabilities,
      conditions: conditions.length > 0 ? conditions : [{ id: "none", label: "No clear condition", text: "This draft has no clear provider pattern yet." }],
      exposures,
    };
  }, [selectedStrategy, beforeState, analysisSide, providersFor, requirementState, championMap]);

  const pathwayGraph = useMemo(() => {
    if (!selectedStrategy) return { nodes: [], edges: [] };

    const nodes = selectedStrategy.requirements.map((requirementId, index) => {
      const label = REQUIREMENTS[requirementId] || requirementId.replace(/_/g, " ");
      const isLeft = index % 2 === 0;
      return {
        id: requirementId,
        label,
        x: isLeft ? 110 : 360,
        y: 40 + (index * 42),
      };
    });

    const edges = [];
    for (let index = 0; index < nodes.length - 1; index += 1) {
      edges.push({
        from: nodes[index].id,
        to: nodes[index + 1].id,
      });
    }

    return { nodes, edges };
  }, [selectedStrategy?.requirements]);

  const pathwayElements = useMemo(() => {
    if (!selectedStrategy) return [];

    const unique = [];
    const seen = new Set();

    draftMetaModel.pathways.forEach((path) => {
      path.split(" → ").forEach((step) => {
        const requirementId = selectedStrategy.requirements.find(
          (id) => (REQUIREMENTS[id] || id.replace(/_/g, " ")) === step
        );

        if (!requirementId || seen.has(requirementId)) return;

        const currentProviders = providersFor(requirementId, analysisSide, beforeState);
        const afterProviders = providersFor(requirementId, analysisSide, afterState);
        const providerIds = [...new Set([...currentProviders, ...afterProviders])];
        const requirementDetail = HERMOD_HELP[requirementId] || {};
        seen.add(requirementId);
        unique.push({
          id: requirementId,
          label: step,
          summary: requirementDetail.description || "This requirement is part of the current pathway structure.",
          providers: providerIds,
        });
      });
    });

    return unique;
  }, [draftMetaModel.pathways, selectedStrategy?.requirements, providersFor, beforeState, afterState, analysisSide]);

  const openChampionAnalysis = ({ champion, kind, strategyName = "" }) => {
    if (!champion) return;
    setActiveChampionAnalysis({
      championName: champion.name,
      strategyName,
      analysisType: kind,
      contributions: summarizeChampionAnalysis(champion, kind),
    });
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
            onClickOpen={() => openChampionAnalysis({ champion, kind })}
            card={
              <PaidHoverCard
                kind={kind}
                championName={champion?.name || championId}
                contributions={summarizeChampionAnalysis(champion, kind)}
                onOpenFullAnalysis={(payload) => setActiveChampionAnalysis({ ...payload, analysisType: kind })}
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
            onClickOpen={() => openChampionAnalysis({ champion, kind: "previewPick" })}
            card={
              <PaidHoverCard
                kind="previewPick"
                championName={champion?.name || previewForSide}
                contributions={summarizeChampionAnalysis(champion, "previewPick")}
                onOpenFullAnalysis={(payload) => setActiveChampionAnalysis({ ...payload, analysisType: "previewPick" })}
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
            onClickOpen={() => openChampionAnalysis({ champion, kind: "ban" })}
            card={
              <PaidHoverCard
                kind="ban"
                championName={champion?.name || championId}
                contributions={summarizeChampionAnalysis(champion, "ban")}
                onOpenFullAnalysis={(payload) => setActiveChampionAnalysis({ ...payload, analysisType: "ban" })}
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
            onClickOpen={() => openChampionAnalysis({ champion, kind: "previewBan" })}
            card={
              <PaidHoverCard
                kind="previewBan"
                championName={champion?.name || previewForSide}
                contributions={summarizeChampionAnalysis(champion, "previewBan")}
                onOpenFullAnalysis={(payload) => setActiveChampionAnalysis({ ...payload, analysisType: "previewBan" })}
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

  const getRequirementLightboxBody = (requirementId, strategyName, requirementDetail) => {
    const title = REQUIREMENTS[requirementId] || requirementId;
    const summary = requirementDetail.description || "This requirement contributes to the current named strategy.";
    return `${title} is a core capability behind ${strategyName}. In plain terms, it helps the team ${summary.toLowerCase()}`;
  };

  const analysisThemeClass = analysisSide === "red" ? "is-red-team" : "is-blue-team";

  return (
    <div className={`shell ${analysisThemeClass}`}>
      <header className="topbar">
        <div className="copy">
          <div className="eyebrow">Hermod · SoloQ Optionality Lab</div>
          <h1>Move one piece. See what the strategic space becomes.</h1>
          <p className="sub">
            Free mode explains the current draft. Paid mode compares alternative draft worlds and the delta reasoning between them.
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
                    contributions={summarizeChampionAnalysis(previewChampion, centerPreviewKind)}
                    onOpenFullAnalysis={(payload) => setActiveChampionAnalysis({ ...payload, analysisType: centerPreviewKind })}
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
            ["strategic", "Strategic Coverage", "Which strategic archetypes and pathways does this composition support?", "strategic_coverage"],
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
                "Teamfight": "teamfight",
                "Pick / Catch": "pick_catch",
                "Range Control": "range_control",
                "Distributed Pressure": "distributed_pressure",
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

          {selectedStrategy && (
            <section className="panel adversarial-analysis-panel">
              <div className="analysis-panel-header">
                <div className="eyebrow">Adversarial analysis</div>
                <h3>How the enemy can contest this plan</h3>
              </div>

              <div className="adversarial-pro-box">
                <div className="summary-pill paid">Pro</div>
                <p>
                  Opponent pressure is likely to target the conditions that make {selectedStrategy.name.toLowerCase()} work. This deeper read explains how the enemy contests your plan: which capability, pathway, and champion dependency they are attacking, which counter-paths remain viable, and which replacement picks restore the matchup.
                </p>
                <button
                  type="button"
                  className="adversarial-unlock-button"
                  onClick={() => setCheckoutContext(paidFeatureController.createCheckoutContext({
                    kind: "adversarial",
                    strategyName: selectedStrategy.name,
                  }))}
                >
                  Unlock adversarial analysis
                </button>
              </div>

              <ul className="adversarial-warning-list">
                {adversarialSignals.map((signal) => (
                  <li key={signal.label}>
                    <strong>{signal.label}</strong>
                    <span>{signal.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>

        <aside className="right">
          {selectedStrategy ? (
            <>
              <section className="panel strategy-description-panel">
                <div className="detail-head">
                  <div>
                    <div className="eyebrow term-with-info">
                      <HelpIcon helpKey="selected_named_strategy" label="Selected strategy" />
                      Selected strategy
                    </div>
                    <h2
                      className="strategy-detail-trigger"
                      onClick={() => setActiveStrategyDetail(selectedStrategy.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setActiveStrategyDetail(selectedStrategy.id);
                        }
                      }}
                    >
                      {selectedStrategy.name}
                    </h2>
                    <p className="sub">{selectedStrategy.description}</p>
                  </div>

                  <span className={`status ${getStatusClass(selectedLensInfo.status)}`}>
                    {selectedLensInfo.status}
                  </span>
                </div>

                <div className="adversarial-pro-box">
                  <div className="summary-pill paid">Pro</div>
                  <p>
                    Hermod reads this draft as a {selectedStrategy.name.toLowerCase()} strategy. Unlock the counterplay layer to see how the opposing team should respond, which path becomes fragile, and which adjustment or replacement move restores your strategic sequence.
                  </p>
                  <button
                    type="button"
                    className="adversarial-unlock-button"
                    onClick={() => setCheckoutContext(paidFeatureController.createCheckoutContext({
                      kind: "adversarial",
                      strategyName: selectedStrategy.name,
                    }))}
                  >
                    Unlock adversarial analysis
                  </button>
                </div>

                {selectedStrategyEntry.explanation && (
                  <div className="strategy-summary-rationale">
                    <div className="eyebrow">Why this strategy matters</div>
                    <p>{selectedStrategyEntry.explanation}</p>
                  </div>
                )}
              </section>

              <section className="panel analysis-panel">
                <div className="analysis-panel-header">
                  <div className="eyebrow">Capabilities</div>
                  <h3>Core strengths</h3>
                </div>
                <div className="capability-list expanded">
                  {draftMetaModel.capabilities.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      className="capability-pill"
                      onClick={() => setActiveRequirementDetail({
                        title: entry.label,
                        strategyName: selectedStrategy.name,
                        body: getRequirementLightboxBody(entry.id, selectedStrategy.name, HERMOD_HELP[entry.id] || {}),
                        explanation: HERMOD_HELP[entry.id]?.explanation || "This requirement is a meaningful structural driver for the current draft.",
                        provenance: HERMOD_HELP[entry.id]?.provenance || [],
                        status: entry.strength,
                      })}
                    >
                      <span>{entry.label}</span>
                      <strong>{entry.strength}</strong>
                    </button>
                  ))}
                </div>
              </section>

              <section className="panel analysis-panel">
                <div className="analysis-panel-header">
                  <div className="eyebrow">Conditions</div>
                  <h3>What the team needs to hold</h3>
                </div>
                <ConditionNetworkGraph
                  conditions={draftMetaModel.conditions}
                  championMap={championMap}
                  onChampionClick={(champion) => openChampionAnalysis({ champion, kind: "pick", strategyName: selectedStrategy.name })}
                />
              </section>

              <section className="panel analysis-panel">
                <div className="analysis-panel-header">
                  <div className="eyebrow">Exposures</div>
                  <h3>Where the plan is vulnerable</h3>
                </div>
                <div className="exposure-card-grid">
                  {draftMetaModel.exposures.map((exposure) => (
                    <div key={exposure} className="exposure-card">
                      <span className="exposure-card-badge">Exposure</span>
                      <p>{exposure}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel analysis-panel">
                <div className="analysis-panel-header">
                  <div className="eyebrow">Pathways</div>
                  <h3>How the draft converts</h3>
                </div>
                <div className={`pathway-ribbon ${draftMetaModel.pathways.length > 1 ? "multi" : "single"}`}>
                  {draftMetaModel.pathways.map((path, pathIndex) => {
                    const steps = path.split(" → ");
                    return (
                      <div key={`${path}-${pathIndex}`} className="pathway-column">
                        <div className="pathway-track">
                          {steps.map((step, index) => (
                            <React.Fragment key={`${pathIndex}-${step}-${index}`}>
                              <div className="pathway-step">
                                <span>{step}</span>
                              </div>
                              {index < steps.length - 1 && (
                                <div className="pathway-arrow" aria-hidden="true">→</div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="panel analysis-panel">
                <div className="analysis-panel-header">
                  <div className="eyebrow">Pathway elements</div>
                  <h3>Exact building blocks</h3>
                </div>
                <div className="pathway-element-grid">
                  {pathwayElements.map((element) => (
                    <button
                      key={element.id}
                      type="button"
                      className="pathway-element-card"
                      onClick={() => setActiveRequirementDetail({
                        title: element.label,
                        strategyName: selectedStrategy.name,
                        body: getRequirementLightboxBody(element.id, selectedStrategy.name, HERMOD_HELP[element.id] || {}),
                        explanation: HERMOD_HELP[element.id]?.explanation || "This requirement is part of the current pathway structure.",
                        provenance: HERMOD_HELP[element.id]?.provenance || [],
                        status: requirementState(element.id, beforeState).label,
                      })}
                    >
                      <span className="pathway-element-name">{element.label}</span>
                      <small>{element.summary}</small>
                      <span className="pathway-element-providers">
                        {element.providers.map((championId) => {
                          const champion = championMap.get(championId);
                          if (!champion) return null;
                          return (
                            <span key={`${element.id}-${championId}`} className="pathway-provider-avatar" title={champion.name}>
                              <img src={champion.image} alt={champion.name} />
                            </span>
                          );
                        })}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

            </>
          ) : (
            <section className="panel strategy-description-panel">
              <div className="detail-head">
                <div>
                  <div className="eyebrow">Selected strategy</div>
                  <h2>Select a strategy</h2>
                </div>
              </div>
              <div className="strategy-summary-block">
                <p>No strategy details are loaded yet.</p>
              </div>
            </section>
          )}
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

            <div className="strategy-lightbox-section">
              <span className="strategy-lightbox-label">Purpose-first rationale</span>
              <p>{activeRequirementDetail.explanation}</p>
            </div>

            {activeRequirementDetail.provenance?.length > 0 && (
              <div className="strategy-lightbox-section">
                <span className="strategy-lightbox-label">Reddit provenance</span>
                <ul className="strategy-lightbox-list">
                  {activeRequirementDetail.provenance.map((reference) => (
                    <li key={`${reference.label}-${reference.url}`}>
                      <a href={reference.url} target="_blank" rel="noreferrer noopener">{reference.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="strategy-lightbox-meta">
              <span>Current status</span>
              <strong>{activeRequirementDetail.status}</strong>
            </div>
          </div>
        </div>
      )}

      {activeStrategyDetail && (
        <div className="strategy-lightbox" onClick={() => setActiveStrategyDetail(null)}>
          <div
            className="strategy-lightbox-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="strategy-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="strategy-lightbox-head">
              <div>
                <div className="eyebrow">Named strategy</div>
                <h3 id="strategy-detail-title">{selectedStrategy.name}</h3>
              </div>
              <button
                type="button"
                className="checkout-close"
                onClick={() => setActiveStrategyDetail(null)}
                aria-label="Close strategy detail"
              >
                ×
              </button>
            </div>

            <p className="strategy-lightbox-body">{selectedStrategy.description}</p>

            <div className="strategy-lightbox-section">
              <span className="strategy-lightbox-label">Why this strategy matters</span>
              <p>{selectedStrategyEntry.explanation || selectedStrategy.description}</p>
            </div>

            {selectedStrategyEntry.provenance?.length > 0 && (
              <div className="strategy-lightbox-section">
                <span className="strategy-lightbox-label">Reddit provenance</span>
                <ul className="strategy-lightbox-list">
                  {selectedStrategyEntry.provenance.map((reference) => (
                    <li key={`${reference.label}-${reference.url}`}>
                      <a href={reference.url} target="_blank" rel="noreferrer noopener">{reference.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {activeChampionAnalysis && (
        <div className="strategy-lightbox" onClick={() => setActiveChampionAnalysis(null)}>
          <div
            className="strategy-lightbox-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="champion-analysis-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="strategy-lightbox-head">
              <div>
                <div className="eyebrow">
                  {activeChampionAnalysis.strategyName || (activeChampionAnalysis.analysisType?.includes("ban") ? "Ban impact" : "Champion capability analysis")}
                </div>
                <h3 id="champion-analysis-title">{activeChampionAnalysis.championName}</h3>
              </div>
              <button
                type="button"
                className="checkout-close"
                onClick={() => setActiveChampionAnalysis(null)}
                aria-label="Close champion analysis"
              >
                ×
              </button>
            </div>

            <div className="strategy-lightbox-section">
              <span className="strategy-lightbox-label">
                {activeChampionAnalysis.analysisType?.includes("ban") ? "Removed capability pressure" : "Key contributions"}
              </span>
              <div className="paid-feature-items lightbox-analysis-list">
                {activeChampionAnalysis.contributions?.map(({ label, value, summary, explanation, provenance = [] }) => (
                  <div key={label} className="paid-feature-item-wrap">
                    <span className="paid-feature-item">
                      <span>{label}</span>
                      <em>{typeof value === "number" ? `${value}/4` : value}</em>
                    </span>
                    {summary && <small className="paid-feature-summary">{summary}</small>}
                    {explanation && <small className="paid-feature-explanation">{explanation}</small>}
                    {provenance.length > 0 && (
                      <span className="paid-feature-provenance">
                        {provenance.map((reference) => (
                          <a key={`${reference.label}-${reference.url}`} href={reference.url} target="_blank" rel="noreferrer noopener">
                            {reference.label}
                          </a>
                        ))}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <CheckoutModal context={checkoutContext} onClose={() => setCheckoutContext(null)} />
    </div>
  );
}

export default App;
