import { motion } from "framer-motion";
import { Clock, CheckCircle2, Package, Truck, Handshake, Bell, ArrowRight, TrendingUp, Zap, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Role = "donor" | "ngo" | "volunteer" | "admin";

interface RightPanelProps {
  role: Role;
  onNavigate: (page: string) => void;
}

const quickActions: Record<Role, { label: string; icon: React.ElementType; page: string; accent: string }[]> = {
  donor: [
    { label: "New Donation", icon: Package, page: "create-donation", accent: "#16a34a" },
    { label: "View Impact", icon: TrendingUp, page: "donor-impact", accent: "#0ea5e9" },
    { label: "Notifications", icon: Bell, page: "notifications", accent: "#f59e0b" },
  ],
  ngo: [
    { label: "Browse Donations", icon: Package, page: "ngo-available", accent: "#16a34a" },
    { label: "Requirements", icon: CheckCircle2, page: "ngo-requirements", accent: "#0ea5e9" },
    { label: "Notifications", icon: Bell, page: "notifications", accent: "#f59e0b" },
  ],
  volunteer: [
    { label: "Find Deliveries", icon: Truck, page: "available-deliveries", accent: "#16a34a" },
    { label: "My Deliveries", icon: CheckCircle2, page: "my-deliveries", accent: "#0ea5e9" },
    { label: "Notifications", icon: Bell, page: "notifications", accent: "#f59e0b" },
  ],
  admin: [
    { label: "Verification", icon: Handshake, page: "admin-verify", accent: "#16a34a" },
    { label: "Analytics", icon: TrendingUp, page: "analytics", accent: "#0ea5e9" },
    { label: "Audit Logs", icon: Zap, page: "audit-logs", accent: "#f59e0b" },
  ],
};

const recentActivity: Record<Role, { icon: React.ElementType; text: string; time: string; color: string }[]> = {
  donor: [
    { icon: CheckCircle2, text: "DON-000124 delivered", time: "2h ago", color: "#16a34a" },
    { icon: Handshake, text: "Community Kitchen accepted", time: "5h ago", color: "#0ea5e9" },
    { icon: Package, text: "DON-000123 matched", time: "1d ago", color: "#8b5cf6" },
    { icon: Truck, text: "Volunteer assigned", time: "1d ago", color: "#f59e0b" },
  ],
  ngo: [
    { icon: Package, text: "12 new donations available", time: "Just now", color: "#16a34a" },
    { icon: Truck, text: "Pickup arriving in 18 min", time: "Live", color: "#f59e0b" },
    { icon: CheckCircle2, text: "DON-000122 delivered", time: "3h ago", color: "#16a34a" },
    { icon: Bell, text: "Requirement matched", time: "6h ago", color: "#0ea5e9" },
  ],
  volunteer: [
    { icon: CheckCircle2, text: "DEL-000085 completed", time: "2h ago", color: "#16a34a" },
    { icon: Truck, text: "New delivery nearby", time: "5 min ago", color: "#f59e0b" },
    { icon: TrendingUp, text: "Rating updated: 4.9★", time: "1d ago", color: "#8b5cf6" },
    { icon: Bell, text: "Pickup confirmed", time: "2d ago", color: "#0ea5e9" },
  ],
  admin: [
    { icon: Handshake, text: "Metro Food Bank pending", time: "1h ago", color: "#f59e0b" },
    { icon: CheckCircle2, text: "City Shelter verified", time: "3h ago", color: "#16a34a" },
    { icon: Zap, text: "API p99 latency: 42ms", time: "Live", color: "#0ea5e9" },
    { icon: Bell, text: "Login failure detected", time: "6h ago", color: "#f43f5e" },
  ],
};

const upcomingItems: Record<Role, { label: string; sub: string; time: string }[]> = {
  donor: [
    { label: "Bread & Pastries", sub: "Expiring soon", time: "Today 6PM" },
    { label: "Pickup window", sub: "DON-000125", time: "Aug 21 2PM" },
  ],
  ngo: [
    { label: "Grand Hotel pickup", sub: "120 portions", time: "Today 6PM" },
    { label: "Green Harvest", sub: "Fresh Produce", time: "Tomorrow 2PM" },
  ],
  volunteer: [
    { label: "DEL-000088 pickup", sub: "5.2 km away", time: "Today 5:30PM" },
    { label: "Available run", sub: "3 new nearby", time: "Now" },
  ],
  admin: [
    { label: "Verification review", sub: "3 pending", time: "Today" },
    { label: "Weekly report", sub: "Platform metrics", time: "Aug 21" },
  ],
};

export default function RightPanel({ role, onNavigate }: RightPanelProps) {
  const actions = quickActions[role];
  const activity = recentActivity[role];
  const upcoming = upcomingItems[role];

  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="hidden xl:flex flex-col w-64 shrink-0 border-l border-border bg-card h-full overflow-y-auto"
    >
      <div className="flex flex-col p-4 gap-4 min-h-full">

        {/* Quick Actions */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2 px-1">Quick Actions</p>
          <div className="space-y-1">
            {actions.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.button
                  key={i}
                  onClick={() => onNavigate(a.page)}
                  whileHover={{ x: 3, backgroundColor: "var(--muted)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors group"
                >
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: `${a.accent}18` }}>
                    <Icon size={12} style={{ color: a.accent }} />
                  </div>
                  <span className="text-xs font-medium text-foreground group-hover:text-foreground">{a.label}</span>
                  <ArrowRight size={10} className="ml-auto text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Upcoming */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2 px-1">Upcoming</p>
          <div className="space-y-2">
            {upcoming.map((u, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                className="flex items-start gap-2 px-2.5 py-2 rounded-lg bg-muted/50">
                <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar size={10} className="text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate leading-tight">{u.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{u.sub}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 font-medium">{u.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Activity</p>
            <motion.button whileHover={{ x: 1 }} onClick={() => onNavigate("notifications")} className="text-[10px] text-primary font-semibold hover:opacity-80 flex items-center gap-0.5">
              All <ArrowRight size={9} />
            </motion.button>
          </div>
          <div className="space-y-1">
            {activity.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
                  className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${a.color}15` }}>
                    <Icon size={10} style={{ color: a.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-foreground leading-snug">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground">{a.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Platform status — pushed to bottom */}
        <div className="flex-1" />
        <Card className="border-border shadow-none">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              Platform Status
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-1.5">
            {[
              { label: "Matching engine", val: "Online" },
              { label: "Notifications", val: "Online" },
              { label: "API", val: "99.99%" },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{s.label}</span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{s.val}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={() => onNavigate("notifications")}>
          <Bell size={11} className="mr-1.5" /> View all notifications
        </Button>

      </div>
    </motion.aside>

  );
}
