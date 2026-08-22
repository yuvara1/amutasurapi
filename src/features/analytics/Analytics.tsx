import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, Leaf, UtensilsCrossed, Sprout, CheckCircle2, Zap, Truck, Timer, Star, BarChart2 } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MotionCard = motion.create(Card);
const MotionButton = motion.create(Button);

const foodRescuedData = [
  { month: "Mar", kg: 18200 },
  { month: "Apr", kg: 22400 },
  { month: "May", kg: 19800 },
  { month: "Jun", kg: 28600 },
  { month: "Jul", kg: 34200 },
  { month: "Aug", kg: 31800 },
];

const categoryData = [
  { name: "Produce", value: 38, color: "#16a34a" },
  { name: "Prepared Meals", value: 22, color: "#0ea5e9" },
  { name: "Bakery", value: 15, color: "#f59e0b" },
  { name: "Dairy", value: 12, color: "#8b5cf6" },
  { name: "Canned/Packaged", value: 9, color: "#f43f5e" },
  { name: "Other", value: 4, color: "#94a3b8" },
];

const ngoPerformance = [
  { name: "Community Kitchen", accepted: 142, delivered: 138 },
  { name: "Hope Foundation", accepted: 98, delivered: 94 },
  { name: "City Shelter", accepted: 76, delivered: 71 },
  { name: "Faith Community", accepted: 64, delivered: 62 },
  { name: "Metro Food Bank", accepted: 48, delivered: 45 },
];

const metrics = [
  { label: "Total Food Rescued", val: "284,500 kg", delta: "+12%", Icon: Leaf, color: "#16a34a" },
  { label: "Meals Distributed", val: "~48,200", delta: "+8%", Icon: UtensilsCrossed, color: "#0ea5e9" },
  { label: "Carbon Avoided", val: "142 tonnes CO₂", delta: "+11%", Icon: Sprout, color: "#22c55e" },
  { label: "Donation Success Rate", val: "87%", delta: "+2pp", Icon: CheckCircle2, color: "#16a34a" },
  { label: "Avg. Matching Time", val: "48 min", delta: "−12%", Icon: Zap, color: "#f59e0b" },
  { label: "Avg. Delivery Time", val: "61 min", delta: "−8%", Icon: Truck, color: "#8b5cf6" },
  { label: "Expiration Rate", val: "6.8%", delta: "−1.2pp", Icon: Timer, color: "#f43f5e" },
  { label: "Volunteer Completion", val: "96.2%", delta: "+0.8pp", Icon: Star, color: "#f59e0b" },
];

function Section({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Analytics() {
  return (
    <div className="space-y-0">
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-green-600 to-teal-500 px-6 py-8">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <motion.div className="absolute right-24 top-1/2 -translate-y-1/2 opacity-10" animate={{ rotate: [0, 360] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
          <BarChart2 size={72} className="text-white" />
        </motion.div>
        <div className="relative z-10 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                <Leaf size={12} className="text-white" />
              </div>
              <span className="text-white/60 text-xs font-medium">Analytics</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Impact Analytics</h1>
            <p className="text-white/60 text-sm mt-1">Platform-wide metrics and environmental impact data.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex gap-2">
            <Select defaultValue="6months">
              <SelectTrigger className="w-auto text-sm bg-white/10 text-white border-white/20 hover:bg-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <MotionButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="bg-white text-emerald-700 hover:bg-white/90 font-semibold shadow-lg shadow-black/10 flex items-center gap-1.5">
              <Download size={14} /> Export
            </MotionButton>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="relative z-10 flex gap-5 mt-6 pt-5 border-t border-white/15">
          {[{ label: "this month", val: "31,800 kg" }, { label: "CO₂ avoided", val: "142 t" }, { label: "success rate", val: "87%" }].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Sprout size={10} className="text-white/40" />
              <span className="text-white font-semibold text-sm">{s.val}</span>
              <span className="text-white/40 text-xs">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

    <div className="p-6 space-y-6">

      {/* Top metrics */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
        {metrics.map((m, i) => {
          const Icon = m.Icon;
          return (
            <MotionCard
              key={i}
              variants={{ hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } } }}
              whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(0,0,0,0.08)" }}
              className="cursor-default"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <motion.div whileHover={{ scale: 1.15, rotate: 5 }} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${m.color}18` }}>
                    <Icon size={16} style={{ color: m.color }} />
                  </motion.div>
                  <span className="text-xs font-semibold text-primary bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-full font-mono-data">{m.delta}</span>
                </div>
                <div className="text-lg font-semibold tracking-tight text-foreground">{m.val}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
              </CardContent>
            </MotionCard>
          );
        })}
      </motion.div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Section delay={0.05} className="lg:col-span-2">
          <Card>
            <div className="p-5 pb-4">
              <CardTitle>Food Rescued Over Time</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Total kg rescued per month — platform-wide</p>
            </div>
            <CardContent className="px-5 pb-5 pt-0">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={foodRescuedData}>
                  <defs>
                    <linearGradient id="impactGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} formatter={(v) => [`${Number(v).toLocaleString()} kg`, "Food rescued"]} />
                  <Area type="monotone" dataKey="kg" stroke="#16a34a" strokeWidth={2.5} fill="url(#impactGrad)" dot={{ r: 3, fill: "#16a34a" }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Section>

        <Section delay={0.1}>
          <Card>
            <div className="p-5 pb-4">
              <CardTitle>Donations by Category</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Share of food rescued by type</p>
            </div>
            <CardContent className="px-5 pb-5 pt-0">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={68} dataKey="value" strokeWidth={0}>
                    {categoryData.map((_, i) => <Cell key={i} fill={categoryData[i].color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--border)" }} formatter={(v) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categoryData.map((d, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-mono-data text-foreground">{d.value}%</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Section delay={0.08}>
          <Card>
            <div className="p-5 pb-4">
              <CardTitle>NGO Performance</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Accepted vs delivered donations — top 5 NGOs</p>
            </div>
            <CardContent className="px-5 pb-5 pt-0">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ngoPerformance} layout="vertical" barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} width={100} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--border)" }} />
                  <Bar dataKey="accepted" fill="#94a3b8" radius={[0, 4, 4, 0]} name="Accepted" />
                  <Bar dataKey="delivered" fill="#1E5C25" radius={[0, 4, 4, 0]} name="Delivered" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-3 h-2 bg-slate-200 dark:bg-slate-600 rounded" />Accepted
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-3 h-2 bg-primary rounded" />Delivered
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section delay={0.1}>
          <Card>
            <div className="p-5 pb-4">
              <CardTitle>Environmental Impact</CardTitle>
            </div>
            <CardContent className="px-5 pb-5 pt-0">
              <div className="space-y-5">
                {[
                  { label: "CO₂ emissions avoided", val: "142 tonnes", pct: 71, color: "#16a34a", sub: "Equivalent to 61 cars off the road for a year" },
                  { label: "Food waste diverted from landfill", val: "284,500 kg", pct: 85, color: "#0ea5e9", sub: "vs. same period last year" },
                  { label: "Water saved (embedded)", val: "~2.8M liters", pct: 60, color: "#8b5cf6", sub: "Estimated based on food categories rescued" },
                ].map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground font-medium">{m.label}</span>
                      <span className="font-semibold tracking-tight text-foreground">{m.val}</span>
                    </div>
                    <div className="progress-bar mb-1">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${m.pct}%` }}
                        transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                        style={{ background: m.color }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{m.sub}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>
      </div>
    </div>
    </div>
  );
}
