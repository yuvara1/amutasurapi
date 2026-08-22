import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Plus, BarChart3,
  Bell, Settings, ClipboardList, Truck, MapPin,
  ShieldCheck, FileText, LogOut, Leaf, X,
} from "lucide-react";
import { Sidebar, DesktopSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "@/types";

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
    { icon: <BarChart3 size={16} />,       label: "Impact",          page: "donor-impact" },
    { icon: <Bell size={16} />,            label: "Notifications",   page: "notifications", badge: 3 },
    { icon: <Settings size={16} />,        label: "Settings",        page: "settings" },
  ],
  ngo: [
    { icon: <LayoutDashboard size={16} />, label: "Dashboard",          page: "ngo-dashboard" },
    { icon: <ClipboardList size={16} />,   label: "Food Requirements",  page: "ngo-requirements" },
    { icon: <ShieldCheck size={16} />,     label: "Accepted Donations", page: "ngo-accepted" },
    { icon: <BarChart3 size={16} />,       label: "Impact",             page: "ngo-impact" },
    { icon: <Bell size={16} />,            label: "Notifications",      page: "notifications", badge: 5 },
    { icon: <Settings size={16} />,        label: "Settings",           page: "settings" },
  ],
  volunteer: [
    { icon: <LayoutDashboard size={16} />, label: "Dashboard",     page: "volunteer-dashboard" },
    { icon: <Truck size={16} />,           label: "My Deliveries", page: "my-deliveries" },
    { icon: <MapPin size={16} />,          label: "Live Tracking", page: "delivery-tracking" },
    { icon: <Bell size={16} />,            label: "Notifications", page: "notifications", badge: 2 },
    { icon: <Settings size={16} />,        label: "Settings",      page: "settings" },
  ],
  admin: [
    { icon: <LayoutDashboard size={16} />, label: "Dashboard",     page: "admin-dashboard" },
    { icon: <Package size={16} />,         label: "Donations",     page: "admin-donations" },
    { icon: <Truck size={16} />,           label: "Deliveries",    page: "admin-deliveries" },
    { icon: <BarChart3 size={16} />,       label: "Analytics",     page: "analytics" },
    { icon: <FileText size={16} />,        label: "Audit Logs",    page: "audit-logs" },
    { icon: <Bell size={16} />,            label: "Notifications", page: "notifications", badge: 7 },
    { icon: <Settings size={16} />,        label: "Settings",      page: "settings" },
  ],
};


const roleLabels: Record<Role, string> = {
  donor: "Donor", ngo: "NGO", volunteer: "Volunteer", admin: "Admin",
};

const fallbackIdentity: Record<Role, { name: string; email: string; initials: string }> = {
  donor:     { name: "Green Harvest Co.",   email: "donor@greenharvest.org",  initials: "GH" },
  ngo:       { name: "Community Kitchen",   email: "ops@commkitchen.org",     initials: "CK" },
  volunteer: { name: "Alex Rivera",         email: "alex@email.com",          initials: "AR" },
  admin:     { name: "Platform Admin",      email: "admin@foodbridge.io",     initials: "PA" },
};

interface ContentProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onClose?: () => void;
  expanded: boolean;
}

export function SidebarNavContent({ currentPage, onNavigate, onClose, expanded }: ContentProps) {
  const { role, user, logout } = useAuth();
  const navItems = navByRole[role];
  const identity = user ?? fallbackIdentity[role];
  const initials = user?.initials ?? fallbackIdentity[role].initials;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-card border-r border-border">
      {/* Logo */}
      <div className="h-14 shrink-0 flex items-center px-3.5 gap-2.5 border-b border-border">
        <motion.button
          onClick={() => onNavigate("landing")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2.5 shrink-0"
          title={!expanded ? "FoodBridge" : undefined}
        >
          <div
            className="w-7 h-7 shrink-0 rounded-md flex items-center justify-center bg-foreground"
          >
            <Leaf size={14} className="text-background" strokeWidth={2} />
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap font-serif italic font-semibold text-foreground leading-none"
                style={{ fontSize: "16px", fontVariationSettings: "'opsz' 40, 'wght' 600" }}
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
          <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-foreground" />
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
                {roleLabels[role]}
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
              className={cn("sidebar-link w-full mb-0.5", isActive && "active")}
            >
              <span className={cn("shrink-0 transition-colors", isActive ? "text-primary" : "text-foreground/60")}>
                {item.icon}
              </span>

              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    className={cn(
                      "overflow-hidden whitespace-nowrap flex-1 text-left text-[12.5px]",
                      isActive ? "text-primary font-semibold" : "text-foreground/75",
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
                  className="w-[17px] h-[17px] rounded-full bg-foreground text-background flex items-center justify-center shrink-0"
                  style={{ fontSize: "9px", fontWeight: 700, fontFamily: "var(--font-display)" }}
                >
                  {item.badge}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="h-px bg-border mx-2.5" />

      {/* Profile footer */}
      <div className="p-2.5">
        <motion.button
          onClick={() => logout()}
          whileHover={{ backgroundColor: "var(--muted)" }}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md w-full transition-colors overflow-hidden"
          title={!expanded ? `${identity.name} — click to sign out` : undefined}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold bg-foreground text-background"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {initials}
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
                  {identity.name}
                </span>
                <span
                  className="block text-[10px] text-muted-foreground truncate leading-tight"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {identity.email}
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

function DesktopSidebarInner({ currentPage, onNavigate }: Pick<ContentProps, "currentPage" | "onNavigate">) {
  return (
    <SidebarNavContent
      currentPage={currentPage}
      onNavigate={onNavigate}
      expanded={true}
    />
  );
}

interface AppSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  return (
    <Sidebar open={true} animate={false}>
      <DesktopSidebar>
        <DesktopSidebarInner currentPage={currentPage} onNavigate={onNavigate} />
      </DesktopSidebar>
    </Sidebar>
  );
}
