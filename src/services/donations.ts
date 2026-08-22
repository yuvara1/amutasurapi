import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, isMock, type PaginatedResponse } from "@/infrastructure/api/client";
import { mockDonations, mockDelay } from "@/infrastructure/fixtures";
import type { Donation, Delivery } from "@/types";

type DonationScope = "mine" | "available" | "claimed";

export function useDonations(scope: DonationScope = "mine", status?: string) {
  return useQuery({
    queryKey: ["donations", scope, status],
    queryFn: async (): Promise<Donation[]> => {
      if (isMock) {
        await mockDelay(600);
        return mockDonations;
      }
      const qs = new URLSearchParams({ scope, limit: "50" });
      if (status) qs.set("status", status);
      const res = await api.get<PaginatedResponse<Donation>>(`/donations?${qs}`);
      return res.data;
    },
  });
}

export function usePublishDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      if (isMock) {
        await mockDelay(1200);
        return { id: `DON-2026-${String(Date.now()).slice(-6)}`, ...(data as object) };
      }
      return api.post<Donation>("/donations", data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["donations"] });
    },
  });
}

export function useAcceptDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (donationId: string) => {
      if (isMock) {
        await mockDelay(800);
        return {};
      }
      return api.post<{ donation: Donation; delivery: Delivery }>(`/donations/${donationId}/accept`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["donations"] });
      qc.invalidateQueries({ queryKey: ["deliveries"] });
    },
  });
}
