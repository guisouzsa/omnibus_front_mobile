'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

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
          background-color: #f0f0f0;
        }

        .screen {
          width: 390px;
          height: 844px;
          background-color: #FAFAFA;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          margin: 0 auto;
        }

        .logoWrapper {
          margin-bottom: 40px;
        }

        .card {
          width: 100%;
          background: #ffffff;
          border-radius: 20px;
          padding: 36px 28px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .cardTitle {
          font-size: 22px;
          font-weight: 700;
          color: #1A2B4A;
          text-align: center;
          text-decoration: underline;
          text-underline-offset: 6px;
          letter-spacing: 4px;
          margin-bottom: 32px;
        }

        .inputGroup {
          margin-bottom: 24px;
        }

        .inputLabel {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #1A2B4A;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .inputWrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #F2F2F2;
          border: 1.5px solid #E0E0E0;
          border-radius: 10px;
          padding: 14px 16px;
        }

        .inputWrapper input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          color: #1A2B4A;
          outline: none;
        }

        .inputWrapper input::placeholder {
          color: #BDBDBD;
        }

        .btnEntrar {
          width: 100%;
          padding: 18px;
          background-color: #F5B800;
          color: #1A2B4A;
          font-family: 'Montserrat', sans-serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s, transform 0.1s;
        }

        .btnEntrar:hover {
          background-color: #e0a800;
        }

        .btnEntrar:active {
          transform: scale(0.98);
        }
      `}</style>

      <div className="screen">

        {/* LOGO */}
        <div className="logoWrapper">
          <Image
            src="/logo.png"
            alt="Logo"
            width={240}
            height={80}
          />
        </div>

        {/* CARD */}
        <div className="card">
          <h1 className="cardTitle">MOTORISTA</h1>

          {/* EMAIL */}
          <div className="inputGroup">
            <label className="inputLabel">E-MAIL</label>
            <div className="inputWrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A2B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                type="email"
                name="email"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* SENHA */}
          <div className="inputGroup">
            <label className="inputLabel">SENHA</label>
            <div className="inputWrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A2B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="password"
                name="password"
                placeholder="sua senha"
              />
            </div>
          </div>

          {/* BOTÃO */}
          <button
            className="btnEntrar"
            onClick={() => router.push('/dashboard')}
          >
            ENTRAR
          </button>
        </div>

      </div>
    </>
  )
}