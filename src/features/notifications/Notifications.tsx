import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Zap, Truck, CheckCircle2, PartyPopper, Clock, ShieldCheck, XCircle, Camera, Settings, CheckCheck, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type NotifIcon = "zap" | "truck" | "check" | "party" | "clock" | "shield" | "x" | "camera";

const iconMap: Record<NotifIcon, React.ElementType> = {
  zap: Zap, truck: Truck, check: CheckCircle2, party: PartyPopper,
  clock: Clock, shield: ShieldCheck, x: XCircle, camera: Camera,
};
const iconColors: Record<NotifIcon, string> = {
  zap: "#f59e0b", truck: "#0ea5e9", check: "#16a34a", party: "#8b5cf6",
  clock: "#f59e0b", shield: "#0ea5e9", x: "#f43f5e", camera: "#64748b",
};
const catColors: Record<string, string> = {
  matches: "#f59e0b", deliveries: "#0ea5e9", donations: "#16a34a", system: "#8b5cf6",
};

const allNotifs = [
  { id: 1,  cat: "matches",   icon: "zap"    as NotifIcon, title: "New donation matched",        body: "DON-2026-000125 has been matched with Community Kitchen NGO (94% score).",                    time: "5 min ago",  read: false },
  { id: 2,  cat: "deliveries",icon: "truck"  as NotifIcon, title: "Volunteer assigned",           body: "Alex Rivera assigned to DEL-2026-000088. Estimated pickup: 5:30 PM today.",                  time: "22 min ago", read: false },
  { id: 3,  cat: "donations", icon: "check"  as NotifIcon, title: "NGO accepted your donation",  body: "Community Kitchen accepted DON-2026-000124 (Assorted Produce · 48 kg).",                     time: "1h ago",     read: false },
  { id: 4,  cat: "deliveries",icon: "party"  as NotifIcon, title: "Delivery completed",          body: "DEL-2026-000085 completed. 48 kg of produce delivered to Community Kitchen.",               time: "3h ago",     read: true  },
  { id: 5,  cat: "donations", icon: "clock"  as NotifIcon, title: "Donation expiring soon",      body: "DON-2026-000126 (Prepared Meals) expires in 4 hours. No match found yet.",                  time: "4h ago",     read: true  },
  { id: 6,  cat: "system",    icon: "shield" as NotifIcon, title: "Organization verified",       body: "Your organization Green Harvest Co. has been verified by our platform team.",                time: "1d ago",     read: true  },
  { id: 7,  cat: "donations", icon: "x"      as NotifIcon, title: "Donation expired",            body: "DON-2026-000119 expired without a match. Consider adjusting your pickup window next time.", time: "2d ago",     read: true  },
  { id: 8,  cat: "deliveries",icon: "camera" as NotifIcon, title: "Pickup confirmed",            body: "Volunteer confirmed pickup of DON-2026-000124. Currently in transit to Community Kitchen.", time: "2d ago",     read: true  },
  { id: 9,  cat: "matches",   icon: "zap"    as NotifIcon, title: "High-confidence match found", body: "DON-2026-000118 has been matched with Hope Foundation (89% score).",                        time: "3d ago",     read: true  },
  { id: 10, cat: "system",    icon: "shield" as NotifIcon, title: "Monthly report ready",        body: "Your August impact report is ready. 284 kg rescued, 96 meals served.",                      time: "4d ago",     read: true  },
];

const categories = ["all", "donations", "matches", "deliveries", "system"];

type Notif = typeof allNotifs[0];

function DetailModal({ notif, onClose }: { notif: Notif; onClose: () => void }) {
  const Icon = iconMap[notif.icon];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Modal header */}
        <div className="p-5 border-b border-border flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-muted"
            style={{ color: iconColors[notif.icon] }}>
            <Icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-snug">{notif.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold capitalize"
                style={{ background: `${catColors[notif.cat]}18`, color: catColors[notif.cat] }}>
                {notif.cat}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono-data">{notif.time}</span>
              {!notif.read && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">Unread</span>
              )}
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0">
            <X size={14} />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">{notif.body}</p>

          <Separator />

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Details</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Category", val: notif.cat },
                { label: "Status",   val: notif.read ? "Read" : "Unread" },
                { label: "Received", val: notif.time },
                { label: "Type",     val: notif.icon },
              ].map((d, i) => (
                <div key={i} className="bg-muted/50 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-muted-foreground capitalize">{d.label}</p>
                  <p className="text-xs font-semibold text-foreground capitalize">{d.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal actions */}
        <div className="px-5 pb-5 flex gap-2">
          <Button size="sm" className="flex-1 text-xs h-8 gap-1.5">
            Take action <ArrowRight size={11} />
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={onClose}>
            Dismiss
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const POPOVER_W = 272;
const POPOVER_H = 210;
const OFFSET = 14;

export default function Notifications() {
  const [activeCat, setActiveCat] = useState("all");
  const [notifs, setNotifs] = useState(allNotifs);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [spawnPos, setSpawnPos] = useState({ x: 0, y: 0 });
  const [modalNotif, setModalNotif] = useState<Notif | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = activeCat === "all" ? notifs : notifs.filter(n => n.cat === activeCat);
  const unread = notifs.filter(n => !n.read).length;

  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, read: true })));

  const hoveredNotif = hoveredId != null ? notifs.find(n => n.id === hoveredId) ?? null : null;

  function onItemEnter(n: Notif, e: React.MouseEvent<HTMLDivElement>) {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
    const cx = e.clientX;
    const cy = e.clientY;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const left = cx + OFFSET + POPOVER_W > vw ? cx - OFFSET - POPOVER_W : cx + OFFSET;
    const top  = cy + OFFSET + POPOVER_H > vh ? cy - POPOVER_H         : cy + OFFSET;
    setSpawnPos({ x: left, y: top });
    setHoveredId(n.id);
    markRead(n.id);
  }
  function onItemLeave() {
    leaveTimer.current = setTimeout(() => setHoveredId(null), 80);
  }
  function onPopoverEnter() {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
  }

  return (
    <div className="flex h-full min-h-0 overflow-hidden relative">

      {/* ── Full-width notification list ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* List header */}
        <div className="px-4 sm:px-5 py-4 border-b border-border shrink-0 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-semibold tracking-tight text-foreground">Notifications</h1>
            {unread > 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 h-auto">{unread} unread</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted">
              <CheckCheck size={12} /> Mark all read
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted">
              <Settings size={12} /> Preferences
            </motion.button>
          </div>
        </div>

        {/* Category filter */}
        <div className="px-4 sm:px-5 py-3 border-b border-border shrink-0 flex gap-1.5 flex-wrap">
          {categories.map(c => (
            <motion.button key={c} onClick={() => setActiveCat(c)} whileTap={{ scale: 0.93 }}
              className={`relative flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeCat === c ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}>
              {c}
              {c === "all" && unread > 0 && (
                <span className="ml-0.5 w-3.5 h-3.5 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold leading-none">
                  {unread}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Card>
                  <CardContent className="text-center py-20">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Bell size={28} className="text-muted-foreground/40" />
                    </motion.div>
                    <p className="font-semibold text-muted-foreground">No notifications</p>
                    <p className="text-sm text-muted-foreground mt-1">You&apos;re all caught up!</p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-2">
                {filtered.map((n, i) => {
                  const Icon = iconMap[n.icon];
                  const isHovered = hoveredId === n.id;
                  return (
                    <motion.div key={n.id}
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -30, scale: 0.95 }}
                      transition={{ delay: i * 0.03, duration: 0.26 }}
                      onMouseEnter={(e) => onItemEnter(n, e)}
                      onMouseLeave={onItemLeave}
                      onClick={() => { setModalNotif(n); markRead(n.id); }}
                      className={`relative flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isHovered
                          ? "border-primary/40 bg-primary/[0.05] shadow-sm"
                          : n.read
                            ? "border-border bg-card hover:bg-muted/40"
                            : "border-primary/20 bg-primary/[0.03] hover:bg-primary/[0.06]"
                      }`}>

                      {isHovered && (
                        <motion.div layoutId="notif-bar"
                          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-primary" />
                      )}

                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.read ? "bg-muted" : "bg-card shadow-sm"}`}
                        style={{ color: iconColors[n.icon] }}>
                        <Icon size={16} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className={`text-sm font-semibold truncate ${n.read ? "text-muted-foreground" : "text-foreground"}`}>{n.title}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0 font-mono-data">{n.time}</span>
                        </div>
                        <p className={`text-xs text-muted-foreground leading-relaxed transition-all ${isHovered ? "" : "line-clamp-1"}`}>{n.body}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold capitalize"
                            style={{ background: `${catColors[n.cat]}18`, color: catColors[n.cat] }}>
                            {n.cat}
                          </span>
                          {!n.read && (
                            <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                              className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                          {isHovered && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              className="text-[10px] text-primary font-semibold ml-auto">
                              Click for details →
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Hover popover — spawns at cursor, stays locked ── */}
      <AnimatePresence>
        {hoveredNotif && (() => {
          const Icon = iconMap[hoveredNotif.icon];
          const accent = catColors[hoveredNotif.cat];
          const icolor = iconColors[hoveredNotif.icon];
          return (
            <motion.div
              key={hoveredNotif.id}
              initial={{ opacity: 0, scale: 0.88, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={onPopoverEnter}
              onMouseLeave={onItemLeave}
              style={{
                left: spawnPos.x,
                top: spawnPos.y,
                width: POPOVER_W,
                transformOrigin: "top left",
                pointerEvents: "auto",
              }}
              className="hidden lg:block fixed z-50 overflow-hidden rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-border/80"
            >
              {/* Category accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl" style={{ background: accent }} />

              {/* Glass-tinted background */}
              <div className="bg-card/95 backdrop-blur-md pl-4 pr-4 pt-4 pb-3">

                {/* Header row */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${icolor}14`, color: icolor }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground leading-snug">{hoveredNotif.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                        style={{ background: `${accent}18`, color: accent }}
                      >
                        {hoveredNotif.cat}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono-data">{hoveredNotif.time}</span>
                      {!hoveredNotif.read && (
                        <motion.span
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: accent }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                  {hoveredNotif.body}
                </p>

                {/* Footer hint */}
                <div
                  className="flex items-center justify-between pt-2.5 border-t"
                  style={{ borderColor: `${accent}20` }}
                >
                  <span className="text-[10px] text-muted-foreground/60 italic">
                    {hoveredNotif.read ? "Already read" : "Will mark as read"}
                  </span>
                  <span
                    className="text-[10px] font-semibold flex items-center gap-1"
                    style={{ color: accent }}
                  >
                    Click to open <ArrowRight size={9} />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── Click modal ── */}
      <AnimatePresence>
        {modalNotif && (
          <DetailModal notif={modalNotif} onClose={() => setModalNotif(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
