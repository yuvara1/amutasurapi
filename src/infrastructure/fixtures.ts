import type { Donation, NotificationItem, DeliveryStats, ImpactStats, AdminOverview } from "@/types";

/* ── Seeded pseudo-random helpers ────────────────────────────── */

function seededRnd(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickSeeded<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRnd(seed) * arr.length)];
}

/* ── Reference data ──────────────────────────────────────────── */

const CATEGORIES = [
  "Produce", "Bakery", "Dairy", "Prepared Meals",
  "Canned Goods", "Meat & Protein", "Beverages", "Snacks",
];

const NGO_NAMES = [
  "Community Kitchen", "Hope Foundation", "City Shelter", "Faith Community",
  "Metro Food Bank", "Sunrise Care", "Bay Volunteers", "Family First NGO",
  "Ocean View Shelter", "Urban Harvest",
];

const FOOD_NAMES = [
  "Assorted Produce Mix", "Sourdough Bread Assortment", "Greek Yogurt Cases",
  "Seasonal Fruit Mix", "Prepared Pasta Meals", "Mixed Sandwiches",
  "Fresh Vegetable Crates", "Bakery Pastry Box", "Dairy Pack Surplus",
  "Canned Bean Assortment", "Frozen Chicken Portions", "Rice & Lentils Bulk",
  "Organic Salad Mix", "Artisan Bread Loaves", "Fruit Juice Cases",
  "Snack Variety Packs", "Cooked Rice Trays", "Cheese Wheel Assortment",
  "Muffin & Croissant Box", "Protein Bar Surplus",
];

const STATUSES: Donation["status"][] = [
  "pending", "matched", "in_transit", "completed", "completed", "completed", "expired",
];

const RELATIVE_TIMES = [
  "2h ago", "5h ago", "Yesterday", "Aug 19", "Aug 18", "Aug 17",
  "Aug 16", "Aug 15", "Aug 14", "Aug 13", "Aug 12", "Aug 10",
  "Aug 8", "Aug 5", "Aug 1",
];

const EXPIRY_LABELS = [
  "Today 6 PM", "Tonight 8 PM", "Tomorrow 10 AM",
  "Aug 22 6 PM", "Aug 23", "Aug 24",
];

/* ── Fixture generators ──────────────────────────────────────── */

export const mockDonations: Donation[] = Array.from({ length: 120 }, (_, i) => {
  const seed = 37 + i * 11;
  const status = pickSeeded(STATUSES, seed);
  const category = pickSeeded(CATEGORIES, seed + 1);
  const qty = Math.floor(seededRnd(seed + 2) * 90) + 10;
  const ngo = ["matched", "in_transit", "completed"].includes(status)
    ? pickSeeded(NGO_NAMES, seed + 3)
    : undefined;

  return {
    id: `DON-2026-${String(119 + i).padStart(6, "0")}`,
    title: pickSeeded(FOOD_NAMES, seed + 4),
    category,
    quantity: `${qty} ${category === "Prepared Meals" || category === "Snacks" ? "portions" : "kg"}`,
    status,
    ngo,
    date: pickSeeded(RELATIVE_TIMES, seed + 5),
    expiry: ["completed", "expired"].includes(status)
      ? "—"
      : pickSeeded(EXPIRY_LABELS, seed + 6),
    impact: status === "completed" ? `${qty * 2} meals` : undefined,
  };
});

export const mockNotifications: NotificationItem[] = [
  { id: 1,  cat: "matches",    icon: "zap",    title: "New donation matched",        body: "DON-2026-000125 matched with Community Kitchen (94% score)",           time: "5 min ago",  read: false },
  { id: 2,  cat: "deliveries", icon: "truck",  title: "Volunteer assigned",          body: "Alex Rivera assigned to DEL-2026-000088. Pickup at 5:30 PM",          time: "22 min ago", read: false },
  { id: 3,  cat: "donations",  icon: "check",  title: "NGO accepted your donation",  body: "Community Kitchen accepted DON-2026-000124 (48 kg)",                  time: "1h ago",     read: false },
  { id: 4,  cat: "deliveries", icon: "party",  title: "Delivery completed",          body: "DEL-2026-000085 completed. 48 kg delivered to Community Kitchen",     time: "3h ago",     read: true  },
  { id: 5,  cat: "donations",  icon: "clock",  title: "Donation expiring soon",      body: "DON-2026-000126 expires in 4 hours. No match found yet",              time: "4h ago",     read: true  },
  { id: 6,  cat: "system",     icon: "shield", title: "Organization verified",       body: "Green Harvest Co. has been verified by our platform team",            time: "1d ago",     read: true  },
  { id: 7,  cat: "donations",  icon: "x",      title: "Donation expired",            body: "DON-2026-000119 expired without a match",                             time: "2d ago",     read: true  },
  { id: 8,  cat: "deliveries", icon: "camera", title: "Pickup confirmed",            body: "Volunteer confirmed pickup of DON-2026-000124. Currently in transit", time: "2d ago",     read: true  },
  { id: 9,  cat: "matches",    icon: "zap",    title: "High-confidence match found", body: "DON-2026-000118 matched with Hope Foundation (89% score)",            time: "3d ago",     read: true  },
  { id: 10, cat: "system",     icon: "shield", title: "Monthly impact report ready", body: "Your August impact report is ready. 284 kg rescued, 96 meals served", time: "4d ago",     read: true  },
];

export const mockDeliveryStats: DeliveryStats = {
  completed: 247,
  inProgress: 3,
  totalKg: 8640,
  rating: 4.9,
};

export const mockImpact: ImpactStats = {
  totalKgRescued: 8640,
  mealsServed: 17280,
  donationsCompleted: 247,
  co2AvoidedKg: 21600,
  ngosServed: 18,
  monthly: [
    { month: "2026-08", kg: 284, meals: 96 },
    { month: "2026-07", kg: 320, meals: 640 },
    { month: "2026-06", kg: 291, meals: 582 },
  ],
};

export const mockAdminOverview: AdminOverview = {
  totalDonations: 4820,
  activeDonations: 63,
  totalKgRescued: 184320,
  mealsServed: 368640,
  orgs: { donors: 142, ngos: 88, pendingVerification: 7 },
  volunteers: { active: 210, onDelivery: 14 },
  matchRate: 0.91,
  avgDeliveryMinutes: 34,
};

export const mockDelay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
