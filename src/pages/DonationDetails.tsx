import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, Clock, MapPin, Truck, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DonationDetailsProps {
  onNavigate: (page: string) => void;
}

const timelineSteps = [
  { label: "Created", time: "Aug 18, 09:14 AM", actor: "Green Harvest Co.", done: true },
  { label: "Validated", time: "Aug 18, 09:16 AM", actor: "Platform (automated)", done: true },
  { label: "Published", time: "Aug 18, 09:17 AM", actor: "Green Harvest Co.", done: true },
  { label: "Matched", time: "Aug 18, 10:02 AM", actor: "Matching System", done: true },
  { label: "Accepted", time: "Aug 18, 10:45 AM", actor: "Community Kitchen NGO", done: true },
  { label: "Pickup", time: "Aug 18, 02:10 PM", actor: "Alex Rivera (Volunteer)", done: true },
  { label: "Delivered", time: "Aug 18, 03:22 PM", actor: "Alex Rivera (Volunteer)", done: true },
];

const matchFactors = [
  { label: "Distance", weight: 30, score: 98, color: "#16a34a" },
  { label: "Expiration urgency", weight: 25, score: 88, color: "#0ea5e9" },
  { label: "Food requirement match", weight: 20, score: 95, color: "#8b5cf6" },
  { label: "NGO capacity", weight: 10, score: 100, color: "#f59e0b" },
  { label: "Dietary compatibility", weight: 10, score: 90, color: "#f43f5e" },
  { label: "NGO reliability", weight: 5, score: 97, color: "#64748b" },
];

function Section({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function DonationDetails({ onNavigate }: DonationDetailsProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono-data text-sm text-muted-foreground">DON-2026-000124</span>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }} className="badge badge-delivered">delivered</motion.span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Assorted Produce Mix</h1>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="btn-secondary text-sm py-2 px-4">Download Report</motion.button>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: main details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Food card */}
          <Section delay={0.05}>
            <Card className="overflow-hidden">
              <div className="relative h-40">
                <motion.img
                  initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7 }}
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=300&fit=crop&auto=format"
                  alt="Produce" className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <div className="text-lg font-semibold">Assorted Produce Mix</div>
                  <div className="text-sm text-white/80">Produce & Vegetables · 48 kg</div>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {[
                    { label: "Category", val: "Produce" },
                    { label: "Quantity", val: "48 kg" },
                    { label: "Dietary", val: "Vegetarian, Vegan" },
                    { label: "Storage", val: "2–8°C" },
                  ].map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }}>
                      <div className="text-xs text-muted-foreground mb-0.5">{f.label}</div>
                      <div className="text-sm font-semibold text-foreground">{f.val}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center gap-6 pt-4 border-t border-border text-xs text-muted-foreground">
                  <span>Prepared: Aug 18, 6:00 AM</span>
                  <span>Expiry: Aug 19, 8:00 PM</span>
                  <span>Pickup: Aug 18, 2:00–6:00 PM</span>
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* Lifecycle timeline */}
          <Section delay={0.1}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Donation Lifecycle</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {timelineSteps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.2 + i * 0.07 }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-primary" : "bg-muted"}`}
                      >
                        {step.done ? <CheckCircle size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground" />}
                      </motion.div>
                      {i < timelineSteps.length - 1 && (
                        <div className={`w-0.5 flex-1 my-1 ${step.done ? "bg-primary/30" : "bg-border"}`} style={{ minHeight: 28 }} />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-semibold text-foreground">{step.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{step.time} · {step.actor}</div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </Section>

          {/* Delivery section */}
          <Section delay={0.15}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <motion.div whileHover={{ backgroundColor: "var(--muted)" }}
                  className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Truck size={16} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">Alex Rivera</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><Star size={10} className="fill-amber-400 text-amber-400" /> 4.9 · 234 deliveries completed</div>
                  </div>
                  <span className="badge badge-delivered">Completed</span>
                </motion.div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Pickup confirmed", val: "2:10 PM", icon: <CheckCircle size={13} className="text-primary" /> },
                    { label: "Delivery time", val: "72 min", icon: <Clock size={13} className="text-muted-foreground" /> },
                    { label: "Delivered at", val: "3:22 PM", icon: <CheckCircle size={13} className="text-primary" /> },
                  ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }} className="text-center">
                      <div className="flex justify-center mb-1">{s.icon}</div>
                      <div className="font-semibold text-foreground text-lg">{s.val}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Section>
        </div>

        {/* Right: match + location */}
        <div className="space-y-5">
          {/* Match section */}
          <Section delay={0.08}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Match Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.2 }}
                    className="score-ring" style={{ "--score": "338deg" } as React.CSSProperties}
                  >
                    <span className="score-ring-value">94%</span>
                  </motion.div>
                  <div>
                    <div className="font-semibold text-foreground">Excellent Match</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Community Kitchen NGO</div>
                    <div className="text-xs text-primary mt-0.5">2.3 km · Accepted</div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {matchFactors.map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{f.label}</span>
                        <span className="font-mono-data text-foreground">{f.score}%</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${f.score}%` }}
                          transition={{ duration: 1.0, delay: 0.4 + i * 0.1, ease: "easeOut" }} style={{ background: f.color }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* NGO card */}
          <Section delay={0.12}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recipient NGO</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <motion.div whileHover={{ backgroundColor: "var(--muted)" }} className="flex items-center gap-3 p-2 rounded-lg -mx-2 transition-colors">
                  <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-700 dark:text-sky-400 font-bold text-sm cursor-default">
                    CK
                  </motion.div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Community Kitchen NGO</div>
                    <div className="text-xs text-muted-foreground">Serves 500+ families weekly</div>
                  </div>
                </motion.div>
                <div className="space-y-2 text-xs">
                  {[
                    { label: "Distance", val: "2.3 km" },
                    { label: "Capacity", val: "200 kg/week" },
                    { label: "Dietary", val: "Accepts all types" },
                    { label: "Reliability", val: "97% acceptance rate" },
                  ].map((f, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-muted-foreground">{f.label}</span>
                      <span className="font-medium text-foreground">{f.val}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* Pickup location */}
          <Section delay={0.16}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Pickup Location</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="map-placeholder rounded-lg h-28 relative overflow-hidden">
                  <div className="map-grid" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary border-2 border-card shadow-md flex items-center justify-center">
                        <MapPin size={14} className="text-white" />
                      </div>
                      <div className="text-[10px] bg-card rounded px-1 mt-1 shadow text-foreground">Loading dock</div>
                    </motion.div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-foreground">123 Market Street</p>
                    <p className="text-xs text-muted-foreground">San Francisco, CA 94102</p>
                    <p className="text-xs text-muted-foreground mt-1">Loading dock, rear entrance. Ring bell.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Section>
        </div>
      </div>
    </div>
  );
}
