import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, isMock, type PaginatedResponse } from "@/infrastructure/api/client";
import { mockDeliveryStats, mockDelay } from "@/infrastructure/fixtures";
import type { Delivery, DeliveryStats } from "@/types";

type DeliveryScope = "available" | "mine";

export function useDeliveries(scope: DeliveryScope = "mine", status?: string) {
  return useQuery({
    queryKey: ["deliveries", scope, status],
    queryFn: async (): Promise<Delivery[]> => {
      if (isMock) {
        await mockDelay(500);
        return [];
      }
      const qs = new URLSearchParams({ scope, limit: "50" });
      if (status) qs.set("status", status);
      const res = await api.get<PaginatedResponse<Delivery>>(`/deliveries?${qs}`);
      return res.data;
    },
  });
}

export function useDeliveryStats() {
  return useQuery({
    queryKey: ["delivery-stats"],
    queryFn: async (): Promise<DeliveryStats> => {
      if (isMock) {
        await mockDelay(500);
        return mockDeliveryStats;
      }
      return api.get<DeliveryStats>("/volunteers/me/stats");
    },
  });
}

export function useAcceptDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (deliveryId: string) => {
      if (isMock) {
        await mockDelay(800);
        return {};
      }
      return api.post(`/deliveries/${deliveryId}/accept`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deliveries"] });
    },
  });
}

export function useCompleteDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ deliveryId, proofPhotoUrl }: { deliveryId: string; proofPhotoUrl?: string }) => {
      if (isMock) {
        await mockDelay(1000);
        return {};
      }
      return api.post(`/deliveries/${deliveryId}/complete`, { proofPhotoUrl });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deliveries"] });
      qc.invalidateQueries({ queryKey: ["delivery-stats"] });
    },
  });
}
