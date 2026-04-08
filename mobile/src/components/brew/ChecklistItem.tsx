import { TouchableOpacity, Text, StyleSheet, View } from "react-native"
import { Check } from "lucide-react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"

interface ChecklistItemProps {
  label: string
  checked: boolean
  onToggle: () => void
}

export function ChecklistItem({ label, checked, onToggle }: ChecklistItemProps) {
  const c = useThemeColors()

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      activeOpacity={0.6}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor: checked ? c.primary : c.border,
            backgroundColor: checked ? c.primary : "transparent",
          },
        ]}
      >
        {checked && <Check size={14} color={c.primaryForeground} />}
      </View>
      <Text
        style={[
          styles.label,
          {
            color: checked ? c.mutedForeground : c.foreground,
            textDecorationLine: checked ? "line-through" : "none",
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    flex: 1,
    lineHeight: 24,
  },
})
