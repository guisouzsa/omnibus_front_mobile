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
    if (rotaId) fetchRota()
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

  const getRouteName = (): string => rota?.name || 'Rota'
  const getVehiclePlate = (): string => rota?.vehicle?.plate || 'placa não informada'

  const buildNotificationMessage = () => {
    const baseMessage = mensagem || tipoSelecionado
    if (['Rota Iniciada', 'Rota Finalizada', 'Atraso na Rota'].includes(tipoSelecionado)) {
      return `${baseMessage} - ${getRouteName()}`
    }
    if (['Troca de Veículo', 'Veículo apresenta mau funcionamento'].includes(tipoSelecionado)) {
      return `${baseMessage} - ${getVehiclePlate()}`
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
      const tipoApi = TIPO_NOTIFICACAO_MAP[tipoSelecionado] || 'route_started'
      const mensagemFinal = buildNotificationMessage()
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
      setNotificationError(err?.message || err?.response?.data?.message || 'Erro ao enviar notificação')
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          height: 100%;
          font-family: 'DM Sans', sans-serif;
          background: #f4f6fa;
        }

        /* ── Shell ── */
        .shell {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          background: #f4f6fa;
        }

        .phone {
          width: 100%;
          max-width: 430px;
          min-height: 100vh;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── Header ── */
        .header {
          background: #01233F;
          height: 48px;
          display: flex;
          align-items: center;
          padding: 0 18px;
          position: sticky;
          top: 0;
          z-index: 50;
          flex-shrink: 0;
        }

        /* ── Back strip ── */
        .back-strip {
          background: #01233F;
          padding: 10px 18px 22px;
          position: sticky;
          top: 48px;
          z-index: 40;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .back-strip::after {
          content: '';
          position: absolute;
          bottom: -16px;
          left: 0; right: 0;
          height: 20px;
          background: #f4f6fa;
          border-radius: 20px 20px 0 0;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(241,187,19,0.12);
          border: 1px solid rgba(241,187,19,0.25);
          border-radius: 8px;
          padding: 7px 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #f1bb13;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: background 0.15s;
        }

        .back-btn:hover { background: rgba(241,187,19,0.22); }

        .back-strip-title {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Scroll content ── */
        .content {
          flex: 1;
          overflow-y: auto;
          background: #f4f6fa;
        }

        .sections {
          padding: 28px 16px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Card ── */
        .card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e6ea;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(1,35,63,0.06);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 18px 14px;
          border-bottom: 1px solid #f0f2f5;
        }

        .card-header-icon {
          width: 32px;
          height: 32px;
          background: rgba(241,187,19,0.12);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-header-text {
          font-size: 11px;
          font-weight: 700;
          color: #01233F;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .card-body {
          padding: 16px 18px;
        }

        /* ── Map ── */
        .map-wrap {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e2e6ea;
          box-shadow: 0 2px 12px rgba(1,35,63,0.06);
          height: 260px;
        }

        /* ── Loading / error ── */
        .loading-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 32px 0;
          color: #6b7a8d;
          font-size: 13px;
        }

        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(241,187,19,0.2);
          border-top-color: #f1bb13;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .error-box {
          background: #fde8e8;
          border: 1px solid #fca5a5;
          color: #7f1d1d;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 14px;
          animation: slideIn 0.25s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Dropdown ── */
        .dropdown-wrap { position: relative; margin-bottom: 13px; }

        .dropdown-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 13px;
          height: 46px;
          background: #f7f8fa;
          border: 1.5px solid #e2e6ea;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #01233F;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .dropdown-trigger.placeholder { color: #b0bac6; }

        .dropdown-trigger.open,
        .dropdown-trigger:focus {
          border-color: #f1bb13;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(241,187,19,0.12);
          outline: none;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .chevron { transition: transform 0.2s; flex-shrink: 0; }
        .chevron.open { transform: rotate(180deg); }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0; right: 0;
          background: #fff;
          border: 1.5px solid #f1bb13;
          border-top: none;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          z-index: 20;
          overflow-y: auto;
          max-height: 180px;
          box-shadow: 0 8px 20px rgba(1,35,63,0.1);
        }

        .dropdown-item {
          padding: 11px 13px;
          font-size: 12px;
          font-weight: 500;
          color: #01233F;
          cursor: pointer;
          border-bottom: 1px solid #f4f6fa;
          transition: background 0.15s;
        }

        .dropdown-item:last-child { border-bottom: none; }
        .dropdown-item:hover { background: #fffbef; }
        .dropdown-item.selected { background: #fff8e1; font-weight: 700; }

        /* ── Form fields ── */
        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 13px;
        }

        .label {
          font-size: 10px;
          font-weight: 700;
          color: #01233F;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .textarea {
          width: 100%;
          padding: 11px 13px;
          background: #f7f8fa;
          border: 1.5px solid #e2e6ea;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #01233F;
          outline: none;
          resize: vertical;
          min-height: 80px;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .textarea:focus {
          border-color: #f1bb13;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(241,187,19,0.12);
        }

        .textarea::placeholder { color: #b0bac6; font-size: 12px; }
        .textarea:disabled { opacity: 0.6; }

        /* ── Submit ── */
        .submit-btn {
          width: 100%;
          height: 50px;
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #d9a700;
          box-shadow: 0 4px 14px rgba(241,187,19,0.35);
          transform: translateY(-1px);
        }

        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .submit-btn.success { background: #22c55e; color: #fff; }

        .btn-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(1,35,63,0.2);
          border-top-color: #01233F;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* ── Footer ── */
        .footer {
          background: #01233F;
          border-top: 2px solid #f1bb13;
          padding: 13px;
          text-align: center;
          flex-shrink: 0;
        }

        .footer p {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div className="shell">
        <div className="phone">

          {/* ── Header ── */}
          <header className="header" />

          {/* ── Back strip ── */}
          <div className="back-strip">
            <button className="back-btn" onClick={() => router.push('/dashboard')}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f1bb13" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Voltar
            </button>
            {rota && (
              <span className="back-strip-title">{rota.name || `Rota #${rotaId}`}</span>
            )}
          </div>

          {/* ── Scroll area ── */}
          <div className="content">
            <div className="sections">

              {loading && (
                <div className="loading-row">
                  <div className="spinner" /> Carregando rota...
                </div>
              )}

              {error && <div className="error-box">{error}</div>}

              {!loading && rota && (
                <>
                  {/* ── Mapa ── */}
                  <div className="map-wrap">
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

                  {/* ── Notificação ── */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-header-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#f1bb13">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                      </div>
                      <span className="card-header-text">Enviar Notificação</span>
                    </div>
                    <div className="card-body">

                      {notificationError && <div className="error-box">{notificationError}</div>}

                      {/* Dropdown tipo */}
                      <div className="dropdown-wrap">
                        <button
                          type="button"
                          className={`dropdown-trigger${dropdownAberto ? ' open' : ''}${!tipoSelecionado ? ' placeholder' : ''}`}
                          onClick={() => setDropdownAberto(!dropdownAberto)}
                        >
                          <span>{tipoSelecionado || 'Selecionar tipo de notificação'}</span>
                          <svg className={`chevron${dropdownAberto ? ' open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7a8d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6"/>
                          </svg>
                        </button>

                        {dropdownAberto && (
                          <div className="dropdown-menu">
                            {tiposNotificacao.map((tipo) => (
                              <div
                                key={tipo}
                                className={`dropdown-item${tipoSelecionado === tipo ? ' selected' : ''}`}
                                onClick={() => { setTipoSelecionado(tipo); setDropdownAberto(false) }}
                              >
                                {tipo}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Mensagem adicional */}
                      <div className="field">
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
                        className={`submit-btn${enviado ? ' success' : ''}`}
                        onClick={handleEnviarNotificacao}
                        disabled={enviando || enviado}
                      >
                        {enviando && <span className="btn-spinner" />}
                        {enviando ? 'Enviando...' : enviado ? '✓ Enviada!' : 'Enviar Notificação'}
                      </button>

                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

          {/* ── Footer ── */}
          <footer className="footer">
            <p>© 2026 Omnibus · Gestão Escolar</p>
          </footer>

        </div>
      </div>
    </>
  )
}
