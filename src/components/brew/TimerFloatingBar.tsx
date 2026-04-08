import { useEffect, useState } from "react"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTimer } from "@/hooks/useTimer"

interface TimerFloatingBarProps {
  timerElementRef: React.RefObject<HTMLElement | null>
  label?: string
}

function formatTimeCompact(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

const MINI_RADIUS = 9
const MINI_CIRCUMFERENCE = 2 * Math.PI * MINI_RADIUS

export function TimerFloatingBar({ timerElementRef, label }: TimerFloatingBarProps) {
  const { remainingMs, isRunning, isPaused, isActive, progress, pause, resume } = useTimer()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = timerElementRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting)
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [timerElementRef])

  if (!isActive || !isVisible || (!isRunning && !isPaused)) return null

  const offset = MINI_CIRCUMFERENCE * (1 - progress)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-lg items-center gap-3 px-4">
        {/* Mini timer ring */}
        <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0">
          <circle
            cx={12}
            cy={12}
            r={MINI_RADIUS}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={3}
            opacity={0.3}
          />
          <circle
            cx={12}
            cy={12}
            r={MINI_RADIUS}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={MINI_CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform="rotate(-90 12 12)"
          />
        </svg>

        {/* Time */}
        <span className="font-mono font-bold text-sm">{formatTimeCompact(remainingMs)}</span>

        {/* Label */}
        {label && <span className="text-xs text-muted-foreground truncate flex-1">{label}</span>}

        {/* Pause/Resume */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={isRunning ? pause : resume}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
