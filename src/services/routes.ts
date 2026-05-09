import apiService from './api'
import { Route, Expense, MonthlySummary } from '@/types'

class RoutesService {
  async getRoutes(): Promise<Route[]> {
    const response = await apiService.get<{ data: Route[] }>('/drivers/routes')
    return response.data || []
  }

  async getRoute(id: number): Promise<Route> {
    const response = await apiService.get<{ data: Route }>(`/drivers/routes/${id}`)
    return response.data
  }
}

class ExpensesService {
  async getExpenses(): Promise<Expense[]> {
    const response = await apiService.get<{ data: Expense[] }>('/drivers/expenses')
    return response.data || []
  }

  async createExpense(data: {
    vehicle_plate: string
    value: number
    proof_of_payment?: string
    description?: string
  }): Promise<Expense> {
    const response = await apiService.post<{ data: Expense }>('/drivers/expenses', data)
    return response.data
  }

  async getExpense(id: number): Promise<Expense> {
    const response = await apiService.get<{ data: Expense }>(`/drivers/expenses/${id}`)
    return response.data
  }

  async getMonthlySummary(): Promise<MonthlySummary> {
    const response = await apiService.get<MonthlySummary>('/drivers/expenses-monthly-total')
    return response
  }
}

export const routesService = new RoutesService()
export const expensesService = new ExpensesService()
