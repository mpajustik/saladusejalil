import type { MysteryCase } from '../types/case'
import { caseRegistry } from '../data/caseRegistry'

const STORAGE_KEY = 'sj_custom_cases'

export function loadCustomCases(): MysteryCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as MysteryCase[]
  } catch {
    return []
  }
}

export function saveCustomCase(c: MysteryCase): void {
  const existing = loadCustomCases()
  const updated = existing.some(e => e.id === c.id)
    ? existing.map(e => e.id === c.id ? c : e)
    : [...existing, c]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function deleteCustomCase(id: string): void {
  const updated = loadCustomCases().filter(c => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

// Kõik juhtumid: sisseehitatud + kohandatud
export function getAllCases(): MysteryCase[] {
  const builtinIds = new Set(caseRegistry.map(c => c.id))
  const custom = loadCustomCases().filter(c => !builtinIds.has(c.id))
  return [...caseRegistry, ...custom]
}
