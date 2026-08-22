import { useState } from "react";
import { useNav } from "@/hooks/useNav";
import { motion } from "framer-motion";
import { Leaf, ArrowRight, CheckCircle, Package, MapPin, Zap, Target, BarChart3, Truck, Wheat, UtensilsCrossed, Handshake, Users, FileText, Award, TrendingUp, Recycle } from "lucide-react";
import {
  Navbar, NavBody, NavItems, MobileNav, MobileNavHeader,
  MobileNavToggle, MobileNavMenu, NavbarButton,
} from "@/components/ui/resizable-navbar";
import { Spotlight } from "@/components/ui/spotlight";
import { WebcamPixelGrid } from "@/components/ui/webcam-pixel-grid";
import { AnimatedCounter, FadeUpSection } from "@/components/ui/TextEffects";
import { DraggableCardBody, DraggableCardContainer } from "@/components/ui/draggable-card";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { LampContainer } from "@/components/ui/lamp";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { GlowingStarsBackgroundCard } from "@/components/ui/glowing-stars";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Meteors } from "@/components/ui/meteors";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import FoodDomeGallery from "@/components/FoodDomeGallery";

interface LandingProps {
}

/* ── Data ─────────────────────────────────────────────────── */
const navItems = [
  { name: "Features", link: "#features" },
  { name: "How it works", link: "#how-it-works" },
  { name: "Matching", link: "#matching" },
];

const stats = [
  { label: "Food Rescued", value: 2500, suffix: " kg", icon: "🌿" },
  { label: "Meals Given", value: 400, suffix: "", icon: "🍽️" },
  { label: "NGO Partners", value: 138, suffix: "", icon: "🤝" },
  { name: "Volunteers", value: 512, suffix: "", icon: "🚚" },
];

const features = [
  {
    icon: <Package size={18} />, title: "Smart Donations", accent: "#4ade80",
    desc: "List surplus food in minutes with safety details, dietary info, and pickup windows. Auto-published to matched NGOs instantly.",
    img: "https://images.unsplash.com/photo-1648587456176-4969b0124b12?w=600&h=340&fit=crop&auto=format",
  },
  {
    icon: <Target size={18} />, title: "AI-Powered Matching", accent: "#38bdf8",
    desc: "Six-factor compatibility scoring — distance, expiry urgency, food type, capacity, dietary needs, and NGO reliability.",
    img: "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=600&h=340&fit=crop&auto=format",
  },
  {
    icon: <Truck size={18} />, title: "Live Delivery Tracking", accent: "#f59e0b",
    desc: "WebSocket-powered real-time GPS for donors, NGOs, and volunteers. Photo proof. Automated status updates.",
    img: "https://images.unsplash.com/photo-1634743556192-d19f0c69ff3a?w=600&h=340&fit=crop&auto=format",
  },
  {
    icon: <BarChart3 size={18} />, title: "Impact Analytics", accent: "#a78bfa",
    desc: "See meals distributed, carbon avoided, and success rates in real time. Export reports for CSR compliance.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop&auto=format",
  },
  {
    icon: <Zap size={18} />, title: "Instant Notifications", accent: "#fb923c",
    desc: "Event-driven alerts via Kafka ensure every stakeholder is notified within seconds of any status change.",
    img: "https://images.unsplash.com/photo-1597974828431-9078248d8cc9?w=600&h=340&fit=crop&auto=format",
  },
  {
    icon: <MapPin size={18} />, title: "Route Optimization", accent: "#34d399",
    desc: "Volunteers get optimal routes with turn-by-turn guidance. Cluster pickups reduce trip time by up to 40%.",
    img: "https://images.unsplash.com/photo-1594935975218-a3596da034a3?w=600&h=340&fit=crop&auto=format",
  },
];


const matchFactors = [
  { label: "Distance", weight: 30, color: "#22c55e" },
  { label: "Expiry urgency", weight: 25, color: "#38bdf8" },
  { label: "Food type match", weight: 20, color: "#a78bfa" },
  { label: "NGO capacity", weight: 10, color: "#fbbf24" },
  { label: "Dietary compatibility", weight: 10, color: "#f87171" },
  { label: "NGO reliability", weight: 5, color: "#94a3b8" },
];

const feedbackCards = [
  {
    title: "Sarah Chen",
    role: "Green Harvest Co. · Food Donor",
    quote: "We now redirect 400 kg of surplus produce weekly. Simple, trackable, and impactful.",
    image: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=400&h=400&fit=crop&auto=format",
    className: "absolute top-10 left-[10%] rotate-[-5deg]",
  },
  {
    title: "Priya Nair",
    role: "Community Kitchen · NGO Director",
    quote: "Compatibility scoring means we always receive exactly what we need. Game-changer.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=400&fit=crop&auto=format",
    className: "absolute top-32 left-[24%] rotate-[-8deg]",
  },
  {
    title: "Alex Rivera",
    role: "Volunteer Driver",
    quote: "2–3 deliveries per week. The live tracking guidance makes every run seamless.",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922559?w=400&h=400&fit=crop&auto=format",
    className: "absolute top-6 left-[40%] rotate-[6deg]",
  },
  {
    title: "James Okafor",
    role: "City Bakehouse · Head of Operations",
    quote: "We used to throw out 30 kg of bread daily. Now it feeds families by 8 AM.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&auto=format",
    className: "absolute top-28 left-[55%] rotate-[9deg]",
  },
  {
    title: "Maria Santos",
    role: "Hope Foundation · Logistics Lead",
    quote: "The volunteer assignment flow is brilliant. We've cut coordination time by 70%.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=400&fit=crop&auto=format",
    className: "absolute top-8 right-[8%] rotate-[-4deg]",
  },
  {
    title: "Grand Hotel Group",
    role: "Corporate Donor",
    quote: "FoodBridge handles our entire post-event surplus. The impact reports satisfy our CSR board.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop&auto=format",
    className: "absolute top-36 right-[20%] rotate-[5deg]",
  },
];

/* ────────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNav();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">

      {/* ── ACETERNITY RESIZABLE NAVBAR ── */}
      <Navbar>
        <NavBody>
          {/* Logo */}
          <button
            onClick={() => navigate("landing")}
            className="relative z-20 flex items-center gap-2.5 px-2 py-1"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <Leaf size={14} className="text-white" />
            </div>
            <span className="font-semibold text-white tracking-tight">FoodBridge</span>
          </button>

          <NavItems items={navItems} />

          <div className="flex items-center gap-3">
            <NavbarButton as="button" variant="secondary" onClick={() => navigate("login")}>
              Sign in
            </NavbarButton>
            <NavbarButton as="button" variant="dark" onClick={() => navigate("register")}>
              Get started
            </NavbarButton>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <button onClick={() => navigate("landing")} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Leaf size={14} className="text-white" />
              </div>
              <span className="font-semibold text-white text-sm">FoodBridge</span>
            </button>
            <MobileNavToggle isOpen={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} />
          </MobileNavHeader>
          <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
            {navItems.map((item, i) => (
              <a key={i} href={item.link} onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                {item.name}
              </a>
            ))}
            <div className="flex flex-col gap-3 w-full pt-2">
              <NavbarButton as="button" variant="secondary" className="w-full justify-center"
                onClick={() => { setMobileOpen(false); navigate("login"); }}>
                Sign in
              </NavbarButton>
              <NavbarButton as="button" variant="dark" className="w-full justify-center"
                onClick={() => { setMobileOpen(false); navigate("register"); }}>
                Get started
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* ── HERO — WebcamPixelGrid + Spotlight ── */}
      <section className="relative h-screen w-full bg-black overflow-hidden">

        {/* WebcamPixelGrid background */}
        <div className="absolute inset-0">
          <WebcamPixelGrid
            gridCols={typeof window !== "undefined" && window.innerWidth < 640 ? 30 : 60}
            gridRows={typeof window !== "undefined" && window.innerWidth < 640 ? 20 : 40}
            maxElevation={50}
            motionSensitivity={0.25}
            elevationSmoothing={0.2}
            colorMode="webcam"
            backgroundColor="#030303"
            mirror={true}
            gapRatio={0.05}
            invertColors={false}
            darken={0.65}
            borderColor="#ffffff"
            borderOpacity={0.05}
            className="w-full h-full"
          />
        </div>

        {/* Spotlight */}
        <div className="absolute inset-0 overflow-hidden">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 backdrop-blur-sm"
          >
            <motion.span
              className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Cloud-native food rescue network
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)", lineHeight: 1.08 }}
          >
            <LayoutTextFlip
              text="Built for "
              words={["food donors", "NGO partners", "volunteers", "communities"]}
              duration={2800}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-xl text-base text-white/50 leading-relaxed"
          >
            FoodBridge connects surplus food donors with NGOs and volunteer drivers — event-driven, real-time, and built to scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={() => navigate("register")}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-black transition-all hover:bg-white/90 hover:scale-[1.03]"
            >
              Start rescuing food
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => navigate("login")}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25"
            >
              View the platform
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/30 px-4"
          >
            {["138 NGO partners", "512 volunteers", "284K kg rescued", "Free to join"].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle size={11} className="text-emerald-500" /> {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS MARQUEE — InfiniteMovingCards ── */}
      <div className="border-y border-white/[0.05] bg-[#030303] py-6 overflow-hidden">
        <InfiniteMovingCards
          direction="left"
          speed="normal"
          pauseOnHover={true}
          itemClassName="w-[180px]"
          items={[
            { quote: "284,500 kg", name: "Food Rescued", title: "Since launch" },
            { quote: "48,200",     name: "Meals Distributed", title: "To 138 NGOs" },
            { quote: "138",        name: "NGO Partners", title: "Across 12 cities" },
            { quote: "512",        name: "Active Volunteers", title: "Verified drivers" },
            { quote: "48 min",     name: "Avg Match Time", title: "Real-time Kafka" },
            { quote: "87%",        name: "Success Rate", title: "Completed deliveries" },
            { quote: "142 t",      name: "CO₂ Avoided", title: "Est. vs. landfill" },
            { quote: "1,290+",     name: "Donations Processed", title: "All verified" },
          ]}
        />
      </div>

      {/* ── STATS GRID — GlowingStarsBackgroundCard ── */}
      <section className="py-20 bg-[#030303]">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUpSection className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Food Rescued",      target: 284500, suffix: " kg", Icon: Wheat,           accent: "#4ade80" },
              { label: "Meals Distributed", target: 48200,  suffix: "",    Icon: UtensilsCrossed,  accent: "#38bdf8" },
              { label: "NGO Partners",      target: 138,    suffix: "",    Icon: Handshake,        accent: "#a78bfa" },
              { label: "Active Volunteers", target: 512,    suffix: "",    Icon: Users,            accent: "#fb923c" },
            ].map((s, i) => (
              <GlowingStarsBackgroundCard
                key={i}
                className="max-w-full h-auto rounded-2xl border-white/[0.07] bg-[linear-gradient(135deg,#0c0c14_0%,#07070a_100%)] p-0"
              >
                <div className="pt-3 pb-4 px-2 sm:pt-4 sm:pb-5 sm:px-4 text-center">
                  <div className="w-8 h-8 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: s.accent + "18" }}>
                    <s.Icon size={16} style={{ color: s.accent }} />
                  </div>
                  <div
                    className="text-xl sm:text-2xl md:text-3xl font-bold tabular-nums mb-1 leading-none break-all"
                    style={{ color: s.accent }}
                  >
                    <AnimatedCounter target={s.target} suffix={s.suffix} />
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/40 font-medium">{s.label}</div>
                </div>
              </GlowingStarsBackgroundCard>
            ))}
          </FadeUpSection>
        </div>
      </section>

      {/* ── FOOD GALLERY — DomeGallery ── */}
      <section className="relative bg-[#030303] overflow-hidden h-[420px] sm:h-[560px] md:h-[680px]">
        <FadeUpSection className="absolute top-8 left-0 right-0 z-10 text-center pointer-events-none px-4">
          <p className="text-xs font-semibold text-emerald-400 tracking-[0.15em] uppercase mb-3">What we rescue</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Real food. Real impact.
          </h2>
          <p className="text-white/30 mt-2 text-xs sm:text-sm">Drag to explore · Click to enlarge</p>
        </FadeUpSection>
        <FoodDomeGallery />
      </section>

      {/* ── FEATURES — 3D Cards ── */}
      <section id="features" className="py-16 bg-[#030303]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUpSection className="text-center mb-2">
            <p className="text-xs font-semibold text-emerald-400 tracking-[0.15em] uppercase mb-4">Platform capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Everything your food rescue needs
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              From donation to delivery in one unified platform — built for donors, NGOs, and volunteers.
            </p>
          </FadeUpSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <CardContainer key={i} containerClassName="py-4 px-2">
                <CardBody className="relative group/card bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl p-5 w-full h-auto transition-colors duration-300">
                  {/* Floating image */}
                  <CardItem translateZ={80} className="w-full mt-1 mb-4">
                    <img
                      src={f.img}
                      alt={f.title}
                      className="w-full h-40 object-cover rounded-xl"
                      style={{ boxShadow: `0 8px 32px ${f.accent}18` }}
                    />
                  </CardItem>

                  {/* Icon badge */}
                  <CardItem translateZ={60} className="mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${f.accent}18`, border: `1px solid ${f.accent}30`, color: f.accent }}
                    >
                      {f.icon}
                    </div>
                  </CardItem>

                  {/* Title */}
                  <CardItem translateZ={40} className="mb-2">
                    <h3 className="text-white font-semibold tracking-tight">{f.title}</h3>
                  </CardItem>

                  {/* Description */}
                  <CardItem as="p" translateZ={20} className="text-white/40 text-sm leading-relaxed">
                    {f.desc}
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — StickyScroll ── */}
      <section id="how-it-works" className="bg-[#030303] py-14">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUpSection className="text-center mb-10">
            <p className="text-xs font-semibold text-emerald-400 tracking-[0.15em] uppercase mb-4">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Five steps from surplus to impact
            </h2>
            <p className="text-white/40 mt-3 text-sm max-w-lg mx-auto">
              From the moment a donor lists food to the moment it reaches a family — everything is tracked, matched, and verified.
            </p>
          </FadeUpSection>

          <StickyScroll
            containerHeight="h-[75vh]"
            content={[
              {
                title: "List surplus food",
                description: "Donors create a listing with food type, quantity, expiry time, dietary tags, and a pickup window — takes under 2 minutes. The donation is immediately indexed and made available to eligible NGOs.",
                accent: "#22c55e",
                content: (
                  <div className="w-full h-full flex flex-col justify-center p-4 sm:p-8 gap-3 sm:gap-5">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                        <Package size={16} />
                      </div>
                      <span className="text-sm font-semibold text-white">New Donation</span>
                      <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Live</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {[
                        { label: "Food type", val: "Cooked rice & dal" },
                        { label: "Quantity", val: "48 kg" },
                        { label: "Expires", val: "Today, 6 PM" },
                        { label: "Dietary", val: "Vegan · Halal" },
                      ].map((r) => (
                        <div key={r.label} className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
                          <p className="text-[10px] text-white/30 mb-1">{r.label}</p>
                          <p className="text-sm font-medium text-white">{r.val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {["Pickup window set", "Address verified", "Photo uploaded"].map((t) => (
                        <span key={t} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          <CheckCircle size={10} /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                title: "Smart NGO matching",
                description: "The scoring engine evaluates every eligible NGO across six weighted factors in real time — distance, expiry urgency, food compatibility, capacity, dietary alignment, and past reliability.",
                accent: "#38bdf8",
                content: (
                  <div className="w-full h-full flex flex-col justify-center p-4 sm:p-8 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400 shrink-0">
                        <Target size={16} />
                      </div>
                      <span className="text-sm font-semibold text-white">Match Score Breakdown</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Proximity", pct: 92, color: "#22c55e" },
                        { label: "Expiry urgency", pct: 85, color: "#38bdf8" },
                        { label: "Food compatibility", pct: 100, color: "#a78bfa" },
                        { label: "Capacity fit", pct: 78, color: "#f59e0b" },
                        { label: "Reliability score", pct: 97, color: "#f472b6" },
                      ].map((f) => (
                        <div key={f.label}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[11px] text-white/50">{f.label}</span>
                            <span className="text-[11px] font-mono" style={{ color: f.color }}>{f.pct}%</span>
                          </div>
                          <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${f.pct}%` }}
                              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                              className="h-full rounded-full"
                              style={{ background: f.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-1 flex items-center justify-between bg-sky-500/[0.06] border border-sky-500/15 rounded-xl px-4 py-2.5">
                      <span className="text-xs text-white/50">Overall score</span>
                      <span className="text-lg font-bold text-sky-400 font-mono">94 / 100</span>
                    </div>
                  </div>
                ),
              },
              {
                title: "NGO reviews & confirms",
                description: "The top-scored NGO receives an instant push notification with full donation details. One tap to accept. A volunteer from the nearest verified pool is automatically dispatched.",
                accent: "#a78bfa",
                content: (
                  <div className="w-full h-full flex flex-col justify-center p-4 sm:p-8 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-400 shrink-0">
                        <CheckCircle size={16} />
                      </div>
                      <span className="text-sm font-semibold text-white">Offer Notification</span>
                    </div>
                    <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-300 shrink-0">CK</div>
                        <div>
                          <p className="text-sm font-semibold text-white">Community Kitchen NGO</p>
                          <p className="text-xs text-white/30">200 kg cap · 97% accept rate · 1.2 km away</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/[0.03] rounded-lg p-2.5">
                          <p className="text-white/30 mb-0.5">Offered</p>
                          <p className="text-white font-medium">48 kg · Cooked rice</p>
                        </div>
                        <div className="bg-white/[0.03] rounded-lg p-2.5">
                          <p className="text-white/30 mb-0.5">Pickup deadline</p>
                          <p className="text-amber-400 font-medium">Today, 6 PM</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold">Decline</button>
                        <button className="flex-1 py-2 rounded-lg bg-violet-500 text-white text-xs font-semibold">Accept Donation</button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                      Volunteer auto-assigned on accept
                    </div>
                  </div>
                ),
              },
              {
                title: "Volunteer picks up & delivers",
                description: "The assigned volunteer picks up the food and delivers it with live GPS tracking visible to all parties. Photo proof is captured on arrival and the chain of custody is logged.",
                accent: "#f59e0b",
                content: (
                  <div className="w-full h-full flex flex-col justify-center p-4 sm:p-8 gap-3 sm:gap-5">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
                        <Truck size={16} />
                      </div>
                      <span className="text-sm font-semibold text-white">Live Tracking</span>
                      <span className="ml-auto text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">In transit</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: "Pickup confirmed", sub: "2:14 PM — Raj Kumar", color: "#4ade80", done: true },
                        { label: "In transit", sub: "2:21 PM — 1.1 km remaining", color: "#f59e0b", done: true, active: true },
                        { label: "Delivered", sub: "Awaiting arrival", color: "#94a3b8", done: false },
                        { label: "Photo proof captured", sub: "Awaiting delivery", color: "#94a3b8", done: false },
                      ].map((s, i) => (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${s.active ? "bg-amber-500/[0.06] border border-amber-500/15" : ""}`}>
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                            style={{ borderColor: s.done ? s.color : "rgba(255,255,255,0.1)", background: s.done ? `${s.color}22` : "transparent" }}>
                            {s.done && <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />}
                          </div>
                          <div>
                            <p className="text-xs font-medium" style={{ color: s.done ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)" }}>{s.label}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: s.done ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)" }}>{s.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                title: "Impact logged in real time",
                description: "Meals counted, CO₂ offset calculated, and tax receipts issued — all automated. Donors, NGOs, and admins see updated dashboards instantly. Every delivery builds the network's cumulative impact score.",
                accent: "#22c55e",
                content: (
                  <div className="w-full h-full flex flex-col justify-center p-4 sm:p-8 gap-3 sm:gap-5">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                        <BarChart3 size={16} />
                      </div>
                      <span className="text-sm font-semibold text-white">Impact Report</span>
                      <span className="ml-auto text-[10px] font-mono text-emerald-400">Just now</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                      {[
                        { val: "48 kg", label: "Food rescued", color: "#22c55e" },
                        { val: "82", label: "Meals served", color: "#38bdf8" },
                        { val: "0.24t", label: "CO₂ avoided", color: "#a78bfa" },
                      ].map((s) => (
                        <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] py-2 sm:py-4 px-1 sm:px-2 min-w-0">
                          <div className="text-sm sm:text-lg font-bold font-mono truncate" style={{ color: s.color }}>{s.val}</div>
                          <div className="text-[9px] sm:text-[10px] text-white/30 mt-0.5 leading-tight">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: "Tax receipt", val: "Auto-generated · PDF ready", Icon: FileText, accent: "#4ade80" },
                        { label: "Impact certificate", val: "Shared with donor", Icon: Award, accent: "#38bdf8" },
                        { label: "Network score", val: "+12 pts added", Icon: TrendingUp, accent: "#a78bfa" },
                      ].map((r) => (
                        <div key={r.label} className="flex items-center gap-2 sm:gap-3 bg-white/[0.02] rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 border border-white/[0.04]">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: r.accent + "18" }}>
                            <r.Icon size={12} style={{ color: r.accent }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white/70">{r.label}</p>
                            <p className="text-[10px] text-white/30">{r.val}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* ── INTELLIGENT MATCHING — Meteors + 3D card ── */}
      <section id="matching" className="relative py-16 sm:py-24 bg-[#030303] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 55% 50% at 10% 50%, rgba(56,189,248,0.05) 0%, transparent 70%)" }} />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left — copy with Lamp */}
            <FadeUpSection>
              <LampContainer color="#38bdf8" className="mb-2 -mx-2">
                <div className="px-2 pt-4">
                  <p className="text-xs font-semibold text-sky-400 tracking-[0.15em] uppercase mb-4">Intelligent Matching</p>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5 leading-[1.15]">
                    Data-driven matching,<br />not guesswork
                  </h2>
                  <p className="text-white/40 leading-relaxed mb-8">
                    Six weighted factors determine the best NGO for every donation — evaluated in real time via Kafka event streams.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Real-time event-driven matching via Kafka",
                      "Elasticsearch for proximity queries",
                      "Configurable weight system per platform policy",
                      "Match offer workflow with NGO accept/reject",
                    ].map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/50">
                        <CheckCircle size={14} className="text-sky-400 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("register")}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-all"
                  >
                    See it in action <ArrowRight size={14} />
                  </button>
                </div>
              </LampContainer>
            </FadeUpSection>

            {/* Right — 3D card with Meteors */}
            <FadeUpSection delay={0.15}>
              <CardContainer containerClassName="py-0">
                <CardBody className="relative w-full h-auto rounded-2xl border border-white/[0.1] bg-[#050810] p-6 overflow-hidden">

                  {/* Meteors — represents Kafka event streams */}
                  <Meteors number={18} className="bg-sky-400 before:from-sky-400" />

                  {/* Score ring — floats toward viewer */}
                  <CardItem translateZ={60}>
                    <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/[0.07]">
                      <div className="relative w-20 h-20 shrink-0">
                        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                          <circle cx="40" cy="40" r="33" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                          <motion.circle
                            cx="40" cy="40" r="33" fill="none"
                            stroke="#22c55e" strokeWidth="8" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 33}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 33 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 33 * 0.06 }}
                            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-bold text-white leading-none">94%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1">Compatibility Score</p>
                        <p className="font-semibold text-white">Excellent Match</p>
                        <p className="text-xs text-emerald-400 mt-1">Community Kitchen · 2.3 km</p>
                      </div>
                    </div>
                  </CardItem>

                  {/* Factor bars — mid depth */}
                  <CardItem translateZ={40} className="w-full">
                    <div className="space-y-3">
                      {matchFactors.map((f, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-white/40">{f.label}</span>
                            <span className="text-white/30 font-mono">{f.weight}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: f.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${f.weight * 3.1}%` }}
                              transition={{ duration: 0.8, delay: 0.4 + i * 0.08, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardItem>

                  {/* NGO result row — nearest to viewer */}
                  <CardItem translateZ={80} className="w-full mt-5 pt-5 border-t border-white/[0.07]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400 text-xs font-bold shrink-0">CK</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm">Community Kitchen NGO</p>
                        <p className="text-xs text-white/30 mt-0.5">200 kg capacity · 97% acceptance rate</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-1 shrink-0">Recommended</span>
                    </div>
                  </CardItem>

                </CardBody>
              </CardContainer>
            </FadeUpSection>

          </div>
        </div>
      </section>

      {/* ── FEEDBACK — Draggable Cards (desktop) / Scroll Cards (mobile) ── */}
      <section className="relative bg-[#030303] overflow-hidden">
        <FadeUpSection className="text-center pt-20 pb-8 relative z-10 px-6">
          <p className="text-xs font-semibold text-emerald-400 tracking-[0.15em] uppercase mb-4">Community voices</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Trusted by the community
          </h2>
          <p className="text-white/30 mt-3 text-sm hidden md:block">Drag the cards to explore</p>
        </FadeUpSection>

        {/* Mobile: horizontal scroll row */}
        <div className="md:hidden overflow-x-auto pb-10 px-6" style={{ scrollbarWidth: "none" }}>
          <div className="flex gap-4" style={{ width: "max-content" }}>
            {feedbackCards.map((card) => (
              <div key={card.title} className="w-64 shrink-0 rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs text-white/50 leading-relaxed mb-3">"{card.quote}"</p>
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{card.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: draggable scattered layout */}
        <DraggableCardContainer className="relative hidden md:block w-full min-h-[560px]">
          {feedbackCards.map((card) => (
            <DraggableCardBody key={card.title} className={card.className}>
              <img
                src={card.image}
                alt={card.title}
                className="pointer-events-none relative z-10 h-52 w-52 object-cover rounded-xl"
              />
              <div className="mt-3 px-1">
                <p className="text-xs text-neutral-400 leading-relaxed mb-2">"{card.quote}"</p>
                <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{card.title}</p>
                <p className="text-xs text-neutral-500">{card.role}</p>
              </div>
            </DraggableCardBody>
          ))}
        </DraggableCardContainer>
      </section>

      {/* ── CTA — BackgroundBeams ── */}
      <section className="relative py-32 bg-[#030303] overflow-hidden">
        <BackgroundBeams className="absolute inset-0" />

        <FadeUpSection className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-emerald-400 tracking-[0.15em] uppercase mb-6">Ready to start?</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            Turn surplus into{" "}
            <span style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              impact.
            </span>
          </h2>
          <p className="text-white/40 mb-10 leading-relaxed">
            Join 800+ organizations and volunteers who rescue food, build community, and create measurable change every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("register")}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-black hover:bg-white/90 hover:scale-[1.03] transition-all"
            >
              Join FoodBridge <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate("register")}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/25 transition-all"
            >
              Become a Partner
            </button>
          </div>
        </FadeUpSection>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-[#030303] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Leaf size={13} className="text-white" />
            </div>
            <span className="font-semibold text-white text-sm">FoodBridge</span>
          </div>
          <p className="text-xs text-white/20">© 2026 FoodBridge. Cloud-native food rescue network.</p>
          <div className="flex gap-5 text-xs text-white/30">
            {["Privacy", "Terms", "API"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
            <button onClick={() => navigate("contact")} className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
