export type BrewPhase = "preparacao" | "mostura" | "fervura" | "resfriamento" | "envase"

export type SessionStatus = "active" | "fermenting" | "conditioning" | "completed"

export type EnvaseType = "priming" | "co2"

export type FermentationType = "cooler" | "frigobar"

export interface HopAddition {
  name: string
  grams: number
  minutesBeforeEnd: number // 60 = at start of 60min boil, 0 = flameout
}

export interface FermentationDay {
  date: string // ISO date string (YYYY-MM-DD)
  morningTempC?: number
  eveningTempC?: number
  iceSwappedMorning?: boolean
  iceSwappedEvening?: boolean
  densityReading?: number
  notes: string
}

export interface BrewSession {
  id: string
  name: string
  createdAt: number // timestamp ms
  status: SessionStatus
  envaseType: EnvaseType
  fermentationType: FermentationType
  mashTempC: number
  mashDurationMin: number // 60 default, 30 minimum
  boilDurationMin: number // 60 default
  hops: HopAddition[]
  currentPhase: BrewPhase
  currentStepIndex: number
  completedSteps: Record<string, boolean> // key = "phase:stepIndex"
  ogReading?: number
  fgReading?: number
  fermentationStartedAt?: number // timestamp ms
  fermentationDays: FermentationDay[]
  conditioningStartedAt?: number // timestamp ms
  completedAt?: number // timestamp ms
  notes: string
}

export interface TimerAlert {
  id: string
  label: string
  atMs: number // ms from timer start when this fires
  fired: boolean
  type: "hop" | "stir" | "complete"
}

export interface TimerState {
  activeTimerId: string | null
  startedAt: number | null // wall-clock timestamp
  durationMs: number
  pausedAt: number | null // null = running, timestamp = paused
  pausedElapsed: number // total ms spent paused (accumulated across multiple pauses)
  alerts: TimerAlert[]
}

// --- Phase content types ---

export type StepType = "checklist" | "action" | "timer" | "warning" | "input" | "parallel" | "info"

export interface StepDefinition {
  index: number
  type: StepType
  title: string
  description: string
  warning?: string
  scienceNote?: string
  timerConfig?: {
    durationMin: number
    alerts: Omit<TimerAlert, "fired">[]
  }
  checklistItems?: string[]
  parallelTasks?: StepDefinition[]
  glossaryTerms?: string[]
}

export interface PhaseDefinition {
  id: BrewPhase
  title: string
  icon: string // lucide icon name
  description: string
  steps: StepDefinition[]
}
