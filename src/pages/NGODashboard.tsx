import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Package, Truck, Filter, Search, ArrowRight, Target, CheckCircle, Clock, Handshake, Wheat, MapPin, Timer, ShoppingBag, Leaf } from "lucide-react";
import { AnimatedCounter } from "../components/ui/TextEffects";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NGODashboardProps {
  onNavigate: (page: string) => void;
}

const weeklyData = [
  { day: "Mon", kg: 180 },
  { day: "Tue", kg: 290 },
  { day: "Wed", kg: 140 },
  { day: "Thu", kg: 380 },
  { day: "Fri", kg: 220 },
  { day: "Sat", kg: 310 },
  { day: "Sun", kg: 95 },
];

const availableDonations = [
  { id: "DON-2026-000121", food: "Prepared Meals", qty: "120 portions", donor: "The Grand Hotel", distance: "1.2 km", expiry: "6h 30m", pickup: "Today, 6:00 PM", score: 96, tags: ["Halal", "Gluten-free"], urgent: true },
  { id: "DON-2026-000118", food: "Bakery Surplus", qty: "35 kg", donor: "City Bakehouse", distance: "3.4 km", expiry: "1d 4h", pickup: "Tomorrow, 8:00 AM", score: 88, tags: ["Vegetarian"], urgent: false },
  { id: "DON-2026-000115", food: "Canned Vegetables", qty: "62 kg", donor: "MegaMart Distribution", distance: "6.7 km", expiry: "14d", pickup: "Aug 22, 10:00 AM", score: 82, tags: ["Vegan", "Gluten-free"], urgent: false },
];

const stats = [
  { label: "Active Requirements", val: 4, icon: Target, gradient: "stat-gradient-sky", delta: "Updated today" },
  { label: "Available Matches", val: 12, icon: Handshake, gradient: "stat-gradient-violet", delta: "+3 new" },
  { label: "Accepted Donations", val: 38, icon: CheckCircle, gradient: "stat-gradient-green", delta: "This month" },
  { label: "Pending Pickups", val: 3, icon: Clock, gradient: "stat-gradient-amber", delta: "1 urgent" },
  { label: "Food Received", val: 2100, icon: Wheat, gradient: "stat-gradient-rose", delta: "kg total" },
  { label: "Meals Distributed", val: 7400, icon: ShoppingBag, gradient: "stat-gradient-green", delta: "to community" },
];

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

export default function NGODashboard({ onNavigate }: NGODashboardProps) {
  return (
    <div className="space-y-0">
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-700 via-sky-600 to-blue-500 px-4 py-6 sm:px-6 sm:py-8">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                <Leaf size={12} className="text-white" />
              </div>
              <span className="text-white/60 text-xs font-medium">NGO Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Community Kitchen</h1>
            <p className="text-white/60 text-sm mt-1">
              <span className="text-white font-semibold">12 donations</span> available and matched to your requirements.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="self-start sm:self-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Button onClick={() => onNavigate("ngo-requirements")} className="bg-white/95 text-sky-700 hover:bg-white dark:bg-white/90 dark:hover:bg-white font-semibold shadow-lg shadow-black/10 gap-1.5">
                <Target size={14} /> Manage Requirements
              </Button>
            </motion.div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="relative z-10 flex gap-4 sm:gap-5 mt-4 sm:mt-6 overflow-x-auto pt-5 border-t border-white/15">
          {[{ label: "Capacity", val: "200 kg" }, { label: "Accept rate", val: "97%" }, { label: "Avg. response", val: "18 min" }].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <CheckCircle size={10} className="text-white/40" />
              <span className="text-white font-semibold text-sm">{s.val}</span>
              <span className="text-white/40 text-xs">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Stats */}
        <motion.div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4" initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i}
                variants={{ hidden: { opacity: 0, y: 24, scale: 0.94 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}
                whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.15)" }}
                className={`${s.gradient} rounded-xl p-4 text-white shadow-sm cursor-default`}
              >
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center mb-3">
                  <Icon size={14} className="text-white" />
                </div>
                <div className="text-2xl font-bold tracking-tight text-white mb-0.5 leading-none">
                  <AnimatedCounter target={s.val} />
                </div>
                <div className="text-white/75 text-xs font-medium">{s.label}</div>
                <div className="text-white/40 text-[10px] mt-0.5">{s.delta}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Chart + Pending */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          <Section delay={0.05} className="lg:col-span-2">
            <Card className="shadow-sm h-full">
              <CardHeader className="pb-2 border-b border-border">
                <CardTitle className="text-base">Weekly Food Received</CardTitle>
                <CardDescription>Kilograms received per day this week</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData} barSize={28}>
                    <defs>
                      <linearGradient id="skyBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} formatter={(v) => [`${v} kg`, "Received"]} />
                    <Bar dataKey="kg" fill="url(#skyBar)" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Section>

          <Section delay={0.1}>
            <Card className="shadow-sm h-full">
              <CardHeader className="pb-2 border-b border-border">
                <CardTitle className="text-base">Pending Pickups</CardTitle>
                <CardDescription>Scheduled for collection</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {[
                    { food: "Prepared Meals", donor: "Grand Hotel", time: "Today 6PM", status: "accepted", urgent: true },
                    { food: "Fresh Produce", donor: "Green Harvest", time: "Tomorrow 2PM", status: "accepted", urgent: false },
                    { food: "Bakery Items", donor: "City Bakehouse", time: "Aug 22 8AM", status: "matched", urgent: false },
                  ].map((p, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                      whileHover={{ x: 4 }}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-all ${p.urgent ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50" : "bg-muted"}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${p.urgent ? "bg-amber-100 dark:bg-amber-900/30" : "bg-sky-100 dark:bg-sky-900/30"}`}>
                        <Truck size={13} className={p.urgent ? "text-amber-600 dark:text-amber-400" : "text-sky-600 dark:text-sky-400"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-foreground">{p.food}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Timer size={9} /> {p.time}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{p.donor}</div>
                      </div>
                      <span className={`badge badge-${p.status} text-[10px] shrink-0`}>{p.status}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Section>
        </div>

        {/* Available donations */}
        <Section delay={0.1}>
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <CardTitle className="text-base">Available Donations</CardTitle>
                  <CardDescription className="mt-0.5">Matched to your requirements · 12 available</CardDescription>
                </div>
                <motion.button whileHover={{ x: 2 }} onClick={() => onNavigate("ngo-available")} className="text-sm text-primary font-semibold hover:opacity-80 flex items-center gap-1">
                  View all <ArrowRight size={13} />
                </motion.button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="search" placeholder="Search donations..." className="pl-8 h-8 text-xs" />
                </div>
                <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5 shrink-0">
                  <Filter size={12} /> Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-5 space-y-3 sm:space-y-4">
              {availableDonations.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(0,0,0,0.08)" }}
                  className={`border rounded-xl p-3 sm:p-4 transition-all ${d.urgent ? "border-amber-200 dark:border-amber-800/50 bg-amber-50/60 dark:bg-amber-900/15" : "border-border bg-card"}`}
                >
                  {/* Top row: icon + title/tags + match score */}
                  <div className="flex items-start gap-3">
                    <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${d.urgent ? "bg-amber-100 dark:bg-amber-900/30" : "bg-primary/10"}`}>
                      <Package size={18} className={d.urgent ? "text-amber-600 dark:text-amber-400" : "text-primary"} />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground text-sm">{d.food}</span>
                          {d.urgent && <span className="badge badge-pickup">Urgent</span>}
                        </div>
                        {/* Match score — top right on all sizes */}
                        <div className="flex items-baseline gap-0.5 shrink-0">
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 300 }}
                            className="text-xl sm:text-2xl font-bold tracking-tight text-primary leading-none">{d.score}%</motion.span>
                          <span className="text-[10px] text-muted-foreground">match</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-1 mb-2">
                        {d.tags.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-full border border-border">{t}</span>
                        ))}
                      </div>

                      {/* Meta info — wraps naturally */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Wheat size={10} /> {d.qty}</span>
                        <span className="flex items-center gap-1"><Package size={10} /> {d.donor}</span>
                        <span className="flex items-center gap-1"><MapPin size={10} /> {d.distance}</span>
                        <span className="flex items-center gap-1"><Timer size={10} /> {d.expiry}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {d.pickup}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons — full width row on mobile */}
                  <div className="flex gap-2 mt-3 sm:justify-end">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1 sm:flex-none">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs py-1.5 px-3 h-auto" onClick={() => onNavigate("donation-details")}>View</Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(22,163,74,0.3)" }} whileTap={{ scale: 0.97 }} className="flex-1 sm:flex-none">
                      <Button size="sm" className="w-full sm:w-auto text-xs py-1.5 px-3 h-auto">Accept</Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </Section>
      </div>
    </div>
  );
}
