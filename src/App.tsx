import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from './stores/appStore'

// Screens
import SplashScreen from './pages/SplashScreen'
import TitleScreen from './pages/TitleScreen'
import CreateRaceScreen from './pages/create/CreateRaceScreen'
import CreateClassScreen from './pages/create/CreateClassScreen'
import CreateStatsScreen from './pages/create/CreateStatsScreen'
import CreateAppearanceScreen from './pages/create/CreateAppearanceScreen'
import CreatePreviewScreen from './pages/create/CreatePreviewScreen'
import HubScreen from './pages/HubScreen'
import Toast from './components/Toast'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
}

const pageTransition = { duration: 0.25, ease: 'easeOut' }

export default function App() {
  const { screen, setScreen, setTelegramUser, character, tasks, completeTask } = useAppStore()

  useEffect(() => {
    // Leggi utente Telegram
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
    if (tgUser) {
      setTelegramUser({
        id: tgUser.id,
        username: tgUser.username,
        firstName: tgUser.first_name,
      })
    }

    // Splash → Title dopo 2s
    const timer = setTimeout(() => {
      if (character) {
        setScreen('hub')
        // Auto-completa task login giornaliero
        const loginTask = tasks.find(t => t.id === 'daily-login' && !t.completed)
        if (loginTask) completeTask('daily-login')
      } else {
        setScreen('title')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const renderScreen = () => {
    switch (screen) {
      case 'splash':          return <SplashScreen />
      case 'title':           return <TitleScreen />
      case 'create-race':     return <CreateRaceScreen />
      case 'create-class':    return <CreateClassScreen />
      case 'create-stats':    return <CreateStatsScreen />
      case 'create-appearance': return <CreateAppearanceScreen />
      case 'create-preview':  return <CreatePreviewScreen />
      case 'hub':
      case 'hub-abilities':
      case 'hub-spells':
      case 'hub-inventory':
      case 'hub-quests':
      case 'hub-info':
      case 'hub-nft':
        return <HubScreen />
      default:
        return <TitleScreen />
    }
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      <Toast />
    </div>
  )
}
