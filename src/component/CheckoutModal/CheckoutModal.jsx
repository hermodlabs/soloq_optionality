import { useEffect, useState } from "react";
import { HERMOD_CHECKOUT_MODAL } from "../../config.jsx";
import { paidFeatureController } from "../../domain/paidFeatureController.js";

function CheckoutModal({ context, onClose }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, [context]);

  if (!context) return null;

  const kindLabel = {
    pick: "Selected pick",
    ban: "Selected ban",
    previewPick: "Preview pick",
    previewBan: "Preview ban",
    current: "Current provider",
    preview: "Preview provider",
  }[context.kind];

  const contextLine = [context.championName, context.strategyName, kindLabel]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className="checkout-lightbox"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="checkout-card" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <div className="checkout-head">
          <div>
            <div className="eyebrow">{HERMOD_CHECKOUT_MODAL.eyebrow}</div>
            <h3 id="checkout-title">{HERMOD_CHECKOUT_MODAL.title}</h3>
          </div>

          <button type="button" className="checkout-close" aria-label="Close checkout" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="checkout-summary">
          <div>
            <div className="name">{HERMOD_CHECKOUT_MODAL.featureName}</div>
            <div className="sub">{contextLine}</div>
          </div>

          <div className="price">{HERMOD_CHECKOUT_MODAL.price}</div>
        </div>

        <form
          className="checkout-form"
          onSubmit={(event) => {
            event.preventDefault();

            const validation = paidFeatureController.validateDemoCard(new FormData(event.currentTarget));
            if (!validation.isValid) {
              setMessage(validation.message);
              return;
            }

            setMessage(HERMOD_CHECKOUT_MODAL.successText);
          }}
        >
          <label className="checkout-field">
            <span>{HERMOD_CHECKOUT_MODAL.labels.name}</span>
            <input name="name" autoComplete="cc-name" placeholder={HERMOD_CHECKOUT_MODAL.placeholders.name} required />
          </label>

          <label className="checkout-field">
            <span>{HERMOD_CHECKOUT_MODAL.labels.cardNumber}</span>
            <input
              name="cardNumber"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder={HERMOD_CHECKOUT_MODAL.placeholders.cardNumber}
              maxLength={19}
              required
              onInput={(event) => {
                const digits = event.currentTarget.value.replace(/\D/g, "").slice(0, 16);
                event.currentTarget.value = digits.replace(/(.{4})/g, "$1 ").trim();
              }}
            />
          </label>

          <div className="checkout-row">
            <label className="checkout-field">
              <span>{HERMOD_CHECKOUT_MODAL.labels.expiry}</span>
              <input
                name="expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder={HERMOD_CHECKOUT_MODAL.placeholders.expiry}
                maxLength={7}
                required
                onInput={(event) => {
                  const digits = event.currentTarget.value.replace(/\D/g, "").slice(0, 4);
                  event.currentTarget.value =
                    digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
                }}
              />
            </label>

            <label className="checkout-field">
              <span>{HERMOD_CHECKOUT_MODAL.labels.cvc}</span>
              <input
                name="cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder={HERMOD_CHECKOUT_MODAL.placeholders.cvc}
                maxLength={4}
                required
                onInput={(event) => {
                  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 4);
                }}
              />
            </label>
          </div>

          <button type="submit" className="checkout-pay">
            {HERMOD_CHECKOUT_MODAL.buttonText}
          </button>

          <div className="checkout-note">{HERMOD_CHECKOUT_MODAL.demoNote}</div>
          {message && <div className="checkout-message">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default CheckoutModal;