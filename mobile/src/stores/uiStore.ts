import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Theme = "light" | "dark" | "system"

interface UiStore {
  theme: Theme
  soundEnabled: boolean
  vibrationEnabled: boolean
  setTheme: (theme: Theme) => void
  toggleSound: () => void
  toggleVibration: () => void
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      theme: "system",
      soundEnabled: true,
      vibrationEnabled: true,

      setTheme: (theme) => {
        set({ theme })
      },

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleVibration: () => set((s) => ({ vibrationEnabled: !s.vibrationEnabled })),
    }),
    {
      name: "brasseiro-ui",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
