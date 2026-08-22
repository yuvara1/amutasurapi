import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
  containerHeight = "h-[82vh]",
  accentColors,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
    accent?: string;
  }[];
  contentClassName?: string;
  containerHeight?: string;
  accentColors?: string[];
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observers = content.map((_, index) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveCard(index);
        },
        {
          root: container,
          rootMargin: "-35% 0px -35% 0px",
          threshold: 0,
        },
      );
      const el = itemRefs.current[index];
      if (el) obs.observe(el);
      return obs;
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [content]);

  const activeAccent =
    content[activeCard]?.accent ??
    accentColors?.[activeCard % (accentColors?.length ?? 1)] ??
    "#22c55e";

  return (
    <>
      <div className="lg:hidden space-y-6">
        {content.map((item, index) => {
          const accent = item.accent ?? "#22c55e";
          return (
            <div
              key={item.title + index}
              className="rounded-2xl border border-white/[0.07] overflow-hidden"
            >
              <div className="flex items-center gap-3 p-5 bg-white/[0.02]">
                <div
                  className="w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-bold font-mono text-white shrink-0"
                  style={{ background: `${accent}1a`, borderColor: accent }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/50 px-5 pt-1 pb-4">
                {item.description}
              </p>
              {item.content && (
                <div
                  className={cn(
                    "relative w-full overflow-hidden bg-[#0a0a0f] border-t border-white/[0.06]",
                    contentClassName,
                  )}
                >
                  {item.content}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                    style={{
                      background: `linear-gradient(to top, ${accent}18, transparent)`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        ref={containerRef}
        className={cn(
          "relative hidden lg:flex justify-between gap-8 xl:gap-12 overflow-y-auto rounded-2xl px-2",
          containerHeight,
        )}
        style={
          {
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          } as React.CSSProperties
        }
      >
        <div className="relative flex items-start py-10 px-2 flex-1 min-w-0">
          <div className="max-w-sm">
            {content.map((item, index) => (
              <div
                key={item.title + index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="min-h-[55vh] flex flex-col justify-center py-10"
              >
                <motion.div
                  animate={{ opacity: activeCard === index ? 1 : 0.2 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <motion.div
                    animate={{
                      background:
                        activeCard === index
                          ? (item.accent ?? "#22c55e")
                          : "rgba(255,255,255,0.06)",
                      borderColor:
                        activeCard === index
                          ? (item.accent ?? "#22c55e")
                          : "rgba(255,255,255,0.08)",
                    }}
                    transition={{ duration: 0.35 }}
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-[11px] font-bold font-mono text-white shrink-0"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </motion.div>
                  <motion.h2
                    animate={{ opacity: activeCard === index ? 1 : 0.35 }}
                    transition={{ duration: 0.35 }}
                    className="text-xl font-bold text-white"
                  >
                    {item.title}
                  </motion.h2>
                </motion.div>

                <motion.p
                  animate={{ opacity: activeCard === index ? 1 : 0.15 }}
                  transition={{ duration: 0.35 }}
                  className="text-sm leading-relaxed text-white/50 max-w-xs pl-11"
                >
                  {item.description}
                </motion.p>
              </div>
            ))}
            <div className="h-[55vh]" />
          </div>
        </div>

        <div
          className={cn(
            "sticky top-4 flex w-[38%] max-w-[480px] min-w-[280px] h-[calc(100%-2rem)] shrink-0 items-center justify-center self-start rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0a0f]",
            contentClassName,
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              {content[activeCard].content ?? null}
            </motion.div>
          </AnimatePresence>

          <motion.div
            animate={{
              background: `linear-gradient(to top, ${activeAccent}22, transparent)`,
            }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none"
          />
        </div>
      </div>
    </>
  );
};
