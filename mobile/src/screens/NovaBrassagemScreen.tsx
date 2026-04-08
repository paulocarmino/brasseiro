import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  ArrowLeft,
  Beer,
  Minus,
  Plus,
  FlaskConical,
  Snowflake,
  Thermometer,
  Trash2,
} from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useThemeColors, fonts, fontSize, spacing, borderRadius } from "@/theme"
import { useBrewSessionStore } from "@/stores/brewSessionStore"
import type { RootStackParamList, HomeStackParamList } from "@/navigation/types"
import type { HopAddition, EnvaseType, FermentationType } from "@/types/brew"

type Nav = NativeStackNavigationProp<HomeStackParamList & RootStackParamList>

export function NovaBrassagemScreen() {
  const c = useThemeColors()
  const navigation = useNavigation<Nav>()
  const createSession = useBrewSessionStore((s) => s.createSession)

  const [name, setName] = useState("")
  const [mashTempC, setMashTempC] = useState(66)
  const [mashDurationMin, setMashDurationMin] = useState(60)
  const [boilDurationMin, setBoilDurationMin] = useState(60)
  const [hops, setHops] = useState<HopAddition[]>([
    { name: "", grams: 0, minutesBeforeEnd: 60 },
  ])
  const [envaseType, setEnvaseType] = useState<EnvaseType>("priming")
  const [fermentationType, setFermentationType] = useState<FermentationType>("cooler")

  function handleStart() {
    if (!name.trim()) {
      Alert.alert("Nome obrigatorio", "De um nome pra sua brassagem!")
      return
    }

    const validHops = hops.filter((h) => h.name.trim() && h.grams > 0)

    const id = createSession({
      name: name.trim(),
      mashTempC,
      mashDurationMin,
      boilDurationMin,
      hops: validHops,
      envaseType,
      fermentationType,
    })

    navigation.navigate("Brassagem", { id })
  }

  function addHop() {
    setHops([...hops, { name: "", grams: 0, minutesBeforeEnd: 0 }])
  }

  function removeHop(index: number) {
    setHops(hops.filter((_, i) => i !== index))
  }

  function updateHop(index: number, updates: Partial<HopAddition>) {
    setHops(hops.map((h, i) => (i === index ? { ...h, ...updates } : h)))
  }

  function Stepper({
    value,
    onDecrease,
    onIncrease,
    label,
    suffix,
  }: {
    value: number
    onDecrease: () => void
    onIncrease: () => void
    label: string
    suffix: string
  }) {
    return (
      <View style={styles.stepperRow}>
        <Text style={[styles.label, { color: c.foreground }]}>{label}</Text>
        <View style={styles.stepperControls}>
          <TouchableOpacity
            style={[styles.stepperBtn, { backgroundColor: c.secondary }]}
            onPress={onDecrease}
          >
            <Minus size={18} color={c.foreground} />
          </TouchableOpacity>
          <Text style={[styles.stepperValue, { color: c.foreground }]}>
            {value}
            {suffix}
          </Text>
          <TouchableOpacity
            style={[styles.stepperBtn, { backgroundColor: c.secondary }]}
            onPress={onIncrease}
          >
            <Plus size={18} color={c.foreground} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  function SelectCard({
    selected,
    onPress,
    icon: Icon,
    title,
    subtitle,
  }: {
    selected: boolean
    onPress: () => void
    icon: React.ComponentType<{ size: number; color: string }>
    title: string
    subtitle: string
  }) {
    return (
      <TouchableOpacity
        style={[
          styles.selectCard,
          {
            backgroundColor: selected ? c.primary + "1A" : c.card,
            borderColor: selected ? c.primary : c.border,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Icon size={24} color={selected ? c.primary : c.mutedForeground} />
        <Text
          style={[
            styles.selectTitle,
            { color: selected ? c.primary : c.foreground },
          ]}
        >
          {title}
        </Text>
        <Text style={[styles.selectSubtitle, { color: c.mutedForeground }]}>
          {subtitle}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={c.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: c.foreground }]}>
          Nova Brassagem
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Name */}
        <Text style={[styles.label, { color: c.foreground }]}>Nome da receita</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: c.card,
              borderColor: c.border,
              color: c.foreground,
            },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Blonde Ale do Paulo"
          placeholderTextColor={c.mutedForeground}
        />

        {/* Steppers */}
        <Stepper
          label="Temperatura da mostura"
          value={mashTempC}
          suffix="°C"
          onDecrease={() => setMashTempC(Math.max(62, mashTempC - 1))}
          onIncrease={() => setMashTempC(Math.min(72, mashTempC + 1))}
        />
        <Stepper
          label="Duracao da mostura"
          value={mashDurationMin}
          suffix=" min"
          onDecrease={() => setMashDurationMin(Math.max(30, mashDurationMin - 15))}
          onIncrease={() => setMashDurationMin(Math.min(90, mashDurationMin + 15))}
        />
        <Stepper
          label="Duracao da fervura"
          value={boilDurationMin}
          suffix=" min"
          onDecrease={() => setBoilDurationMin(Math.max(15, boilDurationMin - 15))}
          onIncrease={() => setBoilDurationMin(Math.min(90, boilDurationMin + 15))}
        />

        {/* Hops */}
        <Text style={[styles.sectionTitle, { color: c.foreground }]}>Lupulos</Text>
        <Text style={[styles.helperText, { color: c.mutedForeground }]}>
          Min. = minutos antes do fim da fervura
        </Text>
        {hops.map((hop, index) => (
          <View
            key={index}
            style={[styles.hopRow, { backgroundColor: c.card, borderColor: c.border }]}
          >
            <View style={styles.hopInputs}>
              <TextInput
                style={[styles.hopInput, styles.hopName, { borderColor: c.border, color: c.foreground }]}
                value={hop.name}
                onChangeText={(text) => updateHop(index, { name: text })}
                placeholder="Nome"
                placeholderTextColor={c.mutedForeground}
              />
              <TextInput
                style={[styles.hopInput, styles.hopSmall, { borderColor: c.border, color: c.foreground }]}
                value={hop.grams > 0 ? String(hop.grams) : ""}
                onChangeText={(text) =>
                  updateHop(index, { grams: parseInt(text) || 0 })
                }
                placeholder="g"
                placeholderTextColor={c.mutedForeground}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.hopInput, styles.hopSmall, { borderColor: c.border, color: c.foreground }]}
                value={String(hop.minutesBeforeEnd)}
                onChangeText={(text) =>
                  updateHop(index, {
                    minutesBeforeEnd: Math.min(
                      boilDurationMin,
                      parseInt(text) || 0
                    ),
                  })
                }
                placeholder="min"
                placeholderTextColor={c.mutedForeground}
                keyboardType="numeric"
              />
            </View>
            {hops.length > 1 && (
              <TouchableOpacity onPress={() => removeHop(index)}>
                <Trash2 size={18} color={c.destructive} />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity
          style={[styles.addHopBtn, { borderColor: c.border }]}
          onPress={addHop}
        >
          <Plus size={16} color={c.primary} />
          <Text style={[styles.addHopText, { color: c.primary }]}>
            Adicionar lupulo
          </Text>
        </TouchableOpacity>

        {/* Envase Type */}
        <Text style={[styles.sectionTitle, { color: c.foreground }]}>
          Tipo de envase
        </Text>
        <View style={styles.selectGrid}>
          <SelectCard
            selected={envaseType === "priming"}
            onPress={() => setEnvaseType("priming")}
            icon={FlaskConical}
            title="Priming"
            subtitle="Garrafas PET"
          />
          <SelectCard
            selected={envaseType === "co2"}
            onPress={() => setEnvaseType("co2")}
            icon={Beer}
            title="CO2"
            subtitle="Barril"
          />
        </View>

        {/* Fermentation Type */}
        <Text style={[styles.sectionTitle, { color: c.foreground }]}>
          Controle de fermentacao
        </Text>
        <View style={styles.selectGrid}>
          <SelectCard
            selected={fermentationType === "cooler"}
            onPress={() => setFermentationType("cooler")}
            icon={Snowflake}
            title="Cooler + Gelo"
            subtitle="Troca manual"
          />
          <SelectCard
            selected={fermentationType === "frigobar"}
            onPress={() => setFermentationType("frigobar")}
            icon={Thermometer}
            title="Frigobar"
            subtitle="Temperatura controlada"
          />
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startBtn, { backgroundColor: c.primary }]}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Beer size={20} color={c.primaryForeground} />
          <Text style={[styles.startBtnText, { color: c.primaryForeground }]}>
            Iniciar Brassagem
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.lg,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing["3xl"],
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.base,
    marginBottom: spacing.sm,
    marginTop: spacing.base,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.base,
  },
  stepperControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    fontFamily: fonts.mono,
    fontSize: fontSize.lg,
    minWidth: 70,
    textAlign: "center",
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  helperText: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  hopRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  hopInputs: {
    flexDirection: "row",
    flex: 1,
    gap: spacing.sm,
  },
  hopInput: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  hopName: {
    flex: 1,
  },
  hopSmall: {
    width: 56,
    textAlign: "center",
  },
  addHopBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
  },
  addHopText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.sm,
  },
  selectGrid: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  selectCard: {
    flex: 1,
    alignItems: "center",
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: spacing.xs,
  },
  selectTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.base,
  },
  selectSubtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing["2xl"],
    paddingVertical: spacing.base,
    borderRadius: borderRadius.lg,
  },
  startBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.lg,
  },
})
