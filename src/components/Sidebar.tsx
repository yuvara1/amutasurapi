import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Plus, Building2, BarChart3,
  Bell, Settings, ClipboardList, Truck, MapPin,
  Users, ShieldCheck, FileText, LogOut, Leaf, X,
} from "lucide-react";
import { Sidebar, DesktopSidebar, useSidebar } from "./ui/sidebar";
import { cn } from "@/lib/utils";

type Role = "donor" | "ngo" | "volunteer" | "admin";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  page: string;
  badge?: number;
}

const navByRole: Record<Role, NavItem[]> = {
  donor: [
    { icon: <LayoutDashboard size={16} />, label: "Dashboard",       page: "donor-dashboard" },
    { icon: <Package size={16} />,         label: "My Donations",    page: "donor-donations" },
    { icon: <Plus size={16} />,            label: "Create Donation", page: "create-donation" },
    { icon: <Building2 size={16} />,       label: "Organization",    page: "donor-org" },
    { icon: <BarChart3 size={16} />,       label: "Impact",          page: "donor-impact" },
    { icon: <Bell size={16} />,            label: "Notifications",   page: "notifications", badge: 3 },
    { icon: <Settings size={16} />,        label: "Settings",        page: "settings" },
  ],
  ngo: [
    { icon: <LayoutDashboard size={16} />, label: "Dashboard",          page: "ngo-dashboard" },
    { icon: <ClipboardList size={16} />,   label: "Food Requirements",  page: "ngo-requirements" },
    { icon: <Package size={16} />,         label: "Available Donations",page: "ngo-available" },
    { icon: <ShieldCheck size={16} />,     label: "Accepted Donations", page: "ngo-accepted" },
    { icon: <Truck size={16} />,           label: "Deliveries",         page: "ngo-deliveries" },
    { icon: <BarChart3 size={16} />,       label: "Impact",             page: "ngo-impact" },
    { icon: <Bell size={16} />,            label: "Notifications",      page: "notifications", badge: 5 },
    { icon: <Settings size={16} />,        label: "Settings",           page: "settings" },
  ],
  volunteer: [
    { icon: <LayoutDashboard size={16} />, label: "Dashboard",          page: "volunteer-dashboard" },
    { icon: <Package size={16} />,         label: "Available Deliveries",page: "available-deliveries" },
    { icon: <Truck size={16} />,           label: "My Deliveries",      page: "my-deliveries" },
    { icon: <MapPin size={16} />,          label: "Live Tracking",      page: "delivery-tracking" },
    { icon: <BarChart3 size={16} />,       label: "History",            page: "delivery-history" },
    { icon: <Bell size={16} />,            label: "Notifications",      page: "notifications", badge: 2 },
    { icon: <Settings size={16} />,        label: "Settings",           page: "settings" },
  ],
  admin: [
    { icon: <LayoutDashboard size={16} />, label: "Dashboard",     page: "admin-dashboard" },
    { icon: <Users size={16} />,           label: "Users",         page: "admin-users" },
    { icon: <Building2 size={16} />,       label: "Organizations", page: "admin-orgs" },
    { icon: <ShieldCheck size={16} />,     label: "Verification",  page: "admin-verify" },
    { icon: <Package size={16} />,         label: "Donations",     page: "admin-donations" },
    { icon: <Truck size={16} />,           label: "Deliveries",    page: "admin-deliveries" },
    { icon: <BarChart3 size={16} />,       label: "Analytics",     page: "analytics" },
    { icon: <FileText size={16} />,        label: "Audit Logs",    page: "audit-logs" },
    { icon: <Bell size={16} />,            label: "Notifications", page: "notifications", badge: 7 },
    { icon: <Settings size={16} />,        label: "Settings",      page: "settings" },
  ],
};

const rolePips: Record<Role, string> = {
  donor: "#1E5C25", ngo: "#1B7FAE", volunteer: "#B57A10", admin: "#6E4FCC",
};
const roleNames: Record<Role, string> = {
  donor: "Donor", ngo: "NGO", volunteer: "Volunteer", admin: "Admin",
};
const userNames: Record<Role, string> = {
  donor: "Green Harvest Co.", ngo: "Community Kitchen",
  volunteer: "Alex Rivera", admin: "Platform Admin",
};
const userEmails: Record<Role, string> = {
  donor: "donor@greenharvest.org", ngo: "ops@commkitchen.org",
  volunteer: "alex@email.com", admin: "admin@foodbridge.io",
};
const userInitials: Record<Role, string> = {
  donor: "GH", ngo: "CK", volunteer: "AR", admin: "PA",
};

interface ContentProps {
  role: Role;
  currentPage: string;
  onNavigate: (page: string) => void;
  onClose?: () => void;
  /** When true show labels; when false show icons only (collapsed state). */
  expanded: boolean;
}

/**
 * Pure nav content — no sidebar context dependency.
 * Used in both the desktop sidebar and the App.tsx mobile drawer.
 */
export function SidebarNavContent({
  role, currentPage, onNavigate, onClose, expanded,
}: ContentProps) {
  const navItems = navByRole[role];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-card border-r border-border">
      {/* Logo — h-14 matches Header height so borders align */}
      <div className="h-14 shrink-0 flex items-center px-3.5 gap-2.5 border-b border-border">
        <motion.button
          onClick={() => onNavigate("landing")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2.5 shrink-0"
          title={!expanded ? "FoodBridge" : undefined}
        >
          <div
            className="w-7 h-7 shrink-0 rounded-md flex items-center justify-center"
            style={{ background: "#1E5C25" }}
          >
            <Leaf size={14} className="text-white" strokeWidth={2} />
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap font-serif italic font-semibold text-foreground leading-none"
                style={{
                  fontSize: "16px",
                  fontVariationSettings: "'opsz' 40, 'wght' 600",
                }}
              >
                FoodBridge
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors shrink-0"
          >
            <X size={14} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Role indicator */}
      <div className="px-2 pt-3 pb-1.5 overflow-hidden">
        <div className="flex items-center gap-2 pl-[14px]">
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: rolePips[role] }} />
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden whitespace-nowrap text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {roleNames[role]}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2 pt-0.5">
        {navItems.map((item, i) => {
          const isActive = currentPage === item.page;
          return (
            <motion.button
              key={item.page}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.03 + i * 0.025, duration: 0.22 }}
              onClick={() => onNavigate(item.page)}
              whileTap={{ scale: 0.97 }}
              title={!expanded ? item.label : undefined}
              className={cn(
                "sidebar-link w-full mb-0.5",
                isActive && "active"
              )}
            >
              <span className={cn("shrink-0 transition-colors", isActive ? "text-primary" : "text-foreground/60")}>{item.icon}</span>

              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    className={cn(
                      "overflow-hidden whitespace-nowrap flex-1 text-left text-[12.5px]",
                      isActive ? "text-primary font-semibold" : "text-foreground/75"
                    )}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {item.badge && expanded && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                  className="w-[17px] h-[17px] rounded-full text-white flex items-center justify-center shrink-0"
                  style={{
                    background: "#D63A4E", fontSize: "9px",
                    fontWeight: 700, fontFamily: "var(--font-display)",
                  }}
                >
                  {item.badge}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="h-px bg-border mx-2.5" />

      {/* Profile footer */}
      <div className="p-2.5">
        <motion.button
          onClick={() => onNavigate("settings")}
          whileHover={{ backgroundColor: "var(--muted)" }}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md w-full transition-colors overflow-hidden"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
            style={{ background: "var(--primary)", fontFamily: "var(--font-display)" }}
          >
            {userInitials[role]}
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="flex-1 min-w-0 text-left overflow-hidden"
              >
                <span
                  className="block text-[11.5px] font-semibold text-foreground truncate leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {userNames[role]}
                </span>
                <span
                  className="block text-[10px] text-muted-foreground truncate leading-tight"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {userEmails[role]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {expanded && <LogOut size={11} className="text-muted-foreground/50 shrink-0" />}
        </motion.button>
      </div>
    </div>
  );
}

/**
 * Desktop sidebar that collapses to icons on mouse-leave
 * and expands on hover. Hidden on mobile (md:flex).
 */
function DesktopSidebarInner({ role, currentPage, onNavigate }: Omit<ContentProps, "expanded" | "onClose">) {
  const { open } = useSidebar();
  return (
    <SidebarNavContent
      role={role}
      currentPage={currentPage}
      onNavigate={onNavigate}
      expanded={open}
    />
  );
}

interface AppSidebarProps {
  role: Role;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function AppSidebar({ role, currentPage, onNavigate }: AppSidebarProps) {
  return (
    <Sidebar animate={true}>
      <DesktopSidebar>
        <DesktopSidebarInner role={role} currentPage={currentPage} onNavigate={onNavigate} />
      </DesktopSidebar>
    </Sidebar>
  );
}
