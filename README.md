# Erthia — Telegram Mini App

MMORPG decentralizzato su TON blockchain, distribuito come Telegram Mini App.

## Stack Tecnologico

- **React 18** + TypeScript + Vite
- **Zustand** per state management
- **Framer Motion** per animazioni
- **@telegram-apps/sdk-react** per integrazione Telegram
- **@tonconnect/ui-react** per wallet TON
- **@ton/ton** per interazione blockchain

## Prerequisiti

- Node.js 18+
- npm o yarn
- Account Telegram
- Bot creato su @BotFather

## Setup Sviluppo

### 1. Installa dipendenze
```bash
npm install
```

### 2. Variabili d'ambiente
Crea un file `.env.local`:
```env
VITE_BOT_TOKEN=il_tuo_token_botfather
VITE_API_URL=http://localhost:3001
VITE_TON_NETWORK=testnet
VITE_TONCONNECT_MANIFEST=https://il-tuo-dominio.com/tonconnect-manifest.json
```

### 3. Avvia in sviluppo
```bash
npm run dev
```

### 4. Tunnel HTTPS con ngrok (necessario per Telegram)
```bash
# Installa ngrok: https://ngrok.com
ngrok http 5173
```
Copia l'URL HTTPS e impostalo come URL della Mini App su @BotFather.

## Setup Telegram Bot

### 1. Crea il bot
1. Apri @BotFather su Telegram
2. `/newbot` → scegli nome e username
3. Copia il token API

### 2. Configura la Mini App
1. `/newapp` su @BotFather
2. Seleziona il tuo bot
3. Inserisci l'URL ngrok come URL della app
4. Configura titolo e descrizione

### 3. Testa
Apri il bot su Telegram → click sul pulsante della Mini App.

## Build per Produzione

```bash
npm run build
```

Il build viene generato in `/dist`. Deve essere servito su HTTPS.

### Deploy consigliato (gratuito per sviluppo)
- **Vercel**: `vercel --prod`
- **Netlify**: drag & drop della cartella `/dist`
- **GitHub Pages**: con GitHub Actions

## Struttura del Progetto

```
src/
├── components/        # Componenti riutilizzabili
│   ├── Toast.tsx      # Sistema notifiche
│   └── StepHeader.tsx # Header con progress bar
├── data/              # Dati statici SRD
│   ├── races.ts       # 9 razze SRD 5e
│   └── classes.ts     # 11 classi SRD 5e
├── pages/             # Schermate
│   ├── SplashScreen.tsx
│   ├── TitleScreen.tsx
│   ├── HubScreen.tsx
│   └── create/        # Flusso creazione personaggio
│       ├── CreateRaceScreen.tsx
│       ├── CreateClassScreen.tsx
│       ├── CreateStatsScreen.tsx
│       ├── CreateAppearanceScreen.tsx
│       └── CreatePreviewScreen.tsx
├── stores/
│   └── appStore.ts    # Zustand store globale
├── utils/
│   └── game.ts        # Logica SRD (statistiche, dadi, HP, XP)
├── types.ts           # TypeScript types
├── App.tsx            # Router principale
├── main.tsx           # Entry point
└── index.css          # CSS globale (palette Erthia)
```

## Funzionalità Implementate (Fase 1)

- [x] Splash screen
- [x] Title screen
- [x] Character creator — selezione razza (9 opzioni SRD)
- [x] Character creator — selezione classe (11 opzioni SRD)
- [x] Character creator — statistiche point-buy (SRD 5e, 27 punti)
- [x] Character creator — sistema a dadi (21+3d3, d6 speciali 1-2-3-1-2-3)
- [x] Character creator — personalizzazione estetica completa
- [x] Character creator — anteprima e mint NFT (simulato)
- [x] Hub scheda personaggio con tutte le stat
- [x] Barre HP/MP/XP
- [x] Quest giornaliere con mining fake coin
- [x] Persistenza locale (localStorage via Zustand persist)
- [x] Palette Erthia (mappa cartografica medievale)
- [x] Animazioni con Framer Motion
- [x] Supporto safe area Telegram (iOS/Android)

## TODO (Fase 1 completamento)

- [ ] Integrazione TON Connect wallet reale
- [ ] Smart contract NFT su testnet TON
- [ ] Generazione immagine AI via fal.ai API
- [ ] Validazione Telegram initData lato server
- [ ] Backend API (Fastify + PostgreSQL)
- [ ] Sistema referral
- [ ] Condivisione personaggio su Telegram

## Licenza Regole di Gioco

This work includes material from the System Reference Document 5.2.1 ("SRD 5.2.1")
by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd
Licensed under Creative Commons Attribution 4.0 International License.
