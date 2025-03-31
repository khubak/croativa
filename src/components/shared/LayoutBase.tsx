import React, { ReactNode } from 'react'
import { SafeAreaView, ViewProps } from 'react-native'
import { StatusBar, StatusBarStyle } from 'expo-status-bar'
import { cn } from '@/lib/utils'

interface Props extends ViewProps {
  children: ReactNode
  statusBarStyle?: StatusBarStyle
  withStatusBar?: boolean
}

export const LayoutBase: React.FC<Props> = ({ children, statusBarStyle = 'dark', withStatusBar, className }) => {
  return (
    <>
      {withStatusBar && <StatusBar style={statusBarStyle} />}
      <SafeAreaView className={cn('flex-1 px-4', withStatusBar && 'mt-10', className)}>{children}</SafeAreaView>
    </>
  )
}
