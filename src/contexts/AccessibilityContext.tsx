import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

type Ctx = {
  fontScale: number;
  setFontScale: (n: number) => void;
  increaseFont: () => void;
  decreaseFont: () => void;
  resetFont: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
};

const AccessibilityContext = createContext<Ctx | undefined>(undefined);

const MIN = 0.85, MAX = 1.3, STEP = 0.1;

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScaleState] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const v = parseFloat(localStorage.getItem("a11y.fontScale") || "1");
    return isNaN(v) ? 1 : v;
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("a11y.highContrast") === "1";
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${18 * fontScale}px`;
    localStorage.setItem("a11y.fontScale", String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
    localStorage.setItem("a11y.highContrast", highContrast ? "1" : "0");
  }, [highContrast]);

  const setFontScale = useCallback((n: number) => setFontScaleState(Math.min(MAX, Math.max(MIN, n))), []);
  const increaseFont = useCallback(() => setFontScaleState(s => Math.min(MAX, +(s + STEP).toFixed(2))), []);
  const decreaseFont = useCallback(() => setFontScaleState(s => Math.max(MIN, +(s - STEP).toFixed(2))), []);
  const resetFont = useCallback(() => setFontScaleState(1), []);
  const toggleHighContrast = useCallback(() => setHighContrast(v => !v), []);

  return (
    <AccessibilityContext.Provider value={{ fontScale, setFontScale, increaseFont, decreaseFont, resetFont, highContrast, toggleHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useA11y = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useA11y must be used within AccessibilityProvider");
  return ctx;
};
