'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import MapComponent from '@/components/MapComponent'
import { routesService } from '@/services/routes'
import notificationsService from '@/services/notifications'
import { Route } from '@/types'

const tiposNotificacao = [
  'Rota Iniciada',
  'Rota Finalizada',
  'Atraso na Rota',
  'Troca de Veículo',
  'Veículo apresenta mau funcionamento',
]

// Mapeamento de tipos em português para tipos de API
const TIPO_NOTIFICACAO_MAP: Record<string, string> = {
  'Rota Iniciada': 'route_started',
  'Rota Finalizada': 'route_finished',
  'Atraso na Rota': 'route_delayed',
  'Troca de Veículo': 'vehicle_changed',
  'Veículo apresenta mau funcionamento': 'route_maintenance',
}

export default function AcompanharRotaPage() {
  const router = useRouter()
  const params = useParams()
  const rotaId = params?.id as string

  const [rota, setRota] = useState<Route | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const [tipoSelecionado, setTipoSelecionado] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [notificationError, setNotificationError] = useState<string | null>(null)

  useEffect(() => {
    if (rotaId) {
      fetchRota()
    }
  }, [rotaId])

  const fetchRota = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await routesService.getRoute(parseInt(rotaId))
      setRota(data)
    } catch (err: any) {
      setError('Erro ao carregar rota')
      console.error('Erro ao buscar rota:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRouteName = (): string => {
    return rota?.name || 'Rota'
  }

  const getVehiclePlate = (): string => {
    return rota?.vehicle?.plate || 'placa não informada'
  }

  const buildNotificationMessage = () => {
    const baseMessage = mensagem || tipoSelecionado
    const routeName = getRouteName()
    const plate = getVehiclePlate()

    if (['Rota Iniciada', 'Rota Finalizada', 'Atraso na Rota'].includes(tipoSelecionado)) {
      return `${baseMessage} - ${routeName}`
    }

    if (['Troca de Veículo', 'Veículo apresenta mau funcionamento'].includes(tipoSelecionado)) {
      return `${baseMessage} - ${plate}`
    }

    return baseMessage
  }

  const handleEnviarNotificacao = async () => {
    if (!tipoSelecionado && !mensagem) {
      setNotificationError('Selecione um tipo ou escreva uma mensagem')
      return
    }

    try {
      setEnviando(true)
      setNotificationError(null)
      
      // Mapear o tipo selecionado para o tipo da API
      const tipoApi = TIPO_NOTIFICACAO_MAP[tipoSelecionado] || 'route_started'
      const mensagemFinal = buildNotificationMessage()
      
      // Enviar notificação para a API
      const response = await notificationsService.sendNotification({
        type: tipoApi,
        message: mensagemFinal,
        route_id: parseInt(rotaId),
      })

      console.log('Notificação enviada:', response)
      
      setEnviado(true)
      setTipoSelecionado('')
      setMensagem('')
      
      setTimeout(() => setEnviado(false), 2000)
    } catch (err: any) {
      console.error('Erro ao enviar notificação:', err)
      setNotificationError(
        err?.message || err?.response?.data?.message || 'Erro ao enviar notificação'
      )
    } finally {
      setEnviando(false)
    }
  }

  const formatarHorario = (time: string): string => {
    if (!time) return '--:--'
    return time.substring(0, 5)
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
          padding: 2px 8px;
          border-bottom: 3px solid #F5B800;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-height: 22px;
        }

        .footer {
          background: #ffffff;
          padding: 6px 12px;
          border-top: 2px solid #F5B800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: auto;
        }

        .footer p {
          font-size: 8px;
          color: #8A99B3;
          text-align: center;
          margin: 0;
        }

        .content {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          flex: 1;
        }

        .backButton {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #1A2B4A;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: opacity 0.2s;
          margin-bottom: 8px;
        }

        .backButton:hover {
          opacity: 0.7;
        }

        .backCircle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #1A2B4A;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rotaTitulo {
          font-size: 16px;
          font-weight: 900;
          color: #1A2B4A;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-align: left;
          margin: 0 0 8px 0;
        }

        .rotaInfo {
          display: none;
        }

        .map {
          width: 100%;
          height: 300px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(26, 43, 74, 0.1);
          margin-bottom: 8px;
        }

        .card {
          width: 100%;
          background: #ffffff;
          border-radius: 16px;
          padding: 14px;
          box-shadow: 0 4px 20px rgba(26, 43, 74, 0.08);
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .cardTitle {
          font-size: 14px;
          font-weight: 900;
          color: #1A2B4A;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #F5B800;
          flex-shrink: 0;
        }

        .cardContent {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-right: 4px;
        }

        .cardContent::-webkit-scrollbar {
          width: 4px;
        }

        .cardContent::-webkit-scrollbar-track {
          background: transparent;
        }

        .cardContent::-webkit-scrollbar-thumb {
          background: #E0E6F0;
          border-radius: 2px;
        }

        .cardContent::-webkit-scrollbar-thumb:hover {
          background: #B8C2D0;
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
          margin-bottom: 16px;
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

        .dropdownWrapper {
          position: relative;
          margin-bottom: 10px;
        }

        .dropdownTrigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: #F4F6FA;
          border: 1.5px solid #E0E6F0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #1A2B4A;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .dropdownTrigger:hover {
          border-color: #F5B800;
        }

        .dropdownTrigger.open {
          border-color: #F5B800;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .dropdownChevron {
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .dropdownChevron.open {
          transform: rotate(180deg);
        }

        .dropdownMenu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1.5px solid #F5B800;
          border-top: none;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          z-index: 10;
          overflow-y: auto;
          max-height: 140px;
          box-shadow: 0 4px 12px rgba(26, 43, 74, 0.1);
        }

        .dropdownItem {
          padding: 8px 12px;
          font-size: 10px;
          font-weight: 600;
          color: #1A2B4A;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 1px solid #F4F6FA;
        }

        .dropdownItem:last-child {
          border-bottom: none;
        }

        .dropdownItem:hover {
          background: #FFFBEF;
        }

        .dropdownItem.selected {
          background: #FFF3CD;
          font-weight: 800;
        }

        .formGroup {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 10px;
        }

        .label {
          font-size: 10px;
          font-weight: 700;
          color: #1A2B4A;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .textarea {
          width: 100%;
          padding: 8px 10px;
          background: #F4F6FA;
          border: 1.5px solid #E0E6F0;
          border-radius: 8px;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          color: #1A2B4A;
          outline: none;
          resize: vertical;
          min-height: 70px;
          transition: all 0.2s;
        }

        .textarea:focus {
          border-color: #F5B800;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(245, 184, 0, 0.1);
        }

        .textarea::placeholder {
          color: #B8C2D0;
        }

        .submitBtn {
          width: 100%;
          padding: 10px;
          background: #F5B800;
          color: #1A2B4A;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 6px;
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
        }
      `}</style>

      <div className="screen">
        
        <header className="header">
          <Image src="/logo.png" alt="Omnibus" width={90} height={28} />
        </header>

        <div className="content">
          
          <button 
            className="backButton"
            onClick={() => router.push('/dashboard')}
          >
            <div className="backCircle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5B800" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </div>
            Voltar
          </button>

          {loading && <p className="loadingText">Carregando detalhes da rota...</p>}
          {error && <div className="errorBox">{error}</div>}

          {!loading && rota && (
            <>
              <div className="rotaTitulo">
                {rota.name || rota.id}
              </div>

              <div className="map">
                <MapComponent
                  startPoint={{
                    lat: (typeof rota.start_point === 'object' ? rota.start_point?.lat : rota.start_point_lat) || -19.8226,
                    lng: (typeof rota.start_point === 'object' ? rota.start_point?.lng : rota.start_point_lng) || -43.9441,
                    name: typeof rota.start_point === 'object' ? rota.start_point?.name : (rota.start_point || 'Ponto de Saída'),
                  }}
                  endPoint={{
                    lat: (typeof rota.end_point === 'object' ? rota.end_point?.lat : rota.end_point_lat) || -19.9226,
                    lng: (typeof rota.end_point === 'object' ? rota.end_point?.lng : rota.end_point_lng) || -43.8441,
                    name: typeof rota.end_point === 'object' ? rota.end_point?.name : (rota.end_point || 'Ponto de Chegada'),
                  }}
                  height="100%"
                />
              </div>

              <div className="card">
                <div className="cardTitle">Enviar Notificação</div>

                <div className="cardContent">
                  {notificationError && <div className="errorBox" style={{ marginBottom: '16px' }}>{notificationError}</div>}

                <div className="dropdownWrapper">
                  <button
                    type="button"
                    className={`dropdownTrigger${dropdownAberto ? ' open' : ''}`}
                    onClick={() => setDropdownAberto(!dropdownAberto)}
                  >
                    <span>{tipoSelecionado || 'Selecionar tipo'}</span>
                    <svg
                      className={`dropdownChevron${dropdownAberto ? ' open' : ''}`}
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="#1A2B4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>

                  {dropdownAberto && (
                    <div className="dropdownMenu">
                      {tiposNotificacao.map((tipo) => (
                        <div
                          key={tipo}
                          className={`dropdownItem${tipoSelecionado === tipo ? ' selected' : ''}`}
                          onClick={() => {
                            setTipoSelecionado(tipo)
                            setDropdownAberto(false)
                          }}
                        >
                          {tipo}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="formGroup">
                  <label className="label">Mensagem Adicional</label>
                  <textarea
                    className="textarea"
                    placeholder="Descreva a situação..."
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    disabled={enviando}
                  />
                </div>

                <button
                  type="button"
                  className={`submitBtn${enviado ? ' success' : ''}`}
                  onClick={handleEnviarNotificacao}
                  disabled={enviando || enviado}
                >
                  {enviando ? '⏳ Enviando...' : enviado ? '✓ Enviada!' : 'Enviar Notificação'}
                </button>
                </div>
              </div>
            </>
          )}

        </div>

        <footer className="footer">
          <p>© 2026 Omnibus</p>
        </footer>
      </div>
    </>
  )
}