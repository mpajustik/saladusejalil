import type { MysteryCase } from '../types/case'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateCase(raw: unknown): ValidationResult {
  const errors: string[] = []

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { valid: false, errors: ['Juhtum peab olema objekt'] }
  }

  const c = raw as Partial<MysteryCase>

  if (!c.id?.trim())          errors.push('id on tühi või puudub')
  if (!c.title?.trim())       errors.push('title on tühi või puudub')
  if (!c.description?.trim()) errors.push('description on tühi või puudub')

  const validDifficulties = ['easy', 'medium', 'hard']
  if (!c.difficulty || !validDifficulties.includes(c.difficulty)) {
    errors.push(`difficulty peab olema: ${validDifficulties.join(' / ')} (on: "${c.difficulty}")`)
  }

  if (!Array.isArray(c.suspects))  errors.push('suspects peab olema massiiv')
  if (!Array.isArray(c.locations)) errors.push('locations peab olema massiiv')
  if (!Array.isArray(c.items))     errors.push('items peab olema massiiv')

  if (Array.isArray(c.suspects) && c.suspects.length < 3)
    errors.push(`suspects: vähemalt 3 elementi (on ${c.suspects.length})`)
  if (Array.isArray(c.locations) && c.locations.length < 3)
    errors.push(`locations: vähemalt 3 elementi (on ${c.locations.length})`)
  if (Array.isArray(c.items) && c.items.length < 3)
    errors.push(`items: vähemalt 3 elementi (on ${c.items.length})`)

  if (typeof c.minPlayers !== 'number') errors.push('minPlayers peab olema arv')
  if (typeof c.maxPlayers !== 'number') errors.push('maxPlayers peab olema arv')
  if (typeof c.minPlayers === 'number' && c.minPlayers < 2)
    errors.push('minPlayers peab olema vähemalt 2')
  if (typeof c.minPlayers === 'number' && typeof c.maxPlayers === 'number' && c.maxPlayers < c.minPlayers)
    errors.push('maxPlayers peab olema >= minPlayers')

  if (!c.rules || typeof c.rules !== 'object')
    errors.push('rules objekt puudub')

  const allCards = [
    ...(Array.isArray(c.suspects)  ? c.suspects  : []),
    ...(Array.isArray(c.locations) ? c.locations : []),
    ...(Array.isArray(c.items)     ? c.items     : []),
  ]

  for (const card of allCards) {
    if (!card || typeof card !== 'object') { errors.push('Kaart ei ole objekt'); continue }
    if (!card.id?.trim())   errors.push(`Kaardil puudub id (name: "${card.name ?? '?'}")`)
    if (!card.name?.trim()) errors.push(`Kaardil puudub name (id: "${card.id ?? '?'}")`)
  }

  for (const [label, cards] of [
    ['suspects',  c.suspects],
    ['locations', c.locations],
    ['items',     c.items],
  ] as [string, Array<{ id: string }> | undefined][]) {
    if (!Array.isArray(cards)) continue
    const ids = cards.map(c => c.id)
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
    if (dupes.length > 0) errors.push(`${label}: korduvad id-d: ${dupes.join(', ')}`)
  }

  const allIds = allCards.map(c => c.id).filter(Boolean)
  const crossDupes = allIds.filter((id, i) => allIds.indexOf(id) !== i)
  if (crossDupes.length > 0)
    errors.push(`Kategooriate vahel korduvad id-d: ${crossDupes.join(', ')}`)

  return { valid: errors.length === 0, errors }
}
