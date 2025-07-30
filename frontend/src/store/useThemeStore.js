import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("VartalApp-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("VartalApp-theme", theme);
    set({ theme });
  },
}));