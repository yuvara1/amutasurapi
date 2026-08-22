import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({ children, className = "", glowColor = "rgba(22,163,74,0.3)" }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0, visible: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setGlowPos((p) => ({ ...p, visible: false }))}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 ${className}`}
      style={{ isolation: "isolate" }}
    >
      {glowPos.visible && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${glowPos.x}px ${glowPos.y}px, ${glowColor}, transparent 70%)`,
            opacity: 0.5,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface MovingBorderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MovingBorderButton({ children, onClick, className = "" }: MovingBorderButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex h-12 overflow-hidden rounded-xl p-px focus:outline-none ${className}`}
    >
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#16a34a_0%,#4ade80_50%,#16a34a_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-6 py-1 text-sm font-semibold text-white backdrop-blur-3xl gap-2 font-display">
        {children}
      </span>
    </button>
  );
}

export function BorderBeam({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 rounded-2xl ${className}`} style={{ padding: 1 }}>
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <motion.div
          className="absolute h-full w-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, rgba(22,163,74,0.8) 60deg, transparent 120deg)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}
