import { useEffect, useState } from 'react'
import { getAllCases } from './utils/customCases'
import { createSolution, dealCards, findRefuter, createNotes } from './logic/gameLogic'
import { GridNotebook } from './components/GridNotebook'
import { CreateRoom } from './components/lobby/CreateRoom'
import { JoinRoom } from './components/lobby/JoinRoom'
import { Lobby } from './components/lobby/Lobby'
import { AdminHome } from './components/admin/AdminHome'
import { CaseEditor } from './components/admin/CaseEditor'
import { HowToPlay } from './components/HowToPlay'
import { saveSession, loadSession, clearSession } from './utils/session'
import { getPublicState } from './api/gameApi'
import type { Card, CellValue, GameState, HistoryEntry } from './types/game'
import type { MysteryCase } from './types/case'
import './App.css'

type AppMode = 'home' | 'single' | 'multi-create' | 'multi-join' | 'multi-lobby' | 'admin' | 'admin-create'

interface LobbySession {
  gameId: string
  playerId: string
  roomCode: string
}

function makePlayerNames(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Mängija ${i + 1}`)
}

const RULES_SEEN_KEY = 'sj_seen_rules'

const EMPTY_STATE: GameState = {
  status: 'idle',
  phase: 'choosing-room',
  winner: null,
  solution: null,
  players: [],
  activePlayerIndex: 0,
  activeRoom: null,
  eliminatedPlayers: [],
  history: [],
  notes: {},
  pending: null,
  refuterIndex: null,
  refuterOptions: [],
  shownCard: null,
}

// --- Sub-components ---

function HypothesisForm({ playerName, gameCase, activeRoom, suspectId, itemId, onSuspectChange, onItemChange, onSubmit }: {
  playerName: string
  gameCase: MysteryCase
  activeRoom: string
  suspectId: string
  itemId: string
  onSuspectChange: (id: string) => void
  onItemChange: (id: string) => void
  onSubmit: (ids: { suspectId: string; locationId: string; itemId: string }) => void
}) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ suspectId, locationId: activeRoom, itemId })
  }

  const roomName = gameCase.locations.find(l => l.id === activeRoom)?.name ?? activeRoom

  return (
    <form className="hypothesis-form" onSubmit={handleSubmit}>
      <h3>Hüpotees — {playerName}</h3>
      <p className="hypothesis-hint">
        Esita hüpotees selles ruumis. Järgmine mängija, kellel on sobiv kaart, näitab seda sulle salaja.
      </p>
      <div className="form-row">
        <label>Kahtlusalune</label>
        <select value={suspectId} onChange={e => onSuspectChange(e.target.value)}>
          {gameCase.suspects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="form-row">
        <label>Ruum <span className="label-hint">(valitud korra alguses)</span></label>
        <div className="locked-room">{roomName}</div>
      </div>
      <div className="form-row">
        <label>Ese / tõend</label>
        <select value={itemId} onChange={e => onItemChange(e.target.value)}>
          {gameCase.items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>
      <button type="submit" className="btn-primary">Esita hüpotees</button>
    </form>
  )
}

function AccusationForm({ playerName, gameCase, open, suspectId, locationId, itemId, onOpenChange, onSuspectChange, onLocationChange, onItemChange, onSubmit }: {
  playerName: string
  gameCase: MysteryCase
  open: boolean
  suspectId: string
  locationId: string
  itemId: string
  onOpenChange: (open: boolean) => void
  onSuspectChange: (id: string) => void
  onLocationChange: (id: string) => void
  onItemChange: (id: string) => void
  onSubmit: (ids: { suspectId: string; locationId: string; itemId: string }) => void
}) {
  const [confirming, setConfirming] = useState(false)

  if (!open) {
    return (
      <div className="accusation-hint-wrap">
        <button className="btn-accusation" onClick={() => onOpenChange(true)}>
          Tee lõplik süüdistus
        </button>
        <p className="accusation-when-hint">
          Tee ainult siis, kui oled <strong>kindel</strong> kõigis kolmes. Vale = mängust välja!
        </p>
      </div>
    )
  }

  if (confirming) {
    const sName = gameCase.suspects.find(s => s.id === suspectId)?.name ?? ''
    const lName = gameCase.locations.find(l => l.id === locationId)?.name ?? ''
    const iName = gameCase.items.find(i => i.id === itemId)?.name ?? ''
    return (
      <div className="accusation-confirm">
        <h3>Oled kindel?</h3>
        <div className="accusation-confirm-cards">
          <div className="confirm-card"><span className="confirm-cat">Tegelane</span>{sName}</div>
          <div className="confirm-card"><span className="confirm-cat">Asukoht</span>{lName}</div>
          <div className="confirm-card"><span className="confirm-cat">Ese</span>{iName}</div>
        </div>
        <p className="accusation-warning">Tagasi ei saa! Vale vastus tähendab mängust väljalangemist.</p>
        <div className="accusation-actions">
          <button className="btn-primary" onClick={() => onSubmit({ suspectId, locationId, itemId })}>
            Jah, esitan süüdistuse!
          </button>
          <button className="btn-secondary" onClick={() => setConfirming(false)}>← Muuda valikut</button>
        </div>
      </div>
    )
  }

  return (
    <form className="accusation-form" onSubmit={e => { e.preventDefault(); setConfirming(true) }}>
      <h3>Lõplik süüdistus — {playerName}</h3>
      <div className="form-row">
        <label>Tegelane</label>
        <select value={suspectId} onChange={e => onSuspectChange(e.target.value)}>
          {gameCase.suspects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="form-row">
        <label>Asukoht</label>
        <select value={locationId} onChange={e => onLocationChange(e.target.value)}>
          {gameCase.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>
      <div className="form-row">
        <label>Ese</label>
        <select value={itemId} onChange={e => onItemChange(e.target.value)}>
          {gameCase.items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>
      <div className="accusation-actions">
        <button type="submit" className="btn-primary">Edasi →</button>
        <button type="button" className="btn-secondary" onClick={() => onOpenChange(false)}>Tühista</button>
      </div>
    </form>
  )
}

function FinishedScreen({ winner, solution, onRestart }: {
  winner: string | null
  solution: { suspect: Card; location: Card; item: Card }
  onRestart: () => void
}) {
  const won = winner !== null
  return (
    <div className="finished-screen">
      <div className="finished-icon">{won ? '🏆' : '🔍'}</div>
      <h2 className={won ? 'finished-win' : 'finished-lose'}>
        {won ? `${winner} võitis!` : 'Mäng on läbi'}
      </h2>
      <div className="finished-solution">
        <p className="finished-solution-title">Salajane lahendus oli:</p>
        <div className="solution-row">
          <span className="solution-label">Tegelane:</span>
          <span className="solution-value">{solution.suspect.name}</span>
        </div>
        <div className="solution-row">
          <span className="solution-label">Asukoht:</span>
          <span className="solution-value">{solution.location.name}</span>
        </div>
        <div className="solution-row">
          <span className="solution-label">Ese:</span>
          <span className="solution-value">{solution.item.name}</span>
        </div>
      </div>
      <button className="btn-primary" onClick={onRestart}>Mängi uuesti</button>
    </div>
  )
}

function HandoffToRefuterScreen({ refuterName, askerName, onConfirm }: {
  refuterName: string
  askerName: string
  onConfirm: () => void
}) {
  return (
    <div className="handoff-screen">
      <div className="handoff-icon">📱</div>
      <h2>Anna seade <strong>{refuterName}</strong>le</h2>
      <p className="handoff-sub">{askerName} ei tohi ekraani näha.</p>
      <button className="btn-primary" onClick={onConfirm}>Olen {refuterName}, näen ekraani ✓</button>
    </div>
  )
}

function RevealScreen({ refuterName, askerName, options, onReveal }: {
  refuterName: string
  askerName: string
  options: Card[]
  onReveal: (card: Card) => void
}) {
  return (
    <div className="handoff-screen">
      <h2>Vali kaart, mida näidata <strong>{askerName}</strong>le</h2>
      <p className="handoff-sub">Teised mängijad ei tohi ekraani näha, {refuterName}.</p>
      <div className="reveal-options">
        {options.map(card => (
          <button key={card.id} className="btn-card-reveal" onClick={() => onReveal(card)}>
            {card.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function HandoffToAskerScreen({ askerName, onConfirm }: {
  askerName: string
  onConfirm: () => void
}) {
  return (
    <div className="handoff-screen">
      <div className="handoff-icon">📱</div>
      <h2>Anna seade tagasi <strong>{askerName}</strong>le</h2>
      <p className="handoff-sub">Teised mängijad ei tohi ekraani näha.</p>
      <button className="btn-primary" onClick={onConfirm}>Olen {askerName}, näen ekraani ✓</button>
    </div>
  )
}

function CardShownScreen({ askerName, shownCard, onConfirm }: {
  askerName: string
  shownCard: Card
  onConfirm: () => void
}) {
  return (
    <div className="handoff-screen">
      <h2>Sulle näidati kaarti, <strong>{askerName}</strong></h2>
      <div className="shown-card-box">
        <p className="shown-card-name">{shownCard.name}</p>
        <p className="shown-card-hint">✓ Automaatselt märgitud märkmikusse</p>
      </div>
      <button className="btn-primary" onClick={onConfirm}>Sain aru, jätkan</button>
    </div>
  )
}

// --- Main App ---

function App() {
  const [appMode, setAppMode] = useState<AppMode>('home')
  const [lobbySession, setLobbySession] = useState<LobbySession | null>(null)
  const [savedSession, setSavedSession] = useState<LobbySession | null>(null)
  const [game, setGame] = useState<GameState>(EMPTY_STATE)
  const [tab, setTab] = useState<'game' | 'notebook'>('game')
  const [allCases] = useState<MysteryCase[]>(() => getAllCases())
  const [selectedCase, setSelectedCase] = useState<MysteryCase>(() => getAllCases()[0])
  const [showRules, setShowRules] = useState(false)
  const [playerCount, setPlayerCount] = useState(() => getAllCases()[0].minPlayers)
  // Hüpoteesi valikud — püsivad tab-i vahetamisel
  const [hSuspectId, setHSuspectId] = useState(() => getAllCases()[0].suspects[0].id)
  const [hItemId, setHItemId]       = useState(() => getAllCases()[0].items[0].id)
  // Süüdistuse valikud — püsivad tab-i vahetamisel
  const [aOpen, setAOpen]           = useState(false)
  const [aSuspectId, setASuspectId] = useState(() => getAllCases()[0].suspects[0].id)
  const [aLocationId, setALocationId] = useState(() => getAllCases()[0].locations[0].id)
  const [aItemId, setAItemId]       = useState(() => getAllCases()[0].items[0].id)

  // Kontrolli käivitumisel, kas eelmine sessioon on kehtiv
  useEffect(() => {
    const stored = loadSession()
    if (!stored) return
    getPublicState(stored.gameId)
      .then(state => {
        if (state.status === 'in_progress') {
          // Mäng käib — suuna automaatselt lobbysse
          setLobbySession(stored)
          setAppMode('multi-lobby')
        } else {
          // Mäng ootab — näita taasliitumise kaarti kodu-ekraanil
          setSavedSession(stored)
        }
      })
      .catch(() => clearSession())
  }, [])

  function startGame() {
    const solution = createSolution(selectedCase)
    const players = dealCards(selectedCase, solution, makePlayerNames(playerCount))
    const notes = createNotes(players, selectedCase)
    setGame({ ...EMPTY_STATE, status: 'playing', phase: 'choosing-room', solution, players, notes })
    setTab('game')
    setHSuspectId(selectedCase.suspects[0].id)
    setHItemId(selectedCase.items[0].id)
    setAOpen(false)
    setASuspectId(selectedCase.suspects[0].id)
    setALocationId(selectedCase.locations[0].id)
    setAItemId(selectedCase.items[0].id)
    // Näita reegleid kui pole veel näidatud
    if (!localStorage.getItem(RULES_SEEN_KEY)) {
      setShowRules(true)
      localStorage.setItem(RULES_SEEN_KEY, '1')
    }
  }

  function chooseRoom(locationId: string) {
    setGame(prev => ({ ...prev, phase: 'waiting', activeRoom: locationId }))
  }

  function submitHypothesis(ids: { suspectId: string; locationId: string; itemId: string }) {
    const suspectName = selectedCase.suspects.find(s => s.id === ids.suspectId)!.name
    const locationName = selectedCase.locations.find(l => l.id === ids.locationId)!.name
    const itemName = selectedCase.items.find(i => i.id === ids.itemId)!.name

    const refuter = findRefuter(
      game.players,
      game.activePlayerIndex,
      ids.suspectId,
      ids.locationId,
      ids.itemId,
    )

    if (!refuter) {
      const entry: HistoryEntry = {
        playerName: game.players[game.activePlayerIndex].name,
        suspect: suspectName,
        location: locationName,
        item: itemName,
        result: 'Keegi ei saanud ümber lükata.',
      }
      setAOpen(false)
      setGame(prev => ({
        ...prev,
        history: [...prev.history, entry],
        activePlayerIndex: (prev.activePlayerIndex + 1) % prev.players.length,
        phase: 'choosing-room',
        activeRoom: null,
      }))
      return
    }

    setGame(prev => ({
      ...prev,
      phase: 'handoff-to-refuter',
      pending: { ...ids, suspectName, locationName, itemName },
      refuterIndex: refuter.playerIndex,
      refuterOptions: refuter.matchingCards,
    }))
  }

  function revealCard(card: Card) {
    setGame(prev => ({ ...prev, phase: 'handoff-to-asker', shownCard: card }))
  }

  function confirmShownCard() {
    const active  = game.players[game.activePlayerIndex]
    const refuter = game.players[game.refuterIndex!]
    const entry: HistoryEntry = {
      playerName: active.name,
      suspect:  game.pending!.suspectName,
      location: game.pending!.locationName,
      item:     game.pending!.itemName,
      result:   `${refuter.name} näitas üht kaarti.`,
    }
    // Kindel fakt: refuteerija omab näidatud kaarti → auto-täida teised —
    const shownCardId = game.shownCard?.id
    if (shownCardId) {
      applyKnownFact(active.id, shownCardId, refuter.id)
    }
    setAOpen(false)
    setGame(prev => ({
      ...prev,
      phase: 'choosing-room',
      activeRoom: null,
      history: [...prev.history, entry],
      activePlayerIndex: (prev.activePlayerIndex + 1) % prev.players.length,
      pending: null,
      refuterIndex: null,
      refuterOptions: [],
      shownCard: null,
    }))
  }

  function submitAccusation(ids: { suspectId: string; locationId: string; itemId: string }) {
    const sol = game.solution!
    const correct =
      ids.suspectId === sol.suspect.id &&
      ids.locationId === sol.location.id &&
      ids.itemId === sol.item.id

    if (correct) {
      setGame(prev => ({
        ...prev,
        status: 'finished',
        winner: game.players[game.activePlayerIndex].name,
      }))
    } else {
      const playerId = game.players[game.activePlayerIndex].id
      const playerName = game.players[game.activePlayerIndex].name
      const entry: HistoryEntry = {
        playerName,
        suspect: selectedCase.suspects.find(s => s.id === ids.suspectId)!.name,
        location: selectedCase.locations.find(l => l.id === ids.locationId)!.name,
        item: selectedCase.items.find(i => i.id === ids.itemId)!.name,
        result: 'Vale süüdistus — langeb mängust välja.',
      }
      setGame(prev => ({
        ...prev,
        history: [...prev.history, entry],
        eliminatedPlayers: [...prev.eliminatedPlayers, playerId],
        activePlayerIndex: (prev.activePlayerIndex + 1) % prev.players.length,
        phase: 'choosing-room',
        activeRoom: null,
      }))
    }
  }

  function updateNote(myId: string, cardId: string, targetPlayerId: string, value: CellValue) {
    // Käsitsi klikk — EI automaattäida teisi lahtreid
    setGame(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [myId]: {
          ...prev.notes[myId],
          [cardId]: {
            ...(prev.notes[myId]?.[cardId] ?? {}),
            [targetPlayerId]: value,
          },
        },
      },
    }))
  }

  // Kindel fakt: keegi OMA kindlasti seda kaarti → teised kindlasti ei oma
  function applyKnownFact(myId: string, cardId: string, ownerId: string) {
    setGame(prev => {
      const cardCells = { ...(prev.notes[myId]?.[cardId] ?? {}), [ownerId]: 'has' as CellValue }
      for (const p of prev.players) {
        if (p.id !== ownerId) cardCells[p.id] = 'no'
      }
      return {
        ...prev,
        notes: {
          ...prev.notes,
          [myId]: { ...prev.notes[myId], [cardId]: cardCells },
        },
      }
    })
  }

  const activePlayer = game.players[game.activePlayerIndex]

  // --- Render ---

  if (appMode === 'home') {
    return (
      <main>
        <h1>Saladuse Jälil</h1>
        <p className="home-tagline">Kes? Kus? Millega?</p>

        {savedSession && (
          <div className="rejoin-card">
            <div className="rejoin-info">
              <span className="rejoin-icon">↩</span>
              <div>
                <p className="rejoin-title">Eelmine sessioon leitud</p>
                <p className="rejoin-code">Ruumikood: <strong>{savedSession.roomCode}</strong></p>
              </div>
            </div>
            <div className="rejoin-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  setLobbySession(savedSession)
                  setAppMode('multi-lobby')
                }}
              >
                Liitu uuesti
              </button>
              <button
                className="btn-secondary"
                onClick={() => { clearSession(); setSavedSession(null) }}
              >
                Sulge
              </button>
            </div>
          </div>
        )}

        <div className="home-modes">
          <button className="mode-card" onClick={() => { setGame(EMPTY_STATE); setAppMode('single') }}>
            <span className="mode-icon">🖥️</span>
            <span className="mode-title">Ühe seadmega</span>
            <span className="mode-desc">Mängige kõik sama seadme taga kordamööda</span>
          </button>
          <button className="mode-card" onClick={() => setAppMode('multi-create')}>
            <span className="mode-icon">🌐</span>
            <span className="mode-title">Loo tuba</span>
            <span className="mode-desc">Loo uus mängutuba ja kutsu teised ruumikoodiga</span>
          </button>
          <button className="mode-card" onClick={() => setAppMode('multi-join')}>
            <span className="mode-icon">🔑</span>
            <span className="mode-title">Liitu toaga</span>
            <span className="mode-desc">Sisesta ruumikood ja liitu sõbra mänguga</span>
          </button>
        </div>

        <button className="admin-link" onClick={() => setAppMode('admin')}>
          ⚙ Admin-paneel
        </button>
      </main>
    )
  }

  if (appMode === 'admin') {
    return (
      <main>
        <h1>Saladuse Jälil</h1>
        <AdminHome
          onBack={() => setAppMode('home')}
          onCreateNew={() => setAppMode('admin-create')}
        />
      </main>
    )
  }

  if (appMode === 'admin-create') {
    return (
      <main>
        <h1>Saladuse Jälil</h1>
        <CaseEditor onBack={() => setAppMode('admin')} />
      </main>
    )
  }

  if (appMode === 'multi-create') {
    return (
      <main>
        <h1>Saladuse Jälil</h1>
        <CreateRoom
          onBack={() => setAppMode('home')}
          onCreated={session => {
            saveSession(session)
            setLobbySession(session)
            setSavedSession(session)
            setAppMode('multi-lobby')
          }}
        />
      </main>
    )
  }

  if (appMode === 'multi-join') {
    return (
      <main>
        <h1>Saladuse Jälil</h1>
        <JoinRoom
          onBack={() => setAppMode('home')}
          onJoined={session => {
            saveSession(session)
            setLobbySession(session)
            setSavedSession(session)
            setAppMode('multi-lobby')
          }}
        />
      </main>
    )
  }

  if (appMode === 'multi-lobby' && lobbySession) {
    return (
      <main>
        <h1>Saladuse Jälil</h1>
        <Lobby session={lobbySession} onBack={() => setAppMode('home')} />
      </main>
    )
  }

  // appMode === 'single' — olemasolev ühe seadme mäng

  if (game.status === 'idle') {
    return (
      <main>
        <h1>Saladuse Jälil</h1>
        <div className="start-screen">
          <button className="btn-back" onClick={() => setAppMode('home')}>← Tagasi</button>
          <div className="case-list">
            <p className="case-list-label">Vali juhtum</p>
            {allCases.map(c => (
              <button
                key={c.id}
                type="button"
                className={`case-card ${selectedCase.id === c.id ? 'case-card-selected' : ''}`}
                onClick={() => {
                  setSelectedCase(c)
                  setPlayerCount(prev => Math.min(Math.max(prev, c.minPlayers), c.maxPlayers))
                }}
              >
                <span className="case-card-title">{c.title}</span>
                <span className="case-card-meta">
                  {{ easy: 'Lihtne', medium: 'Keskmine', hard: 'Raske' }[c.difficulty]} · {c.minPlayers}–{c.maxPlayers} mängijat
                </span>
              </button>
            ))}
          </div>

          <div className="player-count-select">
            <p className="case-list-label">Mängijate arv</p>
            <div className="player-count-buttons">
              {Array.from(
                { length: selectedCase.maxPlayers - selectedCase.minPlayers + 1 },
                (_, i) => selectedCase.minPlayers + i
              ).map(n => (
                <button
                  key={n}
                  type="button"
                  className={`player-count-btn ${playerCount === n ? 'player-count-active' : ''}`}
                  onClick={() => setPlayerCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="start-buttons">
            <button className="btn-primary" onClick={startGame}>
              Alusta — {playerCount} mängijat
            </button>
            <button className="btn-secondary" onClick={() => setShowRules(true)}>
              ? Kuidas mängida
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Ruumi valik korra alguses
  if (game.status === 'playing' && game.phase === 'choosing-room' && activePlayer) {
    const isEliminated = game.eliminatedPlayers.includes(activePlayer.id)
    return (
      <main>
        <h1>Saladuse Jälil</h1>
        {showRules && <HowToPlay onClose={() => setShowRules(false)} />}
        <div className="turn-bar">
          <div className="turn-bar-top">
            <span className="turn-label">Kord:</span>
            <span className="turn-player">{activePlayer.name}</span>
            <div className="tab-buttons">
              <button className={`tab-btn ${tab === 'game' ? 'tab-active' : ''}`} onClick={() => setTab('game')}>Mäng</button>
              <button className={`tab-btn ${tab === 'notebook' ? 'tab-active' : ''}`} onClick={() => setTab('notebook')}>Märkmik</button>
              <button className="tab-btn" onClick={() => setShowRules(true)} title="Mängureeglid">?</button>
            </div>
          </div>
        </div>

        {tab === 'notebook' && (
          <>
            <GridNotebook
              gameCase={selectedCase}
              players={game.players.map(p => ({ id: p.id, name: p.name }))}
              myPlayerId={activePlayer.id}
              notes={game.notes[activePlayer.id] ?? {}}
              onUpdate={(cardId, targetId, value) => updateNote(activePlayer.id, cardId, targetId, value)}
            />
            {game.history.length > 0 && (
              <section className="history-section" style={{ marginTop: '1rem' }}>
                <h2>Tegevuste ajalugu ({game.history.length})</h2>
                <ol>
                  {game.history.map((h, i) => (
                    <li key={i} className="history-item">
                      <span className="history-player">{h.playerName}</span> arvas:{' '}
                      <span className="history-cards">{h.suspect} · {h.location} · {h.item}</span>
                      <span className="history-result"> — {h.result}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </>
        )}

        {tab === 'game' && (
          <div className="room-choice-screen">
            {isEliminated ? (
              <div className="eliminated-notice">
                <p>Tegid vale süüdistuse. Jätkad mängu, aga ei saa enam hüpoteese ega süüdistusi teha.</p>
                <p className="eliminated-hint">Ootab järgmise mängija korda...</p>
                <button className="btn-secondary" onClick={() => {
                  setGame(prev => ({
                    ...prev,
                    phase: 'choosing-room',
                    activeRoom: null,
                    activePlayerIndex: (prev.activePlayerIndex + 1) % prev.players.length,
                  }))
                }}>Edasi →</button>
              </div>
            ) : (
              <>
                <p className="room-choice-hint">Vali ruum mida külastad sel korral. Sinu hüpotees esitatakse sellest ruumist.</p>
                <div className="room-choice-grid">
                  {selectedCase.locations.map(loc => (
                    <button key={loc.id} className="room-choice-btn" onClick={() => { setTab('game'); chooseRoom(loc.id) }}>
                      <span className="room-choice-name">{loc.name}</span>
                      <span className="room-choice-desc">{loc.description}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {game.history.length > 0 && (
              <section className="history-section">
                <h2>Tegevuste ajalugu ({game.history.length})</h2>
                <ol>
                  {game.history.map((h, i) => (
                    <li key={i} className="history-item">
                      <span className="history-player">{h.playerName}</span> arvas:{' '}
                      <span className="history-cards">{h.suspect} · {h.location} · {h.item}</span>
                      <span className="history-result"> — {h.result}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        )}
      </main>
    )
  }

  if (game.status === 'finished') {
    return (
      <main>
        <h1>Saladuse Jälil</h1>
        <FinishedScreen
          winner={game.winner}
          solution={game.solution!}
          onRestart={startGame}
        />
      </main>
    )
  }

  if (game.phase === 'handoff-to-refuter' && game.refuterIndex !== null) {
    return (
      <main>
        <h1>Saladuse Jälil</h1>
        <HandoffToRefuterScreen
          refuterName={game.players[game.refuterIndex].name}
          askerName={activePlayer.name}
          onConfirm={() => setGame(prev => ({ ...prev, phase: 'revealing' }))}
        />
      </main>
    )
  }

  if (game.phase === 'revealing' && game.refuterIndex !== null) {
    const refuter = game.players[game.refuterIndex]
    return (
      <main>
        <h1>Saladuse Jälil</h1>
        <div className="turn-bar">
          <div className="turn-bar-top">
            <span className="turn-label">Valib:</span>
            <span className="turn-player">{refuter.name}</span>
            <div className="tab-buttons">
              <button className={`tab-btn ${tab === 'game' ? 'tab-active' : ''}`} onClick={() => setTab('game')}>Kaardid</button>
              <button className={`tab-btn ${tab === 'notebook' ? 'tab-active' : ''}`} onClick={() => setTab('notebook')}>Märkmik</button>
            </div>
          </div>
        </div>
        {tab === 'game' && (
          <RevealScreen
            refuterName={refuter.name}
            askerName={activePlayer.name}
            options={game.refuterOptions}
            onReveal={card => { setTab('game'); revealCard(card) }}
          />
        )}
        {tab === 'notebook' && (
          <>
            <div className="notebook-selection-bar">
              <span className="nsb-label">Vali kaart mida näidata — vaata märkmikust</span>
              <button className="btn-secondary nsb-switch" onClick={() => setTab('game')}>← Tagasi valikule</button>
            </div>
            <GridNotebook
              gameCase={selectedCase}
              players={game.players.map(p => ({ id: p.id, name: p.name }))}
              myPlayerId={refuter.id}
              notes={game.notes[refuter.id] ?? {}}
              onUpdate={(cardId, targetId, value) => updateNote(refuter.id, cardId, targetId, value)}
            />
            {game.history.length > 0 && (
              <section className="history-section" style={{ marginTop: '1rem' }}>
                <h2>Tegevuste ajalugu ({game.history.length})</h2>
                <ol>
                  {game.history.map((h, i) => (
                    <li key={i} className="history-item">
                      <span className="history-player">{h.playerName}</span> arvas:{' '}
                      <span className="history-cards">{h.suspect} · {h.location} · {h.item}</span>
                      <span className="history-result"> — {h.result}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </>
        )}
      </main>
    )
  }

  if (game.phase === 'handoff-to-asker' && game.shownCard) {
    return (
      <main>
        <h1>Saladuse Jälil</h1>
        <HandoffToAskerScreen
          askerName={activePlayer.name}
          onConfirm={() => setGame(prev => ({ ...prev, phase: 'card-shown' }))}
        />
      </main>
    )
  }

  if (game.phase === 'card-shown' && game.shownCard) {
    return (
      <main>
        <h1>Saladuse Jälil</h1>
        <div className="turn-bar">
          <div className="turn-bar-top">
            <span className="turn-label">Kord:</span>
            <span className="turn-player">{activePlayer.name}</span>
            <div className="tab-buttons">
              <button className={`tab-btn ${tab === 'game' ? 'tab-active' : ''}`} onClick={() => setTab('game')}>Mäng</button>
              <button className={`tab-btn ${tab === 'notebook' ? 'tab-active' : ''}`} onClick={() => setTab('notebook')}>Märkmik</button>
            </div>
          </div>
        </div>
        {tab === 'game' && (
          <CardShownScreen
            askerName={activePlayer.name}
            shownCard={game.shownCard}
            onConfirm={() => { setTab('game'); confirmShownCard() }}
          />
        )}
        {tab === 'notebook' && (
          <>
            <div className="notebook-selection-bar">
              <span className="nsb-label">Sulle näidati:</span>
              <div className="nsb-selects">
                <div className="nsb-row">
                  <span className="nsb-cat" style={{ color: '#c9a227' }}>{game.shownCard.name}</span>
                </div>
              </div>
              <button className="btn-secondary nsb-switch" onClick={() => setTab('game')}>← Tagasi</button>
            </div>
            <GridNotebook
              gameCase={selectedCase}
              players={game.players.map(p => ({ id: p.id, name: p.name }))}
              myPlayerId={activePlayer.id}
              notes={game.notes[activePlayer.id] ?? {}}
              onUpdate={(cardId, targetId, value) => updateNote(activePlayer.id, cardId, targetId, value)}
            />
            {game.history.length > 0 && (
              <section className="history-section" style={{ marginTop: '1rem' }}>
                <h2>Tegevuste ajalugu ({game.history.length})</h2>
                <ol>
                  {game.history.map((h, i) => (
                    <li key={i} className="history-item">
                      <span className="history-player">{h.playerName}</span> arvas:{' '}
                      <span className="history-cards">{h.suspect} · {h.location} · {h.item}</span>
                      <span className="history-result"> — {h.result}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </>
        )}
      </main>
    )
  }

  const activeIsEliminated = game.eliminatedPlayers.includes(activePlayer.id)

  return (
    <main>
      <h1>Saladuse Jälil</h1>
      {showRules && <HowToPlay onClose={() => setShowRules(false)} />}

      <div className="turn-bar">
        <div className="turn-bar-top">
          <span className="turn-label">Kord:</span>
          <span className="turn-player">
            {activePlayer.name}
            {activeIsEliminated && <span className="eliminated-badge-small"> (väljas)</span>}
          </span>
          <div className="tab-buttons">
            <button className={`tab-btn ${tab === 'game' ? 'tab-active' : ''}`} onClick={() => setTab('game')}>
              Mäng
            </button>
            <button className={`tab-btn ${tab === 'notebook' ? 'tab-active' : ''}`} onClick={() => setTab('notebook')}>
              Märkmik
            </button>
            <button className="tab-btn" onClick={() => setShowRules(true)} title="Mängureeglid">?</button>
          </div>
        </div>
        {!activeIsEliminated && (
          <p className="turn-instruction">
            {game.activeRoom
              ? `Oled: ${selectedCase.locations.find(l => l.id === game.activeRoom)?.name} · Esita hüpotees, seejärel tee märkmeid. Kui oled kindel kõigis kolmes → tee lõplik süüdistus.`
              : 'Vali ruum mida külastad.'}
          </p>
        )}
      </div>

      {tab === 'notebook' && (
        <>
          {aOpen && (
            <div className="notebook-selection-bar">
              <span className="nsb-label">Süüdistuse valik:</span>
              <div className="nsb-selects">
                <div className="nsb-row">
                  <span className="nsb-cat">Tegelane</span>
                  <select value={aSuspectId} onChange={e => setASuspectId(e.target.value)} className="nsb-select">
                    {selectedCase.suspects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="nsb-row">
                  <span className="nsb-cat">Asukoht</span>
                  <select value={aLocationId} onChange={e => setALocationId(e.target.value)} className="nsb-select">
                    {selectedCase.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="nsb-row">
                  <span className="nsb-cat">Ese</span>
                  <select value={aItemId} onChange={e => setAItemId(e.target.value)} className="nsb-select">
                    {selectedCase.items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-secondary nsb-switch" onClick={() => setTab('game')}>← Tagasi mängu</button>
            </div>
          )}
          {!aOpen && game.activeRoom && (
            <div className="notebook-selection-bar">
              <span className="nsb-label">Praegune valik:</span>
              <div className="nsb-selects">
                <div className="nsb-row">
                  <span className="nsb-cat">Tegelane</span>
                  <select value={hSuspectId} onChange={e => setHSuspectId(e.target.value)} className="nsb-select">
                    {selectedCase.suspects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="nsb-row">
                  <span className="nsb-cat">Ruum</span>
                  <span className="nsb-locked">{selectedCase.locations.find(l => l.id === game.activeRoom)?.name}</span>
                </div>
                <div className="nsb-row">
                  <span className="nsb-cat">Ese</span>
                  <select value={hItemId} onChange={e => setHItemId(e.target.value)} className="nsb-select">
                    {selectedCase.items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-secondary nsb-switch" onClick={() => setTab('game')}>← Tagasi mängu</button>
            </div>
          )}
          <GridNotebook
            gameCase={selectedCase}
            players={game.players.map(p => ({ id: p.id, name: p.name }))}
            myPlayerId={activePlayer.id}
            notes={game.notes[activePlayer.id] ?? {}}
            onUpdate={(cardId, targetId, value) => updateNote(activePlayer.id, cardId, targetId, value)}
          />
          {game.history.length > 0 && (
            <section className="history-section" style={{ marginTop: '1rem' }}>
              <h2>Tegevuste ajalugu ({game.history.length})</h2>
              <ol>
                {game.history.map((h, i) => (
                  <li key={i} className="history-item">
                    <span className="history-player">{h.playerName}</span> arvas:{' '}
                    <span className="history-cards">{h.suspect} · {h.location} · {h.item}</span>
                    <span className="history-result"> — {h.result}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </>
      )}

      {tab === 'game' && (
        <div className="playing-layout">
          <div className="playing-left">
            {game.activeRoom && (
              <HypothesisForm
                playerName={activePlayer.name}
                gameCase={selectedCase}
                activeRoom={game.activeRoom}
                suspectId={hSuspectId}
                itemId={hItemId}
                onSuspectChange={setHSuspectId}
                onItemChange={setHItemId}
                onSubmit={submitHypothesis}
              />
            )}
            <AccusationForm
              playerName={activePlayer.name}
              gameCase={selectedCase}
              open={aOpen}
              suspectId={aSuspectId}
              locationId={aLocationId}
              itemId={aItemId}
              onOpenChange={setAOpen}
              onSuspectChange={setASuspectId}
              onLocationChange={setALocationId}
              onItemChange={setAItemId}
              onSubmit={submitAccusation}
            />
          </div>

          <div className="playing-right">
            <section className="history-section">
              <h2>Tegevuste ajalugu ({game.history.length})</h2>
              {game.history.length === 0 && (
                <p className="history-empty">Hüpoteese pole veel esitatud.</p>
              )}
              <ol>
                {game.history.map((h, i) => (
                  <li key={i} className="history-item">
                    <span className="history-player">{h.playerName}</span> arvas:{' '}
                    <span className="history-cards">{h.suspect} · {h.location} · {h.item}</span>
                    <span className="history-result"> — {h.result}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="player-section player-active">
              <h2>Sinu kaardid <span className="card-count">({activePlayer.hand.length})</span></h2>
              <p className="hand-hint">Need kaardid <strong>ei ole</strong> lahendus.</p>
              <ul>
                {activePlayer.hand.map(card => (
                  <li key={card.id}>{card.name}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
