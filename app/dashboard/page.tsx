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
  const { driver, logout, isAuthenticated, isLoading } = useAuth()
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
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null)
  const [expenseError, setExpenseError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated && driver) fetchRoutes()
  }, [isAuthenticated, driver])

  useEffect(() => {
    if (!proofOfPayment) { setProofPreviewUrl(null); return }
    const url = URL.createObjectURL(proofOfPayment)
    setProofPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [proofOfPayment])

  const fetchRoutes = async () => {
    try {
      setLoadingRoutes(true)
      setErrorRoutes(null)
      const data = await routesService.getRoutes()
      setRotas(Array.isArray(data) ? data : [])
    } catch (error: any) {
      setErrorRoutes('Erro ao carregar rotas')
    } finally {
      setLoadingRoutes(false)
    }
  }

  const handleEnviarDespesa = async (e: React.FormEvent) => {
    e.preventDefault()
    setExpenseError(null)

    if (!vehicle_plate || !value) { setExpenseError('Preencha todos os campos obrigatórios'); return }
    if (!proofOfPayment) { setExpenseError('Selecione um comprovante de pagamento'); return }
    if (proofOfPayment.size > 3 * 1024 * 1024) { setExpenseError('📸 Arquivo muito grande! Use uma imagem menor que 3MB.'); return }
    if (!proofOfPayment.type.startsWith('image/')) { setExpenseError('⚠️ Envie apenas imagens (JPG, PNG, WEBP).'); return }

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

      await expensesService.createExpense({
        vehicle_plate: unmaskPlate(vehicle_plate),
        value: unmaskCurrency(value),
        description,
        proof_of_payment: base64String,
      })

      setEnviado(true)
      setVehicle_plate(''); setValue(''); setDescription('')
      setProofOfPayment(null); setProofPreviewUrl(null)
      setTimeout(() => setEnviado(false), 2000)

    } catch (error: any) {
      const status = error?.response?.status
      const msg = error?.response?.data?.message || error?.message || ''
      if (msg.includes('muito grande') || error?.response?.data?.error === 'file_too_large')
        setExpenseError('📸 Arquivo muito grande! Use uma imagem menor que 3MB.')
      else if (status === 422) setExpenseError('⚠️ Verifique os dados: placa, valor e comprovante.')
      else if (status === 401) setExpenseError('🔐 Sessão expirada. Faça login novamente.')
      else if (status >= 500) setExpenseError('🔧 Erro no servidor. Tente novamente.')
      else if (!error?.response) setExpenseError('📡 Sem conexão. Verifique sua internet.')
      else setExpenseError(msg || '❌ Erro ao enviar despesa.')
    } finally {
      setEnviando(false)
    }
  }

  const handleLogout = async () => {
    try { await logout(); await new Promise(r => setTimeout(r, 300)); router.push('/login') }
    catch { router.push('/login') }
  }

  const formatarHorario = (time: string): string => {
    if (!time) return '--:--'
    return time.substring(0, 5)
  }

  const goToNextRota = () => setCurrentRotaIndex((p) => (p + 1) % rotas.length)
  const goToPrevRota = () => setCurrentRotaIndex((p) => (p - 1 + rotas.length) % rotas.length)

  if (isLoading) return null

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
          background: #fff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── Header minimalista ── */
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

        /* ── Welcome strip FIXO ── */
        .welcome-strip {
          background: #01233F;
          padding: 14px 20px 26px;
          position: sticky;
          top: 48px;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        /* Arredondamento que cria a transição azul → cinza */
        .welcome-strip::after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: 0; right: 0;
          height: 20px;
          background: #f4f6fa;
          border-radius: 20px 20px 0 0;
          z-index: 1;
        }

        .welcome-left { display: flex; flex-direction: column; }

        .welcome-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.45);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .welcome-name {
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .welcome-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(241,187,19,0.15);
          border: 1px solid rgba(241,187,19,0.25);
          border-radius: 20px;
          padding: 3px 10px;
          margin-top: 6px;
          width: fit-content;
        }

        .welcome-tag span {
          font-size: 10px;
          font-weight: 600;
          color: #f1bb13;
          letter-spacing: 0.5px;
        }

        .logout-btn {
          background: rgba(241,187,19,0.12);
          border: 1px solid rgba(241,187,19,0.3);
          color: #f1bb13;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
          flex-shrink: 0;
          align-self: flex-start;
          margin-top: 4px;
        }

        .logout-btn:hover { background: rgba(241,187,19,0.22); }

        /* ── Scroll content ── */
        .content {
          flex: 1;
          overflow-y: auto;
          background: #f4f6fa;
          /* garante que os cards não sobrepõem a faixa azul */
          position: relative;
          z-index: 0;
        }

        .sections {
          /* 20px para cobrir o ::after da welcome-strip + folga visual */
          padding: 32px 16px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Card ── */
        .card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e6ea;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(1,35,63,0.06);
          position: relative;
          z-index: 0;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 18px 14px;
          border-bottom: 1px solid #f0f2f5;
        }

        .card-header-icon {
          width: 32px; height: 32px;
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

        .card-body { padding: 16px 18px; }

        /* ── Routes ── */
        .routes-nav {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-btn {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: #01233F;
          color: #f1bb13;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          flex-shrink: 0;
          transition: all 0.15s;
          line-height: 1;
        }

        .nav-btn:hover:not(:disabled) { background: #f1bb13; color: #01233F; }
        .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .route-card {
          flex: 1;
          background: #f7f8fa;
          border: 1.5px solid #e2e6ea;
          border-left: 4px solid #f1bb13;
          border-radius: 10px;
          padding: 14px;
        }

        .route-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .route-badge {
          background: #01233F;
          color: #f1bb13;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 6px;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }

        .route-name {
          font-size: 13px;
          font-weight: 700;
          color: #01233F;
        }

        .route-row {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 12px;
          color: #6b7a8d;
          margin-bottom: 4px;
        }

        .route-row:last-of-type { margin-bottom: 0; }

        .route-row strong {
          color: #01233F;
          font-weight: 600;
          min-width: 48px;
          flex-shrink: 0;
        }

        /* ── Ver rota link ── */
        .ver-rota-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          margin-top: 12px;
          padding: 11px 0;
          background: #01233F;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.15s;
        }

        .ver-rota-btn:hover {
          background: #02315a;
        }

        .route-counter {
          text-align: center;
          font-size: 10px;
          color: #b0bac6;
          font-weight: 500;
          margin-top: 10px;
        }

        /* ── Loading / empty ── */
        .loading-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 0;
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

        .empty-state {
          text-align: center;
          color: #b0bac6;
          font-size: 13px;
          padding: 16px 0;
        }

        /* ── Form ── */
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

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

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

        /* font-size: 16px evita zoom automático no iOS/Android */
        .input {
          width: 100%;
          height: 46px;
          border: 1.5px solid #e2e6ea;
          border-radius: 10px;
          padding: 0 13px;
          font-size: 16px;
          color: #01233F;
          background: #f7f8fa;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .input::placeholder { color: #b0bac6; font-size: 13px; }

        .input:focus {
          border-color: #f1bb13;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(241,187,19,0.12);
        }

        .input:disabled { opacity: 0.6; }

        .file-hint { font-size: 10px; color: #b0bac6; margin-top: 2px; }
        .file-ok   { font-size: 11px; color: #16a34a; font-weight: 600; margin-top: 3px; }

        .proof-preview {
          margin-top: 10px;
          border-radius: 10px;
          overflow: hidden;
          border: 1.5px solid #e2e6ea;
          background: #f7f8fa;
          display: flex;
          align-items: center;
          justify-content: center;
          max-height: 260px;
        }

        .proof-preview img {
          width: 100%;
          max-height: 260px;
          object-fit: contain;
          display: block;
        }

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

          <header className="header" />

          {/* ── Welcome strip FIXO ── */}
          <div className="welcome-strip">
            <div className="welcome-left">
              <div className="welcome-label">Bem-vindo de volta</div>
              <div className="welcome-name">{driver?.name || 'Motorista'}</div>
              <div className="welcome-tag">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#f1bb13">
                  <circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0 1 14 0H5z"/>
                </svg>
                <span>Motorista</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Sair</button>
          </div>

          {/* ── Scroll area ── */}
          <div className="content">
            <div className="sections">

              {/* ── Rotas ── */}
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#f1bb13">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>
                    </svg>
                  </div>
                  <span className="card-header-text">Suas Rotas</span>
                </div>
                <div className="card-body">
                  {loadingRoutes && (
                    <div className="loading-row"><div className="spinner" /> Carregando rotas...</div>
                  )}
                  {errorRoutes && <div className="error-box">{errorRoutes}</div>}
                  {!loadingRoutes && rotas.length === 0 && (
                    <div className="empty-state">Nenhuma rota prevista no momento</div>
                  )}
                  {!loadingRoutes && rotas.length > 0 && (
                    <div className="routes-nav">
                      <button className="nav-btn" onClick={goToPrevRota} disabled={rotas.length <= 1} aria-label="Anterior">‹</button>
                      <div style={{ flex: 1 }}>
                        {rotas.map((rota, index) =>
                          index === currentRotaIndex ? (
                            <div key={rota.id} className="route-card">
                              <div className="route-top">
                                <span className="route-badge">{formatarHorario(rota.departure_time || rota.start_time)}</span>
                                <span className="route-name">{rota.name || 'Rota'}</span>
                              </div>
                              <div className="route-row">
                                <strong>Partida:</strong>
                                <span>{formatarHorario(rota.departure_time || rota.start_time)}</span>
                              </div>
                              <div className="route-row">
                                <strong>Início:</strong>
                                <span>{typeof rota.start_point === 'object' ? rota.start_point?.name : rota.start_point}</span>
                              </div>
                              <div className="route-row">
                                <strong>Fim:</strong>
                                <span>{typeof rota.end_point === 'object' ? rota.end_point?.name : rota.end_point}</span>
                              </div>

                              {/* ── Ver rota ── */}
                              <button
                                className="ver-rota-btn"
                                onClick={() => router.push(`/acompanharRota/${rota.id}`)}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                  <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Clique aqui para ver dados da rota
                              </button>

                              <div className="route-counter">{currentRotaIndex + 1} / {rotas.length}</div>
                            </div>
                          ) : null
                        )}
                      </div>
                      <button className="nav-btn" onClick={goToNextRota} disabled={rotas.length <= 1} aria-label="Próxima">›</button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Despesa ── */}
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#f1bb13">
                      <path d="M12 2a1 1 0 0 1 1 1v1.07C16.39 4.56 19 6.58 19 9c0 .55-.45 1-1 1s-1-.45-1-1c0-1.3-2.06-2.5-5-2.5S7 7.7 7 9s2.06 2.5 5 2.5c3.87 0 6 1.93 6 4.5 0 2.42-2.61 4.44-6 4.93V22a1 1 0 1 1-2 0v-1.07C6.61 20.44 4 18.42 4 16c0-.55.45-1 1-1s1 .45 1 1c0 1.3 2.06 2.5 5 2.5s5-1.2 5-2.5-2.06-2.5-5-2.5c-3.87 0-6-1.93-6-4.5C5 6.58 7.61 4.56 11 4.07V3a1 1 0 0 1 1-1z"/>
                    </svg>
                  </div>
                  <span className="card-header-text">Cadastrar Despesa</span>
                </div>
                <div className="card-body">
                  {expenseError && <div className="error-box">{expenseError}</div>}

                  <form onSubmit={handleEnviarDespesa}>
                    <div className="two-col">
                      <div className="field">
                        <label className="label">Placa *</label>
                        <input type="text" className="input" placeholder="ABC-1234"
                          value={vehicle_plate}
                          onChange={(e) => setVehicle_plate(maskPlate(e.target.value))}
                          maxLength={8} disabled={enviando} required />
                      </div>
                      <div className="field">
                        <label className="label">Valor *</label>
                        <input type="text" className="input" placeholder="R$ 0,00"
                          value={value}
                          onChange={(e) => setValue(maskCurrency(e.target.value))}
                          disabled={enviando} required />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Descrição</label>
                      <input type="text" className="input" placeholder="Ex: Combustível, manutenção..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={enviando} />
                    </div>

                    <div className="field">
                      <label className="label">Comprovante</label>
                      <input
                        type="file"
                        className="input"
                        style={{ paddingTop: '11px', height: 'auto', minHeight: '46px', fontSize: '13px' }}
                        accept="image/*"
                        onChange={(e) => setProofOfPayment(e.target.files?.[0] || null)}
                        disabled={enviando}
                      />
                      <span className="file-hint">Apenas imagens (JPG, PNG, WEBP) — máx. 3MB</span>
                      {proofOfPayment && (
                        <>
                          <span className="file-ok">✓ {proofOfPayment.name}</span>
                          {proofPreviewUrl && (
                            <div className="proof-preview">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={proofPreviewUrl} alt="Preview do comprovante" />
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <button type="submit" className={`submit-btn${enviado ? ' success' : ''}`} disabled={enviando || enviado}>
                      {enviando && <span className="btn-spinner" />}
                      {enviando ? 'Enviando...' : enviado ? '✓ Enviado!' : 'Enviar Despesa'}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>

          <footer className="footer">
            <p>© 2026 Omnibus · Gestão Escolar</p>
          </footer>

        </div>
      </div>
    </>
  )
}
