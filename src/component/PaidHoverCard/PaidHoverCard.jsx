import React from "react";
import { HERMOD_PROVIDER_PAID_HOVER } from "../../config.jsx";

function PaidHoverCard({ kind, championName, strategyName = "", onOpenCheckout }) {
  const contentByKind = {
    current: HERMOD_PROVIDER_PAID_HOVER.currentProvider,
    preview: HERMOD_PROVIDER_PAID_HOVER.previewProvider,
    pick: HERMOD_PROVIDER_PAID_HOVER.pickArea,
    ban: HERMOD_PROVIDER_PAID_HOVER.banArea,
    previewPick: HERMOD_PROVIDER_PAID_HOVER.previewPickArea,
    previewBan: HERMOD_PROVIDER_PAID_HOVER.previewBanArea,
  };

  const content = contentByKind[kind] || HERMOD_PROVIDER_PAID_HOVER.pickArea;

  return (
    <span className="paid-tooltip-card">
      <span className="paid-feature-badge">{HERMOD_PROVIDER_PAID_HOVER.badgeText}</span>
      <span className="paid-feature-title">{content.title}</span>
      <span className="paid-feature-copy">{content.text}</span>

      <button
        type="button"
        className="paid-feature-button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onOpenCheckout({ kind, championName, strategyName });
        }}
      >
        {HERMOD_PROVIDER_PAID_HOVER.buttonText}
      </button>
    </span>
  );
}