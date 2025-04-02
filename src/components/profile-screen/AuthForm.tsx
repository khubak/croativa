import axios from 'axios'
import { StatusBar } from 'expo-status-bar'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native'
import { useState, useRef } from 'react'
import { login, register } from '@/services/authService'
import { LoginData, RegisterData } from '@/dto/auth'
import { useTheme } from '@/contexts/ThemeContext'
import { themeColors } from '@/constants/themeColors'

interface AuthFormProps {
  handleAuth: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({ handleAuth }) => {
  const { isDark } = useTheme()
  const theme = isDark ? themeColors.dark : themeColors.light
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const emailInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const firstNameInputRef = useRef<TextInput>(null)
  const lastNameInputRef = useRef<TextInput>(null)

  const isFormEmpty = () => {
    if (isLogin) {
      return !email && !password
    } else {
      return !email && !password && !firstName && !lastName
    }
  }

  const validateEmail = (email: string): boolean => {
    if (isFormEmpty()) {
      setEmailError(null)
      return true
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)

    if (!isValid) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError(null)
    }

    return isValid
  }

  const validatePassword = (password: string): boolean => {
    if (isLogin) {
      setPasswordError(null)
      return true
    }

    if (isFormEmpty()) {
      setPasswordError(null)
      return true
    }

    const isValid = password.length >= 8

    if (!isValid) {
      setPasswordError('Password must be at least 8 characters long')
    } else {
      setPasswordError(null)
    }

    return isValid
  }

  const toggleForm = () => {
    Keyboard.dismiss()
    emailInputRef.current?.blur()
    passwordInputRef.current?.blur()
    firstNameInputRef.current?.blur()
    lastNameInputRef.current?.blur()

    setIsLogin(!isLogin)
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setError(null)
    setEmailError(null)
    setPasswordError(null)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    if (isFormEmpty()) {
      setLoading(false)
      return
    }

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        const loginData: LoginData = { email, password }
        await login(loginData)
      } else {
        const registerData: RegisterData = { email, password, firstName, lastName }
        await register(registerData)
      }
      handleAuth()
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='flex-1 p-6' style={{ backgroundColor: theme.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className='items-center justify-center flex-1'>
        <Text className='mb-8 text-3xl font-bold' style={{ color: theme.text }}>
          {isLogin ? 'Login' : 'Register'}
        </Text>
        {error && (
          <Text className='mb-4 text-center' style={{ color: theme.error }}>
            {error}
          </Text>
        )}
        {!isLogin && (
          <>
            <TextInput
              ref={firstNameInputRef}
              className='w-full px-4 py-2 mb-4 rounded-md'
              style={{
                backgroundColor: isDark ? theme.cardBackground : theme.highlight,
                color: theme.text,
              }}
              placeholder='First Name'
              placeholderTextColor={theme.placeholder}
              value={firstName}
              onChangeText={setFirstName}
              autoCorrect={false}
              autoComplete='given-name'
              autoCapitalize='words'
            />
            <TextInput
              ref={lastNameInputRef}
              className='w-full px-4 py-2 mb-4 rounded-md'
              style={{
                backgroundColor: isDark ? theme.cardBackground : theme.highlight,
                color: theme.text,
              }}
              placeholder='Last Name'
              placeholderTextColor={theme.placeholder}
              value={lastName}
              onChangeText={setLastName}
              autoCorrect={false}
              autoComplete='family-name'
              autoCapitalize='words'
            />
          </>
        )}
        <TextInput
          ref={emailInputRef}
          className='w-full px-4 py-2 mb-4 rounded-md'
          style={{
            backgroundColor: isDark ? theme.cardBackground : theme.highlight,
            color: theme.text,
            borderWidth: emailError ? 1 : 0,
            borderColor: emailError ? theme.error : 'transparent',
          }}
          placeholder='Email'
          placeholderTextColor={theme.placeholder}
          value={email}
          onChangeText={(text) => {
            setEmail(text)
            if (emailError && !isFormEmpty()) {
              validateEmail(text)
            }
          }}
          onBlur={() => {
            if (!isFormEmpty()) {
              validateEmail(email)
            }
          }}
          autoCapitalize='none'
          autoCorrect={false}
          autoComplete='email'
          keyboardType='email-address'
        />
        {emailError && (
          <Text className='self-start mb-2 text-sm' style={{ color: theme.error }}>
            {emailError}
          </Text>
        )}
        <TextInput
          ref={passwordInputRef}
          className='w-full px-4 py-2 mb-4 rounded-md'
          style={{
            backgroundColor: isDark ? theme.cardBackground : theme.highlight,
            color: theme.text,
            borderWidth: passwordError ? 1 : 0,
            borderColor: passwordError ? theme.error : 'transparent',
          }}
          placeholder='Password'
          placeholderTextColor={theme.placeholder}
          value={password}
          onChangeText={(text) => {
            setPassword(text)
            if (passwordError && !isFormEmpty()) {
              validatePassword(text)
            }
          }}
          onBlur={() => {
            if (!isFormEmpty()) {
              validatePassword(password)
            }
          }}
          autoCapitalize='none'
          autoCorrect={false}
          autoComplete='password'
          secureTextEntry
        />
        {passwordError && (
          <Text className='self-start mb-2 text-sm' style={{ color: theme.error }}>
            {passwordError}
          </Text>
        )}
        <TouchableOpacity
          className='items-center w-full py-3 mb-4 rounded-md'
          style={{ backgroundColor: theme.primary }}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={theme.text} />
          ) : (
            <Text className='font-semibold' style={{ color: theme.text }}>
              {isLogin ? 'Login' : 'Register'}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleForm}>
          <Text style={{ color: theme.primary }}>
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
