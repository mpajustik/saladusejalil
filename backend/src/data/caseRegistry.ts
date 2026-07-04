import type { MysteryCase } from '../types/case.js'
import { validateCase } from '../logic/validateCase.js'
import rawKadunud from '../cases/kadunud-leiutis.json'
import rawMuuseum from '../cases/muuseumi-vargus.json'

function load(raw: unknown, filename: string): MysteryCase {
  const result = validateCase(raw)
  if (!result.valid) {
    const msg = result.errors.join('\n  ')
    throw new Error(`Juhtum "${filename}" on vigane:\n  ${msg}`)
  }
  return raw as MysteryCase
}

export const caseRegistry: MysteryCase[] = [
  load(rawKadunud, 'kadunud-leiutis.json'),
  load(rawMuuseum, 'muuseumi-vargus.json'),
]

export function getCaseById(id: string): MysteryCase | undefined {
  return caseRegistry.find(c => c.id === id)
}
