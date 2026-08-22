import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export function AnimatedGridBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(22,163,74,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(22,163,74,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(22,163,74,0.15), transparent)",
        }}
      />
    </div>
  );
}

export function AnimatedDotGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(22,163,74,0.4)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>
    </div>
  );
}

export function MovingBeams({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(22,163,74,0.6), transparent)",
            top: `${20 + i * 20}%`,
            width: "100%",
          }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 4 + i * 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.8,
          }}
        />
      ))}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute w-px"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(14,165,233,0.4), transparent)",
            left: `${25 + i * 25}%`,
            height: "100%",
          }}
          animate={{ y: ["-100%", "100%"] }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 1.2,
          }}
        />
      ))}
    </div>
  );
}
