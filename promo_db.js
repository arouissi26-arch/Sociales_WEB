// Promo Code Database
// This acts as a simple local database for valid promotional codes.

const promoCodes = {
    "HOLA10": {
        type: "percent",
        value: 10,
        description: "10% de descompte de benvinguda"
    },
    "VIP": {
        type: "percent",
        value: 20,
        description: "20% de descompte exclusiu VIP"
    },
    "ENVIO": {
        type: "fixed",
        value: 5,
        description: "5€ de descompte (enviament gratis)"
    },
    "MAMMA": {
        type: "percent",
        value: 15,
        description: "15% de descompte família"
    }
};

/**
 * Validates a promo code against the static DB or dynamic patterns.
 * @param {string} code - The code to validate
 * @returns {object|null} - The promo object or null if invalid
 */
function validatePromoCode(code) {
    if (!code) return null;
    code = code.toUpperCase();

    // 1. Check Static Codes
    if (promoCodes[code]) {
        return { code: code, ...promoCodes[code] };
    }

    // 2. Check Gift Card Pattern (e.g., GIFT-XXXX-XXXX)
    const giftPattern = /^GIFT-[A-Z0-9]+(-[A-Z0-9]+)*$/;
    if (giftPattern.test(code)) {
        return {
            code: code,
            type: "fixed",
            value: 50, // Simulated Gift Card value (n8n should verify real balance)
            description: "Targeta Regal (Saldo pendent de validació)"
        };
    }

    // 3. Check Dynamic Referral Pattern (e.g., REF-XXXX or starts with USER)
    // The modal uses "https://lacucinadimamma.com/ref/USER123" -> Code: USER123
    // We accept any code starting with "REF-" or "USER" followed by alphanumeric chars.
    const referralPattern = /^(REF-|USER)[A-Z0-9]+$/;

    if (referralPattern.test(code)) {
        return {
            code: code,
            type: "fixed",
            value: 10, // Referral codes give 10€ discount
            description: "10€ de descompte per amic"
        };
    }

    return null;
}

// Export for global use
window.PROMO_CODES_DB = promoCodes;
window.validatePromoCode = validatePromoCode;
