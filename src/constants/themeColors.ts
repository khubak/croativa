export type ColorTokens = {
  background: string
  text: string
  textSecondary: string
  textTertiary: string
  cardBackground: string
  border: string
  primary: string
  error: string
  success: string
  warning: string
  icon: string
  highlight: string
  placeholder: string
  overlay: string
  tealAccent: string
}

export type ThemeColors = {
  light: ColorTokens
  dark: ColorTokens
}

export const themeColors: ThemeColors = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    cardBackground: '#E5E7EB',
    border: '#E5E7EB',
    primary: '#0080FF',
    error: '#EF4444',
    success: '#22C55E',
    warning: '#F59E0B',
    icon: '#6B7280',
    highlight: '#E5E7EB',
    placeholder: '#9CA3AF',
    overlay: 'rgba(255, 255, 255, 0.8)',
    tealAccent: '#14B8A6',
  },
  dark: {
    background: '#121212',
    text: '#FFFFFF',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    cardBackground: '#2A2A2A',
    border: '#333333',
    primary: '#0080FF',
    error: '#EF4444',
    success: '#22C55E',
    warning: '#F59E0B',
    icon: '#9CA3AF',
    highlight: '#333333',
    placeholder: '#9CA3AF',
    overlay: 'rgba(0, 0, 0, 0.7)',
    tealAccent: '#0D9488',
  },
}
