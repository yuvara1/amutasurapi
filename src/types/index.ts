export type Role = "donor" | "ngo" | "volunteer" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: Role;
  orgId?: string;
  orgName?: string;
  avatarUrl?: string;
  verified: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  orgName?: string;
}

export type DonationStatus = "pending" | "matched" | "in_transit" | "completed" | "expired";

export interface Donation {
  id: string;
  title: string;
  category: string;
  quantity: string;
  status: DonationStatus;
  ngo?: string;
  date: string;
  expiry: string;
  impact?: string;
}

export type DeliveryStatus =
  | "unassigned"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface Delivery {
  id: string;
  donationId: string;
  ngoId: string;
  volunteerId?: string;
  status: DeliveryStatus;
  pickup: { address: string; lat: number; lng: number; window: [string, string] };
  dropoff: { address: string; lat: number; lng: number };
  etaMinutes?: number;
  proofPhotoUrl?: string;
  assignedAt?: string;
  completedAt?: string;
}

export type RequirementStatus = "open" | "partially_met" | "fulfilled";

export interface Requirement {
  id: string;
  ngoId: string;
  category: string;
  quantityNeeded: string;
  neededBy: string;
  notes?: string;
  status: RequirementStatus;
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
