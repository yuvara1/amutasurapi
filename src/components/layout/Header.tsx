import { motion } from "framer-motion";
import { Bell, Search, ChevronRight, Command, Menu, Sun, Moon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router";

interface HeaderProps {
  title: string;
  breadcrumb?: string[];
  onNavigate?: (page: string) => void;
  notifCount?: number;
  onSearch?: () => void;
  onMenuToggle?: () => void;
}

export default function Header({ title, breadcrumb = [], notifCount = 0, onSearch, onMenuToggle, onNavigate }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="h-14 shrink-0 flex items-center px-4 sm:px-6 gap-3 bg-card border-b border-border"
    >
      {/* Mobile hamburger */}
      <motion.div whileTap={{ scale: 0.92 }} className="md:hidden shrink-0">
        <Button variant="ghost" size="icon" onClick={onMenuToggle} className="w-8 h-8 text-muted-foreground">
          <Menu size={14} />
        </Button>
      </motion.div>

      {/* Back button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} className="shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="w-8 h-8 text-muted-foreground"
          aria-label="Go back"
        >
          <ArrowLeft size={14} />
        </Button>
      </motion.div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
        {breadcrumb.map((crumb, i) => (
          <motion.span key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }} className="flex items-center gap-1 min-w-0 shrink-0">
            {i > 0 && <ChevronRight size={11} className="text-border shrink-0" />}
            <span
              style={{ fontFamily: "var(--font-display)", fontSize: "13px" }}
              className={[
                i === breadcrumb.length - 1 ? "font-semibold text-foreground" : "font-normal text-muted-foreground",
                i < breadcrumb.length - 1 && i > 0 ? "hidden sm:inline" : "",
              ].join(" ")}
            >
              {crumb}
            </span>
          </motion.span>
        ))}
        {breadcrumb.length === 0 && (
          <span style={{ fontFamily: "var(--font-display)", fontSize: "13px" }} className="font-semibold text-foreground">
            {title}
          </span>
        )}
      </div>

      {/* Search — desktop */}
      <motion.div whileHover={{ borderColor: "var(--border)" }} whileTap={{ scale: 0.98 }} className="hidden lg:block shrink-0">
        <Button variant="ghost" onClick={onSearch}
          className="flex items-center gap-2 px-3 py-1.5 h-auto text-muted-foreground bg-muted border border-border hover:bg-muted/80"
          style={{ minWidth: 170, fontFamily: "var(--font-display)", fontSize: "12px" }}>
          <Search size={12} />
          <span>Search…</span>
          <span className="ml-auto flex items-center gap-0.5 rounded px-1 py-0.5 bg-card border border-border text-muted-foreground" style={{ fontSize: "10px" }}>
            <Command size={8} />K
          </span>
        </Button>
      </motion.div>

      {/* Search icon — tablet */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} className="hidden sm:block lg:hidden shrink-0">
        <Button variant="ghost" size="icon" onClick={onSearch} className="w-8 h-8 text-muted-foreground">
          <Search size={14} />
        </Button>
      </motion.div>

      {/* Theme toggle */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} className="shrink-0">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="w-8 h-8 text-muted-foreground"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 30, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </motion.div>
        </Button>
      </motion.div>

      {/* Notification bell */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} className="relative shrink-0">
        <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground"
          onClick={() => onNavigate?.("notifications")}>
          <Bell size={14} />
        </Button>
        {notifCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center bg-foreground text-background pointer-events-none"
            style={{ fontSize: "8px", fontWeight: 700, fontFamily: "var(--font-display)" }}
          >
            {notifCount}
          </motion.span>
        )}
      </motion.div>
    </motion.header>
  );
}
