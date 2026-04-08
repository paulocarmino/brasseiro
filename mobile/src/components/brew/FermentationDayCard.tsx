import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { Snowflake } from "lucide-react-native"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"
import type { FermentationDay, FermentationType } from "@/types/brew"

interface FermentationDayCardProps {
  day: FermentationDay
  dayNumber: number
  isToday: boolean
  fermentationType: FermentationType
  onUpdate: (updates: Partial<FermentationDay>) => void
}

export function FermentationDayCard({
  day,
  dayNumber,
  isToday,
  fermentationType,
  onUpdate,
}: FermentationDayCardProps) {
  const c = useThemeColors()

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: c.card,
          borderColor: isToday ? c.primary : c.border,
          borderWidth: isToday ? 2 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.dayLabel, { color: c.foreground }]}>
          Dia {dayNumber}
        </Text>
        <Text style={[styles.dateLabel, { color: c.mutedForeground }]}>
          {day.date}
        </Text>
      </View>

      {fermentationType === "cooler" ? (
        <>
          {/* Morning */}
          <View style={styles.tempRow}>
            <Text style={[styles.tempLabel, { color: c.foreground }]}>
              Manha
            </Text>
            <TextInput
              style={[styles.tempInput, { borderColor: c.border, color: c.foreground }]}
              value={day.morningTempC != null ? String(day.morningTempC) : ""}
              onChangeText={(t) =>
                onUpdate({ morningTempC: t ? parseFloat(t) : undefined })
              }
              placeholder="°C"
              placeholderTextColor={c.mutedForeground}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[
                styles.iceBtn,
                {
                  backgroundColor: day.iceSwappedMorning
                    ? "#3B82F5" + "1A"
                    : c.muted,
                },
              ]}
              onPress={() =>
                onUpdate({ iceSwappedMorning: !day.iceSwappedMorning })
              }
            >
              <Snowflake
                size={16}
                color={day.iceSwappedMorning ? "#3B82F5" : c.mutedForeground}
              />
            </TouchableOpacity>
          </View>

          {/* Evening */}
          <View style={styles.tempRow}>
            <Text style={[styles.tempLabel, { color: c.foreground }]}>
              Noite
            </Text>
            <TextInput
              style={[styles.tempInput, { borderColor: c.border, color: c.foreground }]}
              value={day.eveningTempC != null ? String(day.eveningTempC) : ""}
              onChangeText={(t) =>
                onUpdate({ eveningTempC: t ? parseFloat(t) : undefined })
              }
              placeholder="°C"
              placeholderTextColor={c.mutedForeground}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[
                styles.iceBtn,
                {
                  backgroundColor: day.iceSwappedEvening
                    ? "#3B82F5" + "1A"
                    : c.muted,
                },
              ]}
              onPress={() =>
                onUpdate({ iceSwappedEvening: !day.iceSwappedEvening })
              }
            >
              <Snowflake
                size={16}
                color={day.iceSwappedEvening ? "#3B82F5" : c.mutedForeground}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.tempRow}>
          <Text style={[styles.tempLabel, { color: c.foreground }]}>
            Temperatura
          </Text>
          <TextInput
            style={[styles.tempInput, { borderColor: c.border, color: c.foreground }]}
            value={day.morningTempC != null ? String(day.morningTempC) : ""}
            onChangeText={(t) =>
              onUpdate({ morningTempC: t ? parseFloat(t) : undefined })
            }
            placeholder="°C"
            placeholderTextColor={c.mutedForeground}
            keyboardType="numeric"
          />
        </View>
      )}

      {/* Density */}
      <View style={styles.tempRow}>
        <Text style={[styles.tempLabel, { color: c.foreground }]}>
          Densidade
        </Text>
        <TextInput
          style={[styles.tempInput, { borderColor: c.border, color: c.foreground }]}
          value={day.densityReading != null ? String(day.densityReading) : ""}
          onChangeText={(t) =>
            onUpdate({ densityReading: t ? parseFloat(t) : undefined })
          }
          placeholder="1.0XX"
          placeholderTextColor={c.mutedForeground}
          keyboardType="numeric"
        />
      </View>

      {/* Notes */}
      <TextInput
        style={[
          styles.notesInput,
          { borderColor: c.border, color: c.foreground },
        ]}
        value={day.notes}
        onChangeText={(t) => onUpdate({ notes: t })}
        placeholder="Notas do dia..."
        placeholderTextColor={c.mutedForeground}
        multiline
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  dayLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.base,
  },
  dateLabel: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
  },
  tempRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tempLabel: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    width: 80,
  },
  tempInput: {
    fontFamily: fonts.mono,
    fontSize: fontSize.sm,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    width: 70,
    textAlign: "center",
  },
  iceBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  notesInput: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
    minHeight: 40,
  },
})
