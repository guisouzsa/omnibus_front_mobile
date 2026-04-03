'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const tiposNotificacao = [
  'Rota Iniciada',
  'Rota Finalizada',
  'Atraso na Rota',
  'Troca de Veículo',
  'Veículo apresenta mau funcionamento',
]

export default function AcompanharRotaPage() {
  const router = useRouter()
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const [tipoSelecionado, setTipoSelecionado] = useState('')
  const [mensagem, setMensagem] = useState('')
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
          background: #ffffff;
          padding: 20px 20px 5px 20px;
          border-bottom: 2px solid #F5B800;
          display: flex;
          align-items: center;
          height: 75px;
        }

        .content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .backBtn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #1A2B4A;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          width: fit-content;
        }

        .backBtn:hover { opacity: 0.7; }

        .backCircle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: #1A2B4A;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mapContainer {
          width: 100%;
          height: 308px;
          border-radius: 14px;
          background-color: #E0E6F0;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(26,43,74,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mapPlaceholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .mapPlaceholderText {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #8A99B3;
        }

        .rotaTitulo {
          font-size: 20px;
          font-weight: 900;
          color: #1A2B4A;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .rotaTituloSep {
          color: #F5B800;
          margin: 0 6px;
        }

        .notifCard {
          background: #ffffff;
          border-radius: 14px;
          overflow: visible;
          box-shadow: 0 2px 10px rgba(26,43,74,0.07);
        }

        .notifHeader {
          background: linear-gradient(90deg, #F5B800 80%, #ffd04d 100%);
          padding: 12px 16px;
          border-radius: 14px 14px 0 0;
          font-size: 12px;
          font-weight: 900;
          color: #1A2B4A;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-align: center;
        }

        .notifBody {
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .dropdownWrapper { position: relative; }

        .dropdownTrigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 16px;
          background: #F4F6FA;
          border: 1.5px solid #E0E6F0;
          border-radius: 10px;
          cursor: pointer;
          transition: border-color 0.2s;
          font-family: 'Montserrat', sans-serif;
        }

        .dropdownTrigger:hover { border-color: #F5B800; }
        .dropdownTrigger.aberto {
          border-color: #F5B800;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .dropdownTriggerText {
          font-size: 11px;
          font-weight: 700;
          color: #1A2B4A;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .dropdownChevron { transition: transform 0.2s; flex-shrink: 0; }
        .dropdownChevron.aberto { transform: rotate(180deg); }

        .dropdownMenu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1.5px solid #F5B800;
          border-top: none;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          z-index: 10;
          overflow: hidden;
          box-shadow: 0 6px 16px rgba(26,43,74,0.1);
        }

        .dropdownItem {
          padding: 12px 16px;
          font-size: 11px;
          font-weight: 600;
          color: #1A2B4A;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid #F4F6FA;
        }

        .dropdownItem:last-child { border-bottom: none; }
        .dropdownItem:hover { background: #FFFBEF; }
        .dropdownItem.selecionado { background: #FFF3CD; font-weight: 800; }

        .divider {
          height: 1px;
          background: #E8ECF2;
          border: none;
          margin: 0;
        }

        .textareaLabel {
          font-size: 10px;
          font-weight: 700;
          color: #8A99B3;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 6px;
          display: block;
        }

        .outrasTextarea {
          width: 100%;
          border: 1.5px solid #E0E6F0;
          border-radius: 10px;
          padding: 12px 14px;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          color: #1A2B4A;
          background: #F4F6FA;
          outline: none;
          resize: none;
          min-height: 90px;
          transition: border-color 0.2s;
          line-height: 1.6;
        }

        .outrasTextarea:focus { border-color: #F5B800; background: #ffffff; }
        .outrasTextarea::placeholder { color: #BDBDBD; }

        .btnEnviar {
          width: 100%;
          padding: 14px;
          background-color: #F5B800;
          color: #1A2B4A;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          min-height: 46px;
        }

        .btnEnviar:hover { background-color: #e0a800; }
        .btnEnviar:active { transform: scale(0.98); }
        .btnEnviar:disabled { opacity: 0.7; cursor: not-allowed; }
        .btnEnviado { background-color: #28a745 !important; color: #ffffff !important; }
      `}</style>

      <div className="screen">

        <nav className="navbar">
          <Image src="/logo.png" alt="Omnibus" width={113} height={35} />
        </nav>

        <div className="content">

          <button className="backBtn" onClick={() => router.push('/dashboard')}>
            <div className="backCircle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5B800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </div>
            Voltar
          </button>

          {/* MAPA — API será conectada aqui */}
          <div className="mapContainer">
            <div className="mapPlaceholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8A99B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" y1="3" x2="9" y2="18"/>
                <line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
              <span className="mapPlaceholderText">Mapa da Rota</span>
            </div>
          </div>

          {/* routes.start_point + routes.end_point */}
          <p className="rotaTitulo">
            CENTRO <span className="rotaTituloSep">—</span> EP JEOVÁ
          </p>

          <div className="notifCard">
            <div className="notifHeader">Enviar Notificações</div>
            <div className="notifBody">

              <div className="dropdownWrapper">
                <div
                  className={`dropdownTrigger${dropdownAberto ? ' aberto' : ''}`}
                  onClick={() => setDropdownAberto(!dropdownAberto)}
                  role="button"
                  tabIndex={0}
                  aria-label="Selecionar tipo de notificação"
                >
                  <span className="dropdownTriggerText">
                    {tipoSelecionado || 'Selecionar tipo de notificação'}
                  </span>
                  <svg
                    className={`dropdownChevron${dropdownAberto ? ' aberto' : ''}`}
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#1A2B4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>

                {dropdownAberto && (
                  <div className="dropdownMenu">
                    {tiposNotificacao.map((tipo) => (
                      <div
                        key={tipo}
                        className={`dropdownItem${tipoSelecionado === tipo ? ' selecionado' : ''}`}
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

              <hr className="divider" />

              <div>
                <label className="textareaLabel">Outras notificações</label>
                <textarea
                  className="outrasTextarea"
                  placeholder="Ex.: Veículo em manutenção, não haverá transporte..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  aria-label="Mensagem de notificação personalizada"
                />
              </div>

              <button
                className={`btnEnviar${enviado ? ' btnEnviado' : ''}`}
                onClick={handleEnviar}
                disabled={enviando}
              >
                {enviando ? 'Enviando...' : enviado ? '✓ Enviado!' : 'Enviar'}
              </button>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}