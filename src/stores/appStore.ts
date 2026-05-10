import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Character, AppScreen, Stats, Appearance,
  DiceRollResult, DailyTask
} from '../types'
import type { Race, CharClass } from '../types'
import {
  computeFinalStats, computeMaxHp, computeMaxMp,
  computeAC, defaultStats, generateId, getXpForNextLevel,
  rollDiceSystem, distributePointsFromDice,
} from '../utils/game'

// ===== CREATION STATE =====
interface CreationState {
  race: Race | null
  charClass: CharClass | null
  name: string
  stats: Stats
  diceSystem: 'pointbuy' | 'dice'
  diceResult: DiceRollResult | null
  appearance: Appearance
}

const defaultAppearance = (): Appearance => ({
  sex: 'male',
  build: 'athletic',
  hairStyle: 'short',
  hairColor: '#2C1F0E',
  eyeColor: '#2C4A6E',
  skinTone: '#FDEBD0',
  eyebrows: 'regular',
  nose: 'straight',
  facialHair: 'none',
  scar: 'none',
})

// ===== DAILY TASKS =====
const DEFAULT_TASKS: DailyTask[] = [
  {
    id: 'daily-login',
    title: 'Accesso giornaliero',
    description: 'Apri Erthia ogni giorno',
    reward: 10,
    rewardType: 'fakeCoins',
    completed: false,
  },
  {
    id: 'view-sheet',
    title: 'Consulta la scheda',
    description: 'Visualizza la scheda del tuo personaggio',
    reward: 5,
    rewardType: 'fakeCoins',
    completed: false,
  },
  {
    id: 'share-char',
    title: 'Condividi il personaggio',
    description: 'Condividi Erthia con un amico',
    reward: 25,
    rewardType: 'fakeCoins',
    completed: false,
  },
  {
    id: 'lore-quiz',
    title: 'Lore di Erthia',
    description: 'Impara qualcosa sul mondo',
    reward: 15,
    rewardType: 'fakeCoins',
    completed: false,
  },
]

// ===== APP STORE =====
interface AppStore {
  // Navigation
  screen: AppScreen
  setScreen: (screen: AppScreen) => void

  // Character
  character: Character | null

  // Creation flow
  creation: CreationState
  setRace: (race: Race) => void
  setClass: (charClass: CharClass) => void
  setName: (name: string) => void
  setStat: (key: keyof Stats, value: number) => void
  setDiceSystem: (system: 'pointbuy' | 'dice') => void
  rollDice: () => void
  setAppearance: (updates: Partial<Appearance>) => void
  confirmCreation: () => void
  resetCreation: () => void

  // Daily tasks
  tasks: DailyTask[]
  completeTask: (taskId: string) => void
  resetDailyTasks: () => void

  // Image generation
  imageUrl: string | null
  imageLoading: boolean
  setImageUrl: (url: string | null) => void
  setImageLoading: (loading: boolean) => void

  // TON wallet
  walletAddress: string | null
  setWalletAddress: (address: string | null) => void

  // NFT
  mintNFT: () => void

  // Telegram
  telegramUser: { id: number; username?: string; firstName?: string } | null
  setTelegramUser: (user: AppStore['telegramUser']) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Navigation
      screen: 'splash',
      setScreen: (screen) => set({ screen }),

      // Character
      character: null,

      // Creation
      creation: {
        race: null,
        charClass: null,
        name: '',
        stats: defaultStats(),
        diceSystem: 'pointbuy',
        diceResult: null,
        appearance: defaultAppearance(),
      },

      setRace: (race) => set(s => ({
        creation: { ...s.creation, race }
      })),

      setClass: (charClass) => set(s => ({
        creation: { ...s.creation, charClass }
      })),

      setName: (name) => set(s => ({
        creation: { ...s.creation, name }
      })),

      setStat: (key, value) => set(s => ({
        creation: {
          ...s.creation,
          stats: { ...s.creation.stats, [key]: value }
        }
      })),

      setDiceSystem: (diceSystem) => set(s => ({
        creation: { ...s.creation, diceSystem }
      })),

      rollDice: () => {
        const result = rollDiceSystem()
        const stats = distributePointsFromDice(result.total)
        set(s => ({
          creation: {
            ...s.creation,
            diceResult: result,
            stats,
          }
        }))
      },

      setAppearance: (updates) => set(s => ({
        creation: {
          ...s.creation,
          appearance: { ...s.creation.appearance, ...updates }
        }
      })),

      confirmCreation: () => {
        const { creation } = get()
        if (!creation.race || !creation.charClass) return

        const finalStats = computeFinalStats(creation.stats, creation.race)
        const maxHp = computeMaxHp(creation.charClass, finalStats)
        const maxMp = computeMaxMp(creation.charClass, finalStats)
        const ac = computeAC(finalStats)

        const character: Character = {
          id: generateId(),
          name: creation.name || 'Avventuriero',
          race: creation.race,
          charClass: creation.charClass,
          stats: creation.stats,
          finalStats,
          level: 1,
          xp: 0,
          xpNext: getXpForNextLevel(1),
          hp: maxHp,
          maxHp,
          mp: maxMp,
          maxMp,
          ac,
          appearance: creation.appearance,
          imageUrl: get().imageUrl ?? undefined,
          gold: 0,
          silver: 0,
          bronze: 0,
          fakeCoins: 0,
          nftMinted: false,
          createdAt: Date.now(),
          lastLogin: Date.now(),
          loginStreak: 1,
          tasksCompleted: [],
        }

        set({ character, screen: 'hub' })
      },

      resetCreation: () => set({
        creation: {
          race: null,
          charClass: null,
          name: '',
          stats: defaultStats(),
          diceSystem: 'pointbuy',
          diceResult: null,
          appearance: defaultAppearance(),
        },
        imageUrl: null,
      }),

      // Tasks
      tasks: DEFAULT_TASKS,

      completeTask: (taskId) => {
        const { tasks, character } = get()
        const task = tasks.find(t => t.id === taskId)
        if (!task || task.completed) return

        const updatedTasks = tasks.map(t =>
          t.id === taskId ? { ...t, completed: true } : t
        )

        const updatedChar = character ? {
          ...character,
          fakeCoins: character.fakeCoins + task.reward,
          tasksCompleted: [...character.tasksCompleted, taskId],
        } : character

        set({ tasks: updatedTasks, character: updatedChar })
      },

      resetDailyTasks: () => set({
        tasks: DEFAULT_TASKS.map(t => ({ ...t, completed: false }))
      }),

      // Image
      imageUrl: null,
      imageLoading: false,
      setImageUrl: (imageUrl) => set({ imageUrl }),
      setImageLoading: (imageLoading) => set({ imageLoading }),

      // Wallet
      walletAddress: null,
      setWalletAddress: (walletAddress) => set({ walletAddress }),

      // NFT
      mintNFT: () => {
        const { character } = get()
        if (!character) return
        // TODO: integrazione TON Connect e smart contract
        set({
          character: {
            ...character,
            nftMinted: true,
            nftAddress: `EQ${generateId()}`,
          }
        })
      },

      // Telegram
      telegramUser: null,
      setTelegramUser: (telegramUser) => set({ telegramUser }),
    }),
    {
      name: 'erthia-state',
      partialize: (state) => ({
        character: state.character,
        tasks: state.tasks,
        walletAddress: state.walletAddress,
        telegramUser: state.telegramUser,
      }),
    }
  )
)
