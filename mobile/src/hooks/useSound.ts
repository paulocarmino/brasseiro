import { useCallback, useEffect, useRef } from "react"
import * as Haptics from "expo-haptics"
import { useUiStore } from "@/stores/uiStore"

export function useSound() {
  const soundEnabled = useUiStore((s) => s.soundEnabled)
  const vibrationEnabled = useUiStore((s) => s.vibrationEnabled)
  const lastPlayedRef = useRef(0)
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout)
      timeoutRefs.current = []
    }
  }, [])

  function schedule(fn: () => void, delay: number) {
    const id = setTimeout(fn, delay)
    timeoutRefs.current.push(id)
  }

  const vibrate = useCallback(
    async (type: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
      if (vibrationEnabled) {
        try {
          await Haptics.impactAsync(type)
        } catch {
          // Haptics not available (e.g., simulator)
        }
      }
    },
    [vibrationEnabled]
  )

  const playAlert = useCallback(async () => {
    if (!soundEnabled) return
    const now = Date.now()
    if (now - lastPlayedRef.current < 500) return
    lastPlayedRef.current = now

    // Three haptic bursts for hop alert
    await vibrate(Haptics.ImpactFeedbackStyle.Heavy)
    schedule(() => vibrate(Haptics.ImpactFeedbackStyle.Heavy), 200)
    schedule(() => vibrate(Haptics.ImpactFeedbackStyle.Heavy), 400)
  }, [soundEnabled, vibrate])

  const playStir = useCallback(async () => {
    if (!soundEnabled) return
    // Gentle haptic for stir reminder
    await vibrate(Haptics.ImpactFeedbackStyle.Light)
    schedule(() => vibrate(Haptics.ImpactFeedbackStyle.Light), 150)
  }, [soundEnabled, vibrate])

  const playComplete = useCallback(async () => {
    if (!soundEnabled) return
    // Celebratory pattern
    await vibrate(Haptics.ImpactFeedbackStyle.Heavy)
    schedule(() => vibrate(Haptics.ImpactFeedbackStyle.Medium), 200)
    schedule(() => vibrate(Haptics.ImpactFeedbackStyle.Heavy), 400)
    schedule(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
    }, 600)
  }, [soundEnabled, vibrate])

  return { playAlert, playStir, playComplete }
}
