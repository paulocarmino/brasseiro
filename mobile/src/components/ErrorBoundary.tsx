import { Component } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Appearance } from "react-native"
import type { ReactNode } from "react"
import { colors } from "@/theme/colors"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      const scheme = Appearance.getColorScheme()
      const c = scheme === "dark" ? colors.dark : colors.light

      return (
        <View style={[styles.container, { backgroundColor: c.background }]}>
          <Text style={[styles.title, { color: c.foreground }]}>Algo deu errado</Text>
          <Text style={[styles.message, { color: c.mutedForeground }]}>
            {this.state.error?.message ?? "Erro desconhecido"}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: c.primary }]}
            onPress={() => this.setState({ hasError: false, error: null })}
            accessibilityRole="button"
            accessibilityLabel="Tentar novamente"
          >
            <Text style={[styles.buttonText, { color: c.primaryForeground }]}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
  },
})
