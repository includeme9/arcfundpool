import { pools } from "@/lib/mock-data";

export function usePools() {
  return {
    data: pools,
    isLoading: false,
    error: null
  };
}
