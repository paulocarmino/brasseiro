import type { NavigatorScreenParams } from "@react-navigation/native"

export type HomeStackParamList = {
  Home: undefined
  NovaBrassagem: undefined
}

export type HistoricoStackParamList = {
  Historico: undefined
}

export type GlossarioStackParamList = {
  Glossario: undefined
}

export type BottomTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>
  HistoricoTab: NavigatorScreenParams<HistoricoStackParamList>
  GlossarioTab: NavigatorScreenParams<GlossarioStackParamList>
}

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>
  Brassagem: { id: string }
}
