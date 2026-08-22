import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, isMock, type PaginatedResponse } from "@/infrastructure/api/client";
import { mockNotifications, mockDelay } from "@/infrastructure/fixtures";
import type { NotificationItem } from "@/types";

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<NotificationItem[]> => {
      if (isMock) {
        await mockDelay(400);
        return mockNotifications;
      }
      const res = await api.get<PaginatedResponse<NotificationItem>>("/notifications?limit=50");
      return res.data;
    },
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (isMock) {
        await mockDelay(100);
        return id;
      }
      await api.post(`/notifications/${id}/read`);
      return id;
    },
    onSuccess: (id) => {
      qc.setQueryData<NotificationItem[]>(["notifications"], old =>
        old?.map(n => (n.id === id ? { ...n, read: true } : n)),
      );
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (isMock) {
        await mockDelay(200);
        return;
      }
      await api.post("/notifications/read-all");
    },
    onSuccess: () => {
      qc.setQueryData<NotificationItem[]>(["notifications"], old =>
        old?.map(n => ({ ...n, read: true })),
      );
    },
  });
}
