// ===== RAZZE =====
export type RaceId =
  | 'human'
  | 'elf-high' | 'elf-wood' | 'elf-drow'
  | 'dwarf-hill' | 'dwarf-mountain'
  | 'halfling-lightfoot' | 'halfling-stout'
  | 'half-elf'

export type ClassId =
  | 'barbarian' | 'bard' | 'cleric' | 'druid'
  | 'fighter' | 'monk' | 'paladin' | 'ranger'
  | 'rogue' | 'warlock' | 'wizard'

export type StatKey = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'

export interface StatBonus {
  STR?: number
  DEX?: number
  CON?: number
  INT?: number
  WIS?: number
  CHA?: number
  any2?: number // mezzelfo: +2 a scelta
}

// ===== RAZZA =====
export interface Race {
  id: RaceId
  name: string
  icon: string
  description: string
  traits: string[]
  statBonus: StatBonus
  speed: number
  size: 'Small' | 'Medium'
  enabled: boolean
  imagePromptHints: string
}

// ===== CLASSE =====
export interface CharClass {
  id: ClassId
  name: string
  icon: string
  description: string
  hitDie: number
  mpBase: number
  spellcaster: boolean
  primaryStats: StatKey[]
  savingThrows: StatKey[]
  startingAbilities: string[]
  enabled: boolean
  subclassLevel: number
  imagePromptHints: string
}

// ===== STATISTICHE =====
export type Stats = Record<StatKey, number>

// ===== ASPETTO =====
export interface Appearance {
  sex: 'male' | 'female' | 'androgynous'
  build: 'athletic' | 'muscular' | 'slender' | 'stocky'
  hairStyle: string
  hairColor: string
  eyeColor: string
  skinTone: string
  eyebrows: string
  nose: string
  facialHair: string
  scar: string
}

// ===== PERSONAGGIO =====
export interface Character {
  id: string
  name: string
  race: Race
  charClass: CharClass
  subrace?: string
  stats: Stats
  finalStats: Stats // stats + bonus razza
  level: number
  xp: number
  xpNext: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  ac: number
  appearance: Appearance
  imageUrl?: string
  gold: number
  silver: number
  bronze: number
  fakeCoins: number // Erthia Points pre-TGE
  nftMinted: boolean
  nftAddress?: string
  createdAt: number
  lastLogin: number
  loginStreak: number
  tasksCompleted: string[]
}

// ===== SISTEMA DADI =====
export type DiceSystem = 'pointbuy' | 'dice'

export interface DiceRollResult {
  dice: [number, number, number] // 3d3
  total: number // 21 + somma
  breakdown: string
}

// ===== TASK GIORNALIERI =====
export interface DailyTask {
  id: string
  title: string
  description: string
  reward: number // in fakeCoins
  rewardType: 'bronze' | 'silver' | 'gold' | 'fakeCoins'
  completed: boolean
  action?: () => void
}

// ===== NFT METADATA (TEP-64) =====
export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
}

// ===== APP STATE =====
export type AppScreen =
  | 'splash'
  | 'title'
  | 'create-race'
  | 'create-class'
  | 'create-stats'
  | 'create-appearance'
  | 'create-preview'
  | 'hub'
  | 'hub-abilities'
  | 'hub-spells'
  | 'hub-inventory'
  | 'hub-quests'
  | 'hub-info'
  | 'hub-nft'
