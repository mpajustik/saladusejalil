import { useEffect, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getPublicState, getPrivateState, startGame, revealCard } from '../../api/gameApi'
import { connectSocket, disconnectSocket, getSocket } from '../../api/socket'
import { HypothesisForm } from './HypothesisForm'
import { AccusationForm } from './AccusationForm'
import { HowToPlay } from '../HowToPlay'
import { getCaseById } from '../../data/caseRegistry'
import { GridNotebook } from '../GridNotebook'
import { loadLobbyNotes, saveLobbyNote } from '../../utils/lobbyNotes'
import type { PublicGameState, PublicPlayer, PrivateCard } from '../../api/gameApi'
import type { MysteryCase } from '../../types/case'
import type { CellValue, GridNotes } from '../../types/game'

interface MatchingCard { id: string; name: string }
interface RevealedCard { name: string; revealerName: string; revealerId: string; cardId: string }

interface Session {
  gameId: string
  playerId: string
  roomCode: string
}

interface Props {
  session: Session
  onBack: () => void
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'
type LobbyTab = 'game' | 'hand' | 'notebook'

interface TurnInfo {
  currentPlayerId: string
  currentPlayerName: string
  lastAction: string | null
}

interface HypothesisEvent {
  playerName: string
  suspect: string
  location: string
  item: string
  canRefute: boolean
  refuterName: string | null
  refuterId: string | null
  revealed?: boolean
}

export function Lobby({ session, onBack }: Props) {
  const [gameState, setGameState]             = useState<PublicGameState | null>(null)
  const [connStatus, setConnStatus]           = useState<ConnectionStatus>('connecting')
  const [turnInfo, setTurnInfo]               = useState<TurnInfo | null>(null)
  const [hypothesisLog, setHypothesisLog]     = useState<HypothesisEvent[]>([])
  const [pendingReveal, setPendingReveal]     = useState<HypothesisEvent | null>(null)
  const [gameCase, setGameCase]               = useState<MysteryCase | null>(null)
  const [myHand, setMyHand]                   = useState<PrivateCard[]>([])
  const [notes, setNotes]                     = useState<GridNotes>(() =>
    loadLobbyNotes(session.gameId, session.playerId) as GridNotes
  )
  const [hypothesisSubmitted, setHypothesisSubmitted] = useState(false)
  const [refuterCards, setRefuterCards]       = useState<MatchingCard[]>([])
  const [revealedCard, setRevealedCard]       = useState<RevealedCard | null>(null)
  const [revealLoading, setRevealLoading]     = useState(false)
  const [startError, setStartError]           = useState<string | null>(null)
  const [starting, setStarting]               = useState(false)
  const playerIdsRef = useRef<string[]>([])
  const [showRules, setShowRules] = useState(false)
  const [tab, setTab]                         = useState<LobbyTab>('game')
  const [activeRoom, setActiveRoom]           = useState<string | null>(null)
  const [gameOver, setGameOver]               = useState<{ winner: string; solution: { suspect: string; location: string; item: string } } | null>(null)
  const [showQr, setShowQr]                   = useState(false)
  // Valikud hüpoteesi jaoks — ei lähtesta tab-i vahetamisel
  const [hSuspectId, setHSuspectId]           = useState('')
  const [hItemId, setHItemId]                 = useState('')
  // Valikud süüdistuse jaoks — ei lähtesta tab-i vahetamisel
  const [aOpen, setAOpen]                     = useState(false)
  const [aSuspectId, setASuspectId]           = useState('')
  const [aLocationId, setALocationId]         = useState('')
  const [aItemId, setAItemId]                 = useState('')

  // Socket ühendus ja sündmused
  useEffect(() => {
    const socket = connectSocket()

    function onConnect() {
      setConnStatus('connected')
      socket.emit('join_room', { gameId: session.gameId, playerId: session.playerId })
      Promise.all([
        getPublicState(session.gameId),
        getPrivateState(session.gameId, session.playerId),
      ]).then(([pub, priv]) => {
        setGameState(pub)
        playerIdsRef.current = pub.players.map(p => p.id)
        setMyHand(priv.hand)
        const foundCase = getCaseById(pub.caseId)
        if (foundCase) {
          setGameCase(foundCase)
          setHSuspectId(prev => prev || foundCase.suspects[0].id)
          setHItemId(prev => prev || foundCase.items[0].id)
          setASuspectId(prev => prev || foundCase.suspects[0].id)
          setALocationId(prev => prev || foundCase.locations[0].id)
          setAItemId(prev => prev || foundCase.items[0].id)
          if (priv.hand.length > 0) applyOwnHandToNotes(priv.hand, foundCase, pub.players.map(p => p.id))
        }
        if (pub.status === 'in_progress' && pub.currentPlayerId) {
          const cur = pub.players.find(p => p.id === pub.currentPlayerId)
          setTurnInfo({ currentPlayerId: pub.currentPlayerId, currentPlayerName: cur?.name ?? '?', lastAction: pub.lastAction })
        }
      }).catch(() => {})
    }
    function onDisconnect() { setConnStatus('disconnected') }

    function onPlayerJoined(data: { players: PublicPlayer[] }) {
      playerIdsRef.current = data.players.map(p => p.id)
      setGameState(prev => prev ? { ...prev, players: data.players } : prev)
    }

    function onGameStarted(data: { currentPlayerId: string; currentPlayerName: string }) {
      setTurnInfo({ currentPlayerId: data.currentPlayerId, currentPlayerName: data.currentPlayerName, lastAction: 'Mäng algas.' })
      setGameState(prev => prev ? { ...prev, status: 'in_progress', currentPlayerId: data.currentPlayerId } : prev)
      setHypothesisSubmitted(false)
      setActiveRoom(null)
      // Näita reegleid esimesel korral kui mäng algab
      if (!localStorage.getItem('sj_seen_rules')) {
        setShowRules(true)
        localStorage.setItem('sj_seen_rules', '1')
      }
      // Kaardid jagatakse mängu alustamisel — lae pub+priv koos (vajame caseId jaoks)
      Promise.all([
        getPublicState(session.gameId),
        getPrivateState(session.gameId, session.playerId),
      ]).then(([pub, priv]) => {
        setMyHand(priv.hand)
        const foundCase = getCaseById(pub.caseId)
        if (foundCase) {
          setGameCase(foundCase)
          setHSuspectId(prev => prev || foundCase.suspects[0].id)
          setHItemId(prev => prev || foundCase.items[0].id)
          setASuspectId(prev => prev || foundCase.suspects[0].id)
          setALocationId(prev => prev || foundCase.locations[0].id)
          setAItemId(prev => prev || foundCase.items[0].id)
          applyOwnHandToNotes(priv.hand, foundCase, pub.players.map(p => p.id))
        }
      }).catch(() => {})
    }

    function onTurnChanged(data: { currentPlayerId: string; currentPlayerName: string; lastAction: string }) {
      setTurnInfo({ currentPlayerId: data.currentPlayerId, currentPlayerName: data.currentPlayerName, lastAction: data.lastAction })
      setGameState(prev => prev ? { ...prev, currentPlayerId: data.currentPlayerId, lastAction: data.lastAction } : prev)
      setHypothesisSubmitted(false)
      setPendingReveal(null)
      setRefuterCards([])
      // NB: setRevealedCard(null) EI käi siia — kaart peab olema näha kuni mängija ise kinnitab
      setActiveRoom(null)
      setAOpen(false)
      setTab('game')
    }

    function onHypothesisMade(data: HypothesisEvent) {
      setHypothesisLog(prev => [...prev, data])
      if (data.refuterId) setPendingReveal(data)
    }

    function onRefuterOptions(data: { askerName: string; matchingCards: MatchingCard[] }) {
      setRefuterCards(data.matchingCards)
    }

    function onCardRevealed(data: { revealerName: string; revealerId: string; card: { id: string; name: string } }) {
      setRevealedCard({
        name: data.card.name,
        revealerName: data.revealerName,
        revealerId: data.revealerId,
        cardId: data.card.id,
      })
      // Kindel fakt: auto-märgi refuteerija X, teised — (playerIdsRef on alati ajakohane)
      if (data.revealerId && data.card.id) {
        applyKnownFactNote(data.card.id, data.revealerId, playerIdsRef.current)
      }
    }

    function onRevealDone(_data: { revealerName: string; askerName: string }) {
      setRefuterCards([])
      setPendingReveal(null)
      setHypothesisLog(prev => {
        const idx = [...prev].reverse().findIndex(h => h.canRefute && !h.revealed)
        if (idx === -1) return prev
        const realIdx = prev.length - 1 - idx
        return prev.map((h, i) => i === realIdx ? { ...h, revealed: true } : h)
      })
    }

    function onGameOver(data: { winner: string; solution: { suspect: string; location: string; item: string } }) {
      setGameOver(data)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('player_joined', onPlayerJoined)
    socket.on('game_started', onGameStarted)
    socket.on('turn_changed', onTurnChanged)
    socket.on('hypothesis_made', onHypothesisMade)
    socket.on('refuter_options', onRefuterOptions)
    socket.on('card_revealed', onCardRevealed)
    socket.on('reveal_done', onRevealDone)
    socket.on('game_over', onGameOver)
    if (socket.connected) onConnect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('player_joined', onPlayerJoined)
      socket.off('game_started', onGameStarted)
      socket.off('turn_changed', onTurnChanged)
      socket.off('hypothesis_made', onHypothesisMade)
      socket.off('refuter_options', onRefuterOptions)
      socket.off('card_revealed', onCardRevealed)
      socket.off('reveal_done', onRevealDone)
      socket.off('game_over', onGameOver)
      disconnectSocket()
    }
  }, [session.gameId, session.playerId])

  // Algne laadimine — kombineerime pub+priv et vältida stale closure probleemi
  useEffect(() => {
    Promise.all([
      getPublicState(session.gameId),
      getPrivateState(session.gameId, session.playerId),
    ]).then(([pub, priv]) => {
      setGameState(pub)
      playerIdsRef.current = pub.players.map(p => p.id)
      setMyHand(priv.hand)
      const foundCase = getCaseById(pub.caseId)
      if (foundCase) {
        setGameCase(foundCase)
        setHSuspectId(prev => prev || foundCase.suspects[0].id)
        setHItemId(prev => prev || foundCase.items[0].id)
        setASuspectId(prev => prev || foundCase.suspects[0].id)
        setALocationId(prev => prev || foundCase.locations[0].id)
        setAItemId(prev => prev || foundCase.items[0].id)
        if (priv.hand.length > 0) applyOwnHandToNotes(priv.hand, foundCase, pub.players.map(p => p.id))
      }
      if (pub.status === 'in_progress' && pub.currentPlayerId) {
        const cur = pub.players.find(p => p.id === pub.currentPlayerId)
        setTurnInfo({ currentPlayerId: pub.currentPlayerId, currentPlayerName: cur?.name ?? '?', lastAction: pub.lastAction })
      }
    }).catch(() => {})
  }, [session.gameId, session.playerId])

  function updateNote(cardId: string, targetPlayerId: string, value: CellValue) {
    // Käsitsi klikk — EI automaattäida teisi lahtreid
    setNotes(prev => {
      const updated: GridNotes = {
        ...prev,
        [cardId]: { ...(prev[cardId] ?? {}), [targetPlayerId]: value },
      }
      saveLobbyNote(session.gameId, session.playerId, updated)
      return updated
    })
  }

  // Kindel fakt: keegi OMA kindlasti seda kaarti → teised kindlasti ei oma
  function applyKnownFactNote(cardId: string, ownerId: string, allPlayerIds: string[]) {
    setNotes(prev => {
      const cardCells = { ...(prev[cardId] ?? {}), [ownerId]: 'has' as CellValue }
      for (const pid of allPlayerIds) {
        if (pid !== ownerId) cardCells[pid] = 'no'
      }
      const updated: GridNotes = { ...prev, [cardId]: cardCells }
      saveLobbyNote(session.gameId, session.playerId, updated)
      return updated
    })
  }

  function applyOwnHandToNotes(hand: PrivateCard[], gc: MysteryCase, allPlayerIds: string[] = []) {
    const handIds = new Set(hand.map(c => c.id))
    const allCards = [...gc.suspects, ...gc.locations, ...gc.items]
    setNotes(prev => {
      const updated: GridNotes = { ...prev }
      for (const card of allCards) {
        const iHaveIt = handIds.has(card.id)
        const cardCells = { ...(updated[card.id] ?? {}) }
        cardCells[session.playerId] = iHaveIt ? 'has' : 'no'
        // Kui mul on see kaart, siis teistel kindlasti pole
        if (iHaveIt) {
          for (const otherId of allPlayerIds) {
            if (otherId !== session.playerId) cardCells[otherId] = 'no'
          }
        }
        updated[card.id] = cardCells
      }
      saveLobbyNote(session.gameId, session.playerId, updated)
      return updated
    })
  }

  async function handleStartGame() {
    setStarting(true)
    setStartError(null)
    try { await startGame(session.gameId, session.playerId) }
    catch (err) { setStartError(err instanceof Error ? err.message : 'Viga') }
    finally { setStarting(false) }
  }

  function handleEndTurn() {
    getSocket().emit('end_turn', { gameId: session.gameId, playerId: session.playerId })
  }

  async function handleRevealCard(cardId: string) {
    setRevealLoading(true)
    try { await revealCard(session.gameId, session.playerId, cardId) }
    finally { setRevealLoading(false) }
  }

  const myPlayer    = gameState?.players.find(p => p.id === session.playerId)
  const isHost      = myPlayer?.isHost ?? false
  const isMyTurn    = turnInfo?.currentPlayerId === session.playerId
  const gameInProgress = gameState?.status === 'in_progress'
  const iAmRefuter  = pendingReveal?.refuterId === session.playerId

  const statusDot: Record<ConnectionStatus, { cls: string; label: string }> = {
    connecting:   { cls: 'conn-connecting',   label: 'Ühendan…' },
    connected:    { cls: 'conn-connected',    label: 'Ühendatud' },
    disconnected: { cls: 'conn-disconnected', label: 'Ühendus katkes' },
  }
  const { cls, label } = statusDot[connStatus]

  const activeRoomName = activeRoom && gameCase
    ? gameCase.locations.find(l => l.id === activeRoom)?.name
    : null

  if (gameOver) {
    return (
      <div className="lobby-screen">
        <div className="finished-screen">
          <div className="finished-icon">🏆</div>
          <h2 className="finished-win">{gameOver.winner} võitis!</h2>
          <div className="finished-solution">
            <p className="finished-solution-title">Lahendus oli:</p>
            <div className="solution-row"><span className="solution-label">Tegelane:</span><span className="solution-value">{gameOver.solution.suspect}</span></div>
            <div className="solution-row"><span className="solution-label">Asukoht:</span><span className="solution-value">{gameOver.solution.location}</span></div>
            <div className="solution-row"><span className="solution-label">Ese:</span><span className="solution-value">{gameOver.solution.item}</span></div>
          </div>
          <button className="btn-primary" onClick={onBack}>Tagasi avalehele</button>
        </div>
      </div>
    )
  }

  return (
    <div className="lobby-screen">
      {showRules && <HowToPlay onClose={() => setShowRules(false)} />}

      <div className="lobby-topbar">
        <button className="btn-back" onClick={onBack}>← Tagasi</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="lobby-rules-btn" onClick={() => setShowRules(true)} title="Mängureeglid">
            ? Reeglid
          </button>
          <span className={`conn-badge ${cls}`}>{label}</span>
        </div>
      </div>

      <h2>{gameInProgress ? 'Mäng käib' : 'Ootesaal'}</h2>
      {gameCase && (
        <p className="lobby-case-name">
          {gameCase.title}
          <span className="lobby-case-diff">
            {' '}·{{ easy: 'Lihtne', medium: 'Keskmine', hard: 'Raske' }[gameCase.difficulty]}
          </span>
        </p>
      )}

      {/* Mängijate nimekiri ja kord */}
      {gameState && (
        <div className="lobby-players">
          <div className="lobby-players-header">
            <h3>Mängijad ({gameState.players.length})</h3>
            {isMyTurn && gameInProgress && (
              <span className="your-turn-badge">Sinu kord!</span>
            )}
          </div>
          <ul>
            {gameState.players.map(player => (
              <li key={player.id} className={[
                player.id === session.playerId ? 'player-me' : '',
                turnInfo?.currentPlayerId === player.id ? 'player-turn' : '',
              ].join(' ')}>
                {turnInfo?.currentPlayerId === player.id && <span className="turn-arrow">▶ </span>}
                {player.name}
                {player.isHost && <span className="host-badge"> (peremees)</span>}
                {player.id === session.playerId && <span className="me-badge"> (mina)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alumine navigatsioon — ainult kui mäng käib */}
      {gameInProgress && (
        <nav className="bottom-nav">
          <button
            className={`bnav-btn ${tab === 'game' ? 'bnav-active' : ''}`}
            onClick={() => setTab('game')}
          >
            <span className="bnav-icon">{isMyTurn ? '🎯' : '🎲'}</span>
            <span className="bnav-label">Mäng</span>
            {isMyTurn && !activeRoom && <span className="bnav-dot" />}
          </button>
          <button
            className={`bnav-btn ${tab === 'hand' ? 'bnav-active' : ''}`}
            onClick={() => setTab('hand')}
          >
            <span className="bnav-icon">🃏</span>
            <span className="bnav-label">Kaardid</span>
            {myHand.length > 0 && <span className="bnav-count">{myHand.length}</span>}
          </button>
          <button
            className={`bnav-btn ${tab === 'notebook' ? 'bnav-active' : ''}`}
            onClick={() => setTab('notebook')}
          >
            <span className="bnav-icon">📓</span>
            <span className="bnav-label">Märkmik</span>
          </button>
        </nav>
      )}

      {/* ── TAB: MÄNG ── */}
      {(!gameInProgress || tab === 'game') && (
        <>
          {!gameInProgress && (
            <div className="room-code-box">
              <p className="room-code-label">Ruumikood</p>
              <p className="room-code">{session.roomCode}</p>
              <div className="room-code-actions">
                <p className="room-code-hint">Jaga seda koodi teistega.</p>
                <button className="btn-qr" onClick={() => setShowQr(true)}>QR kood</button>
              </div>
            </div>
          )}

          {showQr && (
            <div className="leave-modal-overlay" onClick={() => setShowQr(false)}>
              <div className="qr-modal" onClick={e => e.stopPropagation()}>
                <h3>Skaneeri liitumiseks</h3>
                <div className="qr-code-wrap">
                  <QRCodeSVG
                    value={`${window.location.origin}${window.location.pathname}?join=${session.roomCode}`}
                    size={200}
                    bgColor="#1e1e2e"
                    fgColor="#f0e6d0"
                    level="M"
                  />
                </div>
                <p className="qr-code-hint">Ruumikood: <strong>{session.roomCode}</strong></p>
                <button className="btn-secondary" onClick={() => setShowQr(false)}>Sulge</button>
              </div>
            </div>
          )}

          {gameInProgress && turnInfo && (
            <div className="turn-info-box">
              <p className="turn-info-current">
                Kord: <strong>{isMyTurn ? 'Sinu kord!' : turnInfo.currentPlayerName}</strong>
              </p>
              {activeRoomName && isMyTurn && (
                <p className="turn-info-room">Külastad: <strong>{activeRoomName}</strong></p>
              )}
              {turnInfo.lastAction && <p className="turn-info-last">{turnInfo.lastAction}</p>}

              {/* Ruumi valik korra alguses */}
              {isMyTurn && !activeRoom && !hypothesisSubmitted && !pendingReveal && gameCase && (
                <div className="lobby-room-choice">
                  <p className="lobby-room-choice-hint">
                    Vali ruum mida külastad sel korral. Hüpotees esitatakse sellest ruumist.
                  </p>
                  <div className="room-choice-grid">
                    {gameCase.locations.map(loc => (
                      <button key={loc.id} className="room-choice-btn" onClick={() => setActiveRoom(loc.id)}>
                        <span className="room-choice-name">{loc.name}</span>
                        <span className="room-choice-desc">{loc.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hüpotees kui ruum on valitud */}
              {isMyTurn && activeRoom && !hypothesisSubmitted && !pendingReveal && gameCase && (
                <HypothesisForm
                  gameId={session.gameId}
                  playerId={session.playerId}
                  gameCase={gameCase}
                  activeRoom={activeRoom}
                  suspectId={hSuspectId || gameCase.suspects[0].id}
                  itemId={hItemId || gameCase.items[0].id}
                  onSuspectChange={setHSuspectId}
                  onItemChange={setHItemId}
                  onSubmitted={() => setHypothesisSubmitted(true)}
                />
              )}

              {pendingReveal && !iAmRefuter && !revealedCard && (
                <p className="lobby-hint">{pendingReveal.refuterName} valib kaarti…</p>
              )}

              {iAmRefuter && refuterCards.length > 0 && (
                <div className="refuter-notice">
                  <p><strong>{pendingReveal?.playerName}</strong> arvas sinu käes olevat kaarti.</p>
                  <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.3rem' }}>Vali üks kaart näitamiseks:</p>
                  <div className="reveal-options" style={{ marginTop: '0.5rem' }}>
                    {refuterCards.map(card => (
                      <button key={card.id} className="btn-card-reveal" onClick={() => handleRevealCard(card.id)} disabled={revealLoading}>
                        {card.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {revealedCard && (
                <div className="shown-card-box">
                  <p className="shown-card-label">{revealedCard.revealerName} näitas sulle salaja:</p>
                  <p className="shown-card-name">{revealedCard.name}</p>
                  <p className="shown-card-hint">✓ Automaatselt märgitud märkmikusse — {revealedCard.revealerName} omab seda kaarti</p>
                  <button
                    className="btn-secondary"
                    style={{ marginTop: '0.7rem' }}
                    onClick={() => setRevealedCard(null)}
                  >
                    Sain aru ✓
                  </button>
                </div>
              )}

              {hypothesisSubmitted && !pendingReveal && (
                <p className="lobby-hint">Hüpotees esitatud. Oodatakse teisi…</p>
              )}

              {isMyTurn && activeRoom && !pendingReveal && !iAmRefuter && !revealedCard && gameCase && (
                <AccusationForm
                  gameId={session.gameId}
                  playerId={session.playerId}
                  gameCase={gameCase}
                  open={aOpen}
                  suspectId={aSuspectId}
                  locationId={aLocationId}
                  itemId={aItemId}
                  onOpenChange={setAOpen}
                  onSuspectChange={setASuspectId}
                  onLocationChange={setALocationId}
                  onItemChange={setAItemId}
                  onResult={(correct) => {
                    if (!correct) {
                      setHypothesisSubmitted(false)
                      setActiveRoom(null)
                      setAOpen(false)
                    }
                  }}
                />
              )}

              {isMyTurn && (hypothesisSubmitted || !pendingReveal) && !iAmRefuter && activeRoom && (
                <button className="btn-secondary" onClick={handleEndTurn} style={{ marginTop: '0.5rem' }}>
                  Lõpeta kord →
                </button>
              )}
            </div>
          )}

          {hypothesisLog.length > 0 && (
            <section className="history-section" style={{ marginTop: '1rem' }}>
              <h2>Hüpoteeside ajalugu ({hypothesisLog.length})</h2>
              <ol>
                {hypothesisLog.map((h, i) => (
                  <li key={i} className="history-item">
                    <span className="history-player">{h.playerName}</span> arvas:{' '}
                    <span className="history-cards">{h.suspect} · {h.location} · {h.item}</span>
                    <span className="history-result">
                      {' — '}{h.revealed ? `${h.refuterName} näitas üht kaarti` : h.canRefute ? `${h.refuterName} saab ümber lükata` : 'keegi ei saanud ümber lükata'}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {!gameInProgress && (
            <div className="lobby-status">
              {isHost ? (
                <>
                  {(gameState?.players.length ?? 0) >= 2
                    ? <button className="btn-primary" onClick={handleStartGame} disabled={starting}>
                        {starting ? 'Alustan…' : 'Alusta mängu'}
                      </button>
                    : <p className="lobby-hint">Oota, kuni vähemalt üks mängija liitub.</p>
                  }
                  {startError && <p className="lobby-error" style={{ marginTop: '0.5rem' }}>{startError}</p>}
                </>
              ) : (
                <p className="lobby-hint">Oota, kuni peremees alustab mängu.</p>
              )}
              {/* Reeglite nupp ootesaalis */}
              <button
                className="lobby-rules-prominent"
                onClick={() => setShowRules(true)}
              >
                📖 Kuidas mängida?
              </button>
            </div>
          )}
        </>
      )}

      {/* ── TAB: KAARDID ── */}
      {gameInProgress && tab === 'hand' && (
        <div className="lobby-hand">
          <h3 className="lobby-hand-title">Sinu käes olevad kaardid</h3>
          <p className="lobby-hand-hint">Need kaardid <strong>ei ole</strong> lahendus. Tõmba need oma märkmikus maha.</p>
          {myHand.length === 0 ? (
            <p className="lobby-hint">Kaardid laadivad…</p>
          ) : (
            <ul className="lobby-hand-list">
              {myHand.map(card => (
                <li key={card.id} className={`lobby-hand-card lobby-hand-${card.category}`}>
                  <span className="lobby-hand-category">
                    {{ suspect: 'Tegelane', location: 'Asukoht', item: 'Ese' }[card.category]}
                  </span>
                  <span className="lobby-hand-name">{card.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── TAB: MÄRKMIK ── */}
      {gameInProgress && tab === 'notebook' && gameCase && gameState && (
        <>
          {/* Praegune valik — nähtav märkmiku kõrval */}
          {isMyTurn && activeRoom && aOpen && (
            <div className="notebook-selection-bar">
              <span className="nsb-label">Süüdistuse valik:</span>
              <div className="nsb-selects">
                <div className="nsb-row">
                  <span className="nsb-cat">Tegelane</span>
                  <select value={aSuspectId} onChange={e => setASuspectId(e.target.value)} className="nsb-select">
                    {gameCase.suspects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="nsb-row">
                  <span className="nsb-cat">Asukoht</span>
                  <select value={aLocationId} onChange={e => setALocationId(e.target.value)} className="nsb-select">
                    {gameCase.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="nsb-row">
                  <span className="nsb-cat">Ese</span>
                  <select value={aItemId} onChange={e => setAItemId(e.target.value)} className="nsb-select">
                    {gameCase.items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-secondary nsb-switch" onClick={() => setTab('game')}>
                ← Tagasi mängu
              </button>
            </div>
          )}
          {isMyTurn && activeRoom && !aOpen && !hypothesisSubmitted && !pendingReveal && (
            <div className="notebook-selection-bar">
              <span className="nsb-label">Praegune valik:</span>
              <div className="nsb-selects">
                <div className="nsb-row">
                  <span className="nsb-cat">Tegelane</span>
                  <select
                    value={hSuspectId || gameCase.suspects[0].id}
                    onChange={e => setHSuspectId(e.target.value)}
                    className="nsb-select"
                  >
                    {gameCase.suspects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="nsb-row">
                  <span className="nsb-cat">Ruum</span>
                  <span className="nsb-locked">
                    {gameCase.locations.find(l => l.id === activeRoom)?.name ?? activeRoom}
                  </span>
                </div>
                <div className="nsb-row">
                  <span className="nsb-cat">Ese</span>
                  <select
                    value={hItemId || gameCase.items[0].id}
                    onChange={e => setHItemId(e.target.value)}
                    className="nsb-select"
                  >
                    {gameCase.items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-secondary nsb-switch" onClick={() => setTab('game')}>
                ← Tagasi mängu
              </button>
            </div>
          )}
          {!isMyTurn && (
            <p className="nsb-waiting">Oota oma korda. Vaata vahepeal märkmikku.</p>
          )}
          <GridNotebook
            gameCase={gameCase}
            players={gameState.players.map(p => ({ id: p.id, name: p.name }))}
            myPlayerId={session.playerId}
            notes={notes}
            onUpdate={updateNote}
          />
          {hypothesisLog.length > 0 && (
            <section className="history-section" style={{ marginTop: '1rem' }}>
              <h2>Tegevuste ajalugu ({hypothesisLog.length})</h2>
              <ol>
                {hypothesisLog.map((h, i) => (
                  <li key={i} className="history-item">
                    <span className="history-player">{h.playerName}</span> arvas:{' '}
                    <span className="history-cards">{h.suspect} · {h.location} · {h.item}</span>
                    <span className="history-result">
                      {' — '}{h.revealed ? `${h.refuterName} näitas üht kaarti` : h.canRefute ? `${h.refuterName} sai ümber lükata` : 'keegi ei saanud ümber lükata'}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </>
      )}
    </div>
  )
}
