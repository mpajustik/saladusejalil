import { submitSuggestion } from '../../api/gameApi'
import type { MysteryCase } from '../../types/case'
import { useState } from 'react'

interface Props {
  gameId: string
  playerId: string
  gameCase: MysteryCase
  activeRoom: string
  suspectId: string
  itemId: string
  onSuspectChange: (id: string) => void
  onItemChange: (id: string) => void
  onSubmitted: () => void
}

export function HypothesisForm({
  gameId, playerId, gameCase, activeRoom,
  suspectId, itemId, onSuspectChange, onItemChange, onSubmitted,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const roomName = gameCase.locations.find(l => l.id === activeRoom)?.name ?? activeRoom

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await submitSuggestion(gameId, playerId, suspectId, activeRoom, itemId)
      onSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Viga')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="hypothesis-form" onSubmit={handleSubmit}>
      <h3>Esita hüpotees</h3>
      <p className="hypothesis-hint">
        Järgmine mängija kellel on sobiv kaart, näitab seda sulle salaja.
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
      {error && <p className="lobby-error">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Saadan…' : 'Esita hüpotees'}
      </button>
    </form>
  )
}
