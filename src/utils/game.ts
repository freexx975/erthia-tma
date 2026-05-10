import type { Stats, StatKey, DiceRollResult, Character } from '../types'
import type { Race } from '../types'
import type { CharClass } from '../types'

// ===== MODIFICATORI =====
export const getModifier = (score: number): number => Math.floor((score - 10) / 2)
export const getModifierStr = (score: number): string => {
  const m = getModifier(score)
  return m >= 0 ? `+${m}` : `${m}`
}

// ===== POINT BUY =====
export const POINT_BUY_TOTAL = 27
export const STAT_MIN = 8
export const STAT_MAX = 15 // pre-bonus razza

export const pointCost = (value: number): number => {
  if (value <= 13) return 1
  return 2
}

export const totalPointsSpent = (stats: Stats): number => {
  return (Object.keys(stats) as StatKey[]).reduce((total, key) => {
    const base = STAT_MIN
    const val = stats[key]
    let cost = 0
    for (let i = base + 1; i <= val; i++) cost += pointCost(i)
    return total + cost
  }, 0)
}

export const pointsRemaining = (stats: Stats): number =>
  POINT_BUY_TOTAL - totalPointsSpent(stats)

export const canIncrease = (stats: Stats, key: StatKey): boolean => {
  const current = stats[key]
  if (current >= STAT_MAX) return false
  const cost = pointCost(current + 1)
  return pointsRemaining(stats) >= cost
}

export const canDecrease = (stats: Stats, key: StatKey): boolean =>
  stats[key] > STAT_MIN

// ===== SISTEMA DADI 21+3d3 =====
// d3 implementato come d6 con valori 1-2-3-1-2-3
export const rollD3 = (): number => {
  const roll = Math.floor(Math.random() * 6) + 1
  if (roll <= 2) return 1
  if (roll <= 4) return 2
  return 3
}

export const rollDiceSystem = (): DiceRollResult => {
  const d1 = rollD3()
  const d2 = rollD3()
  const d3 = rollD3()
  const sum = d1 + d2 + d3
  const total = 21 + sum
  return {
    dice: [d1, d2, d3],
    total,
    breakdown: `21 + ${d1} + ${d2} + ${d3} = ${total}`,
  }
}

// ===== STATS FINALI (base + bonus razza) =====
export const computeFinalStats = (base: Stats, race: Race): Stats => {
  const result = { ...base }
  const bonus = race.statBonus;
  (Object.keys(bonus) as (keyof typeof bonus)[]).forEach(key => {
    if (key !== 'any2' && key in result) {
      (result as any)[key] += bonus[key] ?? 0
    }
  })
  return result
}

// ===== HP E MP =====
export const computeMaxHp = (charClass: CharClass, finalStats: Stats): number => {
  const conMod = getModifier(finalStats.CON)
  return Math.max(1, charClass.hitDie + conMod)
}

export const computeMaxMp = (charClass: CharClass, finalStats: Stats): number => {
  if (!charClass.spellcaster) return charClass.mpBase
  const intMod = getModifier(finalStats.INT)
  return Math.max(0, charClass.mpBase + intMod)
}

export const computeAC = (finalStats: Stats): number =>
  10 + getModifier(finalStats.DEX)

// ===== XP =====
export const XP_TABLE: Record<number, number> = {
  1: 300, 2: 600, 3: 1800, 4: 3800, 5: 7500,
  6: 9000, 7: 11000, 8: 14000, 9: 16000, 10: 21000,
  11: 15000, 12: 20000, 13: 20000, 14: 20000, 15: 25000,
  16: 25000, 17: 30000, 18: 30000, 19: 35000, 20: 0,
}

export const getXpForNextLevel = (level: number): number =>
  XP_TABLE[level] ?? 0

// ===== STAT LABELS =====
export const STAT_LABELS: Record<StatKey, string> = {
  STR: 'Forza',
  DEX: 'Destrezza',
  CON: 'Costituzione',
  INT: 'Intelligenza',
  WIS: 'Saggezza',
  CHA: 'Carisma',
}

export const STAT_KEYS: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']

// ===== DEFAULT STATS =====
export const defaultStats = (): Stats => ({
  STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8,
})

// ===== DISTRIBUISCI PUNTI DADI =====
// Dato un totale di punti dal sistema dadi, distribuisce equamente
export const distributePointsFromDice = (total: number): Stats => {
  const stats = defaultStats()
  let remaining = total - 48 // 48 = 8*6 (base minima)
  const keys = STAT_KEYS
  let i = 0
  while (remaining > 0) {
    const key = keys[i % 6]
    if (stats[key] < 15) {
      stats[key]++
      remaining--
    }
    i++
  }
  return stats
}

// ===== RARITÀ NFT =====
export type NFTRarity = 'standard' | 'uncommon' | 'rare' | 'epic'

export const getNFTRarity = (totalPoints: number): NFTRarity => {
  if (totalPoints <= 26) return 'standard'
  if (totalPoints === 27) return 'uncommon'
  if (totalPoints <= 29) return 'rare'
  return 'epic'
}

export const RARITY_LABELS: Record<NFTRarity, string> = {
  standard: 'Standard',
  uncommon: 'Non comune',
  rare: 'Raro',
  epic: 'Epico',
}

export const RARITY_COLORS: Record<NFTRarity, string> = {
  standard: '#8B8B6E',
  uncommon: '#3B6D11',
  rare: '#185FA5',
  epic: '#7B2D8B',
}

// ===== GENERA ID UNIVOCO =====
export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
