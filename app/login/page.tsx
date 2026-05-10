'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    if (!email || !password) {
      setLocalError('Por favor, preencha todos os campos')
      return
    }
    try {
      await login({ email, password })
      router.push('/dashboard')
    } catch (err: any) {
      setLocalError(err.message || 'Erro ao fazer login')
    }
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
        }

        /* ── Top azul com logo ── */
        .top-block {
          background: #01233F;
          padding: 52px 28px 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .top-block::after {
          content: '';
          position: absolute;
          bottom: -22px;
          left: 0; right: 0;
          height: 44px;
          background: #fff;
          border-radius: 26px 26px 0 0;
        }

        /* Sem fundo — logo diretamente sobre o azul */
        .logo-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Form area ── */
        .form-area {
          flex: 1;
          padding: 44px 24px 24px;
          display: flex;
          flex-direction: column;
        }

        .page-title {
          font-size: 22px;
          font-weight: 800;
          color: #01233F;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .page-subtitle {
          font-size: 13px;
          color: #6b7a8d;
          margin-bottom: 22px;
        }

        /* ── Info alert ── */
        .info-alert {
          background: #eef4fb;
          border: 1px solid #c5d8ee;
          border-left: 3px solid #4a90c4;
          border-radius: 10px;
          padding: 11px 14px;
          margin-bottom: 22px;
          display: flex;
          gap: 9px;
          align-items: flex-start;
        }

        .info-icon { flex-shrink: 0; margin-top: 1px; }

        .info-text {
          font-size: 12px;
          color: #2c5282;
          line-height: 1.55;
        }

        /* ── Error box ── */
        .error-box {
          background: #fde8e8;
          border: 1px solid #fca5a5;
          color: #7f1d1d;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 16px;
          animation: slideIn 0.25s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .label {
          font-size: 10px;
          font-weight: 700;
          color: #01233F;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f7f8fa;
          border: 1.5px solid #e2e6ea;
          border-radius: 10px;
          padding: 0 14px;
          height: 50px;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .input-wrap:focus-within {
          border-color: #f1bb13;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(241,187,19,0.12);
        }

        /* font-size: 16px evita o zoom automático no iOS/Android */
        .input-wrap input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          color: #01233F;
          outline: none;
        }

        .input-wrap input::placeholder { color: #b0bac6; font-size: 14px; }
        .input-wrap input:disabled { opacity: 0.6; }

        .field-hint {
          font-size: 10px;
          color: #9aa5b4;
        }

        /* ── Submit ── */
        .submit-btn {
          width: 100%;
          height: 52px;
          background: #f1bb13;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #01233F;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #d9a700;
          box-shadow: 0 4px 14px rgba(241,187,19,0.35);
          transform: translateY(-1px);
        }

        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .btn-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(1,35,63,0.2);
          border-top-color: #01233F;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .footer {
          background: #01233F;
          border-top: 2px solid #f1bb13;
          padding: 13px;
          text-align: center;
        }

        .footer p {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div className="shell">
        <div className="phone">

          <div className="top-block">
            <div className="logo-wrap">
              <Image src="/logo.png" alt="Omnibus" width={150} height={50} style={{ objectFit: 'contain' }} />
            </div>
          </div>

          <div className="form-area">
            <div className="page-title">Bem-vindo</div>
            <div className="page-subtitle">Acesse sua conta para continuar</div>

            <div className="info-alert">
              <span className="info-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a90c4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </span>
              <span className="info-text">
                O acesso só é possível se a secretaria já tiver te cadastrado e fornecido suas credenciais.
              </span>
            </div>

            {(error || localError) && (
              <div className="error-box">{error || localError}</div>
            )}

            <form onSubmit={handleLogin}>
              <div className="field">
                <label className="label">E-mail</label>
                <div className="input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b0bac6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Senha</label>
                <div className="input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b0bac6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type="password"
                    placeholder="sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
                <span className="field-hint">Fornecida pela secretaria no seu cadastro</span>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading && <span className="btn-spinner" />}
                {isLoading ? 'Conectando...' : 'Entrar'}
              </button>
            </form>
          </div>

          <footer className="footer">
            <p>© 2026 Omnibus · Gestão Escolar</p>
          </footer>

        </div>
      </div>
    </>
  )
}
