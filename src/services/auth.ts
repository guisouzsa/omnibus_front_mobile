import apiService from './api'
import { Driver, LoginRequest, AuthResponse } from '@/types'

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/drivers/login', credentials)
    
    // Armazenar token e dados do motorista
    if (response.token) {
      apiService.setToken(response.token)
      this.setDriver(response.driver)
    }
    
    return response
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/drivers/logout', {})
    } catch (error) {
      // Mesmo com erro, limpar dados localmente
      console.error('Erro ao fazer logout:', error)
    } finally {
      this.clearAuth()
    }
  }

  async getMe(): Promise<Driver> {
    const response = await apiService.get<{ driver: Driver }>('/drivers/me')
    return response.driver
  }

  private setDriver(driver: Driver): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('driver', JSON.stringify(driver))
    }
  }

  getDriver(): Driver | null {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem('driver')
    return data ? JSON.parse(data) : null
  }

  private clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('driver')
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('authToken')
  }
}

export default new AuthService()
