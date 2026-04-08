import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type {
  BrewSession,
  BrewPhase,
  SessionStatus,
  FermentationDay,
  HopAddition,
  EnvaseType,
  FermentationType,
} from "@/types/brew"

interface BrewSessionStore {
  sessions: BrewSession[]
  activeSessionId: string | null

  createSession: (config: {
    name: string
    mashTempC: number
    mashDurationMin: number
    boilDurationMin: number
    hops: HopAddition[]
    envaseType: EnvaseType
    fermentationType: FermentationType
  }) => string
  getSession: (id: string) => BrewSession | undefined
  getActiveSession: () => BrewSession | undefined
  updateSession: (id: string, updates: Partial<BrewSession>) => void
  setPhase: (id: string, phase: BrewPhase) => void
  advanceStep: (id: string, totalSteps?: number) => void
  completeStep: (id: string, stepKey: string) => void
  toggleStep: (id: string, stepKey: string) => void
  setStatus: (id: string, status: SessionStatus) => void
  addFermentationDay: (id: string, day: FermentationDay) => void
  updateFermentationDay: (id: string, date: string, updates: Partial<FermentationDay>) => void
  deleteSession: (id: string) => void
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export const useBrewSessionStore = create<BrewSessionStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,

      createSession: (config) => {
        const id = generateId()
        const session: BrewSession = {
          id,
          name: config.name,
          createdAt: Date.now(),
          status: "active",
          envaseType: config.envaseType,
          fermentationType: config.fermentationType,
          mashTempC: config.mashTempC,
          mashDurationMin: config.mashDurationMin,
          boilDurationMin: config.boilDurationMin,
          hops: config.hops,
          currentPhase: "preparacao",
          currentStepIndex: 0,
          completedSteps: {},
          fermentationDays: [],
          notes: "",
        }
        set((state) => ({
          sessions: [session, ...state.sessions],
          activeSessionId: id,
        }))
        return id
      },

      getSession: (id) => {
        return get().sessions.find((s) => s.id === id)
      },

      getActiveSession: () => {
        const { sessions, activeSessionId } = get()
        if (!activeSessionId) return undefined
        return sessions.find((s) => s.id === activeSessionId)
      },

      updateSession: (id, updates) => {
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }))
      },

      setPhase: (id, phase) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, currentPhase: phase, currentStepIndex: 0 } : s
          ),
        }))
      },

      advanceStep: (id, totalSteps) => {
        set((state) => ({
          sessions: state.sessions.map((s) => {
            if (s.id !== id) return s
            const next = s.currentStepIndex + 1
            return {
              ...s,
              currentStepIndex:
                totalSteps !== undefined ? Math.min(next, totalSteps - 1) : next,
            }
          }),
        }))
      },

      completeStep: (id, stepKey) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id
              ? {
                  ...s,
                  completedSteps: { ...s.completedSteps, [stepKey]: true },
                }
              : s
          ),
        }))
      },

      toggleStep: (id, stepKey) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id
              ? {
                  ...s,
                  completedSteps: {
                    ...s.completedSteps,
                    [stepKey]: !s.completedSteps[stepKey],
                  },
                }
              : s
          ),
        }))
      },

      setStatus: (id, status) => {
        const updates: Partial<BrewSession> = { status }
        if (status === "fermenting") {
          updates.fermentationStartedAt = Date.now()
        } else if (status === "conditioning") {
          updates.conditioningStartedAt = Date.now()
        } else if (status === "completed") {
          updates.completedAt = Date.now()
        }

        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
          activeSessionId:
            status === "completed" && state.activeSessionId === id ? null : state.activeSessionId,
        }))
      },

      addFermentationDay: (id, day) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, fermentationDays: [...s.fermentationDays, day] } : s
          ),
        }))
      },

      updateFermentationDay: (id, date, updates) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id
              ? {
                  ...s,
                  fermentationDays: s.fermentationDays.map((d) =>
                    d.date === date ? { ...d, ...updates } : d
                  ),
                }
              : s
          ),
        }))
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
        }))
      },
    }),
    {
      name: "brasseiro-sessions",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
