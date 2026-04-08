import { useState, useEffect, useCallback, useRef } from "react"
import { AppState } from "react-native"
import { useTimerStore } from "@/stores/timerStore"
import { useSound } from "@/hooks/useSound"
import { useNotification } from "@/hooks/useNotification"
import type { TimerAlert } from "@/types/brew"

export function useTimer() {
  const store = useTimerStore()
  const { playAlert, playStir, playComplete } = useSound()
  const { sendNotification } = useNotification()
  const [remainingMs, setRemainingMs] = useState(store.getRemainingMs())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isRunning = store.startedAt !== null && store.pausedAt === null
  const isPaused = store.pausedAt !== null
  const isActive = store.activeTimerId !== null
  const totalMs = store.durationMs
  const progress = totalMs > 0 ? 1 - remainingMs / totalMs : 0
  const isComplete = isActive && remainingMs <= 0

  // Tick every second when running
  useEffect(() => {
    if (!isRunning) {
      const id = setTimeout(() => setRemainingMs(store.getRemainingMs()), 0)
      return () => clearTimeout(id)
    }

    const tick = () => {
      const remaining = store.getRemainingMs()
      setRemainingMs(remaining)
    }

    tick()
    intervalRef.current = setInterval(tick, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, store])

  // Check for unfired alerts
  useEffect(() => {
    if (!isActive) return

    const elapsed = store.getElapsedMs()
    const unfiredAlerts = store.alerts.filter((a) => !a.fired && a.atMs <= elapsed)

    for (const alert of unfiredAlerts) {
      store.markAlertFired(alert.id)

      if (alert.type === "stir") {
        playStir()
        sendNotification("Hora de mexer!", alert.label)
      } else if (alert.type === "hop") {
        playAlert()
        sendNotification("Adicao de lupulo!", alert.label)
      } else if (alert.type === "complete") {
        playComplete()
        sendNotification("Timer finalizado!", alert.label)
      }
    }
  }, [remainingMs, isActive, store, playAlert, playStir, playComplete, sendNotification])

  // Recalculate on app state change (coming back from background)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active" && isRunning) {
        setRemainingMs(store.getRemainingMs())
      }
    })

    return () => subscription.remove()
  }, [isRunning, store])

  const start = useCallback(
    (timerId: string, durationMs: number, alerts: Omit<TimerAlert, "fired">[] = []) => {
      store.startTimer(timerId, durationMs, alerts)
      setRemainingMs(durationMs)
    },
    [store]
  )

  const pause = useCallback(() => {
    store.pauseTimer()
    setRemainingMs(store.getRemainingMs())
  }, [store])

  const resume = useCallback(() => {
    store.resumeTimer()
  }, [store])

  const reset = useCallback(() => {
    store.resetTimer()
    setRemainingMs(0)
  }, [store])

  const pendingAlerts = store.alerts.filter((a) => !a.fired)
  const nextAlert = pendingAlerts.sort((a, b) => a.atMs - b.atMs)[0] ?? null

  return {
    remainingMs,
    totalMs,
    isRunning,
    isPaused,
    isActive,
    isComplete,
    progress,
    alerts: store.alerts,
    pendingAlerts,
    nextAlert,
    activeTimerId: store.activeTimerId,
    start,
    pause,
    resume,
    reset,
  }
}
