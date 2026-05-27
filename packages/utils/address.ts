export function shortenAddress(address?: string, chars = 4) {
  if (!address) return "Not connected";
  if (address.length <= chars * 2 + 4) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
