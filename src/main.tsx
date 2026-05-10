import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Inizializza Telegram Web App
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        enableClosingConfirmation: () => void
        setHeaderColor: (color: string) => void
        setBackgroundColor: (color: string) => void
        MainButton: {
          show: () => void
          hide: () => void
          setText: (text: string) => void
          onClick: (fn: () => void) => void
        }
        initDataUnsafe: {
          user?: {
            id: number
            username?: string
            first_name?: string
          }
        }
      }
    }
  }
}

// Setup Telegram WebApp
if (window.Telegram?.WebApp) {
  const twa = window.Telegram.WebApp
  twa.ready()
  twa.expand()
  twa.enableClosingConfirmation()
  twa.setBackgroundColor('#F5F0E0')
  twa.setHeaderColor('#8B6914')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
