import apiService from './api'

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
  async sendNotification(notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>): Promise<NotificationResponse> {
    try {
      const response = await apiService.post<NotificationResponse>(
        '/drivers/notifications',
        notification
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await apiService.get<{ data: Notification[] }>(
        '/drivers/notifications'
      )
      return response.data || []
    } catch (error) {
      throw error
    }
  }

  async getNotificationsByRoute(routeId: number): Promise<Notification[]> {
    try {
      const response = await apiService.get<{ data: Notification[] }>(
        `/drivers/notifications/route/${routeId}`
      )
      return response.data || []
    } catch (error) {
      throw error
    }
  }

  async markAsRead(notificationId: number): Promise<void> {
    try {
      await apiService.put(`/drivers/notifications/${notificationId}/read`, {})
    } catch (error) {
      throw error
    }
  }
}

export default new NotificationsService()
