import { useCallback, useRef } from "react"
import { useUiStore } from "@/stores/uiStore"

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

function playTone(frequency: number, durationMs: number, volume = 0.3) {
  const ctx = getAudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.frequency.value = frequency
  oscillator.type = "sine"
  gainNode.gain.value = volume

  // Fade out to avoid clicks
  gainNode.gain.setValueAtTime(volume, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + durationMs / 1000)
}

export function useSound() {
  const soundEnabled = useUiStore((s) => s.soundEnabled)
  const vibrationEnabled = useUiStore((s) => s.vibrationEnabled)
  const lastPlayedRef = useRef(0)

  const vibrate = useCallback(
    (pattern: number[]) => {
      if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(pattern)
      }
    },
    [vibrationEnabled]
  )

  const playAlert = useCallback(() => {
    // Debounce to avoid double-plays
    const now = Date.now()
    if (now - lastPlayedRef.current < 500) return
    lastPlayedRef.current = now

    if (!soundEnabled) {
      vibrate([200, 100, 200])
      return
    }

    // Three ascending beeps
    playTone(660, 150, 0.3)
    setTimeout(() => playTone(880, 150, 0.3), 200)
    setTimeout(() => playTone(1100, 200, 0.4), 400)

    vibrate([200, 100, 200])
  }, [soundEnabled, vibrate])

  const playStir = useCallback(() => {
    if (!soundEnabled) {
      vibrate([100, 50, 100])
      return
    }

    // Gentle two-note chime
    playTone(440, 200, 0.2)
    setTimeout(() => playTone(550, 300, 0.2), 250)

    vibrate([100, 50, 100])
  }, [soundEnabled, vibrate])

  const playComplete = useCallback(() => {
    if (!soundEnabled) {
      vibrate([200, 100, 200, 100, 400])
      return
    }

    // Celebratory ascending arpeggio
    playTone(440, 200, 0.3)
    setTimeout(() => playTone(550, 200, 0.3), 200)
    setTimeout(() => playTone(660, 200, 0.3), 400)
    setTimeout(() => playTone(880, 400, 0.4), 600)

    vibrate([200, 100, 200, 100, 400])
  }, [soundEnabled, vibrate])

  return { playAlert, playStir, playComplete }
}
