const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!data.ok) {
    throw new Error(data.error?.message ?? 'Serveri viga')
  }
  return data
}

export interface PublicPlayer {
  id: string
  name: string
  isHost: boolean
}

export interface PublicGameState {
  gameId: string
  roomCode: string
  caseId: string
  status: 'waiting' | 'in_progress' | 'finished'
  players: PublicPlayer[]
  currentPlayerId: string | null
  lastAction: string | null
}

export interface CaseSummary {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  minPlayers: number
  maxPlayers: number
  cardCount: { suspects: number; locations: number; items: number }
}

export async function getCases(): Promise<CaseSummary[]> {
  const data = await apiFetch<{ ok: true; cases: CaseSummary[] }>('/api/cases')
  return data.cases
}

export async function createGame(hostName: string, caseId: string) {
  const data = await apiFetch<{ ok: true; gameId: string; roomCode: string; playerId: string }>(
    '/api/games',
    { method: 'POST', body: JSON.stringify({ caseId, hostName }) },
  )
  return { gameId: data.gameId, roomCode: data.roomCode, playerId: data.playerId }
}

export async function joinGame(roomCode: string, playerName: string) {
  const data = await apiFetch<{ ok: true; gameId: string; playerId: string; roomCode: string }>(
    `/api/games/${roomCode.toUpperCase()}/join`,
    { method: 'POST', body: JSON.stringify({ playerName }) },
  )
  return { gameId: data.gameId, playerId: data.playerId, roomCode: data.roomCode }
}

export async function getPublicState(gameId: string): Promise<PublicGameState> {
  const data = await apiFetch<{ ok: true; game: PublicGameState }>(`/api/games/${gameId}/public`)
  return data.game
}

export interface PrivateCard {
  id: string
  name: string
  category: string
}

export interface PrivateState {
  playerId: string
  name: string
  hand: PrivateCard[]
  notes: Record<string, string>
}

export async function getPrivateState(gameId: string, playerId: string): Promise<PrivateState> {
  const data = await apiFetch<{ ok: true; player: PrivateState }>(`/api/games/${gameId}/private/${playerId}`)
  return data.player
}

export interface AccusationResult {
  correct: boolean
  winner?: string
}

export async function makeAccusation(
  gameId: string,
  playerId: string,
  suspectId: string,
  locationId: string,
  itemId: string,
): Promise<AccusationResult> {
  const data = await apiFetch<{ ok: true } & AccusationResult>(`/api/games/${gameId}/accusations`, {
    method: 'POST',
    body: JSON.stringify({ playerId, suspectId, locationId, itemId }),
  })
  return { correct: data.correct, winner: data.winner }
}

export async function startGame(gameId: string, playerId: string): Promise<void> {
  await apiFetch(`/api/games/${gameId}/start`, {
    method: 'POST',
    body: JSON.stringify({ playerId }),
  })
}

export interface SuggestionResult {
  needsReveal: boolean
  refutingPlayerId: string | null
}

export async function revealCard(gameId: string, revealingPlayerId: string, cardId: string): Promise<void> {
  await apiFetch(`/api/games/${gameId}/reveal`, {
    method: 'POST',
    body: JSON.stringify({ revealingPlayerId, cardId }),
  })
}

export async function submitSuggestion(
  gameId: string,
  playerId: string,
  suspectId: string,
  locationId: string,
  itemId: string,
): Promise<SuggestionResult> {
  const data = await apiFetch<{ ok: true } & SuggestionResult>(`/api/games/${gameId}/suggestions`, {
    method: 'POST',
    body: JSON.stringify({ playerId, suspectId, locationId, itemId }),
  })
  return { needsReveal: data.needsReveal, refutingPlayerId: data.refutingPlayerId }
}
