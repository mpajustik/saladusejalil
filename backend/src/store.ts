import type { BackendGame } from './types.js'

// In-memory hoidla — etapis 2 piisab, andmebaas tuleb hiljem
const games = new Map<string, BackendGame>()

export function saveGame(game: BackendGame): void {
  games.set(game.gameId, game)
}

export function getGameById(gameId: string): BackendGame | undefined {
  return games.get(gameId)
}

export function getGameByRoomCode(roomCode: string): BackendGame | undefined {
  for (const game of games.values()) {
    if (game.roomCode === roomCode) return game
  }
  return undefined
}
