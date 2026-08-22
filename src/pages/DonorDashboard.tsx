import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { Package, TrendingUp, CheckCircle, Truck, Plus, ArrowRight, Clock, Calendar, UtensilsCrossed, Leaf, Sparkles } from "lucide-react";
import { AnimatedCounter } from "../components/ui/TextEffects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DonorDashboardProps {
  onNavigate: (page: string) => void;
}

const areaData = [
  { month: "Mar", kg: 820 },
  { month: "Apr", kg: 1240 },
  { month: "May", kg: 980 },
  { month: "Jun", kg: 1560 },
  { month: "Jul", kg: 2100 },
  { month: "Aug", kg: 1840 },
];

const pieData = [
  { name: "Delivered", value: 62, color: "#16a34a" },
  { name: "In transit", value: 14, color: "#0ea5e9" },
  { name: "Matched", value: 10, color: "#8b5cf6" },
  { name: "Published", value: 8, color: "#f59e0b" },
  { name: "Expired", value: 6, color: "#f43f5e" },
];

const recentDonations = [
  { id: "DON-2026-000124", food: "Assorted Produce Mix", qty: "48 kg", status: "delivered", ngo: "Community Kitchen", pickup: "Aug 18" },
  { id: "DON-2026-000123", food: "Bread & Pastries", qty: "22 kg", status: "pickup", ngo: "City Shelter NGO", pickup: "Aug 20, 2pm" },
  { id: "DON-2026-000122", food: "Dairy Products", qty: "31 kg", status: "matched", ngo: "Hope Foundation", pickup: "Aug 21, 10am" },
  { id: "DON-2026-000121", food: "Prepared Meals", qty: "120 portions", status: "published", ngo: "—", pickup: "Aug 21, 6pm" },
  { id: "DON-2026-000120", food: "Canned Goods", qty: "85 kg", status: "delivered", ngo: "Faith Community", pickup: "Aug 15" },
];

const upcomingPickups = [
  { id: "DON-2026-000123", food: "Bread & Pastries", time: "Today, 2:00 PM", ngo: "City Shelter NGO", address: "456 Oak Ave" },
  { id: "DON-2026-000121", food: "Prepared Meals", time: "Tomorrow, 6:00 PM", ngo: "Pending match", address: "123 Main St" },
];

const stats = [
  { label: "Total Donations", val: 124, icon: Package, gradient: "stat-gradient-green", delta: "+8 this month" },
  { label: "Food Rescued", val: 8400, icon: TrendingUp, gradient: "stat-gradient-sky", delta: "+1.2K this month" },
  { label: "Success Rate", val: 87, suffix: "%", icon: CheckCircle, gradient: "stat-gradient-violet", delta: "+2% vs last month" },
  { label: "Meals Distributed", val: 14280, icon: UtensilsCrossed, gradient: "stat-gradient-amber", delta: "+2K this month" },
  { label: "Active Now", val: 3, icon: Truck, gradient: "stat-gradient-rose", delta: "2 in transit" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

function Section({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function DonorDashboard({ onNavigate }: DonorDashboardProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-0">
      {/* ── Hero greeting banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 px-4 py-6 sm:px-6 sm:py-8">
        {/* Dot grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        {/* Glow orb */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                <Leaf size={12} className="text-white" />
              </div>
              <span className="text-white/60 text-xs font-medium">Food Donor</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{greeting}, Sarah</h1>
            <p className="text-white/60 text-sm mt-1">
              You&apos;ve rescued <span className="text-white font-semibold">8.4K kg</span> of food this year. Keep it up.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="self-start sm:self-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Button
                onClick={() => onNavigate("create-donation")}
                className="bg-white/95 text-brand-700 hover:bg-white dark:bg-white/90 dark:hover:bg-white font-semibold shadow-lg shadow-black/10 gap-1.5"
              >
                <Plus size={14} /> New Donation
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Micro-stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 flex gap-3 sm:gap-5 flex-wrap mt-6 pt-5 border-t border-white/15"
        >
          {[
            { label: "This month", val: "+1.2K kg" },
            { label: "Avg. match time", val: "34 min" },
            { label: "NGO network", val: "12 partners" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Sparkles size={10} className="text-white/40" />
              <span className="text-white font-semibold text-sm">{s.val}</span>
              <span className="text-white/40 text-xs">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Top stats */}
        <motion.div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4" initial="hidden" animate="visible">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.15)" }}
                className={`${s.gradient} rounded-xl p-4 text-white shadow-sm cursor-default${i === 4 ? " col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                    <Icon size={14} className="text-white" />
                  </div>
                  <span className="text-white/50 text-[10px] font-mono">{s.delta}</span>
                </div>
                <div className="font-bold text-2xl mb-0.5 leading-none tracking-tight">
                  <AnimatedCounter target={s.val} suffix={s.suffix ?? ""} />
                </div>
                <div className="text-white/75 text-xs mt-0.5">{s.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Activity chart */}
          <Section delay={0.05} className="lg:col-span-2">
            <Card>
              <CardHeader className="flex-row items-start justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight">Donation Activity</CardTitle>
                  <CardDescription className="mt-0.5">Food rescued (kg) — last 6 months</CardDescription>
                </div>
                <select className="fb-input w-auto text-xs py-1.5 px-2">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={areaData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }} formatter={(v) => [`${v} kg`, "Food rescued"]} />
                    <Area type="monotone" dataKey="kg" stroke="#16a34a" strokeWidth={2.5} fill="url(#greenGrad)" dot={{ r: 3, fill: "#16a34a" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Section>

          {/* Status distribution */}
          <Section delay={0.1}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold tracking-tight">Status Distribution</CardTitle>
                <CardDescription>All-time donation statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                      {pieData.map((_, i) => <Cell key={i} fill={pieData[i].color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--border)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {pieData.map((d, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-muted-foreground">{d.name}</span>
                      </div>
                      <span className="font-mono-data font-medium text-foreground">{d.value}%</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Section>
        </div>

        {/* Upcoming pickups */}
        <Section delay={0.1}>
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-semibold tracking-tight">Upcoming Pickups</CardTitle>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="sm" onClick={() => onNavigate("create-donation")} className="gap-1.5">
                  <Plus size={13} /> Create Donation
                </Button>
              </motion.div>
            </CardHeader>
            <CardContent>
              {upcomingPickups.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border-2 border-dashed border-brand-200 dark:border-brand-700/40 flex items-center justify-center mx-auto mb-4"
                  >
                    <Package size={22} className="text-brand-400" />
                  </motion.div>
                  <p className="font-semibold text-foreground">No upcoming pickups</p>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">Create your first donation to start rescuing food.</p>
                  <Button size="sm" onClick={() => onNavigate("create-donation")} className="gap-1.5">
                    <Plus size={13} /> Create Donation
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingPickups.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                        <Clock size={16} className="text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground">{p.food}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                          <Calendar size={10} />{p.time} · {p.address}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground mb-1">{p.ngo}</div>
                        <motion.button whileHover={{ scale: 1.05 }} onClick={() => onNavigate("donation-details")} className="text-xs text-primary font-semibold hover:text-primary/80">
                          View →
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Section>

        {/* Recent donations table */}
        <Section delay={0.15}>
          <Card className="overflow-hidden">
            <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border">
              <CardTitle className="text-lg font-semibold tracking-tight">Recent Donations</CardTitle>
              <motion.button whileHover={{ x: 2 }} onClick={() => onNavigate("donor-donations")} className="text-sm text-primary font-semibold hover:text-primary/80 flex items-center gap-1">
                View all <ArrowRight size={13} />
              </motion.button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Donation ID</TableHead>
                      <TableHead>Food</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>NGO</TableHead>
                      <TableHead>Pickup</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentDonations.map((d, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.05 }}
                        className="border-b border-border transition-colors hover:bg-muted/40 group"
                      >
                        <TableCell className="font-mono-data text-xs text-muted-foreground">{d.id}</TableCell>
                        <TableCell className="font-medium text-foreground">{d.food}</TableCell>
                        <TableCell className="font-mono-data text-xs">{d.qty}</TableCell>
                        <TableCell><span className={`badge badge-${d.status}`}>{d.status}</span></TableCell>
                        <TableCell className="text-muted-foreground text-xs">{d.ngo}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{d.pickup}</TableCell>
                        <TableCell>
                          <motion.button whileHover={{ scale: 1.05 }} onClick={() => onNavigate("donation-details")} className="text-xs text-primary font-semibold hover:text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity">
                            View →
                          </motion.button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </Section>
      </div>
    </div>
  );
}
