import { View, Text, StyleSheet } from "react-native"
import {
  ClipboardCheck,
  Thermometer,
  Flame,
  Snowflake,
  Wine,
  Check,
} from "lucide-react-native"
import { useThemeColors, fonts, fontSize, spacing } from "@/theme"
import type { BrewPhase } from "@/types/brew"

const phases: { id: BrewPhase; label: string; Icon: React.ComponentType<{ size: number; color: string }> }[] = [
  { id: "preparacao", label: "Prep", Icon: ClipboardCheck },
  { id: "mostura", label: "Mostura", Icon: Thermometer },
  { id: "fervura", label: "Fervura", Icon: Flame },
  { id: "resfriamento", label: "Ferm.", Icon: Snowflake },
  { id: "envase", label: "Envase", Icon: Wine },
]

const phaseOrder: BrewPhase[] = ["preparacao", "mostura", "fervura", "resfriamento", "envase"]

interface PhaseWizardProps {
  currentPhase: BrewPhase
  completedPhases?: BrewPhase[]
}

export function PhaseWizard({ currentPhase, completedPhases = [] }: PhaseWizardProps) {
  const c = useThemeColors()
  const currentIndex = phaseOrder.indexOf(currentPhase)

  return (
    <View style={styles.container}>
      {phases.map((phase, index) => {
        const isCompleted = completedPhases.includes(phase.id) || index < currentIndex
        const isCurrent = phase.id === currentPhase
        const isFuture = index > currentIndex

        const circleColor = isCompleted
          ? c.success
          : isCurrent
          ? c.primary
          : c.muted
        const iconColor = isCompleted || isCurrent ? "#FFFFFF" : c.mutedForeground
        const labelColor = isCurrent ? c.primary : isCompleted ? c.success : c.mutedForeground

        return (
          <View key={phase.id} style={styles.step}>
            {index > 0 && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor: isCompleted ? c.success : isCurrent ? c.primary + "4D" : c.border,
                  },
                ]}
              />
            )}
            <View
              style={[
                styles.circle,
                {
                  backgroundColor: circleColor,
                  ...(isCurrent && {
                    shadowColor: c.primary,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    elevation: 4,
                  }),
                },
              ]}
            >
              {isCompleted ? (
                <Check size={16} color={iconColor} />
              ) : (
                <phase.Icon size={16} color={iconColor} />
              )}
            </View>
            <Text style={[styles.label, { color: labelColor }]}>{phase.label}</Text>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.base,
  },
  step: {
    alignItems: "center",
    flex: 1,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    position: "absolute",
    top: 18,
    left: -20,
    right: 20,
    height: 2,
    zIndex: -1,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
    marginTop: 4,
    textAlign: "center",
  },
})
