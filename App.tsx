import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BottomTabs } from './src/navigation/BottomTabs'

import './global.css'

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BottomTabs />
        <StatusBar style='auto' />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
