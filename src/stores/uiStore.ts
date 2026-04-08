import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type Theme = "light" | "dark" | "system"

interface UiStore {
  theme: Theme
  soundEnabled: boolean
  vibrationEnabled: boolean
  setTheme: (theme: Theme) => void
  toggleSound: () => void
  toggleVibration: () => void
  getResolvedTheme: () => "light" | "dark"
}

function applyTheme(theme: Theme) {
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  document.documentElement.classList.toggle("dark", isDark)
}

export const useUiStore = create<UiStore>()(
  persist(
    (set, get) => ({
      theme: "system",
      soundEnabled: true,
      vibrationEnabled: true,

      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleVibration: () => set((s) => ({ vibrationEnabled: !s.vibrationEnabled })),

      getResolvedTheme: () => {
        const { theme } = get()
        if (theme === "system") {
          return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        }
        return theme
      },
    }),
    {
      name: "brasseiro-ui",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
        }
      },
    }
  )
)
