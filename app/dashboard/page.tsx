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
      const driverRoutes = data.filter((rota) => !rota.driver_id || rota.driver_id === driver?.id)
      setRotas(driverRoutes)
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

    // Validar tamanho do arquivo (máx 5MB em Base64)
    if (proofOfPayment.size > 5 * 1024 * 1024) {
      setExpenseError('Arquivo muito grande. Máximo 5MB. Comprima a imagem e tente novamente.')
      return
    }

    try {
      setEnviando(true)
      
      // Convertendo arquivo para Base64 para enviar como string
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const base64String = reader.result as string
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
          // Tratamento de erros mais amigáveis
          const errorMessage = error.response?.data?.message || error.message || 'Erro ao enviar despesa'
          const errorCode = error.response?.data?.error
          
          let userFriendlyMessage = errorMessage
          
          if (errorCode === 'file_too_large' || errorMessage.includes('muito grande')) {
            userFriendlyMessage = '📸 Arquivo muito grande! Comprima a imagem e tente novamente.'
          } else if (error.response?.status === 422) {
            userFriendlyMessage = '⚠️ Verifique os dados: placa, valor e comprovante.'
          } else if (error.response?.status === 401) {
            userFriendlyMessage = '🔐 Sessão expirada. Faça login novamente.'
          } else if (error.response?.status >= 500) {
            userFriendlyMessage = '🔧 Erro no servidor. Tente novamente em alguns momentos.'
          } else if (!error.response) {
            userFriendlyMessage = '📡 Falha de conexão. Verifique sua internet.'
          }
          
          setExpenseError(userFriendlyMessage)
        } finally {
          setEnviando(false)
        }
      }
      reader.onerror = () => {
        setExpenseError('❌ Erro ao ler o arquivo. Tente selecionar outro.')
        setEnviando(false)
      }
      reader.readAsDataURL(proofOfPayment)
    } catch (error: any) {
      setExpenseError('❌ Erro ao processar o arquivo.')
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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          color: #1A2B4A;
        }

        html, body {
          height: 100%;
          font-family: 'Montserrat', sans-serif;
          background-color: #e8e8e8;
        }

        .screen {
          width: 100%;
          max-width: 390px;
          min-height: 100vh;
          background-color: #F4F6FA;
          display: flex;
          flex-direction: column;
          margin: 0 auto;
        }

        .header {
          background: #ffffff;
          padding: 4px 12px;
          border-bottom: 3px solid #F5B800;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 32px;
        }

        .footer {
          background: #ffffff;
          padding: 16px 24px;
          border-top: 2px solid #F5B800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: auto;
        }

        .footer p {
          font-size: 10px;
          color: #8A99B3;
          text-align: center;
          margin: 0;
        }

        .logoWrapper {
          display: flex;
          align-items: center;
        }

        .logoutBtn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: background 0.2s;
          color: #1A2B4A;
          font-weight: 700;
          font-size: 16px;
        }

        .logoutBtn:hover {
          background: #f0f4fa;
        }

        .content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
          flex: 1;
        }

        .welcomeSection {
          text-align: left;
          margin-bottom: 8px;
        }

        .welcomeLabel {
          font-size: 11px;
          font-weight: 600;
          color: #8A99B3;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .welcomeName {
          font-size: 20px;
          font-weight: 900;
          color: #1A2B4A;
          letter-spacing: 0.5px;
        }

        .card {
          width: 100%;
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(26, 43, 74, 0.08);
        }

        .cardTitle {
          font-size: 16px;
          font-weight: 900;
          color: #1A2B4A;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #F5B800;
        }

        .rotasContainer {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .rotasCarousel {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
        }

        .rotaItem {
          background: linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%);
          border-left: 4px solid #F5B800;
          border-radius: 10px;
          padding: 14px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1.5px solid #E8ECF2;
          min-width: 100%;
          flex-shrink: 0;
        }

        .rotaItem:hover {
          box-shadow: 0 4px 16px rgba(245, 184, 0, 0.15);
          border-color: #F5B800;
          transform: translateX(4px);
        }

        .navButton {
          background: #1A2B4A;
          color: #F5B800;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .navButton:hover {
          background: #F5B800;
          color: #1A2B4A;
          box-shadow: 0 4px 12px rgba(245, 184, 0, 0.3);
        }

        .navButton:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .rotaTop {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .rotaTime {
          background: #1A2B4A;
          color: #F5B800;
          font-size: 12px;
          font-weight: 900;
          padding: 4px 8px;
          border-radius: 6px;
          letter-spacing: 1px;
          min-width: 50px;
          text-align: center;
        }

        .rotaName {
          font-size: 12px;
          font-weight: 800;
          color: #1A2B4A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rotaEnd {
          font-size: 11px;
          color: #7A8AA0;
          margin-left: 10px;
        }

        .loadingText {
          text-align: center;
          color: #8A99B3;
          font-size: 12px;
          padding: 20px;
        }

        .errorBox {
          background: linear-gradient(135deg, #ffe0e0 0%, #ffcccc 100%);
          border: 2px solid #ff6b6b;
          color: #cc0000;
          padding: 14px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .formGroup {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }

        .label {
          font-size: 11px;
          font-weight: 700;
          color: #1A2B4A;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .input {
          width: 100%;
          padding: 12px 14px;
          background: #F4F6FA;
          border: 1.5px solid #E0E6F0;
          border-radius: 8px;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          color: #1A2B4A;
          outline: none;
          transition: all 0.2s;
        }

        .input:focus {
          border-color: #F5B800;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(245, 184, 0, 0.1);
        }

        .input::placeholder {
          color: #B8C2D0;
        }

        .twoColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .textarea {
          width: 100%;
          padding: 12px 14px;
          background: #F4F6FA;
          border: 1.5px solid #E0E6F0;
          border-radius: 8px;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          color: #1A2B4A;
          outline: none;
          resize: vertical;
          min-height: 80px;
          transition: all 0.2s;
        }

        .textarea:focus {
          border-color: #F5B800;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(245, 184, 0, 0.1);
        }

        .submitBtn {
          width: 100%;
          padding: 14px;
          background: #F5B800;
          color: #1A2B4A;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }

        .submitBtn:hover:not(:disabled) {
          background: #dca000;
          box-shadow: 0 4px 12px rgba(245, 184, 0, 0.3);
        }

        .submitBtn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .submitBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submitBtn.success {
          background: #28a745;
          color: #ffffff;
        }

        @media (max-width: 480px) {
          .content {
            padding: 16px;
          }
          
          .card {
            padding: 16px;
          }
          
          .welcomeName {
            font-size: 18px;
          }
        }
      `}</style>

      <div className="screen">
        
        <header className="header">
          <div className="logoWrapper">
            <Image src="/logo.png" alt="Omnibus" width={90} height={28} />
          </div>
          <button 
            className="logoutBtn"
            onClick={handleLogout}
            title="Fazer logout"
          >
            Sair
          </button>
        </header>

        <div className="content">
          
          <div className="welcomeSection">
            <div className="welcomeLabel">Bem-vindo de volta</div>
            <div className="welcomeName">{driver?.name || 'Motorista'}</div>
          </div>

          <div className="card">
            <div className="cardTitle">Suas Rotas</div>
            
            {loadingRoutes && <p className="loadingText">Carregando suas rotas...</p>}
            {errorRoutes && <div className="errorBox">{errorRoutes}</div>}
            {!loadingRoutes && rotas.length === 0 && <p className="loadingText">Nenhuma rota prevista no momento</p>}
            
            {!loadingRoutes && rotas.length > 0 && (
              <div className="rotasContainer">
                <button 
                  className="navButton"
                  onClick={goToPrevRota}
                  disabled={rotas.length <= 1}
                  aria-label="Rota anterior"
                >
                  ‹
                </button>
                
                <div className="rotasCarousel">
                  {rotas.map((rota, index) => (
                    index === currentRotaIndex && (
                      <div
                        key={rota.id}
                        className="rotaItem"
                        onClick={() => router.push(`/acompanharRota/${rota.id}`)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="rotaTop">
                          <span className="rotaTime">{formatarHorario(rota.departure_time || rota.start_time)}</span>
                          <span className="rotaName">{rota.name || 'Rota'}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#7A8AA0' }}>
                          <strong>Partida:</strong> {formatarHorario(rota.departure_time || rota.start_time)}
                          <div style={{ marginTop: '4px' }}>
                            <strong>Início:</strong> {rota.start_point}
                          </div>
                          <div style={{ marginTop: '4px' }}>
                            <strong>Fim:</strong> {rota.end_point}
                          </div>
                        </div>
                        <div style={{ marginTop: '8px', fontSize: '10px', color: '#B8C2D0', textAlign: 'center' }}>
                          {currentRotaIndex + 1} / {rotas.length}
                        </div>
                      </div>
                    )
                  ))}
                </div>
                
                <button 
                  className="navButton"
                  onClick={goToNextRota}
                  disabled={rotas.length <= 1}
                  aria-label="Próxima rota"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          <div className="card">
            <div className="cardTitle">Cadastrar Despesa</div>
            
            {expenseError && <div className="errorBox" style={{ marginBottom: '16px' }}>{expenseError}</div>}
            
            <form onSubmit={handleEnviarDespesa}>
              <div className="twoColumns">
                <div className="formGroup">
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
                <div className="formGroup">
                  <label className="label">Valor (R$) *</label>
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

              <div className="formGroup">
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

              <div className="formGroup">
                <label className="label">Comprovante de Pagamento</label>
                <input
                  type="file"
                  className="input"
                  accept="image/*,.pdf"
                  onChange={(e) => setProofOfPayment(e.target.files?.[0] || null)}
                  disabled={enviando}
                />
                {proofOfPayment && (
                  <div style={{ fontSize: '12px', color: '#7A8AA0', marginTop: '8px' }}>
                    ✓ {proofOfPayment.name}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`submitBtn${enviado ? ' success' : ''}`}
                disabled={enviando || enviado}
              >
                {enviando ? '⏳ Enviando...' : enviado ? '✓ Enviado!' : 'Enviar Despesa'}
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
