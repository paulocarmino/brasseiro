import { View, Text, StyleSheet } from "react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"

interface StepCardProps {
  number: number
  title: string
  children: React.ReactNode
}

export function StepCard({ number, title, children }: StepCardProps) {
  const c = useThemeColors()

  return (
    <View style={[styles.container, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: c.primary }]}>
          <Text style={[styles.badgeText, { color: c.primaryForeground }]}>
            {number}
          </Text>
        </View>
        <Text style={[styles.title, { color: c.foreground }]}>{title}</Text>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize.lg,
    flex: 1,
  },
  content: {},
})
