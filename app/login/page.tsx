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
          background: #ffffff;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* ── Top dark block ── */
        .top-block {
          background: #01233F;
          padding: 56px 28px 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          position: relative;
        }

        .top-block::after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: 0; right: 0;
          height: 40px;
          background: #ffffff;
          border-radius: 24px 24px 0 0;
        }

        .brand-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(241,187,19,0.12);
          border: 1px solid rgba(241,187,19,0.25);
          border-radius: 20px;
          padding: 5px 14px;
        }

        .brand-tag span {
          font-size: 10px;
          font-weight: 700;
          color: #f1bb13;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        /* ── Form area ── */
        .form-area {
          flex: 1;
          padding: 40px 24px 32px;
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
          margin-bottom: 28px;
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
          margin-bottom: 18px;
          animation: slideIn 0.25s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Field ── */
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

        .input-wrap input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #01233F;
          outline: none;
        }

        .input-wrap input::placeholder { color: #b0bac6; }
        .input-wrap input:disabled { opacity: 0.6; }

        .input-icon { flex-shrink: 0; }

        /* ── Submit ── */
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

        /* ── Footer ── */
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

          {/* ── Top dark block com logo ── */}
          <div className="top-block">
            <Image src="/logo.png" alt="Omnibus" width={140} height={46} style={{ objectFit: 'contain' }} />
            <div className="brand-tag">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#f1bb13">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>
              </svg>
              <span>Área do Motorista</span>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="form-area">
            <div className="page-title">Bem-vindo</div>
            <div className="page-subtitle">Acesse sua conta para continuar</div>

            {(error || localError) && (
              <div className="error-box">{error || localError}</div>
            )}

            <form onSubmit={handleLogin}>
              <div className="field">
                <label className="label">E-mail</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b0bac6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
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
                  <span className="input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b0bac6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type="password"
                    placeholder="sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading && <span className="btn-spinner" />}
                {isLoading ? 'Conectando...' : 'Entrar'}
              </button>
            </form>
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
