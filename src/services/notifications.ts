import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken')
}

interface Notification {
  id?: number
  type: string
  message: string
  route_id: number
  driver_id?: number
  created_at?: string
  updated_at?: string
}

interface NotificationResponse {
  message: string
  data?: Notification
}

class NotificationsService {
  async sendNotification(
    notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>
  ): Promise<NotificationResponse> {
    try {
      const response = await axios.post<NotificationResponse>(
        `${BASE_URL}/drivers/notifications`,
        notification,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          timeout: 30000,
        }
      )
      return response.data
    } catch (error: any) {
      const status = error?.response?.status
      const msg = error?.response?.data?.message || ''

      if (status >= 500) {
        throw new Error(`Erro no servidor (${status}): ${msg || 'tente novamente.'}`)
      } else if (status === 403) {
        throw new Error('Sem permissão para enviar notificação nesta rota.')
      } else if (status === 422) {
        throw new Error('Dados inválidos. Verifique as informações.')
      } else if (status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.')
      } else if (!error?.response) {
        throw new Error('Sem conexão com o servidor. Verifique sua internet.')
      }
      throw new Error(msg || 'Erro ao enviar notificação.')
    }
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await axios.get<{ data: Notification[] }>(
        `${BASE_URL}/drivers/notifications`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      return response.data?.data || []
    } catch {
      return []
    }
  }

  async getNotificationsByRoute(routeId: number): Promise<Notification[]> {
    try {
      const response = await axios.get<{ data: Notification[] }>(
        `${BASE_URL}/drivers/notifications/route/${routeId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      return response.data?.data || []
    } catch {
      return []
    }
  }

  async markAsRead(notificationId: number): Promise<void> {
    try {
      await axios.put(
        `${BASE_URL}/drivers/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
    } catch {
      // silencioso
    }
  }
}

export default new NotificationsService()
