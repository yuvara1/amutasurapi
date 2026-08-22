import { useState } from "react";
import { useNav } from "@/hooks/useNav";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, MapPin, Truck, Phone, MessageSquare, Camera, PartyPopper, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";


type Phase = "pickup" | "in_transit" | "delivered";

const phases: { key: Phase; label: string; icon: React.ReactNode; done: boolean }[] = [
  { key: "pickup",     label: "Pickup confirmed", icon: <CheckCircle size={14} />, done: true },
  { key: "in_transit", label: "In transit",        icon: <Truck size={14} />,      done: false },
  { key: "delivered",  label: "Delivered",          icon: <CheckCircle size={14} />, done: false },
];

const timelineItems = [
  { time: "2:10 PM", event: "Volunteer arrived at pickup", icon: <MapPin size={13} />,      done: true },
  { time: "2:12 PM", event: "Donation verified and confirmed", icon: <CheckCircle size={13} />, done: true },
  { time: "2:14 PM", event: "Pickup photo captured",       icon: <Camera size={13} />,       done: true },
  { time: "2:15 PM", event: "Food picked up — in transit", icon: <Truck size={13} />,        done: true },
  { time: "—",       event: "Arrival at Community Kitchen",icon: <MapPin size={13} />,       done: false },
  { time: "—",       event: "Delivery confirmed",          icon: <CheckCircle size={13} />,  done: false },
];

export default function DeliveryTracking() {
  const navigate = useNav();
  const [currentPhase] = useState<Phase>("in_transit");
  const [completed, setCompleted] = useState(false);

  if (completed) {
    return (
      <div className="p-3 sm:p-6 flex items-center justify-center min-h-96">
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="text-center max-w-sm">
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-6">
            <PartyPopper size={36} className="text-primary" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            Delivery Complete!
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-muted-foreground mb-2">
            48 kg of produce delivered to Community Kitchen NGO
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="grid grid-cols-3 gap-3 my-6">
            {[{ label: "Distance", val: "5.1 km" }, { label: "Duration", val: "31 min" }, { label: "Impact", val: "96 meals" }].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 + i * 0.08 }}
                className="bg-brand-50 dark:bg-primary/10 rounded-xl p-3">
                <div className="font-bold text-primary">{s.val}</div>
                <div className="text-xs text-primary/70">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Button onClick={() => navigate("volunteer-dashboard")} className="w-full">Back to Dashboard</Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-data text-sm text-muted-foreground">DEL-2026-000085</span>
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.15 }}
              className="badge badge-pickup">In Transit</motion.span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Live Delivery Tracking</h1>
        </div>
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-right shrink-0">
          <div className="text-xs text-muted-foreground">Estimated arrival</div>
          <div className="text-2xl font-bold text-foreground">12 min</div>
          <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-xs text-primary">
            Updated just now
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Main content */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Map */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-3 space-y-4">
          <Card className="overflow-hidden">
            <div className="map-placeholder h-56 sm:h-80 relative">
              <div className="map-grid" />
              {/* Roads */}
              <div className="map-road absolute left-1/3 top-0 bottom-0" style={{ width: 3 }} />
              <div className="map-road absolute left-0 right-0 top-2/5" style={{ height: 3 }} />
              <div className="map-road absolute left-1/4 top-0 bottom-0" style={{ width: 2, opacity: 0.4 }} />
              <div className="map-road absolute left-0 right-0 top-3/4" style={{ height: 2, opacity: 0.4 }} />

              {/* Donor marker */}
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                className="absolute top-8 left-8">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-primary border-2 border-card shadow-lg flex items-center justify-center">
                    <MapPin size={14} className="text-white" />
                  </div>
                  <div className="text-[10px] bg-card rounded-lg px-2 py-0.5 mt-1 shadow text-primary font-semibold whitespace-nowrap border border-border">
                    ✓ Pickup done
                  </div>
                </div>
              </motion.div>

              {/* Volunteer truck */}
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 0.4 }} className="absolute" style={{ top: "38%", left: "38%" }}>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-full bg-amber-400/30 animate-ping" />
                    <motion.div animate={{ rotate: [0, -6, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                      className="w-10 h-10 rounded-full bg-amber-500 border-2 border-card shadow-lg flex items-center justify-center relative">
                      <Truck size={16} className="text-white" />
                    </motion.div>
                  </div>
                  <div className="text-[10px] bg-card rounded-lg px-2 py-0.5 mt-1 shadow text-amber-600 dark:text-amber-400 font-semibold border border-border">
                    En route
                  </div>
                </div>
              </motion.div>

              {/* NGO marker */}
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 0.5 }} className="absolute bottom-8 right-8">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-sky-500 border-2 border-card shadow-lg flex items-center justify-center">
                    <MapPin size={14} className="text-white" />
                  </div>
                  <div className="text-[10px] bg-card rounded-lg px-2 py-0.5 mt-1 shadow text-sky-600 dark:text-sky-400 font-semibold whitespace-nowrap border border-border">
                    Community Kitchen
                  </div>
                </div>
              </motion.div>

              {/* Route line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.5 }}>
                <motion.path d="M 70 50 Q 180 150 200 200 Q 220 250 340 300"
                  stroke="#16a34a" strokeWidth="2.5" strokeDasharray="6 4" fill="none"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.6, ease: "easeInOut" }} />
              </svg>

              {/* ETA badge */}
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                className="absolute top-2 right-2 bg-card border border-border rounded-xl shadow-md px-3 py-2">
                <div className="text-[10px] text-muted-foreground">ETA</div>
                <div className="font-bold text-foreground text-lg">12 min</div>
                <div className="text-[10px] text-primary">5.1 km total</div>
              </motion.div>
            </div>

            {/* Phase status bar */}
            <div className="flex border-t border-border">
              {phases.map((p, i) => {
                const phaseIndex = phases.findIndex(ph => ph.key === currentPhase);
                const isActive = currentPhase === p.key;
                const isDone = phaseIndex > i;
                return (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.08 }}
                    className={`flex-1 flex flex-col items-center py-3 gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold border-r last:border-r-0 border-border transition-colors ${
                      isActive ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : isDone ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                    }`}>
                    {p.icon}
                    {p.label}
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Right panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Delivery info */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Delivery Info</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="space-y-3">
                  <motion.div whileHover={{ x: 2 }} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Pickup</div>
                      <div className="text-sm font-semibold text-foreground">Green Harvest Co.</div>
                      <div className="text-xs text-muted-foreground">123 Main Street, SF</div>
                    </div>
                    <span className="badge badge-delivered ml-auto">Done</span>
                  </motion.div>
                  <motion.div whileHover={{ x: 2 }} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shrink-0">
                      <MapPin size={12} className="text-sky-500" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Drop-off</div>
                      <div className="text-sm font-semibold text-foreground">Community Kitchen</div>
                      <div className="text-xs text-muted-foreground">78 Market St, SF</div>
                    </div>
                  </motion.div>
                </div>
                <Separator />
                <div className="space-y-1.5">
                  {[
                    { label: "Food", val: "Assorted Produce · 48 kg" },
                    { label: "Pickup confirmed", val: "2:10 PM" },
                    { label: "Recipient", val: "Maria Santos" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-medium text-foreground">{row.val}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Volunteer info */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Volunteer</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold cursor-default">
                    AR
                  </motion.div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-foreground">Alex Rivera</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><Star size={10} className="fill-amber-400 text-amber-400" /> 4.9 · 234 completed</div>
                  </div>
                  <div className="flex gap-1">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
                      className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center hover:bg-muted/70 transition-colors">
                      <Phone size={13} className="text-muted-foreground" />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
                      className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center hover:bg-muted/70 transition-colors">
                      <MessageSquare size={13} className="text-muted-foreground" />
                    </motion.button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Complete delivery */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <Card className="border-primary/20 bg-primary/[0.04]">
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Mark Delivery Complete</h3>
                  <p className="text-xs text-muted-foreground">Confirm delivery and upload proof photo</p>
                </div>
                <motion.div whileHover={{ scale: 1.02 }}
                  className="border-2 border-dashed border-primary/30 rounded-lg p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-primary/5 transition-colors">
                  <Camera size={20} className="text-primary/60" />
                  <span className="text-xs text-primary/70">Upload delivery photo</span>
                </motion.div>
                <Button onClick={() => setCompleted(true)} className="w-full gap-1.5">
                  <CheckCircle size={14} /> Complete Delivery
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Timeline */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Delivery Timeline</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-6 overflow-x-auto pb-3">
              {timelineItems.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.07 }} className="flex items-start gap-3 shrink-0" style={{ maxWidth: 200 }}>
                  <div className="flex flex-col items-center shrink-0">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.5 + i * 0.07 }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${step.done ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                      {step.icon}
                    </motion.div>
                    {i < timelineItems.length - 1 && (
                      <motion.div className={`w-16 h-0.5 mt-3.5 ${step.done ? "bg-primary/40" : "bg-border"}`}
                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                        style={{ originX: 0 }} transition={{ delay: 0.6 + i * 0.07, duration: 0.4 }} />
                    )}
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.event}</div>
                    <div className="font-mono-data text-[10px] text-muted-foreground mt-0.5">{step.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
