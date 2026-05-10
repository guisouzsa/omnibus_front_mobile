'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { routesService, expensesService } from '@/services/routes'
import { maskPlate, unmaskPlate, maskCurrency, unmaskCurrency } from '@/utils/mask'
import { Route } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const { driver, logout, isAuthenticated } = useAuth()
  const [rotas, setRotas] = useState<Route[]>([])
  const [loadingRoutes, setLoadingRoutes] = useState(true)
  const [errorRoutes, setErrorRoutes] = useState<string | null>(null)
  const [currentRotaIndex, setCurrentRotaIndex] = useState(0)

  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [vehicle_plate, setVehicle_plate] = useState('')
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null)
  const [expenseError, setExpenseError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && driver) {
      fetchRoutes()
    }
  }, [isAuthenticated, driver])

  const fetchRoutes = async () => {
    try {
      setLoadingRoutes(true)
      setErrorRoutes(null)
      const data = await routesService.getRoutes()
      setRotas(Array.isArray(data) ? data : [])
    } catch (error: any) {
      setErrorRoutes('Erro ao carregar rotas')
      console.error('Erro ao buscar rotas:', error)
    } finally {
      setLoadingRoutes(false)
    }
  }

  const handleEnviarDespesa = async (e: React.FormEvent) => {
    e.preventDefault()
    setExpenseError(null)

    if (!vehicle_plate || !value) {
      setExpenseError('Preencha todos os campos obrigatórios')
      return
    }

    if (!proofOfPayment) {
      setExpenseError('Selecione um comprovante de pagamento')
      return
    }

    if (proofOfPayment.size > 3 * 1024 * 1024) {
      setExpenseError('📸 Arquivo muito grande! Use uma imagem menor que 3MB.')
      return
    }

    if (!proofOfPayment.type.startsWith('image/')) {
      setExpenseError('⚠️ Envie apenas imagens (JPG, PNG, WEBP).')
      return
    }

    try {
      setEnviando(true)

      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'))
        reader.readAsDataURL(proofOfPayment)
      })

      if (base64String.length > 4 * 1024 * 1024) {
        setExpenseError('📸 Imagem ainda muito grande após conversão. Use uma imagem menor.')
        setEnviando(false)
        return
      }

      const plateUnmasked = unmaskPlate(vehicle_plate)
      const valueUnmasked = unmaskCurrency(value)

      await expensesService.createExpense({
        vehicle_plate: plateUnmasked,
        value: valueUnmasked,
        description,
        proof_of_payment: base64String,
      })

      setEnviado(true)
      setVehicle_plate('')
      setValue('')
      setDescription('')
      setProofOfPayment(null)
      setTimeout(() => setEnviado(false), 2000)

    } catch (error: any) {
      const status = error?.response?.status
      const msg = error?.response?.data?.message || error?.message || ''

      if (msg.includes('muito grande') || error?.response?.data?.error === 'file_too_large') {
        setExpenseError('📸 Arquivo muito grande! Use uma imagem menor que 3MB.')
      } else if (status === 422) {
        setExpenseError('⚠️ Verifique os dados: placa, valor e comprovante.')
      } else if (status === 401) {
        setExpenseError('🔐 Sessão expirada. Faça login novamente.')
      } else if (status >= 500) {
        setExpenseError('🔧 Erro no servidor. Tente novamente.')
      } else if (!error?.response) {
        setExpenseError('📡 Sem conexão. Verifique sua internet.')
      } else {
        setExpenseError(msg || '❌ Erro ao enviar despesa.')
      }
    } finally {
      setEnviando(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      await new Promise(resolve => setTimeout(resolve, 300))
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      router.push('/login')
    }
  }

  const formatarHorario = (time: string): string => {
    if (!time) return '--:--'
    return time.substring(0, 5)
  }

  const goToNextRota = () => {
    setCurrentRotaIndex((prev) => (prev + 1) % rotas.length)
  }

  const goToPrevRota = () => {
    setCurrentRotaIndex((prev) => (prev - 1 + rotas.length) % rotas.length)
  }

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPlate(e.target.value)
    setVehicle_plate(masked)
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCurrency(e.target.value)
    setValue(masked)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');

        *, *::before, *::after {
          margin: 0; padding: 0; box-sizing: border-box;
        }

        html, body {
          height: 100%;
          font-family: 'DM Sans', sans-serif;
          background: #01233F;
        }

        .screen {
          width: 100%;
          max-width: 430px;
          min-height: 100vh;
          background: #f0f2f5;
          display: flex;
          flex-direction: column;
          margin: 0 auto;
        }

        /* ── Header ── */
        .header {
          background: #01233F;
          padding: 0 20px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #f1bb13;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .header-sub {
          font-size: 9px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .logout-btn {
          background: rgba(241,187,19,0.12);
          border: 1px solid rgba(241,187,19,0.25);
          color: #f1bb13;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 7px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .logout-btn:hover {
          background: rgba(241,187,19,0.2);
        }

        /* ── Content ── */
        .content {
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
          overflow-y: auto;
        }

        /* ── Welcome ── */
        .welcome {
          padding: 4px 0 8px;
        }

        .welcome-label {
          font-size: 10px;
          font-weight: 600;
          color: #6b7a8d;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .welcome-name {
          font-size: 22px;
          font-weight: 800;
          color: #01233F;
          letter-spacing: -0.5px;
        }

        /* ── Card ── */
        .card {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(1,35,63,0.07), 0 1px 4px rgba(1,35,63,0.04);
          border: 1px solid #e2e6ea;
        }

        .card-title {
          font-size: 11px;
          font-weight: 700;
          color: #01233F;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f1bb13;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-title-icon {
          width: 28px;
          height: 28px;
          background: rgba(241,187,19,0.12);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ── Routes carousel ── */
        .routes-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #01233F;
          color: #f1bb13;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          flex-shrink: 0;
          transition: all 0.15s;
        }

        .nav-btn:hover:not(:disabled) {
          background: #f1bb13;
          color: #01233F;
          box-shadow: 0 4px 12px rgba(241,187,19,0.3);
        }

        .nav-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .routes-carousel {
          flex: 1;
          overflow: hidden;
        }

        .route-item {
          background: #f7f8fa;
          border-left: 4px solid #f1bb13;
          border-radius: 10px;
          padding: 14px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1.5px solid #e2e6ea;
          border-left: 4px solid #f1bb13;
        }

        .route-item:hover {
          box-shadow: 0 4px 16px rgba(241,187,19,0.15);
          border-color: #f1bb13;
          transform: translateY(-1px);
        }

        .route-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .route-badge {
          background: #01233F;
          color: #f1bb13;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          letter-spacing: 0.5px;
          min-width: 52px;
          text-align: center;
          flex-shrink: 0;
        }

        .route-name {
          font-size: 13px;
          font-weight: 700;
          color: #01233F;
          letter-spacing: 0.3px;
        }

        .route-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .route-detail-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6b7a8d;
        }

        .route-detail-label {
          font-weight: 600;
          color: #01233F;
          min-width: 50px;
        }

        .route-counter {
          margin-top: 10px;
          font-size: 10px;
          color: #b0bac6;
          text-align: center;
          font-weight: 500;
        }

        .loading-text {
          text-align: center;
          color: #6b7a8d;
          font-size: 13px;
          padding: 20px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(241,187,19,0.2);
          border-top-color: #f1bb13;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .error-box {
          background: #fde8e8;
          border: 1px solid #fca5a5;
          color: #7f1d1d;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Expense Form ── */
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 14px;
        }

        .field:last-child {
          margin-bottom: 0;
        }

        .label {
          font-size: 10px;
          font-weight: 700;
          color: #01233F;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .input {
          width: 100%;
          height: 48px;
          border: 1.5px solid #e2e6ea;
          border-radius: 10px;
          padding: 0 14px;
          font-size: 13px;
          font-weight: 400;
          color: #01233F;
          background: #f7f8fa;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .input::placeholder {
          color: #b0bac6;
          font-size: 12px;
        }

        .input:focus {
          border-color: #f1bb13;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(241,187,19,0.12);
        }

        .input:disabled {
          opacity: 0.6;
        }

        .file-hint {
          font-size: 10px;
          color: #b0bac6;
          margin-top: 2px;
        }

        .file-selected {
          font-size: 11px;
          color: #6b7a8d;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .file-selected::before {
          content: '✓';
          color: #22c55e;
          font-weight: 700;
        }

        .submit-btn {
          width: 100%;
          height: 52px;
          background: #f1bb13;
          border: none;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #01233F;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          margin-top: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #d9a700;
          box-shadow: 0 4px 16px rgba(241,187,19,0.35);
          transform: translateY(-1px);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .submit-btn.success {
          background: #22c55e;
          color: #fff;
        }

        .btn-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(1,35,63,0.2);
          border-top-color: #01233F;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* ── Footer ── */
        .footer {
          background: #01233F;
          border-top: 2px solid #f1bb13;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer p {
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div className="screen">

        <header className="header">
          <div className="header-brand">
            <svg width="26" height="20" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="38" height="20" rx="3" stroke="white" strokeWidth="1.8"/>
              <rect x="3" y="4" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5"/>
              <rect x="13" y="4" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5"/>
              <rect x="23" y="4" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5"/>
              <rect x="38" y="5" width="3" height="10" rx="1.5" stroke="white" strokeWidth="1.5"/>
              <circle cx="8" cy="24" r="4" stroke="white" strokeWidth="1.8"/>
              <circle cx="30" cy="24" r="4" stroke="white" strokeWidth="1.8"/>
              <line x1="0" y1="20" x2="38" y2="20" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
            </svg>
            <div>
              <div className="header-title">Omnibus</div>
              <div className="header-sub">Gestão Escolar</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Sair</button>
        </header>

        <div className="content">

          <div className="welcome">
            <div className="welcome-label">Bem-vindo de volta</div>
            <div className="welcome-name">{driver?.name || 'Motorista'}</div>
          </div>

          {/* ── Rotas ── */}
          <div className="card">
            <div className="card-title">
              <div className="card-title-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f1bb13">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>
                </svg>
              </div>
              Suas Rotas
            </div>

            {loadingRoutes && (
              <div className="loading-text">
                <div className="loading-spinner" />
                Carregando rotas...
              </div>
            )}

            {errorRoutes && <div className="error-box">{errorRoutes}</div>}

            {!loadingRoutes && rotas.length === 0 && (
              <div className="loading-text">Nenhuma rota prevista no momento</div>
            )}

            {!loadingRoutes && rotas.length > 0 && (
              <div className="routes-container">
                <button
                  className="nav-btn"
                  onClick={goToPrevRota}
                  disabled={rotas.length <= 1}
                  aria-label="Rota anterior"
                >
                  ‹
                </button>

                <div className="routes-carousel">
                  {rotas.map((rota, index) =>
                    index === currentRotaIndex ? (
                      <div
                        key={rota.id}
                        className="route-item"
                        onClick={() => router.push(`/acompanharRota/${rota.id}`)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="route-top">
                          <span className="route-badge">{formatarHorario(rota.departure_time || rota.start_time)}</span>
                          <span className="route-name">{rota.name || 'Rota'}</span>
                        </div>
                        <div className="route-details">
                          <div className="route-detail-row">
                            <span className="route-detail-label">Partida:</span>
                            <span>{formatarHorario(rota.departure_time || rota.start_time)}</span>
                          </div>
                          <div className="route-detail-row">
                            <span className="route-detail-label">Início:</span>
                            <span>{typeof rota.start_point === 'object' ? rota.start_point?.name : rota.start_point}</span>
                          </div>
                          <div className="route-detail-row">
                            <span className="route-detail-label">Fim:</span>
                            <span>{typeof rota.end_point === 'object' ? rota.end_point?.name : rota.end_point}</span>
                          </div>
                        </div>
                        <div className="route-counter">{currentRotaIndex + 1} / {rotas.length}</div>
                      </div>
                    ) : null
                  )}
                </div>

                <button
                  className="nav-btn"
                  onClick={goToNextRota}
                  disabled={rotas.length <= 1}
                  aria-label="Próxima rota"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          {/* ── Despesa ── */}
          <div className="card">
            <div className="card-title">
              <div className="card-title-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f1bb13">
                  <path d="M12 2a1 1 0 0 1 1 1v1.07C16.39 4.56 19 6.58 19 9c0 .55-.45 1-1 1s-1-.45-1-1c0-1.3-2.06-2.5-5-2.5S7 7.7 7 9s2.06 2.5 5 2.5c3.87 0 6 1.93 6 4.5 0 2.42-2.61 4.44-6 4.93V22a1 1 0 1 1-2 0v-1.07C6.61 20.44 4 18.42 4 16c0-.55.45-1 1-1s1 .45 1 1c0 1.3 2.06 2.5 5 2.5s5-1.2 5-2.5-2.06-2.5-5-2.5c-3.87 0-6-1.93-6-4.5C5 6.58 7.61 4.56 11 4.07V3a1 1 0 0 1 1-1z"/>
                </svg>
              </div>
              Cadastrar Despesa
            </div>

            {expenseError && (
              <div className="error-box" style={{ marginBottom: '16px' }}>{expenseError}</div>
            )}

            <form onSubmit={handleEnviarDespesa}>
              <div className="two-col">
                <div className="field">
                  <label className="label">Placa *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="ABC-1234"
                    value={vehicle_plate}
                    onChange={handlePlateChange}
                    maxLength={8}
                    disabled={enviando}
                    required
                  />
                </div>
                <div className="field">
                  <label className="label">Valor *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="R$ 0,00"
                    value={value}
                    onChange={handleValueChange}
                    disabled={enviando}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Descrição</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ex: Combustível, manutenção..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={enviando}
                />
              </div>

              <div className="field">
                <label className="label">Comprovante</label>
                <input
                  type="file"
                  className="input"
                  style={{ paddingTop: '12px', height: 'auto', minHeight: '48px' }}
                  accept="image/*"
                  onChange={(e) => setProofOfPayment(e.target.files?.[0] || null)}
                  disabled={enviando}
                />
                <span className="file-hint">Apenas imagens (JPG, PNG, WEBP) — máx. 3MB</span>
                {proofOfPayment && (
                  <span className="file-selected">{proofOfPayment.name}</span>
                )}
              </div>

              <button
                type="submit"
                className={`submit-btn${enviado ? ' success' : ''}`}
                disabled={enviando || enviado}
              >
                {enviando && <span className="btn-spinner" />}
                {enviando ? 'Enviando...' : enviado ? '✓ Enviado!' : 'Enviar Despesa'}
              </button>
            </form>
          </div>

        </div>

        <footer className="footer">
          <p>© 2026 Omnibus</p>
        </footer>
      </div>
    </>
  )
}
