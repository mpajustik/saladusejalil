import type { MysteryCase } from '../types/case'
import { validateCase } from '../logic/validateCase'
import rawCase from '../cases/kadunud-leiutis.json'

const result = validateCase(rawCase as MysteryCase)
if (!result.valid) {
  throw new Error(`Juhtum "kadunud-leiutis" on vigane:\n${result.errors.join('\n')}`)
}

export const sampleCase: MysteryCase = rawCase as MysteryCase
