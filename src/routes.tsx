import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { PAGE_TO_PATH } from "@/hooks/useNav";
import AppLayout from "@/layouts/AppLayout";

const Landing          = lazy(() => import("@/features/public/Landing"));
const Contact          = lazy(() => import("@/features/public/Contact"));
const Auth             = lazy(() => import("@/features/auth/Auth"));
const DonorDashboard   = lazy(() => import("@/features/dashboard/DonorDashboard"));
const NGODashboard     = lazy(() => import("@/features/dashboard/NGODashboard"));
const VolunteerDashboard = lazy(() => import("@/features/dashboard/VolunteerDashboard"));
const AdminDashboard   = lazy(() => import("@/features/dashboard/AdminDashboard"));
const DonorDonations   = lazy(() => import("@/features/donations/DonorDonations"));
const CreateDonation   = lazy(() => import("@/features/donations/CreateDonation"));
const DonorImpact      = lazy(() => import("@/features/impact/DonorImpact"));
const NGORequirements  = lazy(() => import("@/features/requirements/NGORequirements"));
const NGOAccepted      = lazy(() => import("@/features/donations/NGOAccepted"));
const MyDeliveries     = lazy(() => import("@/features/deliveries/MyDeliveries"));
const AdminMonitoringD = lazy(() => import("@/features/admin/AdminMonitoring"));
const AuditLogs        = lazy(() => import("@/features/admin/AuditLogs"));
const Analytics        = lazy(() => import("@/features/analytics/Analytics"));
const Notifications    = lazy(() => import("@/features/notifications/Notifications"));
const SettingsPage     = lazy(() => import("@/features/settings/SettingsPage"));

function Wrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

function AppIndex() {
  const { role } = useAuth();
  return <Navigate to={PAGE_TO_PATH[`${role}-dashboard`]} replace />;
}

const AdminDonations   = () => <Wrap><AdminMonitoringD view="donations" /></Wrap>;
const AdminDeliveries  = () => <Wrap><AdminMonitoringD view="deliveries" /></Wrap>;

export const router = createBrowserRouter([
  { path: "/",        element: <Wrap><Landing /></Wrap> },
  { path: "/contact", element: <Wrap><Contact /></Wrap> },
  { path: "/login",   element: <Wrap><Auth mode="login" /></Wrap> },
  { path: "/register",element: <Wrap><Auth mode="register" /></Wrap> },
  {
    path: "/app",
    Component: AppLayout,
    children: [
      { index: true, Component: AppIndex },

      /* Donor */
      { path: "donor/dashboard", element: <Wrap><DonorDashboard /></Wrap> },
      { path: "donor/donations", element: <Wrap><DonorDonations /></Wrap> },
      { path: "donor/create",    element: <Wrap><CreateDonation /></Wrap> },
      { path: "donor/impact",    element: <Wrap><DonorImpact /></Wrap> },

      /* NGO */
      { path: "ngo/dashboard",   element: <Wrap><NGODashboard /></Wrap> },
      { path: "ngo/requirements",element: <Wrap><NGORequirements /></Wrap> },
      { path: "ngo/accepted",    element: <Wrap><NGOAccepted /></Wrap> },
      { path: "ngo/impact",      element: <Wrap><DonorImpact /></Wrap> },

      /* Volunteer */
      { path: "volunteer/dashboard",   element: <Wrap><VolunteerDashboard /></Wrap> },
      { path: "volunteer/my-deliveries", element: <Wrap><MyDeliveries /></Wrap> },

      /* Admin */
      { path: "admin/dashboard",  element: <Wrap><AdminDashboard /></Wrap> },
      { path: "admin/donations",  element: <AdminDonations /> },
      { path: "admin/deliveries", element: <AdminDeliveries /> },
      { path: "admin/audit-logs", element: <Wrap><AuditLogs /></Wrap> },

      /* Shared */
      { path: "analytics",    element: <Wrap><Analytics /></Wrap> },
      { path: "notifications",element: <Wrap><Notifications /></Wrap> },
      { path: "settings",     element: <Wrap><SettingsPage /></Wrap> },

      { path: "*", element: <Navigate to="/app" replace /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
