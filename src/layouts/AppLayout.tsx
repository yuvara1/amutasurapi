import { Suspense, lazy, useState } from "react";
import { Outlet, useLocation, useNavigate, Navigate } from "react-router";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useNav, PATH_TO_PAGE } from "@/hooks/useNav";
import AppSidebar, { SidebarNavContent } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import RightPanel from "@/components/layout/RightPanel";
import Modal from "@/components/layout/Modal";

const DeliveryTracking = lazy(() => import("@/features/deliveries/DeliveryTracking"));
const DonationDetails = lazy(() => import("@/features/donations/DonationDetails"));

const breadcrumbs: Record<string, string[]> = {
  "donor-dashboard":    ["Donor", "Dashboard"],
  "donor-donations":    ["Donor", "My Donations"],
  "create-donation":    ["Donor", "Create Donation"],
  "donor-impact":       ["Donor", "Impact"],
  "ngo-dashboard":      ["NGO", "Dashboard"],
  "ngo-requirements":   ["NGO", "Food Requirements"],
  "ngo-accepted":       ["NGO", "Accepted Donations"],
  "ngo-impact":         ["NGO", "Impact"],
  "volunteer-dashboard":["Volunteer", "Dashboard"],
  "my-deliveries":      ["Volunteer", "My Deliveries"],
  "admin-dashboard":    ["Admin", "Dashboard"],
  "admin-donations":    ["Admin", "Donation Monitoring"],
  "admin-deliveries":   ["Admin", "Delivery Monitoring"],
  "audit-logs":         ["Admin", "Audit Logs"],
  analytics:            ["Analytics"],
  notifications:        ["Notifications"],
  settings:             ["Settings"],
};

function PageSkeleton() {
  return (
    <div className="p-6 space-y-5 animate-pulse">
      <div className="h-32 rounded-xl bg-muted" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-muted" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-64 rounded-xl bg-muted" />
        <div className="h-64 rounded-xl bg-muted" />
      </div>
    </div>
  );
}

function Shell() {
  const { containerRef } = useTheme();
  const { role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const onNavigate = useNav();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const modal = searchParams.get("modal");

  const currentPage = PATH_TO_PAGE[location.pathname] ?? "";
  const crumbs = breadcrumbs[currentPage] ?? [currentPage];

  const closeModal = () => {
    searchParams.delete("modal");
    const qs = searchParams.toString();
    navigate(`${location.pathname}${qs ? `?${qs}` : ""}`, { replace: true });
  };

  return (
    <MotionConfig transition={isMobile ? { duration: 0.12, ease: "easeOut" } : undefined}>
      <div ref={containerRef} className="flex h-screen bg-background overflow-hidden">
        <AppSidebar currentPage={currentPage} onNavigate={onNavigate} />

        {/* Mobile sidebar drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
              />
              <motion.div
                key="drawer"
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="fixed inset-y-0 left-0 z-50 md:hidden shadow-xl w-[224px]"
              >
                <SidebarNavContent
                  currentPage={currentPage}
                  onNavigate={(p) => { onNavigate(p); setSidebarOpen(false); }}
                  onClose={() => setSidebarOpen(false)}
                  expanded={true}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            title={crumbs[crumbs.length - 1]}
            breadcrumb={crumbs}
            onMenuToggle={() => setSidebarOpen(true)}
            onNavigate={onNavigate}
          />
          <div className="flex-1 flex min-h-0 overflow-hidden">
            <main className="flex-1 overflow-y-auto min-w-0 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <Suspense fallback={<PageSkeleton />}>
                    <Outlet />
                  </Suspense>
                </motion.div>
              </AnimatePresence>
            </main>
            <RightPanel role={role} onNavigate={onNavigate} />
          </div>
        </div>

        <Modal open={modal === "donation-details"} onClose={closeModal} size="xl">
          <Suspense fallback={null}>
            <DonationDetails />
          </Suspense>
        </Modal>
        <Modal open={modal === "delivery-tracking"} onClose={closeModal} size="xl">
          <Suspense fallback={null}>
            <DeliveryTracking />
          </Suspense>
        </Modal>
      </div>
    </MotionConfig>
  );
}

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}
