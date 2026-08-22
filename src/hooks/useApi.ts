import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, isMock, PaginatedResponse } from "@/lib/api";

/* ── Shared types ─────────────────────────────────────────────────────────── */

export interface Donation {
  id: string;
  title: string;
  category: string;
  quantity: string;
  status: "pending" | "matched" | "in_transit" | "completed" | "expired";
  ngo?: string;
  date: string;
  expiry: string;
  impact?: string;
}

export interface NotificationItem {
  id: number;
  cat: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface DeliveryStats {
  completed: number;
  inProgress: number;
  totalKg: number;
  rating: number;
}

export interface Delivery {
  id: string;
  donationId: string;
  ngoId: string;
  volunteerId?: string;
  status: "unassigned" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled";
  pickup: { address: string; lat: number; lng: number; window: [string, string] };
  dropoff: { address: string; lat: number; lng: number };
  etaMinutes?: number;
  proofPhotoUrl?: string;
  assignedAt?: string;
  completedAt?: string;
}

export interface Requirement {
  id: string;
  ngoId: string;
  category: string;
  quantityNeeded: string;
  neededBy: string;
  notes?: string;
  status: "open" | "partially_met" | "fulfilled";
}

export interface ImpactStats {
  totalKgRescued: number;
  mealsServed: number;
  donationsCompleted: number;
  co2AvoidedKg: number;
  ngosServed: number;
  monthly: Array<{ month: string; kg: number; meals: number }>;
}

export interface AdminOverview {
  totalDonations: number;
  activeDonations: number;
  totalKgRescued: number;
  mealsServed: number;
  orgs: { donors: number; ngos: number; pendingVerification: number };
  volunteers: { active: number; onDelivery: number };
  matchRate: number;
  avgDeliveryMinutes: number;
}

/* ── Mock data ────────────────────────────────────────────────────────────── */

function seededRnd(s: number) { let x = Math.sin(s) * 10000; return x - Math.floor(x); }
function pickSeeded<T>(arr: T[], seed: number): T { return arr[Math.floor(seededRnd(seed) * arr.length)]; }

const categories = ["Produce", "Bakery", "Dairy", "Prepared Meals", "Canned Goods", "Meat & Protein", "Beverages", "Snacks"];
const ngoNames = ["Community Kitchen", "Hope Foundation", "City Shelter", "Faith Community", "Metro Food Bank", "Sunrise Care", "Bay Volunteers", "Family First NGO", "Ocean View Shelter", "Urban Harvest"];
const foodNames = ["Assorted Produce Mix", "Sourdough Bread Assortment", "Greek Yogurt Cases", "Seasonal Fruit Mix", "Prepared Pasta Meals", "Mixed Sandwiches", "Fresh Vegetable Crates", "Bakery Pastry Box", "Dairy Pack Surplus", "Canned Bean Assortment", "Frozen Chicken Portions", "Rice & Lentils Bulk", "Organic Salad Mix", "Artisan Bread Loaves", "Fruit Juice Cases", "Snack Variety Packs", "Cooked Rice Trays", "Cheese Wheel Assortment", "Muffin & Croissant Box", "Protein Bar Surplus"];
const statuses: Donation["status"][] = ["pending", "matched", "in_transit", "completed", "completed", "completed", "expired"];
const times = ["2h ago", "5h ago", "Yesterday", "Aug 19", "Aug 18", "Aug 17", "Aug 16", "Aug 15", "Aug 14", "Aug 13", "Aug 12", "Aug 10", "Aug 8", "Aug 5", "Aug 1"];
const expiries = ["Today 6 PM", "Tonight 8 PM", "Tomorrow 10 AM", "Aug 22 6 PM", "Aug 23", "Aug 24", "Expired", "—"];

const mockDonations: Donation[] = Array.from({ length: 120 }, (_, i) => {
  const s = 37 + i * 11;
  const status = pickSeeded(statuses, s);
  const cat = pickSeeded(categories, s + 1);
  const qty = Math.floor(seededRnd(s + 2) * 90) + 10;
  const ngo = ["matched", "in_transit", "completed"].includes(status) ? pickSeeded(ngoNames, s + 3) : undefined;
  return {
    id: `DON-2026-${String(119 + i).padStart(6, "0")}`,
    title: pickSeeded(foodNames, s + 4),
    category: cat,
    quantity: `${qty} ${cat === "Prepared Meals" || cat === "Snacks" ? "portions" : "kg"}`,
    status,
    ngo,
    date: pickSeeded(times, s + 5),
    expiry: status === "completed" || status === "expired" ? "—" : pickSeeded(expiries.slice(0, 6), s + 6),
    impact: status === "completed" ? `${qty * 2} meals` : undefined,
  };
});

const mockNotifications: NotificationItem[] = [
  { id: 1,  cat: "matches",   icon: "zap",    title: "New donation matched",        body: "DON-2026-000125 matched with Community Kitchen (94% score)",           time: "5 min ago",  read: false },
  { id: 2,  cat: "deliveries",icon: "truck",  title: "Volunteer assigned",          body: "Alex Rivera assigned to DEL-2026-000088. Pickup at 5:30 PM",          time: "22 min ago", read: false },
  { id: 3,  cat: "donations", icon: "check",  title: "NGO accepted your donation",  body: "Community Kitchen accepted DON-2026-000124 (48 kg)",                  time: "1h ago",     read: false },
  { id: 4,  cat: "deliveries",icon: "party",  title: "Delivery completed",          body: "DEL-2026-000085 completed. 48 kg delivered to Community Kitchen",     time: "3h ago",     read: true  },
  { id: 5,  cat: "donations", icon: "clock",  title: "Donation expiring soon",      body: "DON-2026-000126 expires in 4 hours. No match found yet",              time: "4h ago",     read: true  },
  { id: 6,  cat: "system",    icon: "shield", title: "Organization verified",       body: "Green Harvest Co. has been verified by our platform team",            time: "1d ago",     read: true  },
  { id: 7,  cat: "donations", icon: "x",      title: "Donation expired",            body: "DON-2026-000119 expired without a match",                             time: "2d ago",     read: true  },
  { id: 8,  cat: "deliveries",icon: "camera", title: "Pickup confirmed",            body: "Volunteer confirmed pickup of DON-2026-000124. Currently in transit", time: "2d ago",     read: true  },
  { id: 9,  cat: "matches",   icon: "zap",    title: "High-confidence match found", body: "DON-2026-000118 matched with Hope Foundation (89% score)",            time: "3d ago",     read: true  },
  { id: 10, cat: "system",    icon: "shield", title: "Monthly impact report ready", body: "Your August impact report is ready. 284 kg rescued, 96 meals served", time: "4d ago",     read: true  },
];

const mockDeliveryStats: DeliveryStats = { completed: 247, inProgress: 3, totalKg: 8640, rating: 4.9 };

const mockImpact: ImpactStats = {
  totalKgRescued: 8640, mealsServed: 17280, donationsCompleted: 247,
  co2AvoidedKg: 21600, ngosServed: 18,
  monthly: [
    { month: "2026-08", kg: 284, meals: 96 },
    { month: "2026-07", kg: 320, meals: 640 },
    { month: "2026-06", kg: 291, meals: 582 },
  ],
};

const mockAdminOverview: AdminOverview = {
  totalDonations: 4820, activeDonations: 63,
  totalKgRescued: 184320, mealsServed: 368640,
  orgs: { donors: 142, ngos: 88, pendingVerification: 7 },
  volunteers: { active: 210, onDelivery: 14 },
  matchRate: 0.91, avgDeliveryMinutes: 34,
};

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/* ── Hooks ────────────────────────────────────────────────────────────────── */

/** Donor + NGO: list donations. scope = mine | available | claimed */
export function useDonations(scope: "mine" | "available" | "claimed" = "mine", status?: string) {
  return useQuery({
    queryKey: ["donations", scope, status],
    queryFn: async (): Promise<Donation[]> => {
      if (isMock) { await delay(600); return mockDonations; }
      const qs = new URLSearchParams({ scope, limit: "50" });
      if (status) qs.set("status", status);
      const res = await api.get<PaginatedResponse<Donation>>(`/donations?${qs}`);
      return res.data;
    },
  });
}

/** Notifications list — polls every 30 s, falls back to WS push. */
export function useNotificationsQuery() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<NotificationItem[]> => {
      if (isMock) { await delay(400); return mockNotifications; }
      const res = await api.get<PaginatedResponse<NotificationItem>>("/notifications?limit=50");
      return res.data;
    },
    refetchInterval: 30_000,
  });
}

/** Volunteer KPIs — used by VolunteerDashboard + RightPanel. */
export function useDeliveryStats() {
  return useQuery({
    queryKey: ["delivery-stats"],
    queryFn: async (): Promise<DeliveryStats> => {
      if (isMock) { await delay(500); return mockDeliveryStats; }
      return api.get<DeliveryStats>("/volunteers/me/stats");
    },
  });
}

/** Donor/NGO impact page. */
export function useImpactStats() {
  return useQuery({
    queryKey: ["impact"],
    queryFn: async (): Promise<ImpactStats> => {
      if (isMock) { await delay(500); return mockImpact; }
      return api.get<ImpactStats>("/donors/me/impact");
    },
  });
}

/** Admin overview KPIs. */
export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: async (): Promise<AdminOverview> => {
      if (isMock) { await delay(600); return mockAdminOverview; }
      return api.get<AdminOverview>("/admin/overview");
    },
  });
}

/** Volunteer: list of deliveries. scope = available | mine */
export function useDeliveries(scope: "available" | "mine" = "mine", status?: string) {
  return useQuery({
    queryKey: ["deliveries", scope, status],
    queryFn: async (): Promise<Delivery[]> => {
      if (isMock) { await delay(500); return []; }
      const qs = new URLSearchParams({ scope, limit: "50" });
      if (status) qs.set("status", status);
      const res = await api.get<PaginatedResponse<Delivery>>(`/deliveries?${qs}`);
      return res.data;
    },
  });
}

/** NGO requirements list. */
export function useRequirements() {
  return useQuery({
    queryKey: ["requirements"],
    queryFn: async (): Promise<Requirement[]> => {
      if (isMock) { await delay(400); return []; }
      const res = await api.get<PaginatedResponse<Requirement>>("/requirements?scope=mine");
      return res.data;
    },
  });
}

/* ── Mutations ────────────────────────────────────────────────────────────── */

export function usePublishDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      if (isMock) { await delay(1200); return { id: `DON-2026-${String(Date.now()).slice(-6)}`, ...data as object }; }
      return api.post<Donation>("/donations", data);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["donations"] }); },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (isMock) { await delay(100); return id; }
      await api.post(`/notifications/${id}/read`);
      return id;
    },
    onSuccess: (id) => {
      qc.setQueryData<NotificationItem[]>(["notifications"], old =>
        old?.map(n => n.id === id ? { ...n, read: true } : n),
      );
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (isMock) { await delay(200); return; }
      await api.post("/notifications/read-all");
    },
    onSuccess: () => {
      qc.setQueryData<NotificationItem[]>(["notifications"], old =>
        old?.map(n => ({ ...n, read: true })),
      );
    },
  });
}

export function useAcceptDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (donationId: string) => {
      if (isMock) { await delay(800); return {}; }
      return api.post<{ donation: Donation; delivery: Delivery }>(`/donations/${donationId}/accept`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["donations"] });
      qc.invalidateQueries({ queryKey: ["deliveries"] });
    },
  });
}

export function useAcceptDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (deliveryId: string) => {
      if (isMock) { await delay(800); return {}; }
      return api.post(`/deliveries/${deliveryId}/accept`);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["deliveries"] }); },
  });
}

export function useCompleteDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ deliveryId, proofPhotoUrl }: { deliveryId: string; proofPhotoUrl?: string }) => {
      if (isMock) { await delay(1000); return {}; }
      return api.post(`/deliveries/${deliveryId}/complete`, { proofPhotoUrl });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deliveries"] });
      qc.invalidateQueries({ queryKey: ["delivery-stats"] });
    },
  });
}

export function useCreateRequirement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Requirement, "id" | "ngoId" | "status">) => {
      if (isMock) { await delay(800); return {}; }
      return api.post("/requirements", data);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["requirements"] }); },
  });
}

export function useVerifyOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orgId: string) => {
      if (isMock) { await delay(600); return {}; }
      return api.post(`/admin/organizations/${orgId}/verify`);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-overview"] }); },
  });
}
