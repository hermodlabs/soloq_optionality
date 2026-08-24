export const paidFeatureController = {
  createCheckoutContext({ kind, championName, strategyName }) {
    return { kind, championName, strategyName };
  },

  validateDemoCard(formData) {
    const number = String(formData.get("cardNumber") || "").replace(/\D/g, "");
    const expiry = String(formData.get("expiry") || "").trim();
    const cvc = String(formData.get("cvc") || "").replace(/\D/g, "");

    if (number.length < 12 || !/^\d{1,2}\s*\/\s*\d{2}$/.test(expiry) || cvc.length < 3) {
      return { isValid: false, message: "Please enter plausible demo card details." };
    }

    return { isValid: true, message: "Demo payment accepted." };
  },
};
