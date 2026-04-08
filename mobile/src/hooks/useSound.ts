import { useCallback, useRef } from "react"
import { Audio } from "expo-av"
import * as Haptics from "expo-haptics"
import { useUiStore } from "@/stores/uiStore"

async function playTone(frequency: number, durationMs: number) {
  // expo-av doesn't support oscillators directly, so we use Haptics as primary feedback
  // In a production app, you'd bundle short .wav files for each sound
  // For now, we rely on haptic feedback patterns
}

export function useSound() {
  const soundEnabled = useUiStore((s) => s.soundEnabled)
  const vibrationEnabled = useUiStore((s) => s.vibrationEnabled)
  const lastPlayedRef = useRef(0)

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
    const now = Date.now()
    if (now - lastPlayedRef.current < 500) return
    lastPlayedRef.current = now

    // Three haptic bursts for hop alert
    await vibrate(Haptics.ImpactFeedbackStyle.Heavy)
    setTimeout(() => vibrate(Haptics.ImpactFeedbackStyle.Heavy), 200)
    setTimeout(() => vibrate(Haptics.ImpactFeedbackStyle.Heavy), 400)
  }, [vibrate])

  const playStir = useCallback(async () => {
    // Gentle haptic for stir reminder
    await vibrate(Haptics.ImpactFeedbackStyle.Light)
    setTimeout(() => vibrate(Haptics.ImpactFeedbackStyle.Light), 150)
  }, [vibrate])

  const playComplete = useCallback(async () => {
    // Celebratory pattern
    await vibrate(Haptics.ImpactFeedbackStyle.Heavy)
    setTimeout(() => vibrate(Haptics.ImpactFeedbackStyle.Medium), 200)
    setTimeout(() => vibrate(Haptics.ImpactFeedbackStyle.Heavy), 400)
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
    }, 600)
  }, [vibrate])

  return { playAlert, playStir, playComplete }
}
