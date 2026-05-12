import type { Race, CharClass, Appearance } from '../types'

const HAIR_COLOR_NAMES: Record<string, string> = {
  '#2C1F0E': 'brown', '#8B4513': 'chestnut', '#C4973A': 'blonde',
  '#F5DEB3': 'platinum', '#E8C97A': 'light blonde', '#D2691E': 'auburn',
  '#1C1C1C': 'black', '#808080': 'grey',
}
const EYE_COLOR_NAMES: Record<string, string> = {
  '#2C4A6E': 'blue', '#2D6A2D': 'green', '#8B6914': 'amber',
  '#4A4A4A': 'grey', '#8B4513': 'brown', '#6B5B8A': 'violet',
  '#1E4D8C': 'blue', '#C4973A': 'golden',
}
const SKIN_TONE_NAMES: Record<string, string> = {
  '#FDEBD0': 'pale', '#F5CBA7': 'fair', '#E59866': 'tan', '#CA6F1E': 'tan',
  '#A04000': 'brown', '#784212': 'dark', '#5D4037': 'dark', '#3E2723': 'very dark',
}
const SEX_NAMES: Record<string, string> = { male: 'male', female: 'female', androgynous: 'androgynous' }

export function buildCharacterPrompt(race: Race, charClass: CharClass, appearance: Appearance): string {
  const sex = SEX_NAMES[appearance.sex] || 'male'
  const hairColor = HAIR_COLOR_NAMES[appearance.hairColor] || 'dark'
  const eyeColor = EYE_COLOR_NAMES[appearance.eyeColor] || 'blue'
  const skinTone = SKIN_TONE_NAMES[appearance.skinTone] || 'fair'

  const raceHints = race.imagePromptHints.replace(/,/g, '')
  const classHints = charClass.imagePromptHints.replace(/,/g, '')

  return [
    'fantasy RPG character portrait',
    'upper body shot full head visible no crop',
    sex,
    skinTone + ' skin',
    hairColor + ' hair',
    eyeColor + ' eyes',
    raceHints,
    classHints,
    'looking at viewer dramatic lighting',
    'classic AD&D fantasy art oil painting detailed professional',
  ].join(' ')
}

export function generateCharacterImageUrl(race: Race, charClass: CharClass, appearance: Appearance): string {
  const prompt = buildCharacterPrompt(race, charClass, appearance)
  const encodedPrompt = encodeURIComponent(prompt)
  const seed = Math.floor(Math.random() * 999999)
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=680&seed=${seed}&nologo=true`
}

export async function generateCharacterImage(race: Race, charClass: CharClass, appearance: Appearance): Promise<string> {
  return generateCharacterImageUrl(race, charClass, appearance)
}
