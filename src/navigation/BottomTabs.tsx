import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from '@/screens/HomeScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'
import Feather from '@expo/vector-icons/Feather'
import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { ExploreScreen } from '@/screens/ExploreScreen'
import { useTheme } from '@/contexts/ThemeContext'
import { themeColors } from '@/constants/themeColors'

const Tab = createBottomTabNavigator()

export const BottomTabs: React.FC = () => {
  const { isDark } = useTheme()
  const theme = isDark ? themeColors.dark : themeColors.light

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.cardBackground,
          borderTopColor: theme.border,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name='home' size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <AntDesign name='user' size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name='Explore'
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name='explore' size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}
