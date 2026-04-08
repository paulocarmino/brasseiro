import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Appearance } from "react-native"

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

export const useUiStore = create<UiStore>()(
  persist(
    (set, get) => ({
      theme: "system",
      soundEnabled: true,
      vibrationEnabled: true,

      setTheme: (theme) => {
        set({ theme })
      },

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleVibration: () => set((s) => ({ vibrationEnabled: !s.vibrationEnabled })),

      getResolvedTheme: () => {
        const { theme } = get()
        if (theme === "system") {
          return Appearance.getColorScheme() === "dark" ? "dark" : "light"
        }
        return theme
      },
    }),
    {
      name: "brasseiro-ui",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
