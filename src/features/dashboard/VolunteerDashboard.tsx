import { useRef } from "react";
import { useNav } from "@/hooks/useNav";
import { motion, useInView } from "framer-motion";
import { Truck, MapPin, Star, ArrowRight, Navigation, Package, CheckCircle, Wheat, Trophy, Calendar, Leaf, Zap } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/TextEffects";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const availableDeliveries = [
  { id: "DEL-2026-000088", food: "Prepared Meals · 120 portions", pickup: "The Grand Hotel, 45 Union St", dropoff: "Community Kitchen, 78 Market St", distance: "3.2 km", duration: "18 min", window: "Today, 5:30–7:00 PM", priority: "urgent", weight: "38 kg" },
  { id: "DEL-2026-000087", food: "Fresh Produce · 48 kg", pickup: "Green Harvest, 123 Main St", dropoff: "Hope Foundation, 200 Pine Ave", distance: "5.8 km", duration: "24 min", window: "Tomorrow, 2:00–4:00 PM", priority: "normal", weight: "48 kg" },
  { id: "DEL-2026-000086", food: "Bakery Items · 22 kg", pickup: "City Bakehouse, 89 Oak Lane", dropoff: "Faith Community, 310 Elm Blvd", distance: "7.1 km", duration: "31 min", window: "Aug 22, 8:00–10:00 AM", priority: "normal", weight: "22 kg" },
];

const myDeliveries = [
  { id: "DEL-2026-000085", food: "Produce Mix", status: "active", eta: "12 min to dropoff", phase: "in_transit" },
];

const stats = [
  { label: "Available",      val: 14,  icon: Package,     gradient: "stat-gradient-sky",    delta: "Near you" },
  { label: "Active Delivery",val: 1,   icon: Truck,       gradient: "stat-gradient-amber",  delta: "In transit" },
  { label: "Completed",      val: 234, icon: CheckCircle, gradient: "stat-gradient-green",  delta: "All time" },
  { label: "Food Delivered", val: 2800,icon: Wheat,       gradient: "stat-gradient-violet", delta: "kg total" },
  { label: "Rating",         val: 49,  icon: Trophy,      gradient: "stat-gradient-rose",   delta: "Out of 5.0" },
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

export default function VolunteerDashboard() {
  const navigate = useNav();
  return (
    <div className="space-y-0">
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-foreground px-4 py-6 sm:px-6 sm:py-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -inset-8"
            style={{
              backgroundImage: "radial-gradient(circle, color-mix(in srgb, var(--background) 40%, transparent) 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
            }}
            animate={{ x: [0, 28], y: [0, 28] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-background/5 blur-3xl pointer-events-none" />
        <motion.div
          className="hidden sm:block absolute right-32 top-1/2 -translate-y-1/2 opacity-10"
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Truck size={64} className="text-background" />
        </motion.div>
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-background/20 flex items-center justify-center">
                <Leaf size={12} className="text-background" />
              </div>
              <span className="text-background/60 text-xs font-medium">Volunteer Driver</span>
            </div>
            <h1 className="text-2xl font-bold text-background tracking-tight">Alex Rivera</h1>
            <p className="text-background/60 text-sm mt-1">
              <span className="text-background font-semibold">14 deliveries</span> available near you right now.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="self-start sm:self-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Button onClick={() => navigate("volunteer-dashboard")} className="bg-background text-foreground hover:bg-background/90 font-semibold shadow-lg shadow-black/20 gap-1.5">
                <Navigation size={14} /> Find Deliveries
              </Button>
            </motion.div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="relative z-10 flex gap-4 sm:gap-5 flex-wrap mt-6 pt-5 border-t border-background/15">
          {[{ label: "This week", val: "3 runs" }, { label: "Avg. rating", val: "4.9 ★" }, { label: "Streak", val: "12 days" }].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Zap size={10} className="text-background/40" />
              <span className="text-background font-semibold text-sm">{s.val}</span>
              <span className="text-background/40 text-xs">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Stats */}
        <motion.div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4" initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i}
                variants={{ hidden: { opacity: 0, y: 24, scale: 0.94 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}
                whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.18)" }}
                className={`${s.gradient} rounded-xl p-4 text-white shadow-sm cursor-default`}
              >
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center mb-3">
                  <Icon size={14} className="text-white" />
                </div>
                <div className="text-2xl font-bold tracking-tight text-white mb-0.5 leading-none">
                  {s.label === "Rating"
                    ? <span>4.9 <Star size={14} className="inline fill-white text-white -mt-0.5" /></span>
                    : <AnimatedCounter target={s.val} />
                  }
                </div>
                <div className="text-white/75 text-xs font-medium">{s.label}</div>
                <div className="text-white/40 text-[10px] mt-0.5">{s.delta}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Active delivery banner */}
        {myDeliveries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 24 }}
            className="relative overflow-hidden rounded-xl border border-border bg-foreground/5 p-4 flex items-center gap-4"
          >
            <motion.div
              className="absolute inset-0 bg-foreground/[0.03] rounded-xl"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              className="relative z-10 w-11 h-11 rounded-xl bg-foreground flex items-center justify-center shadow-md"
            >
              <Truck size={18} className="text-background" />
            </motion.div>
            <div className="relative z-10 flex-1">
              <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                Active Delivery · {myDeliveries[0].food}
                <span className="inline-flex items-center gap-1 text-[10px] bg-foreground text-background px-2 py-0.5 rounded-full font-medium">
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-background" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                  LIVE
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Navigation size={10} /> {myDeliveries[0].eta}
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button onClick={() => navigate("delivery-tracking")} className="relative z-10 flex items-center gap-1.5 py-2 px-4 text-sm shadow-md">
                <Navigation size={14} /> Track Live
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Available deliveries */}
        <Section delay={0.1}>
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="border-b flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Available Deliveries</CardTitle>
                <CardDescription className="mt-0.5">Near your location · 14 available</CardDescription>
              </div>
              <select className="text-xs border border-border rounded-lg py-1.5 px-2 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Nearest first</option>
                <option>Urgent first</option>
                <option>Largest first</option>
              </select>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {availableDeliveries.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(0,0,0,0.10)" }}
                  className={`border rounded-xl p-5 transition-all ${d.priority === "urgent" ? "border-foreground/20 bg-foreground/5" : "border-border"}`}
                >
                  <div className="flex items-start gap-3">
                    <motion.div whileHover={{ rotate: 10 }} className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border">
                      <Truck size={20} className="text-foreground" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-foreground text-sm">{d.food}</span>
                        {d.priority === "urgent" && <span className="badge badge-pickup">Urgent</span>}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 border border-border">
                            <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                          </div>
                          <span>{d.pickup}</span>
                        </div>
                        <div className="w-px h-3 bg-border ml-2" />
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 border border-border">
                            <MapPin size={8} className="text-foreground" />
                          </div>
                          <span>{d.dropoff}</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right shrink-0">
                      <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                        <div className="bg-muted rounded-lg px-2 py-1.5">
                          <div className="font-semibold tracking-tight text-foreground text-sm">{d.distance}</div>
                          <div className="text-[10px] text-muted-foreground">distance</div>
                        </div>
                        <div className="bg-muted rounded-lg px-2 py-1.5">
                          <div className="font-semibold tracking-tight text-foreground text-sm">{d.duration}</div>
                          <div className="text-[10px] text-muted-foreground">est. time</div>
                        </div>
                      </div>
                      <div className="text-[10px] text-muted-foreground mb-2 flex items-center justify-end gap-1">
                        <Calendar size={9} /> {d.window}
                      </div>
                      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        <Button size="sm" className="text-xs w-full justify-center py-2 h-auto">Accept Delivery</Button>
                      </motion.div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between sm:hidden">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted rounded-lg px-2 py-1.5 text-center">
                        <div className="font-semibold tracking-tight text-foreground text-sm">{d.distance}</div>
                        <div className="text-[10px] text-muted-foreground">distance</div>
                      </div>
                      <div className="bg-muted rounded-lg px-2 py-1.5 text-center">
                        <div className="font-semibold tracking-tight text-foreground text-sm">{d.duration}</div>
                        <div className="text-[10px] text-muted-foreground">est. time</div>
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar size={9} /> {d.window}
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                      <Button size="sm" className="text-xs justify-center py-2 h-auto">Accept</Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </Section>

        {/* Recent completions */}
        <Section delay={0.15}>
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="border-b flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Recent Completions</CardTitle>
              <motion.button whileHover={{ x: 2 }} className="text-sm text-primary font-semibold hover:opacity-70 flex items-center gap-1">
                Full history <ArrowRight size={13} />
              </motion.button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Delivery</TableHead>
                      <TableHead>Food</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: "DEL-085", food: "Produce Mix · 48 kg", route: "Green Harvest → Community Kitchen", dist: "5.1 km", date: "Aug 18", rating: 5 },
                      { id: "DEL-084", food: "Bakery · 22 kg", route: "City Bakehouse → Faith Community", dist: "7.4 km", date: "Aug 17", rating: 5 },
                      { id: "DEL-083", food: "Dairy · 31 kg", route: "Metro Grocery → Hope Foundation", dist: "3.8 km", date: "Aug 16", rating: 4 },
                    ].map((r, i) => (
                      <motion.tr key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                        className="border-b transition-colors hover:bg-muted/40 group">
                        <TableCell className="font-mono-data text-xs text-muted-foreground">{r.id}</TableCell>
                        <TableCell className="font-medium text-foreground text-sm">{r.food}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{r.route}</TableCell>
                        <TableCell className="font-mono-data text-xs">{r.dist}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <motion.span key={j} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.4 + i * 0.06 + j * 0.04, type: "spring" }}>
                                <Star size={11} className={j < r.rating ? "fill-foreground text-foreground" : "fill-muted-foreground/30 text-muted-foreground/30"} />
                              </motion.span>
                            ))}
                          </div>
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
