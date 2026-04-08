import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { ArrowRight, CheckCheck } from "lucide-react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"
import { StepCard } from "@/components/brew/StepCard"
import { ChecklistItem } from "@/components/brew/ChecklistItem"
import { ScienceTooltip } from "@/components/brew/ScienceTooltip"
import type { PhaseDefinition, BrewSession } from "@/types/brew"
import { useBrewSessionStore } from "@/stores/brewSessionStore"

interface PreparacaoPhaseProps {
  phase: PhaseDefinition
  session: BrewSession
}

export function PreparacaoPhase({ phase, session }: PreparacaoPhaseProps) {
  const c = useThemeColors()
  const toggleStep = useBrewSessionStore((s) => s.toggleStep)
  const setPhase = useBrewSessionStore((s) => s.setPhase)

  const step = phase.steps[0]
  const items = step.checklistItems || []

  const allChecked = items.every(
    (_, i) => session.completedSteps[`preparacao:0:${i}`]
  )

  function handleMarkAll() {
    for (let i = 0; i < items.length; i++) {
      const key = `preparacao:0:${i}`
      if (!session.completedSteps[key]) {
        toggleStep(session.id, key)
      }
    }
  }

  return (
    <View>
      <StepCard number={1} title={step.title}>
        <Text style={[styles.description, { color: c.mutedForeground }]}>
          {step.description}
        </Text>

        {items.map((item, i) => (
          <ChecklistItem
            key={i}
            label={item}
            checked={!!session.completedSteps[`preparacao:0:${i}`]}
            onToggle={() => toggleStep(session.id, `preparacao:0:${i}`)}
          />
        ))}

        {!allChecked && (
          <TouchableOpacity
            style={[styles.markAllBtn, { backgroundColor: c.secondary }]}
            onPress={handleMarkAll}
          >
            <CheckCheck size={16} color={c.foreground} />
            <Text style={[styles.markAllText, { color: c.foreground }]}>
              Marcar todos
            </Text>
          </TouchableOpacity>
        )}

        {step.scienceNote && <ScienceTooltip note={step.scienceNote} />}
      </StepCard>

      <TouchableOpacity
        style={[
          styles.nextBtn,
          {
            backgroundColor: allChecked ? c.primary : c.muted,
            opacity: allChecked ? 1 : 0.5,
          },
        ]}
        onPress={() => {
          if (allChecked) setPhase(session.id, "mostura")
        }}
        disabled={!allChecked}
      >
        <Text
          style={[
            styles.nextBtnText,
            { color: allChecked ? c.primaryForeground : c.mutedForeground },
          ]}
        >
          Proximo: Mostura
        </Text>
        <ArrowRight
          size={18}
          color={allChecked ? c.primaryForeground : c.mutedForeground}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  description: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  markAllText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.sm,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.base,
    borderRadius: borderRadius.lg,
  },
  nextBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.base,
  },
})
