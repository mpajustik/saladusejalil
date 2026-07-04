export type CardCategory = 'suspect' | 'location' | 'item'

export interface Card {
  id: string
  name: string
  category: CardCategory
}

export type NoteStatus = 'unknown' | 'possible' | 'eliminated'

export interface BackendPlayer {
  id: string
  name: string
  isHost: boolean
  hand: Card[]
  notes: Record<string, NoteStatus>  // cardId -> status
}

export interface BackendSolution {
  suspect: Card
  location: Card
  item: Card
}

export interface PendingSuggestion {
  askerId: string
  suspectId: string
  locationId: string
  itemId: string
  refuterId: string | null
}

export interface BackendGame {
  gameId: string
  roomCode: string
  caseId: string
  status: 'waiting' | 'in_progress' | 'finished'
  players: BackendPlayer[]
  currentPlayerIndex: number
  lastAction: string | null
  solution: BackendSolution | null
  pendingSuggestion: PendingSuggestion | null
  eliminatedPlayers: string[]
  winner: string | null
  createdAt: number
}

// Ainult avalik info — ei sisalda kaarte ega lahendust
export interface PublicGameState {
  gameId: string
  roomCode: string
  caseId: string
  status: BackendGame['status']
  players: Array<{ id: string; name: string; isHost: boolean }>
  currentPlayerId: string | null
  lastAction: string | null
}

// Ühe mängija privaatne seis
export interface PrivatePlayerState {
  playerId: string
  name: string
  hand: Card[]
  notes: Record<string, NoteStatus>
}
