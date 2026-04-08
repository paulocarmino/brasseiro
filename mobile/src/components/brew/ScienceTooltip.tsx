import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { FlaskConical, ChevronDown, ChevronUp } from "lucide-react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"

interface ScienceTooltipProps {
  note: string
}

export function ScienceTooltip({ note }: ScienceTooltipProps) {
  const c = useThemeColors()
  const [expanded, setExpanded] = useState(false)

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: c.muted }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <FlaskConical size={16} color={c.accent} />
        <Text style={[styles.headerText, { color: c.accent }]}>
          Por que isso?
        </Text>
        {expanded ? (
          <ChevronUp size={16} color={c.accent} />
        ) : (
          <ChevronDown size={16} color={c.accent} />
        )}
      </View>
      {expanded && (
        <Text style={[styles.note, { color: c.foreground }]}>{note}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.sm,
    flex: 1,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
})
