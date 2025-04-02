import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BottomTabs } from './src/navigation/BottomTabs'
import { ThemeProvider } from './src/contexts/ThemeContext'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'

import './global.css'

export default function App() {
  const colorScheme = useColorScheme()

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
