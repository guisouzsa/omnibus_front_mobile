'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const rotas = [
  { id: 1, horario: '7:10',  inicio: 'CENTRO', ultimaParada: 'EP JEOVÁ' },
  { id: 2, horario: '8:30',  inicio: 'CENTRO', ultimaParada: 'EP JEOVÁ' },
  { id: 3, horario: '10:00', inicio: 'CENTRO', ultimaParada: 'EP JEOVÁ' },
  { id: 4, horario: '13:45', inicio: 'CENTRO', ultimaParada: 'EP JEOVÁ' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  function handleEnviar() {
    setEnviando(true)
    setTimeout(() => {
      setEnviando(false)
      setEnviado(true)
      setTimeout(() => setEnviado(false), 2000)
    }, 1500)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          height: 100%;
          font-family: 'Montserrat', sans-serif;
          background-color: #d0d0d0;
        }

        .screen {
          width: 390px;
          min-height: 844px;
          background-color: #F4F6FA;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .navbar {
          padding: 20px 20px 5px 20px;
          background: #ffffff;
          padding: 5px 20px;
          border-bottom: 2px solid #F5B800;
          display: flex;
          align-items: center;
          height: 60px;
        }

        .welcomeBar {
          background: #ffffff;
          padding: 12px 20px;
          border-bottom: 1px solid #E8ECF2;
        }

        .welcomeLabel {
          font-size: 10px;
          font-weight: 600;
          color: #8A99B3;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .welcomeName {
          font-size: 15px;
          font-weight: 800;
          color: #1A2B4A;
        }

        .content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sectionHeader {
          background: linear-gradient(90deg, #F5B800 80%, #ffd04d 100%);
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 900;
          color: #1A2B4A;
          letter-spacing: 2px;
          text-transform: uppercase;
          box-shadow: 0 2px 8px rgba(245,184,0,0.2);
        }

        .rotaCard {
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(26,43,74,0.07);
          display: flex;
          align-items: stretch;
          min-height: 80px;
          transition: box-shadow 0.2s;
        }

        .rotaCard:hover {
          box-shadow: 0 4px 14px rgba(26,43,74,0.13);
        }

        .rotaStripe {
          width: 5px;
          background-color: #1A2B4A;
          flex-shrink: 0;
        }

        .rotaBody {
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .rotaTop {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .rotaHorario {
          background-color: #1A2B4A;
          color: #F5B800;
          font-size: 13px;
          font-weight: 900;
          padding: 3px 8px;
          border-radius: 5px;
          letter-spacing: 1px;
          min-width: 46px;
          text-align: center;
        }

        .rotaInicio {
          font-size: 11px;
          font-weight: 800;
          color: #1A2B4A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rotaInicio span { color: #F5B800; }

        .rotaParada {
          font-size: 10px;
          font-weight: 700;
          color: #5A6A85;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rotaBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          background: transparent;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .rotaBtn:hover { background: #f0f4fa; }

        .gastosForm {
          background: #ffffff;
          border-radius: 10px;
          padding: 12px;
          box-shadow: 0 2px 8px rgba(26,43,74,0.07);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .uploadBox {
          border: 2px dashed #C8D0DC;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 14px 10px;
          gap: 6px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
        }

        .uploadBox:hover {
          border-color: #F5B800;
          background: #FFFBEF;
        }

        .uploadLabel {
          font-size: 9px;
          font-weight: 700;
          color: #1A2B4A;
          text-align: center;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .fieldsRow {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .fieldGroup {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .fieldLabel {
          font-size: 9px;
          font-weight: 700;
          color: #1A2B4A;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .fieldInput {
          width: 100%;
          border: 1.5px solid #E0E6F0;
          border-radius: 6px;
          padding: 6px 8px;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          color: #1A2B4A;
          outline: none;
          background: #F4F6FA;
          transition: border-color 0.2s;
          min-height: 34px;
        }

        .fieldInput:focus {
          border-color: #F5B800;
          background: #ffffff;
        }

        .btnEnviar {
          width: 100%;
          padding: 9px;
          background-color: #F5B800;
          color: #1A2B4A;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          min-height: 34px;
        }

        .btnEnviar:hover { background-color: #e0a800; }
        .btnEnviar:active { transform: scale(0.97); }
        .btnEnviar:disabled { opacity: 0.7; cursor: not-allowed; }
        .btnEnviado { background-color: #28a745 !important; color: #ffffff !important; }
      `}</style>

      <div className="screen">

        <nav className="navbar">
          <Image src="/logo.png" alt="Omnibus" width={113} height={35} />
        </nav>

        <div className="welcomeBar">
          <p className="welcomeLabel">Bem-vindo de volta</p>
          {/* drivers.name */}
          <p className="welcomeName">José Bonifácio</p>
        </div>

        <div className="content">

          <section className="section">
            <div className="sectionHeader">Rotas Previstas</div>
            {rotas.map((rota) => (
              <div key={rota.id} className="rotaCard">
                <div className="rotaStripe" />
                <div className="rotaBody">
                  <div className="rotaTop">
                    <span className="rotaHorario">{rota.horario}</span>
                    <span className="rotaInicio"><span>INÍCIO: </span>{rota.inicio}</span>
                  </div>
                  <span className="rotaParada">Última parada: {rota.ultimaParada}</span>
                </div>
                <button
                  className="rotaBtn"
                  onClick={() => router.push(`/acompanharRota/${rota.id}`)}
                  aria-label={`Ver detalhes da rota das ${rota.horario}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A2B4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
            ))}
          </section>

          <section className="section">
            <div className="sectionHeader">Cadastrar Gastos</div>
            <div className="gastosForm">

              <div className="uploadBox" role="button" tabIndex={0} aria-label="Inserir comprovantes">
                <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="#1A2B4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span className="uploadLabel">Inserir Comprovantes</span>
              </div>

              <div className="fieldsRow">
                <div className="fieldGroup">
                  <label className="fieldLabel" htmlFor="valor">Valor</label>
                  <input id="valor" className="fieldInput" type="number" name="value" placeholder="R$ 0,00" />
                </div>
                <div className="fieldGroup">
                  <label className="fieldLabel" htmlFor="placa">Placa do Ônibus</label>
                  <input id="placa" className="fieldInput" type="text" name="plate" placeholder="ABC-1234" maxLength={8} />
                </div>
              </div>

              <button
                className={`btnEnviar${enviado ? ' btnEnviado' : ''}`}
                onClick={handleEnviar}
                disabled={enviando}
              >
                {enviando ? 'Enviando...' : enviado ? '✓ Enviado!' : 'Enviar'}
              </button>

            </div>
          </section>

        </div>
      </div>
    </>
  )
}