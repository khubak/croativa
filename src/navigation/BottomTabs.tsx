import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from '@/screens/HomeScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'
import Feather from '@expo/vector-icons/Feather'
import AntDesign from '@expo/vector-icons/AntDesign'

const Tab = createBottomTabNavigator()

export const BottomTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0080ff',
        tabBarInactiveTintColor: '#999090',
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
    </Tab.Navigator>
  )
}
