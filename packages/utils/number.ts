export function formatUSDC(value: number, maximumFractionDigits = 2) {
  return `${formatNumber(value, maximumFractionDigits)} USDC`;
}

export function progressPercent(raised: number, target: number) {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((raised / target) * 100));
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  const fixed = value.toFixed(maximumFractionDigits);
  const trimmed = fixed.replace(/\.?0+$/, "");
  const [whole, fraction] = trimmed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${grouped}.${fraction}` : grouped;
}
