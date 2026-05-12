import type { Race, CharClass, Appearance } from '../types'

const HAIR_COLOR_NAMES: Record<string, string> = {
  '#2C1F0E': 'dark brown', '#8B4513': 'chestnut brown', '#C4973A': 'golden blonde',
  '#F5DEB3': 'platinum blonde', '#E8C97A': 'light blonde', '#D2691E': 'auburn',
  '#1C1C1C': 'black', '#808080': 'silver grey',
}
const EYE_COLOR_NAMES: Record<string, string> = {
  '#2C4A6E': 'deep blue', '#2D6A2D': 'forest green', '#8B6914': 'amber',
  '#4A4A4A': 'dark grey', '#8B4513': 'brown', '#6B5B8A': 'violet',
  '#1E4D8C': 'sapphire blue', '#C4973A': 'golden',
}
const SKIN_TONE_NAMES: Record<string, string> = {
  '#FDEBD0': 'pale', '#F5CBA7': 'fair', '#E59866': 'light tan', '#CA6F1E': 'tan',
  '#A04000': 'brown', '#784212': 'dark brown', '#5D4037': 'deep brown', '#3E2723': 'very dark',
}
const BUILD_NAMES: Record<string, string> = {
  athletic: 'athletic', muscular: 'muscular and powerful', slender: 'slender and lithe', stocky: 'stocky and sturdy',
}
const SEX_NAMES: Record<string, string> = { male: 'male', female: 'female', androgynous: 'androgynous' }
const FACIAL_HAIR_NAMES: Record<string, string> = {
  none: '', stubble: 'with short stubble', beard: 'with a full beard',
  mustache: 'with a mustache', sideburns: 'with sideburns',
}
const SCAR_NAMES: Record<string, string> = {
  none: '', face: 'with a scar on the face', chin: 'with a scar on the chin',
  eye: 'with a scar across the eye', multiple: 'with multiple battle scars',
}
const HAIR_STYLE_NAMES: Record<string, string> = {
  short: 'short', medium: 'medium-length', long: 'long flowing', shaved: 'shaved', tied: 'tied back',
}

export function buildCharacterPrompt(race: Race, charClass: CharClass, appearance: Appearance): string {
  const sex = SEX_NAMES[appearance.sex] || 'male'
  const build = BUILD_NAMES[appearance.build] || 'athletic'
  const hairColor = HAIR_COLOR_NAMES[appearance.hairColor] || 'dark'
  const hairStyle = HAIR_STYLE_NAMES[appearance.hairStyle] || 'short'
  const eyeColor = EYE_COLOR_NAMES[appearance.eyeColor] || 'blue'
  const skinTone = SKIN_TONE_NAMES[appearance.skinTone] || 'fair'
  const facialHair = FACIAL_HAIR_NAMES[appearance.facialHair] || ''
  const scar = SCAR_NAMES[appearance.scar] || ''

  const physicalDesc = [`${skinTone} skin`, `${hairStyle} ${hairColor} hair`, `${eyeColor} eyes`, facialHair, scar]
    .filter(Boolean).join(', ')

  return [
    `fantasy RPG character portrait, ${sex} ${race.name.toLowerCase()}, ${build} build,`,
    physicalDesc + ',',
    `${charClass.imagePromptHints},`,
    race.imagePromptHints + ',',
    'dramatic fantasy illustration, classic AD&D art style,',
    'oil painting, rich colors, medieval fantasy, half-body portrait,',
    'dramatic lighting, highly detailed, professional illustration',
  ].join(' ')
}

export function generateCharacterImageUrl(race: Race, charClass: CharClass, appearance: Appearance): string {
  const prompt = buildCharacterPrompt(race, charClass, appearance)
  const encodedPrompt = encodeURIComponent(prompt)
  const seed = Math.floor(Math.random() * 999999)
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=680&seed=${seed}&model=flux&nologo=true`
}

// Alias per compatibilità — restituisce l'URL direttamente senza fetch
export async function generateCharacterImage(race: Race, charClass: CharClass, appearance: Appearance): Promise<string> {
  return generateCharacterImageUrl(race, charClass, appearance)
}
