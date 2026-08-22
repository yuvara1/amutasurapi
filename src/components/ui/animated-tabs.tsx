import React, { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  value: string;
  label: string;
  icon?: React.ElementType;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: (activeTab: string) => React.ReactNode;
  className?: string;
}

interface TabIndicatorRect {
  left: number;
  width: number;
}

export function AnimatedTabs({ tabs, defaultValue, onChange, children, className }: AnimatedTabsProps) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value ?? "");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [rect, setRect] = useState<TabIndicatorRect>({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const idx = tabs.findIndex(t => t.value === active);
    const el = tabRefs.current[idx];
    if (!el) return;
    setRect({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active, tabs]);

  const handleClick = (value: string) => {
    setActive(value);
    onChange?.(value);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Tab bar */}
      <div className="w-full overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}>
        <div className="relative flex items-center gap-1 bg-muted/60 backdrop-blur-sm rounded-xl p-1 w-max min-w-full sm:w-fit sm:min-w-0">
          {/* Sliding pill */}
          <motion.div
            className="absolute top-1 h-[calc(100%-8px)] rounded-lg bg-background shadow-sm border border-border/60"
            animate={{ left: rect.left, width: rect.width }}
            initial={false}
            transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
          />

          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = active === tab.value;
            return (
              <button
                key={tab.value}
                ref={el => { tabRefs.current[i] = el; }}
                onClick={() => handleClick(tab.value)}
                className={cn(
                  "relative z-10 flex items-center gap-1.5 px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors select-none whitespace-nowrap",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
                )}
              >
                {Icon && (
                  <motion.span animate={{ scale: isActive ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                    <Icon size={14} />
                  </motion.span>
                )}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        {children(active)}
      </motion.div>
    </div>
  );
}
