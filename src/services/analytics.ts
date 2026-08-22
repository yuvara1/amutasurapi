import { useQuery } from "@tanstack/react-query";
import { api, isMock } from "@/infrastructure/api/client";
import { mockImpact, mockDelay } from "@/infrastructure/fixtures";
import type { ImpactStats } from "@/types";

export function useImpactStats() {
  return useQuery({
    queryKey: ["impact"],
    queryFn: async (): Promise<ImpactStats> => {
      if (isMock) {
        await mockDelay(500);
        return mockImpact;
      }
      return api.get<ImpactStats>("/donors/me/impact");
    },
  });
}
