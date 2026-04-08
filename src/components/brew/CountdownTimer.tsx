import { useRef, useEffect } from "react"
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTimer } from "@/hooks/useTimer"
import { useTimerStore } from "@/stores/timerStore"
import type { TimerAlert } from "@/types/brew"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  timerId: string
  durationMin: number
  alerts?: Omit<TimerAlert, "fired">[]
  label?: string
  onComplete?: () => void
}

const RADIUS = 85
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const CENTER = 100
const VIEWBOX = 200

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

function getTimerColor(progress: number): string {
  if (progress < 0.7) return "hsl(var(--primary))"
  if (progress < 0.9) return "hsl(var(--ring))"
  return "hsl(var(--destructive))"
}

function getMarkerPosition(atMs: number, totalMs: number): { x: number; y: number } {
  const angle = (atMs / totalMs) * 2 * Math.PI - Math.PI / 2
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  }
}

export function CountdownTimer({
  timerId,
  durationMin,
  alerts = [],
  label,
  onComplete,
}: CountdownTimerProps) {
  const {
    remainingMs,
    isRunning,
    isPaused,
    isActive,
    isComplete,
    progress,
    activeTimerId,
    alerts: storeAlerts,
    nextAlert,
    start,
    pause,
    resume,
    reset,
  } = useTimer()

  const timerStore = useTimerStore()
  const timerRef = useRef<HTMLDivElement>(null)
  const hasCalledComplete = useRef(false)
  const durationMs = durationMin * 60 * 1000

  const isThisTimer = activeTimerId === timerId

  useEffect(() => {
    if (isThisTimer && isComplete && !hasCalledComplete.current) {
      hasCalledComplete.current = true
      onComplete?.()
    }
  }, [isThisTimer, isComplete, onComplete])

  function handleStartPause() {
    if (!isActive || !isThisTimer) {
      hasCalledComplete.current = false
      start(timerId, durationMs, alerts)
    } else if (isRunning) {
      pause()
    } else if (isPaused) {
      resume()
    }
  }

  function handleReset() {
    hasCalledComplete.current = false
    reset()
  }

  const strokeDashoffset = isThisTimer ? CIRCUMFERENCE * (1 - progress) : CIRCUMFERENCE

  const displayAlerts = isThisTimer ? storeAlerts : alerts.map((a) => ({ ...a, fired: false }))
  const timerColor = getTimerColor(progress)
  const isUrgent = isThisTimer && remainingMs < 60000 && remainingMs > 0

  // Next alert countdown
  let nextAlertText: string | null = null
  if (isThisTimer && nextAlert && isRunning) {
    const elapsed = durationMs - remainingMs
    const msUntilNext = nextAlert.atMs - elapsed
    if (msUntilNext > 0) {
      nextAlertText = `${nextAlert.label} em ${formatTime(msUntilNext)}`
    }
  }

  return (
    <div ref={timerRef} className="flex flex-col items-center gap-4">
      <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} className="w-64 h-64 max-w-full">
        {/* Track (background) */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={10}
          opacity={0.4}
        />

        {/* Progress arc */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={timerColor}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
          className="transition-[stroke-dashoffset] duration-1000 linear"
        />

        {/* Glow ring when urgent */}
        {isUrgent && (
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="hsl(var(--destructive))"
            strokeWidth={16}
            opacity={0.15}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            className="animate-pulse"
          />
        )}

        {/* Alert markers around the ring */}
        {displayAlerts.map((alert) => {
          const pos = getMarkerPosition(alert.atMs, durationMs)
          const isFired = alert.fired
          return (
            <g key={alert.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isFired ? 4 : 5}
                fill={
                  isFired
                    ? "hsl(var(--muted-foreground))"
                    : alert.type === "hop"
                      ? "hsl(var(--primary))"
                      : "hsl(var(--ring))"
                }
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
              {!isFired && alert.type === "hop" && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={8}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth={1}
                  opacity={0.4}
                  className="animate-pulse"
                />
              )}
            </g>
          )
        })}

        {/* Center time display */}
        <text
          x={CENTER}
          y={CENTER - 4}
          textAnchor="middle"
          dominantBaseline="central"
          className={cn("font-mono font-bold fill-foreground", isUrgent && "fill-destructive")}
          style={{ fontSize: isThisTimer && isComplete ? 28 : 40 }}
        >
          {isThisTimer
            ? isComplete
              ? "Pronto!"
              : formatTime(remainingMs)
            : formatTime(durationMs)}
        </text>

        {/* Label */}
        {label && (
          <text
            x={CENTER}
            y={CENTER + 24}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground"
            style={{ fontSize: 12 }}
          >
            {label}
          </text>
        )}
      </svg>

      {/* Next alert preview */}
      {nextAlertText && (
        <p className="text-sm text-muted-foreground text-center animate-pulse">{nextAlertText}</p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleStartPause}
          size="lg"
          className="h-14 w-14 rounded-full p-0"
          variant={isRunning ? "secondary" : "default"}
          disabled={isThisTimer && isComplete}
        >
          {isRunning && isThisTimer ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>

        {isThisTimer && (isComplete || isPaused) && (
          <Button
            onClick={handleReset}
            size="lg"
            variant="ghost"
            className="h-14 w-14 rounded-full p-0"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        )}

        {isThisTimer && !isComplete && (isRunning || isPaused) && (
          <Button
            onClick={() => {
              // Mark all alerts as fired
              for (const a of timerStore.alerts) {
                if (!a.fired) timerStore.markAlertFired(a.id)
              }
              reset()
              hasCalledComplete.current = true
              onComplete?.()
            }}
            size="sm"
            variant="ghost"
            className="text-muted-foreground text-xs gap-1"
          >
            <SkipForward className="h-3.5 w-3.5" />
            Pular timer
          </Button>
        )}
      </div>
    </div>
  )
}

// Expose the ref for IntersectionObserver
CountdownTimer.displayName = "CountdownTimer"
