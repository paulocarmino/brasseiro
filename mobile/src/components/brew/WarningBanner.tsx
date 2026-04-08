import { View, Text, StyleSheet } from "react-native"
import { AlertTriangle, Flame } from "lucide-react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"

interface WarningBannerProps {
  message: string
  variant?: "warning" | "danger"
}

export function WarningBanner({ message, variant = "warning" }: WarningBannerProps) {
  const c = useThemeColors()

  const bgColor = variant === "danger" ? c.destructive + "1A" : c.warning + "1A"
  const borderColor = variant === "danger" ? c.destructive + "4D" : c.warning + "4D"
  const iconColor = variant === "danger" ? c.destructive : c.warning
  const Icon = variant === "danger" ? Flame : AlertTriangle

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderColor }]}>
      <Icon size={20} color={iconColor} />
      <Text style={[styles.text, { color: c.foreground }]}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  text: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.sm,
    flex: 1,
    lineHeight: 20,
  },
})
