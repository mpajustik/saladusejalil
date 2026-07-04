import { Server } from 'socket.io'
import type { Server as HttpServer } from 'http'
import { getGameById, saveGame } from './store.js'
import { nextNonEliminatedIndex } from './logic/gameLogic.js'

export let io: Server

// playerId → socket.id — et saata sündmusi konkreetsele mängijale
const playerSocketMap = new Map<string, string>()

export function getSocketIdForPlayer(playerId: string): string | undefined {
  return playerSocketMap.get(playerId)
}

export function initSocket(httpServer: HttpServer): void {
  const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, 'http://localhost:5173']
    : ['http://localhost:5173']

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log(`[Socket] Ühendus: ${socket.id}`)

    socket.on('join_room', ({ gameId, playerId }: { gameId?: string; playerId?: string }) => {
      if (!gameId || !playerId) return
      const game = getGameById(gameId)
      if (!game) return
      if (!game.players.some(p => p.id === playerId)) return

      socket.join(gameId)
      playerSocketMap.set(playerId, socket.id)
      console.log(`[Socket] ${playerId} liitus toaga ${gameId} (socket: ${socket.id})`)

      // Taasta refuteerija kaardivalik kui mäng on pooleli ja ootel hüpotees
      const pending = game.pendingSuggestion
      if (game.status === 'in_progress' && pending?.refuterId === playerId) {
        const refuterPlayer = game.players.find(p => p.id === playerId)
        const asker = game.players.find(p => p.id === pending.askerId)
        if (refuterPlayer) {
          const hypothesisIds = new Set([pending.suspectId, pending.locationId, pending.itemId])
          const matchingCards = refuterPlayer.hand
            .filter(c => hypothesisIds.has(c.id))
            .map(c => ({ id: c.id, name: c.name }))
          socket.emit('refuter_options', {
            askerName: asker?.name ?? '',
            matchingCards,
          })
          console.log(`[Socket] Taastas refuter_options mängijale ${playerId}`)
        }
      }
    })

    socket.on('end_turn', ({ gameId, playerId }: { gameId?: string; playerId?: string }) => {
      if (!gameId || !playerId) return
      const game = getGameById(gameId)
      if (!game || game.status !== 'in_progress') return

      const current = game.players[game.currentPlayerIndex]
      if (current.id !== playerId) return

      game.currentPlayerIndex = nextNonEliminatedIndex(game.players, game.currentPlayerIndex, game.eliminatedPlayers)
      const next = game.players[game.currentPlayerIndex]
      game.lastAction = `${current.name} lõpetas korra.`
      saveGame(game)

      console.log(`[Socket] Kord: ${current.name} → ${next.name}`)

      io.to(gameId).emit('turn_changed', {
        currentPlayerId:   next.id,
        currentPlayerName: next.name,
        lastAction:        game.lastAction,
      })
    })

    socket.on('disconnect', (reason) => {
      // Eemalda mängija socket-kaardistusest
      for (const [pid, sid] of playerSocketMap.entries()) {
        if (sid === socket.id) {
          playerSocketMap.delete(pid)
          break
        }
      }
      console.log(`[Socket] Lahkus: ${socket.id} (${reason})`)
    })
  })

  console.log('[Socket] Socket.IO server valmis.')
}
