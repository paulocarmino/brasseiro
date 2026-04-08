import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { TimerAlert, TimerState } from "@/types/brew"

interface TimerStore extends TimerState {
  startTimer: (timerId: string, durationMs: number, alerts?: Omit<TimerAlert, "fired">[]) => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
  markAlertFired: (alertId: string) => void
  getRemainingMs: () => number
  getElapsedMs: () => number
}

const initialState: TimerState = {
  activeTimerId: null,
  startedAt: null,
  durationMs: 0,
  pausedAt: null,
  pausedElapsed: 0,
  alerts: [],
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startTimer: (timerId, durationMs, alerts = []) => {
        set({
          activeTimerId: timerId,
          startedAt: Date.now(),
          durationMs,
          pausedAt: null,
          pausedElapsed: 0,
          alerts: alerts.map((a) => ({ ...a, fired: false })),
        })
      },

      pauseTimer: () => {
        const { pausedAt } = get()
        if (pausedAt) return
        set({ pausedAt: Date.now() })
      },

      resumeTimer: () => {
        const { pausedAt, pausedElapsed } = get()
        if (!pausedAt) return
        const additionalPause = Date.now() - pausedAt
        set({
          pausedAt: null,
          pausedElapsed: pausedElapsed + additionalPause,
        })
      },

      resetTimer: () => {
        set(initialState)
      },

      markAlertFired: (alertId) => {
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, fired: true } : a)),
        }))
      },

      getElapsedMs: () => {
        const { startedAt, pausedAt, pausedElapsed } = get()
        if (!startedAt) return 0
        const now = pausedAt ?? Date.now()
        return now - startedAt - pausedElapsed
      },

      getRemainingMs: () => {
        const { startedAt, durationMs, pausedAt, pausedElapsed } = get()
        if (!startedAt) return durationMs
        const now = pausedAt ?? Date.now()
        const elapsed = now - startedAt - pausedElapsed
        return Math.max(0, durationMs - elapsed)
      },
    }),
    {
      name: "brasseiro-timer",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
