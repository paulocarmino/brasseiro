import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Beer, Clock, BookOpen } from "lucide-react-native"
import { HomeStack } from "./HomeStack"
import { HistoricoStack } from "./HistoricoStack"
import { GlossarioStack } from "./GlossarioStack"
import { useThemeColors } from "@/theme"
import { fonts } from "@/theme/typography"
import type { BottomTabParamList } from "./types"

const Tab = createBottomTabNavigator<BottomTabParamList>()

export function BottomTabNavigator() {
  const c = useThemeColors()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.mutedForeground,
        tabBarStyle: {
          backgroundColor: c.card,
          borderTopColor: c.border,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodySemiBold,
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size }) => <Beer size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="HistoricoTab"
        component={HistoricoStack}
        options={{
          tabBarLabel: "Historico",
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="GlossarioTab"
        component={GlossarioStack}
        options={{
          tabBarLabel: "Glossario",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}
