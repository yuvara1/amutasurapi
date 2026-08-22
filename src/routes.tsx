<<<<<<< HEAD
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useNav, PAGE_TO_PATH } from "@/hooks/useNav";
import AppLayout from "@/layouts/AppLayout";

const Landing = lazy(() => import("@/pages/Landing"));
const Auth = lazy(() => import("@/pages/Auth"));
const Contact = lazy(() => import("@/pages/Contact"));
const DonorDashboard = lazy(() => import("@/pages/DonorDashboard"));
const DonorDonations = lazy(() => import("@/pages/DonorDonations"));
const CreateDonation = lazy(() => import("@/pages/CreateDonation"));
const DonorImpact = lazy(() => import("@/pages/DonorImpact"));
const NGODashboard = lazy(() => import("@/pages/NGODashboard"));
const NGORequirements = lazy(() => import("@/pages/NGORequirements"));
const NGOAccepted = lazy(() => import("@/pages/NGOAccepted"));
const VolunteerDashboard = lazy(() => import("@/pages/VolunteerDashboard"));
const MyDeliveries = lazy(() => import("@/pages/MyDeliveries"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminMonitoring = lazy(() => import("@/pages/AdminMonitoring"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const AuditLogs = lazy(() => import("@/pages/AuditLogs"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

/* Wrappers that connect legacy onNavigate/onLogin props to router */

function LandingRoute() {
  const onNavigate = useNav();
  return <Suspense fallback={null}><Landing onNavigate={onNavigate} /></Suspense>;
}

function ContactRoute() {
  const onNavigate = useNav();
  return <Suspense fallback={null}><Contact onNavigate={onNavigate} /></Suspense>;
}

function LoginRoute() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const onNavigate = useNav();
  const handleLogin = (role: "donor" | "ngo" | "volunteer" | "admin") => {
    login(role);
    navigate(PAGE_TO_PATH[`${role}-dashboard`]);
  };
  return <Suspense fallback={null}><Auth mode="login" onNavigate={onNavigate} onLogin={handleLogin} /></Suspense>;
}

function RegisterRoute() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const onNavigate = useNav();
  const handleLogin = (role: "donor" | "ngo" | "volunteer" | "admin") => {
    login(role);
    navigate(PAGE_TO_PATH[`${role}-dashboard`]);
  };
  return <Suspense fallback={null}><Auth mode="register" onNavigate={onNavigate} onLogin={handleLogin} /></Suspense>;
}

/* Role-default redirect at /app */
=======
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

>>>>>>> origin/bw-redesign-clean
function AppIndex() {
  const { role } = useAuth();
  return <Navigate to={PAGE_TO_PATH[`${role}-dashboard`]} replace />;
}

<<<<<<< HEAD
/* Pages that still take onNavigate as a prop */
function WithNav<P extends { onNavigate: (p: string) => void }>(
  Component: React.ComponentType<P>,
  extraProps?: Omit<P, "onNavigate">
) {
  return function NavWrapped() {
    const onNavigate = useNav();
    return (
      <Suspense fallback={null}>
        <Component {...(extraProps as P)} onNavigate={onNavigate} />
      </Suspense>
    );
  };
}

const DonorDashboardRoute = WithNav(DonorDashboard);
const NGODashboardRoute = WithNav(NGODashboard);
const VolunteerDashboardRoute = WithNav(VolunteerDashboard);
const MyDeliveriesRoute = WithNav(MyDeliveries);
const AdminDashboardRoute = WithNav(AdminDashboard);
const CreateDonationRoute = WithNav(CreateDonation);
const AdminDonationsRoute = () => {
  return <Suspense fallback={null}><AdminMonitoring view="donations" /></Suspense>;
};
const AdminDeliveriesRoute = () => {
  return <Suspense fallback={null}><AdminMonitoring view="deliveries" /></Suspense>;
};

export const router = createBrowserRouter([
  { path: "/", Component: LandingRoute },
  { path: "/contact", Component: ContactRoute },
  { path: "/login", Component: LoginRoute },
  { path: "/register", Component: RegisterRoute },
=======
const AdminDonations   = () => <Wrap><AdminMonitoringD view="donations" /></Wrap>;
const AdminDeliveries  = () => <Wrap><AdminMonitoringD view="deliveries" /></Wrap>;

export const router = createBrowserRouter([
  { path: "/",        element: <Wrap><Landing /></Wrap> },
  { path: "/contact", element: <Wrap><Contact /></Wrap> },
  { path: "/login",   element: <Wrap><Auth mode="login" /></Wrap> },
  { path: "/register",element: <Wrap><Auth mode="register" /></Wrap> },
>>>>>>> origin/bw-redesign-clean
  {
    path: "/app",
    Component: AppLayout,
    children: [
      { index: true, Component: AppIndex },

      /* Donor */
<<<<<<< HEAD
      { path: "donor/dashboard", Component: DonorDashboardRoute },
      { path: "donor/donations", Component: DonorDonations },
      { path: "donor/create", Component: CreateDonationRoute },
      { path: "donor/impact", Component: DonorImpact },

      /* NGO */
      { path: "ngo/dashboard", Component: NGODashboardRoute },
      { path: "ngo/requirements", Component: NGORequirements },
      { path: "ngo/available", Component: NGODashboardRoute },
      { path: "ngo/accepted", Component: NGOAccepted },
      { path: "ngo/deliveries", Component: NGODashboardRoute },
      { path: "ngo/impact", Component: DonorImpact },

      /* Volunteer */
      { path: "volunteer/dashboard", Component: VolunteerDashboardRoute },
      { path: "volunteer/available", Component: VolunteerDashboardRoute },
      { path: "volunteer/my-deliveries", Component: MyDeliveriesRoute },
      { path: "volunteer/history", Component: MyDeliveriesRoute },

      /* Admin */
      { path: "admin/dashboard", Component: AdminDashboardRoute },
      { path: "admin/users", Component: AdminDashboardRoute },
      { path: "admin/orgs", Component: AdminDashboardRoute },
      { path: "admin/verify", Component: AdminDashboardRoute },
      { path: "admin/donations", Component: AdminDonationsRoute },
      { path: "admin/deliveries", Component: AdminDeliveriesRoute },
      { path: "admin/audit-logs", Component: AuditLogs },

      /* Shared */
      { path: "analytics", Component: Analytics },
      { path: "notifications", Component: Notifications },
      { path: "settings", Component: SettingsPage },
=======
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
>>>>>>> origin/bw-redesign-clean

      { path: "*", element: <Navigate to="/app" replace /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
