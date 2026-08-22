import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, isMock, type PaginatedResponse } from "@/infrastructure/api/client";
import { mockDelay } from "@/infrastructure/fixtures";
import type { Requirement } from "@/types";

export function useRequirements() {
  return useQuery({
    queryKey: ["requirements"],
    queryFn: async (): Promise<Requirement[]> => {
      if (isMock) {
        await mockDelay(400);
        return [];
      }
      const res = await api.get<PaginatedResponse<Requirement>>("/requirements?scope=mine");
      return res.data;
    },
  });
}

export function useCreateRequirement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Requirement, "id" | "ngoId" | "status">) => {
      if (isMock) {
        await mockDelay(800);
        return {};
      }
      return api.post("/requirements", data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requirements"] });
    },
  });
}
