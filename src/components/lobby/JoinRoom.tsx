import { useState } from 'react'
import { joinGame } from '../../api/gameApi'

interface Props {
  onBack: () => void
  onJoined: (session: { gameId: string; playerId: string; roomCode: string }) => void
}

export function JoinRoom({ onBack, onJoined }: Props) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim() || !name.trim()) return
    setLoading(true)
    setError(null)
    try {
      const session = await joinGame(code.trim(), name.trim())
      onJoined(session)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Viga')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lobby-screen">
      <button className="btn-back" onClick={onBack}>← Tagasi</button>
      <h2>Liitu mängutoaga</h2>
      <p className="lobby-sub">Küsi ruumikood sõbralt, kes toa lõi.</p>
      <form className="lobby-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Ruumikood</label>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="nt. ABCD"
            maxLength={4}
            autoFocus
            style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}
          />
        </div>
        <div className="form-row">
          <label>Sinu nimi</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Mängija nimi"
            maxLength={20}
          />
        </div>
        {error && <p className="lobby-error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading || !code.trim() || !name.trim()}>
          {loading ? 'Liitun…' : 'Liitu'}
        </button>
      </form>
    </div>
  )
}
