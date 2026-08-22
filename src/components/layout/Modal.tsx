import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "lg" | "xl" | "full";
}

export default function Modal({ open, onClose, children, size = "xl" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  const maxW = { lg: "max-w-2xl", xl: "max-w-5xl", full: "max-w-full mx-2" }[size];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-full flex items-start justify-center p-3 sm:p-6 pt-6 sm:pt-10">
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full ${maxW} bg-background rounded-2xl shadow-2xl ring-1 ring-border overflow-hidden`}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors shadow-sm"
              >
                <X size={14} className="text-muted-foreground" />
              </button>
              <div className="max-h-[88vh] overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
