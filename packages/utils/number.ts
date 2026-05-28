export function formatUSDC(value: number | null | undefined, maximumFractionDigits = 2) {
  return `${formatNumber(value, maximumFractionDigits)} USDC`;
}

export function poolFundingMath(raised: number | null | undefined, target: number | null | undefined) {
  const safeRaised = safeNumber(raised);
  const safeTarget = safeNumber(target);
  const progress = safeTarget > 0 ? Math.min(100, Math.max(0, Math.round((safeRaised / safeTarget) * 100))) : 0;
  const remaining = Math.max(safeTarget - safeRaised, 0);

  return { progress, remaining };
}

export function progressPercent(raised: number | null | undefined, target: number | null | undefined) {
  return poolFundingMath(raised, target).progress;
}

export function formatNumber(value: number | null | undefined, maximumFractionDigits = 2) {
  const safeValue = safeNumber(value);
  const fixed = safeValue.toFixed(maximumFractionDigits);
  const [whole, rawFraction] = fixed.split(".");
  const fraction = rawFraction?.replace(/0+$/, "");
  if (!whole || whole === "-") return "0";
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${grouped}.${fraction}` : grouped;
}

function safeNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
