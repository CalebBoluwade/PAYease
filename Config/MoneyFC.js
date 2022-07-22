"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MoneyFC = (amount, currency) => {
    let USDrate = 615;
    // Check the currency
    if (currency === "NGN") {
    }
    else {
    }
    const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(amount);
    return formattedAmount;
};
exports.default = MoneyFC;
