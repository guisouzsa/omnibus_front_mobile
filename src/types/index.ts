export interface Driver {
  id: number
  name: string
  email: string
  license_number: string
  phone_number: string
  created_at?: string
  updated_at?: string
}

export interface Route {
  id: number
  name: string
  start_point: string
  end_point: string
  start_time: string
  end_time: string
  departure_time?: string
  distance?: number
  stops?: string[]
  driver_id?: number
  vehicle_id?: number
  vehicle?: {
    id: number
    plate: string
  }
  created_at?: string
  updated_at?: string
}

export interface Expense {
  id: number
  driver_id: number
  vehicle_plate: string
  value: number
  proof_of_payment?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface AuthResponse {
  message: string
  driver: Driver
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface MonthlySummary {
  month: string
  year: string
  total: number
}
