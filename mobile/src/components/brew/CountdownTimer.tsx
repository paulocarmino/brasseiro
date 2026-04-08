import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Svg, { Circle } from "react-native-svg"
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"

interface CountdownTimerProps {
  remainingMs: number
  totalMs: number
  progress: number
  isRunning: boolean
  isPaused: boolean
  isComplete: boolean
  label: string
  nextAlertLabel?: string | null
  nextAlertMs?: number | null
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
  onSkip: () => void
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export function CountdownTimer({
  remainingMs,
  totalMs,
  progress,
  isRunning,
  isPaused,
  isComplete,
  label,
  nextAlertLabel,
  nextAlertMs,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}: CountdownTimerProps) {
  const c = useThemeColors()

  const size = 220
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  // Color transitions as timer progresses
  const strokeColor = progress > 0.9 ? c.destructive : progress > 0.7 ? c.warning : c.primary
  const isActive = isRunning || isPaused

  return (
    <View style={styles.container}>
      {/* Timer Circle */}
      <View style={styles.timerContainer}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={c.border}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={styles.timerCenter}>
          <Text style={[styles.timeText, { color: c.foreground }]}>
            {formatTime(remainingMs)}
          </Text>
          <Text style={[styles.labelText, { color: c.mutedForeground }]}>
            {label}
          </Text>
        </View>
      </View>

      {/* Next alert preview */}
      {nextAlertLabel && nextAlertMs != null && (
        <Text style={[styles.nextAlert, { color: c.mutedForeground }]}>
          Proximo: {nextAlertLabel} (em {formatTime(nextAlertMs)})
        </Text>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        {!isActive && !isComplete && (
          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: c.primary }]}
            onPress={onStart}
          >
            <Play size={24} color={c.primaryForeground} />
            <Text style={[styles.playBtnText, { color: c.primaryForeground }]}>
              Iniciar
            </Text>
          </TouchableOpacity>
        )}

        {isRunning && (
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: c.secondary }]}
            onPress={onPause}
          >
            <Pause size={20} color={c.foreground} />
          </TouchableOpacity>
        )}

        {isPaused && (
          <>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: c.secondary }]}
              onPress={onReset}
            >
              <RotateCcw size={20} color={c.foreground} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.playBtn, { backgroundColor: c.primary }]}
              onPress={onResume}
            >
              <Play size={24} color={c.primaryForeground} />
              <Text style={[styles.playBtnText, { color: c.primaryForeground }]}>
                Retomar
              </Text>
            </TouchableOpacity>
          </>
        )}

        {isActive && !isComplete && (
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: c.muted }]}
            onPress={onSkip}
          >
            <SkipForward size={20} color={c.mutedForeground} />
          </TouchableOpacity>
        )}

        {isComplete && (
          <View style={[styles.completeBadge, { backgroundColor: c.success + "1A" }]}>
            <Text style={[styles.completeText, { color: c.success }]}>
              Finalizado!
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing.base,
  },
  timerContainer: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    position: "absolute",
  },
  timerCenter: {
    alignItems: "center",
  },
  timeText: {
    fontFamily: fonts.mono,
    fontSize: fontSize["4xl"],
  },
  labelText: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    marginTop: 4,
  },
  nextAlert: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    marginTop: spacing.md,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  playBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.base,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  completeBadge: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  completeText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.lg,
  },
})
