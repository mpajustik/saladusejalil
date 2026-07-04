export interface Card {
  id: string
  name: string
  description: string
}

// Case on MysteryCase alias — säilitab tagasiühilduvuse
export type { MysteryCase as Case } from './case'

export interface Solution {
  suspect: Card
  location: Card
  item: Card
}

export interface Player {
  id: string
  name: string
  hand: Card[]
}

export interface HistoryEntry {
  playerName: string
  suspect: string
  location: string
  item: string
  result: string
}

// Ühe lahtri väärtus märkmiku tabelis
export type CellValue = '' | 'has' | 'no' | 'probably-no' | 'maybe'

// Ühe mängija märkmik: cardId -> targetPlayerId -> CellValue
export type GridNotes = Record<string, Record<string, CellValue>>

// Kõigi mängijate märkmikud: myPlayerId -> GridNotes
export type AllGridNotes = Record<string, GridNotes>

// Vanas formaadis tüübid (tagasiühilduvuseks)
export type NoteStatus = 'unknown' | 'possible' | 'eliminated'
export type Notes = Record<string, Record<string, NoteStatus>>

export interface GameState {
  status: 'idle' | 'playing' | 'finished'
  phase: 'choosing-room' | 'waiting' | 'revealing' | 'card-shown'
  winner: string | null
  solution: Solution | null
  players: Player[]
  activePlayerIndex: number
  activeRoom: string | null          // ruum mida aktiivne mängija külastad
  eliminatedPlayers: string[]        // mängijad kes tegid vale süüdistuse
  history: HistoryEntry[]
  notes: AllGridNotes
  pending: {
    suspectId: string
    locationId: string
    itemId: string
    suspectName: string
    locationName: string
    itemName: string
  } | null
  refuterIndex: number | null
  refuterOptions: Card[]
  shownCard: Card | null
}
