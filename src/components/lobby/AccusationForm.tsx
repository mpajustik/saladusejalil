import { useState } from 'react'
import { makeAccusation } from '../../api/gameApi'
import type { MysteryCase } from '../../types/case'

interface Props {
  gameId: string
  playerId: string
  gameCase: MysteryCase
  onResult: (correct: boolean, winner?: string) => void
}

export function AccusationForm({ gameId, playerId, gameCase, onResult }: Props) {
  const [open, setOpen]             = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [suspectId, setSuspectId]   = useState(gameCase.suspects[0].id)
  const [locationId, setLocationId] = useState(gameCase.locations[0].id)
  const [itemId, setItemId]         = useState(gameCase.items[0].id)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)

  if (!open) {
    return (
      <div className="accusation-hint-wrap">
        <button className="btn-accusation" onClick={() => setOpen(true)}>
          Tee lõplik süüdistus
        </button>
        <p className="accusation-when-hint">
          Tee ainult siis, kui oled <strong>kindel</strong> kõigis kolmes. Vale = mängust välja!
        </p>
      </div>
    )
  }

  async function handleConfirm() {
    setLoading(true)
    setError(null)
    try {
      const result = await makeAccusation(gameId, playerId, suspectId, locationId, itemId)
      onResult(result.correct, result.winner)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Viga')
      setConfirming(false)
    } finally {
      setLoading(false)
    }
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
        {error && <p className="lobby-error">{error}</p>}
        <div className="accusation-actions">
          <button className="btn-primary" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Saadan…' : 'Jah, esitan süüdistuse!'}
          </button>
          <button className="btn-secondary" onClick={() => setConfirming(false)} disabled={loading}>
            ← Muuda valikut
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className="accusation-form" onSubmit={e => { e.preventDefault(); setConfirming(true) }}>
      <h3>Lõplik süüdistus</h3>
      <p className="accusation-warning">Hoiatus: vale vastus tähendab mängust väljalangemist!</p>
      <div className="form-row">
        <label>Tegelane</label>
        <select value={suspectId} onChange={e => setSuspectId(e.target.value)}>
          {gameCase.suspects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="form-row">
        <label>Asukoht</label>
        <select value={locationId} onChange={e => setLocationId(e.target.value)}>
          {gameCase.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>
      <div className="form-row">
        <label>Ese</label>
        <select value={itemId} onChange={e => setItemId(e.target.value)}>
          {gameCase.items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>
      <div className="accusation-actions">
        <button type="submit" className="btn-primary">Edasi →</button>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Tühista</button>
      </div>
    </form>
  )
}
