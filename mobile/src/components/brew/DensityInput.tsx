import { View, Text, StyleSheet, TextInput } from "react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"

interface DensityInputProps {
  label: string
  value?: number
  onChange: (value: number | undefined) => void
  helperText?: string
}

export function DensityInput({ label, value, onChange, helperText }: DensityInputProps) {
  const c = useThemeColors()

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: c.foreground }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: c.card, borderColor: c.border, color: c.foreground },
        ]}
        value={value != null ? String(value) : ""}
        onChangeText={(t) => onChange(t ? parseFloat(t) : undefined)}
        placeholder="1.0XX"
        placeholderTextColor={c.mutedForeground}
        keyboardType="numeric"
      />
      {helperText && (
        <Text style={[styles.helper, { color: c.mutedForeground }]}>
          {helperText}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.base,
    marginBottom: spacing.xs,
  },
  input: {
    fontFamily: fonts.mono,
    fontSize: fontSize.lg,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    textAlign: "center",
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
})
