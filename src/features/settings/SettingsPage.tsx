import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, Bell, ShieldCheck, Sliders, Settings as SettingsIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { value: "profile",       label: "Profile",       icon: User,         desc: "Personal info & photo" },
  { value: "organization",  label: "Organization",  icon: Building2,    desc: "Team & org details" },
  { value: "notifications", label: "Notifications", icon: Bell,         desc: "Alerts & preferences" },
  { value: "security",      label: "Security",      icon: ShieldCheck,  desc: "Password & 2FA" },
  { value: "preferences",   label: "Preferences",   icon: Sliders,      desc: "Display & language" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("profile");
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = navItems.find(n => n.value === active)!;

  return (
    <div className="p-3 sm:p-6 max-w-full overflow-x-hidden">
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold tracking-tight text-foreground mb-6">
        Settings
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-6 items-start">

        {/* ── Sidebar (desktop) ── */}
        <motion.aside
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
          className="hidden md:flex flex-col w-56 shrink-0 rounded-2xl border border-border bg-card overflow-hidden"
        >
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = active === item.value;
            return (
              <button
                key={item.value}
                onClick={() => setActive(item.value)}
                className={`relative flex items-center gap-3 px-4 py-3.5 text-left transition-colors group ${
                  i !== navItems.length - 1 ? "border-b border-border/50" : ""
                } ${isActive ? "bg-primary/8" : "hover:bg-muted/60"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="settings-sidebar-pill"
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary"
                  />
                )}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                }`}>
                  <Icon size={15} />
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-medium leading-tight ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {item.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground/70 leading-tight mt-0.5 truncate">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </motion.aside>

        {/* ── Mobile nav selector ── */}
        <div className="md:hidden w-full">
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card text-sm font-medium"
          >
            <div className="flex items-center gap-2.5">
              {React.createElement(activeItem.icon, { size: 15, className: "text-primary" })}
              <span>{activeItem.label}</span>
            </div>
            <ChevronRight size={15} className={`text-muted-foreground transition-transform ${mobileOpen ? "rotate-90" : ""}`} />
          </button>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-1 rounded-xl border border-border bg-card"
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => { setActive(item.value); setMobileOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border/50 last:border-0 transition-colors ${
                        isActive ? "bg-primary/8 text-foreground" : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon size={14} />
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Content panel ── */}
        <div className="flex-1 min-w-0 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {active === "profile"       && <ProfileTab />}
              {active === "notifications" && <NotificationsTab />}
              {(active === "organization" || active === "security" || active === "preferences") && (
                <PlaceholderTab tab={active} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── Profile ─────────────────────────────────────────────── */

function ProfileTab() {
  return (
    <Card>
      <CardContent className="p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">Profile Information</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Update your personal details and photo.</p>
        </div>

        <div className="flex items-center gap-4 pb-2">
          <motion.div whileHover={{ scale: 1.05 }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg sm:text-xl cursor-pointer shrink-0">
            SC
          </motion.div>
          <div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" size="sm">Upload photo</Button>
            </motion.div>
            <p className="text-xs text-muted-foreground mt-1">JPG or PNG, max 2 MB</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" type="text" defaultValue="Sarah" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" type="text" defaultValue="Chen" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="sarah@greenharvest.org" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" defaultValue="+1 (415) 555-0142" />
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-block">
          <Button>Save changes</Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

/* ── Notifications ───────────────────────────────────────── */

function NotificationsTab() {
  const items = [
    { label: "Donation matched",      desc: "When a donation is matched with an NGO",              on: true  },
    { label: "NGO accepted donation", desc: "When an NGO accepts your donation",                   on: true  },
    { label: "Volunteer assigned",    desc: "When a volunteer is assigned to your delivery",       on: true  },
    { label: "Delivery completed",    desc: "When a food delivery is completed",                   on: true  },
    { label: "Donation expiring",     desc: "When a donation is expiring within 6 hours",         on: true  },
    { label: "System announcements",  desc: "Platform updates and maintenance notices",           on: false },
  ];

  return (
    <Card>
      <CardContent className="p-5 sm:p-6 space-y-1">
        <div className="mb-4">
          <h2 className="text-base font-semibold tracking-tight text-foreground">Notification Preferences</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Choose what alerts you receive.</p>
        </div>
        {items.map((n, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between py-3 border-b border-border last:border-0 gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">{n.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{n.desc}</div>
            </div>
            <motion.div whileTap={{ scale: 0.92 }}
              className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors shrink-0 ${n.on ? "bg-primary" : "bg-muted"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${n.on ? "left-6" : "left-1"}`} />
            </motion.div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ── Placeholder ─────────────────────────────────────────── */

function PlaceholderTab({ tab }: { tab: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center py-20 text-center">
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
          <SettingsIcon size={20} className="text-muted-foreground/50" />
        </motion.div>
        <p className="font-semibold tracking-tight text-foreground capitalize">{tab} settings</p>
        <p className="text-sm text-muted-foreground mt-1">Coming soon</p>
      </CardContent>
    </Card>
  );
}
