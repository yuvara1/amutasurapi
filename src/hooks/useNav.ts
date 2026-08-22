import { useNavigate, useLocation } from "react-router";

export const PAGE_TO_PATH: Record<string, string> = {
  landing: "/",
  contact: "/contact",
  login: "/login",
  register: "/register",
  auth: "/login",
  "donor-dashboard": "/app/donor/dashboard",
  "donor-donations": "/app/donor/donations",
  "create-donation": "/app/donor/create",
  "donor-org": "/app/donor/dashboard",
  "donor-impact": "/app/donor/impact",
  "ngo-dashboard": "/app/ngo/dashboard",
  "ngo-requirements": "/app/ngo/requirements",
  "ngo-available": "/app/ngo/available",
  "ngo-accepted": "/app/ngo/accepted",
  "ngo-deliveries": "/app/ngo/deliveries",
  "ngo-impact": "/app/ngo/impact",
  "volunteer-dashboard": "/app/volunteer/dashboard",
  "available-deliveries": "/app/volunteer/available",
  "my-deliveries": "/app/volunteer/my-deliveries",
  "delivery-history": "/app/volunteer/history",
  "admin-dashboard": "/app/admin/dashboard",
  "admin-users": "/app/admin/users",
  "admin-orgs": "/app/admin/orgs",
  "admin-verify": "/app/admin/verify",
  "admin-donations": "/app/admin/donations",
  "admin-deliveries": "/app/admin/deliveries",
  "audit-logs": "/app/admin/audit-logs",
  analytics: "/app/analytics",
  notifications: "/app/notifications",
  settings: "/app/settings",
};

export const PATH_TO_PAGE: Record<string, string> = Object.fromEntries(
  Object.entries(PAGE_TO_PATH)
    .filter(([, v]) => v.startsWith("/app"))
    .map(([k, v]) => [v, k])
);

const MODAL_PAGES = new Set(["donation-details", "delivery-tracking"]);

export function useNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (page: string) => {
    if (MODAL_PAGES.has(page)) {
      const params = new URLSearchParams(location.search);
      params.set("modal", page);
      navigate(`${location.pathname}?${params.toString()}`);
      return;
    }
    const path = PAGE_TO_PATH[page];
    if (path) navigate(path);
  };
}
