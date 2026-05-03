'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import authService from '@/services/auth'
import { Driver, LoginRequest } from '@/types'

interface AuthContextType {
  driver: Driver | null
  isLoading: boolean
  error: string | null
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados do driver ao montar o componente
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const savedDriver = authService.getDriver()
        setDriver(savedDriver)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authService.login(credentials)
      setDriver(response.driver)
    } catch (err: any) {
      const message = err.message || 'Erro ao fazer login'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await authService.logout()
      setDriver(null)
    } catch (err: any) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    driver,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!driver,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider')
  }
  return context
}
