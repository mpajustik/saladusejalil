import type { GridNotes } from '../types/game'

function key(gameId: string, playerId: string) {
  return `sj_notes_${gameId}_${playerId}`
}

export function loadLobbyNotes(gameId: string, playerId: string): GridNotes {
  try {
    const raw = localStorage.getItem(key(gameId, playerId))
    if (!raw) return {}
    return JSON.parse(raw) as GridNotes
  } catch {
    return {}
  }
}

export function saveLobbyNote(gameId: string, playerId: string, notes: GridNotes): void {
  localStorage.setItem(key(gameId, playerId), JSON.stringify(notes))
}
