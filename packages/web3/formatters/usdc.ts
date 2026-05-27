import { parseUnits, formatUnits } from "viem";
import { USDC_TOKEN } from "@arcfundpool/config";

export function parseUSDC(value: string) {
  return parseUnits(value, USDC_TOKEN.decimals);
}

export function formatUSDCUnits(value: bigint) {
  return formatUnits(value, USDC_TOKEN.decimals);
}
