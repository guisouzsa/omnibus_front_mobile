'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          height: 100%;
          font-family: 'Montserrat', sans-serif;
          background: #e8e8e8;
        }

        .screen {
          width: 100%;
          max-width: 390px;
          min-height: 100vh;
          background: linear-gradient(135deg, #F4F6FA 0%, #F0F4FA 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          padding: 20px;
        }

        .loadingContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e0e0e0;
          border-top-color: #F5B800;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loadingText {
          font-size: 14px;
          color: #1A2B4A;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .logo {
          margin-bottom: 20px;
        }
      `}</style>

      <div className="screen">
        <div className="loadingContainer">
          <div className="logo">
            <Image src="/logo.png" alt="Omnibus" width={100} height={32} />
          </div>
          <div className="spinner"></div>
          <p className="loadingText">Carregando aplicação...</p>
        </div>
      </div>
    </>
  )
}
