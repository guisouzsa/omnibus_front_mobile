import axios, { AxiosInstance, AxiosError } from 'axios'

class ApiService {
  private client: AxiosInstance

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    const timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10)

    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    // Interceptor para adicionar token em todas as requisições
    this.client.interceptors.request.use((config) => {
      const token = this.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expirou ou inválido
          this.clearToken()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('authToken')
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('authToken')
    localStorage.removeItem('driver')
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  }

  async get<T>(endpoint: string, config = {}) {
    try {
      const response = await this.client.get<T>(endpoint, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async post<T>(endpoint: string, data: any, config = {}) {
    try {
      const response = await this.client.post<T>(endpoint, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async put<T>(endpoint: string, data: any, config = {}) {
    try {
      const response = await this.client.put<T>(endpoint, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async delete<T>(endpoint: string, config = {}) {
    try {
      const response = await this.client.delete<T>(endpoint, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private handleError(error: any) {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText
      const err = new Error(message) as any
      err.response = error.response
      return err
    } else if (error.request) {
      return new Error('Erro de conexão com o servidor')
    } else {
    return error
    }
  }
}



export default new ApiService()
