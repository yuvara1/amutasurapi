import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf, Eye, EyeOff, ArrowLeft, ArrowRight, Check,
  Upload, MapPin, User, Building2, Lock, Mail, Phone, Globe,
  ShieldCheck, Sparkles, Package, Handshake, Truck, Settings2,
  Wheat, UtensilsCrossed, Users, Zap, BarChart3, Recycle,
  FileText, Award, TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";
import { GlowCard } from "@/components/ui/GlowCard";
import { AnimatedGridBackground } from "@/components/ui/AnimatedGrid";
import { GlowingStarsBackgroundCard } from "@/components/ui/glowing-stars";
import ParticleNetwork from "@/components/ui/ParticleNetwork";

interface AuthProps {
  mode: "login" | "register";
  onNavigate: (page: string) => void;
  onLogin: (role: "donor" | "ngo" | "volunteer" | "admin") => void;
}

const roleOptions = [
  {
    id: "donor",
    icon: Package,
    title: "Food Donor",
    desc: "Restaurant, grocery store, caterer, or individual with surplus food",
    accent: "#22c55e",
    glow: "rgba(34,197,94,0.25)",
  },
  {
    id: "ngo",
    icon: Handshake,
    title: "NGO / Charity",
    desc: "Non-profit organization that distributes food to communities in need",
    accent: "#38bdf8",
    glow: "rgba(56,189,248,0.25)",
  },
  {
    id: "volunteer",
    icon: Truck,
    title: "Volunteer Driver",
    desc: "Individual who picks up and delivers food donations",
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.25)",
  },
];

/* Role-specific onboarding paths — organization/verification is NGO-only.
   Donors and volunteers register as individuals with their own tailored steps. */
const ROLE_STEPS: Record<string, string[]> = {
  donor: ["Role", "Account", "Preferences", "Location", "Done"],
  ngo: ["Role", "Account", "Organization", "Location", "Documents", "Done"],
  volunteer: ["Role", "Account", "Skills", "Availability", "Location", "Done"],
};
const DEFAULT_STEPS = ["Role", "Account", "Details", "Location", "Done"];

/* ── Shared field wrapper ── */
function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-white/50 flex items-center gap-1.5">
        {icon && <span className="opacity-60">{icon}</span>}
        {label}
      </Label>
      {children}
    </div>
  );
}

/* ── Dark styled input ── */
function DarkInput(props: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/20 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500/50 h-11 rounded-xl transition-all duration-200"
    />
  );
}

/* ── Dark styled select ── */
function DarkSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full h-11 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/70 px-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
    >
      {children}
    </select>
  );
}

/* ── Toggleable chip (skills, causes, availability) ── */
function Chip({ label, active, onClick, accent = "#22c55e" }: { label: string; active: boolean; onClick: () => void; accent?: string }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-200"
      style={active
        ? { borderColor: accent + "60", background: accent + "18", color: accent }
        : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)" }
      }
    >
      {active && <Check size={12} className="inline mr-1.5 -mt-0.5" />}
      {label}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════ */
function LoginPage({ onNavigate, onLogin }: Pick<AuthProps, "onNavigate" | "onLogin">) {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState<"donor" | "ngo" | "volunteer" | "admin">("donor");

  const demoRoles = [
    { id: "donor" as const, label: "Donor", Icon: Package, color: "#22c55e" },
    { id: "ngo" as const, label: "NGO", Icon: Handshake, color: "#38bdf8" },
    { id: "volunteer" as const, label: "Volunteer", Icon: Truck, color: "#f59e0b" },
    { id: "admin" as const, label: "Admin", Icon: Settings2, color: "#a78bfa" },
  ];

  return (
    <div className="min-h-screen bg-[#030303] flex overflow-hidden">

      {/* ── Left hero panel ── */}
      <div className="hidden lg:flex w-[480px] xl:w-[540px] shrink-0 relative flex-col overflow-hidden border-r border-white/[0.05]">
        <AnimatedGridBackground />
        <Spotlight className="-top-20 -left-10" fill="rgba(34,197,94,0.4)" />

        {/* Particle network fills lower half */}
        <div className="absolute inset-0 opacity-60">
          <ParticleNetwork className="w-full h-full" />
        </div>

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#030303]/80 via-transparent to-[#030303]/60 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <button onClick={() => onNavigate("landing")} className="flex items-center gap-2.5 w-fit">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <Leaf size={15} className="text-white" />
            </div>
            <span className="font-semibold text-white tracking-tight">FoodBridge</span>
          </button>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-auto mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 font-medium mb-5">
              <Sparkles size={11} /> Cloud-native food rescue
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              Rescue food.<br />
              <span style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Create impact.
              </span>
            </h2>
            <p className="text-white/40 leading-relaxed text-sm max-w-xs">
              Join 800+ organizations and volunteers who rescue surplus food daily through intelligent matching.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { val: "284K kg", label: "Food Rescued", accent: "#4ade80", Icon: Wheat },
              { val: "48,200", label: "Meals Given", accent: "#38bdf8", Icon: UtensilsCrossed },
              { val: "138", label: "NGO Partners", accent: "#a78bfa", Icon: Handshake },
              { val: "512", label: "Volunteers", accent: "#f59e0b", Icon: Users },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.06 }}
              >
                <GlowingStarsBackgroundCard className="rounded-xl border-white/[0.06] bg-white/[0.03] p-0">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.accent + "18" }}>
                      <s.Icon size={14} style={{ color: s.accent }} />
                    </div>
                    <div>
                      <div className="text-base font-bold font-mono leading-none" style={{ color: s.accent }}>{s.val}</div>
                      <div className="text-[10px] text-white/30 mt-0.5">{s.label}</div>
                    </div>
                  </div>
                </GlowingStarsBackgroundCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >
          {/* Back */}
          <motion.button
            whileHover={{ x: -2 }}
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 mb-8 transition-colors"
          >
            <ArrowLeft size={13} /> Back to home
          </motion.button>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-sm text-white/30 mt-1">Sign in to your FoodBridge account</p>
          </div>

          {/* Demo role pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03]"
          >
            <p className="text-[11px] text-white/30 font-medium uppercase tracking-wider mb-3">Demo — select a role</p>
            <div className="grid grid-cols-4 gap-2">
              {demoRoles.map((r) => (
                <motion.button
                  key={r.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setLoginRole(r.id)}
                  className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border transition-all duration-200"
                  style={loginRole === r.id
                    ? { borderColor: r.color + "50", background: r.color + "15", boxShadow: `0 0 12px ${r.color}25` }
                    : { borderColor: "rgba(255,255,255,0.07)", background: "transparent" }
                  }
                >
                  <r.Icon size={15} style={{ color: loginRole === r.id ? r.color : "rgba(255,255,255,0.25)" }} />
                  <span className="text-[10px] font-medium" style={{ color: loginRole === r.id ? r.color : "rgba(255,255,255,0.3)" }}>
                    {r.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="space-y-4"
          >
            <Field label="Email address" icon={<Mail size={12} />}>
              <DarkInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.org"
              />
            </Field>

            <Field label="Password" icon={<Lock size={12} />}>
              <div className="relative">
                <DarkInput
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 text-xs text-white/30 cursor-pointer">
                <input type="checkbox" className="rounded accent-emerald-500" />
                Remember me
              </label>
              <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Forgot password?</button>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => onLogin(loginRole)}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-emerald-900/30"
              >
                Sign in as {loginRole === "donor" ? "Donor" : loginRole === "ngo" ? "NGO" : loginRole === "volunteer" ? "Volunteer" : "Admin"}
                <ArrowRight size={15} className="ml-1.5" />
              </Button>
            </motion.div>
          </motion.div>

          <p className="text-xs text-white/25 text-center mt-7">
            Don&apos;t have an account?{" "}
            <button onClick={() => onNavigate("register")} className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
              Create one
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   REGISTER
═══════════════════════════════════════════════ */
function RegisterPage({ onNavigate, onLogin }: Pick<AuthProps, "onNavigate" | "onLogin">) {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);

  // Role-specific selections
  const [causes, setCauses] = useState<Set<string>>(new Set());
  const [skills, setSkills] = useState<Set<string>>(new Set());
  const [days, setDays] = useState<Set<string>>(new Set());
  const [times, setTimes] = useState<Set<string>>(new Set());
  const [recurring, setRecurring] = useState(false);
  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, v: string) => {
    const next = new Set(set);
    next.has(v) ? next.delete(v) : next.add(v);
    setter(next);
  };

  const activeRole = roleOptions.find((r) => r.id === selectedRole);

  const steps = selectedRole ? ROLE_STEPS[selectedRole] : DEFAULT_STEPS;
  const totalSteps = steps.length;
  const label = steps[step - 1];
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col overflow-hidden">
      <AnimatedGridBackground />

      {/* Top bar */}
      <div className="relative z-10 flex items-center gap-4 px-6 py-4 border-b border-white/[0.06] bg-[#030303]/80 backdrop-blur-md">
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Leaf size={13} className="text-white" />
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">FoodBridge</span>
        </button>

        {/* Progress bar */}
        <div className="flex-1 mx-4 sm:mx-8">
          <div className="h-1 bg-white/[0.07] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
        <span className="text-xs font-mono text-white/25 shrink-0">{step}/{totalSteps}</span>
      </div>

      {/* Step tabs */}
      <div className="relative z-10 border-b border-white/[0.05] bg-[#030303]/60 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => {
              const done = i + 1 < step;
              const active = i + 1 === step;
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <motion.div
                    animate={done ? { backgroundColor: "#22c55e", borderColor: "#22c55e" } : active ? { borderColor: "#22c55e" } : {}}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-colors ${
                      done ? "border-emerald-500 bg-emerald-500 text-white"
                      : active ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                      : "border-white/10 text-white/20"
                    }`}
                  >
                    {done ? <Check size={10} /> : i + 1}
                  </motion.div>
                  <span className={`text-[11px] font-medium hidden sm:block ${active ? "text-emerald-400" : done ? "text-white/40" : "text-white/15"}`}>
                    {s}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="w-6 sm:w-10 h-px mx-1 hidden sm:block" style={{ background: done ? "#22c55e40" : "rgba(255,255,255,0.07)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="relative z-10 flex-1 flex items-start justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">

            {/* Step 1 — Role */}
            {step === 1 && (
              <motion.div key="s1"
                initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepHeader
                  icon={<User size={18} className="text-emerald-400" />}
                  title="Choose your role"
                  desc="How will you participate in FoodBridge?"
                />
                <div className="grid gap-3 mt-8">
                  {roleOptions.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <GlowCard
                        glowColor={r.glow}
                        className={`cursor-pointer transition-all duration-200 ${selectedRole === r.id ? "border-white/20" : "border-white/[0.06]"}`}
                      >
                        <motion.button
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedRole(r.id)}
                          className="w-full text-left p-5"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                              style={{ background: r.accent + "18", border: `1px solid ${r.accent}30` }}
                            >
                              <r.icon size={22} style={{ color: r.accent }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-white mb-0.5">{r.title}</div>
                              <div className="text-sm text-white/35 leading-snug">{r.desc}</div>
                            </div>
                            <div
                              className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                              style={selectedRole === r.id
                                ? { borderColor: r.accent, background: r.accent }
                                : { borderColor: "rgba(255,255,255,0.15)" }
                              }
                            >
                              {selectedRole === r.id && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
                                  <Check size={10} className="text-white" />
                                </motion.span>
                              )}
                            </div>
                          </div>
                          {/* Selected accent line */}
                          {selectedRole === r.id && (
                            <motion.div
                              layoutId="roleAccent"
                              className="mt-4 h-px rounded-full"
                              style={{ background: `linear-gradient(90deg, ${r.accent}60, transparent)` }}
                            />
                          )}
                        </motion.button>
                      </GlowCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Account (all roles) */}
            {label === "Account" && (
              <motion.div key="s2"
                initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepHeader
                  icon={<Lock size={18} className="text-emerald-400" />}
                  title="Create your account"
                  desc="Set up your login credentials"
                />
                <GlowCard className="mt-8" glowColor="rgba(34,197,94,0.15)">
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="First name" icon={<User size={11} />}>
                        <DarkInput type="text" placeholder="Sarah" />
                      </Field>
                      <Field label="Last name" icon={<User size={11} />}>
                        <DarkInput type="text" placeholder="Chen" />
                      </Field>
                    </div>
                    <Field label="Email address" icon={<Mail size={11} />}>
                      <DarkInput type="email" placeholder="sarah@organization.org" />
                    </Field>
                    <Field label="Password" icon={<Lock size={11} />}>
                      <div className="relative">
                        <DarkInput
                          type={showPwd ? "text" : "password"}
                          placeholder="Minimum 12 characters"
                          className="pr-10"
                        />
                        <button
                          onClick={() => setShowPwd(!showPwd)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                        >
                          {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </Field>
                    <Field label="Confirm password" icon={<Lock size={11} />}>
                      <DarkInput type="password" placeholder="Repeat your password" />
                    </Field>
                    {/* Strength hint */}
                    <div className="flex gap-1.5 pt-1">
                      {["Weak", "Fair", "Strong"].map((level, i) => (
                        <div key={level} className="flex-1 space-y-1">
                          <div className="h-0.5 rounded-full" style={{ background: i === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)" }} />
                          <span className="text-[9px] text-white/15">{level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {/* Preferences (donor only) — giving preferences, no organization required */}
            {label === "Preferences" && (
              <motion.div key="prefs"
                initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepHeader
                  icon={<Sparkles size={18} className="text-emerald-400" />}
                  title="Your giving preferences"
                  desc="Personalize how you give — no organization needed"
                />
                <GlowCard className="mt-8" glowColor="rgba(34,197,94,0.15)">
                  <div className="p-6 space-y-6">
                    <div>
                      <Label className="text-xs font-medium text-white/50 mb-3 block">Causes you care about</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Hunger relief", "Reducing food waste", "Community kitchens", "Children & families", "Seniors", "Disaster response"].map((c) => (
                          <Chip key={c} label={c} active={causes.has(c)} onClick={() => toggle(causes, setCauses, c)} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-white/50 mb-2 block">What will you contribute?</Label>
                      <DarkSelect>
                        <option className="bg-[#1a1a1a]">Surplus food from my business</option>
                        <option className="bg-[#1a1a1a]">Monetary donations</option>
                        <option className="bg-[#1a1a1a]">Both food and funds</option>
                      </DarkSelect>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRecurring(!recurring)}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors hover:border-white/15"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <TrendingUp size={16} className="text-emerald-400" />
                        <div>
                          <p className="text-sm font-medium text-white/80">Set up recurring giving</p>
                          <p className="text-xs text-white/30">Automate a monthly contribution — manage anytime</p>
                        </div>
                      </div>
                      <div className="w-10 h-6 rounded-full p-0.5 transition-colors shrink-0" style={{ background: recurring ? "#22c55e" : "rgba(255,255,255,0.1)" }}>
                        <motion.div className="w-5 h-5 rounded-full bg-white" animate={{ x: recurring ? 16 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                      </div>
                    </button>

                    <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06]">
                      <FileText size={13} className="text-emerald-400 shrink-0" />
                      <span className="text-xs text-emerald-300/70">Tax-deductible receipts are issued automatically to your email after each donation</span>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {/* Skills (volunteer only) */}
            {label === "Skills" && (
              <motion.div key="skills"
                initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepHeader
                  icon={<Zap size={18} className="text-emerald-400" />}
                  title="Your skills & transport"
                  desc="Help us match you with the right deliveries"
                />
                <GlowCard className="mt-8" glowColor="rgba(245,158,11,0.15)">
                  <div className="p-6 space-y-6">
                    <div>
                      <Label className="text-xs font-medium text-white/50 mb-3 block">Skills you can offer</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Driving", "Heavy lifting", "Cold-chain handling", "Food-safety certified", "Multilingual", "Route planning"].map((s) => (
                          <Chip key={s} label={s} active={skills.has(s)} accent="#f59e0b" onClick={() => toggle(skills, setSkills, s)} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-white/50 mb-2 block">Mode of transport</Label>
                      <DarkSelect>
                        <option className="bg-[#1a1a1a]">Car</option>
                        <option className="bg-[#1a1a1a]">Van / truck</option>
                        <option className="bg-[#1a1a1a]">Bicycle</option>
                        <option className="bg-[#1a1a1a]">Public transit</option>
                        <option className="bg-[#1a1a1a]">On foot</option>
                      </DarkSelect>
                    </div>
                    <Field label="Preferred travel radius" icon={<MapPin size={11} />}>
                      <DarkSelect>
                        <option className="bg-[#1a1a1a]">Up to 5 km</option>
                        <option className="bg-[#1a1a1a]">Up to 10 km</option>
                        <option className="bg-[#1a1a1a]">Up to 25 km</option>
                        <option className="bg-[#1a1a1a]">Any distance</option>
                      </DarkSelect>
                    </Field>
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {/* Availability (volunteer only) */}
            {label === "Availability" && (
              <motion.div key="avail"
                initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepHeader
                  icon={<Award size={18} className="text-emerald-400" />}
                  title="When are you available?"
                  desc="Set your recurring availability — you can adjust it anytime"
                />
                <GlowCard className="mt-8" glowColor="rgba(245,158,11,0.15)">
                  <div className="p-6 space-y-6">
                    <div>
                      <Label className="text-xs font-medium text-white/50 mb-3 block">Days of the week</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                          <Chip key={d} label={d} active={days.has(d)} accent="#f59e0b" onClick={() => toggle(days, setDays, d)} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-white/50 mb-3 block">Time of day</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Mornings", "Afternoons", "Evenings", "Late night"].map((t) => (
                          <Chip key={t} label={t} active={times.has(t)} accent="#f59e0b" onClick={() => toggle(times, setTimes, t)} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.06]">
                      <Truck size={13} className="text-amber-400 shrink-0" />
                      <span className="text-xs text-amber-300/70">We only notify you about deliveries that fit your availability and radius</span>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {/* Organization (NGO only) */}
            {label === "Organization" && (
              <motion.div key="s3"
                initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepHeader
                  icon={<Building2 size={18} className="text-emerald-400" />}
                  title="Organization details"
                  desc="Tell us about your organization"
                />
                <GlowCard className="mt-8" glowColor="rgba(34,197,94,0.15)">
                  <div className="p-6 space-y-4">
                    <Field label="Organization name" icon={<Building2 size={11} />}>
                      <DarkInput type="text" placeholder="Community Food Network" />
                    </Field>
                    <Field label="Organization type" icon={<Building2 size={11} />}>
                      <DarkSelect>
                        <option className="bg-[#1a1a1a]">Food bank</option>
                        <option className="bg-[#1a1a1a]">Community kitchen / soup kitchen</option>
                        <option className="bg-[#1a1a1a]">Shelter</option>
                        <option className="bg-[#1a1a1a]">Faith-based charity</option>
                        <option className="bg-[#1a1a1a]">Other registered non-profit</option>
                      </DarkSelect>
                    </Field>
                    <Field label="Charity / non-profit registration number" icon={<ShieldCheck size={11} />}>
                      <DarkInput type="text" placeholder="NPO-2024-XXXXX" />
                    </Field>
                    <Field label="Contact phone" icon={<Phone size={11} />}>
                      <DarkInput type="tel" placeholder="+1 (555) 000-0000" />
                    </Field>
                    <Field label="Website (optional)" icon={<Globe size={11} />}>
                      <DarkInput type="url" placeholder="https://yourorganization.org" />
                    </Field>
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {/* Location (all roles) */}
            {label === "Location" && (
              <motion.div key="s4"
                initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepHeader
                  icon={<MapPin size={18} className="text-emerald-400" />}
                  title="Location & address"
                  desc="Set your primary address for pickup and delivery matching"
                />
                <GlowCard className="mt-8" glowColor="rgba(34,197,94,0.15)">
                  <div className="p-6 space-y-4">
                    <Field label="Street address" icon={<MapPin size={11} />}>
                      <DarkInput type="text" placeholder="123 Main Street" />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="City">
                        <DarkInput type="text" placeholder="San Francisco" />
                      </Field>
                      <Field label="State / Province">
                        <DarkInput type="text" placeholder="CA" />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Postal code">
                        <DarkInput type="text" placeholder="94102" />
                      </Field>
                      <Field label="Country">
                        <DarkSelect>
                          <option className="bg-[#1a1a1a]">United States</option>
                          <option className="bg-[#1a1a1a]">Canada</option>
                          <option className="bg-[#1a1a1a]">United Kingdom</option>
                        </DarkSelect>
                      </Field>
                    </div>
                    <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06]">
                      <MapPin size={13} className="text-emerald-400 shrink-0" />
                      <span className="text-xs text-emerald-300/70">Location is used to match you with nearby donors and NGOs</span>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {/* Documents (NGO only) — verification workflow */}
            {label === "Documents" && (
              <motion.div key="s5"
                initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepHeader
                  icon={<ShieldCheck size={18} className="text-emerald-400" />}
                  title="Verification documents"
                  desc="Upload documents for platform verification — reviewed within 24–48 hours"
                />
                <div className="mt-8 space-y-4">
                  {[
                    { label: "Charity / non-profit registration certificate", required: true },
                    { label: "Proof of address", required: false },
                    { label: "Food handling & safety policy", required: false },
                  ].map((doc, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.09 }}
                    >
                      <GlowCard glowColor="rgba(34,197,94,0.12)">
                        <div className="p-5 flex items-center gap-4 cursor-pointer group">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 transition-colors">
                            <Upload size={16} className="text-white/30 group-hover:text-emerald-400 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white/70">{doc.label}</p>
                              {!doc.required && (
                                <span className="text-[10px] text-white/20 border border-white/10 rounded px-1.5 py-0.5">Optional</span>
                              )}
                            </div>
                            <p className="text-xs text-white/20 mt-0.5">PDF, PNG, or JPG — max 10 MB</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0 border-white/10 bg-transparent text-white/40 hover:bg-white/[0.06] hover:text-white/70 hover:border-white/20 text-xs rounded-lg"
                          >
                            Choose file
                          </Button>
                        </div>
                      </GlowCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Done — success (all roles) */}
            {label === "Done" && (
              <motion.div key="s6"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-12"
              >
                {/* Success ring */}
                <div className="relative inline-flex items-center justify-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
                    className="w-24 h-24 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
                  >
                    <Check size={40} className="text-emerald-400" />
                  </motion.div>
                  {/* Pulse rings */}
                  {[1, 2].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute inset-0 rounded-full border border-emerald-500/20"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.4 + ring * 0.3, opacity: 0 }}
                      transition={{ duration: 1.5, delay: ring * 0.3, repeat: Infinity, ease: "easeOut" }}
                    />
                  ))}
                </div>

                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-3xl font-bold text-white tracking-tight mb-3"
                >
                  You&apos;re all set!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-white/40 max-w-md mx-auto mb-2 leading-relaxed"
                >
                  {selectedRole === "ngo"
                    ? "Your organization account has been created. Our team will review your verification documents and activate full access within 24–48 hours."
                    : selectedRole === "volunteer"
                    ? "Your volunteer account is ready. We'll start matching you with nearby deliveries that fit your skills and availability."
                    : "Your account is ready. Start giving right away — tax receipts and impact reports will appear in your dashboard."}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.42 }}
                  className="text-sm text-emerald-400 font-medium mb-10"
                >
                  You can start exploring FoodBridge right now.
                </motion.p>

                {/* Role badge */}
                {activeRole && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 text-sm"
                    style={{ borderColor: activeRole.accent + "40", background: activeRole.accent + "12", color: activeRole.accent }}
                  >
                    <activeRole.icon size={14} />
                    Joined as {activeRole.title}
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={() => onLogin(selectedRole as "donor" | "ngo" | "volunteer" || "donor")}
                      className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base shadow-lg shadow-emerald-900/40 transition-all"
                    >
                      Go to Dashboard <ArrowRight size={16} className="ml-1.5" />
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Nav buttons */}
          {label !== "Done" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.05]"
            >
              <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  onClick={() => step > 1 ? setStep(step - 1) : onNavigate("landing")}
                  className="border-white/10 bg-transparent text-white/50 hover:bg-white/[0.05] hover:text-white/80 hover:border-white/20 rounded-xl"
                >
                  <ArrowLeft size={14} className="mr-1.5" />
                  {step === 1 ? "Back" : "Previous"}
                </Button>
              </motion.div>

              <div className="flex gap-2.5">
                <Button
                  variant="outline"
                  className="border-white/10 bg-transparent text-white/25 hover:bg-white/[0.04] hover:text-white/50 rounded-xl text-xs"
                >
                  Save progress
                </Button>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && !selectedRole}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold disabled:opacity-30 shadow-md shadow-emerald-900/30 transition-all"
                  >
                    Continue <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Step header ── */
function StepHeader({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      <p className="text-white/35 text-sm ml-12">{desc}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   EXPORT
═══════════════════════════════════════════════ */
export default function Auth({ mode, onNavigate, onLogin }: AuthProps) {
  if (mode === "login") return <LoginPage onNavigate={onNavigate} onLogin={onLogin} />;
  return <RegisterPage onNavigate={onNavigate} onLogin={onLogin} />;
}
