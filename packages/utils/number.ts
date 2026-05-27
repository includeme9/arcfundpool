export function formatUSDC(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits
  }).format(value).replace("$", "") + " USDC";
}

export function progressPercent(raised: number, target: number) {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((raised / target) * 100));
}
