import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  isDark: false,
  containerRef: { current: null },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem("fb-theme") as Theme | null;
      if (stored === "dark" || stored === "light") return stored;
<<<<<<< HEAD
      return "light";
=======
      return "dark";
>>>>>>> origin/bw-redesign-clean
    } catch {
      return "light";
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);

  /* Apply theme class to the scoped container div, NOT to <html>.
     This keeps Landing/Auth/Contact completely unaffected. */
  const applyTheme = useCallback((t: Theme) => {
    const el = containerRef.current;
    if (!el) return;
    if (t === "dark") { el.classList.add("dark"); } else { el.classList.remove("dark"); }
  }, []);

  /* Re-run whenever theme changes. Also run on first render after
     the ref is populated (AppShell mounts, ref gets set). */
  useEffect(() => {
    applyTheme(theme);
    try { localStorage.setItem("fb-theme", theme); } catch {}
  }, [theme, applyTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === "dark" ? "light" : "dark";
      /* Apply immediately so there's no frame delay */
      const el = containerRef.current;
      if (el) {
        if (next === "dark") { el.classList.add("dark"); } else { el.classList.remove("dark"); }
      }
      try { localStorage.setItem("fb-theme", next); } catch {}
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark", containerRef }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
