const MoneyFC = (amount: number, currency: string) => {
  let USDrate = 615;

  // Check the currency
  if (currency === "NGN") {
  } else {
  }

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);

  return formattedAmount;
};

export default MoneyFC;
