import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LampContainer({
  children,
  className,
  color = "#22c55e",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <div className={cn("relative flex flex-col items-center justify-center overflow-hidden w-full bg-transparent z-0", className)}>
      {/* Beam layer */}
      <div className="relative flex w-full flex-1 scale-y-125 items-end justify-center isolate z-0 h-64">

        {/* Left beam */}
        <motion.div
          initial={{ opacity: 0.4, width: "8rem" }}
          whileInView={{ opacity: 1, width: "20rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.9, ease: "easeInOut" }}
          className="absolute bottom-0 right-1/2 h-48 overflow-hidden"
          style={{
            background: `conic-gradient(from 70deg at center top, ${color} 0%, transparent 60%)`,
          }}
        >
          {/* Fade edges */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030303] to-transparent" />
          <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[#030303] to-transparent" />
        </motion.div>

        {/* Right beam */}
        <motion.div
          initial={{ opacity: 0.4, width: "8rem" }}
          whileInView={{ opacity: 1, width: "20rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.9, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/2 h-48 overflow-hidden"
          style={{
            background: `conic-gradient(from 290deg at center top, ${color} 0%, transparent 60%)`,
          }}
        >
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030303] to-transparent" />
          <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[#030303] to-transparent" />
        </motion.div>

        {/* Central glow orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.45, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 h-24 w-48 rounded-full blur-3xl"
          style={{ background: color }}
        />

        {/* Lamp line */}
        <motion.div
          initial={{ width: "6rem", opacity: 0 }}
          whileInView={{ width: "18rem", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.9, ease: "easeInOut" }}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
          style={{ background: color, boxShadow: `0 0 12px 2px ${color}` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
