import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Clock, Check } from "lucide-react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"
import { ChecklistItem } from "./ChecklistItem"
import type { StepDefinition } from "@/types/brew"

interface MeanwhileTaskProps {
  step: StepDefinition
  completedSteps: Record<string, boolean>
  sessionId: string
  onToggleItem: (key: string) => void
  onComplete: () => void
}

export function MeanwhileTask({
  step,
  completedSteps,
  sessionId,
  onToggleItem,
  onComplete,
}: MeanwhileTaskProps) {
  const c = useThemeColors()

  const allDone = step.parallelTasks?.every((task) => {
    if (task.checklistItems) {
      return task.checklistItems.every(
        (_, i) => completedSteps[`parallel:${step.index}:${task.index}:${i}`]
      )
    }
    return completedSteps[`parallel:${step.index}:${task.index}`]
  })

  return (
    <View
      style={[
        styles.container,
        { borderColor: c.accent + "66" },
      ]}
    >
      <View style={styles.header}>
        <Clock size={16} color={c.accent} />
        <Text style={[styles.headerText, { color: c.accent }]}>
          Enquanto isso
        </Text>
      </View>

      <Text style={[styles.description, { color: c.foreground }]}>
        {step.description}
      </Text>

      {step.parallelTasks?.map((task) => (
        <View key={task.index} style={styles.taskSection}>
          <Text style={[styles.taskTitle, { color: c.foreground }]}>
            {task.title}
          </Text>
          <Text style={[styles.taskDesc, { color: c.mutedForeground }]}>
            {task.description}
          </Text>

          {task.checklistItems?.map((item, i) => (
            <ChecklistItem
              key={i}
              label={item}
              checked={
                !!completedSteps[`parallel:${step.index}:${task.index}:${i}`]
              }
              onToggle={() =>
                onToggleItem(`parallel:${step.index}:${task.index}:${i}`)
              }
            />
          ))}

          {task.type === "action" && !task.checklistItems && (
            <TouchableOpacity
              style={[
                styles.doneBtn,
                {
                  backgroundColor: completedSteps[`parallel:${step.index}:${task.index}`]
                    ? c.success + "1A"
                    : c.secondary,
                },
              ]}
              onPress={() =>
                onToggleItem(`parallel:${step.index}:${task.index}`)
              }
            >
              <Check
                size={16}
                color={
                  completedSteps[`parallel:${step.index}:${task.index}`]
                    ? c.success
                    : c.foreground
                }
              />
              <Text
                style={[
                  styles.doneBtnText,
                  {
                    color: completedSteps[`parallel:${step.index}:${task.index}`]
                      ? c.success
                      : c.foreground,
                  },
                ]}
              >
                Feito
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {allDone && (
        <TouchableOpacity
          style={[styles.completeBtn, { backgroundColor: c.success }]}
          onPress={onComplete}
        >
          <Check size={16} color="#FFFFFF" />
          <Text style={styles.completeBtnText}>Tudo feito</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  headerText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.sm,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  taskSection: {
    marginBottom: spacing.md,
  },
  taskTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.base,
    marginBottom: 4,
  },
  taskDesc: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  doneBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  doneBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.sm,
  },
  completeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  completeBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.base,
    color: "#FFFFFF",
  },
})
