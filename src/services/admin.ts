import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, isMock } from "@/infrastructure/api/client";
import { mockAdminOverview, mockDelay } from "@/infrastructure/fixtures";
import type { AdminOverview } from "@/types";

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: async (): Promise<AdminOverview> => {
      if (isMock) {
        await mockDelay(600);
        return mockAdminOverview;
      }
      return api.get<AdminOverview>("/admin/overview");
    },
  });
}

export function useVerifyOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orgId: string) => {
      if (isMock) {
        await mockDelay(600);
        return {};
      }
      return api.post(`/admin/organizations/${orgId}/verify`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });
}
