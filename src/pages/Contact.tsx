import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, CheckCircle,
  Package, Handshake, Truck, ShieldCheck, ChevronRight, Loader2
} from "lucide-react";
import { Spotlight } from "../components/ui/spotlight";
import { BackgroundBeams } from "../components/ui/background-beams";
import { GlowingStarsBackgroundCard } from "../components/ui/glowing-stars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactProps {
  onNavigate: (page: string) => void;
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

const contacts = [
  { Icon: Mail, label: "Email us", value: "hello@foodbridge.io", sub: "We respond within 4 hours", color: "#22c55e" },
  { Icon: Phone, label: "Call us", value: "+1 (800) 324-7890", sub: "Mon–Fri, 9 AM–6 PM EST", color: "#38bdf8" },
  { Icon: MapPin, label: "Headquarters", value: "San Francisco, CA", sub: "545 Market Street, Suite 400", color: "#a78bfa" },
  { Icon: Clock, label: "Response time", value: "< 4 hours", sub: "Average first response", color: "#f59e0b" },
];

const roles = [
  { icon: Package, label: "Food Donor", desc: "Restaurants, hotels & businesses", color: "#22c55e" },
  { icon: Handshake, label: "NGO / Charity", desc: "Communities we serve food to", color: "#38bdf8" },
  { icon: Truck, label: "Volunteer Driver", desc: "Individuals who deliver food", color: "#a78bfa" },
  { icon: ShieldCheck, label: "Partner / Press", desc: "Organizations & media", color: "#f59e0b" },
];

const faqs = [
  { q: "How quickly does matching happen?", a: "Our algorithm scores and notifies NGOs within seconds of a donation being listed — typically under 2 minutes to first match." },
  { q: "Is FoodBridge free to use?", a: "Yes. FoodBridge is completely free for donors, NGOs, and volunteers. We're a non-profit platform funded by corporate partnerships." },
  { q: "What food types are accepted?", a: "Prepared meals, fresh produce, bakery items, canned goods, dairy, and packaged foods. We do not accept expired or unsafe-to-consume food." },
  { q: "How do you verify organizations?", a: "All NGOs and donor organizations go through a document verification process before going live. Volunteers are background-checked." },
];

export default function Contact({ onNavigate }: ContactProps) {
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1800);
  };

  return (
    <div className="bg-[#030303] min-h-screen text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-24 px-6">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs text-white/50 font-medium mb-8">
            <Globe size={12} className="text-emerald-400" />
            Available worldwide · English, Spanish, French, Hindi
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            Let&apos;s talk about
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              food rescue
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 }}
            className="text-white/40 text-lg max-w-xl mx-auto leading-relaxed">
            Whether you are a donor, an NGO, a volunteer, or a journalist — we would love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* ── CONTACT TILES ── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contacts.map((c, i) => {
            const Icon = c.Icon;
            return (
              <FadeUp key={i} delay={i * 0.08}>
                <GlowingStarsBackgroundCard className="h-full">
                  <div className="p-5 h-full flex flex-col">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${c.color}18`, border: `1px solid ${c.color}30` }}>
                      <Icon size={18} style={{ color: c.color }} />
                    </div>
                    <p className="text-white/40 text-[11px] font-medium uppercase tracking-widest mb-1">{c.label}</p>
                    <p className="text-white font-semibold text-sm leading-snug mb-1">{c.value}</p>
                    <p className="text-white/30 text-xs mt-auto">{c.sub}</p>
                  </div>
                </GlowingStarsBackgroundCard>
              </FadeUp>
            );
          })}
        </div>
      </section>

      {/* ── FORM + FAQ ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* Form */}
          <FadeUp delay={0.05}>
            <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-sky-500/[0.04] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                    <MessageSquare size={14} className="text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Send a message</h2>
                </div>

                {/* Role selector */}
                <div className="mb-6">
                  <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">I am a...</p>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((r, i) => {
                      const Icon = r.icon;
                      const active = selectedRole === i;
                      return (
                        <motion.button key={i} onClick={() => setSelectedRole(i)}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${active ? "border-emerald-500/50 bg-emerald-500/10" : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14]"}`}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: active ? `${r.color}22` : "rgba(255,255,255,0.04)" }}>
                            <Icon size={13} style={{ color: active ? r.color : "rgba(255,255,255,0.35)" }} />
                          </div>
                          <div>
                            <p className={`text-xs font-semibold leading-none mb-0.5 ${active ? "text-white" : "text-white/50"}`}>{r.label}</p>
                            <p className="text-[10px] text-white/25 leading-none">{r.desc}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12 text-center gap-4">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                        className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                        <CheckCircle size={28} className="text-emerald-400" />
                      </motion.div>
                      <div>
                        <p className="text-white font-bold text-lg mb-1">Message sent!</p>
                        <p className="text-white/40 text-sm">We will get back to you within 4 hours.</p>
                      </div>
                      <motion.button whileHover={{ scale: 1.03 }} onClick={() => setSent(false)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium mt-2">
                        Send another message
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-white/40 text-xs">First name</Label>
                          <Input required placeholder="Alex" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-white/40 text-xs">Last name</Label>
                          <Input required placeholder="Rivera" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white/40 text-xs">Email address</Label>
                        <Input required type="email" placeholder="alex@example.com" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white/40 text-xs">Organization <span className="text-white/20">(optional)</span></Label>
                        <Input placeholder="Green Harvest Co." className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white/40 text-xs">Message</Label>
                        <textarea required rows={4} placeholder="Tell us how we can help..."
                          className="w-full rounded-md border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all resize-none" />
                      </div>
                      <motion.div whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(34,197,94,0.25)" }} whileTap={{ scale: 0.98 }}>
                        <Button type="submit" disabled={sending} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-2.5 h-auto gap-2">
                          {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                          {sending ? "Sending..." : "Send message"}
                        </Button>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </FadeUp>

          {/* FAQ */}
          <FadeUp delay={0.12}>
            <div className="space-y-4">
              <div className="mb-8">
                <p className="text-xs font-semibold text-emerald-400 tracking-[0.15em] uppercase mb-3">FAQ</p>
                <h2 className="text-2xl font-bold text-white tracking-tight">Common questions</h2>
                <p className="text-white/40 text-sm mt-2">Can&apos;t find what you&apos;re looking for? Send us a message.</p>
              </div>

              {faqs.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <motion.div key={i} layout className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                    <motion.button whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }} onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors">
                      <span className={`text-sm font-medium transition-colors ${open ? "text-white" : "text-white/60"}`}>{faq.q}</span>
                      <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                        <ChevronRight size={16} className={open ? "text-emerald-400" : "text-white/20"} />
                      </motion.div>
                    </motion.button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                          <div className="px-5 pb-4 text-sm text-white/40 leading-relaxed border-t border-white/[0.05] pt-3">{faq.a}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Back to app CTA */}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="mt-6 p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] cursor-pointer"
                onClick={() => onNavigate("login")}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">Ready to get started?</p>
                    <p className="text-white/40 text-xs">Join 2,800+ organizations already on FoodBridge.</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <ChevronRight size={16} className="text-emerald-400" />
                  </div>
                </div>
              </motion.div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA BEAMS ── */}
      <section className="relative overflow-hidden py-24 px-6 text-center border-t border-white/[0.05]">
        <BackgroundBeams className="absolute inset-0" />
        <div className="relative z-10 max-w-xl mx-auto">
          <FadeUp>
            <p className="text-xs font-semibold text-emerald-400 tracking-[0.15em] uppercase mb-4">Together</p>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Every connection saves food.</h2>
            <p className="text-white/40 text-sm mb-8">Our team is available Monday–Friday from 9 AM to 6 PM EST. For urgent food safety issues, we respond 24/7.</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <motion.div whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(34,197,94,0.3)" }} whileTap={{ scale: 0.97 }}>
                <Button onClick={() => onNavigate("register")} className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-2.5 h-auto gap-2">
                  <Handshake size={15} /> Join FoodBridge
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" onClick={() => onNavigate("landing")} className="border-white/15 text-white/60 hover:text-white hover:border-white/30 px-6 py-2.5 h-auto">
                  Back to home
                </Button>
              </motion.div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
