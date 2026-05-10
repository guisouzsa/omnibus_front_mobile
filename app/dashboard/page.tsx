'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { routesService, expensesService } from '@/services/routes'
import { maskPlate, unmaskPlate, maskCurrency, unmaskCurrency } from '@/utils/mask'
import { Route } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const { driver, logout, isAuthenticated, isLoading: authLoading } = useAuth()
  const [rotas, setRotas] = useState<Route[]>([])
  const [load
