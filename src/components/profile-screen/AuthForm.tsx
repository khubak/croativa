import axios from 'axios'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { login, register } from '@/services/authService'
import { LoginData, RegisterData } from '@/dto/auth'

interface AuthFormProps {
  onAuthSuccess: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const validateEmail = (email: string): boolean => {
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
    const isValid = password.length >= 8

    if (!isValid) {
      setPasswordError('Password must be at least 8 characters long')
    } else {
      setPasswordError(null)
    }

    return isValid
  }

  const toggleForm = () => {
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
      onAuthSuccess()
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
    <View className='flex-1 items-center justify-center p-6'>
      <StatusBar style='auto' />
      <Text className='mb-8 text-3xl font-bold'>{isLogin ? 'Login' : 'Register'}</Text>
      {error && <Text className='mb-4 text-center text-red-500'>{error}</Text>}
      {!isLogin && (
        <>
          <TextInput
            className='mb-4 w-full rounded-md bg-gray-100 px-4 py-2'
            placeholder='First Name'
            value={firstName}
            onChangeText={setFirstName}
            autoCorrect={false}
            autoComplete='given-name'
            autoCapitalize='words'
          />
          <TextInput
            className='mb-4 w-full rounded-md bg-gray-100 px-4 py-2'
            placeholder='Last Name'
            value={lastName}
            onChangeText={setLastName}
            autoCorrect={false}
            autoComplete='family-name'
            autoCapitalize='words'
          />
        </>
      )}
      <TextInput
        className={`mb-4 w-full rounded-md bg-gray-100 px-4 py-2 ${emailError ? 'border border-red-500' : ''}`}
        placeholder='Email'
        value={email}
        onChangeText={(text) => {
          setEmail(text)
          if (emailError) validateEmail(text)
        }}
        onBlur={() => validateEmail(email)}
        autoCapitalize='none'
        autoCorrect={false}
        autoComplete='email'
        keyboardType='email-address'
      />
      {emailError && <Text className='mb-2 self-start text-sm text-red-500'>{emailError}</Text>}
      <TextInput
        className={`mb-4 w-full rounded-md bg-gray-100 px-4 py-2 ${passwordError ? 'border border-red-500' : ''}`}
        placeholder='Password'
        value={password}
        onChangeText={(text) => {
          setPassword(text)
          if (passwordError) validatePassword(text)
        }}
        onBlur={() => validatePassword(password)}
        autoCapitalize='none'
        autoCorrect={false}
        autoComplete='password'
        secureTextEntry
      />
      {passwordError && <Text className='mb-2 self-start text-sm text-red-500'>{passwordError}</Text>}
      <TouchableOpacity
        className='mb-4 w-full items-center rounded-md bg-blue-500 py-3'
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color='#ffffff' />
        ) : (
          <Text className='font-semibold text-white'>{isLogin ? 'Login' : 'Register'}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleForm}>
        <Text className='text-blue-500'>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
