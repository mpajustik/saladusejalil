import { Router } from 'express'
import { saveGame, getGameById, getGameByRoomCode } from '../store.js'
import { generateRoomCode, generateId } from '../utils.js'
import { io, getSocketIdForPlayer } from '../socket.js'
import { getCaseById, caseRegistry } from '../data/caseRegistry.js'
import { createSolution, dealCards, findRefuter, nextNonEliminatedIndex } from '../logic/gameLogic.js'
import type { BackendGame, PrivatePlayerState, PublicGameState } from '../types.js'
import type { MysteryCase } from '../types/case.js'

const MAX_PLAYERS = 6

export const gamesRouter = Router()

function toPublicState(game: BackendGame): PublicGameState {
  const currentPlayer = game.players[game.currentPlayerIndex] ?? null
  return {
    gameId: game.gameId,
    roomCode: game.roomCode,
    caseId: game.caseId,
    status: game.status,
    players: game.players.map(p => ({ id: p.id, name: p.name, isHost: p.isHost })),
    currentPlayerId: currentPlayer?.id ?? null,
    lastAction: game.lastAction,
  }
}

// POST /api/games — loo uus mängutuba
gamesRouter.post('/', (req, res) => {
  const { caseId, hostName } = req.body as { caseId?: string; hostName?: string }

  const gameCase = caseId ? getCaseById(caseId) : undefined
  if (!gameCase) {
    const available = caseRegistry.map(c => c.id).join(', ')
    res.status(400).json({ ok: false, error: { code: 'INVALID_CASE', message: `Tundmatu juhtum. Saadaval: ${available}` } })
    return
  }

  if (!hostName || typeof hostName !== 'string' || hostName.trim().length < 1) {
    res.status(400).json({ ok: false, error: { code: 'MISSING_NAME', message: 'Mängija nimi puudub.' } })
    return
  }

  let roomCode = generateRoomCode()
  let attempts = 0
  while (getGameByRoomCode(roomCode) && attempts < 10) {
    roomCode = generateRoomCode()
    attempts++
  }

  const gameId = generateId('game')
  const playerId = generateId('player')

  saveGame({
    gameId,
    roomCode,
    caseId: gameCase.id,
    status: 'waiting',
    players: [{ id: playerId, name: hostName.trim(), isHost: true, hand: [], notes: {} }],
    currentPlayerIndex: 0,
    lastAction: null,
    solution: null,
    pendingSuggestion: null,
    eliminatedPlayers: [],
    winner: null,
    createdAt: Date.now(),
  })

  res.status(201).json({ ok: true, gameId, roomCode, playerId })
})

// POST /api/games/:roomCode/join — liitu mängutoaga
gamesRouter.post('/:roomCode/join', (req, res) => {
  const roomCode = req.params.roomCode.toUpperCase()
  const { playerName } = req.body as { playerName?: string }

  if (!playerName || typeof playerName !== 'string' || playerName.trim().length < 1) {
    res.status(400).json({ ok: false, error: { code: 'MISSING_NAME', message: 'Mängija nimi puudub.' } })
    return
  }

  const game = getGameByRoomCode(roomCode)

  if (!game) {
    res.status(404).json({ ok: false, error: { code: 'ROOM_NOT_FOUND', message: 'Sellist ruumikoodi ei leitud.' } })
    return
  }

  if (game.status !== 'waiting') {
    res.status(400).json({ ok: false, error: { code: 'GAME_ALREADY_STARTED', message: 'Mäng on juba alanud.' } })
    return
  }

  if (game.players.length >= MAX_PLAYERS) {
    res.status(400).json({ ok: false, error: { code: 'ROOM_FULL', message: 'Mängutuba on täis.' } })
    return
  }

  const name = playerName.trim()
  const nameTaken = game.players.some(p => p.name.toLowerCase() === name.toLowerCase())
  if (nameTaken) {
    res.status(400).json({ ok: false, error: { code: 'NAME_TAKEN', message: 'See nimi on juba kasutuses.' } })
    return
  }

  const playerId = generateId('player')
  game.players.push({ id: playerId, name, isHost: false, hand: [], notes: {} })
  saveGame(game)

  // Teavita kõiki samas toas olevaid kliente uuest mängijast
  io.to(game.gameId).emit('player_joined', {
    players: game.players.map(p => ({ id: p.id, name: p.name, isHost: p.isHost })),
    newPlayer: { id: playerId, name },
  })

  res.status(200).json({ ok: true, gameId: game.gameId, playerId, roomCode: game.roomCode })
})

// POST /api/games/:gameId/start — käivita mäng (ainult peremees)
gamesRouter.post('/:gameId/start', (req, res) => {
  const { playerId } = req.body as { playerId?: string }
  const game = getGameById(req.params.gameId)

  if (!game) {
    res.status(404).json({ ok: false, error: { code: 'GAME_NOT_FOUND', message: 'Mängu ei leitud.' } })
    return
  }

  const host = game.players.find(p => p.id === playerId)
  if (!host?.isHost) {
    res.status(403).json({ ok: false, error: { code: 'NOT_HOST', message: 'Ainult peremees saab mängu alustada.' } })
    return
  }

  if (game.status !== 'waiting') {
    res.status(400).json({ ok: false, error: { code: 'ALREADY_STARTED', message: 'Mäng on juba alanud.' } })
    return
  }

  if (game.players.length < 2) {
    res.status(400).json({ ok: false, error: { code: 'NOT_ENOUGH_PLAYERS', message: 'Vaja on vähemalt 2 mängijat.' } })
    return
  }

  const gameCase = getCaseById(game.caseId) as MysteryCase
  const solution = createSolution(gameCase)
  dealCards(gameCase, solution, game.players)
  game.status = 'in_progress'
  game.solution = solution
  game.currentPlayerIndex = 0
  game.lastAction = 'Mäng algas.'
  saveGame(game)

  const firstPlayer = game.players[0]
  io.to(game.gameId).emit('game_started', {
    currentPlayerId: firstPlayer.id,
    currentPlayerName: firstPlayer.name,
  })

  res.json({ ok: true, status: 'in_progress' })
})

// GET /api/games/:gameId/public — avalik mänguseis
gamesRouter.get('/:gameId/public', (req, res) => {
  const game = getGameById(req.params.gameId)

  if (!game) {
    res.status(404).json({ ok: false, error: { code: 'GAME_NOT_FOUND', message: 'Mängu ei leitud.' } })
    return
  }

  res.json({ ok: true, game: toPublicState(game) })
})

// GET /api/games/:gameId/private/:playerId — mängija privaatne seis
gamesRouter.get('/:gameId/private/:playerId', (req, res) => {
  const game = getGameById(req.params.gameId)

  if (!game) {
    res.status(404).json({ ok: false, error: { code: 'GAME_NOT_FOUND', message: 'Mängu ei leitud.' } })
    return
  }

  const player = game.players.find(p => p.id === req.params.playerId)

  if (!player) {
    res.status(404).json({ ok: false, error: { code: 'PLAYER_NOT_FOUND', message: 'Mängijat ei leitud.' } })
    return
  }

  const privateState: PrivatePlayerState = {
    playerId: player.id,
    name: player.name,
    hand: player.hand,
    notes: player.notes,
  }

  res.json({ ok: true, player: privateState })
})

// POST /api/games/:gameId/suggestions — esita hüpotees
gamesRouter.post('/:gameId/suggestions', (req, res) => {
  const { playerId, suspectId, locationId, itemId } =
    req.body as { playerId?: string; suspectId?: string; locationId?: string; itemId?: string }

  if (!playerId || !suspectId || !locationId || !itemId) {
    res.status(400).json({ ok: false, error: { code: 'MISSING_FIELDS', message: 'Puuduvad väljad.' } })
    return
  }

  const game = getGameById(req.params.gameId)
  if (!game) {
    res.status(404).json({ ok: false, error: { code: 'GAME_NOT_FOUND', message: 'Mängu ei leitud.' } })
    return
  }

  if (game.status !== 'in_progress') {
    res.status(400).json({ ok: false, error: { code: 'NOT_IN_PROGRESS', message: 'Mäng ei ole käimas.' } })
    return
  }

  const asker = game.players[game.currentPlayerIndex]
  if (asker.id !== playerId) {
    res.status(403).json({ ok: false, error: { code: 'NOT_YOUR_TURN', message: 'Praegu ei ole sinu kord.' } })
    return
  }

  // Kontrolli et kaardid on olemas (otsime registrist)
  const gameCase2 = getCaseById(game.caseId) as MysteryCase
  const suspect  = gameCase2.suspects.find(c => c.id === suspectId)
  const location = gameCase2.locations.find(c => c.id === locationId)
  const item     = gameCase2.items.find(c => c.id === itemId)
  if (!suspect || !location || !item) {
    res.status(400).json({ ok: false, error: { code: 'INVALID_CARDS', message: 'Tundmatud kaardid.' } })
    return
  }

  const refuter = findRefuter(game.players, game.currentPlayerIndex, suspectId, locationId, itemId)
  const refuterPlayer = refuter ? game.players[refuter.playerIndex] : null

  game.pendingSuggestion = {
    askerId: playerId,
    suspectId,
    locationId,
    itemId,
    refuterId: refuterPlayer?.id ?? null,
  }
  game.lastAction = `${asker.name} arvas: ${suspect.name} · ${location.name} · ${item.name}`
  saveGame(game)

  io.to(game.gameId).emit('hypothesis_made', {
    playerName: asker.name,
    suspect:    suspect.name,
    location:   location.name,
    item:       item.name,
    canRefute:  refuterPlayer !== null,
    refuterName: refuterPlayer?.name ?? null,
    refuterId:  refuterPlayer?.id ?? null,
  })

  // Saada refuteerijale privaatselt tema sobivad kaardid
  if (refuterPlayer && refuter) {
    const refuterSocketId = getSocketIdForPlayer(refuterPlayer.id)
    if (refuterSocketId) {
      io.to(refuterSocketId).emit('refuter_options', {
        askerName:     asker.name,
        matchingCards: refuter.matchingCards.map(c => ({ id: c.id, name: c.name })),
      })
    }
  }

  // Kui keegi ei saa ümber lükata, liigub kord automaatselt edasi
  if (!refuterPlayer) {
    game.currentPlayerIndex = nextNonEliminatedIndex(game.players, game.currentPlayerIndex, game.eliminatedPlayers)
    game.pendingSuggestion = null
    saveGame(game)
    const next = game.players[game.currentPlayerIndex]
    io.to(game.gameId).emit('turn_changed', {
      currentPlayerId:   next.id,
      currentPlayerName: next.name,
      lastAction: game.lastAction,
    })
  }

  res.json({ ok: true, needsReveal: refuterPlayer !== null, refutingPlayerId: refuterPlayer?.id ?? null })
})

// POST /api/games/:gameId/reveal — näita kaarti salaja küsijale
gamesRouter.post('/:gameId/reveal', (req, res) => {
  const { revealingPlayerId, cardId } =
    req.body as { revealingPlayerId?: string; cardId?: string }

  if (!revealingPlayerId || !cardId) {
    res.status(400).json({ ok: false, error: { code: 'MISSING_FIELDS', message: 'Puuduvad väljad.' } })
    return
  }

  const game = getGameById(req.params.gameId)
  if (!game) {
    res.status(404).json({ ok: false, error: { code: 'GAME_NOT_FOUND', message: 'Mängu ei leitud.' } })
    return
  }

  const pending = game.pendingSuggestion
  if (!pending) {
    res.status(400).json({ ok: false, error: { code: 'NO_PENDING', message: 'Ootel hüpoteesi pole.' } })
    return
  }

  if (pending.refuterId !== revealingPlayerId) {
    res.status(403).json({ ok: false, error: { code: 'NOT_REFUTER', message: 'Sa ei ole ümber lükkaja.' } })
    return
  }

  const refuter = game.players.find(p => p.id === revealingPlayerId)!
  const card = refuter.hand.find(c => c.id === cardId)
  if (!card) {
    res.status(400).json({ ok: false, error: { code: 'CARD_NOT_IN_HAND', message: 'Kaart pole sinu käes.' } })
    return
  }

  const validIds = new Set([pending.suspectId, pending.locationId, pending.itemId])
  if (!validIds.has(cardId)) {
    res.status(400).json({ ok: false, error: { code: 'CARD_NOT_MATCHING', message: 'Kaart ei sobi hüpoteesiga.' } })
    return
  }

  const asker = game.players.find(p => p.id === pending.askerId)!

  // Saada kaart AINULT küsija socketile
  const askerSocketId = getSocketIdForPlayer(asker.id)
  if (askerSocketId) {
    io.to(askerSocketId).emit('card_revealed', {
      revealerName: refuter.name,
      revealerId:   refuter.id,
      card: { id: card.id, name: card.name },
    })
  }

  // Teavita kõiki et kaart näidati (ilma kaardi infota)
  game.lastAction = `${refuter.name} näitas kaarti ${asker.name}le.`
  game.pendingSuggestion = null
  game.currentPlayerIndex = nextNonEliminatedIndex(game.players, game.currentPlayerIndex, game.eliminatedPlayers)
  const next = game.players[game.currentPlayerIndex]
  saveGame(game)

  io.to(game.gameId).emit('reveal_done', {
    revealerName: refuter.name,
    askerName:    asker.name,
    lastAction:   game.lastAction,
  })

  io.to(game.gameId).emit('turn_changed', {
    currentPlayerId:   next.id,
    currentPlayerName: next.name,
    lastAction:        game.lastAction,
  })

  res.json({ ok: true })
})

// POST /api/games/:gameId/accusations — lõplik süüdistus
gamesRouter.post('/:gameId/accusations', (req, res) => {
  const { playerId, suspectId, locationId, itemId } =
    req.body as { playerId?: string; suspectId?: string; locationId?: string; itemId?: string }

  if (!playerId || !suspectId || !locationId || !itemId) {
    res.status(400).json({ ok: false, error: { code: 'MISSING_FIELDS', message: 'Puuduvad väljad.' } })
    return
  }

  const game = getGameById(req.params.gameId)
  if (!game) {
    res.status(404).json({ ok: false, error: { code: 'GAME_NOT_FOUND', message: 'Mängu ei leitud.' } })
    return
  }

  if (game.status !== 'in_progress') {
    res.status(400).json({ ok: false, error: { code: 'NOT_IN_PROGRESS', message: 'Mäng ei ole käimas.' } })
    return
  }

  const accuser = game.players[game.currentPlayerIndex]
  if (accuser.id !== playerId) {
    res.status(403).json({ ok: false, error: { code: 'NOT_YOUR_TURN', message: 'Praegu ei ole sinu kord.' } })
    return
  }

  if (game.eliminatedPlayers.includes(playerId)) {
    res.status(403).json({ ok: false, error: { code: 'ELIMINATED', message: 'Oled juba mängust väljas.' } })
    return
  }

  const sol = game.solution!
  const correct =
    sol.suspect.id  === suspectId &&
    sol.location.id === locationId &&
    sol.item.id     === itemId

  const gameCase = getCaseById(game.caseId) as MysteryCase
  const suspectName  = gameCase.suspects.find(c => c.id === suspectId)?.name  ?? suspectId
  const locationName = gameCase.locations.find(c => c.id === locationId)?.name ?? locationId
  const itemName     = gameCase.items.find(c => c.id === itemId)?.name          ?? itemId

  if (correct) {
    game.status = 'finished'
    game.winner = accuser.name
    game.lastAction = `${accuser.name} lahendas juhtumi!`
    saveGame(game)

    io.to(game.gameId).emit('game_over', {
      winner: accuser.name,
      solution: {
        suspect:  sol.suspect.name,
        location: sol.location.name,
        item:     sol.item.name,
      },
    })

    res.json({ ok: true, correct: true, winner: accuser.name })
  } else {
    game.eliminatedPlayers.push(playerId)
    game.lastAction = `${accuser.name} tegi vale süüdistuse (${suspectName} · ${locationName} · ${itemName}) — langeb välja.`

    // Liigu järgmise mängijani (jäta elimineeritud vahele)
    let nextIndex = (game.currentPlayerIndex + 1) % game.players.length
    while (
      game.eliminatedPlayers.includes(game.players[nextIndex].id) &&
      nextIndex !== game.currentPlayerIndex
    ) {
      nextIndex = (nextIndex + 1) % game.players.length
    }
    game.currentPlayerIndex = nextIndex
    saveGame(game)

    const next = game.players[nextIndex]
    io.to(game.gameId).emit('accusation_failed', {
      accuserName: accuser.name,
      lastAction:  game.lastAction,
    })
    io.to(game.gameId).emit('turn_changed', {
      currentPlayerId:   next.id,
      currentPlayerName: next.name,
      lastAction:        game.lastAction,
    })

    res.json({ ok: true, correct: false })
  }
})
